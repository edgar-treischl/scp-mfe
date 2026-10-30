import { colors } from './formStyles';

interface FormCalloutProps {
  title?: string;
  message?: string;
}

export function FormCallout({
  title = 'Hinweis',
  message = 'Wichtige Information',
}: FormCalloutProps) {
  const exampleData = [
    { question: 'Was zeigen die Daten?', indicator: 'Freitext' },
    { question: 'Zielerreichung', indicator: 'Single Choice' },
    { question: 'Begründung', indicator: 'u.a. Passgenauigkeit, Zeit, Personal' },

  ];

  return (
    <div style={{
      backgroundColor: '#e3f2fd',
      border: `2px solid ${colors.primary}`,
      borderRadius: '6px',
      padding: '1.5rem',
      marginTop: '2rem',
      marginBottom: '0',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{
          fontSize: '1.5rem',
          minWidth: '2rem',
          flexShrink: 0,
        }}>
          ℹ️
        </div>
        <div>
          <h3 style={{
            margin: '0 0 0.5rem 0',
            color: colors.primary,
            fontSize: '1.1rem',
            fontWeight: '600',
          }}>
            {title}
          </h3>
          <p style={{
            margin: '0 0 1rem 0',
            color: colors.text,
            fontSize: '0.95rem',
            lineHeight: '1.6',
          }}>
            {message}
          </p>

          <div style={{
            overflowX: 'auto',
            borderRadius: '4px',
            border: `1px solid ${colors.border}`,
            marginTop: '1rem',
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              fontSize: '0.9rem',
            }}>
              <thead>
                <tr style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                }}>
                  <th style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    borderBottom: `2px solid ${colors.primary}`,
                    width: '60%',
                  }}>
                    Frage
                  </th>
                  <th style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    borderBottom: `2px solid ${colors.primary}`,
                    width: '40%',
                  }}>
                    Indikatoren
                  </th>
                </tr>
              </thead>
              <tbody>
                {exampleData.map((row, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: index < exampleData.length - 1 ? `1px solid ${colors.border}` : 'none',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
                    }}
                  >
                    <td style={{
                      padding: '0.75rem',
                      borderRight: `1px solid ${colors.border}`,
                      color: colors.text,
                    }}>
                      {row.question}
                    </td>
                    <td style={{
                      padding: '0.75rem',
                      color: colors.text,
                    }}>
                      {row.indicator}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
