# Internal Form Prototype (MVP)

## Overview

Build a lightweight internal application as a **React Microfrontend** that allows users to create, edit, submit, and review a single fixed form.

The application is intended as a prototype and should prioritize simplicity, maintainability, and fast development over extensibility or advanced enterprise features.

The application will be embedded into an existing shell application (dash-shell), which is responsible for authentication and user identity.



# Goals

The application should enable users to:

- Start a new form
- Continue editing a draft
- Submit a completed form
- View previously submitted forms
- Export submissions as PDF/Word



# Scope

## In Scope

- Single fixed form (<20 fields)
- Client-side validation
- Draft support
- Autosave
- Submission history
- Export
- Optimistic locking
- Cloudflare-hosted backend

## Out of Scope

- Multiple form types
- Dynamic forms
- Multi-step wizard
- Workflow engine
- Role management
- Audit/version history
- Offline support
- Real-time collaboration

---

# Architecture

```text
┌─────────────────────┐
│ Shell Application   │
│ (Authentication)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ React Microfrontend │
├─────────────────────┤
│ Landing             │
│ Form                │
│ Submission History  │
└──────────┬──────────┘
           │ REST API
           ▼
┌─────────────────────┐
│ Cloudflare Worker   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Cloudflare D1       │
└─────────────────────┘
```

---

# Technology Stack

## Frontend

- React
- React Hook Form
- Zod
- TanStack Table
- Existing company design system (preferred)

## Backend

- Cloudflare Workers
- Cloudflare D1 (SQLite)

---

# User Flow

```text
Landing
│
├── New Form
│      │
│      ▼
│   Edit Form
│      │
│      ├── Autosave
│      └── Submit
│
└── Previous Submissions
       │
       ├── View
       ├── Continue Draft
       └── Export CSV
```

---

# Form

The prototype consists of a **single fixed form** containing fewer than 20 fields.

Features:

- Client-side validation
- Autosave after user changes
- Save status indicator
- Submit action

The form is not a wizard and should remain as simple as possible.


# Drafts

Drafts are automatically saved using a short debounce interval (e.g. 2 seconds).

Typical flow:

```text
User edits field
        │
        ▼
Debounce
        │
        ▼
PUT /submissions/{id}
        │
        ▼
✓ Saved
```



---

# Submission States

A submission can be in one of two states:

- Draft
- Submitted

Drafts remain editable.

Submitted forms are read-only.


# Data Model

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

The `data` property contains all form values.

---

# API

```
GET    /submissions
GET    /submissions/{id}

POST   /submissions

PUT    /submissions/{id}

POST   /submissions/{id}/submit

GET    /export
```

---

# Optimistic Locking

Although this is a prototype, optimistic locking should be implemented to prevent accidental overwrites.

Each submission contains a `version` field.

Example:

```
Client loads version 5

↓

Client updates submission

↓

PUT version = 5

↓

Worker validates version

↓

Success → version becomes 6
```

If another update has already occurred, the Worker returns a conflict (`409 Conflict`), allowing the UI to notify the user and reload the latest version.

---

# User Identity

The shell application provides the authenticated user context, which is used to associate submissions with their owner.

---

# Export

The application supports exporting submissions as CSV.

Additional export formats (Excel, PDF) are intentionally excluded from the MVP.

# Design Principles

- Keep the architecture lightweight.
- Avoid unnecessary abstractions.
- Prefer convention over configuration.
- Build only what is needed for the prototype.
- Ensure the solution can evolve into a production implementation if the MVP proves successful.


# Steps for this Project
1. Building the Frontend only
2. Cloudfare Worker as minimal backend later
