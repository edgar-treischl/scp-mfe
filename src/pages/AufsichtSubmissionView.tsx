import { StatusBadge, Breadcrumb } from '../components';
import { ExportWordIcon } from '../assets/icons';
import { formStyles } from '../components/formStyles';
import type { Submission } from '../types';
import { exportSubmissionAsDOCX } from '../utils/docxExport';
import { useFormContext } from '../context/formContextValue';

interface AufsichtSubmissionViewProps {
  schulnummer: string | null;
  onNavigate: (view: 'landing' | 'form' | 'history' | 'view' | 'about' | 'eval' | 'new' | 'all', schulnummer?: string) => void;
}

const mockSubmission: Submission = {
  schulnummer: '0001',
  owner: 'maria.schmidt@organisation.de',
  status: 'pending_review',
  createdAt: new Date('2024-07-15T10:30:00'),
  updatedAt: new Date('2024-07-15T14:20:00'),
  submittedAt: new Date('2024-07-15T14:20:00'),
  data: {
    title: 'Zielvereinbarung 2024',
    istStandAnalyse: 'Die umfassende Analyse der aktuellen Situation zeigt, dass die bestehenden Strukturen und Prozesse grundsätzlich gut funktionieren. Es wurden jedoch einige Optimierungspotenziale identifiziert, insbesondere in den Bereichen Kommunikation und Koordination zwischen den verschiedenen Abteilungen.',
    supportPersonnel: true,
    supportTypes: ['SEM', 'BDA'],
    supportOtherText: '',
    dataSources: ['Schulstatistiken (z. B. ASV/ASD)', 'Zentrale Lernstandserhebungen (z. B. VERA, BYLES, Lernstand 5, Orientierungsarbeiten)'],
    questionModules: [
      {
        id: '1',
        smartGoal: 'Steigerung der Deutsch-Kompetenzwerte um mindestens 15% bei den Schülerinnen und Schülern der 4. Jahrgangsstufe durch systematische Sprachförderung.',
        targetGroup: ['Alle Schülerinnen und Schüler', '4. Jahrgangsstufe'],
        targetGroupOther: '',
        subject: ['Deutsch'],
        subjectOther: '',
        dataSources: ['Zentrale Lernstandserhebungen (z. B. VERA, BYLES, Lernstand 5, Orientierungsarbeiten)'],
        dataSourcesOther: '',
        startDate: '2024-08-01',
        endDate: '2024-12-31',
        comments: 'Fokus auf individuelle Förderung mit differenzierten Materialien.',
      },
      {
        id: '2',
        smartGoal: 'Implementierung eines Wellbeing-Programms mit mindestens 80% Partizipation der Schülerinnen und Schüler bis Ende Q3 2024.',
        targetGroup: ['Alle Schülerinnen und Schüler'],
        targetGroupOther: '',
        subject: ['Soziales Lernen'],
        subjectOther: '',
        dataSources: ['Schulstatistiken (z. B. ASV/ASD)'],
        dataSourcesOther: '',
        startDate: '2024-09-01',
        endDate: '2025-03-31',
        comments: 'Unterstützung durch Schulpsychologie und Schulsozialarbeit.',
      },
    ],
    measureModules: [
      {
        id: '1',
        description: 'Implementierung eines strukturierten Deutsch-Förderprotokolls mit wöchentlichen Förderblöcken.',
        type: 'Unterricht/Förderung',
        responsible: 'Deutschlehrkräfte',
        involved: ['Schulsozialarbeiter', 'Sonderpädagoge'],
        resources: ['Förderblöcke: 2h/Woche', 'Differenziertes Unterrichtsmaterial', 'Lehrerfortbildung'],
        resourcesDescription: 'Kosten für externe Fortbildung ca. 2.000€, Materialien ca. 500€',
        workMethod: ['Kleingruppen-Förderung', 'Individuelle Lernpläne'],
        workMethodDescription: 'Regelmäßige Feedback-Schleifen und Anpassung der Lernziele alle 4 Wochen.',
        deadline: '2024-08-15',
      },
      {
        id: '2',
        description: 'Durchführung eines monatlichen Wellbeing-Workshops für alle Klassenstufen.',
        type: 'Schulentwicklung',
        responsible: 'Schulsozialarbeiter',
        involved: ['Klassenlehrer', 'Schulpsychologe'],
        resources: ['Raum und Zeit', 'Trainer/Moderator (extern)', 'Materialien'],
        resourcesDescription: 'Budget für externe Trainerin: 3.000€ für 8 Workshops',
        workMethod: ['Partizipative Workshops', 'Peer-Leadership-Modell'],
        workMethodDescription: 'Schülerinnen und Schüler werden als Multiplikatoren ausgebildet.',
        deadline: '2024-09-01',
      },
    ],
    selectedGoal: 'Erhöhte Anzahl an Schülerinnen und Schülern erreichen mithilfe entsprechender Basiskompetenzen die Mindeststandards in Deutsch.',
    evaluationDate: '2025-03-31',
    bilanzierungDate: '2025-06-30',
  },
};

