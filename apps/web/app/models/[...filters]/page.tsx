"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ModelCard from "@/components/model-card";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import SearchBar from "@/components/SearchBar";
import BlogCard from "@/components/BlogCard";

export default function ModelsPage() {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/models", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filters }),
        });
        const data = await response.json();
        setModels(data);
      } catch (error) {
        console.error("Error fetching models:", error);
        setModels([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [filters]);

  useEffect(() => {
    const applyFiltersFromUrl = () => {
      const pathSegments = pathname.split("/").filter(Boolean);
      const newFilters: Record<string, string[]> = {};

      if (pathSegments.length >= 3) {
        const category = decodeURIComponent(pathSegments[1]);
        const value = decodeURIComponent(pathSegments[2]).replace(/-/g, " ");
        newFilters[category.charAt(0).toUpperCase() + category.slice(1)] = [
          value.charAt(0).toUpperCase() + value.slice(1),
        ];
      }

      setFilters(newFilters);
    };

    applyFiltersFromUrl();
  }, [pathname]);

  const updateFilter = ({ type, value }: { type: string; value: string }) => {
    const newFilters = { ...filters };
    if (!newFilters[type]) newFilters[type] = [];
    if (newFilters[type].includes(value)) {
      newFilters[type] = newFilters[type].filter((item) => item !== value);
    } else {
      newFilters[type].push(value);
    }
    setFilters(newFilters);

    const queryString = Object.entries(newFilters)
      .map(([key, values]) =>
        values
          .map((val) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
          .join("&"),
      )
      .join("&");

    router.push(
      `/models/${encodeURIComponent(type)}/${encodeURIComponent(value)}${queryString ? `?${queryString}` : ""}`,
    );
  };

  return (
    <SidebarProvider>
      <AppSidebar
        filters={filters}
        setFilters={setFilters}
        onFilterChange={updateFilter}
      />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-background px-4">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <nav aria-label="breadcrumb">
              <ol className="flex text-sm text-muted-foreground">
                <li className="flex items-center">
                  <a href="/" className="hover:underline">
                    Home
                  </a>
                  <span className="mx-2">{"/"}</span>
                </li>
                <li className="flex items-center">
                  <span>AI Models</span>
                </li>
              </ol>
            </nav>
          </div>
          <div className="ml-auto">
            <SearchBar />
          </div>
        </header>

        <div className="p-4">
          <BlogCard filters={filters} />
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-[180px] w-[320px] rounded-lg"
                />
              ))}
            </div>
          ) : (
            <ModelCard models={models} filters={filters} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
