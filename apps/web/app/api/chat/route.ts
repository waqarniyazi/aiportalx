// app/api/chat/route.ts
import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const hf = new HfInference(process.env.HF_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    const chatCompletion = await hf.chatCompletion({
      model: model, // now dynamically set from the request
      messages,
      provider: "together",
      max_tokens: 500,
    });

    return NextResponse.json({
      response: chatCompletion.choices[0].message.content,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 },
    );
  }
}
