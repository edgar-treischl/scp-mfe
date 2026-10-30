import { formStyles } from './formStyles';
import { FieldComment } from './CommentUI';
import { ReviewField, ReviewChecklist, ReviewSection } from './ReviewField';
import type { FieldMode } from '../context/formContextValue';

interface FormIststandProps {
  istStandAnalyse: string;
  supportPersonnel: boolean | '';
  supportTypes: string[];
  supportOtherText: string;
  dataSources: string[];
  onIstStandChange: (value: string) => void;
  onSupportPersonnelChange: (value: boolean) => void;
  onSupportTypeChange: (type: string, checked: boolean) => void;
  onSupportOtherTextChange: (value: string) => void;
  onDataSourceChange: (source: string, checked: boolean) => void;
  mode?: FieldMode;
}

const SUPPORT_TYPES = ['SEM', 'BDA', 'BiUSE', 'QmbS'];
const DATA_SOURCES = [
  'Schulstatistiken (z. B. ASV/ASD)',
  'Zentrale Lernstandserhebungen (z. B. VERA, BYLES, Lernstand 5, Orientierungsarbeiten)',
  'Leistungs- und Notenbild (z. B. Notenspiegel, Klassenarbeiten)',
  'Beobachtungen (z. B. Unterricht, Pausen, Übergänge)',
  'Online-Befragungen (z. B. BETSIE, PAUL)',
  'Ergebnisse aus der externen Evaluation (z. B. Befragungsergebnisse, Unterrichtsbeobachtungen, Evaluationsbericht)',
  'Protokolle (Lehrerkonferenzen, SCP-Gruppe)',
];

export function FormIststand({
  istStandAnalyse,
  supportPersonnel,
  supportTypes,
  supportOtherText,
  dataSources,
  onIstStandChange,
  onSupportPersonnelChange,
  onSupportTypeChange,
  onSupportOtherTextChange,
  onDataSourceChange,
  mode = 'edit',
}: FormIststandProps) {
  const disabled = mode !== 'edit';

  // Review mode render
  if (mode === 'review') {
    return (
      <ReviewSection title="Grundlegende Erkenntnisse zur IST-Stand-Analyse">
        <ReviewField
          label="01a. Arbeitet Ihre Schule mit Personen aus dem Unterstützungssystem zusammen?"
          value={supportPersonnel}
        />

        {supportPersonnel === true && (
          <>
            <ReviewChecklist
              label="01b. Mit welchen Personen arbeiten Sie zusammen?"
              items={[
                ...SUPPORT_TYPES.map((type) => ({
                  id: type,
                  label: type,
                  checked: supportTypes.includes(type),
                })),
                {
                  id: 'sonstige',
                  label: `Sonstige: ${supportOtherText}`,
                  checked: supportTypes.includes('Sonstige'),
                },
              ].filter((item) => item.checked)}
            />
          </>
        )}

        <ReviewChecklist
          label="02. Datenquellen für die Ist-Stand-Erhebung"
          items={DATA_SOURCES.map((source) => ({
            id: source,
            label: source,
            checked: dataSources.includes(source),
          }))}
        />

        <ReviewField
          label="03. Kommentare"
          value={istStandAnalyse || ''}
        />

        <FieldComment fieldPath="iststand.kommentare" />
      </ReviewSection>
    );
  }

  // Edit mode render (original)
  return (
    <div style={formStyles.section}>
      <h2 style={formStyles.section_title}>Grundlegende Erkenntnisse zur IST-Stand-Analyse</h2>

      {/* Question 1: Support Personnel */}
      <div style={{ marginTop: '2rem' }}>
        <label style={formStyles.label}>
          01a. Wir arbeiten mit Personen aus dem Unterstützungssystem zusammen.
        </label>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal' }}>
            <input
              type="radio"
              name="supportPersonnel"
              value="true"
              checked={supportPersonnel === true}
              onChange={() => onSupportPersonnelChange(true)}
              disabled={disabled}
              style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
            />
            Ja
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal' }}>
            <input
              type="radio"
              name="supportPersonnel"
              value="false"
              checked={supportPersonnel === false}
              onChange={() => onSupportPersonnelChange(false)}
              disabled={disabled}
              style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
            />
            Nein
          </label>
        </div>
      </div>

      {/* Question 2: Support Types (Filtered) */}
      {supportPersonnel === true && (
        <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
          <label style={formStyles.label}>01b. Mit wem arbeiten Sie zusammen?</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {SUPPORT_TYPES.map((type) => (
              <label
                key={type}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal' }}
              >
                <input
                  type="checkbox"
                  checked={supportTypes.includes(type)}
                  onChange={(e) => onSupportTypeChange(type, e.target.checked)}
                  disabled={disabled}
                  style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                />
                {type}
              </label>
            ))}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal' }}>
              <input
                type="checkbox"
                checked={supportTypes.includes('Sonstige')}
                onChange={(e) => onSupportTypeChange('Sonstige', e.target.checked)}
                disabled={disabled}
                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
              />
              Sonstige, nämlich:
            </label>
            {supportTypes.includes('Sonstige') && (
              <input
                type="text"
                value={supportOtherText}
                onChange={(e) => onSupportOtherTextChange(e.target.value)}
                placeholder="Bitte spezifizieren Sie..."
                disabled={disabled}
                style={{ ...formStyles.input, marginLeft: '1.5rem', opacity: disabled ? 0.6 : 1 }}
              />
            )}
          </div>
        </div>
      )}

      <FieldComment fieldPath="iststand.unterstuetzung" />

      <hr style={formStyles.hr} />

      {/* Question 3: Data Sources */}
      <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
        <label style={formStyles.label}>02. Datenquellen für die Ist-Stand-Erhebung</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {DATA_SOURCES.map((source) => (
            <label
              key={source}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontWeight: 'normal' }}
            >
              <input
                type="checkbox"
                checked={dataSources.includes(source)}
                onChange={(e) => onDataSourceChange(source, e.target.checked)}
                disabled={disabled}
                style={{ cursor: disabled ? 'not-allowed' : 'pointer', marginTop: '0.25rem' }}
              />
              <span>{source}</span>
            </label>
          ))}
        </div>
      </div>

      <FieldComment fieldPath="iststand.datenquellen" />

      <hr style={formStyles.hr} />

      <label htmlFor="istStandAnalyse" style={formStyles.label}>
        03. Kommentare
      </label>
      <textarea
        id="istStandAnalyse"
        value={istStandAnalyse}
        onChange={(e) => onIstStandChange(e.target.value)}
        disabled={disabled}
        rows={6}
        style={{ ...formStyles.textarea, opacity: disabled ? 0.6 : 1 }}
        placeholder="Weitere Hinweise, Kommentare, Anmerkungen ..."
      />

      <FieldComment fieldPath="iststand.kommentare" />

    </div>
  );
}
