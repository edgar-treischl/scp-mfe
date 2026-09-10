import { useState } from 'react';
import { formStyles, colors } from './formStyles';

interface FeedbackModalProps {
  schoolName: string;
  schoolLead: string;
  samt: string;
  onClose?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onSendFeedback?: (feedback: string) => void;
}

const modalStyles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '3rem',
    maxWidth: '700px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    animation: 'slideIn 0.3s ease',
    position: 'relative' as const,
  },
  closeButton: {
    position: 'absolute' as const,
    top: '1.5rem',
    right: '1.5rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: colors.textMuted,
    padding: '0.5rem',
    transition: 'color 0.2s ease',
  },
  timestamp: {
    fontSize: '0.9rem',
    color: colors.textMuted,
    marginBottom: '1.5rem',
    fontStyle: 'italic' as const,
  },
  section: {
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: `1px solid ${colors.borderLight}`,
  },
  lastSection: {
    marginBottom: '2rem',
    paddingBottom: '0',
    borderBottom: 'none',
  },
  feedbackLabel: {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '0.75rem',
  },
  feedbackTextarea: {
    width: '100%',
    padding: '1rem',
    borderRadius: '4px',
    border: `1px solid ${colors.borderLight}`,
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    minHeight: '120px',
    resize: 'vertical' as const,
  },
  buttonGroup: {
    display: 'flex' as const,
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '2rem',
    flexWrap: 'wrap' as const,
  },
  approveButton: {
    ...formStyles.button_primary,
    padding: '0.75rem 1.5rem',
    backgroundColor: '#10b981',
  },
  rejectButton: {
    ...formStyles.button_secondary,
    padding: '0.75rem 1.5rem',
    color: '#dc2626',
    borderColor: '#dc2626',
  },
  feedbackButton: {
    ...formStyles.button_secondary,
    padding: '0.75rem 1.5rem',
  },
  cancelButton: {
    ...formStyles.button_secondary,
    padding: '0.75rem 1.5rem',
  },
};

export function FeedbackModal({
  schoolName,
  schoolLead,
  samt,
  onClose,
  onApprove,
  onReject,
  onSendFeedback,
}: FeedbackModalProps) {
  const [feedbackText, setFeedbackText] = useState('');

  const currentTime = new Date().toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const handleSendFeedback = () => {
    if (feedbackText.trim()) {
      onSendFeedback?.(feedbackText);
      setFeedbackText('');
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <button
            style={modalStyles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        )}

        <h2 style={formStyles.contractTitle}>
          Zielvereinbarung zur Überprüfung
        </h2>

        {/* School Information Section */}
        <div style={modalStyles.section}>
          <p style={{ marginTop: 0, marginBottom: '1.5rem' }}>
            Eingereicht von <span style={formStyles.contractValue}>{schoolLead}</span> der{' '}
            <span style={formStyles.contractValue}>{schoolName}</span>.
          </p>
          <p style={{ marginTop: 0, marginBottom: '0rem' }}>
            Schulamt: <span style={formStyles.contractValue}>{samt}</span>
          </p>
        </div>

        {/* Submission Timestamp */}
        <div style={modalStyles.timestamp}>
          Eingereicht am: {currentTime}
        </div>

        {/* Feedback Section */}
        <div style={modalStyles.section}>
          <label style={modalStyles.feedbackLabel}>
            Rückmeldung zur Zielvereinbarung:
          </label>
          <textarea
            style={modalStyles.feedbackTextarea}
            placeholder="Geben Sie Ihre Rückmeldung, Kommentare oder Verbesserungsvorschläge ein..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div style={modalStyles.lastSection}>
          <div style={modalStyles.buttonGroup}>
            {onClose && (
              <button
                type="button"
                style={modalStyles.cancelButton}
                onClick={onClose}
              >
                Abbrechen
              </button>
            )}
            {onSendFeedback && (
              <button
                type="button"
                style={modalStyles.feedbackButton}
                onClick={handleSendFeedback}
                disabled={!feedbackText.trim()}
              >
                Rückmeldung senden
              </button>
            )}
            {onReject && (
              <button
                type="button"
                style={modalStyles.rejectButton}
                onClick={onReject}
              >
                Ablehnen
              </button>
            )}
            {onApprove && (
              <button
                type="button"
                style={modalStyles.approveButton}
                onClick={onApprove}
              >
                Genehmigen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
