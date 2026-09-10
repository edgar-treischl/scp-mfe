import initSqlJs, { type Database, type SqlValue } from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import type { Comment, Submission } from '../types';

type Row = Record<string, SqlValue>;

let db: Database | null = null;

async function initDB(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({ locateFile: () => sqlWasmUrl });
  db = new SQL.Database();

  // Create schema - need to assert db is defined after assignment
  const database = db;
  if (!database) throw new Error('Failed to initialize database');

  database.run(`
    CREATE TABLE IF NOT EXISTS submissions (
      schulnummer TEXT PRIMARY KEY,
      status TEXT CHECK(status IN ('draft', 'pending_review', 'approved', 'changes_requested')),
      data TEXT NOT NULL,
      createdAt TEXT,
      updatedAt TEXT,
      createdBy TEXT,
      version INTEGER DEFAULT 1
    );
  `);

  database.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      submissionId TEXT NOT NULL,
      fieldPath TEXT,
      text TEXT,
      author TEXT,
      authorRole TEXT CHECK(authorRole IN ('Schule', 'Schulaufsicht')),
      createdAt TEXT,
      resolved BOOLEAN DEFAULT 0,
      FOREIGN KEY (submissionId) REFERENCES submissions(schulnummer) ON DELETE CASCADE
    );
  `);

  return database;
}

export async function getDB(): Promise<Database> {
  if (!db) {
    await initDB();
  }
  return db!;
}

export async function initializeWithMockData(): Promise<void> {
  const database = await getDB();
  
  // Check if mock data already loaded
  const result = database.exec(`SELECT COUNT(*) as count FROM submissions`);
  const count = result.length > 0 && result[0].values.length > 0 
    ? Number(result[0].values[0][0]) 
    : 0;
  
  if (count > 0) {
    return; // Already initialized
  }

  // Mock submission data for school 0001 - draft status (the one that will be edited)
  const mockDraft = {
    schulnummer: '0001',
    status: 'draft' as const,
    data: {
      title: 'Zielvereinbarung 2026',
      istStandAnalyse: 'Die Evaluation des Vorjahres zeigt positive Fortschritte in der Teamzusammenarbeit und ein gestärktes Wellbeing-Bewusstsein. Herausforderungen bestehen in der digitalen Transformation der Unterrichtsprozesse und in der gezielten Förderung von Schülerinnen und Schülern mit Förderbedarf.',
      supportPersonnel: true,
      supportTypes: ['SEM', 'BDA'],
      supportOtherText: '',
      dataSources: ['Schulstatistiken (z. B. ASV/ASD)', 'Zentrale Lernstandserhebungen (z. B. VERA, BYLES, Lernstand 5, Orientierungsarbeiten)'],
      questionModules: [
        {
          id: '1',
          smartGoal: 'Steigerung der Deutsch-Kompetenzwerte um mindestens 15% bei 80% der Schülerinnen und Schüler der Klasse 4.',
          targetGroup: ['Alle Schülerinnen und Schüler', '4. Jahrgangsstufe'],
          targetGroupOther: '',
          subject: ['Deutsch', 'Sprachförderung'],
          subjectOther: '',
          dataSources: ['Zentrale Lernstandserhebungen (z. B. VERA, BYLES, Lernstand 5, Orientierungsarbeiten)'],
          dataSourcesOther: '',
          startDate: '2025-08-01',
          endDate: '2025-12-31',
          comments: 'Differenzierte Förderung mit Unterstützung durch Schulpsychologe und SEM.',
        },
      ],
      measureModules: [
        {
          id: '1',
          description: 'Wöchentliche Deutsch-Förderblöcke für Schülerinnen und Schüler mit Lernrückständen.',
          type: 'Unterricht/Förderung',
          responsible: 'Deutschlehrkräfte',
          involved: ['Schulpsychologe', 'SEM'],
          resources: ['2h/Woche Förderzeit', 'Differenziertes Material'],
          resourcesDescription: 'Budget für Material: ca. 500€',
          workMethod: ['Kleingruppen-Förderung', 'Individuelle Lernpläne'],
          workMethodDescription: 'Wöchentliche Koordinationstreffen zur Abstimmung',
          deadline: '2025-08-15',
        },
      ],
      selectedGoal: 'Erhöhte Anzahl an Schülerinnen und Schülern erreichen mithilfe entsprechender Basiskompetenzen die Mindeststandards in Deutsch.',
      evaluationDate: '2026-03-31',
      bilanzierungDate: '2026-06-30',
    },
    createdAt: new Date('2026-07-15T10:30:00'),
    updatedAt: new Date('2026-07-15T14:20:00'),
    createdBy: 'maria.schmidt@organisation.de',
  };

  await saveSubmission(mockDraft);
}


export async function saveSubmission(submission: {
  schulnummer: string;
  status: 'draft' | 'pending_review' | 'approved' | 'changes_requested';
  data: Submission['data'];
  createdAt: Date;
  updatedAt: Date;
  owner?: string;
  createdBy?: string;
  version?: number;
}): Promise<void> {
  const database = await getDB();

  database.run(
    `INSERT OR REPLACE INTO submissions (schulnummer, status, data, createdAt, updatedAt, createdBy, version)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      submission.schulnummer,
      submission.status,
      JSON.stringify(submission.data),
      submission.createdAt.toISOString(),
      submission.updatedAt.toISOString(),
      submission.createdBy || submission.owner || 'unknown',
      submission.version || 1,
    ]
  );
}

