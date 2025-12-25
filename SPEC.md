# SpecFlow — Product Specification

## Executive Summary

SpecFlow is an AI-powered tool that helps early-stage startups translate founder intent into developer-ready specifications. It acts as an intelligent layer between non-technical or semi-technical founders and their development team, reducing communication overhead, eliminating misunderstandings, and enabling small teams to move faster without hiring additional coordination roles (PM, BA).

**One-liner:** "Turn your feature ideas into clear specs through AI conversation — no PM required."

> **Note:** This document reflects the current implementation of SpecFlow as of the latest build.

---

## Problem Statement

### The Core Problem

Early-stage startups (3-15 people) waste significant time and resources on the gap between "founder has an idea" and "developer understands what to build."

### How This Manifests

1. **Founders explain the same thing multiple times** — in meetings, Slack, docs, and still get asked clarifying questions
2. **Developers build the wrong thing** — not from incompetence, but from ambiguous requirements
3. **Back-and-forth cycles** — "that's not what I meant" iterations add days/weeks to every feature
4. **Context gets lost** — why decisions were made, what edge cases were discussed, original intent
5. **Founders become bottlenecks** — they're the only ones who know the full picture
6. **Can't afford a PM** — but desperately need the function a PM serves

---

## Solution Overview

SpecFlow provides a conversational AI interface that:

1. **Guides founders** through structured intake to capture feature requirements
2. **Asks intelligent follow-up questions** to fill gaps and surface edge cases
3. **Generates comprehensive specs** with user stories, acceptance criteria, and scope boundaries
4. **Enables developer feedback** through section-level commenting
5. **Maintains living documentation** that evolves through spec regeneration from discussions
6. **Exports AI-ready prompts** for coding assistants like Claude, Cursor, and Copilot

### Key Value Propositions

- **For Founders:** "Describe what you want in plain language, get a spec your developers can actually use"
- **For Developers:** "Get clear requirements upfront, ask questions async, stop guessing what founder meant"
- **For the Startup:** "Move faster with fewer people, reduce costly misunderstandings"

---

## Target Users

### Primary: Startup Founders/CEOs

**Profile:**
- Running a 3-15 person startup
- Seed to Series A stage
- Technical enough to understand software but not writing code daily
- Currently filling PM role themselves (reluctantly)
- Time-starved, wears many hats

**Goals:**
- Stop repeating themselves
- Ship features that match their vision
- Spend less time on coordination, more on strategy
- Enable team to work more independently

### Secondary: Startup Developers

**Profile:**
- Engineer at early-stage startup
- Works directly with founder(s)
- Often has to guess at requirements
- May be remote/async from founder

**Goals:**
- Clear understanding of what to build before starting
- Reduce back-and-forth during development
- Written reference to check against
- Way to ask questions without scheduling meetings

---

## Feature Specifications

### Feature 1: Authentication & Project Setup

**Description:** Complete authentication system with role-based access and invite code team management.

#### Login
- Email and password authentication
- Demo credentials: `sarah.founder@example.com` / `password`
- Automatic redirect to dashboard on success
- Form validation with error feedback

#### Signup (Two Paths)

**Admin Signup (Create Project):**
1. Select "Create a new project"
2. Enter name, email, password, and project name
3. Creates organization with user as founder
4. Automatic login and redirect to dashboard

**Member Signup (Join Project):**
1. Select "Join an existing project"
2. Enter invite code and click "Verify"
3. System validates code (checks expiry, usage limits)
4. On success, shows organization name and unlocks remaining fields
5. Enter name, email, password, select role
6. Creates account linked to organization

#### User Roles & Permissions

| Role | Description | Permissions |
|------|-------------|-------------|
| Founder | Organization owner | Full access, cannot be removed or demoted |
| Admin | Team administrator | Manage team, settings, all features |
| PM | Project Manager | Manage features and specifications |
| BA | Business Analyst | Create and edit specifications |
| Developer | Engineer | View specs, add comments |
| Designer | Designer | View specs, add comments |

#### Invite Code System
- Codes have expiration dates
- Usage limits (e.g., max 10 uses)
- Track usage count
- Revoke active codes from Settings → Team

#### Protected Routes
Middleware protects: `/dashboard`, `/features/*`, `/settings`, `/notifications`

Public routes: `/`, `/login`, `/signup`

---

### Feature 2: Feature Request Creation

**Description:** Create new feature requests with optional context, then refine through AI conversation.

#### New Feature Form
**Route:** `/features/new`

1. Enter feature title (required, 3-100 characters)
2. Optionally add initial context (rough notes, ideas)
3. Submit creates feature in `draft` status
4. Auto-redirect to AI conversation

