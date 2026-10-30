# SCP Form MFE

A **React Microfrontend** for managing school oversight and improvement submissions. This application is exposed via Module Federation and consumed by `dash-shell` (the main shell application).

## Quick Start

### Prerequisites
- Node.js 18+ 
- Yarn 1.22+

### Installation & Development

```bash
# Install dependencies
yarn install

# Start development server (port 5174)
yarn dev

# Open browser to:
# http://localhost:5174/scp-form-mfe/
```

The app will be accessible with hot module replacement (HMR) enabled for instant feedback on changes.

### Building & Deployment

```bash
# Build for production
yarn build

# Preview production bundle
yarn preview

# Lint code
yarn lint

# Type check without build
tsc --noEmit
```

**Deployment:** Push to `main` branch → GitHub Actions triggers automatic deployment to GitHub Pages (`./dist` → `gh-pages` branch).

## What This App Does

This is a **form submission and review system** for schools:

- **Schule (Schools)** can:
  - Create and edit draft forms
  - Submit completed forms to oversight authority
  - View submission history and feedback

- **Aufsicht (Oversight Authority)** can:
  - Review and evaluate school submissions
  - Provide comments and feedback on form fields
  - Browse all submissions across schools

**Current Status:** Prototype with mock data (IndexedDB). Backend integration (Cloudflare Worker + D1) is planned but not yet implemented.

## Project Structure

See `docs/ARCHITECTURE.md` for detailed component hierarchy and data flow, or `docs/TERMINOLOGY.md` to understand domain concepts (Schule, Aufsicht, Submission, etc.).

```
src/
├── App.tsx                    # Main app entry, routing & initialization
├── context/                   # React Context (FormContext, ShellContext)
├── pages/                     # Routed page components
│   ├── FormEditor.tsx         # School form editing interface
│   ├── FormEval.tsx           # Oversight review interface
│   ├── SchuleSubmissionView.tsx
│   ├── AufsichtSubmissionView.tsx
│   └── Data.tsx               # Information page
├── components/                # Reusable UI components
├── utils/                     # Utilities (routing, initialization, etc.)
├── constants/                 # App constants (routes, config)
├── types/                     # TypeScript definitions
├── mocks/                     # Mock data for development
└── index.css                  # Global styles & CSS variables
```

## Key Technologies

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI framework | 18+ |
| **Vite** | Build tool & dev server | 5+ |
| **TypeScript** | Type safety | 5+ |
| **Module Federation** | Microfrontend isolation | @originjs/vite-plugin-federation |
| **IndexedDB** | Client-side data persistence | Browser native |
| **ESLint** | Code quality | 8+ |

## Development Guide

### Adding a New Component

1. Create component in `src/components/YourComponent.tsx`
2. Export from `src/components/index.ts`
3. Use in pages or other components

```typescript
// src/components/MyComponent.tsx
export const MyComponent: React.FC<MyComponentProps> = ({ prop }) => {
  return <div>{prop}</div>;
};

// src/components/index.ts
export { MyComponent } from './MyComponent';
```

### Routing

All routes defined in `src/constants/routes.ts`. Use the ROUTES constant and helper functions:

```typescript
// Navigate
const hash = generateHash(ROUTES.FORM);
window.location.hash = hash;

// Parse current route
const currentRoute = parseHashRoute();
```

Never hardcode route strings. See `docs/ARCHITECTURE.md` for routing pattern.

### Styling

- Global variables in `src/index.css` (--form-primary, --form-success, etc.)
- Component-level CSS in adjacent `.css` files
- Dark mode support via media query (see `src/index.css`)

```css
/* Use CSS variables */
.component {
  color: var(--form-primary);
  border: 1px solid var(--form-border);
}
```

### State Management

Use React Context for app-wide state:

```typescript
const { role, submission } = useContext(FormContext);
const { activeRole } = useContext(ShellContext);
```

See `src/context/FormContext.tsx` and `src/context/ShellContext.tsx` for available state and actions.

### Type Safety

Form-related types centralized in `src/types/form.ts`:

```typescript
import { Submission, FormData, Role } from '@/types/form';
```

Always use types from here instead of defining locally.

### Formatting & Linting

```bash
# Format with Prettier (config in .prettierrc)
yarn prettier --write .

# Lint with ESLint
yarn lint
```

Rules are configured in `eslint.config.js`. React best practices enforced automatically.

## Architecture Overview

### Microfrontend Integration

This app exposes a single `ScpApp` component via Module Federation:

