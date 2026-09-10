import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { useFormContext } from '../context/formContextValue';
import { Breadcrumb } from '../components';
import { FormIststand } from '../components/form_iststand';
import { FormGoals } from '../components/form_goals';
import { FormMeasure } from '../components/form_measure';
import { GoalsSummary } from '../components/form_goals_summary';
import { ContractModal } from '../components/ContractModal';
import { NewIcon, LoadTemplateIcon, CopyIcon } from '../assets/icons';
import { FORM_GOAL_OPTIONS } from '../utils/formConstants';

import type { Submission } from '../types';

interface FormEditorProps {
  onNavigate: (view: 'landing' | 'form' | 'history' | 'view' | 'about' | 'eval' | 'new' | 'all', submissionId?: string) => void;
  submissionId?: string;
}

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

// Self-contained mock data for FormEditor
const mockDraft: Submission | null = {
  schulnummer: '0001',
  owner: 'maria.schmidt@organisation.de',
  status: 'draft',
  createdAt: new Date('2026-07-28T09:15:00'),
  updatedAt: new Date('2026-07-28T09:45:00'),
  data: {
    title: 'Zielvereinbarung 2026',
    istStandAnalyse: 'Die bisherigen Entwicklungen deuten auf Erfolge bei der Sprachförderung hin. Neue Herausforderungen entstehen in der digitalen Transformation und gezielten Förderung.',
    supportPersonnel: true,
    supportTypes: ['SEM', 'Schulpsychologe'],
    supportOtherText: '',
    dataSources: ['Schulstatistiken (z. B. ASV/ASD)', 'Feedbackfragebögen'],
    selectedGoal: 'Gesteigerte Umsetzung der Chancengerechtigkeit insbesondere im Bereich der Zusammenarbeit mit Eltern und Erziehungsberechtigten.',
    questionModules: [
      {
        id: crypto.randomUUID(),
        smartGoal: 'Erhöhung der Elternbeteiligung um 40%.',
        targetGroup: ['Eltern', 'Erziehungsberechtigte'],
        targetGroupOther: '',
        subject: ['Schulentwicklung', 'Elternarbeit'],
        subjectOther: '',
        dataSources: ['Feedbackfragebögen'],
        dataSourcesOther: 'Teilnahmequoten bei Veranstaltungen',
        startDate: '2026-08-01',
        endDate: '2026-12-31',
        comments: '',
      },
    ],
    measureModules: [
      {
        id: crypto.randomUUID(),
        description: 'Durchführung von monatlichen Eltern-Sprechstunden.',
        type: 'Schulentwicklung',
        responsible: 'Schulleiter',
        involved: ['Schulpsychologe'],
        resources: ['Räumlichkeiten', 'Moderationshonorare'],
        resourcesDescription: 'Budget: ca. 5.000€',
        workMethod: ['Beratungsgespräche', 'Kultursensible Kommunikation'],
        workMethodDescription: 'Regelmäßige Austauschtreffen',
        deadline: '2026-08-15',
      },
    ],
    evaluationDate: '2027-03-31',
    bilanzierungDate: '2027-06-30',
  },
};

