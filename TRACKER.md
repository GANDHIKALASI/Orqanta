# Orqanta — Build Tracker

**Update this file at the end of every work session. Check the box when done.**

**Current phase:** 8 — Trial Paywall & Billing System
**Current task:** Completed 7-Day Trial Paywall, /billing route, mock payment flow, and Landing Page cleanup
**Blocker:** None

---

## Phase 1 — Foundation

- [x] Create `setup.sql` (schema, RLS policies, `auth_org_id()`, storage policies, token hook)
- [x] Create `.env.example` with all keys
- [x] Create `.gitignore`
- [x] Create `README.md`
- [x] Create `.github/workflows/supabase-keepalive.yml`
- [x] Scaffold Next.js 14 (`pnpm dlx create-next-app@14` or `npx create-next-app@14`)
- [x] Install deps: `@supabase/supabase-js @supabase/ssr resend zod react-hook-form @hookform/resolvers lucide-react browser-image-compression sonner @google/generative-ai`
- [x] Init shadcn/ui (New York, Zinc) + add components: button, card, table, input, textarea, select, badge, dialog, dropdown-menu, form, label, tabs, avatar, separator, skeleton, sheet, sonner
- [x] Create `.env.local` locally (user fills)
- [x] Create `src/lib/supabase/client.ts` (browser)
- [x] Create `src/lib/supabase/server.ts` (RSC + actions)
- [x] Create `src/lib/supabase/admin.ts` (service role, server only)
- [x] Create `src/lib/types.ts` (all domain types including unit_number & property links)
- [x] Create `src/lib/utils.ts` (`cn`, `formatDate`, `formatRelativeTime`, `slugify`)
- [x] Create `src/lib/validators.ts` (zod schemas for every form)
- [x] Create `src/middleware.ts` (session refresh + route protection)
- [x] Create `src/app/layout.tsx` (root, Inter font, sonner Toaster)
- [x] Create `src/app/page.tsx` (redirect based on auth)
- [x] **Checkpoint:** App runs locally, redirects to `/login` when signed out

---

## Phase 2 — Auth + Onboarding

- [x] Create `src/app/(auth)/layout.tsx` (centered, no sidebar)
- [x] Create `src/app/(auth)/login/page.tsx` (email + password)
- [x] Create `src/app/(auth)/signup/page.tsx` (full name, org name, email, password)
- [x] Create `src/app/(auth)/actions.ts`:
  - [x] `bootstrapOrg()` — creates org, profile, sets `app_metadata.org_id`
  - [x] `logout()`
- [x] Test: signup → org created → logged in → redirected to dashboard
- [x] Test: logout → redirected to `/login`
- [x] **Checkpoint:** Full auth loop works

---

## Phase 3 — App Shell

- [x] Create `src/app/(app)/layout.tsx` (auth-protected, sidebar + topbar)
- [x] Create `src/components/sidebar.tsx` (dark, nav, avatar, logout)
- [x] Create `src/components/topbar.tsx` (title, create button, bell, avatar)
- [x] Create `src/components/onboarding-checklist.tsx` (3-step)
- [x] Create `src/app/(app)/dashboard/page.tsx` (empty state for now)
- [x] Test: navigation works, sidebar collapses to sheet on mobile
- [x] **Checkpoint:** User can navigate the shell

---

## Phase 4 — Core CRUD (No AI)

### Properties
- [x] `src/app/(app)/properties/page.tsx` (list)
- [x] `src/app/(app)/properties/actions.ts` (create, update, delete)
- [x] Property form dialog
- [x] Test: create, edit, delete property

### Vendors
- [x] `src/app/(app)/vendors/page.tsx` (list with insurance expiry highlight)
- [x] `src/app/(app)/vendors/actions.ts`
- [x] Vendor form dialog
- [x] Test: create, edit, delete vendor

### Tenants
- [x] `src/app/(app)/tenants/page.tsx` (list)
- [x] `src/app/(app)/tenants/actions.ts` (`inviteTenant` using admin client)
- [x] Invite dialog
- [x] Test: invite tenant → auth user created + profile created + welcome email (if Resend wired)

### Work Orders
- [x] `src/components/status-badge.tsx`
- [x] `src/components/priority-badge.tsx`
- [x] `src/app/(app)/work-orders/page.tsx` (list with filters)
- [x] `src/app/(app)/work-orders/new/page.tsx` (create form)
- [x] `src/app/(app)/work-orders/[id]/page.tsx` (detail)
- [x] `src/app/(app)/work-orders/actions.ts`:
  - [x] `createWorkOrder()`
  - [x] `updateWorkOrderStatus()`
  - [x] `assignVendor()`
