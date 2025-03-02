import React from "react";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import ModelPageContent from "./modelpageheader";
import ModelInfo from "./modelinfo";
import Infosidebar from "./infosidebar";

async function fetchModelData(organization: string, model: string) {
  const decodedOrganization = decodeURIComponent(organization);
  const decodedModel = decodeURIComponent(model);
  const apiUrl = `http://localhost:5000/api/models/${encodeURIComponent(
    decodedOrganization,
  )}/${encodeURIComponent(decodedModel)}`;
  console.log("Fetching data from URL:", apiUrl);
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  return response.json();
}

async function fetchReadmeContent(organization: string, model: string) {
  const readmeUrl = `https://raw.githubusercontent.com/${organization}/${model}/main/README.md`;
  try {
    const readmeResponse = await fetch(readmeUrl);
    if (!readmeResponse.ok) {
      return "README not found or an error occurred.";
    }
    let text = await readmeResponse.text();
    text = text.replace(/<!--[\s\S]*?-->/g, "");
    return text;
  } catch (err) {
    console.error("Error fetching README:", err);
    return "Error fetching README content.";
  }
}

interface PageParams {
  organization: string;
  model: string;
}

// Workaround: we type the props inline and assert that params is of type PageParams.
export default async function ModelPage({
  params,
}: {
  params: { organization: string; model: string };
}): Promise<JSX.Element> {
  const { organization, model } = params;

  try {
    const modelData = await fetchModelData(organization, model);
    const readmeContent = await fetchReadmeContent(organization, model);

    return (
      <BlogLayout>
        <ModelPageContent modelData={modelData} />
        <div className="flex flex-col divide-y divide-gray-200 md:flex-row-reverse md:divide-x-0 md:divide-y-0">
          <div className="w-full md:w-2/5">
            <Infosidebar modelData={modelData} />
          </div>
          <div className="w-full md:w-3/5">
            <ModelInfo modelData={modelData} readmeContent={readmeContent} />
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
