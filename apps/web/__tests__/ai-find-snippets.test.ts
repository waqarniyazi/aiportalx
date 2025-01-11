import { describe, expect, test, vi } from "vitest";
import { aiFindSnippets } from "@/utils/ai/snippets/find-snippets";
import type { EmailForLLM } from "@/utils/ai/choose-rule/stringify-email";

// pnpm test ai-find-snippets

vi.mock("server-only", () => ({}));

describe("aiFindSnippets", () => {
  test("should find snippets in similar emails", async () => {
    const emails = [
      getEmail({
        content:
          "You can schedule a meeting with me here: https://cal.com/john-smith",
      }),
      getEmail({
        content:
          "Let's find a time to discuss. You can book a slot at https://cal.com/john-smith",
      }),
      getEmail({
        content:
          "Thanks for reaching out. Feel free to schedule a meeting at https://cal.com/john-smith",
      }),
    ];

    const result = await aiFindSnippets({
      sentEmails: emails,
      user: getUser(),
    });

    expect(result.snippets).toHaveLength(1);
    expect(result.snippets[0]).toMatchObject({
      text: expect.stringContaining("cal.com/john-smith"),
      count: 3,
    });

    console.log("Returned snippet:");
    console.log(result.snippets[0]);
  });

  test("should return empty array for unique emails", async () => {
    const emails = [
      getEmail({
        content:
          "Hi Sarah, Thanks for the update on Project Alpha. I've reviewed the latest metrics and everything looks on track. Could you share the Q2 projections when you have a moment? Best, Alex",
      }),
      getEmail({
        content:
          "Just wanted to follow up on the marketing campaign results. The conversion rates are looking promising, but we should discuss optimizing the landing page. Let me know when you're free to chat. Thanks, Alex",
      }),
      getEmail({
        content:
          "Thanks for looping me in on the client feedback. I'll review the suggestions and share my thoughts during tomorrow's standup. Looking forward to moving this forward. Best regards, Alex",
      }),
    ];

    const result = await aiFindSnippets({
      sentEmails: emails,
      user: getUser(),
    });

    expect(result.snippets).toHaveLength(0);
  });
});

// helpers
function getEmail({
  from = "user@test.com",
  subject = "Test Subject",
  content = "Test content",
  replyTo,
  cc,
}: Partial<EmailForLLM> = {}): EmailForLLM {
  return {
    from,
    subject,
    content,
    ...(replyTo && { replyTo }),
    ...(cc && { cc }),
  };
}

function getUser() {
  return {
    aiModel: null,
    aiProvider: null,
    email: "user@test.com",
    aiApiKey: null,
    about: null,
  };
}
