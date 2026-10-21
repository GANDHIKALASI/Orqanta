# Orqanta — Design System

---

## 1. Design Principles

1. **Clarity over cleverness** — the UI disappears; the work remains
2. **Trust signals everywhere** — clean typography, generous space, no clutter
3. **AI is visible, not intrusive** — subtle violet accent marks AI output; users always know when AI touched something
4. **Fast and confident** — snappy transitions, optimistic UI, immediate feedback
5. **Mobile-first ergonomics** — thumbs reach everything

---

## 2. Color Palette

### Base (Zinc Scale)
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#FAFAFA` (zinc-50) | Page background |
| `--surface` | `#FFFFFF` | Cards, dialogs, panels |
| `--border` | `#E4E4E7` (zinc-200) | Card borders, dividers |
| `--border-strong` | `#D4D4D8` (zinc-300) | Input borders, hover states |
| `--text` | `#18181B` (zinc-900) | Primary text |
| `--text-muted` | `#71717A` (zinc-500) | Secondary text, labels |
| `--text-subtle` | `#A1A1AA` (zinc-400) | Placeholders, disabled |

### Accent — Primary Action
| Token | Value | Usage |
|---|---|---|
| `--primary` | `#18181B` (zinc-900) | Primary buttons, active nav |
| `--primary-hover` | `#27272A` (zinc-800) | Hover |
| `--primary-fg` | `#FFFFFF` | Text on primary |

### Accent — AI / Intelligence
| Token | Value | Usage |
|---|---|---|
| `--ai-bg` | `#F5F3FF` (violet-50) | AI card background |
| `--ai-border` | `#DDD6FE` (violet-200) | AI card border |
| `--ai-text` | `#6D28D9` (violet-700) | AI labels |
| `--ai-accent` | `#8B5CF6` (violet-500) | AI icons, sparkles |

### Semantic
| Token | Value | Usage |
|---|---|---|
| `--success` | `#10B981` (emerald-500) | Resolved, success toasts |
| `--success-bg` | `#ECFDF5` (emerald-50) | Success badges |
| `--warning` | `#F59E0B` (amber-500) | Open, insurance expiring |
| `--warning-bg` | `#FFFBEB` (amber-50) | Warning badges |
| `--danger` | `#EF4444` (red-500) | Urgent, errors, delete |
| `--danger-bg` | `#FEF2F2` (red-50) | Danger badges |
| `--info` | `#3B82F6` (blue-500) | In progress, medium priority |
| `--info-bg` | `#EFF6FF` (blue-50) | Info badges |

### Status Mapping
| Status | Color | Badge bg | Text |
|---|---|---|---|
| open | amber | `--warning-bg` | `--warning` |
| in_progress | blue | `--info-bg` | `--info` |
| resolved | emerald | `--success-bg` | `--success` |
| closed | zinc | `#F4F4F5` | `--text-muted` |

### Priority Mapping
| Priority | Color | Badge bg | Text |
|---|---|---|---|
| low | zinc | `#F4F4F5` | `--text-muted` |
| medium | blue | `--info-bg` | `--info` |
| high | orange | `#FFF7ED` | `#EA580C` (orange-600) |
| urgent | red | `--danger-bg` | `--danger` |

---

## 3. Typography

### Font Family
- **Primary:** `Inter` — via `next/font/google`
- **Monospace:** `JetBrains Mono` — for code, API keys, ticket IDs
- **Fallback:** `system-ui, -apple-system, sans-serif`

### Type Scale

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `text-2xl` | 24px | 32px | 600 (semibold) | Page titles |
| `text-xl` | 20px | 28px | 600 | Section headers, card titles |
| `text-lg` | 18px | 28px | 500 (medium) | Sub-headers |
| `text-base` | 16px | 24px | 400 (regular) | Body text |
| `text-sm` | 14px | 20px | 400 | Table cells, labels, secondary |
| `text-xs` | 12px | 16px | 500 | Badges, meta, timestamps |

### Weights
- Regular: 400 (body, descriptions)
- Medium: 500 (labels, nav, table headers)
- Semibold: 600 (headings, buttons, card titles)
- Bold: 700 (rare, marketing only)

### Letter Spacing
- Headings: `-0.02em` (tight)
- Body: `0` (default)
- All-caps labels: `0.05em` (wide)

### Numbers
- Tabular numerals on all stat cards, tables, metrics
- Use `font-variant-numeric: tabular-nums`

---

## 4. Layout

### Grid
- 12-column grid, 24px gutter
- Content max-width: 1280px (dashboard cards), 720px (forms, reports)
- Sidebar: 240px fixed
- Top bar: 64px height

### Spacing Scale (multiples of 4px)
| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Icon gaps, tight |
| `space-2` | 8px | Button padding, small gaps |
| `space-3` | 12px | Form field gaps |
| `space-4` | 16px | Card padding (mobile) |
| `space-5` | 20px | Card padding (desktop) |
| `space-6` | 24px | Section gaps |
| `space-8` | 32px | Page padding |
| `space-12` | 48px | Major sections |

### Page Layout
```text
┌─────────────────────────────────────────────────┐
│ Sidebar (240px) │ Top bar (64px)                │
│                 ├───────────────────────────────┤
│                 │                               │
│                 │ Page content (p-8, max-1280)  │
│                 │                               │
│                 │                               │
└─────────────────────────────────────────────────┘
```

### Mobile Layout
- Sidebar → slide-out Sheet (triggers from hamburger)
- Top bar: hamburger left, title center, actions right
- Cards stack vertically
- Tables → card lists
- Forms full-width, larger touch targets (min 44px)

