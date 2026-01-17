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
    [],
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
    <div className="space-y-6 transition-colors duration-300">
      {/* Enhanced Toolbar */}
      <div
        className="bg-gradient-to-r from-[#25235F]/5 to-[#ED4135]/5 
                      dark:from-gray-800/50 dark:to-gray-700/50 
                      p-4 rounded-xl border border-gray-200 dark:border-gray-700 
                      shadow-sm dark:shadow-gray-900/30 transition-colors duration-300"
      >
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
        <div
          className="flex items-center justify-between p-4 
                        bg-gradient-to-r from-[#25235F]/10 to-[#25235F]/5 
                        dark:from-gray-800 dark:to-gray-700 
                        rounded-lg border border-[#25235F]/20 dark:border-gray-600 
                        shadow-md dark:shadow-gray-900/40 transition-colors duration-300"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full bg-[#25235F] dark:bg-blue-600 
                            flex items-center justify-center transition-colors duration-300"
            >
              <Icon icon="heroicons:check" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[#25235F] dark:text-gray-200 transition-colors duration-300">
                {selectedRowsCount} of {totalRowsCount} rows selected
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Choose an action to perform on selected items
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-sm font-medium text-[#ED4135] 
                               dark:text-red-400 hover:bg-[#ED4135]/10 
                               dark:hover:bg-red-400/10 rounded-lg transition-all duration-300 
                               flex items-center gap-2"
            >
              <Icon icon="heroicons:trash" className="h-4 w-4" />
              {t("delete_selected")}
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-[#25235F] 
                               dark:text-blue-400 hover:bg-[#25235F]/10 
                               dark:hover:bg-blue-400/10 rounded-lg transition-all duration-300 
                               flex items-center gap-2"
            >
              <Icon icon="heroicons:pencil" className="h-4 w-4" />
              {t("edit_selected")}
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Table Container */}
      <div
        className="relative overflow-hidden rounded-xl border border-gray-200 
                      dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800 
                      transition-colors duration-300"
      >
        {/* Table Header Gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-1 
                        bg-gradient-to-r from-[#25235F] via-[#ED4135] to-[#25235F]
                        dark:from-blue-600 dark:via-red-500 dark:to-blue-600"
        ></div>

        <Table className="w-full">
          <TableHeader
            className="bg-gradient-to-r from-gray-50 via-white to-gray-50 
                                  dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 
                                  sticky top-0 z-10 transition-colors duration-300"
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b-2 border-gray-200 dark:border-gray-700 
                           hover:bg-gray-50/50 dark:hover:bg-gray-700/50 
                           transition-colors duration-300"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="text-center font-bold text-[#25235F] dark:text-gray-200 
                                 py-4 px-6 group relative overflow-hidden transition-colors duration-300"
                    >
                      {/* Header background effect */}
                      <div
                        className="absolute inset-0 
                                      bg-gradient-to-r from-transparent via-[#25235F]/5 to-transparent 
                                      dark:via-blue-500/10 opacity-0 group-hover:opacity-100 
                                      transition-opacity duration-300"
                      ></div>

                      <div className="relative z-10 flex items-center justify-center gap-2">
                        {header.isPlaceholder ? null : (
                          <>
                            <span className="font-bold">
                              {t(header?.id?.toLowerCase()) || header.id}
                            </span>
                            {header.column.getCanSort() && (
                              <Icon
                                icon="heroicons:arrows-up-down"
                                className="h-4 w-4 text-gray-400 dark:text-gray-500 
                                           group-hover:text-[#25235F] dark:group-hover:text-blue-400 
                                           transition-colors duration-300"
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
                    <div
                      className="w-16 h-16 rounded-full 
                                    bg-gray-100 dark:bg-gray-700 
                                    flex items-center justify-center transition-colors duration-300"
                    >
                      <Icon
                        icon="heroicons:arrow-path"
                        className="h-8 w-8 text-gray-400 dark:text-gray-500 animate-spin"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-gray-600 dark:text-gray-300 transition-colors duration-300">
                        {t("loading")}...
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 transition-colors duration-300">
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
                    border-b border-gray-100 dark:border-gray-700 transition-all duration-300 group
                    hover:bg-gradient-to-r hover:from-[#25235F]/5 hover:via-transparent hover:to-[#ED4135]/5
                    dark:hover:bg-gradient-to-r dark:hover:from-blue-500/10 dark:hover:via-transparent dark:hover:to-red-500/10
                    hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600
                    ${
                      row.getIsSelected()
                        ? "bg-gradient-to-r from-[#25235F]/10 to-[#25235F]/5 border-[#25235F]/20 dark:from-blue-500/20 dark:to-blue-500/10 dark:border-blue-500/30"
                        : index % 2 === 0
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-50/30 dark:bg-gray-700/30"
                    }
                  `}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className="text-center py-4 px-6 relative 
                                   group-hover:text-gray-900 dark:group-hover:text-gray-200 
                                   transition-colors duration-300"
                      >
                        {/* Cell highlight effect */}
                        <div
                          className="absolute inset-0 
                                        bg-gradient-to-r from-transparent via-white/50 to-transparent 
                                        dark:via-gray-700/50 opacity-0 group-hover:opacity-100 
                                        transition-opacity duration-300 pointer-events-none"
                        ></div>

                        <div className="relative z-10">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
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
                    <div
                      className="w-16 h-16 rounded-full 
                                    bg-gray-100 dark:bg-gray-700 
                                    flex items-center justify-center transition-colors duration-300"
                    >
                      <Icon
                        icon="heroicons:inbox"
                        className="h-8 w-8 text-gray-400 dark:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-gray-600 dark:text-gray-300 transition-colors duration-300">
                        {t("no_results")}
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 transition-colors duration-300">
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
      <div
        className="bg-gradient-to-r from-gray-50 to-white 
                      dark:from-gray-800 dark:to-gray-700 
                      p-4 rounded-xl border border-gray-200 dark:border-gray-700 
                      shadow-sm dark:shadow-gray-900/30 transition-colors duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 bg-[#25235F] dark:bg-blue-500 
                              rounded-full transition-colors duration-300"
              ></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                {t("showing")} {data.length} {t("of")} {totalItems}{" "}
                {t("entries")}
              </span>
            </div>
            {selectedRowsCount > 0 && (
              <div
                className="flex items-center gap-2 px-3 py-1 
                              bg-[#25235F]/10 dark:bg-blue-500/20 
                              rounded-full transition-colors duration-300"
              >
                <Icon
                  icon="heroicons:check-circle"
                  className="h-4 w-4 text-[#25235F] dark:text-blue-400"
                />
                <span className="text-sm font-medium text-[#25235F] dark:text-blue-400 transition-colors duration-300">
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
