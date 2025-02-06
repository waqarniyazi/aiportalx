import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // Ensure this path is correct

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    // ✅ Return error if `q` is missing
    if (!q) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("llmodels"); // Ensure correct DB name

    // ✅ Use regex for case-insensitive search
    const models = await db
      .collection("models")
      .find({
        name: { $regex: q, $options: "i" },
      })
      .toArray();

    return NextResponse.json({ models: models ?? [] }); // Always return an array
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
