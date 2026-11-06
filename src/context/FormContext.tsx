import { useCallback, useState, useEffect, type ReactNode } from 'react';
import { getCommentsForSubmission, getSubmission, saveComment, saveSubmission } from '../utils/database';
import { FormContext, roleFromShell, type FieldMode, type Role, type SubmissionStatus } from './formContextValue';
import type { Comment, Submission, ShellContext } from '../types';

export function FormContextProvider({
  children,
  shellContext,
}: {
  children: ReactNode;
  shellContext?: ShellContext;
}) {
  const [initError, setInitError] = useState<Error | null>(null);
  const [role, setRole] = useState<Role>('schule');

  useEffect(() => {
    try {
      const newRole = roleFromShell(shellContext);
      setRole(newRole);
    } catch (error) {
      setInitError(error instanceof Error ? error : new Error('Unknown initialization error'));
    }
  }, [shellContext?.activeRole]);

  if (initError) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f5f5f5',
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          textAlign: 'center',
        }}>
          <h1 style={{ color: '#d32f2f', marginBottom: '16px' }}>Konfigurationsfehler</h1>
          <p style={{ color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>
            Die App konnte nicht initialisiert werden. Die von der Shell-Anwendung übergebene Benutzerrolle wird nicht unterstützt.
          </p>
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '24px', fontFamily: 'monospace' }}>
            {initError.message}
          </p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Bitte kontaktieren Sie den technischen Support oder versuchen Sie, sich erneut anzumelden.
          </p>
        </div>
      </div>
    );
  }

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [comments, setComments] = useState<Record<string, Comment>>({});
  const [isLoading, setIsLoading] = useState(false);

  const getFieldMode = (): FieldMode => {
    if (!submission) return 'edit';

    // schule logic
    if (role === 'schule') {
      if (submission.status === 'draft' || submission.status === 'changes_requested') {
        return 'edit';
      }
      if (submission.status === 'pending_review') {
        return 'readonly';
      }
    }

    // schulamt logic
    if (role === 'schulamt') {
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
      author: role === 'schulamt' ? 'Schulaufsicht' : submission.owner,
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
