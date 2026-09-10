import { useCallback, useState, useEffect, type ReactNode } from 'react';
import { getCommentsForSubmission, getSubmission, saveComment, saveSubmission, initializeWithMockData } from '../utils/database';
import { FormContext, type FieldMode, type Role, type SubmissionStatus } from './formContextValue';
import type { Comment, Submission } from '../types';

export function FormContextProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('Schule');
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [comments, setComments] = useState<Record<string, Comment>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize database with mock data on mount
  useEffect(() => {
    void initializeWithMockData();
  }, []);

  const getFieldMode = (): FieldMode => {
    if (!submission) return 'edit';

    // Schule logic
    if (role === 'Schule') {
      if (submission.status === 'draft' || submission.status === 'changes_requested') {
        return 'edit';
      }
      if (submission.status === 'pending_review') {
        return 'readonly';
      }
    }

    // Schulaufsicht logic
    if (role === 'Schulaufsicht') {
      if (submission.status === 'pending_review' || submission.status === 'draft') {
        return 'review';
      }
      if (submission.status === 'approved' || submission.status === 'changes_requested') {
        return 'readonly';
      }
    }

    return 'readonly';
  };

  const loadSubmission = useCallback(async (schulnummer: string) => {
    setIsLoading(true);
    try {
      let loaded: Submission | null = null;
      let loadedComments: Comment[] = [];
      try {
        loaded = await getSubmission(schulnummer);
        loadedComments = await getCommentsForSubmission(schulnummer);
      } catch (error) {
        console.warn('Could not load submission from database', error);
      }

      setSubmission(loaded);
      setComments(
        Object.fromEntries(
          loadedComments
            .filter((comment) => comment.fieldPath !== null)
            .map((comment) => [comment.fieldPath as string, comment])
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveFieldComment = async (fieldPath: string, text: string) => {
    if (!submission) return;

    const trimmed = text.trim();
    const existing = comments[fieldPath];

    if (!trimmed) {
      setComments((prev) => {
        const next = { ...prev };
        delete next[fieldPath];
        return next;
      });
      return;
    }

    const comment: Comment = {
      id: existing?.id ?? crypto.randomUUID(),
      submissionId: submission.schulnummer,
      fieldPath,
      text: trimmed,
      author: role === 'Schulaufsicht' ? 'Schulaufsicht' : submission.owner,
      authorRole: role,
      createdAt: existing?.createdAt ?? new Date(),
      resolved: false,
    };

    setComments((prev) => ({ ...prev, [fieldPath]: comment }));

    try {
      await saveSubmission(submission);
      await saveComment(comment);
    } catch (error) {
      console.warn('Could not persist comment', error);
    }
  };

  const updateSubmissionStatus = async (status: SubmissionStatus) => {
    if (!submission) return;

    const updated: Submission = {
      ...submission,
      status,
      updatedAt: new Date(),
    };

    setSubmission(updated);
    try {
      await saveSubmission(updated);
    } catch (error) {
      console.warn('Could not persist submission status', error);
    }
  };

  return (
    <FormContext.Provider
      value={{
        role,
        setRole,
        submission,
        setSubmission,
        loadSubmission,
        updateSubmissionStatus,
        comments,
        saveFieldComment,
        getFieldMode,
        isLoading,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}
