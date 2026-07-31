# Task 06 — i18n Content: Native Bangla & English Copy

## Status: DONE

## Objective
Fill all locale JSON content files with production-ready, natively written copy for both Bangla (`bn`) and English (`en`). This task is a content task — it requires writing, not coding. The Bangla copy must be authored by a native speaker or reviewed by one.

---

## Context
- **Spec reference:** `docs/spec.md` §5 (Section-by-section content spec), §9 (Design direction — bilingual done natively)
- **Core rule from spec:** "Write bn and en copy as separate native drafts, not literal translations. This especially matters for the hero headline."
- **Dependencies:** task-03 (home sections scaffold), task-04 (API), task-05 (about + contact pages) must all be complete so all content keys exist and are consumed by components before this task populates them.
- **Scope:** This task touches only `/content/` JSON files — no component code changes.

---

## Deliverables

6 content JSON files fully populated:

| File | Pages consuming it |
|---|---|
| `content/bn/home.json` | Home page (all 8 sections) |
| `content/en/home.json` | Home page (all 8 sections) |
| `content/bn/about.json` | About Us page |
| `content/en/about.json` | About Us page |
| `content/bn/contact.json` | Contact page |
| `content/en/contact.json` | Contact page |

---

## Content Guidelines

### Brand voice (from `docs/business-goal.md`)
1. **Lead with the parent's worry** — screen addiction, shrinking attention span. "Give them something better to do with their hands" beats "fun new toy."
2. **No shaming** — frame positively. A challenge every parent recognizes, not a failure.
3. **Demonstrable effort and payoff** — a child working through something. Before/after angles.
4. **Mechanism, not claims** — name the specific mechanism (physical objects → sequential attention → patience). Not generic "educational toys."

### Bangla copy rules
- Write natively in Bangla. Do NOT translate English drafts.
- Use conversational, warm Bangla — not formal or bureaucratic.
- Use Unicode Bangla script. Do NOT use Banglish (roman-script Bangla).
- The hero headline must be written from a parent's first-person worry perspective.
- FAQ answers should sound like a trusted friend explaining, not a product page.

### English copy rules
- Write for an international or English-preferring Bangladeshi parent.
- The hero headline: "Give their hands something better to do than scroll."
- Tone: warm, confident, not preachy. Acknowledge the problem without lecturing.

---

## Content Schema Reference

Below is the complete content schema with all required keys. Fill in every `"..."` value.

### `content/bn/home.json`

```json
{
  "nav": {
    "home": "হোম",
    "about": "আমাদের সম্পর্কে",
    "contact": "যোগাযোগ"
  },
  "header": {
    "cta": "লঞ্চের আগে জানতে চাই"
  },
  "hero": {
    "headline": "...",
    "subheadline": "...",
    "form": {
      "placeholder": "আপনার ফোন নম্বর লিখুন",
      "cta": "লঞ্চের আগে জানতে চাই",
      "submitting": "পাঠানো হচ্ছে...",
      "success": "ধন্যবাদ! লঞ্চের সময় আমরা জানাব।",
      "error": "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।"
    }
  },
  "problem": {
    "headline": "...",
    "body": "..."
  },
  "thesis": {
    "headline": "...",
    "pillars": [
      { "icon": "hand", "title": "...", "body": "..." },
      { "icon": "brain", "title": "...", "body": "..." },
      { "icon": "puzzle", "title": "...", "body": "..." }
    ]
  },
  "products": {
    "headline": "আমরা যা তৈরি করছি",
    "phase_label": "Phase 1",
    "items": [
      { "icon": "puzzle", "name": "পাজল", "description": "..." },
      { "icon": "layers", "name": "বিল্ডিং সেট", "description": "..." },
      { "icon": "shuffle", "name": "সর্টিং ও ম্যাচিং", "description": "..." },
      { "icon": "wrench", "name": "কনস্ট্রাকশন খেলনা", "description": "..." }
    ]
  },
  "survey": {
    "headline": "আপনার মতামত দিন",
    "subheadline": "...",
    "questions": {
      "age": {
        "label": "আপনার সন্তানের বয়স কত?",
        "options": [
          { "value": "3-5", "label": "৩–৫ বছর" },
          { "value": "6-9", "label": "৬–৯ বছর" },
          { "value": "10-13", "label": "১০–১৩ বছর" },
          { "value": "14+", "label": "১৪+ বছর" }
        ]
      },
      "screenTime": {
        "label": "আপনার সন্তানের স্ক্রিন সময় নিয়ে আপনি কতটা উদ্বিগ্ন?",
        "scale_min": "মোটেই না",
        "scale_max": "খুবই উদ্বিগ্ন"
      },
      "wouldTry": {
        "label": "হাতে-কলমে বিকল্প পেলে কি আপনি চেষ্টা করবেন?",
        "options": [
          { "value": "yes", "label": "হ্যাঁ" },
          { "value": "maybe", "label": "হয়তো" },
          { "value": "no", "label": "না" }
        ]
      },
      "price": {
        "label": "একটি পণ্যের জন্য আপনি কত টাকা দিতে প্রস্তুত?",
        "options": [
          { "value": "<500", "label": "৫০০ টাকার কম" },
          { "value": "500-1000", "label": "৫০০–১,০০০ টাকা" },
          { "value": "1000-2000", "label": "১,০০০–২,০০০ টাকা" },
          { "value": ">2000", "label": "২,০০০ টাকার বেশি" }
        ]
      },
      "openFeedback": {
        "label": "সন্তানকে স্ক্রিন থেকে দূরে রাখার সবচেয়ে কঠিন অংশটা কী?",
        "placeholder": "আপনার অভিজ্ঞতা শেয়ার করুন (ঐচ্ছিক)",
        "optional_label": "ঐচ্ছিক"
      }
    },
    "submit": "জমা দিন",
    "submitting": "জমা হচ্ছে...",
    "success": {
      "headline": "ধন্যবাদ!",
      "body": "...",
      "soft_prompt": {
        "headline": "লঞ্চের খবর পেতে চান?",
        "placeholder": "আপনার ফোন নম্বর",
        "cta": "জানান",
        "skip": "এড়িয়ে যান"
      }
    }
  },
  "faq": {
    "headline": "প্রশ্ন ও উত্তর",
    "items": [
      { "q": "Sfurti কখন লঞ্চ হবে?", "a": "..." },
      { "q": "এই খেলনাগুলো কি শিশুদের জন্য নিরাপদ?", "a": "..." },
      { "q": "কোন বয়সের জন্য উপযুক্ত?", "a": "..." },
      { "q": "কাঠের খেলনা কেন?", "a": "..." },
      { "q": "আপডেট কীভাবে পাব?", "a": "..." }
    ]
  },
  "secondary_cta": {
    "headline": "লঞ্চের আগে জানুন",
    "subheadline": "...",
    "form": {
      "placeholder": "আপনার ফোন নম্বর",
      "cta": "জানাতে চাই",
      "submitting": "পাঠানো হচ্ছে...",
      "success": "ধন্যবাদ! আমরা জানাব।",
      "error": "সমস্যা হয়েছে। আবার চেষ্টা করুন।"
    }
  },
  "footer": {
    "tagline": "...",
    "social": {
      "facebook": "Facebook",
      "instagram": "Instagram"
    },
    "contact_link": "যোগাযোগ",
    "copyright": "© ২০২৪ স্ফূর্তি। সর্বস্বত্ব সংরক্ষিত।"
  }
}
```

