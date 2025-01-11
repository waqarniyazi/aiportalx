"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Model {
  Model: string;
  Domain: string[];
  Task: string[];
  Organization: string[];
  "Country (from Organization)": string[];
  "Publication date": string;
}

interface ModelCardsProps {
  filters: Record<string, string[]>;
}

export default function ModelCards({ filters }: ModelCardsProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [likedCards, setLikedCards] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        setError(null);

        // Construct the query string from filters
        const queryString = new URLSearchParams(
          Object.entries(filters).reduce(
            (acc, [key, values]) => ({
              ...acc,
              [key]: values.join(","),
            }),
            {}
          )
        ).toString();

        // Fetch data from localhost:5000 with filters
        const response = await fetch(`http://localhost:5000/api/models?${queryString}`);
        if (!response.ok) throw new Error(await response.text());

        const data = await response.json();
        setModels(data);
      } catch (err) {
        setError(`Error fetching models: ${(err as Error).message}`);
        setModels([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [filters]); // Re-fetch when filters change

  const toggleLike = (index: number) => {
    setLikedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <Skeleton key={index} className="w-[320px] h-[180px] rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {models.length > 0 ? (
        models.map((model, index) => (
          <Card key={index} className="w-[320px] p-3 hover:shadow-md relative flex flex-col justify-between">
            <CardContent>
              {/* Like Button */}
              <div
                className={`absolute top-2 right-2 cursor-pointer ${
                  likedCards[index] ? "text-red-500" : "text-gray-500"
                }`}
                onClick={() => toggleLike(index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={likedCards[index] ? "red" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </div>

              {/* Model Info */}
              <div className="flex items-start space-x-2">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={`/OrganizationIcons/${model.Organization[0]?.toLowerCase().replace(/\s+/g, "_")}.png`}
                    alt={model.Organization[0]}
                  />
                  <AvatarFallback>{model.Model?.[0] || "?"}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <span className="text-lg font-bold hover:text-blue-500 cursor-pointer">
                    <a href={`/${model.Organization[0].replace(/ /g, '-')}/${model.Model.replace(/ /g, '-')}`}>
  {model.Model || "Unknown Model"}
</a>
                  </span>
                  <span className="text-gray-500 text-semmibold text-sm mt-1">
                    By{" "}
                    {model.Organization.map((org) => (
                      <a key={org} href="#" className="hover:text-blue-500">
                        {org}
                      </a>
                    )).reduce((prev, curr) => [prev, ", ", curr])}
                    {" | "}
                    {model["Publication date"]
                      ? new Date(model["Publication date"]).getFullYear()
                      : "Unknown Year"}
                    {" | "}
                    {model["Country (from Organization)"] &&
                      model["Country (from Organization)"].map((country, index) => {
                        const sanitizedCountry = country.trim().toLowerCase().replace(/\s+/g, "_");
                        return (
                          <TooltipProvider key={`${sanitizedCountry}-${index}`}>
                            <Tooltip>
                              <TooltipTrigger>
                                <img
                                  src={`/CountryIcons/${sanitizedCountry}.png`}
                                  alt={country.trim()}
                                  className="inline-block w-5 h-5 ml-1"
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{country.trim()}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                  </span>
                </div>
              </div>

              {/* Domain Section */}
              <div className="mt-3">
                <span className="text-xs font-medium text-gray-500">Domain:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {model.Domain.map((domain) => {
                    const sanitizedDomain = domain.trim().toLowerCase().replace(/\s+/g, "_");
                    return (
                      <Badge
                        key={sanitizedDomain}
                        variant="outline"
                        className="hover:border-blue-500 cursor-pointer px-2"
                      >
                        <img
                          src={`/DomainIcons/${sanitizedDomain}.png`}
                          alt={domain.trim()}
                          className="w-4 h-4 mr-1"
                        />
                        <a href="#">{domain.trim()}</a>
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Task Section */}
              <div className="mt-3">
                <span className="text-xs font-medium text-gray-500">Task:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {model.Task.map((task) => {
                    const sanitizedTask = task.trim().toLowerCase().replace(/[\s-/()]/g, "_");
                    return (
                      <Badge
                        key={sanitizedTask}
                        variant="secondary"
                        className="hover:border-blue-500 cursor-pointer px-2"
                      >
                        <img
                          src={`/TaskIcons/${sanitizedTask}.svg`}
                          alt={task.trim()}
                          className="w-4 h-4 mr-1"
                        />
                        <a href="#">{task.trim()}</a>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>

            {/* Buttons */}
            <div className="flex space-x-2 mt-4 justify-center">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-black flex items-center justify-center gap-1 px-4 py-2"
              >
                <img src="/tableicons/compare.svg" alt="compare" className="w-5 h-5" />
                Compare
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-black flex items-center justify-center gap-1 px-4 py-2"
              >
                <img src="/tableicons/monitor.svg" alt="use model" className="w-5 h-5" />
                Use Model
              </Button>
            </div>
          </Card>
        ))
      ) : (
        <p className="text-center text-gray-500">No models found.</p>
      )}
    </div>
  );
}
