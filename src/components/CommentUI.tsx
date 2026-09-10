import { useState } from 'react';
import { useFormContext } from '../context/formContextValue';

interface CommentTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  placeholder?: string;
}

export function CommentTextarea({
  value,
  onChange,
  onSave,
  onCancel,
  placeholder = 'Rückmeldung der Schulaufsicht ...',
}: CommentTextareaProps) {
  return (
    <div
      style={{
        marginTop: '0.75rem',
        padding: '0.75rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        border: '1px solid #dee2e6',
      }}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          minHeight: '90px',
          padding: '0.5rem',
          fontSize: '0.9rem',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          fontFamily: 'inherit',
          resize: 'vertical',
          boxSizing: 'border-box',
        }}
      />
      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '0.4rem 0.9rem',
            fontSize: '0.9rem',
            background: '#e9ecef',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#666',
          }}
        >
          Abbrechen
        </button>
        <button
          type="button"
          onClick={onSave}
          style={{
            padding: '0.4rem 0.9rem',
            fontSize: '0.9rem',
            background: '#1E8AD9',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            color: 'white',
          }}
        >
          Speichern
        </button>
      </div>
    </div>
  );
}

interface FieldCommentProps {
  fieldPath: string;
}

/**
 * Field-level feedback affordance:
 * - Schulaufsicht in review mode can add or edit a comment
 * - everyone else only reads an existing comment
 */
export function FieldComment({ fieldPath }: FieldCommentProps) {
  const { getFieldMode, comments, saveFieldComment } = useFormContext();
  const mode = getFieldMode();
  const existing = comments[fieldPath];
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(existing?.text ?? '');

  const canComment = mode === 'review';

  if (!canComment && !existing) return null;

  return (
    <div style={{ marginTop: '0.5rem' }}>
      {existing && (
        <div
          style={{
            padding: '0.6rem 0.75rem',
            background: '#fff8e1',
            borderLeft: '3px solid #ffc107',
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#333',
            whiteSpace: 'pre-wrap',
          }}
        >
          <strong style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', color: '#856404' }}>
            Rückmeldung {existing.authorRole}
          </strong>
          {existing.text}
        </div>
      )}

      {canComment && !isOpen && (
        <button
          type="button"
          onClick={() => {
            setDraft(existing?.text ?? '');
            setIsOpen(true);
          }}
          style={{
            marginTop: existing ? '0.5rem' : 0,
            padding: '0.35rem 0.7rem',
            fontSize: '0.85rem',
            background: 'transparent',
            border: '1px solid #1E8AD9',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#1E8AD9',
          }}
        >
          {existing ? 'Kommentar bearbeiten' : '+ Kommentar'}
        </button>
      )}

      {canComment && isOpen && (
        <CommentTextarea
          value={draft}
          onChange={setDraft}
          onSave={() => {
            void saveFieldComment(fieldPath, draft);
            setIsOpen(false);
          }}
          onCancel={() => {
            setDraft(existing?.text ?? '');
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}