export function AufsichtSubmissionView({ schulnummer, onNavigate }: AufsichtSubmissionViewProps) {
  const { role } = useFormContext();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const handleExport = async () => {
    try {
      await exportSubmissionAsDOCX(mockSubmission);
    } catch (error) {
      alert(`Export fehlgeschlagen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    }
  };

  if (!schulnummer) {
    return (
      <div>
        <p>Keine Schule ausgewählt.</p>
        <button onClick={() => onNavigate('new')}>Zurück zu neuen Einreichungen</button>
      </div>
    );
  }

  if (role === 'Schule' && mockSubmission.schulnummer !== schulnummer) {
    return (
      <div>
        <p>Diese Einreichung ist nicht verfügbar oder gehört zu einer anderen Schule.</p>
        <button onClick={() => onNavigate('new')}>Zurück zu neuen Einreichungen</button>
      </div>
    );
  }

  const data = mockSubmission.data;
  const { istStandAnalyse, supportPersonnel, supportTypes, dataSources, selectedGoal, questionModules = [], measureModules = [], evaluationDate, bilanzierungDate } = data;

  return (
    <div id="submission-content" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <Breadcrumb 
        items={[
          { label: 'Start', onClick: () => onNavigate('landing') },
          { label: 'Alle Einreichungen', onClick: () => onNavigate('all') },
          { label: schulnummer || 'Einreichung', onClick: () => schulnummer && onNavigate('view', schulnummer) }
        ]}
      />
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <h1>Zielvereinbarung überprüfen</h1>
          <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>
            Schulnummer: {mockSubmission.schulnummer}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <StatusBadge status={mockSubmission.status} />
          <button 
            onClick={handleExport} 
            style={{
              ...formStyles.button_secondary,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
            }}
          >
            <ExportWordIcon style={{ width: '1.4rem', height: '1.4rem', strokeWidth: '1.2' }} />
            Als Word exportieren
          </button>
        </div>
      </header>

      <div style={{ background: '#ffffff', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', fontSize: '0.9375rem' }}>
          <div>
            <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Eingereicht</div>
            <div style={{ color: '#666' }}>{formatDate(mockSubmission.createdAt)}</div>
          </div>
          <div>
            <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Zuletzt aktualisiert</div>
            <div style={{ color: '#666' }}>{formatDate(mockSubmission.updatedAt)}</div>
          </div>
          {mockSubmission.submittedAt && (
            <div>
              <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Status aktualisiert</div>
              <div style={{ color: '#666' }}>{formatDate(mockSubmission.submittedAt)}</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>IST-Stand Analyse</h2>
          <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>
            Grundlegende Erkenntnisse zur IST-Stand-Analyse in Kurzfassung
          </label>
          <div style={{ padding: '0.75rem', background: '#ffffff', border: '1px solid #ddd', borderRadius: '4px', whiteSpace: 'pre-wrap', fontSize: '1rem', lineHeight: '1.5' }}>
            {istStandAnalyse}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '2px solid #ddd' }} />

        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Unterstützungspersonal</h2>
          <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <strong>Unterstützungspersonal vorhanden?</strong> {supportPersonnel ? 'Ja' : 'Nein'}
            </div>
            {supportPersonnel && supportTypes.length > 0 && (
              <div>
                <strong>Arten:</strong>
                <ul style={{ margin: '0.5rem 0 0 1.5rem' }}>
                  {supportTypes.map(type => (
                    <li key={type}>{type}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Datenquellen</h2>
          {dataSources.length > 0 ? (
            <ul style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px', margin: 0 }}>
              {dataSources.map((source, index) => (
                <li key={index}>{source}</li>
              ))}
            </ul>
          ) : (
            <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>Keine Datenquellen ausgewählt</div>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '2px solid #ddd' }} />

        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Individualziele</h2>
          {questionModules.length > 0 ? (
            questionModules.map((module, index) => (
              <div 
                key={module.id}
                style={{ 
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  background: '#ffffff'
                }}
              >
                <h3 style={{ margin: '0 0 1rem 0' }}>Ziel {index + 1}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Ziel</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>{selectedGoal}</div>
                  </div>
                  <div>
                    <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>SMART-Ziel</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>{module.smartGoal}</div>
                  </div>
                  <div>
                    <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Zielgruppe</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>{module.targetGroup.join(', ')}</div>
                  </div>
                  <div>
                    <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Fachbereiche</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>{module.subject.join(', ')}</div>
                  </div>
                  <div>
                    <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Zeitpunkt für Zielerreichung</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', marginBottom: '0.25rem', color: '#666' }}>Startdatum</div>
                        <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>
                          {formatDateShort(module.startDate)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', marginBottom: '0.25rem', color: '#666' }}>Enddatum</div>
                        <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>
                          {formatDateShort(module.endDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Kommentare</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>{module.comments}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>Keine Individualziele definiert</div>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '2px solid #ddd' }} />

        <hr style={{ border: 'none', borderTop: '2px solid #ddd' }} />

        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Maßnahmen</h2>
          {measureModules.length > 0 ? (
            measureModules.map((module, index) => (
              <div 
                key={module.id}
                style={{ 
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  background: '#ffffff'
                }}
              >
                <h3 style={{ margin: '0 0 1rem 0' }}>Maßnahme {index + 1}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Beschreibung</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>{module.description}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Maßnahmentyp</label>
                      <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>{module.type}</div>
                    </div>
                    <div>
                      <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Termin</label>
                      <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>{formatDateShort(module.deadline)}</div>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Verantwortlich</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>{module.responsible}</div>
                  </div>
                  <div>
                    <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Beteiligte</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>{module.involved.join(', ')}</div>
                  </div>
                  <div>
                    <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Ressourcen</label>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>{module.resourcesDescription}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>Keine Maßnahmen definiert</div>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '2px solid #ddd' }} />

        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Evaluierungstermine</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Evaluierungstermin</label>
              <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>
                {evaluationDate ? formatDateShort(evaluationDate) : 'Nicht definiert'}
              </div>
            </div>
            <div>
              <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Bilanzierungstermin</label>
              <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>
                {bilanzierungDate ? formatDateShort(bilanzierungDate) : 'Nicht definiert'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