#### AI Conversation Interface
**Route:** `/features/[id]/conversation`

**UI Components:**
- Chat-like message interface
- User messages: Blue, right-aligned
- AI messages: Gray, left-aligned with avatar
- Thinking indicator during AI processing
- Auto-scroll to latest message
- Enter to send, Shift+Enter for new line

**Conversation Flow:**
1. AI initiates with greeting and first question
2. Questions cover:
   - Problem & context ("What problem does this solve?")
   - Target users ("Who will use this feature?")
   - Desired outcome ("What does success look like?")
   - Scope boundaries ("What's NOT included?")
   - Technical constraints
3. AI asks edge case questions based on context
4. AI summarizes understanding for confirmation
5. On completion, generates spec document
6. Feature status updated to `spec_generated`

**Completion State:**
- Green success card displayed
- "View Specification" button
- Input area disabled

---

### Feature 3: Spec Document Generation & Management

**Description:** AI generates structured specification from conversation with full editing and commenting capabilities.

#### Document Structure

| Section | Description | Editable |
|---------|-------------|----------|
| Overview | 2-3 sentence summary | Yes |
| Problem Statement | What problem this solves | Yes |
| User Stories | "As a [user], I want to [action]..." format | Yes (array) |
| Acceptance Criteria | Checkbox list of criteria | No |
| Scope: Included | What's in scope | Yes (array) |
| Scope: Excluded | What's explicitly out | Yes (array) |
| Technical Considerations | Technical requirements | Yes (array) |
| Edge Cases | Scenario/behavior table | No |
| Open Questions | Questions needing answers | Special UI |
| Assumptions | What was assumed | Yes (array) |

#### Spec Header
- Document title "Specification Document"
- Version number and generation date
- History button (circle icon, opens version sidebar)
- "Update Specification" button (when feedback exists)
- "Generate Prompt" button
- Version badge

#### Section Editing (Founder-only)
- Pencil icon on hover
- Click to enter edit mode
- Textarea for single/multiple values
- Array fields: one item per line
- Save/Cancel buttons
- Loading state during save

#### Section Commenting
- Comment count badge per section
- Click opens comments sidebar
- Threaded replies supported
- Mark comments as resolved
- Resolution status visible

---

### Feature 4: Spec Regeneration & Version History

**Description:** Update specifications based on team feedback with full version tracking.

#### Update Specification
**Trigger:** "Update Specification" button (enabled when resolved comments > 0 OR answered questions > 0)

**Workflow:**
1. Click button to open regeneration modal
2. System generates preview (analyzes feedback)
3. Preview shows:
   - Summary view: Changes grouped by type (Modified, Added, Removed)
   - Diff view: Side-by-side comparison with reasoning
   - Context summary: Resolved comments count, answered questions count
4. Review proposed changes with AI reasoning
5. Click "Approve & Apply Changes"
6. Version incremented, old version saved to history

#### Version History Sidebar
- Accessed via History button (circle icon)
- Lists all versions (newest first)
- Current version highlighted
- Each entry shows:
  - Version number
  - Change description
  - Date and creator
- Rollback button for previous versions
- Confirmation dialog before rollback
- Rollback creates new version (preserves history)

---

### Feature 5: Generate Prompt

**Description:** Export specification as AI-ready prompt for coding assistants.

#### Generated Prompt Structure (Markdown)
```
# Feature Implementation Request: [Title]

## Context
[Overview text]

## Problem Statement
[Problem description]

## User Requirements
[Numbered user stories]

## Acceptance Criteria
[Numbered criteria]

## Constraints & Technical Considerations
### Out of Scope
[Excluded items]

### Technical Requirements
[Technical considerations]

### Assumptions
[List of assumptions]

## Edge Cases to Handle
[Scenario: Expected behavior format]

## Design Notes & Decisions
[Answered questions in Q&A format]
[Resolved comments grouped by section]

## Implementation Notes
- Spec Version: [version]
- Last Updated: [date]
- Feature ID: [id]
```

#### Usage
1. Click "Generate Prompt" button
2. Preview sheet opens with generated markdown
3. Click "Copy to Clipboard"
4. Paste into Claude, Cursor, GitHub Copilot, etc.

---

### Feature 6: Open Questions Management

**Description:** Track and resolve questions within the specification.

#### Add Question
- "Add New Question" button in Open Questions section
- Enter question text
- Automatically records who asked

#### Question Item Display
- Question text with edit/delete buttons
- Answer section (or "Awaiting Answer" badge)
- Edit/add answer buttons
- "Mark as resolved" checkbox
- Color-coded borders:
  - Yellow/orange: Unresolved
  - Green: Resolved
- Shows askedBy/answeredBy metadata

