"use client";

import * as React from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingState, EmptyState } from "./states";
import { Pagination } from "./pagination";
import { Input } from "./input";

export interface Column<T> {
  key: string;
  header: string;
  accessor?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  className?: string;
  hideBelow?: "sm" | "md" | "lg" | "xl";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  pageSize?: number;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
  actionsLabel?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading,
  searchable,
  searchPlaceholder = "Search…",
  searchKeys,
  pageSize = 10,
  emptyTitle = "No records found",
  emptyMessage,
  emptyIcon,
  onRowClick,
  actions,
  actionsLabel = "Actions",
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");
  const [page, setPage] = React.useState(1);

  const rows = React.useMemo(() => {
    let result = [...data];
    if (query && searchKeys && searchKeys.length) {
      const q = query.toLowerCase().trim();
      result = result.filter((row) =>
        searchKeys.some((k) =>
          String(row[k] ?? "").toLowerCase().includes(q),
        ),
      );
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      result.sort((a, b) => {
        const av = String(col?.accessor ? col.accessor(a) : a[sortKey] ?? "");
        const bv = String(col?.accessor ? col.accessor(b) : b[sortKey] ?? "");
        const cmp = av.localeCompare(bv);
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return result;
  }, [data, query, sortKey, sortDir, columns, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const hideClass = (c: Column<T>) => {
    switch (c.hideBelow) {
      case "sm":
        return "hidden sm:table-cell";
      case "md":
        return "hidden md:table-cell";
      case "lg":
        return "hidden lg:table-cell";
      case "xl":
        return "hidden xl:table-cell";
      default:
        return "";
    }
  };

  const alignClass = (c: Column<T>) =>
    c.align === "right"
      ? "text-right"
      : c.align === "center"
        ? "text-center"
        : "text-left";

  if (loading) return <LoadingState />;

  return (
    <div className={cn("w-full", className)}>
      {searchable && (
        <div className="mb-4 flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash-500" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="pl-9"
              aria-label={searchPlaceholder}
            />
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          message={emptyMessage}
          icon={emptyIcon}
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-ash-100/70">
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      scope="col"
                      className={cn(
                        "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-soft",
                        alignClass(c),
                        hideClass(c),
                        c.className,
                      )}
                    >
                      {c.sortable ? (
                        <button
                          onClick={() => toggleSort(c.key)}
                          className={cn(
                            "inline-flex items-center gap-1 transition-colors hover:text-ink",
                            alignClass(c),
                          )}
                        >
                          {c.header}
                          {sortKey === c.key ? (
                            sortDir === "asc" ? (
                              <ArrowUp className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowDown className="h-3.5 w-3.5" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                          )}
                        </button>
                      ) : (
                        c.header
                      )}
                    </th>
                  ))}
                  {actions && (
                    <th
                      className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-soft"
                    >
                      {actionsLabel}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map((row, i) => (
                  <tr
                    key={i}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      "transition-colors hover:bg-royal-100/30",
                      onRowClick && "cursor-pointer",
                    )}
                  >
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={cn(
                          "px-4 py-3 align-middle text-ink",
                          alignClass(c),
                          hideClass(c),
                          c.className,
                        )}
                      >
                        {c.accessor ? c.accessor(row) : String(row[c.key] ?? "")}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3 text-right">
                        {actions(row)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > pageSize && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={rows.length}
              onPageChange={setPage}
              className="mt-4"
            />
          )}
        </>
      )}
    </div>
  );
}
