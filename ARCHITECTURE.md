# Orqanta — Architecture

---

## 1. Tech Stack

### Frontend
- **Next.js 14** — App Router, Server Components, Server Actions
- **TypeScript** — strict mode, no `any`
- **Tailwind CSS** — utility-first, custom design tokens
- **shadcn/ui** — New York style, Zinc base
- **react-hook-form + zod** — forms + validation
- **lucide-react** — icons
- **sonner** — toasts
- **browser-image-compression** — client-side image optimization

### Backend
- **Next.js Server Actions** — all mutations
- **Next.js Route Handlers** — SDK + public API + webhooks
- **Supabase Postgres** — primary database, RLS enforced
- **Supabase Auth** — auth, sessions, JWT with `org_id` claim
- **Supabase Storage** — private bucket for photos (signed URLs)

### AI
- **Google Gemini 1.5 Flash** — via `@google/generative-ai`
- Free tier: 15 req/min, 1M tokens/day
- All calls run **async post-write**, never block UI

### Email
- **Resend** — transactional email, React templates

### Infra
- **Vercel** — hosting, edge middleware, serverless functions
- **GitHub Actions** — Supabase keep-alive cron

---

## 2. Folder Structure
orqanta/
├── .github/workflows/ # keep-alive, CI
├── public/
│ └── sdk/orqanta-sdk.js # embeddable SDK
├── src/
│ ├── app/
│ │ ├── (auth)/
│ │ │ ├── login/page.tsx
│ │ │ ├── signup/page.tsx
│ │ │ ├── actions.ts
│ │ │ └── layout.tsx
│ │ ├── (app)/
│ │ │ ├── dashboard/page.tsx
│ │ │ ├── work-orders/
│ │ │ │ ├── page.tsx
│ │ │ │ ├── new/page.tsx
│ │ │ │ ├── [id]/page.tsx
│ │ │ │ └── actions.ts
│ │ │ ├── properties/
│ │ │ │ ├── page.tsx
│ │ │ │ └── actions.ts
│ │ │ ├── vendors/
│ │ │ │ ├── page.tsx
│ │ │ │ └── actions.ts
│ │ │ ├── tenants/
│ │ │ │ ├── page.tsx
│ │ │ │ └── actions.ts
│ │ │ ├── reports/[month]/page.tsx
│ │ │ ├── settings/
│ │ │ │ ├── page.tsx
│ │ │ │ └── actions.ts
│ │ │ └── layout.tsx
│ │ ├── (portal)/ # tenant-facing portal
│ │ │ ├── portal/page.tsx
│ │ │ └── layout.tsx
│ │ ├── api/
│ │ │ ├── sdk/
│ │ │ │ ├── submit/route.ts
│ │ │ │ └── status/[ticket_id]/route.ts
│ │ │ ├── notify/route.ts
│ │ │ └── health/route.ts
│ │ ├── layout.tsx
│ │ └── page.tsx
│ ├── components/
│ │ ├── ui/ # shadcn primitives
│ │ ├── sidebar.tsx
│ │ ├── topbar.tsx
│ │ ├── stat-card.tsx
│ │ ├── status-badge.tsx
│ │ ├── priority-badge.tsx
│ │ ├── ai-insight-card.tsx
│ │ ├── ai-suggested-vendor.tsx
│ │ ├── ai-draft-dialog.tsx
│ │ ├── photo-uploader.tsx
│ │ ├── photo-gallery.tsx
│ │ ├── activity-timeline.tsx
│ │ ├── empty-state.tsx
│ │ └── onboarding-checklist.tsx
│ ├── lib/
│ │ ├── supabase/
│ │ │ ├── client.ts # browser
│ │ │ ├── server.ts # RSC + actions
│ │ │ └── admin.ts # service role (server only)
│ │ ├── ai/
│ │ │ ├── client.ts # Gemini wrapper
│ │ │ ├── triage.ts
│ │ │ ├── vendor-match.ts
│ │ │ ├── draft-message.ts
│ │ │ ├── monthly-report.ts
│ │ │ └── duplicate-detect.ts
│ │ ├── storage.ts
│ │ ├── email/
│ │ │ ├── client.ts # Resend wrapper
│ │ │ └── templates/
│ │ ├── feature-flags.ts
│ │ ├── validators.ts
│ │ ├── types.ts
│ │ └── utils.ts
│ └── middleware.ts
├── setup.sql
├── .env.example
├── README.md
├── PRD.md
├── ARCHITECTURE.md
├── DESIGN.md
├── MEMORY.md
├── RULES.md
└── TRACKER.md
```

---

## 3. Database Schema

### Core Tables

```sql
organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  feature_flags jsonb default '{
    "ai_triage": true,
    "ai_vendor_suggestion": true,
    "ai_draft_message": true,
    "ai_monthly_report": true,
    "ai_duplicate_detect": true,
    "sdk_enabled": true,
    "api_enabled": true
  }'::jsonb,
  api_key text unique,
  created_at timestamptz default now()
);

profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  role text not null check (role in ('manager', 'tenant', 'vendor', 'owner')),
  property_id uuid references properties(id) on delete set null,
  unit_number text,
  full_name text not null,
  phone text,
  email text not null,
  created_at timestamptz default now()
);

properties (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  address text not null,
  owner_name text,
  owner_email text,
  units integer default 1,
  created_at timestamptz default now()
);

vendors (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  trade text not null, -- plumbing | electrical | hvac | appliance | roofing | carpentry | pest_control | general_handyman
  phone text,
  email text not null,
  rate_notes text,
  insurance_expiry date,
  created_at timestamptz default now()
);

work_orders (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  unit_number text,
  tenant_id uuid references profiles(id) on delete set null,
  vendor_id uuid references vendors(id) on delete set null,
  title text not null,
  description text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  photo_keys text[] default '{}',
  source text default 'portal', -- 'portal' | 'sdk' | 'api'
  submitter_email text,
  ai_summary text,
  ai_category text,
  ai_suggested_vendor_id uuid references vendors(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

activity_log (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  work_order_id uuid not null references work_orders(id) on delete cascade,
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

reports (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  month text not null,
  markdown text not null,
  metrics jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  unique(org_id, month)
);
```

### RLS Pattern

Every table is isolated with Row Level Security:

```sql
CREATE POLICY "org scoped" ON <table>
  FOR ALL TO authenticated
  USING (org_id = auth_org_id())
  WITH CHECK (org_id = auth_org_id());
```

`auth_org_id()` reads `app_metadata.org_id` from the Supabase Auth JWT claim:

```sql
CREATE OR REPLACE FUNCTION auth_org_id()
RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'org_id', '')::uuid;
$$;
```

### Storage

- **Bucket:** `work-order-photos` (private)
- **Path convention:** `{org_id}/{work_order_id}/{timestamp}.{ext}`
- **Read:** via `createSignedUrl()` with 1-hour expiry
- **Upload:**
  - Client-side direct to Supabase Storage for authenticated portal & app users
  - Server-mediated (max 2MB, validated) for public SDK route `/api/sdk/submit`

---

## 4. API Flows

### 4.1 Signup Flow

```text
Client → supabase.auth.signUp({ email, password, options: { data: { full_name, org_name }}})
       ↓
Supabase Auth creates user, returns session
       ↓
Client → server action bootstrapOrg()
       ↓
Admin client:
  - INSERT organizations (name, slug)
  - INSERT profiles (id=user.id, org_id, role='manager')
  - UPDATE auth.users SET app_metadata = { org_id }
       ↓
Refresh JWT → RLS now works for all subsequent calls
```

### 4.2 Work Order Creation (Portal / Manager)

```text
Client → upload photos to storage (returns paths)
       ↓
Client → server action createWorkOrder({ property_id, unit_number, title, description, priority, photoKeys })
       ↓
[1] Fast DB duplicate check (search open tickets in same property/unit within 30 days)
       ↓
[2] INSERT work_orders (id = crypto.randomUUID(), org_id, ..., photo_keys)
       ↓
[3] INSERT activity_log (action='work_order.created')
       ↓
[4] Fire-and-forget AI triage (AI-1):
       - Check feature_flags.ai_triage
       - Gemini → { category, priority, summary }
       - UPDATE work_orders SET ai_summary, ai_category
       - INSERT activity_log (action='work_order.ai_triaged')
       ↓
[5] Send email notification (Resend)
       ↓
Redirect to /work-orders/[id]
```

### 4.3 Work Order Creation (SDK / Public API)

```text
POST /api/sdk/submit
  Headers: X-Org-Key: <api_key>
  Body: { title, description, property_id?, unit_number?, submitter_email, photos?: [] }
       ↓
1. Look up org by api_key
2. Check feature_flags.sdk_enabled
3. Rate limit (10 req/min per IP)
4. Validate & upload photos to {org_id}/sdk/{uuid}/{ts}.{ext} (max 2MB total)
5. INSERT work_orders (source='sdk', submitter_email, tenant_id=null)
6. Fire AI triage async
7. Email manager
       ↓
Response: { ticket_id: "<work_order.id>", status_url: "/api/sdk/status/<id>" }
```

### 4.4 AI Triage Flow

```text
Server action or async task
       ↓
Feature flag check (organizations.feature_flags.ai_triage)
       ↓
If enabled:
  - Build prompt with title + description + property name
  - Call gemini-1.5-flash with responseMimeType: "application/json"
  - Parse { category, priority, summary }
  - UPDATE work_orders
  - Log activity
       ↓
If disabled or fails:
  - Silent no-op
  - Log error to console only
```

### 4.5 AI Vendor Suggestion

```text
Detail page loads → server component fetches matching vendors by trade
       ↓
Server action suggestVendor(workOrderId)
       ↓
If flag enabled:
  - Gemini gets: work order description + vendor list (name, trade, insurance_status, past_jobs)
  - Returns { vendor_id, reason }
  - Cache in work_orders.ai_suggested_vendor_id
       ↓
Render <AiSuggestedVendor /> with one-click assign
```

### 4.6 AI Draft Message

```text
Manager clicks "Draft message to tenant"
       ↓
Dialog opens → server action draftMessage(workOrderId, recipient='tenant')
       ↓
Gemini drafts email body
       ↓
Editable textarea in dialog
       ↓
"Send" → server action sendEmail({ to: tenant.email, ... }) via Resend
       ↓
Log activity: 'work_order.message_sent'
```

### 4.7 Feature Flag Check

```text
Server action starts
       ↓
const { data: org } = await supabase.from('organizations')
  .select('feature_flags')
  .eq('id', auth_org_id())
  .single()
       ↓
if (!org.feature_flags?.ai_triage) return { skipped: true }
       ↓
... proceed with AI logic
```

---

## 5. Security Model

| Layer | Control |
|---|---|
| **Session** | Supabase Auth JWT, httpOnly cookies |
| **Data isolation** | RLS on every table (`org_id = auth_org_id()`) |
| **Storage isolation** | RLS on storage.objects matching folder prefix `{org_id}/...` |
| **Service role** | Only in `bootstrapOrg`, `inviteTenant`, and `/api/sdk/submit` |
| **Public SDK** | `X-Org-Key` header + IP rate limit + flag check |
| **AI prompts** | Never include another org's data; validate structured JSON output |
| **File uploads** | Client-side compression; MIME + size validation |
| **CORS** | SDK endpoint allows `*` origin (public by design) but rate-limited |

---

## 6. Free-Tier Constraints

| Service | Limit | Mitigation |
|---|---|---|
| **Vercel Hobby** | Non-commercial | Upgrade to Pro ($20/mo) at production launch |
| **Supabase DB** | 500MB | Sufficient for MVP; monitor growth |
| **Supabase Storage** | 1GB | Compress images to 1MB; ~1k photos capacity |
| **Supabase pause** | 7 days idle | GitHub Action keep-alive runs ping every 3 days |
| **Resend** | 100 emails/day | Batch notifications; use in-app toasts for non-critical |
| **Gemini Flash** | 15 req/min | Fire AI async; use DB trigram pre-check for duplicates; cache results |
| **Vercel bandwidth** | 100GB | Direct uploads to Supabase Storage (bypass Vercel) |

---

## 7. Deployment

Local → Prod path:
1. `pnpm dev` on `localhost:3000`
2. Push to GitHub `main`
3. Vercel auto-deploys
4. Add all environment variables to Vercel
5. Update Supabase Site URL → Vercel production domain
6. Run `setup.sql` in Supabase SQL Editor
7. Enable Custom Access Token Hook in Supabase Auth → Hooks

Environment promotion:
- `main` → Production
- `dev` → Preview (separate Supabase project optional)