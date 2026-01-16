"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../tables/advanced/components/data-table-column-header";
import { DataTable } from "../tables/advanced/components/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DeleteConfirmationDialog from "../shared/DeleteConfirmationDialog";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import GenericFilter from "../shared/GenericFilter";
import TrainingDetailsModal from "./TrainingDetailsModal";
import React, { forwardRef, useImperativeHandle } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { usePaginatedSelect } from "@/hooks/usePaginatedSelect";
import {
  DeleteMethod,
  GetPanigationMethod,
  GetPanigationMethodWithFilter,
} from "@/app/services/apis/ApiMethod";
import { DescriptionCell } from "../shared/EnhancedReadMoreCell";

interface ExercisesTableProps {
  t: any;
}

// Define proper types
interface Training {
  id: number;
  categoryId: number;
  title: {
    arabic: string;
    english: string;
  };
  description: {
    arabic: string;
    english: string;
  };
  url: string;
  count: number;
  duration: number;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  calory: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  CreatedBy: any;
  Category: {
    id: number;
    name: string;
  };
  status: "active" | "inactive";
}

interface TrainingApiResponse {
  data: Training[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems?: number;
}

const ExercisesTable = forwardRef(({ t }: ExercisesTableProps, ref) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { lang } = useParams();
  const queryClient = useQueryClient();

  // Status options
  const statusOptions = ["Active", "In_Active"];

  // Difficulty options based on your API data
  const difficultyOptions = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

  // Categories paginated select - Updated to match BlogTable pattern
  const categoriesPaginated = usePaginatedSelect({
    fetchFunction: async (page, pageSize, search = "") => {
      const response = await GetPanigationMethod(
        "category",
        page,
        pageSize,
        lang,
        search,
      );
      return response.data || response;
    },
    transformData: (data) => {
      const items = data.data || data.items || data || [];
      const transformed = items.map((category: any) => ({
        value: category.id.toString(),
        label: lang === "ar" ? category.name.arabic : category.name.english,
      }));
      return transformed;
    },
  });

  // React Query for trainings data fetching
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<TrainingApiResponse, Error>({
    queryKey: ["trainings", page, pageSize, searchTerm, lang, filters],
    queryFn: async () => {
      try {
        // Build query parameters based on filters
        const queryParams: any = {
          page: page.toString(),
          pageSize: pageSize.toString(),
        };

        // Add search term to title filter
        if (searchTerm) {
          queryParams.title = searchTerm;
        }

        // Add category filter
        if (filters.category) {
          queryParams.categoryId = filters.category;
        }

        // Add status filter (based on deletedAt)
        if (filters.status) {
          queryParams.status = filters.status;
        }

        // Add difficulty filter
        if (filters.difficulty) {
          queryParams.difficulty = filters.difficulty;
        }

        const response = await GetPanigationMethodWithFilter(
          "training",
          page,
          pageSize,
          lang,
          searchTerm,
          queryParams,
        );

        // Handle different response structures with proper type checking
        let finalData;

        if (response && typeof response === "object") {
          const responseObj = response as any;

          if ("data" in responseObj) {
            finalData = responseObj.data;
          } else if (
            "response" in responseObj &&
            responseObj.response &&
            typeof responseObj.response === "object" &&
            "data" in responseObj.response
          ) {
            finalData = responseObj.response.data;
          } else {
            finalData = responseObj;
          }
        } else {
          throw new Error("Invalid API response");
        }

        // Ensure the response has the expected structure
        return {
          data: finalData.data || finalData.items || finalData || [],
          total: finalData.total || finalData.totalCount || 0,
          totalItems: finalData.totalItems || finalData.total || 0,
          page: finalData.page || page,
          pageSize: finalData.pageSize || pageSize,
          totalPages:
            finalData.totalPages ||
            Math.ceil((finalData.total || 0) / pageSize),
        };
      } catch (error: any) {
        console.error("Error fetching trainings:", error);
        throw new Error(error.message || "Failed to fetch trainings");
      }
    },
  });

  // Listen for refresh events from parent component
  useEffect(() => {
    const handleRefresh = () => {
      refetch();
    };

    window.addEventListener("refreshTableData", handleRefresh);

    return () => {
      window.removeEventListener("refreshTableData", handleRefresh);
    };
  }, [refetch]);

  // View training details
  const handleViewTraining = (training: Training) => {
    setSelectedTraining(training);
    setIsModalOpen(true);
  };

  // Delete training function
  const handleDeleteTraining = async (
    trainingId: number,
    trainingTitle: string,
  ) => {
    try {
      const response = await DeleteMethod("training", trainingId, lang);

      if (response?.code === 200) {
        toast.success(
          response.message ||
            t("training_deleted_successfully") ||
            "Training deleted successfully",
        );

        // Invalidate and refetch trainings to update the table
        queryClient.invalidateQueries({ queryKey: ["trainings"] });
      } else {
        toast.error(
          response?.message ||
            t("failed_to_delete_trainings") ||
            "Failed to delete training",
        );
      }
    } catch (error: any) {
      console.error("Error deleting training:", error);
      // Handle error response
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(
          t("failed_to_delete_training") || "Failed to delete training",
        );
      }
    }
  };

