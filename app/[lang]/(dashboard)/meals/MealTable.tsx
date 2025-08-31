"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../tables/advanced/components/data-table-column-header";
import { DataTable } from "../tables/advanced/components/data-table";
import DeleteConfirmationDialog from "../shared/DeleteConfirmationDialog";
import Link from "next/link";
import { mealData } from ".";

interface Meal {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  status: string;
  price: number;
  featured: boolean;
  ingredients: string[];
}

const MealTable = ({
  searchTerm,
  statusFilter,
  categoryFilter,
}: {
  searchTerm: string;
  statusFilter: string;
  categoryFilter: string;
}) => {
  // Filter data based on search and filters
  const filteredData = mealData.filter((meal) => {
    const matchesSearch =
      meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || meal.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || meal.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const columns: ColumnDef<Meal>[] = [
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-3 items-center justify-center">
          <Link href={`/meals/${row.original.id}/edit`}>
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9 border-[#25235F]/20 hover:border-[#25235F] hover:bg-[#25235F] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Icon icon="heroicons:pencil" className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteConfirmationDialog
            onConfirm={() => console.log(`Deleting meal: ${row.original.name}`)}
            title="Delete Meal"
            description="Are you sure you want to delete this meal? This action cannot be undone."
            confirmText="Delete"
            itemName="meal"
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
          title={"Meal Name"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#25235F]/10 to-[#ED4135]/10 flex items-center justify-center">
              <Icon icon="heroicons:heart" className="h-5 w-5 text-[#25235F]" />
            </div>
            <div className="flex flex-col">
              <span className="max-w-[200px] truncate font-semibold text-gray-800 hover:text-[#25235F] transition-colors duration-200">
                {row.original.name}
              </span>
              <span className="text-xs text-gray-500">
                {row.original.ingredients.slice(0, 2).join(", ")}...
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
          breakfast:
            "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
          lunch: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
          dinner: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
          snacks: "bg-gradient-to-r from-green-500 to-green-600 text-white",
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
      accessorKey: "protein",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Protein (g)"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2">
            <Icon icon="heroicons:muscle" className="h-4 w-4 text-[#25235F]" />
            <span className="text-sm font-medium text-gray-700">
              {row.original.protein}g
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "carbs",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Carbs (g)"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2">
            <Icon
              icon="heroicons:academic-cap"
              className="h-4 w-4 text-[#25235F]"
            />
            <span className="text-sm font-medium text-gray-700">
              {row.original.carbs}g
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "fat",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Fat (g)"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2">
            <Icon icon="heroicons:cube" className="h-4 w-4 text-[#25235F]" />
            <span className="text-sm font-medium text-gray-700">
              {row.original.fat}g
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Price"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold px-3 py-1 rounded-full border-0">
              ${row.original.price}
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
    },
    {
      accessorKey: "featured",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Featured"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            {row.original.featured ? (
              <Badge className="bg-gradient-to-r from-[#ED4135] to-[#ED4135]/80 text-white font-semibold px-3 py-1 rounded-full border-0">
                Featured
              </Badge>
            ) : (
              <span className="text-sm text-gray-500">-</span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden bg-white">
        <DataTable
          data={filteredData}
          columns={columns}
          className="[&_table]:bg-white [&_thead]:bg-gradient-to-r [&_thead]:from-gray-50 [&_thead]:to-white [&_th]:text-[#25235F] [&_th]:font-bold [&_th]:border-gray-200 [&_td]:border-gray-100 [&_tr:hover]:bg-gradient-to-r [&_tr:hover]:from-[#25235F]/5 [&_tr:hover]:to-[#ED4135]/5 [&_tr]:transition-all [&_tr]:duration-300"
        />
      </div>
    </div>
  );
};

export default MealTable;
