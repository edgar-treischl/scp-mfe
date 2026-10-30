import type { FieldMode } from '../context/formContextValue';
import { formStyles } from './formStyles';
import { FieldComment } from './CommentUI';

interface QuestionModule {
  id: string;
  smartGoal: string;
  targetGroup: string[];
  targetGroupOther: string;
  subject: string[];
  subjectOther: string;
  dataSources: string[];
  dataSourcesOther: string;
  startDate: string;
  endDate: string;
  comments: string;
}

interface FormGoalsProps {
  selectedGoal: string;
  onGoalChange: (goal: string) => void;
  questionModules: QuestionModule[];
  onModuleChange: (id: string, field: keyof QuestionModule, value: string | string[]) => void;
  onModuleCheckboxChange: (id: string, field: 'targetGroup' | 'subject' | 'dataSources', option: string) => void;
  goalOptions: string[];
  mode?: FieldMode;
}

const TARGET_GROUP_OPTIONS = [
  'Schülerinnen und Schüler',
  'Lehrkräfte / Kollegium',
  'Eltern / Erziehungsberechtigte',
  'Schulgemeinschaft',
  'Schule als Organisation (z. B. für Abläufe)',
  'Sonstige',
];

const SUBJECT_OPTIONS = [
  'Kompetenzen/Fähigkeiten (z. B. Medienkompetenz, Leseförderung)',
  'Prozesse/Abläufe (z. B. Kommunikationswege, Feedbackkultur)',
  'Angebote/Projekte (z. B. AGs, Ganztagsangebote)',
  'Sonstiges',
];

const DATA_SOURCES_OPTIONS = [
  'Schulstatistiken (z. B. ASV/ASD)',
  'Zentrale Lernstandserhebungen (z. B. VERA, BYLES, Lernstand 5, Orientierungsarbeiten)',
  'Leistungs- und Notenbild (z. B. Notenspiegel, Klassenarbeiten)',
  'Beobachtungen (z. B. Unterricht, Pausen, Übergänge)',
  'Online-Befragungen (z. B. BETSIE, PAUL)',
  'Protokolle (Lehrerkonferenzen, SCP-Gruppe)',
  'Sonstiges',
];

