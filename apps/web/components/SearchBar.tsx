"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Bot, Grid2x2Check, Building2, Globe, Boxes, Search } from "lucide-react";

interface FilterData {
  Model?: { name: string; organization: string }[];
  Task?: string[];
  Organization?: string[];
  Country?: string[];
  Domain?: string[];
}

export default function SearchBar() {
  const [filters, setFilters] = useState<FilterData>({});
  const [query, setQuery] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false); // For mobile view
  const [isMobile, setIsMobile] = useState<boolean>(false); // Detect screen size
  const router = useRouter();

  // Debounce query updates to optimize performance
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300); // 300ms debounce
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    // Detect screen width
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Fetch filter data from API
    const fetchFilters = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/filters");
        if (!response.ok) throw new Error("Failed to fetch filters");
        const data = await response.json();
        setFilters(data);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);

  const handleSelect = (type: string, value: string) => {
    if (type === "Model") {
      const selectedModel = filters.Model?.find((model) => model.name === value);
      if (selectedModel) {
        const organization = selectedModel.organization.replace(/ /g, "_");
        const modelName = selectedModel.name.replace(/ /g, "_");
        router.push(`/${organization}/${modelName}`);
      }
    } else {
      const queryString = new URLSearchParams({ [type]: value }).toString();
      router.push(`/models?${queryString}`);
    }
  };

  const filteredItems = useCallback(
    (type: string) => {
      return filters[type as keyof FilterData]?.filter((item) => {
        const value =
          type === "Model"
            ? (item as { name: string }).name
            : (item as string);
        return value?.toLowerCase().includes(debouncedQuery.toLowerCase());
      });
    },
    [filters, debouncedQuery]
  );

  return (
    <div className="relative">
      {/* Collapsed/Expanded Search Bar */}
      <div
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg shadow-md transition-all ${
          isExpanded ? "w-full" : isMobile ? "w-12" : "w-full"
        }`}
        onClick={() => isMobile && setIsExpanded(true)} // Expand on click for mobile
        onBlur={() => isMobile && setIsExpanded(false)} // Collapse when focus is lost
      >
        <Search className="w-5 h-5 text-gray-500" />
        {(!isMobile || isExpanded) && ( // Show input on large screens or when expanded
          <CommandInput
            placeholder="Search"
            value={query}
            onValueChange={setQuery}
            className="flex-1 outline-none"
          />
        )}
      </div>

      {/* Dropdown results */}
      {isExpanded && (
        <Command className="absolute top-full left-0 w-full mt-2 rounded-lg border shadow-md md:min-w-[450px]">
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {["Model", "Task", "Domain", "Organization", "Country"].map((type) => {
              const items = filteredItems(type);

              return (
                <CommandGroup key={type} heading={type}>
                  {items?.slice(0, 3).map((item, index) => {
                    const value =
                      type === "Model"
                        ? (item as { name: string }).name
                        : (item as string);

                    return (
                      <CommandItem
                        key={index}
                        onSelect={() => handleSelect(type, value || "")}
                      >
                        {type === "Model" && <Bot className="mr-2 w-4 h-4" />}
                        {type === "Task" && (
                          <Grid2x2Check className="mr-2 w-4 h-4" />
                        )}
                        {type === "Organization" && (
                          <Building2 className="mr-2 w-4 h-4" />
                        )}
                        {type === "Country" && (
                          <Globe className="mr-2 w-4 h-4" />
                        )}
                        {type === "Domain" && <Boxes className="mr-2 w-4 h-4" />}
                        {value}
                      </CommandItem>
                    );
                  })}
                  {items && items.length > 3 && (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      +{items.length - 3} more
                    </div>
                  )}
                  <CommandSeparator />
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      )}
    </div>
  );
}
