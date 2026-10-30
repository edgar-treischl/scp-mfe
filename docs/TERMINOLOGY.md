# Terminology Guide

## Domain Concepts

This application manages school oversight and improvement submissions. Understanding the key terms is essential for working with the codebase.

## Key Terms

### Schule (School)

A **Schule** is an educational institution submitting forms for oversight and improvement planning.

**Context in code:**
- `role: 'schule'` represents a school user
- Accesses: Form editing, submission history
- Pages: FormEditor, SchuleSubmissionView
- Permission: Can create and edit drafts, submit forms

**Example:**
```typescript
const isSchule = activeRole === 'schule';
// Schule user sees their own submission history
```

### Aufsicht (Oversight/Authority)

An **Aufsicht** (literal translation: "supervision" or "oversight") is an external authority responsible for:
- Reviewing school submissions
- Providing feedback and evaluation
- Monitoring compliance

**Context in code:**
- `role: 'aufsicht'` represents an oversight authority user
- Accesses: Submission review, evaluation, feedback
- Pages: FormEval, AufsichtSubmissionView
- Permission: Can view and evaluate submissions, provide comments

**Example:**
```typescript
const isAufsicht = activeRole === 'aufsicht';
// Aufsicht user sees all submissions across schools (review mode)
```

### Submission

A **Submission** is a complete form submission representing a school's response to oversight requirements.

**Data structure:**
```typescript
interface Submission {
  id: string;              // Unique identifier
  owner: string;           // School identifier
  status: 'draft' | 'submitted'; // Submission state
  version: number;         // Optimistic locking (conflict detection)
  createdAt: Date;         // Created timestamp
  updatedAt: Date;         // Last modified timestamp
  submittedAt?: Date;      // Submitted timestamp (if status=submitted)
  data: FormData;          // Form field values
}
```

**Lifecycle:**
1. **Draft** - Schule creates/edits form (not submitted)
2. **Submitted** - Schule finalizes and sends to Aufsicht
3. **Reviewed** - Aufsicht evaluates and provides feedback

### FormData

The actual form content structure. Contains:

```typescript
interface FormData {
  questions: QuestionModule[];     // Array of form sections
  measures: MeasureModule[];       // Action items/measures
  comments?: Record<string, Comment>; // Feedback by field
}
```

### QuestionModule

A section of form questions addressing a specific topic.

**Examples:**
- "Schulische Organisation" (School Organization)
- "Unterrichtsqualität" (Teaching Quality)
- "Personalentwicklung" (Staff Development)

**Properties:**
- `title` - Section heading
- `fields` - Array of individual form fields
- `type` - Category for grouping

### MeasureModule

Action items or improvement measures the school commits to.

**Examples:**
- "Implement digital classroom tools"
- "Establish peer review process"
- "Develop staff training plan"

**Properties:**
- `title` - Measure description
- `timeline` - Planned completion date
- `responsible` - Person/department responsible
- `status` - Draft, planned, in-progress, completed

### Comment

Feedback provided by Aufsicht on specific form fields.

**Used for:**
- Asking for clarification
- Providing suggestions
- Highlighting concerns

**Structure:**
```typescript
interface Comment {
  id: string;
  fieldId: string;        // Which field the comment is on
  author: string;         // Aufsicht user who created it
  text: string;           // Comment content
  createdAt: Date;
  resolved: boolean;      // Whether Schule addressed it
}
```

## Role-Based Features

### Schule (School) Access

**Can do:**
- Create new draft submissions
- Edit draft submissions
- View own submission history
- Delete draft submissions
- Submit completed form to Aufsicht
- View Aufsicht feedback/comments

**Cannot do:**
- View other schools' submissions
- Modify submitted forms
- Evaluate other schools
- Delete submitted submissions

**Key pages:**
- `FormEditor` - Edit current draft
- `SchuleSubmissionView` - View past submissions
- `FormEval` - Review Aufsicht feedback (read-only)

