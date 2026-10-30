import type { FieldMode } from '../context/formContextValue';
import { formStyles } from './formStyles';
import { FieldComment } from './CommentUI';

interface FormMeasureProps {
  selectedGoal: string;
  measureModules: Array<{
    id: string;
    description: string;
    type: string;
    responsible: string;
    involved: string[];
    resources: string[];
    resourcesDescription: string;
    workMethod: string[];
    workMethodDescription: string;
    deadline: string;
  }>;
  onModuleChange: (
    id: string,
    field: 'description' | 'type' | 'responsible' | 'resourcesDescription' | 'workMethodDescription' | 'deadline',
    value: string
  ) => void;
  onModuleCheckboxChange: (id: string, field: 'involved' | 'resources' | 'workMethod', option: string) => void;
  mode?: FieldMode;
}

const MEASURE_TYPE_OPTIONS = [
  'Unterrichtsentwicklung / Methodeneinführung',
  'Konzeptentwicklung / Curriculumarbeit',
  'Fortbildung / Qualifizierung (z. B. SchiLF, externe Fortbildung)',
  'Infrastruktur- / Beschaffungsprojekt',
  'Kooperation / Netzwerkaufbau (z. B. Kooperationsvertrag offener Ganztag)',
];

const RESPONSIBILITY_OPTIONS = [
  'alle Lehrkräfte',
  'Klassenleitung',
  'Fachlehrkräfte',
  'Schulleitung',
  'Eltern',
  'Pädagogisches Personal',
];

const INVOLVED_OPTIONS = [
  'alle Lehrkräfte',
  'Klassenleitung',
  'Fachlehrkräfte',
  'Schulleitung',
  'Eltern',
  'Pädagogisches Personal',
];

const RESOURCES_OPTIONS = [
  'Zeitressourcen (z. B. Konferenzzeit, pädagogischer Tag, Anrechnungsstunden)',
  'Digitale Ausstattung & Software (z. B. Plattformlizenzen, Hardware)',
  'Finanzielle Mittel (z. B. Budget für Fortbildungen, zusätzliche Lernmittel)',
  'Räumlichkeiten / Infrastruktur (z. B. Lernwerkstatt, Ausstattung von Förderräumen)',
];

const WORK_METHOD_OPTIONS = [
  'Kollaborativ / Im Austausch (z. B. Fachschaft, Jahrgangsteam)',
  'Individuell / Einzelarbeit',
  'Hospitationsbasiert /Unterrichtsbezogen (z. B. kollegiales Feedback)',
];

