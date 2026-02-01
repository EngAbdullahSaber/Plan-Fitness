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
import { useState, useMemo, useEffect, useRef } from "react";
import {
  GetPanigationMethod,
  DeleteMethod,
  GetPanigationMethodWithFilter,
  PostMethod,
  PatchMethod,
} from "@/app/services/apis/ApiMethod";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { forwardRef, useImperativeHandle } from "react";
import GenericFilter from "../shared/GenericFilter";
import { usePaginatedSelect } from "@/hooks/usePaginatedSelect";
import { ImageCell } from "../shared/ImageCell";
import { DescriptionCell } from "../shared/EnhancedReadMoreCell";
import ActivationConfirmationDialog from "../shared/DeActiviateConfirmationDialog";
import { EnhancedReadMoreItems } from "../shared/EnhancedReadMoreItems";

// Interfaces based on your API response
interface MealItem {
  id: number;
  description: string;
  mealId?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Meal {
  id: number;
  image: string;
  type: string;
  totalCalory: number;
  proteins: number;
  fat: number;
  carp: number;
  status: string;
  isRequest: boolean;
  createdAt: string;
  updatedAt: string;
  mealItem: MealItem[];
}

interface MealStatistics {
  active: number;
  inActive: number;
  requests: number;
}

interface MealApiResponse {
  code: number;
  message: string | { arabic: string; english: string };
  data: {
    meals: Meal[];
    statistics: MealStatistics;
  };
  totalPages?: number;
  totalItems?: number;
  currentPage?: number;
}

const MealTable = forwardRef(({ t }: { t: any }, ref) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [processingRequest, setProcessingRequest] = useState<number | null>(
    null,
  );
  const { lang } = useParams();
  const queryClient = useQueryClient();

  // React Query for meals data fetching
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<MealApiResponse, Error>({
    queryKey: ["meals", page, pageSize, searchTerm, lang, filters],
    queryFn: async () => {
      try {
        // Build query parameters based on filters
        const queryParams: any = {
          page: page.toString(),
          pageSize: pageSize.toString(),
        };

        // Add search term if provided
        if (searchTerm) {
          queryParams.search = searchTerm;
        }

        // Add meal type filter
        if (filters.type) {
          queryParams.type = filters.type;
        }

        // Add calorie range filter
        if (filters.calorieRange) {
          queryParams.calorieRange = filters.calorieRange;
        }

        // Add request status filter
        if (filters.isRequest) {
          queryParams.isRequest = filters.isRequest === "true";
        }

        const response = await GetPanigationMethodWithFilter(
          "meals",
          page,
          pageSize,
          lang,
          searchTerm,
          queryParams,
        );

        console.log("API Response:", response);

        // Handle the response structure based on your API
        if (response && typeof response === "object") {
          // If the response already has the correct structure with nested meals
          if (response.code && response.data?.meals !== undefined) {
            return response;
          }
          // If data is nested under a data property
          else if (response.data && response.data.code) {
            return response.data;
          }
          // If the response has meals array directly in data
          else if (response.data && Array.isArray(response.data)) {
            return {
              code: 200,
              message: "Meals found successfully",
              data: {
                meals: response.data,
                statistics: {
                  active: 0,
                  inActive: 0,
                  requests: 0,
                },
              },
              totalPages: response.totalPages,
              totalItems: response.totalItems,
            };
          }
          // If response has a different structure
          else if (response.response && response.response.data) {
            return response.response.data;
          }
        }

        throw new Error("Invalid API response structure");
      } catch (error: any) {
        console.error("Error fetching meals:", error);
        throw error;
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

  // Accept meal request function
  const handleAcceptRequest = async (mealId: number) => {
    try {
      setProcessingRequest(mealId);

      const response = await PatchMethod(`meals/accept`, mealId, lang);

      if (response?.code === 200) {
        toast.success(
          typeof response.message === "string"
            ? response.message
            : response.message?.english ||
                t("meal_request_accepted_successfully"),
        );

        // Invalidate and refetch meals to update the table
        queryClient.invalidateQueries({ queryKey: ["meals"] });
      } else {
        toast.error(
          typeof response?.message === "string"
            ? response.message
            : response?.message?.english || t("failed_to_accept_meal_request"),
        );
      }
    } catch (error: any) {
      // Handle error response
      if (error.response?.data?.message) {
        toast.error(
          typeof error.response.data.message === "string"
            ? error.response.data.message
            : error.response.data.message.english,
        );
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(t("failed_to_accept_meal_request"));
      }
    } finally {
      setProcessingRequest(null);
    }
  };

  // Reject meal request function
  const handleRejectRequest = async (mealId: number) => {
    try {
      setProcessingRequest(mealId);

      const response = await DeleteMethod(`/meals/refuse`, mealId, lang);

      if (response?.code === 200) {
        toast.success(
          typeof response.message === "string"
            ? response.message
            : response.message?.english ||
                t("meal_request_rejected_successfully"),
        );

        // Invalidate and refetch meals to update the table
        queryClient.invalidateQueries({ queryKey: ["meals"] });
      } else {
        toast.error(
          typeof response?.message === "string"
            ? response.message
            : response?.message?.english || t("failed_to_reject_meal_request"),
        );
      }
    } catch (error: any) {
      // Handle error response
      if (error.response?.data?.message) {
        toast.error(
          typeof error.response.data.message === "string"
            ? error.response.data.message
            : error.response.data.message.english,
        );
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(t("failed_to_reject_meal_request"));
      }
    } finally {
      setProcessingRequest(null);
    }
  };

  // Deactivate meal function
  const handleDeactivateMeal = async (mealId: number) => {
    try {
      const response = await DeleteMethod("meals/deActivate", mealId, lang);

      if (response?.code === 200) {
        toast.success(
          typeof response.message === "string"
            ? response.message
            : response.message?.english || t("meal_deactivated_successfully"),
        );

        // Invalidate and refetch meals to update the table
        queryClient.invalidateQueries({ queryKey: ["meals"] });
      } else {
        toast.error(
          typeof response?.message === "string"
            ? response.message
            : response?.message?.english || t("failed_to_deactivate_meal"),
        );
      }
    } catch (error: any) {
      // Handle error response
      if (error.response?.data?.message) {
        toast.error(
          typeof error.response.data.message === "string"
            ? error.response.data.message
            : error.response.data.message.english,
        );
      } else if (error.message) {
        toast.error(error.message);
      }
    }
  };

  // Activate meal function
  const handleActivateMeal = async (mealId: number) => {
    try {
      const response = await PatchMethod("meals/activate", mealId, lang);

      if (response?.code === 200) {
        toast.success(
          typeof response.message === "string"
            ? response.message
            : response.message?.english || t("meal_activated_successfully"),
        );

        // Invalidate and refetch meals to update the table
        queryClient.invalidateQueries({ queryKey: ["meals"] });
      } else {
        toast.error(
          typeof response?.message === "string"
            ? response.message
            : response?.message?.english || t("failed_to_activate_meal"),
        );
      }
    } catch (error: any) {
      // Handle error response
      if (error.response?.data?.message) {
        toast.error(
          typeof error.response.data.message === "string"
            ? error.response.data.message
            : error.response.data.message.english,
        );
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(t("failed_to_activate_meal"));
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

  // Define filter configuration for meals
  const filterConfig = [
    {
      key: "type",
      label: t("Meal Type"),
      type: "select",
      placeholder: t("All Types"),
      options: [
        { value: "BREAKFAST", label: t("Breakfast") },
        { value: "LAUNCH", label: t("Lunch") },
        { value: "DINNER", label: t("Dinner") },
        { value: "SNACK", label: t("Snack") },
        { value: "OTHER", label: t("Other") },
      ],
    },
    {
      key: "calorieRange",
      label: t("Calorie Range"),
      type: "select",
      placeholder: t("Any Calories"),
      options: [
        { value: "LOW", label: t("Low (0-300)") },
        { value: "MEDIUM", label: t("Medium (301-600)") },
        { value: "HIGH", label: t("High (601+)") },
      ],
    },
    {
      key: "isRequest",
      label: t("Request Status"),
      type: "select",
      placeholder: t("All Statuses"),
      options: [
        { value: "true", label: t("Requested") },
        { value: "false", label: t("Standard") },
      ],
    },
  ];

  const columns: ColumnDef<Meal>[] = [
    {
      id: "actions",
      cell: ({ row }) => {
        const meal = row.original;
        const isProcessing = processingRequest === meal.id;

        return (
          <div className="flex flex-row gap-2 items-center justify-center">
            {/* Action buttons for requested meals */}
            {meal.isRequest && (
              <>
                <Button
                  onClick={() => handleAcceptRequest(meal.id)}
                  disabled={isProcessing}
                  size="sm"
                  className={`
                    bg-green-500 dark:bg-green-600 
                    hover:bg-green-600 dark:hover:bg-green-700 
                    text-white
                    border-0 font-medium px-3 py-1.5 h-auto
                    transition-all duration-300
                    ${isProcessing ? "opacity-70 cursor-not-allowed" : ""}
                  `}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs">{t("Processing")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Icon icon="heroicons:check" className="h-3.5 w-3.5" />
                      <span className="text-xs">{t("Accept")}</span>
                    </div>
                  )}
                </Button>

                <Button
                  onClick={() => handleRejectRequest(meal.id)}
                  disabled={isProcessing}
                  size="sm"
                  variant="destructive"
                  className={`
                    px-3 py-1.5 h-auto font-medium
                    transition-all duration-300
                    ${isProcessing ? "opacity-70 cursor-not-allowed" : ""}
                  `}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs">{t("Processing")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Icon icon="heroicons:x-mark" className="h-3.5 w-3.5" />
                      <span className="text-xs">{t("Reject")}</span>
                    </div>
                  )}
                </Button>
              </>
            )}

            {/* Standard action buttons for non-request meals */}
            {!meal.isRequest && (
              <>
                <Link href={`/${lang}/meals/${meal.id}/edit`}>
                  <Button
                    size="icon"
                    variant="outline"
                    className="
                      h-8 w-8 
                      border-[#25235F]/20 dark:border-blue-400/30 
                      hover:border-[#25235F] dark:hover:border-blue-500 
                      hover:bg-[#25235F] dark:hover:bg-blue-600 
                      hover:text-white 
                      transition-all duration-300 
                      shadow-md hover:shadow-lg
                      bg-white dark:bg-gray-800
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    <Icon icon="heroicons:pencil" className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <ActivationConfirmationDialog
                  onConfirm={() =>
                    meal.status === "active"
                      ? handleDeactivateMeal(meal.id)
                      : handleActivateMeal(meal.id)
                  }
                  currentStatus={meal.status === "active"}
                  title={
                    meal.status === "active"
                      ? t("Deactivate Meal")
                      : t("Activate Meal")
                  }
                  description={
                    meal.status === "active"
                      ? t(
                          "Are you sure you want to deactivate this meal? It will be hidden from users",
                        )
                      : t(
                          "Are you sure you want to activate this meal? It will be visible to users",
                        )
                  }
                  confirmText={
                    meal.status === "active" ? t("Deactivate") : t("Activate")
                  }
                  itemName={t("meal")}
                  destructive={meal.status === "active"}
                  icon={
                    meal.status === "active"
                      ? "heroicons:power"
                      : "heroicons:check-circle"
                  }
                />
              </>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "image",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Meal Image")}
          className="text-[#25235F] dark:text-blue-300 font-bold"
        />
      ),
      cell: ({ row }) => {
        // Handle both full URLs and relative paths
        const imageUrl = row.original.image.startsWith("http")
          ? row.original.image
          : process.env.NEXT_PUBLIC_API_URL + row.original.image;

        return (
          <ImageCell
            image={imageUrl}
            alt={row.original.type}
            size="md"
            shape="circle"
            baseUrl=""
            showZoom={true}
          />
        );
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Meal Type")}
          className="text-[#25235F] dark:text-blue-300 font-bold"
        />
      ),
      cell: ({ row }) => {
        const mealTypeColors = {
          BREAKFAST:
            "bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white shadow-lg shadow-amber-200 dark:shadow-amber-900/30",
          LUNCH:
            "bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white shadow-lg shadow-green-200 dark:shadow-green-900/30",
          DINNER:
            "bg-gradient-to-r from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30",
          SNACK:
            "bg-gradient-to-r from-purple-500 to-violet-600 dark:from-purple-600 dark:to-violet-700 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/30",
          OTHER:
            "bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-600 dark:to-gray-800 text-white shadow-lg shadow-gray-200 dark:shadow-gray-900/30",
        };

        const defaultStyle =
          "bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-600 dark:to-gray-800 text-white shadow-lg shadow-gray-200 dark:shadow-gray-900/30";

        return (
          <div className="flex overflow-hidden items-center justify-center">
            <Badge
              className={`
                relative
                text-center font-semibold px-4 py-2 rounded-full 
                border-0 min-w-[100px] transition-all duration-300
                hover:scale-105 hover:shadow-xl
                group cursor-pointer
                ${
                  mealTypeColors[
                    row.original.type as keyof typeof mealTypeColors
                  ] || defaultStyle
                }
              `}
            >
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-300" />
              <span className="relative z-10 text-sm tracking-wide drop-shadow-sm">
                {t(row.original.type)}
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "mealItems",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Meal Items")}
          className="text-[#25235F] dark:text-blue-300 font-bold"
        />
      ),
      cell: ({ row }) => {
        const mealItems = row.original.mealItem || [];

        if (mealItems.length === 0) {
          return (
            <EnhancedReadMoreItems
              description={t("No meal items available")}
              icon="heroicons:clipboard-document-list"
              maxLength={50}
              maxWidth="250px"
              variant="compact"
            />
          );
        }

        return (
          <div className="space-y-1 max-w-[250px]">
            {mealItems.map((item, index) => (
              <div key={item.id || index} className="flex items-start gap-2">
                <Icon
                  icon="heroicons:check-badge"
                  className="h-3 w-3 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {lang == "en"
                    ? item.description.english
                    : item.description.arabic}
                </span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "totalCalory",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Total Calories")}
          className="text-[#25235F] dark:text-blue-300 font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-start gap-2">
          <Icon
            icon="heroicons:fire"
            className="h-4 w-4 text-red-500 dark:text-red-400"
          />
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {row.original.totalCalory} kcal
          </span>
        </div>
      ),
    },
    {
      accessorKey: "nutrition",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Nutrition")}
          className="text-[#25235F] dark:text-blue-300 font-bold"
        />
      ),
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    Protein:
                  </span>
                  <span className="text-gray-800 dark:text-gray-300">
                    {row.original.proteins}g
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-orange-600 dark:text-orange-400 font-medium">
                    Fat:
                  </span>
                  <span className="text-gray-800 dark:text-gray-300">
                    {row.original.fat}g
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    Carbs:
                  </span>
                  <span className="text-gray-800 dark:text-gray-300">
                    {row.original.carp}g
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="
                max-w-xs 
                bg-gray-900 dark:bg-gray-800 
                text-white dark:text-gray-100 
                border border-gray-700 dark:border-gray-600
              "
            >
              <div className="space-y-2">
                <p className="font-semibold">{t("Nutritional Information")}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <span className="text-blue-400">Protein:</span>
                  <span>{row.original.proteins}g</span>
                  <span className="text-orange-400">Fat:</span>
                  <span>{row.original.fat}g</span>
                  <span className="text-green-400">Carbs:</span>
                  <span>{row.original.carp}g</span>
                  <span className="text-red-400">Total Calories:</span>
                  <span>{row.original.totalCalory} kcal</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "isRequest",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Request Status")}
          className="text-[#25235F] dark:text-blue-300 font-bold"
        />
      ),
      cell: ({ row }) => {
        const isRequest = row.original.isRequest;

        const statusConfig = {
          true: {
            gradient:
              "bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700",
            shadow: "shadow-lg shadow-purple-200 dark:shadow-purple-900/30",
            icon: "heroicons:clock",
            label: t("Requested"),
            badgeClass: "animate-pulse",
          },
          false: {
            gradient:
              "bg-gradient-to-r from-gray-500 to-slate-600 dark:from-gray-600 dark:to-slate-700",
            shadow: "shadow-lg shadow-gray-200 dark:shadow-gray-900/30",
            icon: "heroicons:check",
            label: t("Standard"),
            badgeClass: "",
          },
        };

        const config = isRequest ? statusConfig.true : statusConfig.false;

        return (
          <>
            <div className="flex  overflow-hidden items-center justify-center">
              <Badge
                className={`
                group relative
                flex items-center gap-2
                text-center font-semibold px-4 py-2 rounded-full 
                border-0 min-w-[100px] transition-all duration-300
                hover:scale-105 hover:shadow-xl
                ${config.gradient} ${config.shadow} ${config.badgeClass}
                text-white
              `}
              >
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-300" />
                <Icon
                  icon={config.icon}
                  className="h-3 w-3 transition-transform group-hover:scale-110"
                />
                <span className="relative z-10 text-sm tracking-wide drop-shadow-sm">
                  {config.label}
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Badge>
            </div>
            {isRequest && (
              <div className="relative block z-10 text-sm tracking-wide drop-shadow-sm">
                by {row.original.requestedBy.name}
              </div>
            )}
          </>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Status")}
          className="text-[#25235F] dark:text-blue-300 font-bold"
        />
      ),
      cell: ({ row }) => {
        const status = row.original.status;

        const statusConfig = {
          active: {
            gradient:
              "bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700",
            shadow: "shadow-lg shadow-green-200 dark:shadow-green-900/30",
            icon: "heroicons:check-circle",
            label: t("Active"),
          },
          in_active: {
            gradient:
              "bg-gradient-to-r from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700",
            shadow: "shadow-lg shadow-red-200 dark:shadow-red-900/30",
            icon: "heroicons:minus-circle",
            label: t("Inactive"),
          },
        };

        const config =
          statusConfig[status as keyof typeof statusConfig] ||
          statusConfig.in_active;

        return (
          <div className="flex  overflow-hidden items-center justify-center">
            <Badge
              className={`
            group relative
            flex items-center gap-2
            text-center font-semibold px-4 py-2 rounded-full 
            border-0 min-w-[100px] transition-all duration-300
            hover:scale-105 hover:shadow-xl
            ${config.gradient} ${config.shadow}
            text-white
          `}
            >
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-300" />
              <Icon
                icon={config.icon}
                className="h-3 w-3 transition-transform group-hover:scale-110"
              />
              <span className="relative z-10 text-sm tracking-wide drop-shadow-sm">
                {config.label}
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Created Date")}
          className="text-[#25235F] dark:text-blue-300 font-bold"
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return (
          <div className="flex items-center justify-start gap-2">
            <Icon
              icon="heroicons:calendar"
              className="h-4 w-4 text-[#25235F] dark:text-blue-400"
            />
            <span className="max-w-[120px] truncate text-sm font-medium text-gray-700 dark:text-gray-300">
              {formattedDate}
            </span>
          </div>
        );
      },
    },
  ];

  // Memoized data for the table - fixed to use apiResponse.data.meals
  const tableData = useMemo(() => {
    return apiResponse?.data?.meals || [];
  }, [apiResponse]);

  // Calculate total items - use the totalItems from API response
  const totalItems = useMemo(() => {
    return apiResponse?.totalItems || apiResponse?.data?.meals?.length || 0;
  }, [apiResponse]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Banner */}
      {apiResponse?.data?.statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{t("Active Meals")}</p>
                <p className="text-2xl font-bold">
                  {apiResponse.data.statistics.active}
                </p>
              </div>
              <Icon
                icon="heroicons:check-circle"
                className="h-8 w-8 opacity-80"
              />
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-500 to-slate-600 dark:from-gray-600 dark:to-slate-700 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{t("Inactive Meals")}</p>
                <p className="text-2xl font-bold">
                  {apiResponse.data.statistics.inActive}
                </p>
              </div>
              <Icon
                icon="heroicons:minus-circle"
                className="h-8 w-8 opacity-80"
              />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{t("Meal Requests")}</p>
                <p className="text-2xl font-bold">
                  {apiResponse.data.statistics.requests}
                </p>
              </div>
              <Icon icon="heroicons:clock" className="h-8 w-8 opacity-80" />
            </div>
          </div>
        </div>
      )}

      {/* Generic Filter Component */}
      <GenericFilter
        filters={filterConfig}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        initialFilters={filters}
      />

      <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <DataTable
          data={tableData}
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
      </div>
    </div>
  );
});

MealTable.displayName = "MealTable";

export default MealTable;
