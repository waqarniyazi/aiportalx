// File: app/[organization]/[model]/modelinfo.tsx

import React from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip } from "@/components/Tooltip";

import GitReadmeFetch from "./GitReadmeFetch"; // <-- Import your new component

interface ModelInfoProps {
  modelData: {
    Model: string;
    Organization: string[];
    Domain: string[];
    Task: string[];
    Authors: string[];
    "Publication date": string;
    "Country (from Organization)": string[];
    Abstract: string;
    Link: string;
    "Accessibility notes"?: string;
    "Training compute (FLOP)"?: string;
    "Training compute notes"?: string;
    "Training dataset"?: string;
    "Training dataset notes"?: string;
    "Training dataset size (datapoints)"?: string;
    "Dataset size notes"?: string;
    "Training hardware"?: string;
    "Hardware quantity"?: string;
    Parameters?: string;
    "Parameters notes"?: string;
  };
  readmeContent: string; // The GitHub README text
}

export default function ModelInfo({
  modelData,
  readmeContent,
}: ModelInfoProps) {
  // For rewriting relative images, we guess modelData.Organization[0] = GH org, modelData.Model = GH repo
  const orgName = modelData.Organization?.[0] || "org";
  const repoName = modelData.Model || "repo";

  return (
    <div className="ml-4 mr-6 flex flex-col gap-6 bg-[hsl(var(--subtle))] text-tremor-default">
      <div className="flex-1">
        {/* ====== INTRODUCTION ====== */}
        <h2 className="font-inter mb-2 mt-2 text-tremor-large font-semibold text-gray-700">
          Introduction
        </h2>
        {modelData.Abstract && (
          <>
            <p className="mb-4 mt-2 text-tremor-small text-gray-500">
              {modelData.Abstract}
            </p>
            <Separator className="my-4" />
          </>
        )}

        {/* ====== BENCHMARKING ====== */}
        {(modelData["Training compute (FLOP)"] ||
          modelData["Training compute notes"]) && (
          <>
            <h2 className="font-inter mb-2 flex items-center text-tremor-large font-semibold text-gray-700">
              <img src="/cube.png" alt="Training" className="mr-2 h-6 w-6" />
              Benchmarking
            </h2>
            {modelData["Training compute (FLOP)"] && (
              <p className="mb-1 mt-2 text-tremor-small text-gray-500">
                <span className="font-semibold">FLOPs: </span>
                {modelData["Training compute (FLOP)"]}
              </p>
            )}
            {modelData["Training compute notes"] && (
              <p className="mb-4 text-tremor-small text-gray-500">
                <strong>Notes:</strong> {modelData["Training compute notes"]}
              </p>
            )}
            <Separator className="my-4" />
          </>
        )}

        {/* ====== TRAINING ====== */}
        {[
          "Accessibility notes",
          "Training dataset",
          "Training dataset notes",
          "Training dataset size (datapoints)",
          "Dataset size notes",
          "Training hardware",
          "Hardware quantity",
        ].some((key) => (modelData as Record<string, unknown>)[key]) && (
          <>
            <h2 className="font-inter mb-2 flex items-center text-tremor-large font-semibold text-gray-700">
              <img src="/cube.png" alt="Training" className="mr-2 h-6 w-6" />
              Training
            </h2>
            {modelData["Accessibility notes"] && (
              <p className="mb-2 mt-2 text-tremor-small text-gray-500">
                <strong>Training Code Accessibility:</strong>{" "}
                {modelData["Accessibility notes"]}
              </p>
            )}
            {modelData["Training dataset"] && (
              <p className="mb-2 text-tremor-small text-gray-500">
                <strong>Training Dataset:</strong>{" "}
                {modelData["Training dataset"]}
              </p>
            )}
            {modelData["Training dataset notes"] && (
              <p className="mb-2 text-tremor-small text-gray-500">
                <strong>Notes:</strong> {modelData["Training dataset notes"]}
              </p>
            )}
            {modelData["Training dataset size (datapoints)"] && (
              <p className="mb-2 text-tremor-small text-gray-500">
                <strong>Training Dataset Size:</strong>{" "}
                {modelData["Training dataset size (datapoints)"]}
              </p>
            )}
            {modelData["Dataset size notes"] && (
              <p className="mb-2 text-tremor-small text-gray-500">
                <strong>Notes:</strong> {modelData["Dataset size notes"]}
              </p>
            )}
            {modelData["Training hardware"] && (
              <p className="mb-2 text-tremor-small text-gray-500">
                <strong>Training Hardware:</strong>{" "}
                {modelData["Training hardware"]}
              </p>
            )}
            {modelData["Hardware quantity"] && (
              <p className="mb-4 text-tremor-small text-gray-500">
                <strong>Hardware Quantity:</strong>{" "}
                {modelData["Hardware quantity"]}
              </p>
            )}
            <Separator className="my-4" />
          </>
        )}

        {/* ====== PARAMETERS ====== */}
        {(modelData.Parameters || modelData["Parameters notes"]) && (
          <>
            <h2 className="font-inter mb-2 flex items-center text-tremor-large font-semibold text-gray-700">
              <img src="/cube.png" alt="Training" className="mr-2 h-6 w-6" />
              Parameters
            </h2>
            {modelData.Parameters && (
              <p className="mb-2 text-tremor-small text-gray-500">
                <strong>Parameters:</strong> {modelData.Parameters}
              </p>
            )}
            {modelData["Parameters notes"] && (
              <p className="mb-4 text-tremor-small text-gray-500">
                <strong>Notes:</strong> {modelData["Parameters notes"]}
              </p>
            )}
            <Separator className="my-4" />
          </>
        )}

        {/* ====== AUTHORS ====== */}
        {modelData.Authors?.length > 0 && (
          <>
            <h2 className="font-inter mb-2 text-tremor-large font-semibold text-gray-700">
              Authors
            </h2>
            <div className="flex flex-wrap gap-3">
              {modelData.Authors.map((author, index) => (
                <Tooltip key={index} content={author}>
                  <Avatar className="ring-gradient-to-r from-pink-500 via-purple-500 to-blue-500 ring-2 ring-offset-2 ring-offset-background">
                    <AvatarFallback>{author.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Tooltip>
              ))}
            </div>
            <Separator className="my-4" />
          </>
        )}

        {/* ====== GITHUB README ====== */}
        <GitReadmeFetch
          readmeContent={readmeContent}
          orgName={orgName}
          repoName={repoName}
        />
      </div>
    </div>
  );
}
