import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";

export type SortOrder = "asc" | "desc" | "";

export type OnSortParam = { key: string; order: SortOrder };

export type RowId = string | number;

/**
 * Every color/spacing token the table renders with. Overriding any subset via
 * the `theme` prop re-skins the table without touching markup or logic.
 */
export interface CustomDataTableTheme {
  headerBg: string;
  headerText: string;
  bodyBg: string;
  bodyText: string;
  borderColor: string;
  rowBorderColor: string;
  rowHoverBg: string;
  selectedRowBg: string;
  accentColor: string;
  expandIconColor: string;
  emptyStateText: string;
  radius: string;
}

export interface CustomDataTablePagingData {
  total: number;
  pageIndex: number;
  pageSize: number;
}

export interface CustomDataTableHeading {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export interface CustomDataTableProps<T> {
  /** Key on each row used to identify it for selection/expansion/disabling. */
  idName: keyof T & string;
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  skeletonRows?: number;

  /** Theme overrides; unset tokens fall back to the default (table 1) palette. */
  theme?: Partial<CustomDataTableTheme>;
  className?: string;
  headerClassName?: string;
  rowClassName?: (row: T, index: number) => string;

  /** Checkbox column with select-all / indeterminate + multiselect. */
  selectable?: boolean;
  selectedIds?: RowId[];
  disabledIds?: RowId[];
  onSelectionChange?: (rows: T[]) => void;
  /** Keep checked rows when `pagingData.pageIndex` changes. Default `false` — selection clears on page change. */
  keepSelectedOnPageChange?: boolean;

  /** Expand/collapse column with a custom per-row detail renderer. */
  expandable?: boolean;
  renderExpandedRow?: (row: T) => ReactNode;
  defaultExpandedIds?: RowId[];
  expandOnRowClick?: boolean;
  /** Keep expanded rows when `pagingData.pageIndex` changes. Default `false` — expanded rows collapse on page change. */
  keepExpandedOnPageChange?: boolean;
  /** Allow multiple rows expanded at once. Default `false` — accordion-style, opening a row closes any other open row. Set `true` to allow several rows open simultaneously. */
  keepExpandedOnOtherRowOpen?: boolean;

  /** Single-column manual sort, mirrors the existing app tables' onSort contract. */
  onSort?: (sort: OnSortParam) => void;

  /** Drag-and-drop column reordering (checkbox/expand columns stay pinned). Default `false`. */
  isColumnSwitch?: boolean;

  /** External/manual pagination. Omit to render every row (optionally height-capped). */
  pagination?: boolean;
  pagingData?: CustomDataTablePagingData;
  onPaginationChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];

  /** Caps body height and makes it scroll (sticky header) instead of paginating. */
  maxHeight?: number;

  /** Icon+title+description heading. Only rendered when `headingInsideTable` is true. */
  tableHeading?: CustomDataTableHeading;
  /** Render `tableHeading` inside the table's own bordered card, above the header row, separated by a divider. Default `false` — no heading rendered. */
  headingInsideTable?: boolean;

  notFoundView?: () => ReactNode;
  emptyMessage?: string;
}

export type CustomDataTableHandle = {
  resetSelection: () => void;
  getSelectedRows: () => any[];
  expandAll: () => void;
  collapseAll: () => void;
};
