import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as {
      customerName?: string;
      phone?: string;
      address?: string;
      city?: string;
      note?: string;
      items?: Array<{
        productId: string;
        productName: string;
        price: number;
        quantity: number;
      }>;
      utmSource?: string | null;
      device?: string;
    };

    const { customerName, phone, address, city, note, items, utmSource, device } = body;

    // Validate inputs
    if (!customerName || typeof customerName !== "string" || customerName.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Customer name is required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone ? phone.trim().replace(/\D/g, "") : "";
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, message: "Valid 11-digit mobile phone number is required" },
        { status: 400 }
      );
    }

    if (!address || typeof address !== "string" || address.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Shipping address is required" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart must contain at least one item" },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderNumber = `SF-${Math.floor(1000 + Math.random() * 9000)}`;

    let orderId = `ord-${Date.now()}`;
    let savedToDb = false;

    try {
      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerName: customerName.trim(),
          phone: cleanPhone,
          address: address.trim(),
          city: city?.trim() || "Dhaka",
          note: note?.trim() || null,
          totalAmount,
          status: "PENDING",
          paymentMethod: "COD",
          paymentStatus: "UNPAID",
          utmSource: utmSource ?? null,
          device: device ?? "mobile",
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
      });
      orderId = order.id;
      savedToDb = true;
    } catch (dbError) {
      console.warn(
        "[Backend Fallback] Database / Supabase operation failed or not configured yet. Payload logged:",
        { orderNumber, customerName, phone: cleanPhone, totalAmount, items },
        dbError
      );
    }

    return NextResponse.json(
      {
        success: true,
        orderId,
        orderNumber,
        totalAmount,
        offline: !savedToDb,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation request error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
