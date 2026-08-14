# custom-data-table

A standalone, themeable React data table built on
[`@tanstack/react-table`](https://tanstack.com/table) — row selection, row
expansion, single-column sorting, pagination, drag-to-reorder columns, and a
built-in heading card, all styled through CSS variables (a `theme` prop)
instead of hardcoded Tailwind color classes.

Originally extracted from an internal app's `custom-data-table` component,
now developed and versioned independently.

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Requirements / mandatory setup](#requirements--mandatory-setup)
- [Quick start](#quick-start)
- [Props reference](#props-reference)
- [Theming](#theming)
- [Columns](#columns)
- [Selection](#selection)
- [Row expansion](#row-expansion)
- [Sorting](#sorting)
- [Pagination](#pagination)
- [Using with a real API](#using-with-a-real-api)
- [Column reordering](#column-reordering)
- [Table heading](#table-heading)
- [Empty / not-found state](#empty--not-found-state)
- [Imperative handle (ref)](#imperative-handle-ref)
- [Development](#development)
- [Building](#building)
- [Publishing](#publishing)
- [License](#license)

## Features

- ✅ Row selection — checkbox column, select-all, indeterminate state, per-row disable
- ✅ Row expansion — custom detail renderer, accordion or multi-open modes
- ✅ Single-column sort (asc/desc/none) with a manual `onSort` callback
- ✅ External/manual pagination, or an internal max-height scroll mode
- ✅ Drag-and-drop column reordering
- ✅ Optional icon + title + description heading, rendered inside the table's own card
- ✅ Loading skeleton rows and a customizable empty/not-found state
- ✅ Fully themeable via CSS variables — no hardcoded colors to override
- ✅ TypeScript-first, generic over your row type

## Installation

```bash
npm install @yadavaman01/custom-data-table
```

`react` and `react-dom` are **peer dependencies** — install them yourself if
your project doesn't already have them:

```bash
npm install react react-dom
```

`@tanstack/react-table` and `lucide-react` are installed automatically as
regular dependencies of this package (they are not bundled into `dist/`, but
npm will fetch them for you). You don't need to install them yourself unless
you also use them directly elsewhere in your app.

## Requirements / mandatory setup

This is **not optional** — skipping it will make the table look broken:

**Tailwind must be able to see this package's compiled class names.** The
table's own styling is a small set of Tailwind utility classes compiled into
`dist/`. If your app uses Tailwind, extend its `content` glob so those
classes aren't purged:

```js
// tailwind.config.js
content: [
  // ...your existing entries
  "./node_modules/@yadavaman01/custom-data-table/dist/**/*.{js,mjs}",
],
```

If your app does **not** use Tailwind at all, the table still renders — but
only the classes present in `dist/` at build time exist as CSS nowhere, so
nothing will be styled. This package assumes a Tailwind host app.

Everything else (colors, radius, etc.) ships with sensible concrete
defaults — see [Theming](#theming) if you want to customize them, but there's
nothing else you *have* to configure.

## Quick start

```tsx
import { useState } from "react";
import { CustomDataTable, type ColumnDef } from "@yadavaman01/custom-data-table";

interface Person {
  id: number;
  name: string;
  role: string;
}

const columns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "role", header: "Role" },
];

const data: Person[] = [
  { id: 1, name: "Ada Lovelace", role: "Engineer" },
  { id: 2, name: "Grace Hopper", role: "Engineer" },
];

export default function App() {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  return (
    <CustomDataTable<Person>
      idName="id"
      columns={columns}
      data={data}
      selectable
      selectedIds={selectedIds}
      onSelectionChange={(rows) => setSelectedIds(rows.map((r) => r.id))}
    />
  );
}
```

## Props reference

### Core (required)

| Prop | Type | Description |
|---|---|---|
| `idName` | `keyof T & string` | The field on each row used as its unique identity — drives selection, expansion, `disabledIds`, and React keys. Must be a real key of your row type. |
| `columns` | `ColumnDef<T>[]` | Column definitions, passed straight through to `@tanstack/react-table`. See [Columns](#columns). |
| `data` | `T[]` | The rows to render. The table never mutates this array — reordering, sorting, etc. all report back via callbacks instead. |

### General

| Prop | Type | Default | Description |
|---|---|---|---|
| `loading` | `boolean` | `false` | Renders `skeletonRows` animated placeholder rows instead of `data`. |
| `skeletonRows` | `number` | `5` | Number of skeleton rows shown while `loading`. |
| `className` | `string` | — | Extra class names on the table's outer wrapper `<div>`. |
| `headerClassName` | `string` | — | Extra class names merged onto every `<th>`. |
| `rowClassName` | `(row: T, index: number) => string` | — | Per-row extra class names, e.g. to highlight rows conditionally. |
| `maxHeight` | `number` | — | Caps the table body height (px) and makes it scroll internally with a sticky header, instead of paginating. Mutually exclusive in practice with `pagination`. |
| `notFoundView` | `() => ReactNode` | — | Custom empty-state renderer. Called only when `!loading && data.length === 0`. See [Empty / not-found state](#empty--not-found-state). |
| `emptyMessage` | `string` | `"No data available"` | Fallback empty-state text used when `notFoundView` isn't provided. |

### Theming

| Prop | Type | Description |
|---|---|---|
| `theme` | `Partial<CustomDataTableTheme>` | Override any subset of the default color/spacing tokens. Unset keys fall back to the default. See [Theming](#theming). |

### Selection

| Prop | Type | Default | Description |
|---|---|---|---|
| `selectable` | `boolean` | `false` | Adds a checkbox column with select-all + indeterminate state. |
| `selectedIds` | `RowId[]` | — | Controlled selection — pass this to drive selection from your own state. |
| `disabledIds` | `RowId[]` | `[]` | Row ids whose checkbox is disabled (rendered greyed-out, not clickable). |
| `onSelectionChange` | `(rows: T[]) => void` | — | Called with the full list of currently-selected row objects on every change. |
| `keepSelectedOnPageChange` | `boolean` | `false` | If `false`, selection clears automatically whenever `pagingData.pageIndex` changes. |

### Row expansion

| Prop | Type | Default | Description |
|---|---|---|---|
| `expandable` | `boolean` | `false` | Adds a chevron column that toggles a per-row detail section. |
| `renderExpandedRow` | `(row: T) => ReactNode` | — | Renders the expanded content for a row. Required for `expandable` to show anything. |
| `defaultExpandedIds` | `RowId[]` | `[]` | Row ids expanded on initial mount. |
| `expandOnRowClick` | `boolean` | `false` | If `true`, clicking anywhere on the row (not just the chevron) toggles expansion. |
| `keepExpandedOnPageChange` | `boolean` | `false` | If `false`, expanded rows collapse automatically whenever `pagingData.pageIndex` changes. |
| `keepExpandedOnOtherRowOpen` | `boolean` | `false` | If `false` (default), expanding a row **closes any other open row** — accordion behavior. Set `true` to allow multiple rows expanded simultaneously. |

### Sorting

| Prop | Type | Description |
|---|---|---|
| `onSort` | `(sort: OnSortParam) => void` | Called whenever the user clicks a sortable column header. `OnSortParam` is `{ key: string; order: "asc" \| "desc" \| "" }`. The table does **not** sort `data` itself — you own the sort, typically re-fetching or re-sorting your own state in response. See [Sorting](#sorting). |

### Pagination

| Prop | Type | Default | Description |
|---|---|---|---|
| `pagination` | `boolean` | `false` | Enables the pagination footer. Requires `pagingData`. |
| `pagingData` | `{ total: number; pageIndex: number; pageSize: number }` | — | Current pagination state, owned by you. `pageIndex` is 1-based. |
| `onPaginationChange` | `(page: number) => void` | — | Called with the new 1-based page index when the user clicks a page number or prev/next. |
| `onPageSizeChange` | `(size: number) => void` | — | Called with the new page size when the user changes the "rows per page" select. |
| `pageSizeOptions` | `number[]` | `[5, 10, 20, 50]` | Options shown in the page-size dropdown. |

The table renders `data` as-is — it does **not** slice it by page internally.
If you're paginating client-side, slice `data` to the current page yourself
before passing it in; if server-side, `data` should already be just that
page's rows and `pagingData.total` should be the full remote count.

### Column reordering

| Prop | Type | Default | Description |
|---|---|---|---|
| `isColumnSwitch` | `boolean` | `false` | Enables drag-and-drop column reordering via a grip handle in each header. The checkbox and expand columns stay pinned in place and are not draggable. |

### Table heading

| Prop | Type | Default | Description |
|---|---|---|---|
| `tableHeading` | `{ icon?: ReactNode; title: string; description?: string }` | — | Icon + title + description content for a heading section. |
| `headingInsideTable` | `boolean` | `false` | Renders `tableHeading` inside the table's own bordered card, above the column headers, separated by a divider. Has no effect if `tableHeading` isn't also provided. |

## Theming

Pass a `theme` prop with any subset of these keys — anything you omit falls
back to the default:

| Key | Default | Affects |
|---|---|---|
| `headerBg` | `#F3F4F6` | Column header row background |
| `headerText` | `#374151` | Column header text |
| `bodyBg` | `#FFFFFF` | Row background |
| `bodyText` | `#111827` | Row text |
| `borderColor` | `#D1D5DB` | Outer table border |
| `rowBorderColor` | `#E5E7EB` | Row divider lines |
| `rowHoverBg` | `#F9FAFB` | Row hover background |
| `selectedRowBg` | `#EFF6FF` | Selected row background |
| `accentColor` | `#2563EB` | Checkbox tint, active pagination page, focus rings, drag-reorder outline |
| `expandIconColor` | `#6B7280` | Expand chevron / drag-handle icon color |
| `emptyStateText` | `#6B7280` | Empty-state and heading description text |
| `radius` | `0.75rem` | Outer table corner radius |

Falsy overrides (e.g. accidentally passing `""`) are ignored and fall back to
the default rather than breaking the corresponding CSS variable.

```tsx
<CustomDataTable
  theme={{
    accentColor: "#2563EB",
    selectedRowBg: "#DBEAFE",
    radius: "0.5rem",
  }}
  // ...
/>
```

## Columns

`columns` is a standard TanStack Table `ColumnDef<T>[]` — see the
[TanStack Table column def docs](https://tanstack.com/table/latest/docs/guide/column-defs)
for the full API. Two patterns used throughout this table:

```tsx
// A column backed by a real field — sortable by default, gets its `id`
// from the accessorKey, and is what `onSort`'s `key` will report.
{ accessorKey: "name", header: "Name" }

// A computed/display-only column with no single backing field — give it
// an explicit `id` and disable sorting (there's no value to sort by).
{
  id: "fullAddress",
  header: "Address",
  enableSorting: false,
  cell: ({ row }) => `${row.original.street}, ${row.original.city}`,
}
```

Every `accessorKey`-based column is sortable by default (TanStack's default),
even ones where sorting doesn't make sense (e.g. an image URL) — set
`enableSorting: false` explicitly on any column you don't want sortable.

## Selection

```tsx
const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

<CustomDataTable
  idName="id"
  selectable
  selectedIds={selectedIds}
  disabledIds={[3, 7]} // e.g. rows that can't be selected
  onSelectionChange={(rows) => setSelectedIds(rows.map((r) => r.id))}
  keepSelectedOnPageChange={false} // default: clears on page change
  // ...
/>
```

## Row expansion

```tsx
<CustomDataTable
  expandable
  expandOnRowClick
  keepExpandedOnOtherRowOpen={false} // default: accordion, one row open at a time
  renderExpandedRow={(row) => (
    <div className="text-sm text-gray-600">
      Row detail: {JSON.stringify(row)}
    </div>
  )}
  // ...
/>
```

## Sorting

```tsx
const [sort, setSort] = useState<OnSortParam>({ key: "", order: "" });

<CustomDataTable onSort={setSort} /* ... */ />

// Re-sort your own data (client-side) or refetch (server-side) whenever
// `sort` changes — the table only reports the user's intent.
```

## Pagination

```tsx
const [pageIndex, setPageIndex] = useState(1);
const [pageSize, setPageSize] = useState(10);

<CustomDataTable
  pagination
  pagingData={{ total: allRows.length, pageIndex, pageSize }}
  onPaginationChange={setPageIndex}
  onPageSizeChange={(size) => {
    setPageSize(size);
    setPageIndex(1);
  }}
  data={allRows.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)}
  // ...
/>
```

## Using with a real API

The table never owns data or fetching — it only reports user intent (page
changed, sort changed) via callbacks. You own the fetch and feed the
response straight back in. This is the full loop, combining
[Sorting](#sorting) and [Pagination](#pagination) with a live endpoint:

```tsx
// 1. Type the API response shape
interface ApiResponse<T> {
  IsSuccess: boolean;
  Data: {
    items: T[];
    meta: { totalItems: number; currentPage: number; totalPages: number };
  };
}

function PeopleTable() {
  // 2. State for what the table needs to report back
  const [data, setData] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<OnSortParam>({ key: "", order: "" });
  const [total, setTotal] = useState(0);

  // 3. Fetch whenever page/pageSize/sort changes
  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/people?page=${pageIndex}&pageSize=${pageSize}&sortKey=${sort.key}&sortOrder=${sort.order}`
    )
      .then((res) => res.json())
      .then((json: ApiResponse<Person>) => {
        setData(json.Data.items); // API response items go straight into `data`
        setTotal(json.Data.meta.totalItems);
      })
      .finally(() => setLoading(false));
  }, [pageIndex, pageSize, sort]);

  // 4. Wire it all in — every prop here just hands the table's reported
  // intent back into step 3's state
  return (
    <CustomDataTable<Person>
      idName="id"
      columns={columns}
      data={data}
      loading={loading}
      onSort={setSort}
      pagination
      pagingData={{ total, pageIndex, pageSize }}
      onPaginationChange={setPageIndex}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setPageIndex(1);
      }}
    />
  );
}
```

The loop: table fires `onSort`/`onPaginationChange` → your state changes →
`useEffect` refetches → the response repopulates `data`/`total` → the table
re-renders with the new page. Selection, expansion, theming, etc. all layer
on top of this same pattern independently — see their respective sections
above.

## Column reordering

```tsx
<CustomDataTable isColumnSwitch /* ... */ />
```

Drag a column header by its grip handle to reorder it. The checkbox and
expand columns are excluded and always stay in place.

## Table heading

```tsx
<CustomDataTable
  headingInsideTable
  tableHeading={{
    icon: <History className="h-4 w-4" />,
    title: "Project History",
    description: "Your allocation timeline across projects",
  }}
  // ...
/>
```

## Empty / not-found state

```tsx
<CustomDataTable
  emptyMessage="No records match your filters"
  // or, for full control:
  notFoundView={() => (
    <div className="flex flex-col items-center py-14 text-center">
      <div className="text-sm font-semibold">No data found</div>
      <div className="text-xs text-gray-500">Try adjusting your search.</div>
    </div>
  )}
  // ...
/>
```

## Imperative handle (ref)

```tsx
import { useRef } from "react";
import { CustomDataTable, type CustomDataTableHandle } from "@yadavaman01/custom-data-table";

const tableRef = useRef<CustomDataTableHandle>(null);

<CustomDataTable ref={tableRef} /* ... */ />;

tableRef.current?.resetSelection();      // clears selection
tableRef.current?.getSelectedRows();     // T[] currently selected
tableRef.current?.expandAll();           // expands every row
tableRef.current?.collapseAll();         // collapses every row
```

## Development

```bash
git clone https://github.com/yadavaman01/CustomDataTable.git
cd CustomDataTable
npm install
npm run dev       # demo playground at src/App.tsx, http://localhost:5173
```

`src/App.tsx` is a local development playground only — it is never included
in the published package (see [Publishing](#publishing)).

## Building

```bash
npm run build:lib   # library build -> dist/ (ESM + CJS + .d.ts)
npm run build       # typecheck + demo app build -> demo-dist/ (for local preview only)
```

## Publishing

This package ships **only** what `package.json`'s `"files"` field lists
(currently `["dist"]`), plus the files npm always includes automatically
(`package.json`, `README.md`, `LICENSE`). Nothing else in the repo —
`src/App.tsx`, demo data, `index.html`, configs — is ever part of what a
consumer downloads.

Steps to publish a new version:

1. **One-time setup** (skip if already done):
   ```bash
   npm login
   ```

2. **Make your changes**, verify locally:
   ```bash
   npx tsc -b --noEmit
   npm run build:lib
   npm pack --dry-run   # inspect exactly what would be published
   ```

3. **Bump the version** (semver — patch for fixes, minor for new
   backwards-compatible props, major for breaking changes):
   ```bash
   npm version patch   # or: minor / major
   ```

4. **Publish**:
   ```bash
   npm publish
   ```
   The `prepublishOnly` script runs `npm run build:lib` automatically before
   publishing, so `dist/` is always freshly built — you can't accidentally
   publish stale output.

5. **Verify**: check `https://www.npmjs.com/package/@yadavaman01/custom-data-table`
   and/or run `npm view @yadavaman01/custom-data-table` to confirm the new
   version is live.

A consumer then installs it the normal way:

```bash
npm install @yadavaman01/custom-data-table
```

## License

[MIT](./LICENSE)