```typescript
// In shell application (dash-shell)
const ScpApp = React.lazy(() => import('scp-form-mfe/ScpApp'));

<ScpApp />
```

**Base path:** `/scp-form-mfe/` (configured in `vite.config.ts`, required for GitHub Pages).

### Data Flow

```
Shell (authentication, navigation)
    ↓
FormContextProvider (form state, IndexedDB)
    ↓
Pages (FormEditor, FormEval, History, etc.)
    ↓
Components (FormCallout, ReviewField, etc.)
```

Backend (Cloudflare Worker + D1) integration planned for future phases.

### Database (Current)

- **Storage:** IndexedDB (browser-based)
- **Initialization:** One-time on app mount via `appInitialization.ts`
- **Mock data:** Loaded from `src/mocks/formData.ts` if empty
- **Future:** Replace with REST API calls to Cloudflare Worker

## Common Tasks

### Run Full Dev Workflow

```bash
# Install, lint, type-check, build, and run dev server
yarn install
yarn lint && tsc --noEmit && yarn build
yarn dev
```

### Check Before Commit

```bash
yarn lint              # 0 errors required
tsc --noEmit          # All types valid
yarn build            # Build succeeds
```

### Add New Page/Route

1. Create `src/pages/YourPage.tsx`
2. Add route to `ROUTES` in `src/constants/routes.ts`
3. Add case to switch in `src/App.tsx` renderView function
4. Export from `src/pages/index.ts`

### Debug State Issues

Use React DevTools browser extension:
- **React** tab: Inspect component props, state
- **Context** menu: Monitor FormContext and ShellContext changes

## Documentation

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System design, component hierarchy, data flow
- **[TERMINOLOGY.md](./docs/TERMINOLOGY.md)** - Domain concepts (Schule, Aufsicht, Submission, etc.)
- **[00_goal.md](./docs/00_goal.md)** - Feature scope and requirements
- **[STRUCTURE.md](./docs/STRUCTURE.md)** - Directory structure
- **[TESTING.md](./docs/TESTING.md)** - Testing strategy

## Known Limitations

- **No test suite** - Recommended additions: unit tests for utilities, component integration tests
- **Array index keys** - Some components use index as key (requires backend ID support)
- **No minification in dev** - Development bundle is larger but easier to debug
- **IndexedDB only** - Data lost on browser cache clear (part of MVP scope)

## Performance

- **Bundle size:** ~225KB gzipped (production)
- **Shared dependencies:** React and React-DOM shared across MFEs
- **CSS:** Single stylesheet (cssCodeSplit: false)
- **Minification:** Enabled in production builds

## Next Steps / Roadmap

### Phase 2: Backend Integration
- [ ] Cloudflare Worker for form submission API
- [ ] Cloudflare D1 for data persistence
- [ ] Optimistic locking (version-based conflict detection)
- [ ] REST API for CRUD operations

### Phase 3: Enhanced Features
- [ ] Client-side validation (Zod)
- [ ] Autosave with debounce
- [ ] Draft versioning and history
- [ ] Advanced search & filtering

### Phase 4: Scalability
- [ ] Break down FormEditor into sub-components
- [ ] Add comprehensive test suite
- [ ] Performance monitoring
- [ ] Accessibility audit and fixes

See `docs/00_goal.md` for full feature roadmap.

## Troubleshooting

### Development server won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules yarn.lock
yarn install
yarn dev
```

### Module Federation issues
- Ensure shell app has correct remote URL: `http://localhost:5174/scp-form-mfe/remoteEntry.js`
- Clear browser cache and hard refresh (Cmd+Shift+R on Mac)

### Data not persisting
- Check browser DevTools → Application → IndexedDB
- Verify mock data initialized in FormContext
- Check console for errors in appInitialization.ts

### Styling issues
- Ensure CSS variables defined in `src/index.css`
- Check for CSS specificity conflicts
- Verify .prettierrc and eslint.config.js applied

## Contributing

1. Create a feature branch from `main`
2. Follow linting rules: `yarn lint`
3. Type check: `tsc --noEmit`
4. Build locally: `yarn build`
5. Commit with meaningful messages
6. Submit PR for review

**Code style:**
- ESLint + Prettier configured for consistency
- TypeScript strict mode enabled
- React best practices enforced

## Support

Questions about the codebase?
- Check `docs/ARCHITECTURE.md` for system design
- Review `docs/TERMINOLOGY.md` for domain concepts
- Look at existing components for patterns and examples
