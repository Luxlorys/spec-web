# SpecFlow Development TODO

> Priority development items with implementation suggestions

---

## 1. Task Breakdown Feature (Product Idea → Feature Requests)

**Goal:** Allow founders to input a raw product idea and have AI break it down into individual, well-scoped feature requests with dependencies and priorities.

### Why This Matters
- Founders often have a big vision but struggle to structure it into buildable pieces
- Current flow assumes founder already knows what features they need
- This becomes the natural "entry point" for new users

### Implementation Approach

#### Option A: Separate Breakdown Flow (Recommended)
Add a parallel path alongside the existing feature request flow.

**New Routes:**
- `/breakdown/new` — Form to capture idea title + vision
- `/breakdown/[id]` — Breakdown detail page
- `/breakdown/[id]/conversation` — AI breakdown conversation

**Database Changes:**
```prisma
model Breakdown {
  id            String   @id @default(cuid())
  title         String
  vision        String   @db.Text
  status        BreakdownStatus @default(in_progress)
  organizationId String
  createdById   String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  organization  Organization @relation(fields: [organizationId], references: [id])
  createdBy     User @relation(fields: [createdById], references: [id])
  features      Feature[]
  messages      BreakdownMessage[]
}

enum BreakdownStatus {
  in_progress
  completed
  partially_specified
  fully_specified
}

model BreakdownMessage {
  id          String   @id @default(cuid())
  breakdownId String
  role        MessageRole
  content     String   @db.Text
  createdAt   DateTime @default(now())

  breakdown   Breakdown @relation(fields: [breakdownId], references: [id])
}

// Add to existing Feature model:
model Feature {
  // ... existing fields
  breakdownId   String?
  priority      Priority?
  complexity    Complexity?
  dependencies  Feature[] @relation("FeatureDependencies")
  dependents    Feature[] @relation("FeatureDependencies")

  breakdown     Breakdown? @relation(fields: [breakdownId], references: [id])
}

enum Priority {
  P0
  P1
  P2
}

enum Complexity {
  S
  M
  L
}
```

**UI Flow:**
1. Dashboard gets a toggle or tabs: "Features" | "Breakdowns"
2. "New Breakdown" button opens `/breakdown/new`
3. Form captures:
   - Title (required)
   - Vision/description (required, min 50 chars)
   - Known components (optional textarea)
4. Submit → redirect to `/breakdown/[id]/conversation`
5. AI conversation with special "breakdown" system prompt
6. Conversation ends with proposed feature list (rendered as interactive cards)
7. Founder can: accept, reject, merge, split, reorder features
8. "Create All Features" button batch-creates features with `breakdownId` link

**AI System Prompt Addition:**
```
You are helping break down a product idea into feature requests.

Your goals:
1. Understand the overall vision and target users
2. Identify distinct, buildable feature areas
3. Determine dependencies between features
4. Suggest priorities (P0 = must have, P1 = should have, P2 = nice to have)
5. Estimate complexity (S = 1-2 days, M = 3-5 days, L = 1-2 weeks)

Output format for final breakdown:
- Use structured JSON with tool_use for reliable parsing
- Each feature: { title, description, priority, complexity, dependsOn: [] }
```

**Reuse Existing Components:**
- Chat interface from `/features/[id]/conversation`
- Message components (user/AI bubbles)
- Thinking indicator
- Dashboard card layout (adapt for breakdown cards)

#### Option B: Inline Detection (Simpler, Less Control)
Detect when a feature request is actually multiple features during the existing conversation.

- During feature conversation, AI notices scope is too large
- AI suggests: "This sounds like 3-4 separate features. Want me to break it down?"
- If yes, conversation pivots to breakdown mode
- Creates multiple features from single conversation

**Pros:** No new routes, simpler
**Cons:** Less intentional UX, harder to manage breakdown as entity

### Recommended First Steps
1. Add `Breakdown` model and relations to Prisma schema
2. Create `/breakdown/new` page (copy/adapt from `/features/new`)
3. Create `/breakdown/[id]/conversation` (copy/adapt chat interface)
4. Add breakdown-specific AI system prompt
5. Build feature list output component with accept/reject UI
6. Add "Create All Features" action
7. Update dashboard with breakdowns tab

---

## 2. Project Context Onboarding (Guided Setup)

**Goal:** Prompt founders to provide product context (audience, personas, vision) in a friendly, guided way — not buried in settings.

### Why This Matters
- AI quality depends heavily on product context
- Current flow: context is in Settings → Project (admin only)
- New users skip this, get generic AI responses
- Context should feel like part of the product, not an afterthought

### Implementation Approach

#### Option A: Onboarding Wizard (Recommended for New Users)
Add a first-time setup flow after signup/project creation.

**New Route:** `/onboarding`

