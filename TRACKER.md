# Orqanta — Build Tracker

**Update this file at the end of every work session. Check the box when done.**

**Current phase:** 2 — Auth + Onboarding
**Current task:** Create src/app/(auth)/layout.tsx & auth pages
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

- [ ] Create `src/app/(auth)/layout.tsx` (centered, no sidebar)
- [ ] Create `src/app/(auth)/login/page.tsx` (email + password)
- [ ] Create `src/app/(auth)/signup/page.tsx` (full name, org name, email, password)
- [ ] Create `src/app/(auth)/actions.ts`:
  - [ ] `bootstrapOrg()` — creates org, profile, sets `app_metadata.org_id`
  - [ ] `logout()`
- [ ] Test: signup → org created → logged in → redirected to dashboard
- [ ] Test: logout → redirected to `/login`
- [ ] **Checkpoint:** Full auth loop works

---

## Phase 3 — App Shell

- [ ] Create `src/app/(app)/layout.tsx` (auth-protected, sidebar + topbar)
- [ ] Create `src/components/sidebar.tsx` (dark, nav, avatar, logout)
- [ ] Create `src/components/topbar.tsx` (title, create button, bell, avatar)
- [ ] Create `src/components/onboarding-checklist.tsx` (3-step)
- [ ] Create `src/app/(app)/dashboard/page.tsx` (empty state for now)
- [ ] Test: navigation works, sidebar collapses to sheet on mobile
- [ ] **Checkpoint:** User can navigate the shell

---

## Phase 4 — Core CRUD (No AI)

### Properties
- [ ] `src/app/(app)/properties/page.tsx` (list)
- [ ] `src/app/(app)/properties/actions.ts` (create, update, delete)
- [ ] Property form dialog
- [ ] Test: create, edit, delete property

### Vendors
- [ ] `src/app/(app)/vendors/page.tsx` (list with insurance expiry highlight)
- [ ] `src/app/(app)/vendors/actions.ts`
- [ ] Vendor form dialog
- [ ] Test: create, edit, delete vendor

### Tenants
- [ ] `src/app/(app)/tenants/page.tsx` (list)
- [ ] `src/app/(app)/tenants/actions.ts` (`inviteTenant` using admin client)
- [ ] Invite dialog
- [ ] Test: invite tenant → auth user created + profile created + welcome email (if Resend wired)

### Work Orders
- [ ] `src/components/status-badge.tsx`
- [ ] `src/components/priority-badge.tsx`
- [ ] `src/components/photo-uploader.tsx` (compress, upload, return paths)
- [ ] `src/components/photo-gallery.tsx` (signed URLs)
- [ ] `src/components/activity-timeline.tsx`
- [ ] `src/app/(app)/work-orders/page.tsx` (list with filters)
- [ ] `src/app/(app)/work-orders/new/page.tsx` (create form)
- [ ] `src/app/(app)/work-orders/[id]/page.tsx` (detail)
- [ ] `src/app/(app)/work-orders/actions.ts`:
  - [ ] `createWorkOrder()`
  - [ ] `updateWorkOrderStatus()`
  - [ ] `assignVendor()`
- [ ] `src/lib/storage.ts` (upload, getSignedUrl)
- [ ] Test: create work order with photo → DB row + storage file + activity log

---

## Phase 5 — Dashboard (Real Data)

- [ ] `src/components/stat-card.tsx`
- [ ] Wire dashboard: 4 stat counts + recent work orders + activity timeline
- [ ] Test: real data displays, empty states show when no data

---

## Phase 6 — Email + Activity

- [ ] `src/lib/email/client.ts` (Resend wrapper)
- [ ] `src/lib/email/templates/` (work order created, status changed, vendor assigned, tenant invited)
- [ ] Wire emails into `createWorkOrder`, `updateWorkOrderStatus`, `assignVendor`, `inviteTenant`
- [ ] Test: all 4 email types arrive

---

## Phase 7 — AI Layer

- [ ] `src/lib/ai/client.ts` (Gemini wrapper)
- [ ] `src/lib/ai/triage.ts` (`triageRequest`)
- [ ] `src/lib/ai/vendor-match.ts` (`suggestVendor`)
- [ ] `src/lib/ai/draft-message.ts` (`draftMessage`)
- [ ] `src/lib/ai/monthly-report.ts` (`generateMonthlyReport`)
- [ ] `src/lib/ai/duplicate-detect.ts` (`detectDuplicate`)
- [ ] `src/lib/feature-flags.ts` (read + check)
- [ ] `src/components/ai-insight-card.tsx`
- [ ] `src/components/ai-suggested-vendor.tsx`
- [ ] `src/components/ai-draft-dialog.tsx`
- [ ] Wire triage into `createWorkOrder` (async, non-blocking)
- [ ] Wire duplicate detection into `new/page.tsx` submit
- [ ] Wire vendor suggestion into `work-orders/[id]/page.tsx`
- [ ] Wire draft message into `work-orders/[id]/page.tsx`
- [ ] Wire monthly report into dashboard + create `reports/[month]/page.tsx`
- [ ] Test: each AI feature works with flag ON
- [ ] Test: app works with flag OFF and with `GEMINI_API_KEY` missing

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

- [ ] Write landing page copy (separate from app)
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

| Date | Note | Status |
|---|---|---|
| Day 1 | Project started | ✅ |
