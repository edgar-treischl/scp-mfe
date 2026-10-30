import type { FieldMode } from '../context/formContextValue';
import { formStyles, colors } from './formStyles';

interface FormEvaluationProps {
  evaluationDate: string;
  bilanzierungDate: string;
  uploadedFiles: File[];
  onEvaluationDateChange: (value: string) => void;
  onBilanzierungDateChange: (value: string) => void;
  onFileUpload: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  mode?: FieldMode;
}

export function FormEvaluation({
  evaluationDate,
  bilanzierungDate,
  uploadedFiles,
  onEvaluationDateChange,
  onBilanzierungDateChange,
  onFileUpload,
  onFileRemove,
  mode = 'edit',
}: FormEvaluationProps) {
  const disabled = mode !== 'edit';
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onFileUpload([...uploadedFiles, ...newFiles]);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div style={formStyles.section}>
      <h2 style={formStyles.section_title}>Bilanzierungsgespräch zur Internen Evaluation</h2>

      {/* Question 1: Evaluation Date */}
      <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <label htmlFor="evaluationDate" style={formStyles.label}>
          01. Datum der Evaluation
        </label>
        <input
          id="evaluationDate"
          type="date"
          value={evaluationDate}
          onChange={(e) => onEvaluationDateChange(e.target.value)}
          disabled={disabled}
          style={{ ...formStyles.input, opacity: disabled ? 0.6 : 1 }}
        />
      </div>

      <hr style={formStyles.hr} />

      {/* Question 2: Bilanzierungsgespräch Date */}
      <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <label htmlFor="bilanzierungDate" style={formStyles.label}>
          02. Datum des Bilanzierungsgesprächs mit der Schulaufsicht
        </label>
        <input
          id="bilanzierungDate"
          type="date"
          value={bilanzierungDate}
          onChange={(e) => onBilanzierungDateChange(e.target.value)}
          disabled={disabled}
          style={{ ...formStyles.input, opacity: disabled ? 0.6 : 1 }}
        />
      </div>

      <hr style={formStyles.hr} />

      {/* Question 3: Document Upload */}
      <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <label style={formStyles.label}>
          03. Upload der Dokumente
        </label>
        
        <div style={{
          border: `2px dashed ${colors.border}`,
          borderRadius: '6px',
          padding: '1.5rem',
          textAlign: 'center' as const,
          backgroundColor: disabled ? '#f0f0f0' : '#f9f9f9',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          marginBottom: '1rem',
          opacity: disabled ? 0.6 : 1,
        }}>
          <input
            type="file"
            multiple
            onChange={handleFileInputChange}
            disabled={disabled}
            style={{
              display: 'none',
            }}
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            style={{
              cursor: 'pointer',
              display: 'block',
              color: colors.primary,
              fontWeight: '500',
            }}
          >
            Dateien hier ablegen oder klicken zum Hochladen
          </label>
          <p style={{
            fontSize: '0.875rem',
            color: colors.textMuted,
            margin: '0.5rem 0 0 0',
          }}>
            PDF, Word, Excel? Was unterstützen wir?
          </p>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div style={{
            backgroundColor: '#f0f8ff',
            border: `1px solid ${colors.border}`,
            borderRadius: '4px',
            padding: '1rem',
          }}>
            <p style={{
              margin: '0 0 0.75rem 0',
              fontWeight: '500',
              color: colors.primary,
            }}>
              Hochgeladene Dateien ({uploadedFiles.length}):
            </p>
            <ul style={{
              margin: '0',
              paddingLeft: '1.25rem',
              listStyle: 'disc',
            }}>
              {uploadedFiles.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0',
                    color: colors.text,
                    fontSize: '0.95rem',
                  }}
                >
                  <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                  <button
                    type="button"
                    onClick={() => onFileRemove(index)}
                    disabled={disabled}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: disabled ? '#ccc' : colors.danger,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '3px',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ffe6e6';
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    Entfernen
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
