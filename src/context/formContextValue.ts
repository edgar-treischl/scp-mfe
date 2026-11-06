import { createContext, useContext } from 'react';
import type { Comment, Submission, ShellContext } from '../types';

export type Role = 'schule' | 'schulamt';
// Maps the shell's active role to the app role; admin starts as schule (selector available)
export function roleFromShell(shellContext?: ShellContext): Role {
  if (!shellContext) return 'schule';
  switch (shellContext.activeRole) {
    case 'schulamt':
      return 'schulamt';
    case 'schule':
    case 'admin':
      return 'schule';
    default:
      throw new Error(`Unsupported shell role: ${shellContext.activeRole}`);
  }
}

export type SubmissionStatus = 'draft' | 'pending_review' | 'approved' | 'changes_requested';
export type FieldMode = 'edit' | 'review' | 'readonly';

export interface FormContextType {
  role: Role;
  setRole: (role: Role) => void;
  submission: Submission | null;
  setSubmission: (submission: Submission | null) => void;
  loadSubmission: (id: string) => Promise<void>;
  updateSubmissionStatus: (status: SubmissionStatus) => Promise<void>;
  comments: Record<string, Comment>;
  saveFieldComment: (fieldPath: string, text: string) => Promise<void>;
  getFieldMode: () => FieldMode;
  isLoading: boolean;
}

export const FormContext = createContext<FormContextType | undefined>(undefined);

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormContextProvider');
  }
  return context;
}
