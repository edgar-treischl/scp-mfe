import { formStyles } from './formStyles';
import type { FieldMode } from '../context/formContextValue';

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

interface MeasureModule {
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
}

interface GoalEntry {
  selectedGoal: string;
  questionModules: QuestionModule[];
  measureModules: MeasureModule[];
}

interface GoalsSummaryProps {
  goals: GoalEntry[];
  onEditGoal: (index: number) => void;
  onAddGoal: () => void;
  onDeleteGoal?: (index: number) => void;
  mode?: FieldMode;
}

export function GoalsSummary({ goals, onEditGoal, onAddGoal, onDeleteGoal, mode = 'edit' }: GoalsSummaryProps) {
  const canEdit = mode === 'edit';

  return (
    <>
      <div style={formStyles.section}>
        <h2 style={formStyles.section_title}>Übersicht: Erfasste Ziele und Maßnahmen</h2>
        <p style={{ marginBottom: '1.5rem', color: '#666' }}>
          Sie haben {goals.length} {goals.length === 1 ? 'Ziel' : 'Ziele'} mit ihren Teilzielen und Maßnahmen erfasst.
        </p>

        {goals.map((goal, index) => (
          <div key={index} style={formStyles.moduleCard}>
            <div style={formStyles.module_header}>
              <div>
                <h3 style={formStyles.module_title}>Ziel {index + 1}</h3>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem', color: '#666' }}>
                  {goal.selectedGoal}
                </p>
              </div>
              {canEdit && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => onEditGoal(index)}
                    style={formStyles.button_secondary}
                  >
                    Bearbeiten
                  </button>
                  {goals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteGoal?.(index)}
                      style={{
                        ...formStyles.button_secondary,
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                      }}
                    >
                      Löschen
                    </button>
                  )}
                </div>
              )}
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #dee2e6' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: '600' }}>
                  Teilziele ({goal.questionModules.length})
                </h4>
                {goal.questionModules.map((module) => (
                  <div key={module.id} style={{ padding: '0.5rem', background: '#f8f9fa', borderRadius: '4px', marginBottom: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>
                      {module.smartGoal || '(Keine Angabe)'}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: '600' }}>
                  Maßnahmen ({goal.measureModules.length})
                </h4>
                {goal.measureModules.map((module) => (
                  <div key={module.id} style={{ padding: '0.5rem', background: '#f0f4f8', borderRadius: '4px', marginBottom: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>
                      {module.description || '(Keine Angabe)'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Add another goal button */}
        {canEdit && (
          <button
            type="button"
            onClick={onAddGoal}
            style={formStyles.button_success}
          >
            + Weiteres Ziel hinzufügen
          </button>
        )}
      </div>
    </>
  );
}
