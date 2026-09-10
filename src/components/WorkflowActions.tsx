import { useFormContext } from '../context/formContextValue';

export function WorkflowActions(): React.ReactNode {
  const { role, submission, updateSubmissionStatus } = useFormContext();

  if (!submission) return null;

  const handleSubmitForReview = async () => {
    if (confirm('Absenden zur Überprüfung? Sie können die Zielvereinbarung danach nicht mehr bearbeiten, bis die Schulaufsicht Änderungen verlangt.')) {
      await updateSubmissionStatus('pending_review');
    }
  };

  const handleApprove = async () => {
    if (confirm('Zielvereinbarung genehmigen?')) {
      await updateSubmissionStatus('approved');
    }
  };

  const handleRequestChanges = async () => {
    if (confirm('Änderungen verlangen? Die Schule kann dann die Zielvereinbarung überarbeiten.')) {
      await updateSubmissionStatus('changes_requested');
    }
  };

  const handleResubmit = async () => {
    if (confirm('Überarbeitete Zielvereinbarung erneut einreichen?')) {
      await updateSubmissionStatus('pending_review');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.75rem',
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        flexWrap: 'wrap',
      }}
    >
      {/* Schule Actions */}
      {role === 'Schule' && submission.status === 'draft' && (
        <button
          onClick={handleSubmitForReview}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            background: '#1E8AD9',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#157aba';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1E8AD9';
          }}
        >
          Zur Überprüfung absenden
        </button>
      )}

      {role === 'Schule' && submission.status === 'changes_requested' && (
        <button
          onClick={handleResubmit}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            background: '#1E8AD9',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#157aba';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1E8AD9';
          }}
        >
          Überarbeitete Version einreichen
        </button>
      )}

      {/* Schulaufsicht Actions */}
      {role === 'Schulaufsicht' && submission.status === 'pending_review' && (
        <>
          <button
            onClick={handleApprove}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              background: '#64D4C6',
              color: '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4cc4b8';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#64D4C6';
            }}
          >
            ✓ Genehmigen
          </button>
          <button
            onClick={handleRequestChanges}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              background: '#ffc107',
              color: '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#e6b000';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ffc107';
            }}
          >
            ↻ Änderungen verlangen
          </button>
        </>
      )}

      {/* Status Display */}
      <div
        style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.95rem',
          fontWeight: '500',
          color: '#666',
        }}
      >
        <span>Status:</span>
        <span
          style={{
            padding: '0.4rem 0.75rem',
            borderRadius: '3px',
            backgroundColor:
              submission.status === 'draft'
                ? '#e7f3ff'
                : submission.status === 'pending_review'
                  ? '#fff8dc'
                  : submission.status === 'approved'
                    ? '#e6f7f3'
                    : '#ffe6e6',
            color:
              submission.status === 'draft'
                ? '#1E8AD9'
                : submission.status === 'pending_review'
                  ? '#ff8c00'
                  : submission.status === 'approved'
                    ? '#64D4C6'
                    : '#dc3545',
            fontWeight: '500',
          }}
        >
          {submission.status === 'draft'
            ? 'Entwurf'
            : submission.status === 'pending_review'
              ? 'Zur Überprüfung eingereicht'
              : submission.status === 'approved'
                ? 'Genehmigt'
                : 'Änderungen verlangt'}
        </span>
      </div>
    </div>
  );
}
