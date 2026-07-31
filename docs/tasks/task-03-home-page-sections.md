# Task 03 — Home Page Sections (Hero → Footer)

## Status: DONE

## Objective
Build all eight sections of the Home page in a single-scroll layout. Each section is a standalone React component wired to content JSON — no hardcoded strings. The page must look intentional and brand-aligned at 375px mobile viewport before being treated as done.

---

## Context
- **Spec reference:** `docs/spec.md` §4 (Information architecture), §5 (Section-by-section content spec), §9 (Design direction)
- **Page route:** `src/app/[locale]/page.tsx` (renders at `/bn/` and `/en/`)
- **Dependencies:** task-01 (scaffold), task-02 (header — already handles layout wrapper)
- **No real product photos:** Use placeholder illustration blocks (colored div with aspect ratio) where illustrations are specified. Final illustrations will be swapped in post-design.
- **No pricing, no checkout, no SKUs anywhere on this page.**
- **Survey section (§5.5) is stubbed here — form logic is wired in task-04.**

---

## Deliverables

1. `src/app/[locale]/page.tsx` — assembles all sections
2. One component per section under `src/components/sections/`
3. All content keys added to both locale JSON files

---

## Sections to Build

| Component | File | Spec section |
|---|---|---|
| `HeroSection` | `Hero.tsx` | §5.1 |
| `ProblemSection` | `Problem.tsx` | §5.2 |
| `ThesisSection` | `Thesis.tsx` | §5.3 |
| `ProductsSection` | `Products.tsx` | §5.4 |
| `SurveySection` | `Survey.tsx` | §5.5 (stub — wired in task-04) |
| `FAQSection` | `FAQ.tsx` | §5.6 |
| `SecondaryCTASection` | `SecondaryCTA.tsx` | §5.7 |
| `Footer` | `Footer.tsx` | §5.8 |

---

## Design System Reminder

Use the Tailwind color tokens defined in task-02:
- `bg-bg` — Warm Cream background
- `text-text-main` — Deep Charcoal text
- `text-primary` — Forest Green
- `bg-primary` — Forest Green
- `text-accent` — Amber/Honey
- `bg-cta` / `text-cta` — Terracotta CTA

Typography:
- Import **Hind Siliguri** from Google Fonts (supports Bangla script)
- Import **Inter** for English body text
- Add both to `src/app/layout.tsx` (root layout) via `next/font/google`

---

## Section-by-section Instructions

### Section 1 — Hero (`Hero.tsx`)

**Layout:**
- Full viewport height on mobile (`min-h-screen`)
- Vertically centered content
- Background: Warm Cream — no image, just the illustration placeholder block to the right on desktop (on mobile, illustration is below the text)

**Content structure:**
```
[Headline — parent-worry-first framing]
[Subheadline — mechanism: hands-on play → patience + logical thinking]
[CTA form: phone input + submit button]
[Illustration placeholder block]
```

**Headline approach:**
- bn headline: Lead with the parent's underlying worry (screen time, shrinking attention span) — written natively in Bangla. Do NOT translate the English headline literally.
- en headline: "Give their hands something better to do than scroll."
- Font size: `text-4xl` on mobile, `text-5xl md:text-6xl` on desktop
- Font weight: `font-bold`
- Color: `text-text-main` with key words in `text-primary`

