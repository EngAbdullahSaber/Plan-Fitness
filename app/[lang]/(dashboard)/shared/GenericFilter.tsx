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

export interface FilterOption {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "number";
  placeholder?: string;
  options?: { value: string; label: string }[];
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
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700">
                {activeFilterCount} active
              </span>
            </div>
          )}
        </div>

        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="group relative overflow-hidden border-2 border-gray-200 hover:border-blue-400 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-2 relative z-10">
            <Icon
              icon="heroicons:funnel"
              className={`h-4 w-4 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
            <span className="font-medium">
              {isOpen ? "Hide Filters" : "Show Filters"}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    <SelectTrigger className="border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-sm py-2.5 rounded-lg">
                      <SelectValue placeholder={filter.placeholder} />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm border-gray-200 rounded-lg shadow-xl">
                      <SelectItem
                        value=""
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        All {filter.label}
                      </SelectItem>
                      {filter.options.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="hover:bg-blue-50 transition-colors duration-150"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
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
