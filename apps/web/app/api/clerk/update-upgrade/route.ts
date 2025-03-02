// app/api/clerk/update-upgrade/route.ts
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, upgrade } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Update the user's public metadata to set isUpgraded to true (or the value passed)
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { isUpgraded: upgrade },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating upgrade status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
