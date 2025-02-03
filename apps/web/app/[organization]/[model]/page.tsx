import React from "react";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import ModelPageContent from "./modelpageheader";
import ModelInfo from "./modelinfo";
import Infosidebar from "./infosidebar";
import { deslugify } from "utils/slugify";

interface ModelPageProps {
  params: { organization: string; model: string };
}

async function fetchModelData(organization: string, model: string) {
  const decodedOrganization = deslugify(organization);
  const decodedModel = deslugify(model);

  const apiUrl = `http://localhost:5000/api/models/${encodeURIComponent(decodedOrganization)}/${encodeURIComponent(decodedModel)}`;
  console.log("Fetching data from URL:", apiUrl); // Log the URL

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  return response.json();
}

export default async function ModelPage({ params }: ModelPageProps) {
  // Ensure params are awaited
  const { organization, model } = await Promise.resolve(params);

  try {
    const modelData = await fetchModelData(organization, model);

    return (
      <BlogLayout>
        <ModelPageContent modelData={modelData} />
        <div className="flex flex-col divide-y divide-gray-200 md:flex-row-reverse md:divide-x-0 md:divide-y-0">
          {/* Infosidebar */}
          <div className="w-full md:w-2/5">
            <Infosidebar modelData={modelData} />
          </div>
          {/* ModelInfo */}
          <div className="w-full md:w-3/5">
            <ModelInfo modelData={modelData} />
          </div>
        </div>
      </BlogLayout>
    );
  } catch (error) {
    console.error("❌ Error fetching model:", error);
    return (
      <BlogLayout>
        <p className="text-red-500">❌ Error fetching model data</p>
      </BlogLayout>
    );
  }
}
