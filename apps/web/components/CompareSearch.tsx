"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/search`, {
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
          type="text"
          placeholder="Search models to compare..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className="pl-9"
        />
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
          {results.map((result, index) => (
            <div
              key={index}
              onClick={() => onSelectModel(result)}
              className="flex cursor-pointer items-center p-2 hover:bg-gray-100"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={`/OrganizationIcons/${result.Organization[0].toLowerCase().replace(/\s+/g, "_")}.png`}
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
          ))}
        </div>
      )}
    </div>
  );
}