### Aufsicht (Oversight) Access

**Can do:**
- View all submitted forms (all schools)
- Add comments/feedback to fields
- Generate evaluation reports
- Filter submissions by school, date, status
- View submission history

**Cannot do:**
- Edit school data directly
- Create submissions on behalf of schools
- Delete any submissions
- Modify school comments

**Key pages:**
- `FormEval` - Review & evaluate submission
- `AufsichtSubmissionView` - Browse all submissions
- `Data` - Information & transparency page

## Field Mode States

Form fields can be in different display modes:

### Edit Mode
- Schule editing a draft submission
- Fields are interactive input components
- Changes auto-saved to IndexedDB

### Review Mode
- Schule viewing submitted form (read-only)
- Aufsicht reviewing submission
- Fields show submitted values
- Comments displayed alongside

### Locked Mode
- Submission is finalized and cannot be changed
- Display-only, no interactions possible

## Status Meanings

### Draft (`status: 'draft'`)
- Form not yet submitted
- Schule can edit, add/remove measures
- Not visible to Aufsicht
- Can be deleted by Schule

### Submitted (`status: 'submitted'`)
- Form sent to Aufsicht
- Schule cannot edit (in current iteration)
- Visible to Aufsicht for review
- Cannot be deleted by Schule

## Versioning & Optimistic Locking

**Why it matters:**
- Prevents concurrent edit conflicts
- When Aufsicht and Schule both modify, collision is detected

**How it works:**
```
1. Schule loads submission (version: 5)
2. Aufsicht loads same submission (version: 5)
3. Schule saves changes → version increments to 6
4. Aufsicht tries to save → server returns 409 Conflict (version mismatch)
5. Aufsicht must reload to see Schule's changes
```

**Current implementation:**
- Mock version tracking in IndexedDB
- Real versioning will be handled by Cloudflare Worker

## Navigation Concepts

### Landing Page
- Entry point, explains form purpose
- Role selection (if not pre-authenticated)

### Select Role
- Choose between Schule or Aufsicht (if user has multiple roles)
- Set context for entire session

### Form
- Main editing interface (Schule only)
- Shows current draft or new form

### History
- View past submissions
- Different views for Schule vs. Aufsicht

### Evaluation
- Aufsicht review mode
- Display feedback and comments

### Data / Information
- FAQ, governance, data usage policies
- Static content page

## Technical Mappings

### Role Enum
```typescript
type Role = 'schule' | 'aufsicht';
```

### View Type
```typescript
type ViewType = 'landing' | 'select' | 'form' | 'history' | 'eval' | 'data';
```

### Route Constants (in `constants/routes.ts`)
```typescript
const ROUTES = {
  LANDING: 'landing',
  SELECT: 'select',
  FORM: 'form',
  HISTORY: 'history',
  EVAL: 'eval',
  DATA: 'data',
  // ... more routes
};
```

## Common Code Patterns

### Checking User Role
```typescript
const { role } = useContext(FormContext);

if (role === 'schule') {
  // Show school-specific UI
}

if (role === 'aufsicht') {
  // Show oversight-specific UI
}
```

### Conditional Rendering by Role
```typescript
{isSchule && <FormEditor />}
{isAufsicht && <FormEval />}
```

### Field-Level Comments
```typescript
// In FormEditor
const fieldComments = comments[fieldId] || [];
// Display or edit comments for this field
```

## Future Concepts (Not Yet Implemented)

### Workflow State
- Planned: track submissions through approval workflow
- Statuses: pending, approved, rejected, resubmit

### Audit Trail
- Log all changes (who, what, when)
- View history of modifications

### Notifications
- Email alerts for new submissions
- Deadline reminders

### Dashboard
- Metrics: submission rates, completion rates
- Visualizations: status distribution

---

**Need clarification?** Refer to `docs/ARCHITECTURE.md` for system design context.
