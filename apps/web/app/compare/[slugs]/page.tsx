"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { BlogLayout } from "components/layouts/BlogLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Boxes,
  Rocket,
  Dumbbell,
  CircleUserRound,
  ScrollText,
  Info,
  CodeXml,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  "Base model"?: string;
  "Organization categorization (from Organization)"?: string;
  "Training compute notes"?: string;
  Confidence?: string;
  Parameters?: string;
  "Finetune compute (FLOP)"?: string;
  "Finetune compute notes"?: string;
  "Accessibility notes"?: string;
  "Training dataset"?: string;
  "Training dataset notes"?: string;
  "Training dataset size (datapoints)"?: string;
  "Training time (hours)"?: string;
  "Dataset size notes"?: string;
  "Training hardware"?: string;
  "Hardware quantity"?: string;
  "Training code accessibility"?: string;
  "Parameters notes"?: string;
  Authors?: string[];
  [key: string]: any;
};

const ComparePage = () => {
  const pathname = usePathname();
  const [models, setModels] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedAbstracts, setExpandedAbstracts] = useState<
    Record<string, boolean>
  >({});

  // Extract selected model names from dynamic URL, e.g. "/compare/Model%20One-vs-Model%20Two"
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

  if (loading)
    return (
      <div className="p-4">
        <Skeleton className="mb-2 h-6 w-1/2" />
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  if (error) return <p>Error: {error}</p>;
  if (!models.length) return;

  // Show third column only if three models are selected
  const showThird = models.length === 3;

  // Helper to only render row if at least one model has data for the field
  const isRowVisible = (field: keyof ModelData) =>
    models.some(
      (model) =>
        model[field] !== undefined &&
        model[field] !== null &&
        model[field] !== "",
    );

  // Section Row definitions
  const overviewRows = [
    { label: "Domain", field: "Domain" },
    { label: "Task", field: "Task" },
    { label: "Organization", field: "Organization" },
    {
      label: "Country (from Organization)",
      field: "Country (from Organization)",
    },
    { label: "Publication date", field: "Publication date" },
    { label: "Model accessibility", field: "Model accessibility" },
    { label: "Base model", field: "Base model" },
    {
      label: "Organization categorization (from Organization)",
      field: "Organization categorization (from Organization)",
    },
  ];

  const benchmarkingRows = [
    { label: "Training compute (FLOP)", field: "Training compute (FLOP)" },
    { label: "Confidence", field: "Confidence" },
    { label: "Parameters", field: "Parameters" },
    {
      label: "Finetune compute (FLOP)",
      field: "Finetune compute (FLOP)",
    },
    { label: "Finetune compute notes", field: "Finetune compute notes" },
  ];

  const trainingRows = [
    { label: "Accessibility notes", field: "Accessibility notes" },
    { label: "Training dataset", field: "Training dataset" },
    {
      label: "Training dataset size (datapoints)",
      field: "Training dataset size (datapoints)",
    },
    { label: "Training time (hours)", field: "Training time (hours)" },
    { label: "Dataset size notes", field: "Dataset size notes" },
    { label: "Training hardware", field: "Training hardware" },
    { label: "Hardware quantity", field: "Hardware quantity" },
    {
      label: "Training code accessibility",
      field: "Training code accessibility",
    },
  ];

  const notesFields = [
    { label: "Parameters notes", field: "Parameters notes" },
    { label: "Training compute notes", field: "Training compute notes" },
    { label: "Training dataset notes", field: "Training dataset notes" },
    { label: "Training time notes", field: "Training time (hours)" }, // using Training time
    { label: "Dataset size notes", field: "Dataset size notes" },
    { label: "Finetune compute notes", field: "Finetune compute notes" },
  ];

  return (
    <BlogLayout>
      <div className="space-y-8 p-4">
        <h1 className="mt-10 text-3xl font-bold">Compare AI Models</h1>

        {/* Comparison Overview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Boxes className="h-7 w-7 text-blue-500" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Wrap the table in an overflow-x-auto container for horizontal scrolling */}
            <div className="overflow-x-auto">
              <div className="overflow-hidden rounded-md border">
                <Table className="w-full table-auto">
                  <TableHeader>
                    <TableRow>
                      {/* Freeze the Parameters column */}
                      <TableHead className="sticky left-0 z-50 bg-white px-4 py-2 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
                        Parameters
                      </TableHead>
                      <TableHead className="px-4 py-2">
                        {models[0].Model || "Model 1"}
                      </TableHead>
                      <TableHead className="px-4 py-2">
                        {models[1].Model || "Model 2"}
                      </TableHead>
                      {showThird && (
                        <TableHead className="px-4 py-2">
                          {models[2].Model || "Model 3"}
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overviewRows.map(
                      (row) =>
                        isRowVisible(row.field as keyof ModelData) && (
                          <TableRow key={row.field}>
                            {/* Freeze the first cell in each row */}
                            <TableCell className="sticky left-0 z-50 bg-white px-4 py-2 font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-50">
                              {row.label}
                            </TableCell>
                            <TableCell className="px-4 py-2">
                              {Array.isArray(
                                models[0][row.field as keyof ModelData],
                              )
                                ? (models[0][row.field] as string[]).join(", ")
                                : models[0][row.field] || "-"}
                            </TableCell>
                            <TableCell className="px-4 py-2">
                              {Array.isArray(models[1][row.field])
                                ? (models[1][row.field] as string[]).join(", ")
                                : models[1][row.field] || "-"}
                            </TableCell>
                            {showThird && (
                              <TableCell className="px-4 py-2">
                                {Array.isArray(models[2][row.field])
                                  ? (models[2][row.field] as string[]).join(
                                      ", ",
                                    )
                                  : models[2][row.field] || "-"}
                              </TableCell>
                            )}
                          </TableRow>
                        ),
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Rocket className="h-7 w-7 text-blue-500" />
              Benchmarking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="overflow-hidden rounded-md border">
                <Table className="w-full table-auto">
                  <TableHeader>
                    <TableRow>
                      {/* Freeze the Parameters column */}
                      <TableHead className="sticky left-0 z-10 bg-white px-4 py-2 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
                        Parameters
                      </TableHead>
                      <TableHead className="px-4 py-2">
                        {models[0].Model || "Model 1"}
                      </TableHead>
                      <TableHead className="px-4 py-2">
                        {models[1].Model || "Model 2"}
                      </TableHead>
                      {showThird && (
                        <TableHead className="px-4 py-2">
                          {models[2].Model || "Model 3"}
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {benchmarkingRows.map(
                      (row) =>
                        isRowVisible(row.field as keyof ModelData) && (
                          <TableRow key={row.field}>
                            {/* Freeze the first cell in each row */}
                            <TableCell className="sticky left-0 z-10 bg-white px-4 py-2 font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-50">
                              {row.label}
                            </TableCell>
                            <TableCell className="px-4 py-2">
                              {models[0][row.field] || "-"}
                            </TableCell>
                            <TableCell className="px-4 py-2">
                              {models[1][row.field] || "-"}
                            </TableCell>
                            {showThird && (
                              <TableCell className="px-4 py-2">
                                {models[2][row.field] || "-"}
                              </TableCell>
                            )}
                          </TableRow>
                        ),
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Dumbbell className="h-7 w-7 text-blue-500" />
              Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="overflow-hidden rounded-md border">
                <Table className="w-full table-auto">
                  <TableHeader>
                    <TableRow>
                      {/* Freeze the Parameters column */}
                      <TableHead className="sticky left-0 z-10 bg-white px-4 py-2 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
                        Parameters
                      </TableHead>
                      <TableHead className="px-4 py-2">
                        {models[0].Model || "Model 1"}
                      </TableHead>
                      <TableHead className="px-4 py-2">
                        {models[1].Model || "Model 2"}
                      </TableHead>
                      {showThird && (
                        <TableHead className="px-4 py-2">
                          {models[2].Model || "Model 3"}
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainingRows.map(
                      (row) =>
                        isRowVisible(row.field as keyof ModelData) && (
                          <TableRow key={row.field}>
                            {/* Freeze the first cell in each row */}
                            <TableCell className="sticky left-0 z-10 bg-white px-4 py-2 font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-50">
                              {row.label}
                            </TableCell>
                            <TableCell className="px-4 py-2">
                              {models[0][row.field] || "-"}
                            </TableCell>
                            <TableCell className="px-4 py-2">
                              {models[1][row.field] || "-"}
                            </TableCell>
                            {showThird && (
                              <TableCell className="px-4 py-2">
                                {models[2][row.field] || "-"}
                              </TableCell>
                            )}
                          </TableRow>
                        ),
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <CodeXml className="h-7 w-7 text-blue-500" />
              Official Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Card className="p-4">
              <div
                className={`grid gap-4 ${
                  models.length === 3
                    ? "sm:grid-cols-3"
                    : models.length === 2
                      ? "sm:grid-cols-2 sm:justify-center"
                      : "sm:grid-cols-1 sm:justify-center"
                }`}
              >
                {models.map((model, idx) => (
                  <Button
                    key={idx}
                    asChild
                    variant="secondary"
                    disabled={!model.Link}
                    className="flex min-w-0 items-center gap-2 whitespace-nowrap px-3 py-2 text-sm"
                  >
                    {model.Link ? (
                      <a
                        href={model.Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-w-0 items-center gap-2 truncate"
                      >
                        <CodeXml className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">
                          Check {model.Model} Documentation
                        </span>
                      </a>
                    ) : (
                      <span className="flex min-w-0 items-center gap-2 truncate">
                        <CodeXml className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">
                          Check {model.Model} Documentation
                        </span>
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </Card>
          </CardContent>
        </Card>

        {models.some((m) => m.Authors && m.Authors.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <CircleUserRound className="h-7 w-7 text-blue-500" />
                Authors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="overflow-hidden rounded-md border">
                  <Table className="w-full table-auto">
                    <TableHeader>
                      <TableRow>
                        {models.map((model, idx) =>
                          idx === 0 ? (
                            <TableHead
                              key={idx}
                              className="sticky left-0 z-10 bg-white px-4 py-2 text-slate-900 dark:bg-slate-900 dark:text-slate-50"
                            >
                              {model.Model || `Model ${idx + 1}`}
                            </TableHead>
                          ) : (
                            <TableHead key={idx} className="px-4 py-2">
                              {model.Model || `Model ${idx + 1}`}
                            </TableHead>
                          ),
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        {models.map((model, idx) =>
                          idx === 0 ? (
                            <TableCell
                              key={idx}
                              className="sticky left-0 z-10 bg-white px-4 py-2 text-slate-900 dark:bg-slate-900 dark:text-slate-50"
                            >
                              {model.Authors ? model.Authors.join(", ") : "-"}
                            </TableCell>
                          ) : (
                            <TableCell key={idx} className="px-4 py-2">
                              {model.Authors ? model.Authors.join(", ") : "-"}
                            </TableCell>
                          ),
                        )}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <ScrollText className="h-7 w-7 text-blue-500" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Card className="p-4">
              <div
                className={`grid gap-4 ${
                  models.length === 3
                    ? "sm:grid-cols-3"
                    : models.length === 2
                      ? "sm:grid-cols-2 sm:justify-center"
                      : "sm:grid-cols-1 sm:justify-center"
                }`}
              >
                {models.map((model, idx) => (
                  <div key={idx} className="min-w-0">
                    <h3 className="mb-2 text-lg font-semibold underline">
                      {model.Model}
                    </h3>
                    {notesFields.map(
                      (item) =>
                        model[item.field as keyof ModelData] && (
                          <p
                            key={item.field}
                            className="w-full overflow-hidden text-ellipsis whitespace-normal break-words text-tremor-small"
                          >
                            <strong>{item.label}:</strong>{" "}
                            {model[item.field as keyof ModelData]}
                          </p>
                        ),
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </CardContent>
        </Card>

        {/* Abstract Section */}
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Info className="h-7 w-7 text-blue-500" />
              Abstract
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Card className="p-4">
              <div
                className={`grid gap-4 ${
                  models.length === 3
                    ? "sm:grid-cols-3"
                    : models.length === 2
                      ? "sm:grid-cols-2 sm:justify-center"
                      : "sm:grid-cols-1 sm:justify-center"
                }`}
              >
                {models.map((model, idx) => (
                  <div key={idx}>
                    <h3 className="mb-2 text-lg font-semibold underline">
                      {model.Model}
                    </h3>
                    <p className="overflow-hidden whitespace-normal break-words text-tremor-small">
                      {model.Abstract || "No abstract available."}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </CardContent>
        </Card>
      </div>
    </BlogLayout>
  );
};

export default ComparePage;
