import { NextAuthConfig, DefaultSession } from "next-auth";
import { JWT } from "@auth/core/jwt";

export const getAuthOptions = (options?: { consent: boolean }): NextAuthConfig => ({
  callbacks: {
    // Handle JWT creation and token refresh
    async jwt({ token, user, account }): Promise<JWT> {
      if (account && user) {
        token.access_token = account.access_token;
        token.expires_at = account.expires_at;
        token.user = user;
      }

      // Handle token refresh logic
      if (token.expires_at && Date.now() >= token.expires_at * 1000) {
        console.log("Access token expired, attempting refresh...");
        return await refreshAccessToken(token);
      }

      return token;
    },

    // Update session with token details
    async session({ session, token }) {
      session.accessToken = token?.access_token;
      session.error = token?.error;
      if (session.error) console.error("Session error", session.error);
      return session;
    },
  },

  events: {
    // Handle user sign-in event
    signIn: async ({ isNewUser, user }) => {
      if (isNewUser && user.email) {
        console.log("New user signed in, email:", user.email);
        // You can handle other logic for new user here if needed
      }
    },
  },

  pages: {
    signIn: "/login",
    error: "/login/error",
  },
});

export const authOptions = getAuthOptions();

// Helper function to refresh the access token
const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  // Simulate refreshing token logic (no database or third-party service involved)
  try {
    console.log("Refreshing access token...");
    // Perform token refresh logic if necessary
    return { ...token, access_token: "newAccessToken", expires_at: Date.now() + 3600 * 1000, error: undefined };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
};

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & { id: string };
    accessToken?: string;
    error?: string | "RefreshAccessTokenError";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    access_token?: string;
    expires_at?: number;
    refresh_token?: string;
    error?: "RefreshAccessTokenError" | "MissingAccountError";
  }
}