const mockSubmitted: Submission | null = {
  schulnummer: '0001',
  owner: 'maria.schmidt@organisation.de',
  status: 'pending_review',
  createdAt: new Date('2026-06-15T10:30:00'),
  updatedAt: new Date('2026-07-20T14:20:00'),
  submittedAt: new Date('2026-07-20T14:20:00'),
  data: {
    title: 'Zielvereinbarung 2026 - Sprachförderung & Chancengerechtigkeit',
    istStandAnalyse: 'Gute Erfolge bei der Sprachförderung. Neuer Fokus auf interkulturelle Schulentwicklung.',
    supportPersonnel: true,
    supportTypes: ['SEM', 'Schulpsychologe'],
    supportOtherText: 'Interkulturelle Beratung',
    dataSources: ['Schulstatistiken', 'Feedbackfragebögen'],
    selectedGoal: 'Gesteigerte Umsetzung der Chancengerechtigkeit insbesondere im Bereich der Zusammenarbeit mit Eltern und Erziehungsberechtigten.',
    questionModules: [
      {
        id: crypto.randomUUID(),
        smartGoal: 'Erhöhung der Elternbeteiligung um 40% bis Q3 2026.',
        targetGroup: ['Eltern', 'Erziehungsberechtigte'],
        targetGroupOther: '',
        subject: ['Schulentwicklung'],
        subjectOther: '',
        dataSources: ['Feedbackfragebögen'],
        dataSourcesOther: '',
        startDate: '2026-08-01',
        endDate: '2026-12-31',
        comments: '',
      },
    ],
    measureModules: [
      {
        id: crypto.randomUUID(),
        description: 'Monatliche Eltern-Sprechstunden mit interkultureller Moderation.',
        type: 'Schulentwicklung',
        responsible: 'Schulleiter',
        involved: ['Interkulturelle Trainerin'],
        resources: ['Räumlichkeiten', 'Moderationshonorare'],
        resourcesDescription: 'Budget: 5.000€',
        workMethod: ['Beratungsgespräche'],
        workMethodDescription: 'Kultursensible Kommunikation',
        deadline: '2026-08-15',
      },
    ],
    evaluationDate: '2027-03-31',
    bilanzierungDate: '2027-06-30',
  },
};

// Professional color palette
const colors = {
  primary: '#1E8AD9',
  success: '#64D4C6',
  danger: '#dc3545',
  warning: '#ffc107',
  neutral: '#f8f9fa',
  border: '#dee2e6',
  text: '#212529',
  textMuted: '#6c757d',
  disabled: '#e9ecef',
};
const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  header: {
    marginBottom: '0rem',
    paddingBottom: '0.2rem',
  },
  header_title: {
    fontSize: '2rem',
    fontWeight: '600',
    lineHeight: '1.25',
    color: colors.text,
    margin: 0,
    marginBottom: '0.5rem',
  },
  header_meta: {
    display: 'flex' as const,
    gap: '1rem',
    alignItems: 'center',
    marginTop: '1rem',
  },
  status_badge: {
    padding: '0.35rem 0.75rem',
    background: colors.warning,
    color: '#000',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  section: {
    marginBottom: '2.5rem',
  },
  section_title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: colors.text,
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block' as const,
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: colors.text,
    fontSize: '0.95rem',
  },
  required: {
    color: colors.danger,
  },
  input: {
    width: '100%',
    padding: '0.65rem 0.75rem',
    fontSize: '0.95rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.95rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    transition: 'border-color 0.2s',
  },
  moduleCard: {
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    background: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  module_header: {
    display: 'flex' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  module_title: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: colors.text,
    margin: 0,
  },
  button_primary: {
    padding: '0.75rem 1.5rem',
    background: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'background-color 0.2s',
  },
  button_secondary: {
    padding: '0.5rem 1.5rem',
    background: colors.neutral,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'background-color 0.2s',
  },
  button_success: {
    width: '100%',
    padding: '0.85rem 1.5rem',
    background: colors.success,
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
  },
  button_success_disabled: {
    width: '100%',
    padding: '0.85rem 1.5rem',
    background: colors.disabled,
    color: colors.textMuted,
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
    fontWeight: '500',
    fontSize: '0.95rem',
  },
  button_danger: {
    padding: '0.35rem 0.75rem',
    background: colors.danger,
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  button_draft: {
    padding: '0.65rem 1rem',
    background: '#fff8e1',
    border: `1px solid ${colors.warning}`,
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'background-color 0.2s',
  },
  draftInfoBox: {
    marginBottom: '1.5rem',
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    borderRadius: '8px',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: colors.text,
    margin: '0 0 1.5rem 0',
  },
  draftCard: {
    background: colors.neutral,
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    padding: '1rem',
    marginBottom: '1.5rem',
  },
  draftCard_title: {
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: colors.text,
  },
  draftCard_preview: {
    fontSize: '0.9rem',
    color: colors.textMuted,
    marginBottom: '0.75rem',
  },
  draftCard_meta: {
    fontSize: '0.85rem',
    color: colors.textMuted,
  },
  fieldGroup: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  footer: {
    display: 'flex' as const,
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: `1px solid ${colors.border}`,
  },
  hr: {
    border: 'none',
    borderTop: `1px solid ${colors.border}`,
    margin: '2rem 0',
  },
  contractSection: {
    border: `2px solid ${colors.primary}`,
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  contractTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: colors.primary,
    marginBottom: '1rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  contractPreview: {
    fontSize: '0.95rem',
    lineHeight: '1.8',
    color: colors.text,
    fontStyle: 'italic' as const,
  },
  contractValue: {
    borderBottom: `2px solid ${colors.primary}`,
    color: colors.text,
    fontWeight: '600',
    fontStyle: 'normal' as const,
    paddingBottom: '2px',
  },
  contractInputsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  contractInputWrapper: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  contractLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
  },
};


