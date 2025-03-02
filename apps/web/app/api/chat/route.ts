// app/api/chat/route.ts
import { NextResponse } from "next/server";
import Together from "together-ai";

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    // Create an instance of Together using your API key
    const together = new Together(process.env.TOGETHER_API_KEY || "");

    // Call the together.ai chat completions API using streaming.
    // (Adjust parameters as desired; note that "stream: true" returns an async iterable.)
    let fullResponse = "";
    const response = await together.chat.completions.create({
      messages,
      model, // Use the selected model
      max_tokens: 500,
      temperature: 0.6,
      top_p: 0.95,
      top_k: 50,
      repetition_penalty: 1,
      stop: ["<｜end▁of▁sentence｜>"],
      stream: true,
    });

    // Accumulate tokens from the stream into a complete response
    for await (const token of response) {
      fullResponse += token.choices[0]?.delta?.content || "";
    }

    return NextResponse.json({ response: fullResponse });
  } catch (error) {
    console.error("Together.ai error:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 },
    );
  }
}
