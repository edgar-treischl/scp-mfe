interface FooterProps {
  onNavigate?: (view: 'landing' | 'form' | 'history' | 'view' | 'about') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer
      style={{
        marginTop: '4rem',
        paddingTop: '2rem',
        paddingBottom: '1rem',
        borderTop: '1px solid #e0e0e0',
        textAlign: 'center',
        fontSize: '0.875rem',
        color: '#999',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
        <a
          href="https://github.com/edgar-treischl/scp-form-mfe"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#666',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#1E8AD9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#666';
          }}
        >
          Source
        </a>
        <button
          onClick={() => onNavigate?.('about')}
          style={{
            background: 'none',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            padding: 0,
            fontSize: '0.875rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#1E8AD9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#666';
          }}
        >
          Über diese App
        </button>
      </div>
    </footer>
  );
}
