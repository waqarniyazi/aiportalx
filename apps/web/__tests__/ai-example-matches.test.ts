import { describe, it, expect, vi } from "vitest";
import type { gmail_v1 } from "@googleapis/gmail";
import { aiFindExampleMatches } from "@/utils/ai/example-matches/find-example-matches";
import { queryBatchMessages } from "@/utils/gmail/message";
import type { ParsedMessage } from "@/utils/types";
import { findExampleMatchesSchema } from "@/utils/ai/example-matches/find-example-matches";

vi.mock("server-only", () => ({}));
vi.mock("@/utils/gmail/message", () => ({
  queryBatchMessages: vi.fn(),
}));

describe("aiFindExampleMatches", () => {
  it("should find example matches based on user prompt", async () => {
    const user = {
      email: "user@test.com",
      aiProvider: null,
      aiModel: null,
      aiApiKey: null,
    };

    const gmail = {} as gmail_v1.Gmail;
    const accessToken = "fake-access-token";
    const rulesPrompt = `
* Label newsletters as "Newsletter" and archive them.
* Label emails that require a reply as "Reply Required".
* If a customer asks to set up a call, send them my calendar link: https://cal.com/example
`.trim();

    const mockMessages = [
      {
        id: "msg1",
        threadId: "thread1",
        headers: {
          from: "newsletter@company.com",
          subject: "Weekly Industry Digest",
        },
        snippet: "Top stories in our industry this week...",
      },
      {
        id: "msg2",
        threadId: "thread2",
        headers: {
          from: "client@example.com",
          subject: "Urgent: Need your input",
        },
        snippet: "Could you please review this proposal and get back to me...",
      },
      {
        id: "msg3",
        threadId: "thread3",
        headers: {
          from: "customer@potential.com",
          subject: "Interested in setting up a call",
        },
        snippet: "I'd like to discuss your services. Can we schedule a call?",
      },
    ];

    vi.mocked(queryBatchMessages).mockResolvedValue({
      messages: mockMessages as ParsedMessage[],
      nextPageToken: null,
    });

    const result = await aiFindExampleMatches(
      user,
      gmail,
      accessToken,
      rulesPrompt,
    );

    expect(result).toEqual(
      expect.objectContaining({
        matches: expect.arrayContaining([
          expect.objectContaining({
            emailId: expect.any(String),
            rule: expect.stringContaining("Newsletter"),
          }),
          expect.objectContaining({
            emailId: expect.any(String),
            rule: expect.stringContaining("Reply Required"),
          }),
          expect.objectContaining({
            emailId: expect.any(String),
            rule: expect.stringContaining("calendar link"),
          }),
        ]),
      }),
    );

    expect(result.matches).toHaveLength(3);
    expect(findExampleMatchesSchema.safeParse(result).success).toBe(true);
    expect(queryBatchMessages).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        maxResults: expect.any(Number),
      }),
    );
  }, 15000); // Increased timeout for AI call
});