**Flow:**
```
Signup → Project Created → Redirect to /onboarding
                              ↓
                    Step 1: "Tell us about your product"
                    - Product name (pre-filled)
                    - One-line description
                    - What problem does it solve?
                              ↓
                    Step 2: "Who are your users?"
                    - Target audience (dropdown + custom)
                    - Add 1-2 user personas (guided form)
                              ↓
                    Step 3: "What's your vision?"
                    - Product vision (optional)
                    - Technical stack (optional, multi-select)
                              ↓
                    Step 4: "You're all set!"
                    - Summary of what they entered
                    - "Start with a breakdown" or "Create a feature"
                              ↓
                         → /dashboard
```

**Database Changes:**
```prisma
model Organization {
  // ... existing fields
  onboardingCompleted Boolean @default(false)
}
```

**Middleware Update:**
```typescript
// In middleware.ts or layout
if (user && !organization.onboardingCompleted && pathname !== '/onboarding') {
  redirect('/onboarding')
}
```

**UI Components:**
- Stepper/progress indicator (reuse or build simple one)
- Form sections with clear labels and examples
- "Skip for now" option (but discourage it)
- Persona builder with structured fields:
  - Name (e.g., "Technical Admin")
  - Role/Title
  - Goals (what they want to achieve)
  - Pain points (what frustrates them)
  - Tech savviness (Low/Medium/High)

#### Option B: Contextual Prompts (For Existing Users)
Show prompts when context would improve AI output.

**Trigger Points:**
1. **First feature creation:** Banner at top of conversation
   > "Want better AI suggestions? Add your target audience and user personas in Settings → Project"
   > [Set up now] [Maybe later]

2. **Empty context detection:** When AI conversation starts and context is minimal
   > AI: "I notice you haven't set up your product context yet. I can give much better suggestions if I know your target audience. Want to add that now?"
   > [Yes, let's do it] [Skip for now]

3. **Dashboard empty state:** When no features exist
   > "Before creating features, set up your product context for better AI suggestions"
   > [Set up product context] [Skip to create feature]

**Implementation:**
- Add `hasMinimalContext()` helper function
- Check: productDescription, targetAudience, at least 1 persona
- Show appropriate prompt based on context completeness

#### Option C: Inline Context Collection (During Conversation)
Collect context as part of the first conversation.

**Flow:**
1. User starts first feature/breakdown conversation
2. AI's first questions focus on product context:
   - "Before we dive in, who's the target user for [product name]?"
   - "What's the main problem your product solves?"
3. AI extracts and saves to project context automatically
4. Subsequent conversations use saved context

**Pros:** No separate flow, feels natural
**Cons:** Mixes concerns, harder to review/edit context later

### Recommended Hybrid Approach

1. **For new users:** Onboarding wizard (Option A)
   - Lightweight, 3-4 steps max
   - Skip option available but styled to discourage
   - Mark `onboardingCompleted` when done

2. **For existing users with missing context:** Contextual prompts (Option B)
   - Banner on dashboard if context incomplete
   - Inline prompt in first conversation
   - Link to Settings → Project for full editing

3. **Context completeness indicator:**
   - Add to Settings → Project page
   - Progress bar or checklist showing what's filled in
   - "Your AI suggestions will improve with more context"

### Recommended First Steps
1. Add `onboardingCompleted` to Organization model
2. Create `/onboarding` route with multi-step form
3. Build persona creation component (reusable for Settings)
4. Add middleware redirect for new users
5. Add "context completeness" banner to dashboard
6. Update AI system prompts to reference context more explicitly

---

## Implementation Priority

| Item | Effort | Impact | Suggested Order |
|------|--------|--------|-----------------|
| Project Context Onboarding | Medium | High | 1st — improves all AI interactions |
| Task Breakdown Feature | High | High | 2nd — major new capability |
| Context Prompts (existing users) | Low | Medium | 3rd — quick win after onboarding |
| Breakdown Progress Tracking | Medium | Medium | 4th — completes breakdown feature |

---

## Technical Notes

### Shared Components to Build/Reuse
- `StepperWizard` — for onboarding flow
- `PersonaForm` — structured persona input (use in onboarding + settings)
- `FeatureListBuilder` — interactive list for breakdown output
- `ContextBanner` — dismissible prompt for missing context
- `BreakdownCard` — dashboard card for breakdowns

### API Endpoints Needed
```
POST   /api/breakdowns              — Create breakdown
GET    /api/breakdowns              — List breakdowns
GET    /api/breakdowns/:id          — Get breakdown detail
POST   /api/breakdowns/:id/messages — Send message in breakdown conversation
POST   /api/breakdowns/:id/features — Batch create features from breakdown
PATCH  /api/breakdowns/:id/status   — Update breakdown status

PATCH  /api/organizations/:id/onboarding — Complete onboarding
GET    /api/organizations/:id/context-completeness — Check context status
```

### AI Prompt Updates
- Add breakdown-specific system prompt
- Enhance feature conversation prompt to reference product context more explicitly
- Add "context missing" handling in AI responses
