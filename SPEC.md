# SpecFlow — Product Specification

## Executive Summary

SpecFlow is an AI-powered product development assistant that helps early-stage startups translate founder intent into developer-ready specifications. More than just a spec generator, SpecFlow acts as your **AI Product Manager** — understanding your product vision, target audience, and existing features to provide intelligent guidance, suggest UX improvements, and surface risks before development begins.

**One-liner:** "Your AI Product Manager — turn ideas into specs, get UX suggestions, and ship features that match your vision."

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
7. **No one to challenge ideas** — founders need pushback on UX decisions and feature scope, but small teams lack this perspective

---

## Solution Overview

SpecFlow provides an AI Product Manager that:

1. **Understands your product context** — learns your target audience, user personas, and product vision to provide relevant guidance
2. **Guides founders** through structured intake to capture feature requirements
3. **Challenges and improves ideas** — suggests better UX approaches, identifies potential issues, and proposes alternatives
4. **Maintains project awareness** — knows your existing features and flags conflicts or integration opportunities
5. **Generates comprehensive specs** with user stories, acceptance criteria, and scope boundaries
6. **Proactively identifies gaps** — creates open questions for ambiguities and can suggest answers based on product context
7. **Enables developer feedback** through section-level commenting
8. **Maintains living documentation** that evolves through spec regeneration from discussions
9. **Exports AI-ready prompts** for coding assistants like Claude, Cursor, and Copilot

### Key Value Propositions

- **For Founders:** "Describe what you want, get challenged on your assumptions, and receive a spec that's better than what you imagined"
- **For Developers:** "Get clear requirements upfront, with edge cases already considered and UX decisions documented"
- **For the Startup:** "Move faster with fewer people, reduce costly misunderstandings, and build better products"

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
- Get feedback on ideas before committing to build
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

### Feature 2: Project Context & AI Knowledge Base

**Description:** Configure project-level context that AI uses to provide relevant, informed guidance across all conversations.

#### Project Context Settings
**Route:** `/settings` → Project tab (Admin only)

**Configurable Fields:**
- **Product Description:** What the product does and its core value proposition
- **Target Audience:** Who the product is built for (industries, company sizes, roles)
- **User Personas:** Detailed descriptions of key user types with their goals, pain points, and behaviors
- **Product Vision:** Long-term direction and goals for the product
- **Technical Stack:** Technologies used (helps AI make relevant technical suggestions)
- **Design Principles:** UX guidelines and patterns the team follows

#### How AI Uses Project Context

The AI agent incorporates project context to:
1. **Tailor questions** — Asks about your specific user personas by name
2. **Suggest relevant UX patterns** — Based on your target audience and design principles
3. **Flag misalignments** — Notices when a feature doesn't fit your stated product vision
4. **Make informed trade-offs** — Understands technical constraints when suggesting solutions
5. **Maintain consistency** — References how similar problems were solved in existing features

#### Existing Features Context

AI automatically has awareness of:
- All completed feature specifications
- Their scope, user stories, and technical considerations
- How features relate to each other

This enables:
- **Conflict detection:** "This overlaps with your existing Invite System — should they share the flow?"
- **Integration suggestions:** "Your Analytics feature already tracks user sessions, you could leverage that here"
- **Consistency enforcement:** "In your Team Management feature, admins have this permission. Should it work the same way here?"

---

### Feature 3: Feature Request Creation & AI Conversation

**Description:** Create new feature requests and refine them through intelligent AI conversation that goes beyond simple Q&A.

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

**Conversation Capabilities:**

The AI agent acts as a **product development partner**, not just a question-asker:

| Capability | Description |
|------------|-------------|
| **Structured Discovery** | Guides through problem, users, requirements, scope, technical considerations |
| **UX Suggestions** | Proposes better approaches: "Instead of a modal, consider an inline expansion — it's less disruptive for this use case" |
| **Alternative Solutions** | Offers options: "You could solve this three ways: A) ..., B) ..., C) ... — given your target audience, I'd recommend B because..." |
| **Risk Identification** | Flags potential issues: "This could create confusion with your existing notification system" |
| **Scope Guidance** | Helps right-size features: "This sounds like it could be split into two phases. For v1, I'd suggest focusing on..." |
| **Persona-Aware Questions** | References your defined personas: "How should this work for your 'Technical Admin' persona vs. 'Business User'?" |
| **Conflict Detection** | Notices overlaps: "Your Team Settings feature already has role management. Should this extend it or work separately?" |

**Conversation Flow:**
1. AI initiates with greeting, acknowledges feature context and relevant existing features
2. Discovery questions covering:
   - Problem & context ("What problem does this solve?")
   - Target users ("Which of your personas will use this most?")
   - Desired outcome ("What does success look like?")
   - Scope boundaries ("What's NOT included?")
   - Technical constraints
3. **AI suggests improvements** throughout the conversation
4. AI asks edge case questions based on context
5. AI summarizes understanding and **recommendations** for confirmation
6. On completion, generates spec document with AI suggestions incorporated
7. Feature status updated to `spec_generated`

