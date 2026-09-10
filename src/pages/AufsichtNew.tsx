import { useEffect } from 'react';
import { Breadcrumb, SubmissionTable } from '../components';
import { saveSubmission } from '../utils/database';
import type { Submission } from '../types';

interface AufsichtNewProps {
  onNavigate: (view: 'landing' | 'form' | 'history' | 'view' | 'about' | 'eval' | 'new' | 'all', submissionId?: string) => void;
}

// Self-contained mock data: Multiple schools with draft submissions only
const MOCK_SUBMISSIONS: Submission[] = [
  {
    schulnummer: '0001',
    owner: 'maria.schmidt@organisation.de',
    status: 'draft',
    createdAt: new Date('2026-07-15T10:30:00'),
    updatedAt: new Date('2026-07-15T14:20:00'),
    submittedAt: new Date('2026-07-15T14:20:00'),
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
  },
  {
    schulnummer: '0002',
    owner: 'thomas.mueller@organisation.de',
    status: 'draft',
    createdAt: new Date('2026-08-01T11:00:00'),
    updatedAt: new Date('2026-08-15T13:30:00'),
    submittedAt: new Date('2026-08-15T13:30:00'),
    data: {
      title: 'Zielvereinbarung 2026 - Mathematik Fokus',
      istStandAnalyse: 'Schule zeigt Lücken in Mathematik-Grundlagen. Fokus auf individuelle Förderung und neue Lernmethoden.',
      supportPersonnel: true,
      supportTypes: ['SEM'],
      supportOtherText: '',
      dataSources: ['Schulstatistiken (z. B. ASV/ASD)'],
      questionModules: [
        {
          id: '1',
          smartGoal: 'Verbesserung der Mathematik-Fähigkeiten um 20%.',
          targetGroup: ['5. und 6. Jahrgangsstufe'],
          targetGroupOther: '',
          subject: ['Mathematik'],
          subjectOther: '',
          dataSources: ['Zentrale Lernstandserhebungen (z. B. VERA, BYLES, Lernstand 5, Orientierungsarbeiten)'],
          dataSourcesOther: '',
          startDate: '2026-09-01',
          endDate: '2026-12-31',
          comments: 'Einsatz von Diagnose-Verfahren.',
        },
      ],
      measureModules: [
        {
          id: '1',
          description: 'Kleingruppen-Förderung in Mathematik.',
          type: 'Unterricht/Förderung',
          responsible: 'Mathematiklehrkräfte',
          involved: ['SEM'],
          resources: ['Zusätzliche Stunden', 'Lernmaterial'],
          resourcesDescription: 'Budget: ca. 1500€',
          workMethod: ['Differenzierte Förderung'],
          workMethodDescription: 'Adaptive Lernpläne',
          deadline: '2026-09-15',
        },
      ],
      selectedGoal: 'Verbesserte Mathematik-Leistungen.',
      evaluationDate: '2027-03-31',
      bilanzierungDate: '2027-06-30',
    },
  },
  {
    schulnummer: '0004',
    owner: 'sophia.bauer@organisation.de',
    status: 'draft',
    createdAt: new Date('2026-08-18T08:45:00'),
    updatedAt: new Date('2026-08-25T10:20:00'),
    submittedAt: new Date('2026-08-25T10:20:00'),
    data: {
      title: 'Zielvereinbarung 2026 - Lesen & Schreiben',
      istStandAnalyse: 'Gute Grundlagen in der Lesekompetenz. Schwächen in der Schreibfähigkeit müssen adressiert werden.',
      supportPersonnel: true,
      supportTypes: ['BDA', 'Schulpsychologe'],
      supportOtherText: '',
      dataSources: ['Schulstatistiken (z. B. ASV/ASD)', 'Zentrale Lernstandserhebungen (z. B. VERA, BYLES, Lernstand 5, Orientierungsarbeiten)'],
      questionModules: [
        {
          id: '1',
          smartGoal: 'Steigerung der Schreibkompetenz um 30%.',
          targetGroup: ['3. Jahrgangsstufe'],
          targetGroupOther: '',
          subject: ['Deutsch', 'Schreiben'],
          subjectOther: '',
          dataSources: ['Zentrale Lernstandserhebungen (z. B. VERA, BYLES, Lernstand 5, Orientierungsarbeiten)'],
          dataSourcesOther: '',
          startDate: '2026-09-01',
          endDate: '2027-06-30',
          comments: 'Regelmäßiges Feedback und Übungen.',
        },
      ],
      measureModules: [
        {
          id: '1',
          description: 'Tägliche Schreib-Übungen im Unterricht.',
          type: 'Unterricht/Förderung',
          responsible: 'Deutschlehrkräfte',
          involved: ['Schulpsychologe'],
          resources: ['Schreibmaterial', 'Lehrkräfte-Zeit'],
          resourcesDescription: 'ca. 1000€',
          workMethod: ['Feedback', 'Übung'],
          workMethodDescription: 'Strukturierte Übungen mit individuellem Feedback',
          deadline: '2026-09-15',
        },
      ],
      selectedGoal: 'Erhöhte Schreibkompetenz in der 3. Jahrgangsstufe.',
      evaluationDate: '2027-03-31',
      bilanzierungDate: '2027-06-30',
    },
  },
];

export function AufsichtNew({ onNavigate }: AufsichtNewProps) {
  const mockSubmissions: Submission[] = MOCK_SUBMISSIONS;

  // Pre-populate database with mock submissions so FormEditor can load them
  useEffect(() => {
    const initializeMockData = async () => {
      for (const submission of MOCK_SUBMISSIONS) {
        try {
          await saveSubmission(submission);
        } catch (error) {
          console.warn(`Failed to save mock submission ${submission.schulnummer}:`, error);
        }
      }
    };
    void initializeMockData();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <Breadcrumb 
        items={[
          { label: 'Start', onClick: () => onNavigate('landing') },
          { label: 'Neue Einreichungen' }
        ]}
      />
      
      <header>
        <h1>Neue Zielvereinbarungen (Entwurf)</h1>
      </header>

      <div style={{ marginTop: '2rem' }}>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          {mockSubmissions.length} Einreichung{mockSubmissions.length !== 1 ? 'en' : ''} gefunden
        </p>

        <SubmissionTable
          submissions={mockSubmissions}
          onViewSubmission={(schulnummer) => onNavigate('view', schulnummer)}
          onEditSubmission={(schulnummer) => onNavigate('form', schulnummer)}
          editButtonLabel="Kommentarmodus öffnen"
          showEditButton={(status) => status === 'draft'}
        />
      </div>
    </div>
  );
}
