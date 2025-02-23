import express, { Request, Response } from "express";
import mongoose, { Schema, model } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000" })); // Adjust the origin if needed
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit the process if the connection fails
  });

interface IModel {
  Model: string;
  Domain: string[];
  Task: string[];
  Organization: string[];
  "Country (from Organization)": string[];
  "Publication date": string;
  Authors: string[];
  "Model accessibility": string;
  Link: string;
  Citations: string;
  Reference: string;
  Parameters: string;
  "Parameters notes": string;
  "Training compute (FLOP)": string;
  "Training compute notes": string;
  "Training dataset": string;
  "Training dataset notes": string;
  "Training dataset size (datapoints)": string;
  "Dataset size notes": string;
  "Training hardware": string;
  Confidence: string;
  Abstract: string;
  "Base model": string;
  "Finetune compute (FLOP)": string;
  "Finetune compute notes": string;
  "Hardware quantity": string;
  "Training code accessibility": string;
  "Accessibility notes": string;
  "Organization categorization (from Organization)": string;
}

const modelSchema = new Schema<IModel>(
  {
    Model: { type: String, required: true },
    Domain: { type: [String], required: true },
    Task: { type: [String], required: true },
    Organization: { type: [String], required: true },
    "Country (from Organization)": { type: [String], required: true },
    "Publication date": { type: String, required: true },
    Authors: { type: [String], default: [] },
    "Model accessibility": { type: String, default: "" },
    Link: { type: String, default: "" },
    Citations: { type: String, default: "" },
    Reference: { type: String, default: "" },
    Parameters: { type: String, default: "" },
    "Parameters notes": { type: String, default: "" },
    "Training compute (FLOP)": { type: String, default: "" },
    "Training compute notes": { type: String, default: "" },
    "Training dataset": { type: String, default: "" },
    "Training dataset notes": { type: String, default: "" },
    "Training dataset size (datapoints)": { type: String, default: "" },
    "Dataset size notes": { type: String, default: "" },
    "Training hardware": { type: String, default: "" },
    Confidence: { type: String, default: "" },
    Abstract: { type: String, default: "" },
    "Base model": { type: String, default: "" },
    "Finetune compute (FLOP)": { type: String, default: "" },
    "Finetune compute notes": { type: String, default: "" },
    "Hardware quantity": { type: String, default: "" },
    "Training code accessibility": { type: String, default: "" },
    "Accessibility notes": { type: String, default: "" },
    "Organization categorization (from Organization)": {
      type: String,
      default: "",
    },
  },
  { collection: "models" },
);

const Model = model<IModel>("Model", modelSchema);

const ensureArray = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

app.get("/api/models", async (req: Request, res: Response) => {
  try {
    const { slugs, Task, Domain, Organization, Country } = req.query as Record<
      string,
      string | string[]
    >;

    const query: any = {};

    // If slugs parameter is provided, filter by Model names.
    if (slugs) {
      query.Model = { $in: ensureArray(slugs) };
    } else {
      if (Task) query.Task = { $in: ensureArray(Task) };
      if (Domain) query.Domain = { $in: ensureArray(Domain) };
      if (Organization) query.Organization = { $in: ensureArray(Organization) };
      if (Country)
        query["Country (from Organization)"] = { $in: ensureArray(Country) };
    }

    const models = await Model.find(query);
    res.status(200).json(models);
  } catch (error) {
    console.error("❌ Error fetching models:", error);
    res.status(500).send("Server Error");
  }
});

app.get(
  "/api/models/:organization/:model",
  async (req: Request, res: Response) => {
    try {
      // Decode the URL components (they’re still in slug form)
      const orgSlug = decodeURIComponent(req.params.organization);
      const modelSlug = decodeURIComponent(req.params.model);

      // Helper to escape regex special characters
      function escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }

      // Create a flexible regex: hyphens in the slug will match either a hyphen or a space
      function createFlexibleRegex(slug: string): RegExp {
        return new RegExp(
          "^" +
            slug
              .split("-")
              .map((part) => escapeRegex(part.trim()))
              .filter(Boolean)
              .join("[- ]") +
            "$",
          "i",
        );
      }

      const orgRegex = createFlexibleRegex(orgSlug);
      const modelRegex = createFlexibleRegex(modelSlug);

      // Use the flexible regex for a case-insensitive lookup
      const modelData = await Model.findOne({
        Organization: { $regex: orgRegex },
        Model: { $regex: modelRegex },
      });

      if (!modelData) {
        return res.status(404).json({ error: "Model not found" });
      }

      res.status(200).json(modelData);
    } catch (error) {
      console.error("❌ Error fetching model:", error);
      res.status(500).send("Server Error");
    }
  },
);

app.get("/api/filters", async (req: Request, res: Response) => {
  try {
    const tasks = await Model.distinct("Task");
    const domains = await Model.distinct("Domain");
    const organizations = await Model.distinct("Organization");
    const countries = await Model.distinct("Country (from Organization)");
    const models = await Model.distinct("Model");

    res.json({ tasks, domains, organizations, countries, Model: models });
  } catch (error) {
    console.error("❌ Error fetching filters:", error);
    res.status(500).send("Server Error");
  }
});

app.get("/api/search", async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Perform a search in MongoDB using a case-insensitive regex
    const results = await Model.find({
      Model: { $regex: new RegExp(query, "i") }, // Adjust to your search requirements
    }).limit(10); // Limit results for efficiency

    res.status(200).json(results);
  } catch (error) {
    console.error("❌ Error in search endpoint:", error);
    res.status(500).send("Server Error");
  }
});

app.get("/api/globalsearch", async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Example: find partial matches for each category
    const models = await Model.find({
      Model: { $regex: new RegExp(query, "i") },
    });
    const tasks = await Model.find({
      Task: { $regex: new RegExp(query, "i") },
    });
    const organizations = await Model.find({
      Organization: { $regex: new RegExp(query, "i") },
    });
    const domains = await Model.find({
      Domain: { $regex: new RegExp(query, "i") },
    });
    const countries = await Model.find({
      "Country (from Organization)": { $regex: new RegExp(query, "i") },
    });

    res.status(200).json({
      models,
      tasks,
      organizations,
      domains,
      countries,
    });
  } catch (error) {
    console.error("❌ Error in search:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
