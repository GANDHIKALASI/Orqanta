# Orqanta — Project Memory / Context

**This file is loaded by AI coding agents at the start of every session. Keep it current.**

---

## Current State

**Phase:** 1 — Foundation (see TRACKER.md)
**Last session:** Day 1
**Current blocker:** None
**Next action:** Scaffold Next.js, install deps, create Supabase clients

---

## What Orqanta Is (30-second summary)

Multi-tenant SaaS for small property managers (50–500 units). Tenants submit maintenance requests with photos; managers triage, assign vendors, track status; AI automates triage, vendor matching, message drafting, and monthly reports. Public SDK lets external sites submit requests. Feature flags gate AI per org.

---

## Key Decisions (locked — do not revisit)

| Decision | Rationale | Date |
|---|---|---|
| **Name: Orqanta** | User-chosen, brandable | Day 0 |
| **Gemini Flash, not GPT** | Free tier 15 req/min, 1M tokens/day; no card required | Day 0 |
| **Supabase Storage, not Cloudflare R2** | User has no credit card; R2 requires card | Day 0 |
| **Single org per user (v1)** | Simpler onboarding; multi-org in v2 | Day 0 |
| **Server Actions for all mutations** | Simpler than API routes for authenticated ops | Day 0 |
| **SDK as `<script>` embed** | Zero build step for integrators | Day 0 |
| **Feature flags in `organizations.feature_flags jsonb`** | Avoids separate table; simple read | Day 0 |
| **No `any` in TypeScript** | Forces type safety; catches bugs at compile | Day 0 |
| **shadcn/ui over other libraries** | Full control, copy-paste components, no dependency lock | Day 0 |

---

## Environment Setup (must exist locally)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=onboarding@resend.dev
GEMINI_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Getting each key:
- **Supabase** → Project Settings → API
- **Resend** → API Keys
- **Gemini** → https://aistudio.google.com/apikey (free, no card)

---

## Database Facts

- RLS is enabled on all tables.
- `auth_org_id()` returns `app_metadata.org_id` from JWT — set at signup via admin client.
- Storage bucket `work-order-photos` is private — always use signed URLs.
- File path convention: `{org_id}/{work_order_id}/{timestamp}.{ext}`.
- `photo_keys` is `text[]` on `work_orders` — stores paths, never URLs.
- Service role client only used in `bootstrapOrg`, `inviteTenant`, and `/api/sdk/submit`.
- Always store `unit_number` on work orders & tenant profiles to prevent unit ambiguity in multi-unit buildings.

---

## The 5 AI Features

1. **Triage** — on submit → category + priority + summary
2. **Vendor suggestion** — on detail page → best match + reason
3. **Draft messages** — on detail page → editable email drafts
4. **Monthly report** — on dashboard → markdown report from 30-day data
5. **Duplicate detection** — on submit → fast DB fuzzy search + AI warning if similar recent work order exists

Each is gated by a feature flag and must degrade silently if AI fails.

---

## Feature Flags (default all true)

```json
{
  "ai_triage": true,
  "ai_vendor_suggestion": true,
  "ai_draft_message": true,
  "ai_monthly_report": true,
  "ai_duplicate_detect": true,
  "sdk_enabled": true,
  "api_enabled": true
}
```

---

## Public SDK Contract

```html
<script src="https://orqanta.app/sdk/orqanta-sdk.js"
        data-org-key="ok_live_xxx"
        data-theme="light"></script>

<div id="orqanta-form"></div>
```

SDK POSTs to `/api/sdk/submit` with `X-Org-Key: <api_key>` header. Returns `{ ticket_id, status_url }`.

---

## Free-Tier Guardrails

| Service | Watch for | Action if hit |
|---|---|---|
| **Vercel Hobby** | Non-commercial clause | Upgrade to Pro at launch ($20/mo) |
| **Supabase pause** | 7 days idle | GitHub Action keep-alive (runs ping every 3 days) |
| **Resend** | 100 emails/day | Batch + use in-app toasts for non-critical |
| **Gemini** | 15 req/min limit | Fire async, fuzzy DB pre-filter before calling duplicate AI |
| **Supabase Storage** | 1GB cap | Client-side compression (1MB cap) |

---

## Known Gotchas

- Signup must set `app_metadata.org_id` via admin client. Without this, RLS breaks on first request.
- Photo paths must be saved, not URLs. URLs expire; paths are permanent.
- `revalidatePath()` after every mutation or RSC pages show stale data.
- AI must run after DB write, not before. Never block user action on AI.
- SDK endpoint needs CORS `*` but rate limit per IP (10 req/min).
- Middleware matcher must exclude `/api/sdk/*` or SDK calls fail.
- `crypto.randomUUID()` on client for `work_order_id` (so photo paths match at upload time).
- Tenant profiles must track `property_id` and `unit_number` to scope work orders properly.

---

## Files That Must Never Have 'use client'

- `src/lib/supabase/server.ts`
- `src/lib/supabase/admin.ts`
- `src/lib/ai/*`
- `src/lib/email/client.ts`
- All `actions.ts`
- All `page.tsx` unless explicitly interactive

---

## Design Non-Negotiables

- Inter font, zinc palette, violet for AI only
- Sidebar dark (zinc-950), content light (zinc-50)
- No gradients, no glassmorphism, no purple everywhere
- AI card = violet tint + ✨ icon
- Buttons: primary zinc-900, AI buttons violet-tinted
- Every page mobile-responsive at 375px
- Toasts (sonner) on every mutation

---

## External Links

- Gemini API key: https://aistudio.google.com/apikey
- Supabase dashboard: https://supabase.com/dashboard
- Resend: https://resend.com/api-keys
- Vercel: https://vercel.com/dashboard
- shadcn docs: https://ui.shadcn.com
- lucide icons: https://lucide.dev/icons

---

## Questions to Ask Before Every Session

1. What phase are we in? (check TRACKER.md)
2. What's the next unchecked item?
3. Does this change touch the DB schema? If yes, update `setup.sql`.
4. Does this change touch env vars? If yes, update `.env.example`.
5. Is AI involved? If yes, wrap in flag check + try/catch.