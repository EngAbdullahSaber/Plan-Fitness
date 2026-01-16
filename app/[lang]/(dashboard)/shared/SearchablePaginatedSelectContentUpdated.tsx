// components/SearchablePaginatedSelectContentUpdated.tsx
import React, { useRef, useEffect, useState } from "react";
import { SelectContent } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";

interface SearchablePaginatedSelectContentUpdatedProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  onSearch: (search: string) => void;
  isLoading: boolean;
  hasMore: boolean;
  className?: string;
  placeholder?: string;
  value?: string; // Add this prop to receive the current value
}

export const SearchablePaginatedSelectContentUpdated: React.FC<
  SearchablePaginatedSelectContentUpdatedProps
> = ({
  children,
  onLoadMore,
  onSearch,
  isLoading,
  hasMore,
  className = "",
  placeholder = "Search...",
  value, // Destructure the value prop
  ...props
}) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          console.log("Intersection Observer triggered loadMore");
          onLoadMore();
        }
      },
      {
        root: contentRef.current,
        threshold: 0.1,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    onSearch("");
  };

  return (
    <SelectContent
      ref={contentRef}
      className={`bg-white/95 backdrop-blur-sm border-gray-200 rounded-lg shadow-xl max-h-64 p-0 ${className}`}
      {...props}
    >
      {/* Search Input */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-2">
        <div className="relative">
          <Icon
            icon="heroicons:magnifying-glass"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={handleSearchChange}
            className="pl-9 pr-8 py-2 text-sm border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          {searchValue && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Icon icon="heroicons:x-mark" className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Options List */}
      <div className="max-h-44">
        {children}

        {/* Observer target */}
        {hasMore && <div ref={observerRef} className="h-1" />}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center py-3 border-t border-gray-100">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            <span className="text-xs text-gray-500">Loading more...</span>
          </div>
        )}

        {/* End of list indicator */}
        {!hasMore && (
          <div className="text-center py-2 text-xs text-gray-400 border-t border-gray-100">
            End of list
          </div>
        )}

        {/* No results message */}
        {React.Children.toArray(children).length === 1 && ( // Only "All" option exists
          <div className="text-center py-4 text-sm text-gray-500">
            No results found
          </div>
        )}
      </div>
    </SelectContent>
  );
};
