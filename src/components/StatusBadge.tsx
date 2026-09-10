import type { SubmissionStatus } from '../types';

interface StatusBadgeProps {
  status: SubmissionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = status === 'draft' 
    ? { background: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7' }
    : { background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' };

  return (
    <span style={{
      padding: '0.25rem 0.75rem',
      borderRadius: '12px',
      fontSize: '0.85em',
      fontWeight: '500',
      display: 'inline-block',
      ...styles
    }}>
      {status === 'draft' ? 'Entwurf' : 'Eingereicht'}
    </span>
  );
}
