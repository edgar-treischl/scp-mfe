import type { ShellAppProps } from '../types';

interface LandingProps extends ShellAppProps {
  onNavigate: (view: 'landing' | 'select' | 'form' | 'history' | 'view' | 'new' | 'all') => void;
}

export function Landing({ onNavigate, shellContext }: LandingProps) {
  const forceHide = import.meta.env.VITE_FORCE_HIDE_ROLE_SELECTOR === 'true';
  const useLocal = import.meta.env.VITE_USE_LOCAL_ROLE_SELECTOR === 'true';
  const showStart = !!shellContext || (!forceHide && useLocal);

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

      {/* CTA to SelectPage */}
      {showStart && (
        <div style={{ marginBottom: '2.5rem', padding: '0 0.5rem' }}>
          <button
            onClick={() => onNavigate('select')}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#1E8AD9',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1674B5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1E8AD9';
            }}
          >
            Start
          </button>
        </div>
      )}

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

      <br/>
    </div>
  );
}
