// app/api/razorpay/create-order/route.ts
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received body:", body); // Log to check the incoming JSON

    const { amount, currency, receipt } = body;

    // Validate required fields
    if (!amount || !currency || !receipt) {
      console.error("Missing required fields", { amount, currency, receipt });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const options = {
      amount: amount * 100, // Convert to subunits (e.g., paise for INR)
      currency,
      receipt,
    };

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