export function FormMeasure({
  selectedGoal,
  measureModules,
  onModuleChange,
  onModuleCheckboxChange,
  mode = 'edit',
}: FormMeasureProps) {
  const disabled = mode !== 'edit';
  return (
    <>
      <div style={formStyles.section}>
        <h2 style={formStyles.section_title}>Planen Sie Maßnahmen und erstellen Sie ein Handlungsprogramm!</h2>

        {selectedGoal && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f0f4f8', borderRadius: '4px' }}>
            <strong>Gewähltes Ziel:</strong> {selectedGoal}
          </div>
        )}

        {measureModules.map((module) => (
          <div key={module.id} style={formStyles.moduleCard}>
            <div style={formStyles.module_header}>
              <h3 style={formStyles.module_title}>Maßnahme</h3>
            </div>

            <div style={formStyles.fieldGroup}>
              {/* Question 1: Beschreiben Sie die Maßnahme, Aktion, Schritt */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label htmlFor={`description-${module.id}`} style={formStyles.label}>
                  01. Beschreiben Sie die Maßnahme, Aktion, Schritt <span style={formStyles.required}>*</span>
                </label>
                <textarea
                  id={`description-${module.id}`}
                  value={module.description}
                  onChange={(e) => onModuleChange(module.id, 'description', e.target.value)} disabled={disabled}
                  rows={4}
                  required
                  style={formStyles.textarea}
                  placeholder="Beschreiben Sie hier die geplante Maßnahme, Aktion oder den konkreten Schritt..."
                />
              </div>

                <FieldComment fieldPath={`massnahmen.${module.id}.beschreibung`} />
              <hr style={formStyles.hr} />

              {/* Question 2: Um welchen Maßnahmentyp handelt es sich? */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label htmlFor={`type-${module.id}`} style={formStyles.label}>
                  02. Um welchen Maßnahmentyp handelt es sich? <span style={formStyles.required}>*</span>
                </label>
                <select
                  id={`type-${module.id}`}
                  value={module.type}
                  onChange={(e) => onModuleChange(module.id, 'type', e.target.value)} disabled={disabled}
                  required
                  style={formStyles.input}
                >
                  <option value="">Bitte wählen Sie einen Maßnahmentyp...</option>
                  {MEASURE_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

                <FieldComment fieldPath={`massnahmen.${module.id}.typ`} />
              <hr style={formStyles.hr} />

              {/* Question 3: Wer ist verantwortlich? */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label htmlFor={`responsible-${module.id}`} style={formStyles.label}>
                  03. Wer ist verantwortlich? <span style={formStyles.required}>*</span>
                </label>
                <select
                  id={`responsible-${module.id}`}
                  value={module.responsible}
                  onChange={(e) => onModuleChange(module.id, 'responsible', e.target.value)} disabled={disabled}
                  required
                  style={formStyles.input}
                >
                  <option value="">Bitte wählen Sie eine verantwortliche Person...</option>
                  {RESPONSIBILITY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

                <FieldComment fieldPath={`massnahmen.${module.id}.verantwortlich`} />
              <hr style={formStyles.hr} />

              {/* Question 4: Wer ist beteiligt? */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label style={formStyles.label}>
                  04. Wer ist beteiligt? <span style={formStyles.required}>*</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {INVOLVED_OPTIONS.map((option) => (
                    <label
                      key={option}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 'normal',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={module.involved.includes(option)}
                        onChange={() => onModuleCheckboxChange(module.id, 'involved', option)} disabled={disabled}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

                <FieldComment fieldPath={`massnahmen.${module.id}.beteiligte`} />
              <hr style={formStyles.hr} />

              {/* Question 5a: Nennen Sie Ressourcen und Sachmittel */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label style={formStyles.label}>
                  05a. WIE? Nennen Sie Ressourcen und Sachmittel, die Sie für die Umsetzung der Maßnahme benötigen? <span style={formStyles.required}>*</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {RESOURCES_OPTIONS.map((option) => (
                    <label
                      key={option}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        fontWeight: 'normal',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={module.resources.includes(option)}
                        onChange={() => onModuleCheckboxChange(module.id, 'resources', option)} disabled={disabled}
                        style={{ cursor: 'pointer', marginTop: '0.25rem' }}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 5b: Beschreiben Sie die Ressourcen und Sachmittel */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label htmlFor={`resourcesDescription-${module.id}`} style={formStyles.label}>
                  05b. Beschreiben Sie die Ressourcen und Sachmittel
                </label>
                <textarea
                  id={`resourcesDescription-${module.id}`}
                  value={module.resourcesDescription}
                  onChange={(e) => onModuleChange(module.id, 'resourcesDescription', e.target.value)} disabled={disabled}
                  rows={3}
                  style={formStyles.textarea}
                  placeholder="Beschreiben Sie die benötigten Ressourcen und Sachmittel detailliert..."
                />
              </div>

                <FieldComment fieldPath={`massnahmen.${module.id}.ressourcen`} />
              <hr style={formStyles.hr} />

              {/* Question 6a: Mit welcher Arbeitsmethode wird dieser Schritt umgesetzt? */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label style={formStyles.label}>
                  06a. Mit welcher Arbeitsmethode wird dieser Schritt umgesetzt? <span style={formStyles.required}>*</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {WORK_METHOD_OPTIONS.map((option) => (
                    <label
                      key={option}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        fontWeight: 'normal',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={module.workMethod.includes(option)}
                        onChange={() => onModuleCheckboxChange(module.id, 'workMethod', option)} disabled={disabled}
                        style={{ cursor: 'pointer', marginTop: '0.25rem' }}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 6b: Beschreiben Sie die Arbeitsmethode */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label htmlFor={`workMethodDescription-${module.id}`} style={formStyles.label}>
                  06b. Beschreiben Sie die Arbeitsmethode
                </label>
                <textarea
                  id={`workMethodDescription-${module.id}`}
                  value={module.workMethodDescription}
                  onChange={(e) => onModuleChange(module.id, 'workMethodDescription', e.target.value)} disabled={disabled}
                  rows={3}
                  style={formStyles.textarea}
                  placeholder="Beschreiben Sie die geplante Arbeitsmethode..."
                />
              </div>

                <FieldComment fieldPath={`massnahmen.${module.id}.arbeitsweise`} />
              <hr style={formStyles.hr} />

              {/* Question 7: BIS WANN muss die Maßnahme im Schulalltag gestartet oder durchgeführt sein? */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label htmlFor={`deadline-${module.id}`} style={formStyles.label}>
                  07. BIS WANN muss die Maßnahme im Schulalltag gestartet oder durchgeführt sein? <span style={formStyles.required}>*</span>
                </label>
                <input
                  id={`deadline-${module.id}`}
                  type="date"
                  value={module.deadline}
                  onChange={(e) => onModuleChange(module.id, 'deadline', e.target.value)} disabled={disabled}
                  required
                  style={formStyles.input}
                />
                <FieldComment fieldPath={`massnahmen.${module.id}.termin`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