- [x] Test: create work order with photo → DB row + storage file + activity log

---

## Phase 5 — Dashboard (Real Data)

- [x] `src/components/stat-card.tsx`
- [x] Wire dashboard: 4 stat counts + recent work orders + activity timeline
- [x] Test: real data displays, empty states show when no data

---

## Phase 6 — Email + Activity

- [ ] `src/lib/email/client.ts` (Resend wrapper)
- [ ] `src/lib/email/templates/` (work order created, status changed, vendor assigned, tenant invited)
- [ ] Wire emails into `createWorkOrder`, `updateWorkOrderStatus`, `assignVendor`, `inviteTenant`
- [ ] Test: all 4 email types arrive

---

## Phase 7 — AI Layer

- [x] Rebrand all user-facing AI interfaces to "Orqanta AI"
- [x] Create `/api/chat/route.ts` with Orqanta AI property maintenance assistant system prompt
- [x] Create `src/components/chat/floating-chatbot.tsx` floating widget with message history and starter prompts
- [x] Mount FloatingChatbot in `src/app/layout.tsx` across landing page and internal dashboard
- [x] Polish Landing Page typography, line heights, centering, and realistic app window with macOS traffic lights
- [x] Polish App Dashboard shell, DESIGN.md token styling, and empty states for all entities
- [x] Wire non-blocking triage into `createWorkOrder`

---

## Phase 8 — Feature Flags (Settings)

- [ ] Update `settings/page.tsx` to include "AI Features" tab with toggles
- [ ] Update `settings/actions.ts` with `updateFeatureFlags()`
- [ ] Test: toggle flag → corresponding UI hides/shows

---

## Phase 9 — Public SDK + API

- [ ] `src/app/api/sdk/submit/route.ts` (POST, org-key auth, rate limit)
- [ ] `src/app/api/sdk/status/[ticket_id]/route.ts` (GET, public)
- [ ] `public/sdk/orqanta-sdk.js` (vanilla JS, ~3KB)
- [ ] Add "API Keys" section to Settings (generate/regenerate `api_key`)
- [ ] Test: embed SDK on a plain HTML page → submit → row in DB + email

---

## Phase 10 — Polish

- [ ] Skeletons on all server-fetched pages
- [ ] Empty states on all lists
- [ ] Toasts on all mutations
- [ ] Loading states on all buttons
- [ ] Mobile pass (375px): sidebar, tables, forms, dialogs
- [ ] Accessibility pass: labels, focus rings, contrast, keyboard nav
- [ ] `/api/health` route
- [ ] Update `README.md` with setup instructions

---

## Phase 11 — Deployment

- [ ] Push to GitHub
- [ ] Import to Vercel
- [ ] Add all env vars to Vercel (Production + Preview + Development)
- [ ] Deploy
- [ ] Update Supabase Site URL to Vercel domain
- [ ] Enable Supabase Custom Access Token Hook
- [ ] Run `setup.sql` in Supabase SQL Editor
- [ ] Smoke test production: signup → property → work order → AI triage
- [ ] Enable Supabase keep-alive GitHub Action

---

## Phase 12 — Launch Prep

- [x] Write landing page copy (separate from app, interactive with live AI triage simulation)
- [ ] Screenshot for Product Hunt / Twitter
- [ ] Test full success criteria (see PRD §7)
- [ ] Invite first 3 beta users

---

## Success Criteria (all must pass before launch)

- [ ] Signup → org created, checklist visible
- [ ] Create property
- [ ] Add vendor
- [ ] Invite tenant → email received
- [ ] Tenant submits work order with photo → AI triage populates
- [ ] Manager sees AI insight + suggested vendor → assign → email sent
- [ ] Draft AI message to tenant → edit → send → email received
- [ ] Change status → activity logged + email sent
- [ ] Generate AI monthly report → viewable + downloadable
- [ ] Duplicate detection warns on second similar request
- [ ] Toggle AI flag off → AI UI hidden, no errors
- [ ] All works on 375px mobile
- [ ] SDK submits work order from external HTML page

---

## Notes / Blockers Log

| Day 1 | Project started | ✅ |
| Day 2 | 7-Day Trial Paywall, /billing with ₹199/mo & ₹1999/yr, mock checkout, and business landing page cleanup | ✅ |
| Day 3 | UI Refinement: Integrated orqanta-ui-refined styling, official logo, signature #073b3a header & footer, warm pearl canvas, and verified build (0 errors) | ✅ |

