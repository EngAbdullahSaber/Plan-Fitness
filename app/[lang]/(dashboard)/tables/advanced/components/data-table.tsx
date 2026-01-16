"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  page?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  filterNames?: string[];
  filters?: { title: string; options: any[] }[];
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  searchTerm = "",
  onSearchChange,
  page = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  filterNames = [],
  filters = [],
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { t } = useTranslate();

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: page - 1,
        pageSize: pageSize,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex: page - 1,
          pageSize: pageSize,
        });
        onPageChange?.(newState.pageIndex + 1);
        onPageSizeChange?.(newState.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    pageCount: Math.ceil(totalItems / pageSize),
  });

  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;
  const totalRowsCount = data.length;

  return (
    <div className="space-y-6">
      {/* Enhanced Toolbar */}
      <div className="bg-gradient-to-r from-[#25235F]/5 to-[#ED4135]/5 p-4 rounded-xl border border-gray-200 shadow-sm">
        <DataTableToolbar
          table={table}
          filterNames={filterNames}
          filters={filters}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          isLoading={isLoading}
        />
      </div>

      {/* Selection Summary */}
      {selectedRowsCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#25235F]/10 to-[#25235F]/5 rounded-lg border border-[#25235F]/20 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#25235F] flex items-center justify-center">
              <Icon icon="heroicons:check" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[#25235F]">
                {selectedRowsCount} of {totalRowsCount} rows selected
              </p>
              <p className="text-sm text-gray-600">
                Choose an action to perform on selected items
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-[#ED4135] hover:bg-[#ED4135]/10 rounded-lg transition-all duration-300 flex items-center gap-2">
              <Icon icon="heroicons:trash" className="h-4 w-4" />
              {t("delete_selected")}
            </button>
            <button className="px-4 py-2 text-sm font-medium text-[#25235F] hover:bg-[#25235F]/10 rounded-lg transition-all duration-300 flex items-center gap-2">
              <Icon icon="heroicons:pencil" className="h-4 w-4" />
              {t("edit_selected")}
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Table Container */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-xl bg-white">
        {/* Table Header Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#25235F] via-[#ED4135] to-[#25235F]"></div>

        <Table className="w-full">
          <TableHeader className="bg-gradient-to-r from-gray-50 via-white to-gray-50 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b-2 border-gray-200 hover:bg-gray-50/50 transition-colors duration-300"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="text-center font-bold text-[#25235F] py-4 px-6 group relative overflow-hidden"
                    >
                      {/* Header background effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#25235F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative z-10 flex items-center justify-center gap-2">
                        {header.isPlaceholder ? null : (
                          <>
                            <span className="font-bold">
                              {t(header?.id?.toLowerCase()) || header.id}
                            </span>
                            {header.column.getCanSort() && (
                              <Icon
                                icon="heroicons:arrows-up-down"
                                className="h-4 w-4 text-gray-400 group-hover:text-[#25235F] transition-colors duration-300"
                              />
                            )}
                          </>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon
                        icon="heroicons:arrow-path"
                        className="h-8 w-8 text-gray-400 animate-spin"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-gray-600">
                        {t("loading")}...
                      </p>
                      <p className="text-sm text-gray-400">
                        {t("loading_data")}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`
                    border-b border-gray-100 transition-all duration-300 group
                    hover:bg-gradient-to-r hover:from-[#25235F]/5 hover:via-transparent hover:to-[#ED4135]/5
                    hover:shadow-md hover:border-gray-200
                    ${
                      row.getIsSelected()
                        ? "bg-gradient-to-r from-[#25235F]/10 to-[#25235F]/5 border-[#25235F]/20"
                        : index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50/30"
                    }
                  `}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className="text-center py-4 px-6 relative group-hover:text-gray-900 transition-colors duration-300"
                      >
                        {/* Cell highlight effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                        <div className="relative z-10">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon
                        icon="heroicons:inbox"
                        className="h-8 w-8 text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-gray-600">
                        {t("no_results")}
                      </p>
                      <p className="text-sm text-gray-400">
                        {t("no_data_matches_filters")}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Pagination with Stats */}
      <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#25235F] rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                {t("showing")} {data.length} {t("of")} {totalItems}{" "}
                {t("entries")}
              </span>
            </div>
            {selectedRowsCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-[#25235F]/10 rounded-full">
                <Icon
                  icon="heroicons:check-circle"
                  className="h-4 w-4 text-[#25235F]"
                />
                <span className="text-sm font-medium text-[#25235F]">
                  {selectedRowsCount} {t("selected")}
                </span>
              </div>
            )}
          </div>
        </div>

        <DataTablePagination
          table={table}
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
}
