import { FC, ReactNode } from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ModelHoverProps {
  modelData: {
    Model?: string;
    Organization?: string[];
    Reference?: string;
    ["Model accessibility"]?: string;
    ["Publication date"]?: string;
  };
  children: ReactNode;
}

export const ModelHover: FC<ModelHoverProps> = ({ modelData, children }) => {
  const reference = modelData.Reference || "";
  const truncatedRef =
    reference.split(" ").length > 50
      ? reference.split(" ").slice(0, 50).join(" ") + "..."
      : reference;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex space-x-4">
          <Avatar>
            <AvatarImage
              src={`/OrganizationIcons/${modelData.Organization?.[0]
                ?.toLowerCase()
                .replace(/\s+/g, "_")}.png`}
              alt={modelData.Organization?.[0]}
            />
            <AvatarFallback>{modelData.Model?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center">
              <h4 className="text-sm font-semibold">
                {modelData.Model || "Unknown Model"}
              </h4>
              <img src="/verify.png" alt="Verified" className="ml-2 h-4 w-4" />
            </div>
            {reference && <p className="text-sm">{truncatedRef}</p>}
            {modelData["Model accessibility"] && (
              <Badge variant="outline">
                {modelData["Model accessibility"]}
              </Badge>
            )}
            {modelData["Publication date"] && (
              <p className="text-xs text-muted-foreground">
                CREATED ON {modelData["Publication date"]}
              </p>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
