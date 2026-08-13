import React, { Fragment, forwardRef, useImperativeHandle, useState } from "react";
import { flexRender } from "@tanstack/react-table";
import { GripVertical } from "lucide-react";
import { cn } from "../lib/cn";
import { useCustomDataTable, SELECT_COL_ID, EXPAND_COL_ID } from "./useCustomDataTable";
import { resolveTheme, themeToCssVars } from "./theme";
import SortIcon from "./SortIcon";
import PaginationFooter from "./PaginationFooter";
import type { CustomDataTableHandle, CustomDataTableProps } from "./types";

function SkeletonRows({ rows, columns }: { rows: number; columns: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={`skeleton-${rowIdx}`}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td key={`skeleton-cell-${rowIdx}-${colIdx}`} className="px-4 py-3">
              <div className="h-4 w-full max-w-[10rem] animate-pulse rounded bg-black/10" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function CustomDataTableInner<T>(
  props: CustomDataTableProps<T>,
  ref: React.ForwardedRef<CustomDataTableHandle>
) {
  const {
    loading = false,
    skeletonRows = 5,
    theme,
    className,
    headerClassName,
    rowClassName,
    expandable,
    renderExpandedRow,
    expandOnRowClick,
    pagination = false,
    pagingData,
    onPaginationChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20, 50],
    maxHeight,
    notFoundView,
    emptyMessage = "No data available",
    data = [],
    tableHeading,
    headingInsideTable = false,
    isColumnSwitch = false,
  } = props;

  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  const {
    table,
    finalColumns,
    selected,
    getId,
    toggleRowExpanded,
    expanded,
    resetSelection,
    expandAll,
    collapseAll,
  } = useCustomDataTable(props);

  useImperativeHandle(ref, () => ({
    resetSelection,
    getSelectedRows: () => data.filter((row) => selected.has(getId(row))),
    expandAll,
    collapseAll,
  }));

  const resolvedTheme = resolveTheme(theme);
  const cssVars = themeToCssVars(resolvedTheme);
  const columnCount = finalColumns.length;
  const isEmpty = !loading && data.length === 0;

  const handleColumnDrop = (targetId: string) => {
    const sourceId = draggedColumnId;
    setDraggedColumnId(null);
    setDragOverColumnId(null);
    if (!sourceId || sourceId === targetId) return;

    const currentOrder = table.getState().columnOrder.length
      ? table.getState().columnOrder
      : table.getAllLeafColumns().map((column) => column.id);
    const next = [...currentOrder];
    const from = next.indexOf(sourceId);
    const to = next.indexOf(targetId);
    if (from === -1 || to === -1) return;
    next.splice(from, 1);
    next.splice(to, 0, sourceId);
    table.setColumnOrder(next);
  };

  return (
    <div className={cn("w-full", className)} style={cssVars}>
      <div
        className="overflow-hidden rounded-[var(--cdt-radius)] border border-[var(--cdt-border)]"
      >
        {headingInsideTable && tableHeading && (
          <div className="flex items-start gap-3 border-b border-[var(--cdt-border)] bg-[var(--cdt-body-bg)] px-4 py-3">
            {tableHeading.icon && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--cdt-header-bg)] text-[var(--cdt-accent)]">
                {tableHeading.icon}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[var(--cdt-header-text)]">
                {tableHeading.title}
              </div>
              {tableHeading.description && (
                <div className="text-xs text-[var(--cdt-empty-text)]">
                  {tableHeading.description}
                </div>
              )}
            </div>
          </div>
        )}
        <div
          className={cn("overflow-x-auto", maxHeight && "overflow-y-auto")}
          style={maxHeight ? { maxHeight } : undefined}
        >
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10">
              <tr>
                {table.getHeaderGroups()[0]?.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const canDrag =
                    isColumnSwitch &&
                    header.column.id !== SELECT_COL_ID &&
                    header.column.id !== EXPAND_COL_ID;
                  return (
                    <th
                      key={header.id}
                      draggable={canDrag}
                      onDragStart={
                        canDrag
                          ? (e) => {
                              e.dataTransfer.effectAllowed = "move";
                              e.dataTransfer.setData("text/plain", header.column.id);
                              setDraggedColumnId(header.column.id);
                            }
                          : undefined
                      }
                      onDragOver={
                        canDrag
                          ? (e) => {
                              e.preventDefault();
                              if (dragOverColumnId !== header.column.id) {
                                setDragOverColumnId(header.column.id);
                              }
                            }
                          : undefined
                      }
                      onDragLeave={
                        canDrag
                          ? () =>
                              setDragOverColumnId((prev) =>
                                prev === header.column.id ? null : prev
                              )
                          : undefined
                      }
                      onDrop={
                        canDrag
                          ? (e) => {
                              e.preventDefault();
                              handleColumnDrop(header.column.id);
                            }
                          : undefined
                      }
                      onDragEnd={
                        canDrag
                          ? () => {
                              setDraggedColumnId(null);
                              setDragOverColumnId(null);
                            }
                          : undefined
                      }
                      onClick={
                        canSort ? header.column.getToggleSortingHandler() : undefined
                      }
                      className={cn(
                        "bg-[var(--cdt-header-bg)] px-4 py-3 text-left text-sm font-semibold whitespace-nowrap text-[var(--cdt-header-text)]",
                        canSort && "cursor-pointer select-none",
                        canDrag && "cursor-grab active:cursor-grabbing",
                        draggedColumnId === header.column.id && "opacity-40",
                        dragOverColumnId === header.column.id &&
                          draggedColumnId !== header.column.id &&
                          "outline outline-2 outline-[var(--cdt-accent)] -outline-offset-2",
                        headerClassName
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-1.5">
                          {canDrag && (
                            <GripVertical className="h-3.5 w-3.5 shrink-0 text-[var(--cdt-expand-icon)]" />
                          )}
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {canSort && (
                            <SortIcon sorted={header.column.getIsSorted()} />
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <SkeletonRows rows={skeletonRows} columns={columnCount} />
              ) : isEmpty ? (
                <tr>
                  <td colSpan={columnCount} className="p-0">
                    {notFoundView ? (
                      notFoundView()
                    ) : (
                      <div className="flex items-center justify-center py-10 text-sm font-medium text-[var(--cdt-empty-text)]">
                        {emptyMessage}
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const id = getId(row.original);
                  const isSelected = selected.has(id);
                  const isExpanded = expandable && expanded.has(id);

                  return (
                    <Fragment key={String(id)}>
                      <tr
                        className={cn(
                          "border-t border-[var(--cdt-row-border)] bg-[var(--cdt-body-bg)] text-[var(--cdt-body-text)] transition-colors hover:bg-[var(--cdt-row-hover)]",
                          isSelected && "bg-[var(--cdt-selected-bg)]",
                          expandOnRowClick && "cursor-pointer",
                          rowClassName?.(row.original, row.index)
                        )}
                        onClick={
                          expandable && expandOnRowClick
                            ? () => toggleRowExpanded(row.original)
                            : undefined
                        }
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-2.5 align-middle">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                      {isExpanded && renderExpandedRow && (
                        <tr className="bg-[var(--cdt-row-hover)]">
                          <td colSpan={columnCount} className="p-0">
                            <div className="p-4">{renderExpandedRow(row.original)}</div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagingData && pagingData.total > 0 && (
        <PaginationFooter
          pageIndex={pagingData.pageIndex}
          pageSize={pagingData.pageSize}
          total={pagingData.total}
          pageSizeOptions={pageSizeOptions}
          onPaginationChange={onPaginationChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}

const CustomDataTable = forwardRef(CustomDataTableInner) as unknown as <T>(
  props: CustomDataTableProps<T> & { ref?: React.ForwardedRef<CustomDataTableHandle> }
) => ReturnType<typeof CustomDataTableInner>;

export default CustomDataTable;