---

## 5. Components

### Buttons

**Primary**
- Background: `--primary` (#18181B)
- Text: white, `text-sm font-medium`
- Height: 40px, padding: 0 16px, `rounded-lg`
- Hover: `--primary-hover`
- Focus: 2px ring, offset 2, ring-zinc-900/20
- Disabled: opacity 50, cursor not-allowed
- Loading: spinner left of label, label unchanged

**Secondary (outline)**
- Background: transparent
- Border: 1px `--border-strong`
- Text: `--text`
- Hover: `bg-zinc-50`

**Ghost**
- Background: transparent
- Hover: `bg-zinc-100`
- Text: `--text-muted` → `--text` on hover

**Destructive**
- Background: `--danger`
- Text: white
- Hover: red-600

**AI Action** (e.g., "✨ Suggest vendor")
- Background: `--ai-bg`
- Border: 1px `--ai-border`
- Text: `--ai-text`
- Icon: `Sparkles` from lucide
- Hover: bg-violet-100

### Inputs
- Height: 40px, padding: 0 12px
- Border: 1px `--border-strong`, `rounded-lg`
- Focus: 2px ring `--primary/20`, border `--primary`
- Error: border `--danger`, ring `--danger/20`, helper text below
- Placeholder: `--text-subtle`
- Label: `text-sm font-medium` above, 6px gap

### Cards
- Background: `--surface`
- Border: 1px `--border`
- `rounded-lg`, `shadow-sm`
- Padding: 20px (mobile 16px)
- Hover (if interactive): `shadow-md`, border `--border-strong`

### Badges
- Height: 20px, padding: 0 8px
- `rounded-full`, `text-xs font-medium`
- Background + text per semantic mapping above

### Table
- Header: `text-xs font-medium text-zinc-500 uppercase tracking-wide`, height 40px
- Row: `text-sm`, height 56px, border-bottom `--border`
- Hover row: `bg-zinc-50`
- Selected: `bg-zinc-100`
- Clickable rows: `cursor-pointer`

### Sidebar
- Background: `#09090B` (zinc-950)
- Width: 240px, full height, fixed
- Logo area: 64px height, `Building2` icon + "Orqanta" wordmark, white
- Nav item: 40px height, `text-sm font-medium text-zinc-400`, `px-3`, `rounded-lg`
- Hover: `bg-zinc-900 text-zinc-100`
- Active: `bg-zinc-800 text-white`
- Icon: 18px, gap 12px
- Bottom: user avatar 32px circle + name + logout

### Top Bar
- Height: 64px, border-bottom `--border`
- Page title: `text-xl font-semibold`
- Right side: primary button + icon buttons (bell) + avatar dropdown
- Backdrop blur on scroll: `backdrop-blur-md bg-white/80`

### Dialogs / Sheets
- Backdrop: `bg-black/40`, `backdrop-blur-sm`
- Panel: `bg-white`, `rounded-xl`, `shadow-2xl`, max-width 480px (dialog) / 320px (sheet)
- Padding: 24px
- Header: title `text-lg font-semibold`, close X top right
- Footer: actions right-aligned, primary on right

### Toasts (sonner)
- Position: bottom-right
- Success: emerald accent bar
- Error: red accent bar
- Duration: 4s

### AI Cards
- Background: `--ai-bg`
- Border: 1px `--ai-border`
- `rounded-lg`, padding 16px
- Header row: `Sparkles` icon (16px, `--ai-accent`) + label `text-xs font-medium --ai-text uppercase tracking-wide`
- Body: `text-sm --text`
- Optional footer: action buttons (violet-tinted)

### Empty States
- Centered vertically, min-height 320px
- Icon: 48px, `--text-subtle`
- Title: `text-lg font-semibold --text`
- Description: `text-sm --text-muted`, max-width 320px
- CTA: primary button below, 24px gap

### Skeletons
- Background: `bg-zinc-100`, `rounded`, `animate-pulse`
- Card skeleton: match real card dimensions exactly
- Table skeleton: 5 fake rows

---

## 6. Motion

- **Duration:** 150ms (micro), 200ms (standard), 300ms (page transition)
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out)
- **Hover:** instant to 150ms
- **Modals:** fade + scale 0.95→1
- **Toasts:** slide up + fade
- **Skeletons:** pulse (2s loop)
- **No bounce.** No spring. No dramatic entrances.

---

## 7. Iconography

- **Library:** lucide-react
- **Sizes:** 16px (inline), 18px (nav), 20px (buttons), 24px (hero), 48px (empty state)
- **Stroke:** 1.5px default, 2px on active/emphasis
- **Color:** inherit from text

### Key icons
- Dashboard → `LayoutDashboard`
- Work Orders → `Wrench`
- Properties → `Building2`
- Vendors → `Users`
- Tenants → `UserCheck`
- Settings → `Settings`
- AI → `Sparkles`
- Create → `Plus`
- Logout → `LogOut`

---

## 8. Accessibility

- All interactive elements keyboard-focusable
- Focus ring: 2px `--primary/40`, offset 2
- Form labels always present (never placeholder-only)
- Color contrast ≥ 4.5:1 for body, ≥ 3:1 for large text
- Error messages tied to inputs via `aria-describedby`
- Dialogs trap focus, return focus on close
- Skip-to-content link at top of page
- Motion respects `prefers-reduced-motion`
- Touch targets ≥ 44×44px on mobile

---

## 9. Reference

When in doubt, look at **Linear, Vercel dashboard, or Stripe**. Boring, clean, professional. Copy the mood, not the pixels.
