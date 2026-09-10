import React from 'react';

interface ReviewFieldProps {
  label: string;
  value?: string | string[] | boolean | null;
  children?: React.ReactNode;
}

export function ReviewField({ label, value, children }: ReviewFieldProps) {
  const isEmpty = !value && !children;
  
  let displayValue: React.ReactNode;
  
  if (children) {
    displayValue = children;
  } else if (Array.isArray(value)) {
    displayValue = value.length > 0 ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {value.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#64D4C6', fontWeight: 'bold' }}>✓</span>
            {item}
          </div>
        ))}
      </div>
    ) : (
      <span className="review-value-empty">(keine Angabe)</span>
    );
  } else if (typeof value === 'boolean') {
    displayValue = value ? 'Ja' : 'Nein';
  } else if (value) {
    displayValue = value;
  } else {
    displayValue = <span className="review-value-empty">(keine Angabe)</span>;
  }

  return (
    <div className="review-field">
      <label className="review-label">{label}</label>
      <div className={`review-value ${isEmpty ? 'review-value-empty' : ''}`}>
        {displayValue}
      </div>
    </div>
  );
}

interface ReviewChecklistProps {
  label: string;
  items: Array<{
    id: string;
    label: string;
    checked: boolean;
  }>;
}

export function ReviewChecklist({ label, items }: ReviewChecklistProps) {
  const checkedCount = items.filter(i => i.checked).length;
  
  return (
    <div className="review-field">
      <label className="review-label">
        {label} ({checkedCount} ausgewählt)
      </label>
      <div className="review-checklist">
        {items.map((item) => (
          <div
            key={item.id}
            className={`review-checklist-item ${item.checked ? 'checked' : 'unchecked'}`}
          >
            <div className="review-checklist-icon">
              {item.checked ? '✓' : ''}
            </div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ReviewSectionProps {
  title: string;
  children: React.ReactNode;
}

export function ReviewSection({ title, children }: ReviewSectionProps) {
  return (
    <div className="review-mode-container">
      <div className="review-mode-header">
        <span className="review-mode-header-badge">📖 Kommentarmodus</span>
        <h2 style={{ margin: 0 }}>Der Kommentarmodus ermöglicht Schulen eine Rückmeldung mit Hilfe von Anmerkungen und Kommentaren zu geben.</h2>
        <br/>
      </div>
      <p>Folgende Angaben wurden eingereicht:</p>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
