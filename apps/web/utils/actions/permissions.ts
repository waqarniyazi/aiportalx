"use server";

import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { withActionInstrumentation } from "@/utils/actions/middleware";
import { isAdmin } from "@/utils/admin";
import { getGmailAccessToken } from "@/utils/gmail/client";
import { checkGmailPermissions } from "@/utils/gmail/permissions";
import prisma from "@/utils/prisma";

export const checkPermissionsAction = withActionInstrumentation(
  "checkPermissions",
  async () => {
    const session = await auth();
    if (!session?.user.id) return { error: "Not logged in" };

    try {
      const token = await getGmailAccessToken(session);
      if (!token.token) return { error: "No Gmail access token" };

      const { hasAllPermissions, error } = await checkGmailPermissions(
        token.token,
      );
      if (error) return { error };
      return { hasAllPermissions };
    } catch (error) {
      return { error: "Failed to check permissions" };
    }
  },
);

export const adminCheckPermissionsAction = withActionInstrumentation(
  "adminCheckPermissions",
  async ({ email }: { email: string }) => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) return { error: "Not logged in" };
    if (!isAdmin(session.user.email)) return { error: "Not admin" };

    try {
      const account = await prisma.account.findFirst({
        where: { user: { email }, provider: "google" },
        select: { access_token: true, refresh_token: true },
      });
      if (!account) return { error: "No account found" };

      const token = await getGmailAccessToken({
        accessToken: account.access_token || undefined,
        refreshToken: account.refresh_token || undefined,
      });
      if (!token.token) return { error: "No Gmail access token" };

      const { hasAllPermissions, error } = await checkGmailPermissions(
        token.token,
      );
      if (error) return { error };
      return { hasAllPermissions };
    } catch (error) {
      return { error: "Failed to check permissions" };
    }
  },
);
