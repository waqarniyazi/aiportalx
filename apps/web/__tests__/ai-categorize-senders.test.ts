import { describe, it, expect, vi } from "vitest";
import {
  aiCategorizeSenders,
  REQUEST_MORE_INFORMATION_CATEGORY,
} from "@/utils/ai/categorize-sender/ai-categorize-senders";
import { defaultCategory } from "@/utils/categories";
import { aiCategorizeSender } from "@/utils/ai/categorize-sender/ai-categorize-single-sender";

vi.mock("server-only", () => ({}));

// Test data setup
const testUser = {
  email: "user@test.com",
  aiProvider: null,
  aiModel: null,
  aiApiKey: null,
};

const testSenders = [
  {
    emailAddress: "newsletter@company.com",
    snippets: ["Latest updates and news from our company"],
    expectedCategory: "Newsletter",
  },
  {
    emailAddress: "support@service.com",
    snippets: ["Your ticket #1234 has been updated"],
    expectedCategory: "Support",
  },
  {
    emailAddress: "unknown@example.com",
    snippets: [],
    expectedCategory: "Unknown",
  },
  {
    emailAddress: "sales@business.com",
    snippets: ["Special offer: 20% off our enterprise plan"],
    expectedCategory: "Marketing",
  },
  {
    emailAddress: "noreply@socialnetwork.com",
    snippets: ["John Smith mentioned you in a comment"],
    expectedCategory: "Social",
  },
];

describe("AI Sender Categorization", () => {
  describe("Bulk Categorization", () => {
    it("should categorize senders with snippets using AI", async () => {
      const result = await aiCategorizeSenders({
        user: testUser,
        senders: testSenders,
        categories: getEnabledCategories(),
      });

      expect(result).toHaveLength(testSenders.length);

      // Test newsletter categorization with snippet
      const newsletterResult = result.find(
        (r) => r.sender === "newsletter@company.com",
      );
      expect(newsletterResult?.category).toBe("Newsletter");

      // Test support categorization with ticket snippet
      const supportResult = result.find(
        (r) => r.sender === "support@service.com",
      );
      expect(supportResult?.category).toBe("Support");

      // Test sales categorization with offer snippet
      const salesResult = result.find((r) => r.sender === "sales@business.com");
      expect(salesResult?.category).toBe("Marketing");
    }, 15_000);

    it("should handle empty senders list", async () => {
      const result = await aiCategorizeSenders({
        user: testUser,
        senders: [],
        categories: [],
      });

      expect(result).toEqual([]);
    });

    it("should categorize senders for all valid SenderCategory values", async () => {
      const senders = getEnabledCategories()
        .filter((category) => category.name !== "Unknown")
        .map((category) => `${category.name}@example.com`);

      const result = await aiCategorizeSenders({
        user: testUser,
        senders: senders.map((sender) => ({
          emailAddress: sender,
          snippets: [],
        })),
        categories: getEnabledCategories(),
      });

      expect(result).toHaveLength(senders.length);

      for (const sender of senders) {
        const category = sender.split("@")[0];
        const senderResult = result.find((r) => r.sender === sender);
        expect(senderResult).toBeDefined();
        expect(senderResult?.category).toBe(category);
      }
    }, 15_000);
  });

  describe("Single Sender Categorization", () => {
    it("should categorize individual senders with snippets", async () => {
      for (const { emailAddress, snippets, expectedCategory } of testSenders) {
        const result = await aiCategorizeSender({
          user: testUser,
          sender: emailAddress,
          previousEmails: snippets,
          categories: getEnabledCategories(),
        });

        if (expectedCategory === "Unknown") {
          expect([REQUEST_MORE_INFORMATION_CATEGORY, "Unknown"]).toContain(
            result?.category,
          );
        } else {
          expect(result?.category).toBe(expectedCategory);
        }
      }
    }, 15_000);

    it("should handle unknown sender appropriately", async () => {
      const unknownSender = testSenders.find(
        (s) => s.expectedCategory === "Unknown",
      );
      if (!unknownSender) throw new Error("No unknown sender in test data");

      const result = await aiCategorizeSender({
        user: testUser,
        sender: unknownSender.emailAddress,
        previousEmails: [],
        categories: getEnabledCategories(),
      });

      expect([REQUEST_MORE_INFORMATION_CATEGORY, "Unknown"]).toContain(
        result?.category,
      );
    }, 15_000);
  });

  describe("Comparison Tests", () => {
    it("should produce consistent results between bulk and single categorization", async () => {
      // Run bulk categorization
      const bulkResults = await aiCategorizeSenders({
        user: testUser,
        senders: testSenders,
        categories: getEnabledCategories(),
      });

      // Run individual categorizations and pair with senders
      const singleResults = await Promise.all(
        testSenders.map(async ({ emailAddress, snippets }) => {
          const result = await aiCategorizeSender({
            user: testUser,
            sender: emailAddress,
            previousEmails: snippets,
            categories: getEnabledCategories(),
          });
          return {
            sender: emailAddress,
            category: result?.category,
          };
        }),
      );

      // Compare results for each sender
      for (const { emailAddress, expectedCategory } of testSenders) {
        const bulkResult = bulkResults.find((r) => r.sender === emailAddress);
        const singleResult = singleResults.find(
          (r) => r.sender === emailAddress,
        );

        // Both should either have a category or both be undefined
        if (bulkResult?.category || singleResult?.category) {
          expect(bulkResult?.category).toBeDefined();
          expect(singleResult?.category).toBeDefined();
          expect(bulkResult?.category).toBe(singleResult?.category);

          // If not Unknown, check against expected category
          if (expectedCategory !== "Unknown") {
            expect(bulkResult?.category).toBe(expectedCategory);
            expect(singleResult?.category).toBe(expectedCategory);
          }
        }
      }
    }, 30_000);
  });
});

const getEnabledCategories = () => {
  return Object.entries(defaultCategory)
    .filter(([_, value]) => value.enabled)
    .map(([_, value]) => ({
      name: value.name,
      description: value.description,
    }));
};
