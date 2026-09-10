interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav 
      aria-label="Breadcrumb"
      className="breadcrumb-nav"
      style={{ 
        marginBottom: '1.5rem',
        fontSize: '1rem',
        color: '#666',
        padding: '0.75rem 0',
        border: 'none'
      }}
    >
      <ol style={{ 
        display: 'flex', 
        alignItems: 'center',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        gap: '0.5rem'
      }}>
        {items.map((item, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {index > 0 && (
              <span style={{ color: '#ddd' }}>/</span>
            )}
            {item.onClick ? (
              <button
                onClick={item.onClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1e8ad9',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                  fontSize: '1rem',
                  fontWeight: 500,
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#155fa4';
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#1e8ad9';
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                {item.label}
              </button>
            ) : (
              <span style={{ color: '#333', fontWeight: 500 }}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
