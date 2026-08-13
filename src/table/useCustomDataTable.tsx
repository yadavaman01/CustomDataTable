import { useEffect, useMemo, useRef, useState } from "react";
import {
  type ColumnDef,
  type ColumnSort,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import IndeterminateCheckbox from "./IndeterminateCheckbox";
import ExpandToggle from "./ExpandToggle";
import type { CustomDataTableProps, OnSortParam, RowId } from "./types";

export const SELECT_COL_ID = "__cdtSelect";
export const EXPAND_COL_ID = "__cdtExpand";

export function useCustomDataTable<T>(props: CustomDataTableProps<T>) {
  const {
    idName,
    columns: columnsProp,
    data = [],
    selectable,
    selectedIds,
    disabledIds = [],
    onSelectionChange,
    keepSelectedOnPageChange = false,
    expandable,
    defaultExpandedIds = [],
    keepExpandedOnPageChange = false,
    keepExpandedOnOtherRowOpen = false,
    onSort,
    pagingData,
  } = props;

  const getId = (row: T): RowId => row[idName] as unknown as RowId;

  const [selected, setSelected] = useState<Set<RowId>>(
    () => new Set(selectedIds ?? [])
  );
  const [expanded, setExpanded] = useState<Set<RowId>>(
    () => new Set(defaultExpandedIds)
  );
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  // Controlled selection: keep local state in sync when the caller drives it.
  useEffect(() => {
    if (selectedIds) setSelected(new Set(selectedIds));
  }, [selectedIds]);

  // Skip the first firing so mount-time selectedIds/defaultExpandedIds survive.
  const isFirstPageRender = useRef(true);
  useEffect(() => {
    if (pagingData?.pageIndex === undefined) return;
    if (isFirstPageRender.current) {
      isFirstPageRender.current = false;
      return;
    }
    if (!keepSelectedOnPageChange) {
      setSelected(new Set());
      onSelectionChange?.([]);
    }
    if (!keepExpandedOnPageChange) {
      setExpanded(new Set());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagingData?.pageIndex]);

  useEffect(() => {
    const order = sorting.length ? (sorting[0].desc ? "desc" : "asc") : "";
    const key = sorting.length ? sorting[0].id : "";
    onSort?.({ order, key } as OnSortParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  const emitSelection = (next: Set<RowId>) => {
    onSelectionChange?.(data.filter((row) => next.has(getId(row))));
  };

  const toggleRowSelected = (row: T) => {
    const id = getId(row);
    if (disabledIds.includes(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      emitSelection(next);
      return next;
    });
  };

  const toggleAllSelected = () => {
    const selectableRows = data.filter((row) => !disabledIds.includes(getId(row)));
    setSelected((prev) => {
      const allSelected =
        selectableRows.length > 0 &&
        selectableRows.every((row) => prev.has(getId(row)));
      const next = new Set(prev);
      if (allSelected) {
        selectableRows.forEach((row) => next.delete(getId(row)));
      } else {
        selectableRows.forEach((row) => next.add(getId(row)));
      }
      emitSelection(next);
      return next;
    });
  };

  const resetSelection = () => {
    setSelected(new Set());
    onSelectionChange?.([]);
  };

  const toggleRowExpanded = (row: T) => {
    const id = getId(row);
    setExpanded((prev) => {
      const isOpen = prev.has(id);
      if (!keepExpandedOnOtherRowOpen) {
        // Accordion mode: opening a row closes whichever other row was open.
        return isOpen ? new Set() : new Set([id]);
      }
      const next = new Set(prev);
      if (isOpen) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(data.map(getId)));
  const collapseAll = () => setExpanded(new Set());

  const finalColumns = useMemo<ColumnDef<T>[]>(() => {
    const cols: ColumnDef<T>[] = [];

    if (selectable) {
      const selectableRows = data.filter((row) => !disabledIds.includes(getId(row)));
      const allSelected =
        selectableRows.length > 0 &&
        selectableRows.every((row) => selected.has(getId(row)));
      const someSelected = selectableRows.some((row) => selected.has(getId(row)));

      cols.push({
        id: SELECT_COL_ID,
        header: () => (
          <IndeterminateCheckbox
            checked={allSelected}
            indeterminate={!allSelected && someSelected}
            disabled={selectableRows.length === 0}
            onChange={toggleAllSelected}
            aria-label="Select all rows"
          />
        ),
        enableSorting: false,
        size: 40,
        cell: ({ row }: any) => (
          <IndeterminateCheckbox
            checked={selected.has(getId(row.original))}
            disabled={disabledIds.includes(getId(row.original))}
            onChange={() => toggleRowSelected(row.original)}
            aria-label="Select row"
          />
        ),
      } as ColumnDef<T>);
    }

    if (expandable) {
      cols.push({
        id: EXPAND_COL_ID,
        header: "",
        enableSorting: false,
        size: 40,
        cell: ({ row }: any) => (
          <ExpandToggle
            expanded={expanded.has(getId(row.original))}
            onToggle={() => toggleRowExpanded(row.original)}
          />
        ),
      } as ColumnDef<T>);
    }

    cols.push(...columnsProp);

    return cols;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnsProp, expandable, selectable, selected, expanded, data, disabledIds]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onSortingChange: setSorting as any,
    onColumnOrderChange: setColumnOrder,
    state: { sorting, columnOrder },
  });

  return {
    table,
    finalColumns,
    selected,
    expanded,
    getId,
    toggleRowSelected,
    toggleAllSelected,
    toggleRowExpanded,
    resetSelection,
    expandAll,
    collapseAll,
  };
}
