# Task 04 — Survey Form, Lead Capture & API Routes

## Status: DONE

## Objective
Wire up the Lead phone capture form (hero + secondary CTA) and the Survey form to Next.js API routes. Implement Prisma + Supabase database connection, passive data capture (UTM params, device type), and the post-survey soft phone capture prompt.

---

## Context
- **Spec reference:** `docs/spec.md` §2 (Tech stack), §5.5 (Survey), §5.7 (Secondary CTA), §10 (Data model)
- **Database:** Supabase (free tier, Postgres) via Prisma ORM
- **API routes:** Next.js App Router route handlers (`src/app/api/`)
- **Dependencies:** task-01 (scaffold), task-03 (Survey and CTA UI stubs)
- **Survey philosophy:** Survey-first — visitors can complete the survey without giving a phone number. Phone capture is a soft prompt after survey submission, not a gate.

---

## Deliverables

1. `prisma/schema.prisma` — data model
2. `src/lib/prisma.ts` — Prisma client singleton
3. `src/app/api/lead/route.ts` — POST endpoint for phone capture
4. `src/app/api/survey/route.ts` — POST endpoint for survey responses
5. `src/hooks/useUTM.ts` — reads UTM params from URL, returns them for form payloads
6. `src/hooks/useDevice.ts` — detects mobile/desktop from user-agent
7. Updated `src/components/sections/Survey.tsx` — full form logic
8. Updated `src/components/sections/Hero.tsx` — full form logic
9. Updated `src/components/sections/SecondaryCTA.tsx` — full form logic
10. Environment variables documented in `.env.example`

---

## Data Model (from spec §10)

`prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Lead {
  id          String    @id @default(cuid())
  phone       String
  source      String?   // "hero" | "secondary_cta" | "survey_soft_prompt"
  utmSource   String?
  utmMedium   String?
  utmCampaign String?
  device      String?   // "mobile" | "desktop"
  createdAt   DateTime  @default(now())

  surveyResponses SurveyResponse[]
}

model SurveyResponse {
  id                String   @id @default(cuid())
  leadId            String?  // nullable — allow anonymous survey completion
  lead              Lead?    @relation(fields: [leadId], references: [id])
  childAgeRange     String   // "3-5" | "6-9" | "10-13" | "14+"
  screenTimeConcern Int      // 1–5
  wouldTry          String   // "yes" | "maybe" | "no"
  priceExpectation  String   // "<500" | "500-1000" | "1000-2000" | ">2000"
  openFeedback      String?  // optional qualitative text
  utmSource         String?
  device            String?
  createdAt         DateTime @default(now())
}
```

---

## Environment Variables

Create `.env.example` at project root:

```env
# Supabase connection pooler URL (use this for Prisma in production)
DATABASE_URL="postgresql://postgres.xxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase direct URL (used for migrations — bypasses pooler)
DIRECT_URL="postgresql://postgres.xxxx:password@db.xxxx.supabase.co:5432/postgres"
```

Copy `.env.example` to `.env.local` (git-ignored) and fill in real values from Supabase dashboard.

> How to get these values in Supabase:
> 1. Go to supabase.com → your project → Settings → Database
> 2. Under "Connection string" select "Transaction mode" → copy for `DATABASE_URL`
> 3. Under "Connection string" select "Direct connection" → copy for `DIRECT_URL`

Add `.env.local` to `.gitignore` if not already present.

---

## Installation

```bash
npm install prisma @prisma/client
npx prisma init --datasource-provider postgresql
```

After filling `.env.local` with real Supabase credentials:
```bash
npx prisma db push     # creates tables from schema
npx prisma generate    # generates Prisma client
```

---

## Implementation Instructions

### 1. Prisma client singleton

`src/lib/prisma.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

This prevents multiple Prisma client instances in development hot-reload.

---

### 2. UTM hook

`src/hooks/useUTM.ts`:

```ts
"use client";
import { useSearchParams } from "next/navigation";

export type UTMParams = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

export function useUTM(): UTMParams {
  const searchParams = useSearchParams();
  return {
    utmSource: searchParams.get("utm_source"),
    utmMedium: searchParams.get("utm_medium"),
    utmCampaign: searchParams.get("utm_campaign"),
  };
}
```

---

### 3. Device detection hook

`src/hooks/useDevice.ts`:

```ts
"use client";
import { useEffect, useState } from "react";

