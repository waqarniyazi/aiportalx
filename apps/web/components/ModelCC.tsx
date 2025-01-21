"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModelCCProps {
  model: any;
}

export default function ModelCC({ model }: ModelCCProps) {
  return (
    <div className="w-full rounded-lg border p-4 shadow-sm">
      <div className="flex items-start space-x-2">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={`/OrganizationIcons/${model.Organization[0]?.toLowerCase().replace(/\s+/g, "_")}.png`}
            alt={model.Organization[0]}
          />
          <AvatarFallback>{model.Model?.[0] || "?"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="cursor-pointer text-lg font-bold hover:text-blue-500">
            <a
              href={`/${model.Organization[0].replace(/ /g, "-")}/${model.Model.replace(/ /g, "-")}`}
            >
              {model.Model || "Unknown Model"}
            </a>
          </span>
          <span className="mt-1 text-sm text-gray-500">
            By {model.Organization.join(", ")} |{" "}
            {model["Publication date"]
              ? new Date(model["Publication date"]).getFullYear()
              : "Unknown Year"}
          </span>
        </div>
      </div>
      <div className="mt-3">
        <span className="text-xs font-medium text-gray-500">Domain:</span>
        <div className="mt-1 flex flex-wrap gap-2">
          {Array.isArray(model.Domain) && model.Domain.length > 0 ? (
            model.Domain.map((domain: string) => (
              <Badge
                key={domain}
                variant="outline"
                className="cursor-pointer px-2 hover:border-blue-500"
              >
                {domain}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-gray-500">No domains available</span>
          )}
        </div>
      </div>
    </div>
  );
}
