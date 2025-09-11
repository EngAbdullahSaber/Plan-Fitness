"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { blogData } from ".";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../tables/advanced/components/data-table-column-header";
import { DataTable } from "../tables/advanced/components/data-table";
import DeleteConfirmationDialog from "../shared/DeleteConfirmationDialog";
import Link from "next/link";
import { useState, useMemo } from "react";
import GenericFilter, { FilterOption } from "../shared/GenericFilter";
import { useTranslate } from "@/config/useTranslation";
import BlogDetailsModal from "./BlogDetailsModal";

interface Blog {
  id: string;
  title: string;
  author: string;
  category: string;
  status: string;
  publishDate: string;
  describtion: string;
}

const BlogTable = () => {
  const { t } = useTranslate();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Blog | null>(null);

  const handleViewMember = (member: Blog) => {
    setSelectedMember(member);
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
    () => Array.from(new Set(blogData.map((item) => item.status))),
    []
  );
  const categoryOptions = useMemo(
    () => Array.from(new Set(blogData.map((item) => item.category))),
    []
  );

  // Define filter configuration
  const filterConfig: FilterOption[] = [
    {
      key: "search",
      label: t("Search"),
      type: "text",
      placeholder: t("Search by title, author..."),
    },
    {
      key: "status",
      label: t("Status"),
      type: "select",
      placeholder: t("All Statuses"),
      options: statusOptions.map((status) => ({
        value: status,
        label: status,
      })),
    },
    {
      key: "category",
      label: t("Category"),
      type: "select",
      placeholder: t("All Categories"),
      options: categoryOptions.map((category) => ({
        value: category,
        label: category,
      })),
    },
  ];

  const columns: ColumnDef<Blog>[] = [
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-3 items-center justify-center">
          <Button
            size="icon"
            onClick={() => handleViewMember(row.original)}
            variant="outline"
            className="h-9 w-9 border-[#25235F]/20 hover:border-[#25235F] hover:bg-[#25235F] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Icon icon="carbon:view" className="h-4 w-4" />
          </Button>
          <Link href={`/blogs/${row.original.id}/edit`}>
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
              console.log(`Deleting blog: ${row.original.title}`)
            }
            title={t("Delete Blog Post")}
            description={t(
              "Are you sure you want to delete this blog post? This action cannot be undone"
            )}
            confirmText={t("Delete")}
            itemName={t("blog post")}
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
          title={t("ID")}
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
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Blog Title")}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#25235F]/10 to-[#ED4135]/10 flex items-center justify-center">
              <Icon
                icon="heroicons:document-text"
                className="h-5 w-5 text-[#25235F]"
              />
            </div>
            <div className="flex flex-col">
              <span className="max-w-[200px] truncate font-semibold text-gray-800 hover:text-[#25235F] transition-colors duration-200">
                {row.original.title}
              </span>
              <span className="text-xs text-gray-500">
                {t("by")} {row.original.author}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "describtion",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Blog describtion")}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#25235F]/10 to-[#ED4135]/10 flex items-center justify-center">
              <Icon
                icon="heroicons:document-text"
                className="h-5 w-5 text-[#25235F]"
              />
            </div>
            <div className="flex flex-col">
              <span className="max-w-[200px] truncate font-semibold text-gray-800 hover:text-[#25235F] transition-colors duration-200">
                {row.original.describtion}
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
          title={t("Category")}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        const categoryColors = {
          fitness: "bg-gradient-to-r from-green-500 to-green-600 text-white",
          nutrition: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
          lifestyle:
            "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
          training: "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
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
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Status")}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        const statusColors = {
          published: "bg-gradient-to-r from-green-500 to-green-600 text-white",
          draft: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
          archived: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
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
    },
    {
      accessorKey: "publishDate",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Publish Date")}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-start gap-2">
            <Icon
              icon="heroicons:calendar"
              className="h-4 w-4 text-[#25235F]"
            />
            <span className="max-w-[120px] truncate text-sm font-medium text-gray-700">
              {row.original.publishDate}
            </span>
          </div>
        );
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
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#25235F] hover:text-[#ED4135] hover:bg-[#25235F]/10 transition-all duration-300"
          >
            <Icon icon="heroicons:arrow-path" className="h-4 w-4 mr-2" />
            {t("Refresh Data")}
          </Button>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden bg-white">
        <DataTable data={blogData} columns={columns} />
        {selectedMember && (
          <BlogDetailsModal
            blog={selectedMember}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default BlogTable;
