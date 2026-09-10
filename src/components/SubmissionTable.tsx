import { StatusBadge } from './StatusBadge';
import type { Submission } from '../types';

interface SubmissionTableProps {
  submissions: Submission[];
  onViewSubmission: (schulnummer: string) => void;
  onEditSubmission: (schulnummer: string) => void;
  onEvalSubmission?: (schulnummer: string) => void;
  editButtonLabel?: string;
  showEditButton?: (status: string) => boolean;
  showEvalButton?: (status: string) => boolean;
}

export function SubmissionTable({
  submissions,
  onViewSubmission,
  onEditSubmission,
  onEvalSubmission,
  editButtonLabel = 'Bearbeiten',
  showEditButton = (status) => status === 'draft',
  showEvalButton = () => false,
}: SubmissionTableProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
          <th style={{ padding: '0.75rem' }}>Schulnummer</th>
          <th style={{ padding: '0.75rem' }}>Titel</th>
          <th style={{ padding: '0.75rem' }}>Status</th>
          <th style={{ padding: '0.75rem' }}>Erstellt</th>
          <th style={{ padding: '0.75rem' }}>Aktualisiert</th>
          <th style={{ padding: '0.75rem' }}>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((submission) => (
          <tr key={submission.schulnummer} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.9em' }}>
              {submission.schulnummer}
            </td>
            <td style={{ padding: '0.75rem' }}>
              <button
                onClick={() => onViewSubmission(submission.schulnummer)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1E8AD9ff',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  padding: 0,
                  textAlign: 'left',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                {(submission.data.title as string) || 'Untitled'}
              </button>
            </td>
            <td style={{ padding: '0.75rem' }}>
              <StatusBadge status={submission.status} />
            </td>
            <td style={{ padding: '0.75rem', fontSize: '0.9em', color: '#666' }}>
              {formatDate(submission.createdAt)}
            </td>
            <td style={{ padding: '0.75rem', fontSize: '0.9em', color: '#666' }}>
              {formatDate(submission.updatedAt)}
            </td>
            <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
              {showEditButton(submission.status) ? (
                <button
                  onClick={() => onEditSubmission(submission.schulnummer)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    background: '#64d4c6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#4ab9ab';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#64d4c6';
                  }}
                >
                  {editButtonLabel}
                </button>
              ) : null}
              {showEvalButton(submission.status) && onEvalSubmission ? (
                <button
                  onClick={() => onEvalSubmission(submission.schulnummer)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    background: '#1E8AD9',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#1565A0';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#1E8AD9';
                  }}
                >
                  Bilanzierung
                </button>
              ) : null}
              {!showEditButton(submission.status) && !showEvalButton(submission.status) ? (
                <span style={{ color: '#999', fontSize: '0.85rem' }}>-</span>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
