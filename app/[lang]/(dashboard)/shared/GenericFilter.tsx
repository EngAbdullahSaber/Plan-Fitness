"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { useTranslate } from "@/config/useTranslation";
import { SearchablePaginatedSelectContent } from "./SearchablePaginatedSelectContent";

// Update your FilterOption interface to include search
interface FilterOption {
  key: string;
  label: string;
  type: "text" | "select" | "selectPagination" | "date" | "number";
  placeholder?: string;
  searchPlaceholder?: string; // Add this
  options?: Array<{ value: string; label: string }>;
  // For paginated select
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onSearch?: (search: string) => void; // Add this
  onOpen?: () => void;
}

export interface FilterConfig {
  filters: FilterOption[];
  onFilterChange: (filters: Record<string, string>) => void;
  onClearFilters: () => void;
  initialFilters?: Record<string, string>;
}

const GenericFilter = ({
  filters,
  onFilterChange,
  onClearFilters,
  initialFilters = {},
}: FilterConfig) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFilters, setCurrentFilters] =
    useState<Record<string, string>>(initialFilters);
  const { t } = useTranslate();

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...currentFilters, [key]: value };
    setCurrentFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = Object.fromEntries(
      Object.keys(currentFilters).map((key) => [key, ""])
    );
    setCurrentFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(currentFilters).some(
    (value) => value !== ""
  );

  const activeFilterCount = Object.values(currentFilters).filter(
    (value) => value !== ""
  ).length;

  return (
    <div className="w-full">
      {/* Filter Toggle Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900">
            {t("Filters")}
          </h3>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700">
                {activeFilterCount} {t("active")}
              </span>
            </div>
          )}
        </div>

        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="group relative overflow-hidden border border-gray-300/80 bg-white/95 backdrop-blur-sm hover:bg-transparent transition-all duration-500 shadow-sm hover:shadow-xl"
        >
          <div className="flex items-center gap-2 relative z-10">
            <Icon
              icon="heroicons:funnel"
              className={`h-4 w-4 transition-all duration-500 ${
                isOpen
                  ? "rotate-180 text-white"
                  : "text-gray-600 group-hover:text-white"
              }`}
            />
            <span
              className={`font-medium transition-colors duration-500 ${
                isOpen ? "text-white" : "text-gray-700 group-hover:text-white"
              }`}
            >
              {isOpen ? t("Hide Filters") : t("Show Filters")}
            </span>
          </div>

          {/* Animated gradient background */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ${
              isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          ></div>

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </Button>
      </div>

      {/* Filter Panel with Animation */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-lg shadow-gray-200/20 p-8">
          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filters.map((filter, index) => (
              <div
                key={filter.key}
                className="group space-y-3 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Label
                  htmlFor={filter.key}
                  className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <div className="w-1 h-4 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200"></div>
                  {filter.label}
                </Label>

                {filter.type === "text" && (
                  <div className="relative">
                    <Input
                      id={filter.key}
                      placeholder={filter.placeholder}
                      value={currentFilters[filter.key] || ""}
                      onChange={(e) =>
                        handleFilterChange(filter.key, e.target.value)
                      }
                      className="border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-sm pl-4 pr-10 py-2.5 rounded-lg"
                    />
                    {currentFilters[filter.key] && (
                      <button
                        onClick={() => handleFilterChange(filter.key, "")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <Icon icon="heroicons:x-mark" className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}

                {filter.type === "select" && filter.options && (
                  <Select
                    value={currentFilters[filter.key] || ""}
                    onValueChange={(value) =>
                      handleFilterChange(filter.key, value)
                    }
                  >
                    <SelectTrigger className="group relative border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-gradient-to-br from-white via-blue-50/30 to-white backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-0.5 py-3 px-4 rounded-xl font-medium">
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 group-hover:scale-125 transition-transform duration-300" />
                        <SelectValue
                          placeholder={
                            <span className="text-gray-500 font-normal flex items-center gap-2">
                              <span className="text-lg">✨</span>
                              {filter.placeholder}
                            </span>
                          }
                        />
                      </div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-blue-400/0 group-hover:from-blue-400/5 group-hover:via-purple-400/5 group-hover:to-blue-400/5 transition-all duration-500 pointer-events-none" />
                    </SelectTrigger>

                    <SelectContent className="bg-white/98 backdrop-blur-xl border-2 border-gray-200 rounded-2xl shadow-2xl shadow-blue-200/30 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                      {/* Header with gradient */}
                      <div className="px-4 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 animate-gradient">
                        <p className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                          {filter.label}
                        </p>
                      </div>

                      {/* All option with special styling */}
                      <SelectItem
                        value=""
                        className="mx-2 my-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 border-b-2 border-gray-100 pb-3 font-semibold text-gray-700 hover:text-blue-600 hover:shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                          {t("All")} {filter.label}
                        </div>
                      </SelectItem>

                      {/* Options with enhanced styling */}
                      <div className="px-2 py-2 space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
                        {filter.options.map((option, index) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50/50 hover:to-blue-50 transition-all duration-200 hover:shadow-sm hover:scale-[1.02] py-3 px-3 cursor-pointer group border border-transparent hover:border-blue-100"
                            style={{
                              animationDelay: `${index * 30}ms`,
                            }}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                                {option.label}
                              </span>
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                )}

                {filter.type === "selectPagination" && (
                  <Select
                    value={currentFilters[filter.key] || ""}
                    onValueChange={(value) =>
                      handleFilterChange(filter.key, value)
                    }
                    onOpenChange={(open) => {
                      if (open && filter.onOpen) {
                        filter.onOpen();
                      }
                    }}
                  >
                    <SelectTrigger className="group relative border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-gradient-to-br from-white via-purple-50/30 to-white backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-100/50 hover:-translate-y-0.5 py-3 px-4 rounded-xl font-medium">
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-100" />
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse delay-200" />
                        </div>
                        <SelectValue
                          placeholder={
                            <span className="text-gray-500 font-normal flex items-center gap-2">
                              <span className="text-lg">🔍</span>
                              {filter.placeholder}
                            </span>
                          }
                        />
                      </div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/0 via-blue-400/0 to-purple-400/0 group-hover:from-purple-400/5 group-hover:via-blue-400/5 group-hover:to-purple-400/5 transition-all duration-500 pointer-events-none" />
                    </SelectTrigger>

                    <SearchablePaginatedSelectContent
                      onLoadMore={filter.onLoadMore}
                      onSearch={filter.onSearch}
                      isLoading={filter.isLoading}
                      hasMore={filter.hasMore}
                      placeholder={filter.searchPlaceholder || "Search..."}
                    >
                      {/* Header with gradient */}
                      <div className="sticky top-0 z-10 px-4 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-size-200 animate-gradient">
                        <p className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                          {filter.label}
                        </p>
                      </div>

                      {/* All option */}
                      <SelectItem
                        value=""
                        className="mx-2 my-2 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 border-b-2 border-gray-100 pb-3 font-semibold text-gray-700 hover:text-purple-600 hover:shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                          {t("All")} {filter.label}
                        </div>
                      </SelectItem>

                      {/* Options with enhanced styling */}
                      <div className="px-2 space-y-1">
                        {filter.options.map((option, index) => (
                          <SelectItem
                            key={`${option.value}-${index}`}
                            value={option.value}
                            className="rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:via-blue-50/50 hover:to-purple-50 transition-all duration-200 hover:shadow-sm hover:scale-[1.02] py-3 px-3 cursor-pointer group border border-transparent hover:border-purple-100"
                            style={{
                              animationDelay: `${index * 30}ms`,
                            }}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium text-gray-700 group-hover:text-purple-700 transition-colors">
                                {option.label}
                              </span>
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    </SearchablePaginatedSelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200/60">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Icon icon="heroicons:information-circle" className="h-4 w-4" />
                <span>
                  {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}{" "}
                  applied
                </span>
              </div>

              <Button
                onClick={handleClearFilters}
                variant="ghost"
                className="group relative overflow-hidden text-red-600 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 transition-all duration-300 shadow-sm hover:shadow-md px-6"
              >
                <div className="flex items-center gap-2 relative z-10">
                  <Icon
                    icon="heroicons:trash"
                    className="h-4 w-4 group-hover:animate-pulse"
                  />
                  <span className="font-medium">Clear All</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GenericFilter;
