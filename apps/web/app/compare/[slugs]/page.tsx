"use client"; // Ensure this is the very first line in the file

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { BasicLayout } from "components/layouts/BasicLayout";

type ModelData = {
  Model: string;
  Domain?: string[];
  Task?: string[];
  "Model accessibility"?: string;
  "Publication date"?: string;
  Organization?: string[];
  Link?: string;
  "Training compute (FLOP)"?: string;
  "Country (from Organization)"?: string[];
  Abstract?: string;
};

const ComparePage = () => {
  const pathname = usePathname();
  const [models, setModels] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      setError(null);

      try {
        const slugPart = pathname.split("/compare/")[1];
        if (!slugPart) throw new Error("Invalid URL: Slugs not found");

        const slugArray = slugPart
          .split("-vs-")
          .map((slug) => decodeURIComponent(slug.trim()));
        const queryParams = slugArray
          .map((slug) => `slugs=${encodeURIComponent(slug)}`)
          .join("&");

        const response = await fetch(
          `http://localhost:5000/api/models?${queryParams}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }

        const data: ModelData[] = await response.json();
        if (!data.length) {
          throw new Error("No models found for comparison");
        }

        setModels(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [pathname]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!models.length) return <p>No models found for comparison.</p>;

  return (
    <BasicLayout>
      <div className="container mx-auto py-8">
        <h1 className="mb-6 text-2xl font-bold">Compare AI Models</h1>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Feature</TableCell>
              {models.map((model, index) => (
                <TableCell key={index}>{model.Model}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              "Domain",
              "Task",
              "Model accessibility",
              "Publication date",
              "Organization",
              "Link",
              "Training compute (FLOP)",
              "Country (from Organization)",
              "Abstract",
            ].map((feature) => (
              <TableRow key={feature}>
                <TableCell className="font-medium">{feature}</TableCell>
                {models.map((model, index) => (
                  <TableCell key={index}>
                    {Array.isArray(model[feature as keyof ModelData])
                      ? (model[feature as keyof ModelData] as string[]).join(
                          ", ",
                        )
                      : model[feature as keyof ModelData] || "N/A"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {models.map((model, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{model.Model}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Abstract:</strong> {model.Abstract || "N/A"}
                </p>
                <p>
                  <strong>Organization:</strong>{" "}
                  {model.Organization?.join(", ") || "N/A"}
                </p>
                <a
                  href={model.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  Learn more
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </BasicLayout>
  );
};

export default ComparePage;
