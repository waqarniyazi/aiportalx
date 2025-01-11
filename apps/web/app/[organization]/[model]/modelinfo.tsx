import React from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip } from "@/components/Tooltip";

interface ModelPageContentProps {
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
}

export default function ModelInfo({ modelData }: ModelPageContentProps) {
  return (
    <div className="flex flex-col gap-6 text-tremor-default bg-[hsl(var(--subtle))] ml-4 mr-6">
      <div className="flex-1">
        <h2 className="text-tremor-large font-inter text-gray-700 font-semibold mb-2 mt-2">Introduction</h2>
        {modelData.Abstract && (
          <>
            <p className="text-tremor-small text-gray-500 mt-2 mb-4">{modelData.Abstract}</p>
            <Separator className="my-4" />
          </>
        )}

        {(modelData["Training compute (FLOP)"] || modelData["Training compute notes"]) && (
          <>
           <h2 className="text-tremor-large font-inter text-gray-700 flex items-center font-semibold mb-2">
              <img src="/cube.png" alt="Training" className="h-6 w-6 mr-2" />
              Benchmarking
            </h2>
            {modelData["Training compute (FLOP)"] && (
  <p className="text-tremor-small text-gray-500 mt-2 mb-1">
  <span className="font-semibold">{`FLOPs: `}</span>
  {modelData["Training compute (FLOP)"]}
</p>

)}

{modelData["Training compute notes"] && (
  <p className="text-tremor-small text-gray-500 mb-4">
    <strong>Notes:</strong> {modelData["Training compute notes"]}
  </p>
)}

            <Separator className="my-4" />
          </>
        )}

        {[
          "Accessibility notes",
          "Training dataset",
          "Training dataset notes",
          "Training dataset size (datapoints)",
          "Dataset size notes",
          "Training hardware",
          "Hardware quantity",
        ].some((key) => modelData[key]) && (
          <>
            <h2 className="text-tremor-large font-inter text-gray-700 flex items-center font-semibold mb-2">
              <img src="/cube.png" alt="Training" className="h-6 w-6 mr-2" />
              Training
            </h2>
            {modelData["Accessibility notes"] && (
              <p className="text-tremor-small text-gray-500 mt-2 mb-2">
                <strong>Training Code Accessibility:</strong> {modelData["Accessibility notes"]}
              </p>
            )}
            {modelData["Training dataset"] && (
              <p className="text-tremor-small text-gray-500 mb-2">
                <strong>Training Dataset:</strong> {modelData["Training dataset"]}
              </p>
            )}
            {modelData["Training dataset notes"] && (
              <p className="text-tremor-small text-gray-500 mb-2">
               <strong> Notes:</strong> {modelData["Training dataset notes"]}
              </p>
            )}
            {modelData["Training dataset size (datapoints)"] && (
              <p className="text-tremor-small text-gray-500 mb-2">
                <strong>Training Dataset Size:</strong> {modelData["Training dataset size (datapoints)"]}
              </p>
            )}
            {modelData["Dataset size notes"] && (
              <p className="text-tremor-small text-gray-500 mb-2">
                <strong>Notes:</strong> {modelData["Dataset size notes"]}
              </p>
            )}
            {modelData["Training hardware"] && (
              <p className="text-tremor-small text-gray-500 mb-2">
                <strong>Training Hardware:</strong> {modelData["Training hardware"]}
              </p>
            )}
            {modelData["Hardware quantity"] && (
              <p className="text-tremor-small text-gray-500 mb-4">
               <strong> Hardware Quantity:</strong> {modelData["Hardware quantity"]}
              </p>
            )}
            <Separator className="my-4" />
          </>
        )}

        {(modelData.Parameters || modelData["Parameters notes"]) && (
          <>
           <h2 className="text-tremor-large font-inter text-gray-700 flex items-center font-semibold mb-2">
              <img src="/cube.png" alt="Training" className="h-6 w-6 mr-2" />
              Parameters
            </h2>
            {modelData.Parameters && (
              <p className="text-tremor-small text-gray-500 mb-2"><strong>Parameters:</strong> {modelData.Parameters}</p>
            )}
            {modelData["Parameters notes"] && (
              <p className="text-tremor-small text-gray-500 mb-4"><strong>Notes:</strong> {modelData["Parameters notes"]}</p>
            )}
            <Separator className="my-4" />
          </>
        )}

        {modelData.Authors.length > 0 && (
          <>
            <h2 className="text-tremor-large font-inter text-gray-700 font-semibold mb-2">Authors</h2>
            <div className="flex flex-wrap gap-3">
              {modelData.Authors.map((author, index) => (
                <Tooltip key={index} content={author}>
                  <Avatar
                    className="ring-2 ring-offset-2 ring-offset-background ring-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
                  >
                    <AvatarFallback>{author.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Tooltip>
              ))}
            </div>
            <Separator className="my-4" />
          </>
        )}
      </div>
    </div>
  );
}
