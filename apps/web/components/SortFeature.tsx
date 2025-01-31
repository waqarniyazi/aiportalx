"use client";

import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, CaseUpper, Calendar, Brain } from "lucide-react";

type SortField = "Model" | "Publication date" | "Training compute (FLOP)";
type SortOrder = "asc" | "desc";

interface SortOption {
  field: SortField;
  order: SortOrder;
}

export default function SortFeature({
  onSortChange,
}: {
  onSortChange: (option: SortOption) => void;
}) {
  const [sortOption, setSortOption] = useState<SortOption>({
    field: "Training compute (FLOP)",
    order: "desc",
  });
  const [isDefault, setIsDefault] = useState(true);

  const handleSelect = (field: SortField) => {
    setIsDefault(false);

    // If the user selects "Model," set to ascending (A-Z).
    // Otherwise, keep descending.
    const newOrder: SortOrder = field === "Model" ? "asc" : "desc";

    setSortOption({ field, order: newOrder });
    onSortChange({ field, order: newOrder });
  };

  const getLabel = (field: SortField) => {
    switch (field) {
      case "Model":
        return "Name";
      case "Publication date":
        return "Date";
      case "Training compute (FLOP)":
      default:
        return "FLOP";
    }
  };

  // Show “Sort” if still default, else show user’s chosen field label
  const buttonLabel = isDefault ? "Sort" : getLabel(sortOption.field);

  // Only show blue if user has picked something other than default
  const buttonClass = `flex items-center ${
    !isDefault ? "border-blue-500 text-blue-600" : ""
  }`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={buttonClass}>
          {buttonLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-2">
        <div
          onClick={() => handleSelect("Model")}
          className="flex cursor-pointer items-center gap-2 p-2 text-tremor-label hover:bg-muted"
        >
          <CaseUpper className="h-4 w-4" />
          Name
        </div>
        <div
          onClick={() => handleSelect("Publication date")}
          className="flex cursor-pointer items-center gap-2 p-2 text-tremor-label hover:bg-muted"
        >
          <Calendar className="h-4 w-4" />
          Publication Date
        </div>
        <div
          onClick={() => handleSelect("Training compute (FLOP)")}
          className="flex cursor-pointer items-center gap-2 p-2 text-tremor-label hover:bg-muted"
        >
          <Brain className="h-4 w-4" />
          Compute FLOP
        </div>
      </PopoverContent>
    </Popover>
  );
}