export function useDevice(): "mobile" | "desktop" {
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");

  useEffect(() => {
    const ua = navigator.userAgent;
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
    setDevice(isMobile ? "mobile" : "desktop");
  }, []);

  return device;
}
```

---

### 4. Lead API route

`src/app/api/lead/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const leadSchema = z.object({
  phone: z.string().min(10).max(15),
  source: z.enum(["hero", "secondary_cta", "survey_soft_prompt"]).optional(),
  utmSource: z.string().nullable().optional(),
  utmMedium: z.string().nullable().optional(),
  utmCampaign: z.string().nullable().optional(),
  device: z.enum(["mobile", "desktop"]).optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as unknown;
    const data = leadSchema.parse(body);

    const lead = await prisma.lead.create({
      data: {
        phone: data.phone,
        source: data.source,
        utmSource: data.utmSource ?? null,
        utmMedium: data.utmMedium ?? null,
        utmCampaign: data.utmCampaign ?? null,
        device: data.device,
      },
    });

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    console.error("Lead creation error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
```

Install Zod:
```bash
npm install zod
```

---

### 5. Survey API route

`src/app/api/survey/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const surveySchema = z.object({
  childAgeRange: z.enum(["3-5", "6-9", "10-13", "14+"]),
  screenTimeConcern: z.number().int().min(1).max(5),
  wouldTry: z.enum(["yes", "maybe", "no"]),
  priceExpectation: z.enum(["<500", "500-1000", "1000-2000", ">2000"]),
  openFeedback: z.string().max(1000).optional(),
  utmSource: z.string().nullable().optional(),
  device: z.enum(["mobile", "desktop"]).optional(),
  leadId: z.string().optional(), // optional — linked after soft prompt
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as unknown;
    const data = surveySchema.parse(body);

    const response = await prisma.surveyResponse.create({
      data: {
        childAgeRange: data.childAgeRange,
        screenTimeConcern: data.screenTimeConcern,
        wouldTry: data.wouldTry,
        priceExpectation: data.priceExpectation,
        openFeedback: data.openFeedback ?? null,
        utmSource: data.utmSource ?? null,
        device: data.device ?? null,
        leadId: data.leadId ?? null,
      },
    });

    return NextResponse.json(
      { success: true, id: response.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    console.error("Survey submission error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

### 6. Wire up Hero CTA form

Update `src/components/sections/Hero.tsx` to:

1. Import `useUTM`, `useDevice`, `useState`
2. Manage state:
   ```ts
   const [phone, setPhone] = useState("");
   const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
   ```
3. `onSubmit`:
   ```ts
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setStatus("submitting");
     try {
       const res = await fetch("/api/lead", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           phone,
           source: "hero",
           ...utm,
           device,
         }),
       });
       if (!res.ok) throw new Error("Failed");
       setStatus("success");
       setPhone("");
     } catch {
       setStatus("error");
     }
   };
   ```
4. Button disabled + shows spinner while `status === "submitting"`
5. On success: show success message from content key `hero.form.success`
6. On error: show error message from content key `hero.form.error`

---

### 7. Wire up Survey form

Update `src/components/sections/Survey.tsx` to:

1. Manage form state with `useReducer` or structured `useState`
2. Track: `childAgeRange`, `screenTimeConcern`, `wouldTry`, `priceExpectation`, `openFeedback`
3. On submit: POST to `/api/survey`
4. After successful survey submission:
   - Set `surveyStatus = "submitted"`
   - Show soft phone prompt: "লঞ্চের কথা জানতে আপনার নম্বর দিন" with another phone input
   - The soft phone prompt submits to `/api/lead` with `source: "survey_soft_prompt"` and the `leadId` returned from the survey response
5. Phone prompt is not required — can be dismissed

---

### 8. Wire up Secondary CTA form

Same as Hero form but with `source: "secondary_cta"`.

---

## Passive Data Capture Summary

At every form submission:
- UTM params (`utm_source`, `utm_medium`, `utm_campaign`) are read from URL via `useUTM` hook — stored on every Lead and SurveyResponse row
- Device type (`mobile` | `desktop`) read via `useDevice` hook — stored passively
- Timestamp: stored automatically via Prisma `@default(now())`
- **No extra questions asked of the user**

---

## Acceptance Criteria

- [ ] `POST /api/lead` with valid phone returns `201` and creates a DB row
- [ ] `POST /api/lead` with invalid phone (too short) returns `400`
- [ ] `POST /api/survey` with all required fields returns `201`
- [ ] `POST /api/survey` with missing required field returns `400`
- [ ] Hero form submits successfully and shows success message
- [ ] Hero form shows error state on network failure
- [ ] Survey form submits all 5 fields (question 5 optional)
- [ ] After survey submission, soft phone prompt appears
- [ ] Soft phone prompt is not required (dismissible or skippable)
- [ ] Secondary CTA form submits with `source: "secondary_cta"`
- [ ] UTM params from URL are stored on Lead + SurveyResponse rows
- [ ] Device type is stored on Lead + SurveyResponse rows
- [ ] `npx prisma db push` succeeds against Supabase (manual step, requires `.env.local`)
- [ ] Rows visible in Supabase Table Editor after test submissions

---

## Files Created / Modified

```
prisma/schema.prisma                       (created)
.env.example                               (created)
.gitignore                                 (modified: ensure .env.local is listed)
src/lib/prisma.ts                          (created)
src/hooks/useUTM.ts                        (created)
src/hooks/useDevice.ts                     (created)
src/app/api/lead/route.ts                  (created)
src/app/api/survey/route.ts                (created)
src/components/sections/Survey.tsx         (modified: full form logic)
src/components/sections/Hero.tsx           (modified: full form logic)
src/components/sections/SecondaryCTA.tsx   (modified: full form logic)
```
