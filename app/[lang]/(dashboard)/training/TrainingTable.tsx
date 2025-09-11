"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trainingData } from ".";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../tables/advanced/components/data-table-column-header";
import { DataTable } from "../tables/advanced/components/data-table";
import DeleteConfirmationDialog from "../shared/DeleteConfirmationDialog";
import Link from "next/link";
import { useState, useMemo } from "react";
import GenericFilter, { FilterOption } from "../shared/GenericFilter";
import TrainingDetailsModal from "./TrainingDetailsModal";

interface Training {
  id: string;
  name: string;
  category: string;
  duration: number;
  difficulty: string;
  calories: number;
  status: string;
  show: boolean;
  count?: number;
}

const TrainingTable = ({ t }: { t: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(
    null
  );
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleViewTraining = (training: Training) => {
    setSelectedTraining(training);
    setIsModalOpen(true);
  };

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  // Get unique values for filter dropdowns
  const statusOptions = useMemo(
    () => Array.from(new Set(trainingData.map((item) => item.status))),
    []
  );
  const categoryOptions = useMemo(
    () => Array.from(new Set(trainingData.map((item) => item.category))),
    []
  );
  const difficultyOptions = useMemo(
    () => Array.from(new Set(trainingData.map((item) => item.difficulty))),
    []
  );
  const showOptions = useMemo(
    () =>
      Array.from(
        new Set(trainingData.map((item) => (item.show ? "Yes" : "No")))
      ),
    []
  );

  // Define filter configuration
  const filterConfig: FilterOption[] = [
    {
      key: "search",
      label: "Search",
      type: "text",
      placeholder: "Search by name...",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      placeholder: "All Statuses",
      options: statusOptions.map((status) => ({
        value: status,
        label: status,
      })),
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      placeholder: "All Categories",
      options: categoryOptions.map((category) => ({
        value: category,
        label: category,
      })),
    },
    {
      key: "difficulty",
      label: "Difficulty",
      type: "select",
      placeholder: "All Difficulties",
      options: difficultyOptions.map((difficulty) => ({
        value: difficulty,
        label: difficulty,
      })),
    },
    {
      key: "show",
      label: "Show",
      type: "select",
      placeholder: "All",
      options: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ],
    },
  ];

  // Filter data based on applied filters
  const filteredData = useMemo(() => {
    return trainingData.filter((training) => {
      const isShowMatch =
        filters.show === "" ||
        (filters.show === "Yes" && training.show) ||
        (filters.show === "No" && !training.show);

      return (
        (filters.status === "" || training.status === filters.status) &&
        (filters.category === "" || training.category === filters.category) &&
        (filters.difficulty === "" ||
          training.difficulty === filters.difficulty) &&
        isShowMatch &&
        (filters.search === "" ||
          training.name.toLowerCase().includes(filters.search.toLowerCase()))
      );
    });
  }, [trainingData, filters]);

  const columns: ColumnDef<Training>[] = [
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-3 items-center justify-center">
          <Button
            size="icon"
            onClick={() => handleViewTraining(row.original)}
            variant="outline"
            className="h-9 w-9 border-[#25235F]/20 hover:border-[#25235F] hover:bg-[#25235F] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Icon icon="carbon:view" className="h-4 w-4" />
          </Button>
          <Link href={`/training/${row.original.id}/edit`}>
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9 border-[#25235F]/20 hover:border-[#25235F] hover:bg-[#25235F] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Icon icon="heroicons:pencil" className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteConfirmationDialog
            onConfirm={() =>
              console.log(`Deleting training: ${row.original.name}`)
            }
            title="Delete Training Program"
            description="Are you sure you want to delete this training program? This action cannot be undone."
            confirmText="Delete"
            itemName="training program"
            destructive={true}
            icon="fluent:delete-48-filled"
          />
        </div>
      ),
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"ID"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]">
          <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-gradient-to-r from-[#25235F] to-[#25235F]/80 rounded-full">
            {row.original.id.slice(0, 3)}
          </span>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Program Name"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#25235F]/10 to-[#ED4135]/10 flex items-center justify-center">
              <Icon
                icon="heroicons:academic-cap"
                className="h-5 w-5 text-[#25235F]"
              />
            </div>
            <div className="flex flex-col">
              <span className="max-w-[200px] truncate font-semibold text-gray-800 hover:text-[#25235F] transition-colors duration-200">
                {row.original.name}
              </span>
              <span className="text-xs text-gray-500">
                {row.original.category} • {row.original.difficulty}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Category"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        const categoryColors = {
          strength: "bg-gradient-to-r from-red-500 to-red-600 text-white",
          cardio: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
          flexibility:
            "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
          endurance: "bg-gradient-to-r from-green-500 to-green-600 text-white",
          bodyweight:
            "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
        };

        return (
          <div className="flex items-center justify-center">
            <Badge
              className={`text-center font-semibold px-3 py-1 rounded-full border-0 ${
                categoryColors[
                  row.original.category as keyof typeof categoryColors
                ] || "bg-gray-500 text-white"
              }`}
            >
              {row.original.category}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "duration",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Duration (min)"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2">
            <Icon icon="heroicons:clock" className="h-4 w-4 text-[#25235F]" />
            <span className="text-sm font-medium text-gray-700">
              {row.original.duration}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "difficulty",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Difficulty"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        const difficultyColors = {
          beginner: "bg-gradient-to-r from-green-500 to-green-600 text-white",
          intermediate:
            "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
          advanced: "bg-gradient-to-r from-red-500 to-red-600 text-white",
        };

        return (
          <div className="flex items-center justify-center">
            <Badge
              className={`text-center font-semibold px-3 py-1 rounded-full border-0 ${
                difficultyColors[
                  row.original.difficulty as keyof typeof difficultyColors
                ] || "bg-gray-500 text-white"
              }`}
            >
              {row.original.difficulty}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "calories",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Calories"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2">
            <Icon icon="heroicons:fire" className="h-4 w-4 text-[#25235F]" />
            <span className="text-sm font-medium text-gray-700">
              {row.original.calories}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "count",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Count"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            {row.original.count ? (
              <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-3 py-1 rounded-full border-0">
                {row.original.count}
              </Badge>
            ) : (
              <span className="text-sm text-gray-500">-</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Status"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        const statusColors = {
          active: "bg-gradient-to-r from-green-500 to-green-600 text-white",
          inactive: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
        };

        return (
          <div className="flex items-center justify-center">
            <Badge
              className={`text-center font-semibold px-3 py-1 rounded-full border-0 ${
                statusColors[
                  row.original.status as keyof typeof statusColors
                ] || "bg-gray-500 text-white"
              }`}
            >
              {row.original.status}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "show",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Show"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            {row.original.show ? (
              <Badge className="bg-gradient-to-r from-[#ED4135] to-[#ED4135]/80 text-white font-semibold px-3 py-1 rounded-full border-0">
                Show
              </Badge>
            ) : (
              <span className="text-sm text-gray-500">Hidden</span>
            )}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Generic Filter Component */}
      <GenericFilter
        filters={filterConfig}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        initialFilters={filters}
      />

      {/* Enhanced Data Table with Custom Styling */}
      <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-gradient-to-r from-[#25235F]/5 to-[#ED4135]/5 rounded-xl border border-gray-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              Active Programs:{" "}
              {filteredData.filter((t) => t.status === "active").length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              Visible Programs: {filteredData.filter((t) => t.show).length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              Total Programs: {filteredData.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#25235F] hover:text-[#ED4135] hover:bg-[#25235F]/10 transition-all duration-300"
          >
            <Icon icon="heroicons:arrow-path" className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden bg-white">
        <DataTable data={trainingData} columns={columns} />
        {selectedTraining && (
          <TrainingDetailsModal
            training={selectedTraining}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TrainingTable;
