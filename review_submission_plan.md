# Review & Feedback System - Implementation Plan

## Overview
A role-based review workflow for form submissions with two roles:
- **Schule** (School): Creates and edits submissions
- **Schulaufsicht** (Supervisor/Inspector): Reviews submissions and provides feedback

## Workflow

### Schule (School)
```
✏️ EDIT → [Submit for Review] → 👀 READONLY (awaiting feedback)
                                      ↓ (if changes requested)
                                   ✏️ EDIT → [Resubmit]
```

### Schulaufsicht (Supervisor)
```
🔍 REVIEW (add comments) → [Approve | Request Changes]
```

## Component Mode Pattern

All field components support three modes:

| Mode | Behavior | Comments |
|------|----------|----------|
| `edit` | Input enabled, user can modify | Hidden (not in review) |
| `review` | Input disabled, readonly value | ✅ Reviewer adds feedback via inline "+" button |
| `readonly` | Input disabled, readonly value | ✅ Can view existing feedback, optionally add notes |

### Mode Logic
- **Schule + draft** → `edit` mode
- **Schule + pending_review** → `readonly` mode
- **Schule + changes_requested** → `edit` mode (can re-edit)
- **Schulaufsicht + pending_review** → `review` mode (can add comments)
- **Schulaufsicht + approved** → `readonly` mode

## UI Pattern

**Inline Comments (No Sidebar):**
```
┌─────────────────────────────┐
│ First Name (readonly)   [+] │ ← "+" button to add/edit comment
│ John                        │
│ 💬 Feedback exists (badge)  │ ← Shows if comment exists
└─────────────────────────────┘

Click "+" → inline textarea appears:
┌─────────────────────────────┐
│ [Comment text area]         │
│ [Save] [Cancel]             │
└─────────────────────────────┘
```

## Data Model

### Submissions Table
```sql
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  status TEXT,  -- draft | pending_review | approved | changes_requested
  data JSON,    -- form field values
  createdAt TEXT,
  updatedAt TEXT,
  submittedBy TEXT,  -- Schule | Schulaufsicht
  createdBy TEXT
);
```

### Comments Table
```sql
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  submissionId TEXT,
  fieldPath TEXT,  -- e.g., "firstName" or null for form-level
  text TEXT,
  author TEXT,
  authorRole TEXT,  -- Schule | Schulaufsicht
  createdAt TEXT,
  resolved BOOLEAN
);
```

## Storage: Local SQLite (Prototype)
- Use **sql.js** (SQLite in WASM) or similar lightweight solution
- Store submissions + comments locally in browser
- **Later**: Replace with backend endpoints (API layer remains the same)

## Component Implementation

### FormField Component
```typescript
<FormField
  name="firstName"
  value={value}
  mode="edit" | "review" | "readonly"
  comment={comment}
  onCommentAdd={(text) => saveCommentToDB()}
  onValueChange={(value) => handleChange()}
/>
```

**Features:**
- Disabled input in review/readonly modes
- Comment badge shows if feedback exists
- "+" button to add/edit comment
- Inline textarea (no sidebar)
- Save/Cancel actions

### Form Context
- Tracks current role (Schule/Schulaufsicht)
- Tracks submission status
- Calculates mode based on role + status
- Provides comment save/load functions

### Role Selector (Prototype Only)
- Dropdown to switch between Schule and Schulaufsicht
- Simulates different user perspectives
- Will be removed when backend auth is added

## Implementation Roadmap

### Phase 1: Core Infrastructure
1. ✅ Add role dropdown selector
2. Setup SQLite (sql.js) with schema
3. Add `mode` prop to form field components
4. Create FormContext for state management

### Phase 2: Comment UI
1. Add inline comment button "+" to fields
2. Build comment textarea component
3. Implement comment save/load from SQLite
4. Show comment badges when feedback exists

### Phase 3: Workflow Actions
1. Add "Submit for Review" button (Schule, draft → pending_review)
2. Add "Approve" / "Request Changes" buttons (Schulaufsicht)
3. Add "Resubmit" button (Schule, changes_requested)
4. Update status in submissions table

### Phase 4: Polish & Testing
1. Role-based button visibility
2. Confirm state transitions work correctly
3. Test localStorage persistence across page reload

## Notes

- **No backend yet**: All data lives in local SQLite (in-browser)
- **Prototype scope**: Simple comment flow, no edit history, no nested replies
- **Future migration**: Comment/submission logic stays the same; only swap storage layer (SQLite → API endpoints)
- **Role switching**: Dropdown is for testing only; real implementation will use auth context

## Open Questions (To Refine)
- Should Schulaufsicht stay in review mode after approving, or auto-switch to readonly?
- Are comments create-only, or do reviewers need to edit/delete?
- Should form-level feedback be supported, or field-level only?
