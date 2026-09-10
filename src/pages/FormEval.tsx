import { useState, useEffect } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { FormCallout } from '../components/form_callout';
import { FormEvaluation } from '../components/form_evaluation';
import { useFormContext } from '../context/formContextValue';

interface FormEvalProps {
  submissionId?: string;
  onNavigate: (view: 'landing' | 'form' | 'history' | 'view' | 'about' | 'eval' | 'new' | 'all', submissionId?: string) => void;
}

export function FormEval({ submissionId, onNavigate }: FormEvalProps) {
  const { loadSubmission, submission } = useFormContext();
  const [evaluationDate, setEvaluationDate] = useState('');
  const [bilanzierungDate, setBilanzierungDate] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Load submission when submissionId changes
  useEffect(() => {
    if (submissionId) {
      void loadSubmission(submissionId);
    }
  }, [submissionId, loadSubmission]);

  const handleEvaluationDateChange = (date: string) => {
    setEvaluationDate(date);
  };

  const handleBilanzierungDateChange = (date: string) => {
    setBilanzierungDate(date);
  };

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleFileRemove = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    alert('Evaluierung eingereicht! (Mock - kein Backend)');
    if (submissionId) {
      onNavigate('view', submissionId);
    } else {
      onNavigate('landing');
    }
  };

  const colors = {
    primary: '#1E8AD9',
    success: '#64D4C6',
    danger: '#dc3545',
    warning: '#ffc107',
    neutral: '#f8f9fa',
    border: '#dee2e6',
    text: '#212529',
    textMuted: '#6c757d',
    disabled: '#e9ecef',
  };

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem 1rem',
    } as const,
    header: {
      marginBottom: '2rem',
      paddingBottom: '1.5rem',
    } as const,
    header_title: {
      fontSize: '2rem',
      fontWeight: '600' as const,
      lineHeight: '1.25',
      color: colors.text,
      margin: 0,
      marginBottom: '0.5rem',
    } as const,
    button: {
      padding: '0.65rem 1.5rem',
      fontSize: '0.95rem',
      fontWeight: '500' as const,
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: colors.primary,
      color: 'white',
    } as const,
    button_secondary: {
      background: colors.neutral,
      color: colors.text,
      border: `1px solid ${colors.border}`,
    } as const,
    footer: {
      display: 'flex' as const,
      gap: '1rem',
      justifyContent: 'space-between',
      marginTop: '2rem',
      paddingTop: '2rem',
      borderTop: `1px solid ${colors.border}`,
    } as const,
    button_back: {
      background: colors.neutral,
      color: colors.text,
      border: `1px solid ${colors.border}`,
    } as const,
  };

  const breadcrumbItems = [
    { label: 'Home', onClick: () => onNavigate('landing') },
    { label: 'Alle Einreichungen', onClick: () => onNavigate('all') },
    ...(submissionId ? [{ label: submissionId, onClick: () => onNavigate('view', submissionId) }] : []),
    { label: 'Bewertung schreiben' },
  ];

  return (
    <div style={styles.container}>
      <Breadcrumb items={breadcrumbItems} />
      <header style={styles.header}>
        <h1 style={styles.header_title}>Bewertung schreiben</h1>
        {submission && (
          <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>
            Schulnummer: {submission.schulnummer}
          </p>
        )}
      </header>

      {/* Evaluation Form */}
      <FormEvaluation
        evaluationDate={evaluationDate}
        bilanzierungDate={bilanzierungDate}
        uploadedFiles={uploadedFiles}
        onEvaluationDateChange={handleEvaluationDateChange}
        onBilanzierungDateChange={handleBilanzierungDateChange}
        onFileUpload={handleFileUpload}
        onFileRemove={handleFileRemove}
      />

      {/* Callout */}
      <FormCallout
        title="Hinweis: Weitere Fragen zur Datengestützte Bilanzierung pro Teilziel"
        message="Das Formular zur Bilanzierung pro Teilziel ist nicht implementiert."
      />

      {/* Navigation Footer */}
      <footer style={styles.footer}>
        <button
          type="button"
          onClick={() => onNavigate('all')}
          style={{
            ...styles.button,
            ...styles.button_back,
          }}
        >
          ← Zurück
        </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            style={{
              ...styles.button,
              ...styles.button_secondary,
            }}
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              ...styles.button,
            }}
          >
            Senden ✓
          </button>
        </div>
      </footer>
    </div>
  );
}
