"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Grid2x2Check,
  Boxes,
  Building2,
  Globe,
  Search,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SearchResult {
  models: any[];
  tasks: any[];
  organizations: any[];
  domains: any[];
  countries: any[];
}

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<SearchResult | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter();

  // Clear search state each time the dialog opens.
  React.useEffect(() => {
    if (open) {
      setSearchQuery("");
      setSearchResults(null);
    }
  }, [open]);

  // Toggle search dialog with ⌘/Ctrl + K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Trigger search only on Enter key press
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchQuery.trim() === "") {
        setSearchResults(null);
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:5000/api/globalsearch?query=${encodeURIComponent(searchQuery)}`,
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  // Handle navigation on selecting an item from the list
  const handleSelect = (item: any, category: string) => {
    setOpen(false);
    switch (category) {
      case "models":
        router.push(`/${item.Organization[0]}/${item.Model}`);
        break;
      case "tasks":
        router.push(`models/task/${encodeURIComponent(item.Task)}`);
        break;
      case "organizations":
        router.push(
          `models/organization/${encodeURIComponent(item.Organization[0])}`,
        );
        break;
      case "domains":
        router.push(`models/domain/${encodeURIComponent(item.Domain[0])}`);
        break;
      case "countries":
        router.push(
          `models/country/${encodeURIComponent(item["Country (from Organization)"][0])}`,
        );
        break;
      default:
        break;
    }
  };

  // Helper function to flatten an array field from the documents and deduplicate the values
  const flattenAndDeduplicate = (docs: any[], key: string) => {
    const set = new Set<string>();
    const flattened: Array<{ id: string; value: string }> = [];
    docs.forEach((doc) => {
      if (Array.isArray(doc[key])) {
        doc[key].forEach((item: string, idx: number) => {
          if (!set.has(item)) {
            set.add(item);
            flattened.push({ id: `${doc._id}-${idx}`, value: item });
          }
        });
      }
    });
    return flattened;
  };

  // Compute flattened and deduplicated arrays for Tasks, Domains, Organizations, and Countries
  const flattenedTasks = searchResults
    ? flattenAndDeduplicate(searchResults.tasks, "Task")
    : [];
  const flattenedDomains = searchResults
    ? flattenAndDeduplicate(searchResults.domains, "Domain")
    : [];
  const flattenedOrganizations = searchResults
    ? flattenAndDeduplicate(searchResults.organizations, "Organization")
    : [];
  const flattenedCountries = searchResults
    ? flattenAndDeduplicate(
        searchResults.countries,
        "Country (from Organization)",
      )
    : [];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-8 items-center justify-center rounded-md bg-secondary px-4 py-1 text-sm font-medium text-secondary-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search</span>
        <kbd className="pointer-events-none ml-2 inline-flex h-4 select-none items-center gap-1 rounded border bg-input px-1 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type to search..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          onKeyDown={handleKeyDown}
          className="custom-command-input focus:shadow-none focus:outline-none focus-visible:ring-0 focus-visible:ring-transparent"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {searchResults && (
            <>
              <CommandGroup heading="Models">
                {searchResults.models && searchResults.models.length ? (
                  searchResults.models.map((item) => (
                    <CommandItem
                      key={item._id}
                      onSelect={() => handleSelect(item, "models")}
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      <span>{item.Model}</span>
                    </CommandItem>
                  ))
                ) : (
                  <CommandEmpty>No models found</CommandEmpty>
                )}
              </CommandGroup>
              <CommandGroup heading="Tasks">
                {flattenedTasks.length ? (
                  flattenedTasks.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() =>
                        handleSelect({ Task: item.value }, "tasks")
                      }
                    >
                      <Grid2x2Check className="mr-2 h-4 w-4" />
                      <span>{item.value}</span>
                    </CommandItem>
                  ))
                ) : (
                  <CommandEmpty>No tasks found</CommandEmpty>
                )}
              </CommandGroup>
              <CommandGroup heading="Organizations">
                {flattenedOrganizations.length ? (
                  flattenedOrganizations.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() =>
                        handleSelect(
                          { Organization: [item.value] },
                          "organizations",
                        )
                      }
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      <span>{item.value}</span>
                    </CommandItem>
                  ))
                ) : (
                  <CommandEmpty>No organizations found</CommandEmpty>
                )}
              </CommandGroup>
              <CommandGroup heading="Domains">
                {flattenedDomains.length ? (
                  flattenedDomains.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() =>
                        handleSelect({ Domain: [item.value] }, "domains")
                      }
                    >
                      <Boxes className="mr-2 h-4 w-4" />
                      <span>{item.value}</span>
                    </CommandItem>
                  ))
                ) : (
                  <CommandEmpty>No domains found</CommandEmpty>
                )}
              </CommandGroup>
              <CommandGroup heading="Countries">
                {flattenedCountries.length ? (
                  flattenedCountries.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() =>
                        handleSelect(
                          { "Country (from Organization)": [item.value] },
                          "countries",
                        )
                      }
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      <span>{item.value}</span>
                    </CommandItem>
                  ))
                ) : (
                  <CommandEmpty>No countries found</CommandEmpty>
                )}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
