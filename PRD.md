# Orqanta — Product Requirements Document (PRD)

**Version:** 1.0
**Status:** Approved for build
**Owner:** Product
**Last updated:** Day 1

---

## 1. What Orqanta Is

Orqanta is a **multi-tenant SaaS platform** that helps small property managers (50–500 units) coordinate maintenance work between tenants, vendors, and property owners — replacing WhatsApp threads, spreadsheets, and phone calls with a single system of record.

Orqanta is **AI-native** and **API-first**:
- Every work order is automatically triaged, summarized, and routed by AI.
- Every org gets a **public submission SDK** they can embed on their own website or tenant portal.
- Every org has **feature flags** so managers can turn AI on/off per capability.

---

## 2. Aim

**Primary aim:** Give small property managers the operational leverage of a 50-person team without hiring.

**How:**
- Cut request triage time from hours to seconds via AI
- Eliminate "who did what when" chaos via activity logging
- Give property owners visibility without constant phone calls
- Let tenants submit requests through any channel (portal, embedded form, API)

**Non-aim (for v1):**
- Not competing with AppFolio/Buildium/Yardi (full PMS)
- Not a payment processor
- Not a marketplace
- Not a mobile app (responsive web only for v1)

---

## 3. Target Users

### Primary — Property Manager / Operator
- Manages 50–500 residential units across multiple properties
- Currently uses WhatsApp + Excel + email
- Bills owners monthly; needs activity reports
- Pain: triaging 20+ requests/day, chasing vendors, updating owners
- Willing to pay $99–$499/mo
- **Value prop:** "Your maintenance desk, automated."

### Secondary — Tenant
- Rents from a manager who uses Orqanta
- Wants to report issues fast and see status
- Pain: no visibility after submitting a request
- Doesn't pay directly but drives adoption

### Secondary — Vendor
- Plumber, electrician, HVAC, handyman
- Works for multiple managers
- Pain: unclear job details, late payment, no history
- Receives jobs via email link (full portal in v2)

### Tertiary — Property Owner
- Owns 1–10 properties managed by an Orqanta manager
- Wants visibility into maintenance spend and status
- Receives AI-generated monthly reports

### Developer / Integrator
- Wants to embed Orqanta's request form into their own site
- Uses the public SDK to submit work orders programmatically

---

## 4. Core Features (v1 Must-Have)

### 4.1 Multi-Tenant Workspace
- Each company = one `organization`
- Every table row is scoped to an `org_id`
- Data isolation enforced at the **database layer** (RLS), not app layer
- Users can belong to exactly one org in v1 (multi-org in v2)
- On signup, a new org is created; user becomes its first manager

### 4.2 Role-Based Access
- **Manager** — full access to org data
- **Tenant** — can only see own work orders + submit new (scoped to their property & unit)
- **Vendor** — receives emails, views assigned work orders via signed link

### 4.3 Work Orders (Core Object)
- Fields: title, description, property, unit_number (apartment/suite #), tenant, vendor, priority, status, photos, AI insights
- Statuses: `open → in_progress → resolved → closed`
- Full activity log per work order
- Photo uploads (client-compressed, direct to storage for portal; 2MB validated route for public SDK)

### 4.4 AI Layer (5 capabilities)
1. **Smart Triage** — auto-categorize + summarize + suggest priority on submission
2. **Vendor Suggestion** — match work order to best vendor with reason
3. **Draft Messages** — AI drafts tenant/owner update emails, editable before send
4. **Monthly Reports** — AI generates property owner reports from 30-day data
5. **Duplicate Detection** — warn tenant if similar request exists in last 30 days (fuzzy DB match first, AI confirmed)

### 4.5 Feature Flags
- Per-org toggle for each AI feature
- Stored in `organizations.feature_flags jsonb`
- When flag is off: AI UI hidden, no AI calls made
- Managers manage flags in Settings → AI Features

### 4.6 Public Submission SDK (Small)
- Lightweight `<script>` embed for external sites
- Config: `data-org-key` (`ok_live_...`), `property_id` (optional), `theme` (light/dark)
- Renders a form that POSTs to `/api/sdk/submit` with `X-Org-Key` header
- Returns a `ticket_id` for the submitter to track
- Rate-limited (10 req/min/IP), CORS-enabled
- **~3KB gzipped**

### 4.7 Public API (Read + Submit)
- `POST /api/sdk/submit` — create work order (SDK + external use, verified via `X-Org-Key`)
- `GET /api/sdk/status/:ticket_id` — check status (no auth, rate-limited)
- Auth via `X-Org-Key` header (generated in Settings → API Keys)

### 4.8 Onboarding
- After signup: 3-step checklist on dashboard
  1. Create your first property
  2. Add a vendor
  3. Invite a tenant
- Hide checklist once all 3 complete

---

## 5. Non-Functional Requirements

| Requirement | Target |
|---|---|
| **Page load** | < 2s on 3G (dashboard) |
| **Tenant isolation** | Zero cross-org leakage possible |
| **AI fallback** | All AI features degrade silently if Gemini down |
| **Uptime** | 99.5% (best-effort on free tier) |
| **Mobile** | Fully usable at 375px width |
| **Accessibility** | WCAG AA (contrast, keyboard nav, labels) |
| **AI latency** | < 5s per AI call, run async where possible |
| **Cold start** | < 3s (Vercel serverless) |
| **SDK size** | < 5KB gzipped |

---

## 6. Out of Scope for v1

- Multi-org membership
- Vendor portal (email only)
- Payments / invoicing
- Native mobile apps
- Real-time chat
- Non-image file uploads
- Custom AI training / fine-tuning
- White-labeling (v2)
- SSO / SAML

---

## 7. Success Metrics

**Activation:**
- 60% of signups complete onboarding checklist within 7 days
- 40% create at least one work order in first 24h

**Engagement:**
- 70% of managers use AI triage on >50% of work orders
- 50% of managers use AI draft messages weekly

**Retention:**
- 80% of orgs still active after 30 days

**SDK:**
- 20% of orgs embed the SDK within 60 days

---

## 8. Pricing (for context)

- **Free** — 1 property, 5 work orders/mo, AI disabled
- **Starter $99/mo** — up to 10 properties, 200 work orders/mo, full AI
- **Pro $299/mo** — up to 50 properties, unlimited work orders, SDK, API
- **Scale $499/mo** — unlimited + white-label + priority support

Free tier exists purely for trial / education.

---

## 9. Constraints

- **Zero budget for infra** — must work on free tiers (Vercel, Supabase, Resend, Gemini)
- **Single developer** — must be buildable by one person
- **AI cost** — Gemini 1.5 Flash free tier (15 req/min, 1M tokens/day)
- **Email** — Resend free tier (3k/mo, 100/day) → batch notifications
- **Storage** — Supabase free tier (1GB) → compress images to 1MB