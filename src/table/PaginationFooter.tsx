import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

interface PaginationFooterProps {
  pageIndex: number;
  pageSize: number;
  total: number;
  pageSizeOptions: number[];
  onPaginationChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const navButtonClass = cn(
  "inline-flex h-8 w-8 items-center justify-center rounded-md",
  "transition-colors hover:bg-black/5 disabled:pointer-events-none disabled:opacity-50",
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--cdt-accent)]"
);

const ELLIPSIS = "…" as const;

function range(start: number, end: number): number[] {
  const length = Math.max(end - start + 1, 0);
  return Array.from({ length }, (_, i) => start + i);
}

/**
 * Boundary pages (first/last `boundaryCount`) always stay pinned, siblings
 * surround the current page, and any actual gap between the resulting
 * pages collapses to a single "…".
 */
function getPaginationRange(
  current: number,
  total: number,
  siblingCount = 1,
  boundaryCount = 3
): (number | typeof ELLIPSIS)[] {
  const startPages = range(1, Math.min(boundaryCount, total));
  const endPages = range(Math.max(total - boundaryCount + 1, boundaryCount + 1), total);
  const siblings = range(
    Math.max(current - siblingCount, 1),
    Math.min(current + siblingCount, total)
  );

  const shown = Array.from(new Set([...startPages, ...siblings, ...endPages])).sort(
    (a, b) => a - b
  );

  const result: (number | typeof ELLIPSIS)[] = [];
  shown.forEach((page, i) => {
    if (i > 0 && page - shown[i - 1] > 1) {
      result.push(ELLIPSIS);
    }
    result.push(page);
  });
  return result;
}

function PaginationFooter({
  pageIndex,
  pageSize,
  total,
  pageSizeOptions,
  onPaginationChange,
  onPageSizeChange,
}: PaginationFooterProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startItem = total === 0 ? 0 : (pageIndex - 1) * pageSize + 1;
  const endItem = Math.min(pageIndex * pageSize, total);
  const pageRange = getPaginationRange(pageIndex, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm text-[var(--cdt-body-text)]">
      <div className="flex items-center gap-2">
        <span className="whitespace-nowrap">Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          className="rounded-md border border-[var(--cdt-border)] bg-transparent px-2 py-1 text-sm"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="whitespace-nowrap">
        {startItem}-{endItem} of {total}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className={navButtonClass}
          disabled={pageIndex <= 1}
          onClick={() => onPaginationChange?.(pageIndex - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pageRange.map((page, i) =>
          page === ELLIPSIS ? (
            <span
              key={`ellipsis-${i}`}
              className="inline-flex h-8 w-8 items-center justify-center select-none"
              aria-hidden="true"
            >
              {ELLIPSIS}
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={cn(
                navButtonClass,
                page === pageIndex &&
                  "bg-[var(--cdt-accent)] text-white hover:bg-[var(--cdt-accent)]"
              )}
              aria-label={`Page ${page}`}
              aria-current={page === pageIndex ? "page" : undefined}
              onClick={() => onPaginationChange?.(page)}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          className={navButtonClass}
          disabled={pageIndex >= totalPages}
          onClick={() => onPaginationChange?.(pageIndex + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default PaginationFooter;