export function FormGoals({
  selectedGoal,
  onGoalChange,
  questionModules,
  onModuleChange,
  onModuleCheckboxChange,
  goalOptions,
  mode = 'edit',
}: FormGoalsProps) {
  const disabled = mode !== 'edit';
  return (
    <>
      <div style={formStyles.section}>
        <h2 style={formStyles.section_title}>Für welches SCP-Kernziel hat sich Ihre Schule entschieden?</h2>

        <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
          <label htmlFor="global-goal" style={formStyles.label}>
            Bitte wählen Sie ein Kernziel aus! Weitere Ziele können im Verlauf hinzugefügt werden. <span style={formStyles.required}>*</span>
          </label>
          <select
            id="global-goal"
            value={selectedGoal}
            onChange={(e) => onGoalChange(e.target.value)}
            disabled={disabled}
            required
            style={{ ...formStyles.input, opacity: disabled ? 0.6 : 1 }}
          >
            <option value="">Bitte wählen Sie ein Ziel...</option>
            {goalOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldComment fieldPath="ziele.kernziel" />
        </div>

        {selectedGoal && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f0f4f8', borderRadius: '4px' }}>
            <strong>Gewähltes Ziel:</strong> {selectedGoal}
          </div>
        )}

        {questionModules.map((module) => (
          <div key={module.id} style={formStyles.moduleCard}>
            <div style={formStyles.module_header}>
              <h3 style={formStyles.module_title}>Teilziel auf Individualebene</h3>
            </div>

            <div style={formStyles.fieldGroup}>
              {/* Question 1a: SMART Teilziel */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label htmlFor={`smartGoal-${module.id}`} style={formStyles.label}>
                  1a. Formulieren Sie ein SMART Teilziel
                </label>
                <textarea
                  id={`smartGoal-${module.id}`}
                  value={module.smartGoal}
                  onChange={(e) => onModuleChange(module.id, 'smartGoal', e.target.value)} disabled={disabled}
                  rows={3}
                  style={formStyles.textarea}
                  placeholder="Beschreiben Sie hier ein spezifisches, messbares, erreichbares, relevantes und zeitgebundenes Teilziel..."
                />
                <FieldComment fieldPath={`ziele.${module.id}.smartGoal`} />
              </div>

              <hr style={formStyles.hr} />

              {/* Question 02: Auf wen bezieht sich das Ziel? */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label style={formStyles.label}>
                  02. Auf wen bezieht sich das Ziel? <span style={formStyles.required}>*</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {TARGET_GROUP_OPTIONS.map((option) => (
                    <div key={option}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.5rem',
                          fontWeight: 'normal',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={module.targetGroup.includes(option)}
                          onChange={() => onModuleCheckboxChange(module.id, 'targetGroup', option)} disabled={disabled}
                          style={{ cursor: 'pointer', marginTop: '0.25rem' }}
                        />
                        <span>{option}</span>
                      </label>
                      {option === 'Sonstige' && module.targetGroup.includes('Sonstige') && (
                        <input
                          type="text"
                          value={module.targetGroupOther}
                          onChange={(e) => onModuleChange(module.id, 'targetGroupOther', e.target.value)} disabled={disabled}
                          placeholder="Bitte geben Sie die Zielgruppe an..."
                          style={{ ...formStyles.input, marginLeft: '1.5rem', marginTop: '0.5rem' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <hr style={formStyles.hr} />

              {/* Question 03: Was ist der Gegenstand des Ziels? */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label style={formStyles.label}>
                  03. Was ist der Gegenstand des Ziels? <span style={formStyles.required}>*</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {SUBJECT_OPTIONS.map((option) => (
                    <div key={option}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.5rem',
                          fontWeight: 'normal',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={module.subject.includes(option)}
                          onChange={() => onModuleCheckboxChange(module.id, 'subject', option)} disabled={disabled}
                          style={{ cursor: 'pointer', marginTop: '0.25rem' }}
                        />
                        <span>{option}</span>
                      </label>
                      {option === 'Sonstiges' && module.subject.includes('Sonstiges') && (
                        <input
                          type="text"
                          value={module.subjectOther}
                          onChange={(e) => onModuleChange(module.id, 'subjectOther', e.target.value)} disabled={disabled}
                          placeholder="Bitte geben Sie den Gegenstand an..."
                          style={{ ...formStyles.input, marginLeft: '1.5rem', marginTop: '0.5rem' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <hr style={formStyles.hr} />

              {/* Question 04: Welche Datenquellen nutzen Sie, um die Zielerreichung zu überprüfen? */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label style={formStyles.label}>
                  04. Welche Datenquellen nutzen Sie, um die Zielerreichung zu überprüfen?{' '}
                  <span style={formStyles.required}>*</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {DATA_SOURCES_OPTIONS.map((option) => (
                    <div key={option}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.5rem',
                          fontWeight: 'normal',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={module.dataSources.includes(option)}
                          onChange={() => onModuleCheckboxChange(module.id, 'dataSources', option)} disabled={disabled}
                          style={{ cursor: 'pointer', marginTop: '0.25rem' }}
                        />
                        <span>{option}</span>
                      </label>
                      {option === 'Sonstiges' && module.dataSources.includes('Sonstiges') && (
                        <input
                          type="text"
                          value={module.dataSourcesOther}
                          onChange={(e) => onModuleChange(module.id, 'dataSourcesOther', e.target.value)} disabled={disabled}
                          placeholder="Bitte geben Sie die Datenquelle an..."
                          style={{ ...formStyles.input, marginLeft: '1.5rem', marginTop: '0.5rem' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <hr style={formStyles.hr} />

              {/* Question 05: Zeitpunkt für die Zielerreichung */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label style={formStyles.label}>05. Zeitpunkt für die Zielerreichung</label>
                <div style={formStyles.fieldRow}>
                  <div>
                    <label
                      htmlFor={`startDate-${module.id}`}
                      style={{ ...formStyles.label, marginBottom: '0.25rem', fontSize: '0.875rem' }}
                    >
                      Startdatum
                    </label>
                    <input
                      id={`startDate-${module.id}`}
                      type="date"
                      value={module.startDate}
                      onChange={(e) => onModuleChange(module.id, 'startDate', e.target.value)} disabled={disabled}
                      required
                      style={formStyles.input}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`endDate-${module.id}`}
                      style={{ ...formStyles.label, marginBottom: '0.25rem', fontSize: '0.875rem' }}
                    >
                      Enddatum (optional)
                    </label>
                    <input
                      id={`endDate-${module.id}`}
                      type="date"
                      value={module.endDate}
                      onChange={(e) => onModuleChange(module.id, 'endDate', e.target.value)} disabled={disabled}
                      style={formStyles.input}
                    />
                  </div>
                </div>
                <FieldComment fieldPath={`ziele.${module.id}.zeitraum`} />
              </div>

              <hr style={formStyles.hr} />

              {/* Question 06: Kommentare */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                <label htmlFor={`comments-${module.id}`} style={formStyles.label}>
                  06. Kommentare
                </label>
                <textarea
                  id={`comments-${module.id}`}
                  value={module.comments}
                  onChange={(e) => onModuleChange(module.id, 'comments', e.target.value)} disabled={disabled}
                  rows={4}
                  style={formStyles.textarea}
                  placeholder="Haben Sie Kommentare hierzu?"
                />
                <FieldComment fieldPath={`ziele.${module.id}.kommentare`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
