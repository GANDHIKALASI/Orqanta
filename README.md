# Orqanta

> **AI-native, multi-tenant maintenance workspace for property managers (50–500 units).**

Orqanta replaces fragmented WhatsApp threads, spreadsheets, and endless phone calls with a single system of record. Every maintenance request is automatically triaged, summarized, and matched to vendors using AI, with complete data isolation per organization and an embeddable public submission SDK.

---

## ⚡ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Components, Server Actions)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (strict mode, zero `any`)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security, Auth, Storage)
- **AI Engine:** [Google Gemini 1.5 Flash](https://aistudio.google.com/) (non-blocking async triage, vendor matching, reporting)
- **Styling & UI:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Zinc base, New York style)
- **Transactional Email:** [Resend](https://resend.com/) + React Email templates
- **Forms & Validation:** React Hook Form + Zod
- **Icons:** Lucide React
- **Notifications:** Sonner

---

## 📚 Project Specifications & Architecture

- 📋 [**PRD.md**](PRD.md) — Product requirements, target users, core features, and success metrics.
- 🏛️ [**ARCHITECTURE.md**](ARCHITECTURE.md) — Technical architecture, schema design, API flows, and security model.
- 🎨 [**DESIGN.md**](DESIGN.md) — Design system, Zinc + Violet color tokens, typography, and UI specs.
- 📜 [**RULES.md**](RULES.md) — Non-negotiable engineering rules, server vs. client boundaries, and security constraints.
- 🧠 [**MEMORY.md**](MEMORY.md) — Persistent project context, free-tier guardrails, and gotchas.
- 📌 [**TRACKER.md**](TRACKER.md) — Multi-phase build progress and task checklist.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17+ or 20+
- `pnpm` (recommended) or `npm`
- A free [Supabase](https://supabase.com) account
- A free [Google AI Studio](https://aistudio.google.com/apikey) API key
- A free [Resend](https://resend.com) account

### 2. Environment Setup
Copy the environment template and populate your keys:
```bash
cp .env.example .env.local
```

### 3. Database Initialization
1. Open your Supabase project's **SQL Editor**.
2. Run the master migration script found in [`setup.sql`](setup.sql).
3. Under **Authentication → Hooks**, enable the **Custom Access Token (JWT) Hook** pointing to `public.custom_access_token_hook`.

### 4. Running Locally
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔒 Security & Tenant Isolation

- **Zero Cross-Org Leakage:** Every query is guarded by PostgreSQL Row Level Security (RLS) enforcing `org_id = auth_org_id()`.
- **Private Storage:** Media uploads live in private buckets accessed strictly through signed URLs with 1-hour expiry.
- **Fail-Safe AI:** All AI operations run asynchronously post-mutation and degrade gracefully if the AI service is unavailable.