### `content/en/home.json`

Mirror the same key structure with native English copy. Key differences:
- `hero.headline` = "Give their hands something better to do than scroll."
- `hero.subheadline` = one sentence naming the mechanism
- All FAQ answers written for an English reader
- `footer.copyright` = "© 2024 Sfurti. All rights reserved."

### `content/bn/about.json`

```json
{
  "meta": {
    "title": "আমাদের সম্পর্কে — স্ফূর্তি",
    "description": "স্ফূর্তি কেন তৈরি হলো এবং আমাদের মিশন কী"
  },
  "hero": {
    "headline": "স্ফূর্তি কেন?",
    "subheadline": "..."
  },
  "origin": {
    "headline": "কীভাবে শুরু",
    "body": "..."
  },
  "mission": {
    "headline": "আমাদের লক্ষ্য",
    "statement": "..."
  },
  "team": {
    "headline": "আমরা কারা",
    "body": "..."
  },
  "philosophy": {
    "headline": "আমাদের পণ্য দর্শন",
    "body": "..."
  }
}
```

### `content/bn/contact.json`

```json
{
  "meta": {
    "title": "যোগাযোগ — স্ফূর্তি",
    "description": "স্ফূর্তির সাথে যোগাযোগ করুন"
  },
  "headline": "যোগাযোগ করুন",
  "body": "আমরা এখনও তৈরি হচ্ছি — আপডেটের জন্য আমাদের ফলো করুন।",
  "social": {
    "facebook": {
      "label": "Facebook-এ ফলো করুন",
      "href": "#"
    },
    "instagram": {
      "label": "Instagram-এ ফলো করুন",
      "href": "#"
    }
  },
  "phone": {
    "label": "WhatsApp / ফোন",
    "number": ""
  },
  "back_link": "হোমে ফিরুন"
}
```

---

## Copy Review Checklist

Before marking this task complete, review each piece of copy against these checks:

### Bangla copy review
- [ ] Hero headline: Does it lead with a parent's specific worry (not a product feature)?
- [ ] Problem section: Does it avoid shaming parents or children?
- [ ] Thesis pillars: Are they skimmable (1–2 lines each) and specific (mechanism, not claim)?
- [ ] FAQ answers: Do they sound like a trusted friend, not a product page?
- [ ] Survey success message: Is it warm and human?
- [ ] All copy: Is it natively written in Bangla, not translated from English?

### English copy review
- [ ] Hero headline: Is it "Give their hands something better to do than scroll." exactly?
- [ ] All sections: Written for English reader, not a literal translation of Bangla?
- [ ] Problem section: Non-shaming, positive framing?

---

## Acceptance Criteria

- [ ] All `"..."` placeholders replaced with real copy in all 6 JSON files
- [ ] No machine-translated Bangla — must be natively written or reviewed by a native speaker
- [ ] Copy review checklist above is fully checked off
- [ ] `npm run build` passes with no errors (JSON content is valid)
- [ ] Visual check: render both `/bn/` and `/en/` in browser, read through all sections
- [ ] Survey question labels are accurate to the question spec in `docs/spec.md` §5.5

---

## Files Created / Modified

```
content/bn/home.json      (filled — previously stub {})
content/en/home.json      (filled — previously stub {})
content/bn/about.json     (filled — previously stub {})
content/en/about.json     (filled — previously stub {})
content/bn/contact.json   (filled — previously stub {})
content/en/contact.json   (filled — previously stub {})
```
