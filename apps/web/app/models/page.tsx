"use client";

import { useState, useEffect } from "react";
import ModelCard from "@/components/model-card";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { BasicLayout } from "@/components/layouts/BasicLayout";
import { X } from "lucide-react";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [loadedCount, setLoadedCount] = useState(9);
  const [isMobile, setIsMobile] = useState(false);

  // Track window size to determine if mobile view
  useEffect(() => {
    const updateMobileView = () => setIsMobile(window.innerWidth <= 768);
    updateMobileView();
    window.addEventListener("resize", updateMobileView);
    return () => window.removeEventListener("resize", updateMobileView);
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const url = `http://localhost:5000/api/models`;

        const response = await fetch(url);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch models: ${errorText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid API response: Expected an array of models.");
        }

        setModels(data);
      } catch (err) {
        setError(`Error fetching models: ${(err as Error).message}`);
        setModels([]); // Ensure models is always an array
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleScroll = () => {
    const scrollPosition =
      window.innerHeight + document.documentElement.scrollTop;
    const bottomPosition =
      document.documentElement.offsetHeight - 100;

    if (scrollPosition >= bottomPosition && loadedCount < models.length) {
      setLoadedCount((prevCount) => prevCount + 9);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadedCount, models.length]);

  const renderSelectedFilters = () => {
    const selectedFilters = Object.entries(filters).flatMap(([category, values]) =>
      values.map((value) => `${category}: ${value}`)
    );

    return selectedFilters.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {selectedFilters.map((filter, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-xs"
          >
            {filter}
          </span>
        ))}
      </div>
    ) : (
      <span>No filters selected</span>
    );
  };

  return (
    <BasicLayout>
      <SidebarProvider>
        {/* AppSidebar with collapsible functionality */}
        <AppSidebar filters={filters} setFilters={setFilters} />
        <SidebarInset>
          <header className="flex sticky top-0 bg-background h-16 items-center px-4 justify-between z-10 group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              {/* Breadcrumb or Selected Filters */}
              <nav aria-label="breadcrumb">
                <ol className="flex text-sm text-muted-foreground">
                  {isMobile && Object.values(filters).some((f) => f.length > 0) ? (
                    renderSelectedFilters()
                  ) : (
                    <>
                      <li className="flex items-center">
                        <a href="/" className="hover:underline">
                          Home
                        </a>
                        <span className="mx-2">{'/'}</span>
                      </li>
                      <li className="flex items-center">
                        <span>AI Models</span>
                      </li>
                    </>
                  )}
                </ol>
              </nav>
  </div>
</header>

          <div className="p-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, index) => (
                  <Skeleton key={index} className="w-[320px] h-[180px] rounded-lg" />
                ))}
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <ModelCard models={models.slice(0, loadedCount)} filters={filters} />
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </BasicLayout>
  );
}
