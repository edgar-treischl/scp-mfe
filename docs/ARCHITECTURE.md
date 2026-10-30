# Architecture Guide

## Overview

This is a **React Microfrontend** built with Vite and Module Federation. It exposes form components to be consumed by a shell application (`dash-shell`) that handles authentication and navigation.

## Project Structure

```
src/
├── App.tsx                 # Main app entry point (routing, provider setup)
├── index.tsx              # React DOM mount
├── context/               # React Context providers
│   ├── FormContext.tsx    # Form state & submission management
│   └── ShellContext.tsx   # Shell integration (authentication, navigation)
├── pages/                 # Top-level page components (routed)
│   ├── FormEditor.tsx     # Main form editing interface
│   ├── FormEval.tsx       # Form evaluation/review view
│   ├── SchuleSubmissionView.tsx  # School submission history
│   ├── AufsichtSubmissionView.tsx # Oversight submission history
│   └── Data.tsx           # Information/data governance page
├── components/            # Reusable UI components
│   ├── FormCallout.tsx    # Form sections & callouts
│   ├── FormEvaluation.tsx # Evaluation display
│   ├── FormGoalsSummary.tsx # Goals summary
│   ├── ReviewField.tsx    # Field review display
│   ├── Breadcrumb.tsx     # Navigation breadcrumb
│   └── index.ts           # Component exports
├── hooks/                 # Custom React hooks
├── utils/                 # Utilities & helpers
│   ├── appInitialization.ts # One-time app setup
│   └── ...
├── mocks/                 # Mock data
│   └── formData.ts       # Sample submissions & interfaces
├── constants/             # App constants
│   └── routes.ts         # Route definitions & helpers
├── types/                 # TypeScript type definitions
│   └── form.ts           # Form-related interfaces
├── index.css             # Global styles & CSS variables
└── App.css               # App-level styles
```

## Core Concepts

### Routing & Navigation

The app uses **hash-based routing** (not browser history) to support both microfrontend and standalone deployment:

```
http://localhost:5174/scp-form-mfe/#landing
http://localhost:5174/scp-form-mfe/#select-role
http://localhost:5174/scp-form-mfe/#form
```

**Route Management:**
- All routes defined in `src/constants/routes.ts` (ROUTES constant)
- Helper functions: `parseHashRoute()` (parse current hash), `generateHash()` (create navigation links)
- App.tsx switch statement uses ROUTES constants, never hardcoded strings

### State Management

**Two Context providers:**

1. **FormContext** (`src/context/FormContext.tsx`)
   - Form submissions (CRUD operations)
   - Active submission & comments
   - Field mode (edit vs. review)
   - Uses IndexedDB for persistence (mock data on init if empty)

2. **ShellContext** (`src/context/ShellContext.tsx`)
   - Integration with shell application
   - User identity & authentication state
   - Active role (schule, aufsicht)
   - Navigation feedback to shell

### Component Hierarchy

```
App
├── ShellContextProvider
│   └── FormContextProvider
│       ├── Breadcrumb
│       └── Page (dynamic based on route)
│           ├── FormEditor
│           ├── FormEval
│           ├── SchuleSubmissionView
│           ├── AufsichtSubmissionView
│           └── Data
```

### Module Federation

**Configuration** (vite.config.ts):
- **Name:** `scp-form-mfe`
- **Exposed module:** `./ScpApp` → `./src/App.tsx`
- **Remote entry:** `remoteEntry.js`
- **Shared:** react, react-dom (singleton mode)
- **Port:** 5174 (dev & preview)

**Shell Integration:**
```javascript
// In shell application
const App = React.lazy(() => 
  import('scp-form-mfe/ScpApp')
);
```

### Data Flow

```
┌─────────────────┐
│  Shell App      │ (dash-shell)
│  - Auth         │
│  - Navigation   │
└────────┬────────┘
         │ passes ShellContext via provider
         ▼
┌──────────────────┐
│  scp-form-mfe    │
│  - FormContext   │
│  - LocalStorage  │
│  - IndexedDB     │
└────────┬─────────┘
         │ (future)
         ▼
┌──────────────────┐
│  Cloudflare      │
│  Worker + D1     │ (not yet implemented)
└──────────────────┘
```

## Key Design Patterns

### 1. One-Time Initialization

- `appInitialization.ts` wraps database init with flag
- Prevents duplicate initialization on re-mounts
- Called once in App.tsx useEffect

### 2. Route Constants Over Strings

- All routes in ROUTES constant (12 routes total)
- parseHashRoute(), generateHash() helpers
- Switch statement in App.tsx uses constants
- Benefits: IDE autocomplete, no typos, easy refactoring

### 3. Centralized Type Definitions

- Form types in `src/types/form.ts`
- Imported by components, reducers, utilities
- Single source of truth for interface contracts

### 4. CSS Variables & Design Tokens

- Global variables in `src/index.css`
- Colors: --form-primary, --form-success, --form-danger, --form-border, --form-bg
- Dark mode support via media query
- All component stylesheets inherit from root

### 5. Mock Data Extraction

- Mock submissions in `src/mocks/formData.ts`
- IndexedDB initialized on first app load
- Clean FormEditor.tsx (no data clutter)

## Base Path Configuration

**Critical for GitHub Pages:**
```typescript
// vite.config.ts
base: '/scp-form-mfe/'
```

All asset references and routing account for this prefix. The shell application must also be aware of this base path.

## Performance Considerations

- Module Federation shared dependencies reduce bundle bloat
- Lazy component loading possible via React.lazy (not currently used)
- CSS code split disabled (single stylesheet)
- Minification enabled in production (`vite.config.ts: minify: true`)
- IndexedDB for offline-capable data persistence

## Development Workflow

```bash
# Start dev server on port 5174 with HMR
yarn dev

# Build for production (creates dist/)
yarn build

# Preview production build
yarn preview

# Lint & type check
yarn lint
tsc --noEmit
```

## Testing Strategy

No tests currently configured. Recommended additions:
- Unit tests for utilities (route helpers, type guards)
- Component integration tests (FormEditor interactions)
- E2E tests for workflows (submit → history → review)

## Future Enhancements

1. **Backend Integration** (Cloudflare Worker + D1)
   - REST API for submissions
   - Optimistic locking (version-based)
   - Conflict detection (409 responses)

2. **Form Features**
   - Client-side validation (Zod)
   - Autosave with debounce
   - Draft versioning
   - Submission history filtering

3. **Breaking Down FormEditor**
   - Extract form sections into sub-components
   - Separate concerns (editing vs. display)
   - Reusable form section template

4. **Advanced State Management**
   - Consider Redux/Zustand for complex interactions
   - Normalized form data (currently flat)

See `docs/00_goal.md` for full feature scope.
