import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as {
      childAgeRange?: string;
      screenTimeConcern?: number;
      wouldTry?: string;
      priceExpectation?: string;
      openFeedback?: string | null;
      utmSource?: string | null;
      device?: string | null;
      leadId?: string | null;
    };

    const {
      childAgeRange,
      screenTimeConcern,
      wouldTry,
      priceExpectation,
      openFeedback,
      utmSource,
      device,
      leadId,
    } = body;

    if (!childAgeRange || !screenTimeConcern || !wouldTry || !priceExpectation) {
      return NextResponse.json(
        { success: false, message: "Missing required survey fields" },
        { status: 400 }
      );
    }

    let surveyId = `survey-${Date.now()}`;
    let savedToDb = false;

    try {
      const response = await prisma.surveyResponse.create({
        data: {
          childAgeRange,
          screenTimeConcern: Number(screenTimeConcern),
          wouldTry,
          priceExpectation,
          openFeedback: openFeedback ?? null,
          utmSource: utmSource ?? null,
          device: device ?? null,
          leadId: leadId ?? null,
        },
      });
      surveyId = response.id;
      savedToDb = true;
    } catch (dbError) {
      console.warn(
        "[Backend Fallback] Database / Supabase operation failed or not configured yet. Payload logged:",
        {
          childAgeRange,
          screenTimeConcern,
          wouldTry,
          priceExpectation,
          openFeedback,
          utmSource,
          device,
          leadId,
        },
        dbError
      );
    }

    return NextResponse.json({ success: true, id: surveyId, offline: !savedToDb }, { status: 201 });
  } catch (error) {
    console.error("Survey submission request error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
