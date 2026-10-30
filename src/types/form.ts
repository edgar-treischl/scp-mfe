/**
 * Form-related type definitions
 * Centralized location for all form data structures
 */

import type { RouteValue } from '../constants/routes';

/**
 * Represents a single question/goal module in the form
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

/**
 * Represents a single measure/action module in the form
 */
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
 * Props for form editor component
 */
export interface FormEditorProps {
  onNavigate: (view: RouteValue, submissionId?: string) => void;
  submissionId?: string;
  parentView?: 'new';
  showLoadDraft?: boolean;
}

/**
 * All supported view types in the application
 */
export type ViewType = RouteValue;
