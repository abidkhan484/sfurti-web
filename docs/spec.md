# স্ফূর্তি (Sfurti) — Landing Page Spec v2

**Purpose:** Validate demand and collect feedback for the Sfurti cognitive-development toy brand ahead of sourcing/launch. Not a sales page. Success = signups + survey responses that tell you whether to proceed, and with what.

**Reference:** Built against the `sfurti-business-mission` skill. Every section below ties back to the mission lens — fighting passive screen attention through effortful, hands-on play — not generic "educational toys" messaging.

**Success target:** 50 phone signups within 2 weeks of launch via organic Facebook/Instagram traffic.

---

## 1. Goals & non-goals

**Goals**
- Communicate the brand thesis clearly enough that a parent "gets it" in 10 seconds
- Capture phone number from interested parents (primary + only required field)
- Collect qualitative validation signal via an on-page survey (survey-first, signup at the end)
- Look intentional and bilingual (bn/en), not like a placeholder
- Establish a credible brand presence with About Us + Contact pages

**Non-goals (explicitly out of scope for v1)**
- No checkout / payments
- No real product catalog (nothing sourced yet — use category concepts, not SKUs)
- No user accounts/login
- No Phase 2 roadmap content — removed to avoid confusion (nothing is sourced, overpromising hurts trust)
- No CMS — all content is driven by JSON files under `/content/`, editable without touching components

**Success metrics to track from day 1:**
- Phone signup count (target: 50 in 2 weeks)
- Survey completion rate
- Survey answer distribution (screen-time-concern level, willingness-to-pay)
- Source/channel of each lead (UTM params stored passively on Lead row)

---

## 2. Tech stack

- **Framework:** Next.js (App Router), React
- **Hosting:** Vercel (free Hobby tier — sufficient for validation traffic volume)
- **Styling:** Tailwind CSS
- **i18n:** `next-intl` with URL-based locale routing (`/bn/...` default, `/en/...` toggle)
  - Default locale: **Bangla (`bn`)** — the buyer is a Bangladeshi parent
  - Content files: `/content/bn/home.json`, `/content/en/home.json`, etc. (page + language nested)
  - Language toggle in header switches locale; URL reflects language for shareable links
- **Content system:** All text content (all pages, both languages, FAQ items) lives in `/content/{locale}/{page}.json`. Update JSON → redeploy → live. No DB writes needed for content.
- **Form/lead capture backend:**
  - Next.js API route (`/api/lead`) → Prisma → Supabase (free tier, Postgres)
  - Supabase chosen for: built-in Table Editor (view leads + survey results without writing SQL), free 500 MB tier
  - ⚠️ Supabase pauses projects after 1 week of inactivity on free tier — watch this post-launch if traffic drops
  - Connection: use Supabase connection pooler URL with Prisma
- **Survey storage:** Same Supabase DB, `SurveyResponse` table (see data model section)
- **Analytics:** Vercel Analytics (free tier, 2,500 events/month — sufficient for validation window)
  - GA4 can be added later independently — no migration needed, both are separate scripts
- **Passive data collection (no extra user questions):**
  - UTM source/medium/campaign stored on Lead DB row at signup
  - Device type (mobile/desktop) inferred from user-agent, stored on Lead row
  - Scroll depth and time-on-page via Vercel Analytics
- **Deployment:** Vercel free tier, auto-deploy from main branch

---

## 3. Site architecture — multi-page, portfolio style

Three pages for v1. Navigation visible in sticky header on all pages.

| Page | Route | Purpose |
|---|---|---|
| **Home** | `/` (→ `/bn/`) | Main validation page — hero, problem, thesis, products, survey, FAQ, CTA |
| **About Us** | `/about` | Brand story, mission, founder context |
| **Contact** | `/contact` | Stub page — Facebook/Instagram links, phone/email contact |

**Sticky header (all pages):**
- Brand wordmark (left)
- Nav links: Home · About · Contact (center/right)
- Language toggle: বাংলা / EN (right)
- After hero scroll: a subtle "Notify Me" CTA button appears in header

---

## 4. Information architecture — Home page (single scroll)

| # | Section | Purpose | Mission-lens tie-in |
|---|---|---|---|
| 1 | Hero | Hook + primary CTA (phone capture) | Leads with parent's underlying worry, not product features |
| 2 | The Problem | Screen time / attention span framing | States the thesis plainly |
| 3 | The Thesis | Why hands-on/physical play works | Difficulty curve + sustained attention argument |
| 4 | What We're Building (Phase 1 only) | 4 category concept cards, no SKUs | Wooden toys → patience + critical thinking |
| 5 | Survey | 3–4 questions max (≤2 with text input), inline radio/checkbox | Collects actual validation signal |
| 6 | FAQ | Config-driven accordion, editable via JSON | Handles objections + manages expectations |
| 7 | Secondary CTA | Repeat phone capture for scroll-past visitors | — |
| 8 | Footer | Contact, social links, language toggle repeat | — |

