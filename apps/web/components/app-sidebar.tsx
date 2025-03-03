import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge"; // Shadcn Badge component
import { Autocomplete, Option } from "@/components/ui/autocomplete"; // Autocomplete
import {
  Grid2x2Check,
  Building2,
  Globe,
  Boxes,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

export function AppSidebar({
  filters,
  setFilters,
  onFilterChange,
}: {
  filters: Record<string, string[]>;
  setFilters: (
    newFilters:
      | Record<string, string[]>
      | ((prev: Record<string, string[]>) => Record<string, string[]>),
  ) => void;
  onFilterChange: ({ type, value }: { type: string; value: string }) => void;
}) {
  // Local state to hold combined filter data (fetched + predefined)
  const [filterData, setFilterData] = useState<Record<string, string[]>>({
    Task: [],
    Domain: [],
    Organization: [],
    Country: [],
  });

  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    Task: true,
    Domain: false,
    Organization: false,
    Country: false,
  });

  // Dynamically handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => {
      const updatedFilters = {
        ...prev,
        [key]: prev[key]?.includes(value)
          ? prev[key].filter((v) => v !== value) // Remove filter if already selected
          : [...(prev[key] || []), value], // Add filter if not selected
      };

      // Determine base filter
      let baseKey = null;
      let baseValue = null;

      // Find the first filter with a selected value to determine the base URL
      for (const [filterKey, filterValues] of Object.entries(updatedFilters)) {
        if (Array.isArray(filterValues) && filterValues.length > 0) {
          baseKey = filterKey;
          baseValue = filterValues[0]
            .toLowerCase()
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .replace(/\//g, "-"); // Replace slashes with hyphens
          break;
        }
      }

      // Construct the base path for the first selected filter
      const basePath =
        baseKey && baseValue
          ? `/models/${baseKey.toLowerCase()}/${baseValue}`
          : `/models`;

      // Create query string for additional filters, excluding the base filter
      const queryString = new URLSearchParams(
        Object.entries(updatedFilters).reduce(
          (acc, [filterKey, filterValues]) =>
            filterKey !== baseKey &&
            Array.isArray(filterValues) &&
            filterValues.length > 0
              ? {
                  ...acc,
                  [filterKey.toLowerCase()]: filterValues
                    .map((v) => v.replace(/\s+/g, "-").replace(/\//g, "-"))
                    .join(","),
                }
              : acc,
          {},
        ),
      ).toString();

      // Construct the final URL
      const finalUrl = queryString ? `${basePath}?${queryString}` : basePath;

      // Update the browser's URL without reloading the page
      window.history.pushState({}, "", finalUrl);

      return updatedFilters;
    });

    onFilterChange({ type: key, value });
  };

  // Update search terms in local state
  const handleSearchChange = (key: string, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [key]: value }));
  };

  // Toggle section visibility
  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Predefined local filters
  const predefinedFilters = {
    Task: [
      "Language modelling/generation",
      "Image Generation",
      "Chat",
      "Question Answering",
    ],
    Domain: ["Multimodal", "Language", "Chat", "Games"],
    Organization: ["OpenAI", "Meta AI", "Microsoft", "Google"],
    Country: ["Multinational", "USA", "China", "France"],
  };

  // Fetch distinct filter options from /api/filters and merge them with predefined
  useEffect(() => {
    async function fetchFilters() {
      try {
        // Use the full URL
        const response = await fetch("http://localhost:5000/api/filters");
        const data = await response.json();

        const mergedTask = Array.from(
          new Set([...predefinedFilters.Task, ...data.tasks]),
        );
        const mergedDomain = Array.from(
          new Set([...predefinedFilters.Domain, ...data.domains]),
        );
        const mergedOrg = Array.from(
          new Set([...predefinedFilters.Organization, ...data.organizations]),
        );
        const mergedCountry = Array.from(
          new Set([...predefinedFilters.Country, ...data.countries]),
        );

        setFilterData({
          Task: mergedTask,
          Domain: mergedDomain,
          Organization: mergedOrg,
          Country: mergedCountry,
        });
      } catch (error) {
        console.error("Error fetching filters:", error);
        setFilterData(predefinedFilters);
      }
    }
    fetchFilters();
  }, []);

  const toggleFilter = (category: string, value: string) => {
    handleFilterChange(category, value);
  };

  const renderFilterSection = (
    label: string,
    category: string,
    options: string[],
    Icon: any,
  ) => {
    // Get the current search term for the category
    const searchTerm = searchTerms[category] || "";
    // Filter options by search term and remove any empty strings
    const filteredOptions = options.filter(
      (option) =>
        option.trim() !== "" &&
        option.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
      <SidebarGroup key={category}>
        <div
          className="flex cursor-pointer items-center justify-between p-2"
          onClick={() => toggleSection(category)}
        >
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <SidebarGroupLabel className="text-semiblod text-sm">
              {label}
            </SidebarGroupLabel>
          </div>
          {expandedSections[category] ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
        <SidebarGroupContent
          className={`transition-all duration-200 ${
            expandedSections[category]
              ? "max-h-[500px] animate-accordion-down opacity-100"
              : "max-h-0 animate-accordion-up overflow-hidden opacity-0"
          }`}
        >
          <Autocomplete
            label={`Search ${label.toLowerCase()}`}
            value={searchTerm}
            onInputChange={(e) => handleSearchChange(category, e.target.value)}
            options={filteredOptions.map((opt) => ({ label: opt, value: opt }))}
            onOptionSelect={(selectedVal: string, selectedOpt: Option) => {
              toggleFilter(category, selectedOpt.value);
              // Clear the search term so the input resets
              handleSearchChange(category, "");
            }}
            className="mb-3"
          />

          {/* Predefined filter badges */}
          <div className="mt-2 flex flex-wrap gap-2">
            {predefinedFilters[category]?.map((option) => {
              const isSelected = filters[category]?.includes(option);
              return (
                <Badge
                  key={option}
                  variant="outline"
                  className={`relative flex cursor-pointer items-center gap-1 overflow-hidden px-3 py-2 font-medium before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-l before:from-transparent before:to-[#3D61FF] before:opacity-5 hover:border-blue-500 dark:hover:border-blue-400 ${
                    isSelected ? "border-blue-500" : ""
                  }`}
                  onClick={() => toggleFilter(category, option)}
                >
                  {option}
                </Badge>
              );
            })}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar className="top-[--header-height] z-10" variant="inset">
      <SidebarContent>
        <header className="flex justify-center"></header>
        <h3 className="mb-4 ml-2 mt-2 text-lg font-bold">Filters</h3>

        {/* Display selected filters as badges */}
        {Object.values(filters).some((selected) => selected.length > 0) && (
          <div className="mb-6">
            <h4 className="mb-2 ml-2 text-xs font-medium">Selected Filters</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).flatMap(([category, selected]) =>
                selected.map((item) => (
                  <Badge
                    key={item}
                    className="flex cursor-pointer items-center gap-1 bg-blue-100 px-3 py-2 text-blue-600 hover:bg-gray-100"
                    onClick={() => toggleFilter(category, item)}
                  >
                    {item} <X className="h-3 w-3" />
                  </Badge>
                )),
              )}
            </div>
          </div>
        )}

        {renderFilterSection("Task", "Task", filterData.Task, Grid2x2Check)}
        {renderFilterSection("Domain", "Domain", filterData.Domain, Boxes)}
        {renderFilterSection(
          "Organization",
          "Organization",
          filterData.Organization,
          Building2,
        )}
        {renderFilterSection("Country", "Country", filterData.Country, Globe)}
      </SidebarContent>
    </Sidebar>
  );
}
