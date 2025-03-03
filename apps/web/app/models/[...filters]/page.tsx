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
//import SearchBar from "@/components/SearchBar";
import { BlogCard } from "@/components/BlogCard";
import SortFeature from "@/components/SortFeature";
import {
  postsQuery,
  domainPostsQuery,
  taskPostsQuery,
  countryPostsQuery,
  organizationPostsQuery,
} from "../../../sanity/lib/queries";
import { sanityFetch } from "../../../sanity/lib/fetch";
import { HeaderX } from "@/components/headerx";

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  mainImage: any;
  body: any;
  authorName: string;
  authorImage: any;
  authorTwitter: string;
  filterValue: string;
}

interface Model {
  Model: string;
  Domain: string[];
  Task: string[];
  Organization: string[];
  "Country (from Organization)": string[];
  "Publication date": string;
  [key: string]: any; // Keep this to maintain flexibility for additional properties
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const pathname = usePathname();
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]); // For blog posts
  const [sortOption, setSortOption] = useState<{
    field: string;
    order: "asc" | "desc";
  }>({
    field: "Model",
    order: "asc",
  });

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

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const parts = pathname.split("/").filter(Boolean); // ["models", "task", "chat"]
        if (parts.length >= 3) {
          const [_, filterType, filterVal] = parts;
          let query;
          switch (filterType) {
            case "task":
              query = taskPostsQuery;
              break;
            case "domain":
              query = domainPostsQuery;
              break;
            case "country":
              query = countryPostsQuery;
              break;
            case "organization":
              query = organizationPostsQuery;
              break;
            default:
              query = postsQuery;
          }
          const posts = await sanityFetch<BlogPost[]>({
            query,
            params: { filterValue: decodeURIComponent(filterVal) },
          });
          setBlogPosts(posts ?? []);
        } else {
          setBlogPosts([]);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setBlogPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogPosts();
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
      <HeaderX />
      <div className="pt-[var(--header-height)]"></div>
      <AppSidebar
        filters={filters}
        setFilters={setFilters}
        onFilterChange={updateFilter}
      />
      <SidebarInset>
        <header className="sticky top-[var(--header-height)] z-50 mb-[30px] flex w-full items-center justify-between bg-background px-4 py-[1px] pt-[1px] shadow-sm">
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
            <SortFeature onSortChange={(option) => setSortOption(option)} />
          </div>
        </header>

        <div className="p-4">
          {blogPosts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
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
            <ModelCard
              models={models}
              filters={filters}
              sortOption={sortOption}
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
