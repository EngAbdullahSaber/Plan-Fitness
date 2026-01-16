"use client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { Table } from "@tanstack/react-table";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

interface DataTableToolbarProps {
  table: Table<any>;
  filterNames?: string[];
  filters?: { title: string; options: any[] }[];
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  isLoading?: boolean;
}

export function DataTableToolbar({
  table,
  filterNames = [],
  filters = [],
  searchTerm = "",
  onSearchChange,
  isLoading = false,
}: DataTableToolbarProps) {
  const { t } = useTranslate();
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchTerm) {
        onSearchChange?.(localSearch);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, searchTerm, onSearchChange]);

  const handleClearSearch = () => {
    setLocalSearch("");
    onSearchChange?.("");
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-4">
      <div className="relative min-w-[300px]">
        <Input
          placeholder={t("Search")}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="h-10 pr-10"
          disabled={isLoading}
        />
        {localSearch && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {isLoading && (
          <Icon
            icon="heroicons:arrow-path"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400"
          />
        )}
      </div>

      {/* Add other filters here if needed */}
      {/* 
      <DataTableViewOptions table={table} />
      <LayoutFilter table={table}  /> */}
    </div>
  );
}
