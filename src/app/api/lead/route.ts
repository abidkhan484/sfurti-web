import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as {
      phone?: string;
      source?: string;
      utmSource?: string | null;
      utmMedium?: string | null;
      utmCampaign?: string | null;
      device?: string;
    };

    const { phone, source, utmSource, utmMedium, utmCampaign, device } = body;

    if (!phone || typeof phone !== "string" || phone.trim().length < 10) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 }
      );
    }

    let leadId = `lead-${Date.now()}`;
    let savedToDb = false;

    try {
      const lead = await prisma.lead.create({
        data: {
          phone: phone.trim(),
          source: source ?? "hero",
          utmSource: utmSource ?? null,
          utmMedium: utmMedium ?? null,
          utmCampaign: utmCampaign ?? null,
          device: device ?? "mobile",
        },
      });
      leadId = lead.id;
      savedToDb = true;
    } catch (dbError) {
      console.warn(
        "[Backend Fallback] Database / Supabase operation failed or not configured yet. Payload logged:",
        { phone: phone.trim(), source, utmSource, utmMedium, utmCampaign, device },
        dbError
      );
    }

    return NextResponse.json(
      { success: true, id: leadId, offline: !savedToDb },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead creation request error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
