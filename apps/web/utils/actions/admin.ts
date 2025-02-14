"use server";

import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { processHistoryForUser } from "@/app/api/google/webhook/process-history";
import { isAdmin } from "@/utils/admin";
import { withActionInstrumentation } from "@/utils/actions/middleware";

export const adminProcessHistoryAction = withActionInstrumentation(
  "adminProcessHistory",
  async ({
    emailAddress,
    historyId,
    startHistoryId,
  }: {
    emailAddress: string;
    historyId?: number;
    startHistoryId?: number;
  }) => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) return { error: "Not logged in" };
    if (!isAdmin(session.user.email)) return { error: "Not admin" };

    console.log(`Processing history for ${emailAddress}`);

    await processHistoryForUser(
      {
        emailAddress,
        historyId: historyId ? historyId : 0,
      },
      {
        startHistoryId: startHistoryId ? startHistoryId.toString() : undefined,
      },
    );
  },
);
