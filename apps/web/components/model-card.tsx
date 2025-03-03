"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ModelCTA from "@/components/ModelCTA";
import { ModelHover } from "@/components/ModelHover";
import { slugify } from "utils/slugify";
import { ChevronDown } from "lucide-react";

interface Model {
  Model: string;
  Domain: string[];
  Task: string[];
  Organization: string[];
  "Country (from Organization)": string[];
  "Publication date": string;
}

interface ModelCardsProps {
  models?: Model[]; // Optional prop to pass in models directly
  filters: Record<string, string[]>;
  sortOption?: { field: string; order: "asc" | "desc" };
}

export default function ModelCards({ filters, sortOption }: ModelCardsProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [likedCards, setLikedCards] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedDomains, setExpandedDomains] = useState<{
    [key: number]: boolean;
  }>({});
  const [expandedTasks, setExpandedTasks] = useState<{
    [key: number]: boolean;
  }>({});
  const [visibleModels, setVisibleModels] = useState<number>(15);
  const [sortedModels, setSortedModels] = useState<Model[]>([]);

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
            {},
          ),
        ).toString();

        // Fetch data from localhost:5000 with filters
        const response = await fetch(
          `http://localhost:5000/api/models?${queryString}`,
        );
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

  const toggleExpandDomains = (index: number) => {
    setExpandedDomains((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleExpandTasks = (index: number) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const loadMoreModels = () => {
    setVisibleModels((prev) => prev + 15);
  };

  useEffect(() => {
    // After fetching data into 'models', also sort them here:
    let sorted = [...models];

    if (sortOption) {
      sorted.sort((a, b) => {
        const field = sortOption.field;

        // Convert numeric fields like FLOP to floats
        const valA =
          field === "Training compute (FLOP)"
            ? parseFloat(a["Training compute (FLOP)"] || "0")
            : field === "Publication date"
              ? new Date(a["Publication date"]).getTime()
              : a.Model.toLowerCase();

        const valB =
          field === "Training compute (FLOP)"
            ? parseFloat(b["Training compute (FLOP)"] || "0")
            : field === "Publication date"
              ? new Date(b["Publication date"]).getTime()
              : b.Model.toLowerCase();

        if (valA < valB) return sortOption.order === "asc" ? -1 : 1;
        if (valA > valB) return sortOption.order === "asc" ? 1 : -1;
        return 0;
      });
    }

    setSortedModels(sorted);
  }, [models, sortOption]);

  return (
    <>
      {loading ? (
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="h-[180px] w-[320px] rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 justify-items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedModels.slice(0, visibleModels).map((model, index) => (
              <Card
                key={index}
                className="relative flex h-[450px] w-[320px] flex-col justify-between rounded-xl p-3 shadow-md transition-shadow duration-300 hover:shadow-lg"
              >
                <CardContent>
                  {/* Like Button */}
                  <div
                    className={`absolute right-2 top-2 cursor-pointer ${
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
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      />
                    </svg>
                  </div>

                  {/* Model Info */}
                  <ModelHover modelData={model}>
                    <div className="flex items-start space-x-2 hover:cursor-pointer hover:outline-blue-500">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={`/OrganizationIcons/${model.Organization[0]?.toLowerCase().replace(/\s+/g, "_")}.png`}
                          alt={model.Organization[0]}
                        />
                        <AvatarFallback>
                          {model.Model?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <span className="cursor-pointer font-mono text-lg font-bold hover:text-blue-500 hover:underline">
                          <a
                            href={`/${slugify(model.Organization[0])}/${slugify(model.Model)}`}
                          >
                            {model.Model || "Unknown Model"}
                          </a>
                        </span>
                        <span className="text-semibold mt-1 text-sm text-gray-500">
                          By{" "}
                          {model.Organization.map((org) => (
                            <a
                              key={org}
                              href="#"
                              className="hover:text-blue-500"
                            >
                              {org}
                            </a>
                          )).reduce((prev, curr) => [prev, ", ", curr])}
                          {" | "}
                          {model["Publication date"]
                            ? new Date(model["Publication date"]).getFullYear()
                            : "Unknown Year"}
                          {" | "}
                          {model["Country (from Organization)"] &&
                            model["Country (from Organization)"].map(
                              (country, index) => {
                                const sanitizedCountry = country
                                  .trim()
                                  .toLowerCase()
                                  .replace(/\s+/g, "-");
                                return (
                                  <TooltipProvider
                                    key={`${sanitizedCountry}-${index}`}
                                  >
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <a
                                          href={`/models/country/${sanitizedCountry}`}
                                        >
                                          <img
                                            src={`/CountryIcons/${sanitizedCountry}.png`}
                                            alt={country.trim()}
                                            className="ml-1 inline-block h-5 w-5"
                                          />
                                        </a>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{country.trim()}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                );
                              },
                            )}
                        </span>
                      </div>
                    </div>
                  </ModelHover>

                  {/* Domain Section */}
                  <div className="mt-3">
                    <span className="text-xs font-medium text-gray-500">
                      Domain:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {model.Domain.slice(
                        0,
                        expandedDomains[index] ? model.Domain.length : 4,
                      ).map((domain) => {
                        const sanitizedDomain = domain
                          .trim()
                          .toLowerCase()
                          .replace(/\s+/g, "-");
                        return (
                          <Badge
                            key={sanitizedDomain}
                            variant="outline"
                            className="relative cursor-pointer overflow-hidden px-2 font-medium before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-l before:from-transparent before:to-[#3D61FF] before:opacity-5 hover:border-blue-500 dark:hover:border-blue-400"
                          >
                            <img
                              src={`/DomainIcons/${sanitizedDomain}.png`}
                              alt={domain.trim()}
                              className="mr-1 h-4 w-4"
                            />
                            <a href={`/models/domain/${sanitizedDomain}`}>
                              {domain.trim()}
                            </a>
                          </Badge>
                        );
                      })}
                      {model.Domain.length > 4 && !expandedDomains[index] && (
                        <Badge
                          variant="secondary"
                          className="relative cursor-pointer overflow-hidden px-2 font-medium before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-l before:from-transparent before:to-[#3D61FF] before:opacity-5 hover:border-blue-500 dark:hover:border-blue-400"
                          onClick={() => toggleExpandDomains(index)}
                        >
                          +{model.Domain.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Task Section */}
                  <div className="mt-3">
                    <span className="text-xs font-medium text-gray-500">
                      Task:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {model.Task.slice(
                        0,
                        expandedTasks[index] ? model.Task.length : 4,
                      ).map((task) => {
                        const sanitizedTask = task
                          .trim()
                          .toLowerCase()
                          .replace(/[\s-/()]/g, "-");
                        return (
                          <Badge
                            key={sanitizedTask}
                            variant="outline"
                            className="relative cursor-pointer overflow-hidden px-2 font-medium before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-l before:from-transparent before:to-[#3D61FF] before:opacity-5 hover:border-blue-500 dark:hover:border-blue-400"
                          >
                            <img
                              src={`/TaskIcons/${sanitizedTask}.svg`}
                              alt={task.trim()}
                              className="mr-1 h-4 w-4"
                            />
                            <a href={`/models/task/${sanitizedTask}`}>
                              {task.trim()}
                            </a>
                          </Badge>
                        );
                      })}
                      {model.Task.length > 4 && !expandedTasks[index] && (
                        <Badge
                          variant="secondary"
                          className="relative cursor-pointer overflow-hidden px-2 font-medium before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-l before:from-transparent before:to-[#3D61FF] before:opacity-5 hover:border-blue-500 dark:hover:border-blue-400"
                          onClick={() => toggleExpandTasks(index)}
                        >
                          +{model.Task.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>

                <ModelCTA model={model} />
              </Card>
            ))}
          </div>
          {visibleModels < sortedModels.length && (
            <Button
              onClick={loadMoreModels}
              variant="secondary"
              className="mx-auto mt-7 flex items-center gap-2"
            >
              <ChevronDown className="h-5 w-5" />
              Load More
            </Button>
          )}
        </div>
      )}
    </>
  );
}