#### Integration with Regeneration
- Answered questions automatically considered when regenerating spec
- AI incorporates answers into relevant sections

---

### Feature 7: Dashboard

**Description:** Central view of all feature requests with filtering and multiple view options.

**Route:** `/dashboard`

#### Tab-based Filtering
| Tab | Shows |
|-----|-------|
| All | All features with total count |
| Draft | Features in initial state |
| Spec Generated | Specs created, awaiting review |
| Ready to Build | Specs approved for implementation |
| Completed | Finished features |

#### View Modes
- **Grid View:** 3-column card layout (default)
- **List View:** Single-column compact display

#### Feature Card Information
- Status badge (color-coded)
- Feature title (links to detail page)
- Initial context excerpt (2-line truncate)
- Open questions count (if any)
- Assignee with avatar
- Last activity (relative time)

#### Empty States
- Helpful guidance when no features exist
- Prompts to create first feature

---

### Feature 8: Feature Detail Page

**Description:** Comprehensive view of a single feature request with tabs.

**Route:** `/features/[id]`

#### Header
- Breadcrumb navigation (Dashboard / Feature Title)
- Feature title and context
- "Back to Dashboard" button

#### Tabs

**Overview Tab:**
- Status dropdown (change status)
- Assignee dropdown (assign team member)
- Created by information
- Last activity timestamp
- Initial context card
- Quick actions: View/Start Conversation

**Specification Tab:**
- Full SpecView component (if spec exists)
- Empty state with prompt to complete conversation (if no spec)

**Comments Tab:**
- Placeholder for future team discussion feature
- Shows open questions count

**Activity Tab:**
- Timeline of feature lifecycle
- Creation event with creator avatar
- Status change events
- Relative timestamps

---

### Feature 9: Notifications

**Description:** Keep team informed of updates across the application.

#### Notification Types
| Type | Icon Color | Description |
|------|------------|-------------|
| feature_created | Purple | New feature created |
| spec_generated | Green | Specification ready |
| question_asked | Orange | New question on spec |
| question_answered | Blue | Question answered |
| status_changed | Yellow | Feature status updated |
| spec_updated | Indigo | Specification modified |

#### Notification Center (Header Dropdown)
- Bell icon with unread count badge
- Recent notifications preview (max 5)
- "Mark all as read" button
- Links to related content

#### Notifications Page
**Route:** `/notifications`

- Tabs: All / Unread
- Statistics cards (Total, Unread counts)
- Notification cards with:
  - Icon with color-coded background
  - Type badge
  - Title and message
  - Relative time
  - Link to related content
  - Unread indicator

---

### Feature 10: Settings

**Description:** Comprehensive settings page with role-based section visibility.

**Route:** `/settings`

#### Available to All Users

**Profile Settings:**
- Avatar display
- Name, email, role fields
- Save changes functionality

**Notification Settings:**
- Email notifications toggles:
  - New feature requests
  - Spec generated
  - Questions & answers
  - Status changes
- In-app notification options:
  - Desktop notifications
  - Sound alerts

**Security Settings:**
- Password change (current, new, confirm)
- Active sessions list
- Sign out functionality

**Appearance Settings:**
- Theme: Light, Dark, System
- Density: Compact, Default, Comfortable

**Integrations:**
- Slack (connected status)
- GitHub (connect available)
- Jira (connect available)
- Linear (connect available)

#### Admin-Only Sections

**Project Settings:**
- Project name and description
- Website URL
- Danger zone: Delete project

**Team Settings:**
- Generate new invite code
- Active invite codes table:
  - Code value
  - Expiry date
  - Usage (used/max)
  - Revoke button
- Team members list:
  - Avatar, name, email
  - Role badge
  - Remove button (founder protected)

**Billing Settings:**
- Current plan display (Pro Plan - $29/month)
- Change plan button
- Payment method (card ending in ...)
- Billing history with invoice downloads

---

## User Flows

### Flow 1: Founder Creates Feature Request
```
Dashboard → "Feature Request" button → Enter title & context →
Submit → AI Conversation → Answer questions →
Conversation completes → Spec generated → Review spec
```

### Flow 2: Developer Reviews Spec
```
Notification (spec ready) → Open feature → Specification tab →
Read through sections → Add comment on unclear section →
Wait for resolution → Mark spec as "Ready to Build"
```

### Flow 3: Team Provides Feedback & Spec Updates
```
Developer adds comments → Founder answers open questions →
Founder clicks "Update Specification" → Review proposed changes →
Approve changes → New spec version created
```

### Flow 4: Export Spec for AI Coding
```
Open feature → Specification tab → Click "Generate Prompt" →
Review generated markdown → Copy to clipboard →
Paste into Claude/Cursor/Copilot
```

