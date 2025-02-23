import fs from "fs";
import fetch from "node-fetch"; // Ensure ESM (`import`)
import { slugify } from "./slugify.js"; // Import the slugify function

const API_URL = "http://localhost:5000/api/models";

async function getAllModelURLs() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const models = await response.json();
    console.log("🔍 API Response:", models); // Debugging log

    const urls = models
      .map((model) => {
        if (!model.Organization || !model.Model) {
          console.error("❌ Missing organization or model in:", model);
          return null;
        }

        // Extract the first organization (if multiple exist)
        const firstOrg = Array.isArray(model.Organization)
          ? model.Organization[0]
          : model.Organization.split(",")[0]; // Handle both array and string formats

        const orgSlug = slugify(firstOrg.trim());
        const modelSlug = slugify(model.Model);

        return `/${orgSlug}/${modelSlug}`;
      })
      .filter(Boolean);

    if (urls.length === 0) {
      console.error("❌ No valid URLs generated. Check API response.");
      return;
    }

    fs.writeFileSync("model-urls.txt", urls.join("\n"));
    console.log("✅ URLs saved to model-urls.txt");
  } catch (error) {
    console.error("❌ Error fetching model URLs:", error);
  }
}

getAllModelURLs();
