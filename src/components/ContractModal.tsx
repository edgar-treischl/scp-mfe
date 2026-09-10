import { formStyles, colors } from './formStyles';

interface ContractModalProps {
  schoolName: string;
  schoolLead: string;
  samt: string;
  programRep: string;
  onClose?: () => void;
  onSubmit?: () => void;
  submitted?: boolean;
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
    maxWidth: '600px',
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
  buttonGroup: {
    display: 'flex' as const,
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '2rem',
  },
  submitButton: {
    ...formStyles.button_primary,
    padding: '0.75rem 2rem',
  },
  cancelButton: {
    ...formStyles.button_secondary,
    padding: '0.75rem 2rem',
  },
};

export function ContractModal({
  schoolName,
  schoolLead,
  samt,
  programRep,
  onClose,
  onSubmit,
  submitted = false,
}: ContractModalProps) {
  const currentTime = new Date().toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  if (submitted) {
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
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '3.5rem',
              marginBottom: '1rem',
              lineHeight: 1
            }}>
              ❌
            </div>
            <h2 style={{
              ...formStyles.contractTitle,
              color: colors.success,
              marginBottom: '1rem'
            }}>
              Keine Zielvereinbarung erfolgreich eingereicht! Prototype
            </h2>
            <p style={{
              fontSize: '1rem',
              color: colors.textMuted,
              marginBottom: '1.5rem',
              lineHeight: '1.6'
            }}>
              Ihre Zielvereinbarung wurde nicht erfolgreich eingereicht und wird nicht vom Schulamt überprüft.
            </p>
          </div>

          <div style={modalStyles.buttonGroup}>
            {onSubmit && (
              <button
                type="button"
                style={modalStyles.submitButton}
                onClick={onSubmit}
              >
                Zur Startseite
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

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
          Neue Zielvereinbarung (ZV) im Startchancen-Programm nun einreichen:
        </h2>

        <div style={formStyles.contractPreview}>
          <p style={{ marginTop: 0, marginBottom: '1.5rem' }}>
            Zwischen <span style={formStyles.contractValue}>{schoolLead}</span> als Schulleitung der{' '}
            <span style={formStyles.contractValue}>{schoolName}</span>.
          </p>
          <p style={{ marginTop: 0, marginBottom: '1.5rem' }}>
            Und dem <span style={formStyles.contractValue}>{samt}</span>, vertreten durch{' '}
            <span style={formStyles.contractValue}>{programRep}</span>
          </p>
          <p style={{ marginTop: 0, marginBottom: '0rem' }}>
            Die Zielvereinbarung der folgenden Seiten wird verbindlich geschlossen.
          </p>
        </div>

        <div style={modalStyles.timestamp}>
          Zeitstempel: {currentTime}
        </div>

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
          {onSubmit && (
            <button
              type="button"
              style={modalStyles.submitButton}
              onClick={onSubmit}
            >
              Einreichen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