---

## Information Architecture

```
SpecFlow
├── Dashboard
│   ├── Tab Filters (All, Draft, Spec Generated, Ready to Build, Completed)
│   ├── Grid/List View Toggle
│   └── Feature Cards
├── Feature Detail
│   ├── Overview Tab
│   │   ├── Status & Assignment
│   │   └── Quick Actions
│   ├── Specification Tab
│   │   ├── Spec Sections (editable)
│   │   ├── Comments Sidebar
│   │   ├── Version History
│   │   └── Generate Prompt
│   ├── Comments Tab (placeholder)
│   └── Activity Tab
├── New Feature
│   ├── Title & Context Form
│   └── AI Conversation Interface
├── Notifications
│   ├── All/Unread Tabs
│   └── Notification Cards
└── Settings
    ├── Profile
    ├── Notifications
    ├── Security
    ├── Appearance
    ├── Integrations
    ├── Project (admin)
    ├── Team (admin)
    └── Billing (admin)
```

---

## Feature Status Flow

```
draft → spec_generated → ready_to_build → completed
```

| Status | Description |
|--------|-------------|
| draft | Feature created, conversation not complete |
| spec_generated | AI conversation complete, spec document generated |
| ready_to_build | Team reviewed and approved spec |
| completed | Feature implemented |

---

## Technical Implementation

### Tech Stack
- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI primitives
- **State Management:**
  - Zustand (auth state with localStorage persistence)
  - TanStack React Query (server state and caching)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Authentication:** Cookie-based with middleware protection
- **Data Layer:** Mock API (designed for easy backend replacement)

### Key Files

**Types:**
- `src/shared/types/user.ts` - User and role types
- `src/shared/types/feature-request.ts` - Feature request types
- `src/shared/types/spec-document.ts` - Spec document types
- `src/shared/types/conversation.ts` - Conversation types
- `src/shared/types/comment.ts` - Comment types
- `src/shared/types/notification.ts` - Notification types

**API Layer:**
- `src/shared/api/auth.ts` - Authentication
- `src/shared/api/feature-requests.ts` - Feature CRUD
- `src/shared/api/conversations.ts` - AI conversations
- `src/shared/api/spec-documents.ts` - Spec management
- `src/shared/api/comments.ts` - Comments
- `src/shared/api/users.ts` - User management
- `src/shared/api/notifications.ts` - Notifications

**Features:**
- `src/features/auth/` - Login, signup forms
- `src/features/feature-requests/` - Dashboard cards, status badges
- `src/features/ai-conversation/` - Chat interface
- `src/features/spec-document/` - Spec view, editing, comments, regeneration
- `src/features/notifications/` - Notification center
- `src/features/layout/` - Sidebar, header

---

## Implementation Status

### Completed Features
- [x] User authentication (login, signup)
- [x] Role-based access control
- [x] Invite code team management
- [x] Organization/workspace setup
- [x] Feature request creation
- [x] AI-guided conversation interface
- [x] Spec document generation
- [x] Section-level spec editing
- [x] Section commenting with threads
- [x] Comment resolution tracking
- [x] Open questions management
- [x] Spec regeneration from discussions
- [x] Version history with rollback
- [x] Generate prompt for AI assistants
- [x] Dashboard with tab filtering
- [x] Grid/list view toggle
- [x] In-app notifications
- [x] Notification center dropdown
- [x] Settings (profile, notifications, security, appearance)
- [x] Admin settings (project, team, billing)
- [x] Integration placeholders (Slack, GitHub, Jira, Linear)

### Future Enhancements
- [ ] Real backend API integration
- [ ] Email notifications
- [ ] Slack integration (real)
- [ ] Linear/Jira integration
- [ ] Spec export (PDF, Markdown download)
- [ ] Voice input for conversations
- [ ] Analytics dashboard
- [ ] Custom AI training on company context

---

## Appendix: Demo Credentials

For testing the application:
- **Email:** sarah.founder@example.com
- **Password:** password

This logs in as Sarah Chen, Founder at TechStart Inc.

---

## Appendix: Competitive Landscape

| Product | What They Do | Gap SpecFlow Fills |
|---------|--------------|-------------------|
| Notion | General docs/wiki | No structure for specs, no AI guidance |
| Linear | Task tracking | Assumes specs exist, no creation help |
| Productboard | Feature prioritization | Enterprise, complex, expensive |
| Coda AI | AI in docs | General purpose, not spec-focused |
| Loom | Video explanations | One-way, not interactive, hard to reference |
| ChatGPT/Claude | General AI | No workflow, no persistence, no collaboration |

**SpecFlow's positioning:** Purpose-built for the founder→developer handoff, with AI that understands software requirements specifically.
