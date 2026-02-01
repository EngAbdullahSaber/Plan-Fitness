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
} from "@/app/services/apis/ApiMethod";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { forwardRef, useImperativeHandle } from "react";
import GenericFilter from "../shared/GenericFilter";
import { ApiResponse, Blog } from "./types";
import { usePaginatedSelect } from "@/hooks/usePaginatedSelect";
import { ImageCell } from "../shared/ImageCell";
import { DescriptionCell } from "../shared/EnhancedReadMoreCell";

interface Category {
  id: number;
  name: string;
  nameAr: string;
}

const BlogTable = forwardRef(({ t }: { t: any }, ref) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { lang } = useParams();
  const queryClient = useQueryClient();

  // In your BlogTable component, update the categoriesPaginated section:
  const categoriesPaginated = usePaginatedSelect({
    fetchFunction: async (page, pageSize, search = "") => {
      console.log(
        `Fetching categories page ${page}, size ${pageSize}, search: "${search}"`,
      );
      const response = await GetPanigationMethod(
        "category",
        page,
        pageSize,
        lang,
        search, // Pass search term to API
      );
      console.log("Categories API response:", response);
      return response.data || response;
    },
    transformData: (data) => {
      console.log("Transforming data:", data);
      const items = data.data || data.items || data || [];
      const transformed = items.map((category: any) => ({
        value: category.id.toString(),
        label: lang === "ar" ? category.name.arabic : category.name.english,
      }));
      console.log("Transformed categories:", transformed);
      return transformed;
    },
  });
  // React Query for blogs data fetching
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<ApiResponse, Error>({
    queryKey: ["blogs", page, pageSize, searchTerm, lang, filters],
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

        // Add status filter
        if (filters.status) {
          queryParams.status = filters.status;
        }

        const response = await GetPanigationMethodWithFilter(
          "blog",
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

        return finalData;
      } catch (error: any) {
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

  // Delete blog function
  const handleDeleteBlog = async (blogId: number, blogTitle: string) => {
    try {
      const response = await DeleteMethod("blog", blogId, lang);

      if (response?.code === 200) {
        toast.success(response.message || t("blog_deleted_successfully"));

        // Invalidate and refetch blogs to update the table
        queryClient.invalidateQueries({ queryKey: ["blogs"] });
      } else {
        toast.error(response?.message || t("failed_to_delete_blog"));
      }
    } catch (error: any) {
      // Handle error response
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(t("failed_to_delete_blog"));
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

  // Define filter configuration
  const filterConfig: FilterOption[] = [
    {
      key: "category",
      label: t("Category"),
      type: "selectPagination",
      placeholder: t("All Categories"),
      options: categoriesPaginated.options,
      isLoading: categoriesPaginated.isLoading,
      hasMore: categoriesPaginated.hasMore,
      onLoadMore: categoriesPaginated.loadMore,
      onSearch: categoriesPaginated.handleSearch, // Add search handler
      onOpen: categoriesPaginated.loadInitial,
      searchPlaceholder: t("Search categories"), // Optional: custom search placeholder
    },
    {
      key: "status",
      label: t("Status"),
      type: "select",
      placeholder: t("All Statuses"),
      options: [
        { value: "ACTIVE", label: t("ACTIVE") },
        { value: "ARCHIVED", label: t("ARCHIVED") },
      ],
    },
  ];

  const columns: ColumnDef<Blog>[] = [
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-3 items-center justify-center">
          <Link href={`/${lang}/blogs/${row.original.id}/edit`}>
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 border-[#25235F]/20 hover:border-[#25235F] hover:bg-[#25235F] hover:text-white 
                         dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-blue-600 
                         transition-all duration-300 shadow-md hover:shadow-lg 
                         dark:shadow-gray-800 dark:hover:shadow-blue-900/30 
                         transform hover:scale-105"
            >
              <Icon icon="heroicons:pencil" className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteConfirmationDialog
            onConfirm={() =>
              handleDeleteBlog(row.original.id, row.original.title)
            }
            title={t("Delete Blog Post")}
            description={t("Are you sure you want to delete this blog post?")}
            confirmText={t("Delete")}
            itemName={t("blog post")}
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
          title={t("Blog Title")}
          className="text-[#25235F] dark:text-gray-200 font-bold transition-colors duration-300"
        />
      ),
      cell: ({ row }) => {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full 
                                 bg-gradient-to-r from-[#25235F]/10 to-[#ED4135]/10 
                                 dark:from-blue-500/20 dark:to-purple-500/20 
                                 flex items-center justify-center transition-colors duration-300"
                  >
                    <Icon
                      icon="heroicons:document-text"
                      className="h-5 w-5 text-[#25235F] dark:text-blue-400 transition-colors duration-300"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="max-w-[200px] truncate font-semibold 
                                     text-gray-800 dark:text-gray-200 
                                     hover:text-[#25235F] dark:hover:text-blue-400 
                                     transition-colors duration-200"
                    >
                      {lang == "en"
                        ? row.original.title.english
                        : row.original.title.arabic}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      {t("by")} {row.original.CreatedUser.name}
                    </span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent
                className="max-w-md 
                                         bg-white dark:bg-gray-800 
                                         border-gray-200 dark:border-gray-700 
                                         text-gray-900 dark:text-gray-100 
                                         transition-colors duration-300"
              >
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
          className="text-[#25235F] dark:text-gray-200 font-bold transition-colors duration-300"
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
          variant="default"
        />
      ),
    },
    {
      accessorKey: "image",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Image")}
          className="text-[#25235F] dark:text-gray-200 font-bold transition-colors duration-300"
        />
      ),
      cell: ({ row }) => (
        <ImageCell
          image={`${process.env.NEXT_PUBLIC_API_URL}${row.original.image}`}
          alt={row.original.title.english || row.original.name}
          size="md"
          shape="circle"
          baseUrl={process.env.NEXT_PUBLIC_API_URL}
          showZoom={true}
        />
      ),
    },
    {
      accessorKey: "Category.name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Category")}
          className="text-[#25235F] dark:text-gray-200 font-bold transition-colors duration-300"
        />
      ),
      cell: ({ row }) => {
        const categoryColors = {
          // Your existing categories with dark mode variants
          "name 1": {
            light:
              "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200",
            dark: "bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg shadow-green-900/50",
          },
          fitness: {
            light:
              "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200",
            dark: "bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg shadow-green-900/50",
          },
          nutrition: {
            light:
              "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-200",
            dark: "bg-gradient-to-r from-blue-600 to-cyan-700 text-white shadow-lg shadow-blue-900/50",
          },
          lifestyle: {
            light:
              "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-200",
            dark: "bg-gradient-to-r from-purple-600 to-violet-700 text-white shadow-lg shadow-purple-900/50",
          },
          training: {
            light:
              "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-200",
            dark: "bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-lg shadow-amber-900/50",
          },

          // Additional common categories with beautiful gradients for both modes
          technology: {
            light:
              "bg-gradient-to-r from-slate-600 to-slate-800 text-white shadow-lg shadow-slate-200",
            dark: "bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg shadow-slate-900/50",
          },
          business: {
            light:
              "bg-gradient-to-r from-indigo-500 to-blue-700 text-white shadow-lg shadow-indigo-200",
            dark: "bg-gradient-to-r from-indigo-600 to-blue-800 text-white shadow-lg shadow-indigo-900/50",
          },
          education: {
            light:
              "bg-gradient-to-r from-teal-500 to-teal-700 text-white shadow-lg shadow-teal-200",
            dark: "bg-gradient-to-r from-teal-600 to-teal-800 text-white shadow-lg shadow-teal-900/50",
          },
          health: {
            light:
              "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-200",
            dark: "bg-gradient-to-r from-rose-600 to-pink-700 text-white shadow-lg shadow-rose-900/50",
          },
          travel: {
            light:
              "bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-200",
            dark: "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-900/50",
          },
          food: {
            light:
              "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200",
            dark: "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-900/50",
          },
          fashion: {
            light:
              "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-fuchsia-200",
            dark: "bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white shadow-lg shadow-fuchsia-900/50",
          },
          sports: {
            light:
              "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200",
            dark: "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50",
          },
          art: {
            light:
              "bg-gradient-to-r from-violet-500 to-purple-700 text-white shadow-lg shadow-violet-200",
            dark: "bg-gradient-to-r from-violet-600 to-purple-800 text-white shadow-lg shadow-violet-900/50",
          },
          music: {
            light:
              "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200",
            dark: "bg-gradient-to-r from-pink-600 to-rose-700 text-white shadow-lg shadow-pink-900/50",
          },
        };

        const categoryName =
          lang == "en"
            ? row.original.Category?.name?.english
            : row.original.Category?.name?.arabic;
        const categoryConfig =
          categoryColors[categoryName as keyof typeof categoryColors];
        const defaultStyle = {
          light:
            "bg-gradient-to-r from-gray-500 to-gray-700 text-white shadow-lg shadow-gray-200",
          dark: "bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-lg shadow-gray-900/50",
        };

        return (
          <div className="flex  overflow-hidden items-center justify-center">
            <Badge
              className={`
            relative
            text-center font-semibold px-4 py-2 rounded-full 
            border-0 min-w-[80px] transition-all duration-300
            hover:scale-105 hover:shadow-xl
            group cursor-pointer
            ${categoryConfig?.light || defaultStyle.light}
            dark:${categoryConfig?.dark || defaultStyle.dark}
          `}
            >
              {/* Animated background effect */}
              <div
                className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 
                            dark:bg-gray-900 dark:group-hover:opacity-30 transition-opacity duration-300"
              />

              {/* Text with smooth transition */}
              <span className="relative z-10 text-sm tracking-wide drop-shadow-sm">
                {categoryName}
              </span>

              {/* Shine effect on hover */}
              <div
                className="absolute inset-0 rounded-full 
                            bg-gradient-to-r from-transparent via-white/30 to-transparent 
                            dark:via-white/20 -skew-x-12 transform translate-x-[-100%] 
                            group-hover:translate-x-[100%] transition-transform duration-1000"
              />
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Status")}
          className="text-[#25235F] dark:text-gray-200 font-bold transition-colors duration-300"
        />
      ),
      cell: ({ row }) => {
        // Determine status based on deletedAt field
        const status = row.original.status;

        const statusConfig = {
          ACTIVE: {
            light: {
              gradient: "bg-gradient-to-r from-emerald-500 to-green-600",
              shadow: "shadow-lg shadow-emerald-200",
              pulse: "bg-emerald-400",
              glow: "ring-2 ring-emerald-200",
            },
            dark: {
              gradient: "bg-gradient-to-r from-emerald-600 to-green-700",
              shadow: "shadow-lg shadow-emerald-900/50",
              pulse: "bg-emerald-500",
              glow: "ring-2 ring-emerald-800",
            },
            icon: "heroicons:check-circle",
          },
          ARCHIVED: {
            light: {
              gradient: "bg-gradient-to-r from-rose-500 to-red-600",
              shadow: "shadow-lg shadow-rose-200",
              pulse: "bg-rose-400",
              glow: "ring-2 ring-rose-200",
            },
            dark: {
              gradient: "bg-gradient-to-r from-rose-600 to-red-700",
              shadow: "shadow-lg shadow-rose-900/50",
              pulse: "bg-rose-500",
              glow: "ring-2 ring-rose-800",
            },
            icon: "heroicons:archive-box",
          },
          PENDING: {
            light: {
              gradient: "bg-gradient-to-r from-amber-500 to-orange-600",
              shadow: "shadow-lg shadow-amber-200",
              pulse: "bg-amber-400",
              glow: "ring-2 ring-amber-200",
            },
            dark: {
              gradient: "bg-gradient-to-r from-amber-600 to-orange-700",
              shadow: "shadow-lg shadow-amber-900/50",
              pulse: "bg-amber-500",
              glow: "ring-2 ring-amber-800",
            },
            icon: "heroicons:clock",
          },
          DRAFT: {
            light: {
              gradient: "bg-gradient-to-r from-slate-500 to-gray-600",
              shadow: "shadow-lg shadow-slate-200",
              pulse: "bg-slate-400",
              glow: "ring-2 ring-slate-200",
            },
            dark: {
              gradient: "bg-gradient-to-r from-slate-600 to-gray-700",
              shadow: "shadow-lg shadow-slate-900/50",
              pulse: "bg-slate-500",
              glow: "ring-2 ring-slate-800",
            },
            icon: "heroicons:document",
          },
          INACTIVE: {
            light: {
              gradient: "bg-gradient-to-r from-gray-500 to-slate-600",
              shadow: "shadow-lg shadow-gray-200",
              pulse: "bg-gray-400",
              glow: "ring-2 ring-gray-200",
            },
            dark: {
              gradient: "bg-gradient-to-r from-gray-600 to-slate-700",
              shadow: "shadow-lg shadow-gray-900/50",
              pulse: "bg-gray-500",
              glow: "ring-2 ring-gray-800",
            },
            icon: "heroicons:pause-circle",
          },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || {
          light: {
            gradient: "bg-gradient-to-r from-gray-500 to-gray-600",
            shadow: "shadow-lg shadow-gray-200",
            pulse: "bg-gray-400",
            glow: "ring-2 ring-gray-200",
          },
          dark: {
            gradient: "bg-gradient-to-r from-gray-600 to-gray-700",
            shadow: "shadow-lg shadow-gray-900/50",
            pulse: "bg-gray-500",
            glow: "ring-2 ring-gray-800",
          },
          icon: "heroicons:question-mark-circle",
        };

        return (
          <div className="flex  overflow-hidden items-center justify-center">
            <Badge
              className={`
            group relative
            flex items-center gap-2
            text-center font-semibold px-4 py-2 rounded-full 
            border-0 min-w-[100px] transition-all duration-300
            hover:scale-105 hover:shadow-xl
            ${config.light.gradient} ${config.light.shadow} ${config.light.glow}
            dark:${config.dark.gradient} dark:${config.dark.shadow} dark:${config.dark.glow}
            text-white
          `}
            >
              {/* Animated background effect */}
              <div
                className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 
                            dark:bg-gray-900 dark:group-hover:opacity-30 transition-opacity duration-300"
              />

              {/* Status icon */}
              <Icon
                icon={config.icon}
                className="h-3 w-3 transition-transform group-hover:scale-110"
              />

              {/* Status text */}
              <span className="relative z-10 text-sm tracking-wide drop-shadow-sm">
                {t(status)}
              </span>

              {/* Pulse animation for active status */}
              {status === "ACTIVE" && (
                <div
                  className={`absolute -top-0.5 -right-0.5 w-2 h-2 ${config.light.pulse} 
                           dark:${config.dark.pulse} rounded-full animate-ping`}
                />
              )}

              {/* Static indicator dot */}
              <div
                className={`absolute -top-0.5 -right-0.5 w-2 h-2 ${config.light.pulse} 
                         dark:${config.dark.pulse} rounded-full border border-white`}
              />

              {/* Shine effect on hover */}
              <div
                className="absolute inset-0 rounded-full 
                            bg-gradient-to-r from-transparent via-white/30 to-transparent 
                            dark:via-white/20 -skew-x-12 transform translate-x-[-100%] 
                            group-hover:translate-x-[100%] transition-transform duration-1000"
              />
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
          className="text-[#25235F] dark:text-gray-200 font-bold transition-colors duration-300"
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
              className="h-4 w-4 text-[#25235F] dark:text-blue-400 transition-colors duration-300"
            />
            <span
              className="max-w-[120px] truncate text-sm font-medium 
                           text-gray-700 dark:text-gray-300 transition-colors duration-300"
            >
              {formattedDate}
            </span>
          </div>
        );
      },
    },
  ];

  // Memoized data for the table - with proper null checks
  const tableData = useMemo(() => {
    const data = apiResponse?.data || [];
    return data;
  }, [apiResponse]);

  const totalItems = apiResponse?.totalItems || 0;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page when searching
  };

  return (
    <div className="space-y-6">
      {/* Generic Filter Component */}
      <GenericFilter
        filters={filterConfig}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        initialFilters={filters}
      />

      <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300">
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

BlogTable.displayName = "BlogTable";

export default BlogTable;
