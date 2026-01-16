// hooks/usePaginatedSelect.ts
import { useState, useCallback, useRef } from "react";

interface UsePaginatedSelectProps {
  fetchFunction: (
    page: number,
    pageSize: number,
    search?: string
  ) => Promise<any>;
  pageSize?: number;
  transformData?: (data: any) => Array<{ value: string; label: string }>;
}

export const usePaginatedSelect = ({
  fetchFunction,
  pageSize = 10,
  transformData = (data) => data,
}: UsePaginatedSelectProps) => {
  const [options, setOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const loadOptions = useCallback(
    async (page: number, append = false, search: string = "") => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        const response = await fetchFunction(page, pageSize, search);
        const data = response.data || response;

        // Handle different response structures
        const items = data.data || data.items || data || [];
        const newOptions = transformData(items);

        // If it's a new search or first page, replace options
        // If it's the same search and appending, add to existing options
        if (page === 1 || search !== searchTerm) {
          setOptions(newOptions);
        } else {
          setOptions((prev) => [...prev, ...newOptions]);
        }

        setHasMore(newOptions.length === pageSize);
        setCurrentPage(page);
        setSearchTerm(search);

        console.log(
          `Loaded page ${page}, search: "${search}":`,
          newOptions.length,
          "items, hasMore:",
          newOptions.length === pageSize
        );
      } catch (error) {
        console.error("Error loading options:", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFunction, pageSize, transformData, isLoading, searchTerm]
  );

  const loadMore = useCallback(() => {
    console.log("loadMore called:", {
      isLoading,
      hasMore,
      currentPage,
      searchTerm,
    });
    if (!isLoading && hasMore) {
      loadOptions(currentPage + 1, true, searchTerm);
    }
  }, [currentPage, hasMore, isLoading, loadOptions, searchTerm]);

  const loadInitial = useCallback(() => {
    console.log("loadInitial called, options length:", options.length);
    if (options.length === 0) {
      loadOptions(1, false, "");
    }
  }, [loadOptions, options.length]);

  const handleSearch = useCallback(
    (search: string) => {
      // Debounce search requests
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        console.log("Searching for:", search);
        loadOptions(1, false, search);
      }, 300); // 300ms debounce
    },
    [loadOptions]
  );

  const reset = useCallback(() => {
    setOptions([]);
    setCurrentPage(1);
    setHasMore(true);
    setSearchTerm("");
  }, []);

  return {
    options,
    isLoading,
    hasMore,
    loadMore,
    loadInitial,
    handleSearch,
    reset,
    searchTerm,
  };
};
