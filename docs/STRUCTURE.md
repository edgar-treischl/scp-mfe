# Application Structure

This document describes the folder structure and organization of the scp-form-mfe application.

## Directory Structure

```
src/
├── pages/              # Main page components
│   ├── Landing.tsx           # Landing page with new form / view history
│   ├── FormEditor.tsx        # Form editing page with autosave
│   ├── SubmissionHistory.tsx # List of all submissions
│   ├── SubmissionView.tsx    # Read-only view of a submission
│   └── index.ts              # Exports all pages
│
├── components/         # Reusable UI components
│   ├── SaveIndicator.tsx     # Shows save status (saving/saved/error)
│   ├── StatusBadge.tsx       # Displays submission status (draft/submitted)
│   └── index.ts              # Exports all components
│
├── hooks/             # Custom React hooks
│   ├── useAutosave.ts        # Debounced autosave hook (2s delay)
│   └── index.ts              # Exports all hooks
│
├── types/             # TypeScript type definitions
│   ├── submission.ts         # Submission, FormData, SubmissionStatus types
│   └── index.ts              # Exports all types
│
├── utils/             # Utility functions and helpers
│   ├── api.ts                # API client (placeholder - not implemented)
│   └── index.ts              # Exports all utils
│
├── App.tsx            # Main app component with view routing
├── App.css            # Global app styles
├── main.tsx           # App entry point
└── index.css          # Global CSS reset and variables
```

## Current State

**Status:** Skeleton structure only - no functionality implemented yet.

All components are placeholder implementations showing the intended structure:
- Pages have basic layout but no real functionality
- API client throws "Not implemented" errors
- No routing configured (simple state-based view switching in App.tsx)
- No form validation or data handling

## Next Steps

When implementing features, you'll need to:

1. **Add dependencies:**
   ```bash
   yarn add react-hook-form zod @hookform/resolvers @tanstack/react-table
   ```

2. **Implement form validation:**
   - Define Zod schema in `types/`
   - Set up React Hook Form in `FormEditor.tsx`

3. **Add routing:**
   - Consider react-router or similar
   - Update App.tsx to use proper routing

4. **Implement API client:**
   - Connect to Cloudflare Workers backend (when ready)
   - Implement endpoints in `utils/api.ts`

5. **Build the actual form:**
   - Define form fields based on requirements
   - Add validation rules
   - Connect autosave hook

## Component Usage Examples

### SaveIndicator
```tsx
import { SaveIndicator } from './components';
<SaveIndicator status="saved" />
```

### StatusBadge
```tsx
import { StatusBadge } from './components';
<StatusBadge status="draft" />
```

### useAutosave Hook
```tsx
import { useAutosave } from './hooks';

useAutosave({
  data: formData,
  onSave: async (data) => {
    await api.updateSubmission(id, data, version);
  },
  delay: 2000 // optional, defaults to 2000ms
});
```