**Completion State:**
- Green success card displayed
- "View Specification" button
- Input area disabled

---

### Feature 4: Spec Document Generation & Management

**Description:** AI generates structured specification from conversation, including its recommendations and identified gaps.

#### Document Structure

| Section | Description | Editable |
|---------|-------------|----------|
| Overview | 2-3 sentence summary | Yes |
| Problem Statement | What problem this solves | Yes |
| User Stories | "As a [user], I want to [action]..." format | Yes (array) |
| Acceptance Criteria | Checkbox list of criteria | No |
| Scope: Included | What's in scope | Yes (array) |
| Scope: Excluded | What's explicitly out | Yes (array) |
| Technical Considerations | Technical requirements and suggestions | Yes (array) |
| Edge Cases | Scenario/behavior table | No |
| AI Recommendations | UX and implementation suggestions from AI | Read-only |
| Open Questions | Questions needing answers (from AI and team) | Special UI |
| Assumptions | What was assumed | Yes (array) |

#### AI Recommendations Section (New)

Displays suggestions the AI made during conversation:
- **UX Recommendations:** Better interaction patterns, flow improvements
- **Implementation Suggestions:** Technical approaches, reusable components
- **Risk Mitigations:** How to handle identified risks
- **Future Considerations:** What to think about for v2

Each recommendation includes:
- The suggestion
- Rationale (why AI recommended this)
- Status: Accepted / Rejected / Pending
- Founder can accept/reject with optional notes

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

### Feature 5: Open Questions Management (Enhanced)

**Description:** Track and resolve questions within the specification — now with AI participation.

#### Question Sources

| Source | Description |
|--------|-------------|
| **AI-Generated** | Questions AI identified during conversation as needing clarification |
| **Team Members** | Questions added by developers, designers, or other team members |
| **AI-Suggested Answers** | AI can propose answers to team questions based on product context |

#### AI-Generated Questions

During spec generation, AI creates open questions for:
- Ambiguities it couldn't resolve from conversation
- Edge cases that need founder decision
- Technical decisions that depend on team preference
- UX choices with multiple valid approaches

Example AI questions:
- "Should failed payment attempts show the specific error or a generic message? (Security vs. UX trade-off)"
- "If a user is in multiple teams, which team's settings take precedence?"
- "What's the expected load? This affects whether we need pagination on day one."

#### AI-Suggested Answers

When team members ask questions, AI can suggest answers:
1. Team member adds question: "What happens if the user loses connection mid-upload?"
2. AI analyzes product context and similar features
3. AI suggests: "Based on your Upload feature in Documents, you handle this with auto-resume. Recommend the same pattern here."
4. Founder can accept, modify, or provide different answer

#### Question Item Display
- Question text with source badge (AI / Team Member name)
- Answer section (or "Awaiting Answer" badge)
- **AI Suggested Answer** (if available) with accept/modify buttons
- Edit/add answer buttons
- "Mark as resolved" checkbox
- Color-coded borders:
  - Yellow/orange: Unresolved
  - Blue: Has AI suggestion
  - Green: Resolved
- Shows askedBy/answeredBy metadata

#### Integration with Regeneration
- Answered questions automatically incorporated when regenerating spec
- AI incorporates answers into relevant sections
- Accepted AI suggestions reflected in updated spec

---

### Feature 6: Spec Regeneration & Version History

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
   - **AI's additional suggestions** based on the feedback
4. Review proposed changes with AI reasoning
5. Click "Approve & Apply Changes"
6. Version incremented, old version saved to history

#### AI Enhancement During Regeneration

When regenerating, AI may:
- Suggest additional changes based on feedback patterns
- Identify inconsistencies introduced by edits
- Recommend updates to related sections
- Flag if changes conflict with existing features

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

### Feature 7: Generate Prompt

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

## AI Recommendations (Accepted)
[Accepted UX and implementation suggestions]

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

### Feature 8: Dashboard

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
- **AI suggestions count** (pending review)
- Assignee with avatar
- Last activity (relative time)

#### Empty States
- Helpful guidance when no features exist
- Prompts to create first feature

---

### Feature 9: Feature Detail Page

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
- **AI Insights card** (key suggestions, risks identified)
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
- AI suggestion events
- Relative timestamps

---

### Feature 10: Notifications

**Description:** Keep team informed of updates across the application.

#### Notification Types
| Type | Icon Color | Description |
|------|------------|-------------|
| feature_created | Purple | New feature created |
| spec_generated | Green | Specification ready |
| question_asked | Orange | New question on spec |
| question_answered | Blue | Question answered |
| ai_suggestion | Cyan | AI suggested an answer to a question |
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

