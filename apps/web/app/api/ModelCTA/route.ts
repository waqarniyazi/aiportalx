console.log("route.ts is being executed");

import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Connect to MongoDB using Mongoose
const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set");
}

if (!mongoose.connection.readyState) {
  mongoose
    .connect(uri, { dbName: "ModelCTA" })
    .then(() => console.log("🚀 Connected to MongoDB via Mongoose"))
    .catch((error) => console.error("❌ MongoDB connection error:", error));
}

// Define a schema and model for form submissions
const formSubmissionSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    myNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    company: { type: String, required: true },
    industry: { type: String, required: true },
    jobRole: { type: String, required: true },
    workEmail: { type: String, required: true },
    newsletter: { type: Boolean, required: true },
  },
  { timestamps: true },
);

const FormSubmission =
  mongoose.models.FormSubmission ||
  mongoose.model("FormSubmission", formSubmissionSchema);

export async function POST(request: Request) {
  try {
    // Parse the JSON body
    const formData = await request.json();
    console.log("Parsed form data:", formData);

    // Validate payload (basic check)
    const requiredFields = [
      "fullName",
      "email",
      "myNumber",
      "dateOfBirth",
      "company",
      "industry",
      "jobRole",
      "workEmail",
      "newsletter",
    ];

    const missingFields = requiredFields.filter(
      (field) => !(field in formData),
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: `Invalid payload. Missing fields: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Save the form data to the database
    const newSubmission = new FormSubmission(formData);
    await newSubmission.save();

    return NextResponse.json(
      { message: "Data saved successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json(
      { message: "Failed to save data!", error: error.message },
      { status: 500 },
    );
  }
}
