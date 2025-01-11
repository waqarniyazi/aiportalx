import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge"; // Shadcn Badge component
import { Input } from "@/components/ui/input"; // Shadcn Input component for search
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
}: {
  filters: Record<string, string[]>;
  setFilters: (newFilters: Record<string, string[]>) => void;
}) {
  const [filterData, setFilterData] = useState<Record<string, string[]>>({
    Task: [],
    Domain: [],
    Organization: [],
    Country: [],
  });

  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({
    Task: "",
    Domain: "",
    Organization: "",
    Country: "",
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Task: true,
    Domain: false,
    Organization: false,
    Country: false,
  });

  const predefinedFilters = {
    Task: ["Language modelling/generation", "Image Generation", "Chat", "Question Answering"],
    Domain: ["Multimodal", "Language", "Chat", "Games"],
    Organization: ["OpenAI", "Meta AI", "Microsoft", "Google"],
    Country: ["Multinational", "USA", "China", "France"],
  };

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/filters");
        if (!response.ok) throw new Error("Failed to fetch filter data");
        const data = await response.json();
        setFilterData({
          Task: data.tasks || [],
          Domain: data.domains || [],
          Organization: data.organizations || [],
          Country: data.countries || [],
        });
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchFilterData();
  }, []);

  const toggleFilter = (category: string, value: string) => {
    setFilters((prevFilters) => {
      const updated = { ...prevFilters };
      const isSelected = updated[category]?.includes(value);

      if (isSelected) {
        updated[category] = updated[category].filter((item) => item !== value);
      } else {
        updated[category] = [...(updated[category] || []), value];
      }

      // Reflect filters in the URL
      const queryString = new URLSearchParams(
        Object.entries(updated).reduce(
          (acc, [key, values]) =>
            values.length > 0 ? { ...acc, [key]: values.join(",") } : acc,
          {}
        )
      ).toString();
      window.history.pushState({}, "", `?${queryString}`);

      return updated;
    });
  };

  const renderFilterSection = (label: string, category: string, options: string[], Icon: any) => {
    const predefinedOptions = predefinedFilters[category] || [];
    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(searchTerms[category]?.toLowerCase() || "")
    );

    return (
      <SidebarGroup key={category}>
        <div
          className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2"
          onClick={() =>
            setExpandedSections((prev) => ({
              ...prev,
              [category]: !prev[category],
            }))
          }
        >
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
          </div>
          {expandedSections[category] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
        <SidebarGroupContent
          className={`transition-all duration-200 ${
            expandedSections[category]
              ? "animate-accordion-down max-h-[500px] opacity-100"
              : "animate-accordion-up max-h-0 overflow-hidden opacity-0"
          }`}
        >
          <Input
            type="text"
            placeholder={`Search ${label.toLowerCase()}...`}
            value={searchTerms[category]}
            onChange={(e) =>
              setSearchTerms((prev) => ({
                ...prev,
                [category]: e.target.value,
              }))
            }
            className="mb-3"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {predefinedOptions.map((option) => {
              const isSelected = filters[category]?.includes(option);
              return (
                <Badge
                  key={option}
                  variant={isSelected ? "outline" : "outline"}
                  className={`cursor-pointer px-3 py-2 flex items-center gap-1 ${
                    isSelected ? "border-blue-500" : ""
                  }`}
                  onClick={() => toggleFilter(category, option)}
                >
                  {option}
                </Badge>
              );
            })}
          </div>
          {searchTerms[category] && (
            <div className="flex flex-wrap gap-2 mt-4">
              {filteredOptions.map((option) => {
                if (predefinedOptions.includes(option)) return null;

                const isSelected = filters[category]?.includes(option);
                return (
                  <Badge
                    key={option}
                    variant={isSelected ? "outline" : "outline"}
                    className={`cursor-pointer  px-3 py-2 flex items-center gap-1 ${
                      isSelected ? "border-blue-500" : ""
                    }`}
                    onClick={() => toggleFilter(category, option)}
                  >
                    {option}
                  </Badge>
                );
              })}
            </div>
          )}
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar>
      <SidebarContent>
        <h3 className="text-lg font-bold ml-2 mt-6 mb-4">Filters</h3>
        {Object.values(filters).some((selected) => selected.length > 0) && (
          <div className="mb-6">
            <h4 className="text-xs font-medium ml-2 mb-2">Selected Filters</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).flatMap(([category, selected]) =>
                selected.map((item) => (
                  <Badge
                    key={item}
                    className="cursor-pointer px-3 py-2 flex items-center gap-1 hover:bg-gray-100 bg-blue-100 text-blue-600"
                    onClick={() => toggleFilter(category, item)}
                  >
                    {item} <X className="w-3 h-3" />
                  </Badge>
                ))
              )}
            </div>
          </div>
        )}
        {renderFilterSection("Task", "Task", filterData.Task, Grid2x2Check)}
        {renderFilterSection("Domain", "Domain", filterData.Domain, Boxes)}
        {renderFilterSection("Organization", "Organization", filterData.Organization, Building2)}
        {renderFilterSection("Country", "Country", filterData.Country, Globe)}
      </SidebarContent>
    </Sidebar>
  );
}
