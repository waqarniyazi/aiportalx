"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";

interface SearchResult {
  Model: string;
  Organization: string[];
}

interface CompareSearchProps {
  onSelectModel: (model: SearchResult) => void;
}

export default function CompareSearch({ onSelectModel }: CompareSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount so that when Plus is clicked, the input gets focus.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Always show the dropdown on focus even if query is empty.
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/search", {
          params: { query },
        });
        setResults(res.data);
        setShowDropdown(true);
      } catch (error) {
        console.error("❌ Error fetching search results:", error);
      }
    };

    const delayDebounce = setTimeout(fetchResults, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-2 flex items-center text-gray-500">
          <Search className="h-5 w-5" />
        </span>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search models to compare..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className="pl-9"
        />
      </div>

      {showDropdown && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-background shadow-lg">
          {results.length > 0 ? (
            results.map((result, index) => (
              <div
                key={index}
                onMouseDown={() => onSelectModel(result)}
                className="flex cursor-pointer items-center p-2 hover:bg-opacity-80 dark:hover:bg-opacity-60"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`/OrganizationIcons/${result.Organization[0]
                      .toLowerCase()
                      .replace(/\s+/g, "_")}.png`}
                    alt={result.Organization[0]}
                  />
                  <AvatarFallback>{result.Model[0]}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="font-medium">{result.Model}</p>
                  <p className="text-sm text-gray-500">
                    By {result.Organization[0]}
                  </p>
                </div>
              </div>
            ))
          ) : (
            // Renders a blank dropdown if no results.
            <div className="p-2 text-gray-500">No models found.</div>
          )}
        </div>
      )}
    </div>
  );
}