export async function getSubmission(schulnummer: string): Promise<Submission | null> {
  const database = await getDB();

  const result = database.exec(
    `SELECT * FROM submissions WHERE schulnummer = ?`,
    [schulnummer]
  );

  if (result.length === 0 || result[0].values.length === 0) {
    return null;
  }

  const row = result[0].values[0];
  const columns = result[0].columns;

  const submission: Row = {};
  columns.forEach((col, idx) => {
    submission[col] = row[idx];
  });

  return {
    schulnummer: String(submission.schulnummer),
    owner: String(submission.createdBy ?? ''),
    status: submission.status as Submission['status'],
    data: JSON.parse(String(submission.data)),
    createdAt: new Date(String(submission.createdAt)),
    updatedAt: new Date(String(submission.updatedAt)),
  };
}

export async function saveComment(comment: {
  id: string;
  submissionId: string;
  fieldPath: string | null;
  text: string;
  author: string;
  authorRole: 'Schule' | 'Schulaufsicht';
  createdAt: Date;
}): Promise<void> {
  const database = await getDB();

  database.run(
    `INSERT OR REPLACE INTO comments (id, submissionId, fieldPath, text, author, authorRole, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      comment.id,
      comment.submissionId,
      comment.fieldPath || null,
      comment.text,
      comment.author,
      comment.authorRole,
      comment.createdAt.toISOString(),
    ]
  );
}

export async function getCommentsForSubmission(submissionId: string): Promise<Comment[]> {
  const database = await getDB();

  const result = database.exec(
    `SELECT * FROM comments WHERE submissionId = ? ORDER BY createdAt DESC`,
    [submissionId]
  );

  if (result.length === 0 || result[0].values.length === 0) {
    return [];
  }

  const columns = result[0].columns;
  return result[0].values.map((row) => {
    const comment: Row = {};
    columns.forEach((col, idx) => {
      comment[col] = row[idx];
    });
    return toComment(comment);
  });
}

export async function getCommentForField(
  submissionId: string,
  fieldPath: string
): Promise<Comment | null> {
  const database = await getDB();

  const result = database.exec(
    `SELECT * FROM comments WHERE submissionId = ? AND fieldPath = ? LIMIT 1`,
    [submissionId, fieldPath]
  );

  if (result.length === 0 || result[0].values.length === 0) {
    return null;
  }

  const row = result[0].values[0];
  const columns = result[0].columns;

  const comment: Row = {};
  columns.forEach((col, idx) => {
    comment[col] = row[idx];
  });

  return toComment(comment);
}

function toComment(row: Row): Comment {
  return {
    id: String(row.id),
    submissionId: String(row.submissionId),
    fieldPath: row.fieldPath === null ? null : String(row.fieldPath),
    text: String(row.text ?? ''),
    author: String(row.author ?? ''),
    authorRole: row.authorRole as Comment['authorRole'],
    createdAt: new Date(String(row.createdAt)),
    resolved: Boolean(row.resolved),
  };
}
