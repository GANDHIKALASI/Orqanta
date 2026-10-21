
# Orqanta — Engineering Rules

**Non-negotiable. Follow these in every file, every commit, every AI session.**

---

## 1. TypeScript

- ✅ `"strict": true` in tsconfig
- ✅ Type every function parameter and return
- ✅ Use `unknown` + validation for external data
- ❌ No `any` — use `unknown`, generics, or proper types
- ❌ No `// @ts-ignore` — fix the type
- ❌ No non-null assertion `!` unless provably safe (comment why)

---

## 2. Server vs Client

- **Default to Server Components.** Only add `'use client'` when you need:
  - `useState`, `useEffect`, event handlers, browser APIs
- **All mutations = Server Actions** (`'use server'` at top of action file or inline)
- **All reads = Server Components** using `src/lib/supabase/server.ts`
- **Client-side DB access only for storage uploads** (via `src/lib/supabase/client.ts`)

---

## 3. Database

- **Never query without RLS.** Always use the user's Supabase client (with JWT), never service role in app logic.
- **Service role only in:** `bootstrapOrg`, `inviteTenant`, and rate-limited SDK submission route.
- **Every mutation writes to `activity_log`** with a clear action string.
- **Every mutation calls `revalidatePath()`** on affected routes.
- **Every work order and tenant must capture `unit_number`** when applicable to prevent building-level ambiguity.

---

## 4. AI

- **Every AI call wrapped in try/catch.** On failure: log to console, return safe fallback.
- **Every AI feature gated by feature flag** (`organizations.feature_flags.<name>`).
- **Every AI call runs AFTER the DB write**, never blocks the user action.
- **Prompt engineering rule:** always instruct Gemini to return **valid JSON only**. Use `responseMimeType: "application/json"`.
- **Never send another org's data to Gemini.** Scope every prompt to the current org's data.
- **Protect Gemini 15 RPM limit:** Run database-level title/description duplicate check first before triggering duplicate AI warnings.
- **Cache AI output** in DB (`ai_summary`, `ai_category`, `reports.markdown`) so we don't re-call unnecessarily.

---

## 5. Forms

- **Every form validated with zod** on client (react-hook-form) AND server (action input).
- **Every form shows inline errors** on invalid fields.
- **Every submit button disabled while pending** with loading state.
- **Every success/error shown via `toast` (sonner).**

---

## 6. Files & Storage

- **Compress images client-side** before upload (max 1MB, 1920px) using `browser-image-compression`.
- **Authenticated app/portal uploads:** Direct browser → Supabase Storage (bypassing Next.js).
- **Public SDK submissions:** Validated on `/api/sdk/submit` with strict 2MB limit before storage commit.
- **Store file paths in DB, not URLs.** Generate signed URLs on read (1h expiry).
- **Never expose service role key to client.**

---

## 7. Security

- **Never trust client input.** Always validate server-side.
- **RLS is the last line of defense** — but also filter by `org_id` in queries for defense in depth.
- **Never log secrets** (tokens, keys, passwords) — use `[redacted]`.
- **Never commit `.env.local`.** `.env.example` with placeholders is fine.
- **SDK endpoints:** rate limit by IP, validate org key, check feature flag.
- **Admin client usage:** only in files ending `.server.ts` or actions marked as server-only.

---

## 8. Styling

- **No inline styles.** Tailwind only.
- **No new color values.** Use tokens from DESIGN.md (via `tailwind.config.ts` extension).
- **No new font families.** Inter only (JetBrains Mono for code).
- **Use shadcn components** — don't reinvent buttons, cards, dialogs.
- **Icons from lucide-react only.**
- **Mobile-first.** Test at 375px before marking done.

---

## 9. Naming

| Type | Convention | Example |
|---|---|---|
| Files (components) | kebab-case | `stat-card.tsx` |
| Files (utils/lib) | kebab-case | `feature-flags.ts` |
| Files (pages) | kebab-case | `work-orders/page.tsx` |
| Components (export) | PascalCase | `StatCard` |
| Functions | camelCase | `sendEmail` |
| Server Actions | camelCase verb | `createWorkOrder` |
| DB columns | snake_case | `org_id` |
| Types | PascalCase | `WorkOrder` |
| Constants | SCREAMING_SNAKE | `MAX_FILE_SIZE` |

---

## 10. Errors

- **Server Actions return `{ success: true, data? } | { error: string }`.** Never throw to client.
- **Catch and translate errors** — don't expose DB errors to user.
- **Client components use `toast.error(message)`** on error.
- **Log server-side errors** with context (user id, action, input summary) — no secrets.

---

## 11. Git

- **Commit messages:** conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`)
- **Never commit `node_modules`, `.next`, `.env.local`**
- **One feature per PR** (even if solo)
- **Update TRACKER.md** on every significant commit

---

## 12. Testing (light for v1)

- **Manual test every flow** before marking done in TRACKER.md
- **Test:** signup → property → vendor → work order → status change → email
- **Test AI features with flag on AND off**
- **Test on mobile viewport (375px)**
- **Test duplicate detection with two similar requests**

---

## 13. Performance

- **Server Components by default** — smaller JS bundle
- **`dynamic` import** for heavy client components (photo uploader, AI dialogs)
- **`Suspense` + skeleton** for async server data
- **Never fetch sequentially** when parallel is possible (use `Promise.all`)
- **Optimize images** via `next/image` where applicable (not for storage signed URLs — use plain `<img>` with lazy loading)

---

## 14. Documentation

- **Every non-obvious function has a comment** explaining why (not what)
- **Every server action documented** with JSDoc: input, output, side effects
- **Update MEMORY.md** when a decision changes or a gotcha is discovered
- **Update TRACKER.md** as tasks complete

---

## 15. Never Do This

- ❌ Ask the user for API keys mid-build (they're in `.env.local`)
- ❌ Skip `activity_log` on a mutation
- ❌ Skip `revalidatePath` after mutation
- ❌ Use `any`
- ❌ Use service role in client code
- ❌ Commit `.env.local`
- ❌ Add a new UI library
- ❌ Add a new font
- ❌ Hardcode colors outside the token system
- ❌ Build a feature without a feature flag if it's AI-powered
- ❌ Let AI block a user action
- ❌ Expose another org's data in AI prompts