### Feature 11: Settings

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
  - AI suggestions
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
- **Product Context Configuration:**
  - Target audience description
  - User personas (add/edit/remove)
  - Product vision statement
  - Technical stack
  - Design principles
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
Submit → AI Conversation (with suggestions & challenges) →
Answer questions, consider AI recommendations →
Conversation completes → Spec generated with AI recommendations →
Review spec, accept/reject suggestions
```

### Flow 2: Developer Reviews Spec
```
Notification (spec ready) → Open feature → Specification tab →
Read through sections including AI recommendations →
Add comment on unclear section → See AI suggested answer →
Accept or provide own answer → Mark spec as "Ready to Build"
```

### Flow 3: Team Provides Feedback & Spec Updates
```
Developer adds comments/questions → AI suggests answers →
Founder reviews suggestions, answers remaining questions →
Founder clicks "Update Specification" → AI proposes additional improvements →
Review all changes → Approve → New spec version created
```

### Flow 4: Export Spec for AI Coding
```
Open feature → Specification tab → Click "Generate Prompt" →
Review generated markdown (includes accepted AI recommendations) →
Copy to clipboard → Paste into Claude/Cursor/Copilot
```

### Flow 5: Configure Product Context
```
Settings → Project tab → Edit Product Context →
Add target audience, user personas, vision →
Save → AI now uses this context in all conversations
```

---

## Information Architecture

```
SpecFlow
├── Dashboard
│   ├── Tab Filters (All, Draft, Spec Generated, Ready to Build, Completed)
│   ├── Grid/List View Toggle
│   └── Feature Cards (with AI insights indicator)
├── Feature Detail
│   ├── Overview Tab
│   │   ├── Status & Assignment
│   │   ├── AI Insights Summary
│   │   └── Quick Actions
│   ├── Specification Tab
│   │   ├── Spec Sections (editable)
│   │   ├── AI Recommendations Section
│   │   ├── Open Questions (with AI suggestions)
│   │   ├── Comments Sidebar
│   │   ├── Version History
│   │   └── Generate Prompt
│   ├── Comments Tab (placeholder)
│   └── Activity Tab
├── New Feature
│   ├── Title & Context Form
│   └── AI Conversation Interface (enhanced)
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
    │   └── Product Context Configuration
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

## AI Agent Capabilities Summary

| Capability | Description |
|------------|-------------|
| **Product Context Awareness** | Knows your target audience, personas, vision, and existing features |
| **Intelligent Discovery** | Asks targeted questions based on your specific product |
| **UX Suggestions** | Proposes better user experiences based on best practices and your design principles |
| **Alternative Solutions** | Offers multiple approaches with recommendations |
| **Conflict Detection** | Identifies overlaps with existing features |
| **Risk Identification** | Flags potential issues before development |
| **Scope Guidance** | Helps right-size features, suggests phasing |
| **Open Question Generation** | Creates questions for ambiguities it couldn't resolve |
| **Answer Suggestions** | Proposes answers to team questions based on product context |
| **Consistency Enforcement** | Ensures new features align with existing patterns |

---

## Technical Implementation

### Tech Stack
- **Frontend:** Next.js 16 with App Router, TypeScript, Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI primitives
- **State Management:** Zustand (auth), TanStack React Query (server state)
- **Forms:** React Hook Form + Zod validation
- **Backend:** Fastify with TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **AI:** Claude 3.5 Sonnet via Anthropic API
- **Authentication:** Cookie-based with middleware protection

### AI Integration Details
- **Prompt Caching:** System prompts cached for 90% token savings on subsequent messages
- **Context Snapshot:** Project context stored at conversation start, not rebuilt per message
- **Token Budget:** ~10k tokens per request (system: 2k, context: 2k, history: 4k, response: 2k)
- **Structured Output:** Tool use for reliable JSON responses

---

## Implementation Status

### Completed Features
- [x] User authentication (login, signup)
- [x] Role-based access control
- [x] Invite code team management
- [x] Organization/workspace setup
- [x] **Product context configuration**
- [x] **User personas management**
- [x] Feature request creation
- [x] **Enhanced AI conversation with suggestions**
- [x] **AI UX and solution recommendations**
- [x] **Conflict detection with existing features**
- [x] Spec document generation
- [x] **AI recommendations section in specs**
- [x] Section-level spec editing
- [x] Section commenting with threads
- [x] Comment resolution tracking
- [x] Open questions management
- [x] **AI-generated open questions**
- [x] **AI-suggested answers to questions**
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
- [ ] Email notifications
- [ ] Slack integration (real)
- [ ] Linear/Jira integration (create tickets from specs)
- [ ] Spec export (PDF, Markdown download)
- [ ] Voice input for conversations
- [ ] Analytics dashboard (specs created, cycle time, etc.)
- [ ] AI learning from accepted/rejected suggestions
- [ ] Multi-project support

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
| ChatGPT/Claude | General AI | No workflow, no persistence, no product context |
| **SpecFlow** | AI Product Manager | Purpose-built for founder→developer handoff with persistent product context, UX suggestions, and conflict detection |

**SpecFlow's positioning:** Your AI Product Manager that knows your product, challenges your ideas, and produces developer-ready specs — not just a chatbot that takes notes.