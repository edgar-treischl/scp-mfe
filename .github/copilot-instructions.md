# Copilot Instructions for scp-form-mfe

## Project Overview

This is a **React Microfrontend** prototype for an internal form application. It exposes components via Module Federation and is designed to be embedded into a shell application (`dash-shell`) that handles authentication.

**Key characteristics:**
- Lightweight prototype prioritizing simplicity and fast development
- Single fixed form (<20 fields)
- Deployed to GitHub Pages
- Will later integrate with Cloudflare Workers backend (not yet implemented)

## Build, Test, and Lint Commands

```bash
# Development server (port 5174)
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Lint all files
yarn lint

# Type check (without build)
tsc --noEmit
```

**Note:** There are currently no test scripts configured.

## Architecture

### Module Federation Setup

This is a Vite-based microfrontend using `@originjs/vite-plugin-federation`:

- **Exposed module:** `./App` → `./src/App.tsx`
- **Remote entry:** `remoteEntry.js`
- **Shared dependencies:** `react`, `react-dom`
- **Port:** 5174 (both dev and preview)

The shell application consumes this microfrontend via the exposed `./App` component.

### GitHub Pages Deployment

**Critical:** The app has a base path configuration for GitHub Pages:

```typescript
// vite.config.ts
base: '/scp-form-mfe/'
```

All routing and asset paths must account for this base path. This affects:
- Public assets references
- Any future routing implementation
- API calls (if using relative URLs)

### Planned Data Flow

```
┌─────────────────────┐
│ Shell Application   │
│ (Authentication)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ React Microfrontend │ ← This codebase
│ (scp-form-mfe)      │
└──────────┬──────────┘
           │ REST API (not yet implemented)
           ▼
┌─────────────────────┐
│ Cloudflare Worker   │ ← Future backend
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Cloudflare D1       │
└─────────────────────┘
```

**Current status:** Frontend-only scaffold. Backend integration is planned but not implemented.

## Planned Features (Not Yet Implemented)

The prototype will include:

- **Form features:**
  - Client-side validation (Zod)
  - Autosave with debounce (~2 seconds)
  - Draft support
  - Submission history

- **Data model:**
  ```typescript
  Submission {
    id: string
    owner: string
    status: "draft" | "submitted"
    version: number
    createdAt: Date
    updatedAt: Date
    submittedAt?: Date
    data: FormData
  }
  ```

- **Optimistic locking:** Version-based conflict detection (409 on mismatch)

- **Future dependencies:** React Hook Form, Zod, TanStack Table

See `/docs/00_goal.md` for complete requirements and scope.

## Key Conventions

### TypeScript Configuration

- **Target:** ES2023
- **Module:** ESNext with bundler resolution
- **JSX:** react-jsx (new JSX transform)
- **No emit:** Vite handles bundling
- Strict unused locals/parameters checking enabled

### Build Configuration

```typescript
// vite.config.ts build options
{
  target: 'esnext',
  cssCodeSplit: false,
  minify: false,  // Disabled for debugging
}
```

### Server Configuration

- CORS enabled for microfrontend consumption
- Host exposed (accessible externally)
- Fixed port 5174 for consistent federation

## Development Workflow

1. **Starting development:**
   ```bash
   yarn install
   yarn dev
   ```
   The app will be available at `http://localhost:5174/scp-form-mfe/`

2. **Making changes:**
   - Edit `src/App.tsx` for the main component
   - Hot Module Replacement (HMR) is enabled

3. **Before committing:**
   ```bash
   yarn lint
   tsc --noEmit  # Type check
   yarn build    # Ensure it builds
   ```

4. **Deployment:**
   - Push to `main` branch triggers automatic GitHub Pages deployment
   - Built artifact goes to `./dist`
   - Deployment managed by `.github/workflows/deploy.yml`

## Important Constraints

**Out of scope for MVP:**
- Multiple form types or dynamic forms
- Multi-step wizards
- Workflow engine
- Role management or advanced permissions
- Audit/version history beyond optimistic locking
- Offline support
- Real-time collaboration

Keep the implementation simple and avoid over-engineering. This is a prototype to validate the concept.
