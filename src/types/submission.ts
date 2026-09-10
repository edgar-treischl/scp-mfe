export type SubmissionStatus = 'draft' | 'pending_review' | 'approved' | 'changes_requested';

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

export interface FormData {
  title?: string;
  istStandAnalyse: string;
  supportPersonnel: boolean;
  supportTypes: string[];
  supportOtherText: string;
  dataSources: string[];
  selectedGoal: string;
  questionModules: QuestionModule[];
  measureModules: MeasureModule[];
  evaluationDate: string;
  bilanzierungDate: string;
}

export interface Submission {
  schulnummer: string;
  owner: string;
  status: SubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  data: FormData;
}

export interface Comment {
  id: string;
  submissionId: string;
  fieldPath: string | null;
  text: string;
  author: string;
  authorRole: 'Schule' | 'Schulaufsicht';
  createdAt: Date;
  resolved: boolean;
}
