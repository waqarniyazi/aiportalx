"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export type Model = {
  Model: string;
  Domain: string;
  Organization: string;
  "Country (from Organization)": string;
  "Publication date": string;
  Parameters?: number;
  "Model accessibility"?: string;
  "Training compute (FLOP)"?: number;
  "Base model"?: string;
  "Finetune compute (FLOP)"?: number;
  Confidence?: string;
  "Training time (hours)"?: number;
  "Training compute cost (2023 USD)"?: number;
  "Training hardware"?: string;
  "Notability criteria"?: string;
  Epochs?: number;
  "Frontier model"?: string;
  "Training power draw (W)"?: number;
  "Link"?: string;

};

const DOMAIN_OPTIONS = [
  "Multimodal",
  "Language",
  "Audio",
  "Speech",
  "Vision",
  "3D Modelling",
  "Biology",
  "Medicine",
  "Driving",
  "Earth Science",
  "Games",
  "Image Generation",
  "Mathematics",
  "Search",
  "Materials Science",
  "Video",
  "Robotics",
  "Recommendation",
  "Other",
];

const defaultColumns: ColumnDef<Model>[] = [
  {
    id: "Models",
    header: "Models",
    cell: ({ row }) => (
      <div className="flex flex-col space-y-2 sticky left-0 p-2 border-r z-10 hover:bg-gray-100">
        {/* System and Subtext */}
        <div className="flex items-start space-x-2">
          <Avatar className="w-14 h-14">
            <AvatarImage
              src={`/OrganizationIcons/${
                row.original.Organization.toLowerCase().replace(/\s+/g, "_") || "default"
              }.png`}
              alt={row.original.Organization}
            />
            <AvatarFallback>{row.original.Model[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xl font-bold hover:text-blue-500 cursor-pointer">
              <a href="#">{row.original.Model}</a>
            </span>
            <span className="text-gray-500 text-sm mt-1">
              By <a href="#" className="hover:text-blue-500">{row.original.Organization}</a> |
              {" "}
              {row.original["Publication date"]
                ? new Date(row.original["Publication date"]).getFullYear() || row.original["Publication date"]
                : ""}
              {" "}|
              <a href="#">
                <img
                  src={`/CountryIcons/${row.original["Country (from Organization)"].toLowerCase()}.png`}
                  alt="country icon"
                  className="inline-block w-5 h-5 ml-1 cursor-pointer hover:opacity-75"
                  title={row.original["Country (from Organization)"]}
                />
              </a>
            </span>
          </div>
        </div>
        {/* Domain Badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          {row.original.Domain.split(",").map((domain) => (
            <Badge
              key={domain.trim()}
              variant="outline"
              className="hover:border-blue-500 hover:text-blue-500 cursor-pointer px-2"
            >
              <img
                src={`/DomainIcons/${domain.trim().toLowerCase().replace(/\s+/g, "_")}.png`}
                alt={domain.trim()}
                className="w-4 h-4 mr-1"
              />
              <a href="#">{domain.trim()}</a>
            </Badge>
          ))}
        </div>
        {/* Buttons */}
        <div className="flex space-x-2 mt-2">
          <Button variant="outline" size="sm" className="hover:bg-gray-100">
            <img src="/tableicons/compare.png" alt="compare" className="w-4 h-4 mr-1" />
            Compare
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-gray-100 border-black"
          >
            <img src="/tableicons/monitor.png" alt="use model" className="w-4 h-4 mr-1" />
            Use Model
          </Button>
        </div>
      </div>
    ),
    enableSorting: false,
  },
  { accessorKey: "Base model", header: "Base Model" },
  { accessorKey: "Model accessibility", header: "Model Accessibility" },
  { accessorKey: "Training hardware", header: "Training Hardware" },
  { accessorKey: "Training time (hours)", header: "Training Time (Hours)" },
  { accessorKey: "Training compute cost (2023 USD)", header: "Training Compute Cost (USD)" },
  { accessorKey: "Notability criteria", header: "Notability Criteria" },
  { accessorKey: "Frontier model", header: "Frontier Model" },
  { accessorKey: "Confidence", header: "Confidence" },
  //{ accessorKey: "Parameters", header: "Parameters" },
  //{ accessorKey: "Training power draw (W)", header: "Training Power Draw (W)" },
  { accessorKey: "Training compute (FLOP)", header: "Training Compute (FLOP)" },
  { accessorKey: "Finetune compute (FLOP)", header: "Finetune Compute (FLOP)" },
  { accessorKey: "Epochs", header: "Epochs" },
  //{ accessorKey: "Link", header: "Link" },
  //{ accessorKey: "Authors", header: "Authors" },

];

export default function ModelsPage() {
  const [data, setData] = React.useState<Model[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, value) => {
      return (
        row.original[columnId]?.toString().toLowerCase().includes(value.toLowerCase())
      );
    },
  });

  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:5000/api/models");
      const models = await response.json();
      setData(models);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center py-4 space-x-4">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        {/* Column Visibility Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Select Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {table.getAllColumns().map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Table */}
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="cursor-pointer">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 10 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell colSpan={defaultColumns.length}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              : table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-gray-100"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="hover:bg-gray-100"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