---

## 5. Section-by-section content spec

### 5.1 Hero
- **Bilingual headline** (full page switches on toggle — not just headline)
  - **BN direction:** Parent-worry-first framing, written natively in Bangla — not a translation of English
  - **EN direction:** "Give their hands something better to do than scroll."
- **Subheadline:** One sentence naming the mechanism (hands-on play → patience + logical thinking) — not just "fun toys for kids"
- **Primary CTA:** Phone number input + submit button. Label: "লঞ্চের আগে জানতে চাই" / "Notify me when we launch" — avoid "join waitlist" language
- **Email field:** Removed — phone only (WhatsApp/phone is how Bangladeshi F-commerce parents communicate; email adds friction without value for this audience)
- **Hero visual:** Nephew's comic-illustration style — warm, authentic, shows a child mid-task (building/solving), not a toy on a shelf
- **No Phase 2 content anywhere in this section**

### 5.2 The Problem
- Short, 2–3 sentence framing: children's screen time is rising, attention span and patience are the visible cost
- Tone: no shaming toward parents or kids — "a challenge every parent recognizes," not a failure. Frame positively.

### 5.3 The Thesis
- 3 short pillars (icon + 1–2 lines each), pulled from the mission's thesis section:
  1. Physical objects don't auto-advance — no infinite scroll reward loop
  2. Manipulating something by hand builds sustained, sequential attention
  3. Real difficulty curves — can't be "beaten" by mashing a button
- Keep skimmable — icons + short lines, not paragraphs
- All illustrations in nephew's comic style

### 5.4 What We're Building (Phase 1 only)
- 4 category cards with icon + one-line description each (no real product photos — icons/illustration only)
  1. Puzzles
  2. Building sets
  3. Sorting & matching
  4. Construction toys
- **No Phase 2 section, no roadmap content** — removed entirely to avoid confusing visitors about availability
- No pricing or "buy" language anywhere

### 5.5 Survey (core validation instrument)

**Design principle:** Survey-first — visitors can complete and submit without giving a phone number. Phone capture is offered as a soft prompt after submission, not a gate.

**Minimize text input. Use radio/checkbox for every question possible.** ≤ 2 questions may have an open text field.

| # | Question | Input type | Notes |
|---|---|---|---|
| 1 | Child's age range | Radio (single select) | 3–5 / 6–9 / 10–13 / 14+ |
| 2 | How concerned are you about your child's screen time? | Radio (1–5 scale, labeled) | 1 = not at all, 5 = very concerned |
| 3 | Would you try a hands-on physical alternative if available? | Radio | Yes / Maybe / No |
| 4 | What would you expect to pay for one product? (BDT) | Radio (bracket ranges) | e.g. under 500 / 500–1000 / 1000–2000 / over 2000 |
| 5 *(optional)* | What's the hardest part about getting your child off screens? | Open text (optional) | Qualitative gold — real parent language for future ad copy |

**Passive data collected at survey submission (no extra questions):**
- Timestamp
- Device type (mobile/desktop from user-agent)
- UTM source/medium (from URL params, if present)

**After submit:** Show a soft phone capture prompt ("Want to know when we launch? Leave your number") — not required to complete the survey.

### 5.6 FAQ
- Accordion-style, config-driven from `/content/{locale}/home.json` under a `faq` key
- Edit JSON → redeploy → updated on site (no DB needed)
- Suggested initial items (write native Bangla + English versions):
  1. When does Sfurti launch?
  2. Are these toys safe for children?
  3. What age is this right for?
  4. Why wooden toys specifically?
  5. How can I stay updated?
- Add/remove items by editing the JSON array — no code changes needed

### 5.7 Secondary CTA
- Repeat phone capture, shorter framing
- Positioned after survey + FAQ for scroll-past visitors
- Same API route (`/api/lead`) with `source: "secondary_cta"` recorded

### 5.8 Footer
- Facebook / Instagram links (placeholder if not yet created)
- Language toggle (repeated from header)
- Simple copyright line
- Link to Contact page

---

## 6. About Us page

Content driven by `/content/{locale}/about.json`.

**Suggested sections:**
1. Brand origin — why Sfurti exists, the screen-time problem framing
2. Mission statement — "effortful, hands-on cognition" in parent-friendly language
3. Founder/team context (brief, human — builds trust with Bangladeshi parent audience)
4. The product philosophy — wooden toys as the entry point, not the whole story

All copy to be written natively in both Bangla and English.

---

## 7. Contact page

