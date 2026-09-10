import { Breadcrumb, SubmissionTable } from '../components';
import type { Submission } from '../types';

interface SchuleHistoryProps {
  onNavigate: (view: 'landing' | 'form' | 'history' | 'view' | 'about' | 'eval', submissionId?: string) => void;
}

// Self-contained mock data: Only school 0001's submissions
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
    schulnummer: '0001',
    owner: 'maria.schmidt@organisation.de',
    status: 'approved',
    createdAt: new Date('2025-07-15T10:30:00'),
    updatedAt: new Date('2025-07-15T14:20:00'),
    submittedAt: new Date('2025-07-15T14:20:00'),
    data: {
      title: 'Zielvereinbarung 2025',
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
];

export function SchuleHistory({ onNavigate }: SchuleHistoryProps) {
  const mockSubmissions: Submission[] = MOCK_SUBMISSIONS;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <Breadcrumb 
        items={[
          { label: 'Start', onClick: () => onNavigate('landing') },
          { label: 'Zielvereinbarungen' }
        ]}
      />
      
      <header>
        <h1>Zielvereinbarungen verwalten</h1>
      </header>

      <div style={{ marginTop: '2rem' }}>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          {mockSubmissions.length} Einreichung{mockSubmissions.length !== 1 ? 'en' : ''} gefunden
        </p>

        <SubmissionTable
          submissions={mockSubmissions}
          onViewSubmission={(schulnummer) => onNavigate('view', schulnummer)}
          onEditSubmission={(schulnummer) => onNavigate('form', schulnummer)}
          editButtonLabel="Bearbeiten"
          showEditButton={(status) => status === 'draft' || status === 'changes_requested'}
        />
      </div>
    </div>
  );
}
