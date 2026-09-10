import { useFormContext } from '../context/formContextValue';

import { AddIcon, ManageIcon } from '../assets/icons';
import { formStyles } from '../components/formStyles';

// Mock data: new submissions for Schulaufsicht
const MOCK_NEW_SUBMISSIONS = [
  { schulnummer: '0001', status: 'draft' },
  { schulnummer: '0002', status: 'draft' },
  { schulnummer: '0004', status: 'draft' },
];


const contractSchoolName = 'Zauberberg Grundschule';
const contractSamt = 'Staatl. Schulamt Zauberberg';


interface LandingProps {
  onNavigate: (view: 'landing' | 'form' | 'history' | 'view' | 'new' | 'all') => void;
}

export function Landing({ onNavigate }: LandingProps) {
  const { role, setRole } = useFormContext();

  const logoLeft = new URL('../utils/assets/startchancen.png', import.meta.url).href;
  const logoRight = new URL('../utils/assets/isb_raute.png', import.meta.url).href;


  return (
    <div
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '1.5rem 1rem 2rem',
      }}
    >
      {/* Logo Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '0 0.5rem',
        }}
      >
        {/* Left Logo */}
        <img
          src={logoLeft}
          alt="Logo links"
          style={{
            height: '100px',
            width: 'auto',
            objectFit: 'contain',
          }}
        />

        {/* Right Logo */}
        <img
          src={logoRight}
          alt="Logo rechts"
          style={{
            height: '75px',
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Role Navigation */}
      <div style={{ marginBottom: '2.5rem', padding: '0 0.5rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#333',
            marginBottom: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            opacity: 0.8,
          }}
        >
          Auswahl der Rolle:
        </label>
        <nav className="role-switch" aria-label="Role selector">
          {[
            { key: 'Schule', label: 'Schule' },
            { key: 'Schulaufsicht', label: 'Schulaufsicht' },
          ].map((option) => (
            <button
              key={option.key}
              type="button"
              className={option.key === role ? 'role-tab is-active' : 'role-tab'}
              onClick={() => setRole(option.key as 'Schule' | 'Schulaufsicht')}
            >
              {option.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <h3>Prototyp</h3>

        <h1
          style={{
            fontSize: '2.5rem',
            margin: '0 0 1rem 0',
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          Ziel- und Handlungsvereinbarungs App
        </h1>
      </div>

      {/* Subfield for contract preview when role is "Schule" */}
      {role === 'Schule' && (
        <div style={formStyles.contractSection}>
          <div style={formStyles.contractPreview}>
            <p style={{ marginTop: 0, marginBottom: '1.5rem' }}>
              Diese App unterstützt Sie, Ziel- und Handlungsvereinbarungen (ZHV) im Rahmen des 
              Startchancen-Programms (SCP) zwischen der <span style={formStyles.contractValue}>{contractSchoolName}</span> und dem  <span style={formStyles.contractValue}>{contractSamt}</span> zu erstellen, zu verwalten und weiterzuentwickeln.
              
            </p>
            <p style={{ marginTop: 0, marginBottom: '1.5rem' }}>
              Sie können hier neue ZHV anlegen, Teilziele und Maßnahmen planen sowie den Umsetzungsstand dokumentieren. Bereits erstellte ZHV bleiben für Sie übersichtlich gespeichert und können bei Bedarf ergänzt oder aktualisiert werden.
            </p>
          </div>
        </div>
      )}

      {/* Subfield for contract preview when role is "Schulaufsicht" */}
      {role === 'Schulaufsicht' && (
        <div style={formStyles.contractSection}>
          <div style={formStyles.contractPreview}>
            <p style={{ marginTop: 0, marginBottom: '1.5rem' }}>
              Diese App bietet Ihnen als Schulaufsicht einen zentralen Überblick über die <span style={formStyles.contractValue}>Ziel- und Handlungsvereinbarungen (ZHV)</span> der Ihnen zugeordneten Schulen im 
               <span style={formStyles.contractValue}> Startchancen-Programm (SCP)</span> . 
            </p>
            <p style={{ marginTop: 0, marginBottom: '1.5rem' }}>
              Sie sehen auf einen Blick, welche ZHV {' '}
              <span style={formStyles.contractValue}>zur Kommentierung</span> vorliegen, welche zur {' '}
              <span style={formStyles.contractValue}>Genehmigung</span> eingereicht 
              wurden und welche bereits genehmigt sind. Für genehmigte ZHV können Sie die {' '}
              <span style={formStyles.contractValue}>Bilanzierung</span> initiieren, indem Sie einen Termin mit der Schule vereinbaren, um das Bilanzierungs-Formular 
              gemeinsam auszufüllen.
            </p>
          </div>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
        }}
      >
        {/* Show School features when role is "Schule" */}
        {role === 'Schule' && (
          <>
          {/* Schools: Previous Submission */}
            <div
              onClick={() => onNavigate('history')}
              style={{
                padding: '2rem',
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#64d4c6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              <ManageIcon style={{ width: '2rem', height: '2rem', color: '#64d4c6', marginBottom: '1rem' }} />
              <h2
                style={{
                  fontSize: '1.25rem',
                  margin: '0 0 0.5rem 0',
                  color: '#333',
                }}
              >
                Verwalten
              </h2>

              <p
                style={{
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  color: '#666',
                  margin: 0,
                }}
              >
                Zielvereinbarungen verwalten.
              </p>
            </div>

            {/* Schools: Start New Form */}
            <div
              onClick={() => onNavigate('form')}
              style={{
                padding: '2rem',
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1E8AD9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              <AddIcon style={{ width: '2rem', height: '2rem', color: '#1E8AD9', marginBottom: '1rem' }} />
              <h2
                style={{
                  fontSize: '1.25rem',
                  margin: '0 0 0.5rem 0',
                  color: '#333',
                }}
              >
                Neu
              </h2>

              <p
                style={{
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  color: '#666',
                  margin: 0,
                }}
              >
                Eine neue Zielvereinbarung anlegen.
              </p>
            </div>
          </>
        )}

        {/* Show Schulaufsicht features when role is "Schulaufsicht" */}
        {role === 'Schulaufsicht' && (
          <>
            {/* All Submissions Grid */}
            <div
              onClick={() => onNavigate('all')}
              style={{
                padding: '2rem',
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#64d4c6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              <ManageIcon style={{ width: '2rem', height: '2rem', color: '#64d4c6', marginBottom: '1rem' }} />
              <h2
                style={{
                  fontSize: '1.25rem',
                  margin: '0 0 0.5rem 0',
                  color: '#333',
                }}
              >
                Verwalten
              </h2>

              <p
                style={{
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  color: '#666',
                  margin: 0,
                }}
              >
                Abgeschlossene ZHV einsehen und bilanzieren.
              </p>
            </div>

          {/* New Submissions Grid */}
            <div
              onClick={() => onNavigate('new')}
              style={{
                padding: '2rem',
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1E8AD9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: '#1E8AD9',
                  borderRadius: '50%',
                  marginBottom: '1rem',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {MOCK_NEW_SUBMISSIONS.length}
              </div>
              <h2
                style={{
                  fontSize: '1.25rem',
                  margin: '0 0 0.5rem 0',
                  color: '#333',
                }}
              >
                Neu
              </h2>

              <p
                style={{
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  color: '#666',
                  margin: 0,
                }}
              >
                Neu eingereichte ZHV kommentieren.
              </p>
            </div>
          </>
        )}
      </div>
      <br/>
    </div>
  );
}