**CTA form:**
- `id="hero-cta-form"` — required (the header's "Notify Me" button scrolls to this ID)
- Phone input: `type="tel"`, `placeholder` from content key `hero.form.placeholder`
- Submit button: Terracotta (`bg-cta text-white`), label from `hero.form.cta`
- Form submission is wired in task-04. For now, make the form functional UI only — `onSubmit` can be a placeholder `console.log`.
- Add a subtle loading state class for the button (disabled + spinner icon)

**Section ID:**
- `id="hero-section"` — required (Header's IntersectionObserver targets this)

**Illustration placeholder:**
- `aspect-square` div, `bg-primary/10 rounded-2xl`
- On mobile: below the text, `w-full max-w-xs mx-auto`
- On desktop: right column of a 2-column grid, `w-full`

**Content keys:**
```json
{
  "hero": {
    "headline": "...",
    "subheadline": "...",
    "form": {
      "placeholder": "আপনার ফোন নম্বর",
      "cta": "লঞ্চের আগে জানতে চাই",
      "cta_en": "Notify me when we launch",
      "submitting": "পাঠানো হচ্ছে...",
      "success": "ধন্যবাদ! আমরা জানাব।"
    }
  }
}
```

---

### Section 2 — The Problem (`Problem.tsx`)

**Layout:**
- Background: slightly different from Warm Cream — use `bg-primary/5` to differentiate
- Max width container, centered
- 2–3 short sentences of text. No bullet points.

**Tone check (critical):**
- DO: "প্রতিটি বাবা-মা এই চ্যালেঞ্জটা চেনেন" (Every parent recognizes this challenge)
- DO NOT: Shame parents or kids. Frame positively — a challenge every parent faces, not a failure.

**Content key:** `problem.body` (string with newline-separated paragraphs, or an array of strings)

---

### Section 3 — The Thesis (`Thesis.tsx`)

**Layout:**
- 3 pillar cards in a row on desktop, stacked on mobile
- Each card: Icon (top) + headline + 1–2 line description
- Cards have subtle border + `bg-white/60 rounded-2xl` glassmorphism feel

**Three pillars (from `docs/spec.md` §5.3 and `docs/business-goal.md`):**
1. **Physical objects don't auto-advance** — no infinite scroll reward loop
2. **Hands build attention** — manipulating something by hand builds sustained, sequential attention
3. **Real difficulty curves** — can't be "beaten" by mashing a button

**Icons:**
Use Lucide React icons (`npm install lucide-react`):
1. `Hand` icon (pillar 1)
2. `Brain` icon (pillar 2)
3. `Puzzle` icon (pillar 3)

Icon color: `text-accent` (Amber)

**Content keys:**
```json
{
  "thesis": {
    "headline": "কেন হাতে-কলমে খেলা আলাদা",
    "pillars": [
      { "icon": "hand", "title": "...", "body": "..." },
      { "icon": "brain", "title": "...", "body": "..." },
      { "icon": "puzzle", "title": "...", "body": "..." }
    ]
  }
}
```

---

### Section 4 — What We're Building (`Products.tsx`)

**Layout:**
- 4 category cards in a 2×2 grid on mobile, 4-column row on desktop
- Each card: Icon/illustration placeholder + category name + one-line description
- Card style: `border border-primary/20 rounded-xl p-6 bg-white/40`

**Four categories (Phase 1 only — from spec §5.4):**
1. Puzzles — `Puzzle` icon
2. Building sets — `Layers` icon
3. Sorting & matching — `Shuffle` icon
4. Construction toys — `Wrench` icon

**Critical constraints:**
- NO pricing anywhere on this section
- NO "buy" language — these are concepts, not products
- NO Phase 2 content
- Label this section clearly: "Phase 1 — আমরা যা তৈরি করছি" / "Phase 1 — What We're Building"

**Content keys:**
```json
{
  "products": {
    "headline": "আমরা যা তৈরি করছি",
    "phase_label": "Phase 1",
    "items": [
      { "icon": "puzzle", "name": "পাজল", "description": "..." },
      { "icon": "layers", "name": "বিল্ডিং সেট", "description": "..." },
      { "icon": "shuffle", "name": "সর্টিং ও ম্যাচিং", "description": "..." },
      { "icon": "wrench", "name": "কনস্ট্রাকশন খেলনা", "description": "..." }
    ]
  }
}
```

---

### Section 5 — Survey (`Survey.tsx` — STUB)

Build the UI shell only. Form submission logic is wired in task-04.

**Layout:**
- Distinct background: `bg-primary/10`
- Headline + 5 questions (see spec §5.5)
- All questions visible at once (no wizard/step flow)
- Question 5 is optional (add "ঐচ্ছিক / Optional" label)
- Submit button: Terracotta, full-width on mobile
- After submit (task-04 wires this): show soft phone capture prompt in same section

**Question spec from `docs/spec.md` §5.5:**

| # | Question | Input type | Options |
|---|---|---|---|
| 1 | Child's age range | Radio | 3–5 / 6–9 / 10–13 / 14+ |
| 2 | Screen time concern (1–5) | Radio scale | 1 (not at all) → 5 (very concerned) |
| 3 | Would try hands-on alternative | Radio | Yes / Maybe / No |
| 4 | Expected price (BDT) | Radio | <500 / 500–1000 / 1000–2000 / >2000 |
| 5 | Hardest part about screens | Textarea (optional) | — |

**Component state for now:**
```ts
const [formState, setFormState] = useState<"idle" | "submitting" | "submitted">("idle");
```

Leave `onSubmit` as a placeholder:
```ts
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // TODO: wired in task-04
  console.log("Survey submit — task-04 will implement this");
};
```

**Content keys:** All question labels, options, and submit button text must come from content JSON under a `survey` key.

---

### Section 6 — FAQ (`FAQ.tsx`)

**Layout:**
- Accordion: one question open at a time
- Smooth open/close animation (`max-height` transition)
- Each item: question (bold) + answer (expandable)

**Config-driven:** FAQ items come from `content/{locale}/home.json` under a `faq` key:

```json
{
  "faq": {
    "headline": "প্রশ্ন ও উত্তর",
    "items": [
      { "q": "Sfurti কখন লঞ্চ হবে?", "a": "আমরা এখনও প্রস্তুতি নিচ্ছি..." },
      { "q": "এই খেলনাগুলো কি শিশুদের জন্য নিরাপদ?", "a": "হ্যাঁ..." },
      { "q": "কোন বয়সের জন্য উপযুক্ত?", "a": "..." },
      { "q": "কাঠের খেলনা কেন?", "a": "..." },
      { "q": "আপডেট কীভাবে পাব?", "a": "..." }
    ]
  }
}
```

Write both `bn` and `en` versions. The Bangla version must be written natively — not translated.

**Interaction:** Clicking a question toggles `isOpen` state. Only one item open at a time. Use `aria-expanded` for accessibility.

---

### Section 7 — Secondary CTA (`SecondaryCTA.tsx`)

**Layout:**
- Same phone input + submit button as hero
- Shorter framing text (1 sentence)
- Background: Forest Green (`bg-primary`) — dark section to contrast
- Text: white on dark green

**Form:** Same API route (`/api/lead`) will be used — form submission wired in task-04. For now, UI only.

**Important:** Pass `source: "secondary_cta"` when submitting (wired in task-04).

**Content keys:**
```json
{
  "secondary_cta": {
    "headline": "লঞ্চের আগে জানুন",
    "subheadline": "...",
    "form": {
      "placeholder": "আপনার ফোন নম্বর",
      "cta": "জানাতে চাই"
    }
  }
}
```

---

### Section 8 — Footer (`Footer.tsx`)

**Layout:**
- Dark background: `bg-text-main` (Deep Charcoal)
- Text: white / light
- Three columns on desktop, stacked on mobile:
  1. Wordmark + tagline
  2. Nav links (repeat from header)
  3. Social links + language toggle

**Content:**
- Facebook link: placeholder `#` until real page is created
- Instagram link: placeholder `#`
- Copyright: `© 2024 স্ফূর্তি. সর্বস্বত্ব সংরক্ষিত।` / `© 2024 Sfurti. All rights reserved.`
- Language toggle: same as header

**Content keys:**
```json
{
  "footer": {
    "tagline": "...",
    "social": {
      "facebook": "Facebook",
      "instagram": "Instagram"
    },
    "contact_link": "Contact",
    "copyright": "© 2024 স্ফূর্তি"
  }
}
```

---

## Page Assembly

`src/app/[locale]/page.tsx`:

```tsx
import HeroSection from "@/components/sections/Hero";
import ProblemSection from "@/components/sections/Problem";
import ThesisSection from "@/components/sections/Thesis";
import ProductsSection from "@/components/sections/Products";
import SurveySection from "@/components/sections/Survey";
import FAQSection from "@/components/sections/FAQ";
import SecondaryCTASection from "@/components/sections/SecondaryCTA";
import Footer from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <ThesisSection />
      <ProductsSection />
      <SurveySection />
      <FAQSection />
      <SecondaryCTASection />
      <Footer />
    </>
  );
}
```

---

## Acceptance Criteria

- [ ] All 8 sections render without errors on `/bn/` and `/en/`
- [ ] `id="hero-section"` present on the Hero div (required by Header's IntersectionObserver)
- [ ] `id="hero-cta-form"` present on the Hero form (required by Header's "Notify Me" button)
- [ ] No hardcoded strings — all text from locale JSON
- [ ] FAQ accordion opens/closes with animation; only one item open at a time
- [ ] Survey section renders all 5 questions with correct input types
- [ ] Products section shows Phase 1 label; no pricing; no Phase 2 content
- [ ] Footer social links render (even if `href="#"` placeholder)
- [ ] Language toggle in footer works (same as header toggle)
- [ ] All sections visible and legible at 375px mobile viewport
- [ ] `npm run build` passes with zero TypeScript errors

---

## Files Created / Modified

```
src/app/[locale]/page.tsx                    (created)
src/components/sections/Hero.tsx             (created)
src/components/sections/Problem.tsx          (created)
src/components/sections/Thesis.tsx           (created)
src/components/sections/Products.tsx         (created)
src/components/sections/Survey.tsx           (created, stub)
src/components/sections/FAQ.tsx              (created)
src/components/sections/SecondaryCTA.tsx     (created)
src/components/sections/Footer.tsx           (created)
content/bn/home.json                         (modified: all section keys)
content/en/home.json                         (modified: all section keys)
```