Content driven by `/content/{locale}/contact.json`.

Stub for v1:
- Facebook page link
- Instagram link
- WhatsApp/phone contact (if comfortable making public)
- Brief message: "We're still building — follow us to stay updated"

---

## 8. Content file structure

```
/content/
  en/
    home.json       # All Home page text: hero, problem, thesis, products, survey labels, faq[], cta, footer
    about.json      # About Us page text
    contact.json    # Contact page text
  bn/
    home.json
    about.json
    contact.json
```

**Every user-visible string lives in these files.** Components import content via `next-intl`'s `useTranslations()` hook. No hardcoded strings in JSX.

---

## 9. Design direction

### Brand palette
Built around forest green as primary — signals nature, growth, calm effortful focus (the antidote to dopamine-red screen apps).

| Role | Color | Hex |
|---|---|---|
| Primary | Forest Green | `#2D6A4F` |
| Warm accent | Amber/Honey | `#E8A838` |
| Background | Warm Cream | `#FAF3E0` |
| Text | Deep Charcoal | `#1A1A2E` |
| CTA / Highlight | Terracotta | `#C96A3D` |

### Visual style
- **Illustration:** Nephew's comic-illustration style — warm, authentic, child mid-task (building/solving), not toys on shelves
- **Mobile-first:** All layout decisions start from a 375px mobile viewport. Desktop is a secondary enhancement. Bangladesh F-commerce parents are overwhelmingly on mobile.
- **Lead with the worry, not the toy:** Hero and above-fold content frames the parent's concern before showing product concepts
- **No shaming tone:** Copy review pass specifically for this before launch
- **Bilingual done natively:** Write bn and en copy as separate native drafts, not literal translations. This especially matters for the hero headline.
- **Show effort + payoff visually:** Illustrations depict a child mid-task, not a finished result on a shelf

---

## 10. Data model (Prisma / Supabase)

```prisma
model Lead {
  id          String    @id @default(cuid())
  phone       String
  source      String?   // "hero" | "secondary_cta" | "survey_soft_prompt"
  utmSource   String?   // from UTM params, stored passively
  utmMedium   String?
  utmCampaign String?
  device      String?   // "mobile" | "desktop", from user-agent
  createdAt   DateTime  @default(now())

  surveyResponses SurveyResponse[]
}

model SurveyResponse {
  id                String   @id @default(cuid())
  leadId            String?  // nullable — allow anonymous survey completion
  lead              Lead?    @relation(fields: [leadId], references: [id])
  childAgeRange     String   // "3-5" | "6-9" | "10-13" | "14+"
  screenTimeConcern Int      // 1-5
  wouldTry          String   // "yes" | "maybe" | "no"
  priceExpectation  String   // bracket range e.g. "500-1000"
  openFeedback      String?  // optional qualitative text
  utmSource         String?  // passive, from URL at time of survey
  device            String?  // passive, from user-agent
  createdAt         DateTime @default(now())
}
```

> ⚠️ **Supabase free tier note:** Projects pause after 1 week of inactivity. During the launch validation window this shouldn't be an issue, but monitor it if traffic drops between campaigns.

---

## 11. Open items before building

- [ ] Register domain for Sfurti (resolve before launch, not after)
- [ ] Finalize wordmark using brand palette above (forest green primary + amber accent)
- [ ] Commission illustrations from nephew — brief: child mid-task (building/solving), warm comic style, cream background
- [ ] Write native Bangla copy for all sections and pages (do not machine-translate from English)
- [ ] Create Supabase project + get connection pooler URL for Prisma
- [ ] Create Facebook + Instagram pages (or get handles to link in footer/contact)
- [ ] Confirm 50-signups-in-2-weeks launch target before going live

---

## 12. Suggested build order

1. Set up Next.js + Tailwind + Vercel deploy skeleton with next-intl URL routing (`/bn`, `/en`)
2. Create `/content/` directory with `en/` and `bn/` JSON stubs for all pages
3. Build content loading layer (next-intl config reading from `/content/`)
4. Build sticky header component (wordmark + nav + language toggle)
5. Build static Home page sections (Hero → Footer) with placeholder illustration blocks, wired to content JSON
6. Build About Us + Contact stub pages
7. Build Lead + SurveyResponse Prisma models, Supabase connection, API routes
8. Wire up Hero CTA form and Survey form to API routes
9. Implement passive data capture (UTM params + device) on form submissions
10. Add Vercel Analytics
11. Swap in final copy (native bn + en) once written
12. Swap in final illustrations + wordmark once ready
13. **QA hard on mobile** (375px viewport — this is your primary audience)
14. Launch, drive traffic via Facebook/Instagram
15. Monitor: check Supabase Table Editor daily for lead count + survey responses