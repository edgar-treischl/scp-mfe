import type { Submission } from '../types';

/**
 * Form module types extracted from FormEditor
 * These should eventually be moved to src/types/form.ts
 */
export interface QuestionModule {
  id: string;
  smartGoal: string;
  targetGroup: string[];
  targetGroupOther: string;
  subject: string[];
  subjectOther: string;
  dataSources: string[];
  dataSourcesOther: string;
  startDate: string;
  endDate: string;
  comments: string;
}

export interface MeasureModule {
  id: string;
  description: string;
  type: string;
  responsible: string;
  involved: string[];
  resources: string[];
  resourcesDescription: string;
  workMethod: string[];
  workMethodDescription: string;
  deadline: string;
}

/**
 * Mock draft submission for testing/development
 */
export const mockDraft: Submission | null = {
  schulnummer: '0001',
  owner: 'maria.schmidt@organisation.de',
  status: 'draft',
  createdAt: new Date('2026-07-28T09:15:00'),
  updatedAt: new Date('2026-07-28T09:45:00'),
  data: {
    title: 'Zielvereinbarung 2026',
    istStandAnalyse: 'Die bisherigen Entwicklungen deuten auf Erfolge bei der Sprachförderung hin. Neue Herausforderungen entstehen in der digitalen Transformation und gezielten Förderung.',
    supportPersonnel: true,
    supportTypes: ['SEM', 'Schulpsychologe'],
    supportOtherText: '',
    dataSources: ['Schulstatistiken (z. B. ASV/ASD)', 'Feedbackfragebögen'],
    selectedGoal: 'Gesteigerte Umsetzung der Chancengerechtigkeit insbesondere im Bereich der Zusammenarbeit mit Eltern und Erziehungsberechtigten.',
    questionModules: [
      {
        id: crypto.randomUUID(),
        smartGoal: 'Erhöhung der Elternbeteiligung um 40%.',
        targetGroup: ['Eltern', 'Erziehungsberechtigte'],
        targetGroupOther: '',
        subject: ['Schulentwicklung', 'Elternarbeit'],
        subjectOther: '',
        dataSources: ['Feedbackfragebögen'],
        dataSourcesOther: 'Teilnahmequoten bei Veranstaltungen',
        startDate: '2026-08-01',
        endDate: '2026-12-31',
        comments: '',
      },
    ],
    measureModules: [
      {
        id: crypto.randomUUID(),
        description: 'Durchführung von monatlichen Eltern-Sprechstunden.',
        type: 'Schulentwicklung',
        responsible: 'Schulleiter',
        involved: ['Schulpsychologe'],
        resources: ['Räumlichkeiten', 'Moderationshonorare'],
        resourcesDescription: 'Budget: ca. 5.000€',
        workMethod: ['Beratungsgespräche', 'Kultursensible Kommunikation'],
        workMethodDescription: 'Regelmäßige Austauschtreffen',
        deadline: '2026-08-15',
      },
    ],
    evaluationDate: '2027-03-31',
    bilanzierungDate: '2027-06-30',
  },
};

/**
 * Mock submitted submission for testing/development
 */
export const mockSubmitted: Submission | null = {
  schulnummer: '0001',
  owner: 'maria.schmidt@organisation.de',
  status: 'pending_review',
  createdAt: new Date('2026-06-15T10:30:00'),
  updatedAt: new Date('2026-07-20T14:20:00'),
  submittedAt: new Date('2026-07-20T14:20:00'),
  data: {
    title: 'Zielvereinbarung 2026 - Sprachförderung & Chancengerechtigkeit',
    istStandAnalyse: 'Gute Erfolge bei der Sprachförderung. Neuer Fokus auf interkulturelle Schulentwicklung.',
    supportPersonnel: true,
    supportTypes: ['SEM', 'Schulpsychologe'],
    supportOtherText: 'Interkulturelle Beratung',
    dataSources: ['Schulstatistiken', 'Feedbackfragebögen'],
    selectedGoal: 'Gesteigerte Umsetzung der Chancengerechtigkeit insbesondere im Bereich der Zusammenarbeit mit Eltern und Erziehungsberechtigten.',
    questionModules: [
      {
        id: crypto.randomUUID(),
        smartGoal: 'Erhöhung der Elternbeteiligung um 40% bis Q3 2026.',
        targetGroup: ['Eltern', 'Erziehungsberechtigte'],
        targetGroupOther: '',
        subject: ['Schulentwicklung'],
        subjectOther: '',
        dataSources: ['Feedbackfragebögen'],
        dataSourcesOther: '',
        startDate: '2026-08-01',
        endDate: '2026-12-31',
        comments: '',
      },
    ],
    measureModules: [
      {
        id: crypto.randomUUID(),
        description: 'Monatliche Eltern-Sprechstunden mit interkultureller Moderation.',
        type: 'Schulentwicklung',
        responsible: 'Schulleiter',
        involved: ['Interkulturelle Trainerin'],
        resources: ['Räumlichkeiten', 'Moderationshonorare'],
        resourcesDescription: 'Budget: 5.000€',
        workMethod: ['Beratungsgespräche'],
        workMethodDescription: 'Kultursensible Kommunikation',
        deadline: '2026-08-15',
      },
    ],
    evaluationDate: '2027-03-31',
    bilanzierungDate: '2027-06-30',
  },
};
