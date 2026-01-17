"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../tables/advanced/components/data-table-column-header";
import { DataTable } from "../tables/advanced/components/data-table";
import DeleteConfirmationDialog from "../shared/DeleteConfirmationDialog";
import Link from "next/link";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  GetPanigationMethod,
  DeleteMethod,
} from "@/app/services/apis/ApiMethod";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import React, { forwardRef, useImperativeHandle } from "react";
import { ApiResponse, Category } from "./types";

const CategoryTable = forwardRef(({ t }: { t: any }, ref) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { lang } = useParams();
  const queryClient = useQueryClient();

  // React Query for data fetching
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<ApiResponse, Error>({
    queryKey: ["categories", page, pageSize, searchTerm, lang],
    queryFn: async () => {
      try {
        const response = await GetPanigationMethod(
          "category",
          page,
          pageSize,
          lang,
          searchTerm,
        );

        // Handle different response structures with proper type checking
        let finalData;

        if (response && typeof response === "object") {
          // Type guard to check for response structure
          const responseObj = response as any;

          if ("data" in responseObj) {
            // If response has data property (AxiosResponse)
            finalData = responseObj.data;
          } else if (
            "response" in responseObj &&
            responseObj.response &&
            typeof responseObj.response === "object" &&
            "data" in responseObj.response
          ) {
            // If response is nested under response.data
            finalData = responseObj.response.data;
          } else {
            // If response is the data itself
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

  // Delete category function
  const handleDeleteCategory = async (
    categoryId: string,
    categoryName: string,
  ) => {
    try {
      const response = await DeleteMethod("category", categoryId, lang);

      if (response?.code === 200) {
        toast.success(response.message || t("category_deleted_successfully"));

        // Invalidate and refetch categories to update the table
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } else {
        toast.error(response?.message || t("failed_to_delete_category"));
      }
    } catch (error: any) {
      // Handle error response
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(t("failed_to_delete_category"));
      }
    }
  };

  useImperativeHandle(ref, () => ({
    refetch,
  }));
  const columns: ColumnDef<Category>[] = [
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("actions")}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="flex flex-row gap-3 items-center justify-center">
          <Link href={`/${lang}/category/${row.original.id}/edit`}>
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 border-[#25235F]/20 dark:border-gray-600 hover:border-[#25235F] dark:hover:border-white hover:bg-[#25235F] dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Icon icon="heroicons:pencil" className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteConfirmationDialog
            onConfirm={() =>
              handleDeleteCategory(row.original.id, row.original.name)
            }
            title={"delete_category"}
            description={"delete_category_confirmation"}
            confirmText={"delete"}
            cancelText={"cancel"}
            itemName="category"
            destructive={true}
            icon="fluent:delete-48-filled"
          />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("name_english")}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2">
            <Icon
              icon="heroicons:cube"
              className="h-4 w-4 text-[#25235F] dark:text-gray-300"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {row.original.name.english}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "nameAr",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("name_arabic")}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2">
            <Icon
              icon="heroicons:cube"
              className="h-4 w-4 text-[#25235F] dark:text-gray-300"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {row.original.name.arabic}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("created_at")}
          className="text-[#25235F] dark:text-white font-bold"
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
          <div className="flex items-center justify-center gap-2">
            <Icon
              icon="heroicons:calendar"
              className="h-4 w-4 text-[#25235F] dark:text-gray-300"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formattedDate}
            </span>
          </div>
        );
      },
    },
  ];

  // Memoized data for the table - with proper null checks
  const tableData = useMemo(() => {
    const data = (apiResponse as any)?.data || [];
    return data;
  }, [apiResponse]);

  const totalItems = (apiResponse as any)?.totalItems || 0;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page when searching
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/30">
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

export default CategoryTable;
