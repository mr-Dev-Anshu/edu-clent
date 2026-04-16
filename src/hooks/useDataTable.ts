"use client";
import { useState, useMemo, useCallback } from "react";
interface UseDataTableOptions<T> {
  data: T[];
  pageSize?: number;
  searchKeys?: (keyof T)[];
  defaultSort?: { key: keyof T; direction: "asc" | "desc" };
}

export const useDataTable = <T extends Record<string, unknown>>({
  data,
  pageSize = 10,
  searchKeys = [],
  defaultSort,
}: UseDataTableOptions<T>) => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  
  // 2. Explicitly type the sort state
  const [sort, setSort] = useState<{ key: keyof T; direction: "asc" | "desc" } | null>(
    defaultSort ?? null
  );

  // 3. Type filters so keys are restricted to keys of T
  const [filters, setFilters] = useState<Partial<Record<keyof T, string>>>({});

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, []);

  const handleFilter = useCallback((key: keyof T, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const handleSort = useCallback((key: keyof T) => {
    setSort((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  }, []);

  const resetFilters = useCallback(() => {
    setQuery("");
    setFilters({});
    setPage(1);
  }, []);

  const processed = useMemo(() => {
    let result = [...data];

    if (query.trim() && searchKeys.length) {
      const q = query.toLowerCase();
      result = result.filter((row) =>
        searchKeys.some((key) =>
          String(row[key] ?? "").toLowerCase().includes(q)
        )
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        // We cast 'key' because Object.entries always returns string keys
        result = result.filter((row) => String(row[key as keyof T]) === value);
      }
    });

    // Sort logic
    if (sort) {
      result.sort((a, b) => {
        const aVal = a[sort.key];
        const bVal = b[sort.key];
        const cmp = String(aVal ?? "").localeCompare(String(bVal ?? ""), undefined, { numeric: true });
        return sort.direction === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [data, query, searchKeys, filters, sort]);

  const paginated = useMemo(
    () => processed.slice((page - 1) * pageSize, page * pageSize),
    [processed, page, pageSize]
  );

  return {
    paginated,
    total: processed.length,
    page,
    pageSize,
    query,
    filters,
    sort,
    setPage,
    handleSearch,
    handleFilter,
    handleSort,
    resetFilters,
  };
};