interface GoalEntry {
  selectedGoal: string;
  questionModules: QuestionModule[];
  measureModules: MeasureModule[];
}

function createEmptyQuestionModule(): QuestionModule {
  return {
    id: crypto.randomUUID(),
    smartGoal: '',
    targetGroup: [],
    targetGroupOther: '',
    subject: [],
    subjectOther: '',
    dataSources: [],
    dataSourcesOther: '',
    startDate: '',
    endDate: '',
    comments: '',
  };
}

function createEmptyMeasureModule(): MeasureModule {
  return {
    id: crypto.randomUUID(),
    description: '',
    type: '',
    responsible: '',
    involved: [],
    resources: [],
    resourcesDescription: '',
    workMethod: [],
    workMethodDescription: '',
    deadline: '',
  };
}

interface FormData {
  istStandAnalyse: string;
  supportPersonnel: boolean | '';
  supportTypes: string[];
  supportOtherText: string;
  dataSources: string[];
}

export function FormEditor({ onNavigate, submissionId }: FormEditorProps) {
  const { getFieldMode, submission, setSubmission, loadSubmission } = useFormContext();
  const fieldMode = getFieldMode();
  const canEditForm = fieldMode === 'edit';
  // Skip landing step if editing an existing submission
  const [currentStep, setCurrentStep] = useState(submissionId ? 1 : 0);
  const [formData, setFormData] = useState<FormData>({
    istStandAnalyse: '',
    supportPersonnel: '',
    supportTypes: [],
    supportOtherText: '',
    dataSources: [],
  });

  // Initialize submission on mount or when submissionId changes
  useEffect(() => {
    if (submissionId) {
      void loadSubmission(submissionId);
      return;
    }

    const defaultFormData: Submission['data'] = {
      istStandAnalyse: '',
      supportPersonnel: false,
      supportTypes: [],
      supportOtherText: '',
      dataSources: [],
      selectedGoal: '',
      questionModules: [],
      measureModules: [],
      evaluationDate: '',
      bilanzierungDate: '',
    };

    setSubmission({
      schulnummer: '0001',
      owner: 'user@school.de',
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      data: defaultFormData,
    });
  }, [submissionId, loadSubmission, setSubmission]);
  
  // Multi-goal support
  const [goals, setGoals] = useState<GoalEntry[]>([
    {
      selectedGoal: '',
      questionModules: [
        {
          id: crypto.randomUUID(),
          smartGoal: '',
          targetGroup: [],
          targetGroupOther: '',
          subject: [],
          subjectOther: '',
          dataSources: [],
          dataSourcesOther: '',
          startDate: '',
          endDate: '',
          comments: '',
        }
      ],
      measureModules: [
        {
          id: crypto.randomUUID(),
          description: '',
          type: '',
          responsible: '',
          involved: [],
          resources: [],
          resourcesDescription: '',
          workMethod: [],
          workMethodDescription: '',
          deadline: '',
        }
      ],
    }
  ]);
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(submissionId);
  const hydratedIdRef = useRef<string | null>(null);

  // Hydrate the form from a loaded submission and skip the start screen
  useLayoutEffect(() => {
    if (!submissionId || !submission || submission.schulnummer !== submissionId) return;
    if (hydratedIdRef.current === submissionId) return;
    hydratedIdRef.current = submissionId;

    const data = submission.data;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      istStandAnalyse: (data.istStandAnalyse as string) || '',
      supportPersonnel: (data.supportPersonnel as boolean) ?? '',
      supportTypes: (data.supportTypes as string[]) || [],
      supportOtherText: (data.supportOtherText as string) || '',
      dataSources: (data.dataSources as string[]) || [],
    });

    const loadedQuestions = (data.questionModules as QuestionModule[]) || [];
    const loadedMeasures = (data.measureModules as MeasureModule[]) || [];

    setGoals([{
      selectedGoal: (data.selectedGoal as string) || '',
      questionModules: loadedQuestions.length > 0 ? loadedQuestions : [createEmptyQuestionModule()],
      measureModules: loadedMeasures.length > 0 ? loadedMeasures : [createEmptyMeasureModule()],
    }]);
    setCurrentGoalIndex(0);
    setCurrentDraftId(submissionId);
    setCurrentStep(1);
    window.scrollTo(0, 0);
  }, [submissionId, submission]);

  // Shortcuts to current goal data
  const currentGoal = goals[currentGoalIndex];
  const selectedGoal = currentGoal.selectedGoal;
  const questionModules = currentGoal.questionModules;
  const measureModules = currentGoal.measureModules;

  // Contract party parameters (from authentication/context - these values change per user)
  const contractSchoolName = 'Zauberberg Grundschule';
  const contractSchoolLead = 'Dr. Monika Musterfrau';
  const contractSamt = 'Staatl. Schulamt Zauberberg';
  const contractProgramRep = 'Max Musterman';

  // Define form steps
  const steps = [
    { id: 'landing', title: 'Zielvereinbarung starten', component: 'landing' },
    { id: 'iststand', title: 'IST-Stand Analyse', component: 'iststand' },
    { id: 'goals', title: 'Ziele', component: 'goals' },
    { id: 'measures', title: 'Maßnahmen', component: 'measures' },
    { id: 'summary', title: 'Übersicht', component: 'summary' },
    { id: 'contract', title: 'Zielvereinbarung', component: 'contract' },
  ];

  const totalSteps = steps.length;
  const currentStepData = steps[currentStep];

  const handleStartNew = () => {
    setCurrentDraftId(undefined);
    handleNextStep();
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleIstStandChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, istStandAnalyse: e.target.value }));
  };

  const handleSupportPersonnelChange = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      supportPersonnel: value,
      supportTypes: !value ? [] : prev.supportTypes,
      supportOtherText: !value ? '' : prev.supportOtherText,
    }));
  };

  const handleSupportTypeChange = (type: string, checked: boolean) => {
    setFormData(prev => {
      const newTypes = checked
        ? [...prev.supportTypes, type]
        : prev.supportTypes.filter(t => t !== type);
      
      return {
        ...prev,
        supportTypes: newTypes,
        supportOtherText: type === 'Sonstige' && !checked ? '' : prev.supportOtherText,
      };
    });
  };

  const handleDataSourceChange = (source: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dataSources: checked
        ? [...prev.dataSources, source]
        : prev.dataSources.filter(s => s !== source),
    }));
  };

  const updateGoal = (updates: Partial<GoalEntry>) => {
    setGoals(prev => {
      const newGoals = [...prev];
      newGoals[currentGoalIndex] = { ...newGoals[currentGoalIndex], ...updates };
      return newGoals;
    });
  };

  const handleGoalChange = (newGoal: string) => {
    updateGoal({ selectedGoal: newGoal });
  };

  const handleModuleChange = (id: string, field: keyof QuestionModule, value: string | string[]) => {
    updateGoal({
      questionModules: questionModules.map(module =>
        module.id === id ? { ...module, [field]: value } : module
      )
    });
  };

  const handleModuleCheckboxChange = (id: string, field: 'targetGroup' | 'subject' | 'dataSources', option: string) => {
    updateGoal({
      questionModules: questionModules.map(module => {
        if (module.id === id) {
          const currentArray = module[field];
          return {
            ...module,
            [field]: currentArray.includes(option)
              ? currentArray.filter(item => item !== option)
              : [...currentArray, option]
          };
        }
        return module;
      })
    });
  };

  const handleMeasureModuleChange = (id: string, field: keyof MeasureModule, value: string | string[]) => {
    updateGoal({
      measureModules: measureModules.map(module =>
        module.id === id ? { ...module, [field]: value } : module
      )
    });
  };

  const handleMeasureModuleCheckboxChange = (id: string, field: 'involved' | 'resources' | 'workMethod', option: string) => {
    updateGoal({
      measureModules: measureModules.map(module => {
        if (module.id === id) {
          const currentArray = module[field];
          return {
            ...module,
            [field]: currentArray.includes(option)
              ? currentArray.filter(item => item !== option)
              : [...currentArray, option]
          };
        }
        return module;
      })
    });
  };

  const loadDraft = () => {
    if (mockDraft) {
      // Load all draft data into form
      setFormData({
        istStandAnalyse: (mockDraft.data.istStandAnalyse as string) || '',
        supportPersonnel: (mockDraft.data.supportPersonnel as boolean) || false,
        supportTypes: (mockDraft.data.supportTypes as string[]) || [],
        supportOtherText: (mockDraft.data.supportOtherText as string) || '',
        dataSources: (mockDraft.data.dataSources as string[]) || [],
      });
      
      // Load goals data
      const draftGoals = (mockDraft.data.questionModules as QuestionModule[]) || [];
      const draftMeasures = (mockDraft.data.measureModules as MeasureModule[]) || [];
      const draftGoal = (mockDraft.data.selectedGoal as string) || '';
      
      setGoals([{
        selectedGoal: draftGoal,
        questionModules: draftGoals.length > 0 ? draftGoals : [
          {
            id: crypto.randomUUID(),
            smartGoal: '',
            targetGroup: [],
            targetGroupOther: '',
            subject: [],
            subjectOther: '',
            dataSources: [],
            dataSourcesOther: '',
            startDate: '',
            endDate: '',
            comments: '',
          }
        ],
        measureModules: draftMeasures.length > 0 ? draftMeasures : [
          {
            id: crypto.randomUUID(),
            description: '',
            type: '',
            responsible: '',
            involved: [],
            resources: [],
            resourcesDescription: '',
            workMethod: [],
            workMethodDescription: '',
            deadline: '',
          }
        ],
      }]);
      setCurrentGoalIndex(0);
      setCurrentDraftId(mockDraft.schulnummer);
      // Move to iststand step (step 1) after loading draft
      setCurrentStep(1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditForm) return;
    // Show mock submission info
    const mockSubmissionId = `SUB-${Date.now()}`;
    const mockInfo = `Ihr Formular wurde erfolgreich eingereicht!\n\nSubmissions-ID: ${mockSubmissionId}\nStatus: Eingereicht\nZeitpunkt: ${new Date().toLocaleString('de-DE')}`;
    alert(mockInfo);
    onNavigate('landing');
  };

  const getBreadcrumbItems = () => {
    // In review mode, show full breadcrumb path to review submissions
    if (fieldMode === 'review') {
      return [
        { label: 'Start', onClick: () => onNavigate('landing') },
        { label: 'Neue Einreichungen', onClick: () => onNavigate('new') },
      ];
    }

    if (submissionId) {
      // Editing existing submission
      return [
        { label: 'Start', onClick: () => onNavigate('landing') },
        { label: 'Neu' }
      ];
    } else {
      // New form
      return [
        { label: 'Start', onClick: () => onNavigate('landing') },
        { label: 'Neu' }
      ];
    }
  };

  return (
    <div className="form-light-mode" style={styles.container}>
      <Breadcrumb items={getBreadcrumbItems()} />
      
      <header style={styles.header}>
        <div style={styles.header_meta}>
          {currentStep > 0 && (
            <span style={styles.status_badge}>
              Schritt {currentStep} von {totalSteps - 1}: {currentStepData.title}
            </span>
          )}
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        {/* Landing Step - Start or Load Draft - Only show when creating new (no submissionId) */}
        {currentStep === 0 && !submissionId && (
          <div>
            {/* Header Section */}
            <div style={{ marginBottom: '3rem' }}>
              <h1
                style={{
                  fontSize: '2.5rem',
                  margin: '0 0 1rem 0',
                  fontWeight: 'bold',
                  color: colors.text,
                }}
              >
                Zielvereinbarung starten
              </h1>

              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  color: colors.textMuted,
                  margin: 0,
                  maxWidth: '700px',
                }}
              >
                Wählen Sie eine der folgenden Optionen.
              </p>
            </div>

            {/* Feature Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              }}
            >
              {/* Start New Form Card */}
              <div
                onClick={handleStartNew}
                style={{
                  padding: '2rem',
                  background: 'white',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 138, 217, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                }}
              >
                <NewIcon style={{ width: '2.5rem', height: '2.5rem', color: colors.primary, marginBottom: '1rem' }} />
                <h2
                  style={{
                    fontSize: '1.25rem',
                    margin: '0 0 0.75rem 0',
                    color: colors.text,
                    fontWeight: '600',
                  }}
                >
                  Neue Zielvereinbarung
                </h2>

                <p
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: colors.textMuted,
                    margin: 0,
                  }}
                >
                  Beginnen Sie mit einer neuen Zielvereinbarung. 
                </p>
              </div>

              {/* Load Draft Card */}
              {mockDraft && !currentDraftId && !submissionId ? (
                <div
                  onClick={loadDraft}
                  style={{
                    padding: '2rem',
                    background: 'white',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.warning;
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 138, 217, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                  }}
                >
                  <LoadTemplateIcon style={{ width: '2.5rem', height: '2.5rem', color: colors.warning, marginBottom: '1rem' }} />
                  <h2
                    style={{
                      fontSize: '1.25rem',
                      margin: '0 0 0.75rem 0',
                      color: colors.text,
                      fontWeight: '600',
                    }}
                  >
                    Entwurf laden
                  </h2>

                  <p
                    style={{
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      color: colors.textMuted,
                      margin: 0,
                    }}
                  >
                    Setzen Sie Ihre Arbeit fort und laden Sie Ihren letzten Entwurf.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    padding: '2rem',
                    background: colors.neutral,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    cursor: 'not-allowed',
                    opacity: 0.6,
                  }}
                >
                  <LoadTemplateIcon style={{ width: '2.5rem', height: '2.5rem', color: colors.textMuted, marginBottom: '1rem' }} />
                  <h2
                    style={{
                      fontSize: '1.25rem',
                      margin: '0 0 0.75rem 0',
                      color: colors.textMuted,
                      fontWeight: '600',
                    }}
                  >
                    Entwurf laden
                  </h2>

                  <p
                    style={{
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      color: colors.textMuted,
                      margin: 0,
                    }}
                  >
                    Keine Entwürfe verfügbar.
                  </p>
                </div>
              )}

              {/* Load Submitted Card */}
              {mockSubmitted && !submissionId ? (
                <div
                  onClick={() => {
                    /* Mock: would load submitted submission */
                    console.log('Loading submitted submission:', mockSubmitted!.schulnummer);
                  }}
                  style={{
                    padding: '2rem',
                    background: 'white',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.success;
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 138, 217, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                  }}
                >
                  <CopyIcon style={{ width: '2.5rem', height: '2.5rem', color: colors.success, marginBottom: '1rem' }} />
                  <h2
                    style={{
                      fontSize: '1.25rem',
                      margin: '0 0 0.75rem 0',
                      color: colors.text,
                      fontWeight: '600',
                    }}
                  >
                    Letzte Vereinbarung
                  </h2>

                  <p
                    style={{
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      color: colors.textMuted,
                      margin: 0,
                    }}
                  >
                    Starten Sie eine neue Zielvereinbarung auf Basis der zuletzt eingereichte Zielvereinbarung.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    padding: '2rem',
                    background: colors.neutral,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    cursor: 'not-allowed',
                    opacity: 0.6,
                  }}
                >
                  <CopyIcon style={{ width: '2.5rem', height: '2.5rem', color: colors.textMuted, marginBottom: '1rem' }} />
                  <h2
                    style={{
                      fontSize: '1.25rem',
                      margin: '0 0 0.75rem 0',
                      color: colors.textMuted,
                      fontWeight: '600',
                    }}
                  >
                    Letzte Vereinbarung
                  </h2>

                  <p
                    style={{
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      color: colors.textMuted,
                      margin: 0,
                    }}
                  >
                    Keine eingereichten Vereinbarungen verfügbar.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* IST-Stand Analysis Step */}
        {currentStep === 1 && (
          <FormIststand
            istStandAnalyse={formData.istStandAnalyse}
            supportPersonnel={formData.supportPersonnel}
            supportTypes={formData.supportTypes}
            supportOtherText={formData.supportOtherText}
            dataSources={formData.dataSources}
            onIstStandChange={(value) =>
              handleIstStandChange({ target: { value } } as React.ChangeEvent<HTMLTextAreaElement>)
            }
            onSupportPersonnelChange={handleSupportPersonnelChange}
            onSupportTypeChange={handleSupportTypeChange}
            onSupportOtherTextChange={(val) => {
              setFormData(prev => ({ ...prev, supportOtherText: val }));
            }}
            onDataSourceChange={handleDataSourceChange}
            mode={fieldMode}
          />
        )}

        {/* Individual Goals Step */}
        {currentStep === 2 && (
          <FormGoals
            selectedGoal={selectedGoal}
            onGoalChange={handleGoalChange}
            questionModules={questionModules}
            onModuleChange={handleModuleChange}
            onModuleCheckboxChange={handleModuleCheckboxChange}
            goalOptions={FORM_GOAL_OPTIONS}
            mode={fieldMode}
          />
        )}

        {/* Measures Step */}
        {currentStep === 3 && (
          <FormMeasure
            selectedGoal={selectedGoal}
            measureModules={measureModules}
            onModuleChange={handleMeasureModuleChange}
            onModuleCheckboxChange={handleMeasureModuleCheckboxChange}
            mode={fieldMode}
          />
        )}

        {/* Summary Step */}
        {currentStep === 4 && (
          <GoalsSummary
            goals={goals}
            onEditGoal={(index) => {
              setCurrentGoalIndex(index);
              setCurrentStep(2);
            }}
            onAddGoal={() => {
              const newGoal: GoalEntry = {
                selectedGoal: '',
                questionModules: [createEmptyQuestionModule()],
                measureModules: [createEmptyMeasureModule()],
              };
              const updatedGoals = [...goals, newGoal];
              setGoals(updatedGoals);
              setCurrentGoalIndex(updatedGoals.length - 1);
              setCurrentStep(2);
            }}
            mode={fieldMode}
          />
        )}

        {/* Contract Step - Final Step */}
        {currentStep === 5 && (
          <ContractModal
            schoolName={contractSchoolName}
            schoolLead={contractSchoolLead}
            samt={contractSamt}
            programRep={contractProgramRep}
            onClose={handlePreviousStep}
            onSubmit={handleNextStep}
          />
        )}

        {/* Workflow Actions - shown on summary step */}
        {/* Removed per requirements */}

        {/* Step Navigation Footer - Hidden on Landing Step */}
        {currentStep > 0 && (
          <footer style={styles.footer}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {currentStep !== totalSteps - 1 && (
                <button type="button" onClick={() => onNavigate('landing')} style={styles.button_secondary}>
                Abbrechen
              </button>
              )}

              {currentStep === totalSteps - 1 && canEditForm && (
                <button type="submit" style={styles.button_primary}>
                  Entwurf speichern
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'right', flex: 1,  justifyContent: 'flex-end' }}>
              {currentStep > 0 && (currentStep > 1 || !submissionId) && (
                <button 
                  type="button" 
                  onClick={handlePreviousStep}
                  style={styles.button_secondary}
                >
                  ← Zurück
                </button>
              )}
              {currentStep > 0 && (
                <span style={{ color: colors.textMuted, fontSize: '0.9rem', minWidth: '80px' }}>
                  Schritt {currentStep} / {totalSteps - 1}
                </span>
              )}
              {currentStep < totalSteps - 1 && (
                <button 
                  type="button" 
                  onClick={handleNextStep}
                  style={styles.button_secondary}
                >
                  Weiter →
                </button>
              )}
            </div>
          </footer>
        )}
      </form>
    </div>
  );
}