  useImperativeHandle(ref, () => ({
    refetch,
  }));

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page when searching
  };

  // Transform API data to table data
  const trainingData = useMemo(() => {
    if (!apiResponse?.data) return [];
    return apiResponse.data;
  }, [apiResponse]);

  // Define filter configuration - Updated to match BlogTable pattern
  const filterConfig: FilterOption[] = [
    {
      key: "category",
      label: t("category") || "Category",
      type: "selectPagination",
      placeholder: t("all_categories") || "All Categories",
      options: categoriesPaginated.options,
      isLoading: categoriesPaginated.isLoading,
      hasMore: categoriesPaginated.hasMore,
      onLoadMore: categoriesPaginated.loadMore,
      onSearch: categoriesPaginated.handleSearch,
      onOpen: categoriesPaginated.loadInitial,
      searchPlaceholder: t("search_categories") || "Search categories",
    },
    {
      key: "status",
      label: t("status") || "Status",
      type: "select",
      placeholder: t("all_statuses") || "All Statuses",
      options: statusOptions.map((status) => ({
        value: status,
        label: status.charAt(0).toUpperCase() + status.slice(1),
      })),
    },
    {
      key: "difficulty",
      label: t("difficulty") || "Difficulty",
      type: "select",
      placeholder: t("all_difficulties") || "All Difficulties",
      options: difficultyOptions.map((difficulty) => ({
        value: difficulty,
        label:
          difficulty.charAt(0).toUpperCase() +
          difficulty.slice(1).toLowerCase(),
      })),
    },
  ];

  const columns: ColumnDef<Training>[] = [
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("actions") || "Actions"}
          className="text-[#25235F] font-bold"
        />
      ),
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
          <Link href={`/exercises/${row.original.id}/edit`}>
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
              handleDeleteTraining(
                row.original.id,
                lang == "en"
                  ? row.original.title.english
                  : row.original.title.arabic,
              )
            }
            title={t("delete_training") || "Delete Training Program"}
            description={
              t("delete_training_confirmation") ||
              "Are you sure you want to delete this training program? This action cannot be undone."
            }
            confirmText={t("delete") || "Delete"}
            itemName={t("training_program") || "training program"}
            destructive={true}
            icon="fluent:delete-48-filled"
          />
        </div>
      ),
    },

    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("program_name") || "Program Name"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#25235F]/10 to-[#ED4135]/10 flex items-center justify-center">
                    <Icon
                      icon="heroicons:academic-cap"
                      className="h-5 w-5 text-[#25235F]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="max-w-[200px] truncate font-semibold text-gray-800 hover:text-[#25235F] transition-colors duration-200">
                      {lang == "en"
                        ? row.original.title.english
                        : row.original.title.arabic}
                    </span>
                    <span className="text-xs text-gray-500">
                      {lang === "en"
                        ? row.original.Category?.name.english
                        : row.original.Category?.name.arabic}{" "}
                      • {row.original.difficulty.toLowerCase()}
                    </span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p className="font-medium">
                  {" "}
                  {lang == "en"
                    ? row.original.title.english
                    : row.original.title.arabic}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Blog Description")}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => (
        <DescriptionCell
          description={
            lang == "en"
              ? row.original.description.english
              : row.original.description.arabic
          }
          icon="heroicons:document-text"
          maxLength={60}
          maxWidth="250px"
          variant="default" // or "compact" or "card"
        />
      ),
    },
    {
      accessorKey: "Category.name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("category") || "Category"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        const categoryColors: Record<string, string> = {
          "name 1": "bg-gradient-to-r from-green-500 to-green-600 text-white",
          strength: "bg-gradient-to-r from-red-500 to-red-600 text-white",
          cardio: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
          flexibility:
            "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
          endurance: "bg-gradient-to-r from-green-500 to-green-600 text-white",
          bodyweight:
            "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
        };

        const categoryName =
          lang == "en"
            ? row.original.Category?.name?.english
            : row.original.Category?.name?.arabic || "Unknown";
        const colorClass =
          categoryColors[categoryName] || "bg-gray-500 text-white";

        return (
          <div className="flex items-center justify-center">
            <Badge
              className={`text-center font-semibold px-3 py-1 rounded-full border-0 ${colorClass}`}
            >
              {categoryName}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "count_or_duration",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("count_duration") || "Count/Duration"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        const hasCount = row.original.count && row.original.count > 0;
        const hasDuration = row.original.duration && row.original.duration > 0;

        // Priority: Show count if available, otherwise show duration
        if (hasCount) {
          return (
            <div className="flex items-center justify-center gap-2">
              <Icon
                icon="heroicons:hashtag"
                className="h-4 w-4 text-[#25235F]"
              />
              <span className="text-sm font-medium text-gray-700">
                {row.original.count} {t("counts") || "counts"}
              </span>
            </div>
          );
        } else if (hasDuration) {
          return (
            <div className="flex items-center justify-center gap-2">
              <Icon icon="heroicons:clock" className="h-4 w-4 text-[#25235F]" />
              <span className="text-sm font-medium text-gray-700">
                {row.original.duration} {t("seconds") || "sec"}
              </span>
            </div>
          );
        } else {
          return (
            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-500">-</span>
            </div>
          );
        }
      },
    },
    {
      accessorKey: "difficulty",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("difficulty") || "Difficulty"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        const difficultyColors: Record<string, string> = {
          BEGINNER: "bg-gradient-to-r from-green-500 to-green-600 text-white",
          INTERMEDIATE:
            "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
          ADVANCED: "bg-gradient-to-r from-red-500 to-red-600 text-white",
        };

        const colorClass =
          difficultyColors[row.original.difficulty] || "bg-gray-500 text-white";

        return (
          <div className="flex items-center justify-center">
            <Badge
              className={`text-center font-semibold px-3 py-1 rounded-full border-0 ${colorClass}`}
            >
              {row.original.difficulty.toLowerCase()}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "calory",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("calories") || "Calories"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2">
            <Icon icon="heroicons:fire" className="h-4 w-4 text-[#25235F]" />
            <span className="text-sm font-medium text-gray-700">
              {row.original.calory || 0}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("status") || "Status"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        const statusColors: Record<string, string> = {
          active: "bg-gradient-to-r from-green-500 to-green-600 text-white",
          inactive: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
        };

        const colorClass =
          statusColors[row.original.status] || "bg-gray-500 text-white";

        return (
          <div className="flex items-center justify-center">
            <Badge
              className={`text-center font-semibold px-3 py-1 rounded-full border-0 ${colorClass}`}
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
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">
          {t("loading_trainings") || "Loading trainings..."}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          {t("error_loading_trainings") || "Error loading trainings"}:{" "}
          {error.message}
        </div>
        <Button onClick={() => refetch()} className="ml-4">
          {t("retry") || "Retry"}
        </Button>
      </div>
    );
  }

  const totalItems = apiResponse?.totalItems || apiResponse?.total || 0;

  return (
    <div className="space-y-6">
      {/* Generic Filter Component */}
      <GenericFilter
        filters={filterConfig}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        initialFilters={filters}
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder={t("search_trainings") || "Search trainings..."}
      />

      {/* Enhanced Data Table with Custom Styling */}
      <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-gradient-to-r from-[#25235F]/5 to-[#ED4135]/5 rounded-xl border border-gray-200">
        <div className="flex items-center gap-6"></div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => refetch()}
            variant="ghost"
            size="sm"
            className="text-[#25235F] hover:text-[#ED4135] hover:bg-[#25235F]/10 transition-all duration-300"
          >
            <Icon icon="heroicons:arrow-path" className="h-4 w-4 mr-2" />
            {t("refresh_data") || "Refresh Data"}
          </Button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden bg-white">
        <DataTable
          data={trainingData}
          columns={columns}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
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
});

ExercisesTable.displayName = "ExercisesTable";

export default ExercisesTable;
