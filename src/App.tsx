import { useMemo, useState, type ReactNode } from "react";
import { Eye, Trash2, X } from "lucide-react";
import type { ColumnDef, OnSortParam } from "./table";
import { CustomDataTable } from "./table";
import { cn } from "./lib/cn";

interface FinancierDealer {
  DealerId: string;
  DealerCode: string;
  DealerName: string;
  DealerLocationId: string;
  DealerLocationName: string;
  DealerLocationCode: string;
}

interface Financier {
  FinancierId: string;
  Title: string;
  FinancierCode: string;
  Logo: string;
  IsActive: boolean;
  Status: string;
  OnBoardedAt: string | null;
  OffBoardedAt: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  FinancierDealers: FinancierDealer[];
  TotalClusters: number;
  ActiveClusters: number;
  TotalDealers: number;
  ActiveDealers: number;
}

// Static mock — this is the `Data.items` array from the real API response.
// Swap ALL_FINANCIERS/API_META for a live fetch once the endpoint is ready;
// pagingData below is already wired to match the API's `meta` shape.
const ALL_FINANCIERS: Financier[] = [
  {
    FinancierId: "49afb97f-9720-40b0-b6d9-9bbb8028c2fd",
    Title: "IDFC First Bank",
    FinancierCode: "IFB-061",
    Logo: "https://devmedia.m-devsecops.com/dev/upload-master/files/30e2e7dc6766ba9f0afc2.png",
    IsActive: true,
    Status: "OnBoarded",
    OnBoardedAt: "2026-08-03T15:48:09.729Z",
    OffBoardedAt: null,
    CreatedAt: "2026-08-03T15:45:41.847Z",
    UpdatedAt: "2026-08-10T05:38:22.478Z",
    FinancierDealers: [
      {
        DealerId: "4d0642f2-49e1-4c29-8e98-54ca86d361bd",
        DealerCode: "MN010831",
        DealerName: "NEON MOTORS PVT LTD",
        DealerLocationId: "643b2df5-ed68-4ed0-bf55-2305673e9e43",
        DealerLocationName: "MAHABUBNAGAR",
        DealerLocationCode: "NE03",
      },
    ],
    TotalClusters: 17,
    ActiveClusters: 1,
    TotalDealers: 417,
    ActiveDealers: 20,
  },
  {
    FinancierId: "e6b2e82b-5eac-4828-b72e-25b1db6a4676",
    Title: "test12",
    FinancierCode: "TEST12-059",
    Logo: "https://devmedia.m-devsecops.com/dev/upload-master/files/648c30e2e7dc6766ba9f0.png",
    IsActive: true,
    Status: "OnBoarded",
    OnBoardedAt: "2026-08-03T15:36:03.184Z",
    OffBoardedAt: null,
    CreatedAt: "2026-07-31T13:30:34.369Z",
    UpdatedAt: "2026-08-07T09:14:05.950Z",
    FinancierDealers: [
      {
        DealerId: "ad410a72-caa6-431a-8184-a89fdf831ed3",
        DealerCode: "MP010901",
        DealerName: "PRIME AUTOMOBILES PVT LTD",
        DealerLocationId: "f2b5fe5f-b4b9-4059-9023-b8b288a81af9",
        DealerLocationName: "FARIDABAD_SH",
        DealerLocationCode: "PA06",
      },
    ],
    TotalClusters: 17,
    ActiveClusters: 2,
    TotalDealers: 417,
    ActiveDealers: 46,
  },
  {
    FinancierId: "78ff9059-1705-4195-bd4d-5b5b6de42740",
    Title: "Novo Finance test",
    FinancierCode: "NFT-058",
    Logo: "https://devmedia.m-devsecops.com/dev/upload-master/files/638648c30e2e7dc6766ba.png",
    IsActive: true,
    Status: "OnBoarded",
    OnBoardedAt: "2026-07-31T05:40:48.538Z",
    OffBoardedAt: null,
    CreatedAt: "2026-07-31T05:39:27.649Z",
    UpdatedAt: "2026-07-31T07:39:06.013Z",
    FinancierDealers: [
      {
        DealerId: "b0bea0d9-e772-4c6b-bab8-02ac9b41b873",
        DealerCode: "MB011191",
        DealerName: "BRAR AUTO WHEELS",
        DealerLocationId: "17b03413-78a9-4b37-bccf-274c4fb12f11",
        DealerLocationName: "MADB_ABOHAR_B011191",
        DealerLocationCode: "BR04",
      },
    ],
    TotalClusters: 17,
    ActiveClusters: 17,
    TotalDealers: 417,
    ActiveDealers: 412,
  },
  {
    FinancierId: "2fdeb4fa-503b-4a8c-9fba-273d26d2b533",
    Title: "INDUSIND",
    FinancierCode: "INDUSIND-057",
    Logo: "https://devmedia.m-devsecops.com/dev/upload-master/files/7638648c30e2e7dc6766b.png",
    IsActive: true,
    Status: "OnBoarded",
    OnBoardedAt: "2026-07-30T06:54:16.863Z",
    OffBoardedAt: null,
    CreatedAt: "2026-07-30T06:45:15.411Z",
    UpdatedAt: "2026-08-07T08:02:07.332Z",
    FinancierDealers: [
      {
        DealerId: "33fbebc8-c0cb-47a4-8eb2-3fe641d92e99",
        DealerCode: "MB010241",
        DealerName: "BAJARANG MOTORS",
        DealerLocationId: "3de35cce-877d-4aaf-b533-9c03fadac2ee",
        DealerLocationName: "BAGAESHWAR_SZZ",
        DealerLocationCode: "BAJ6",
      },
    ],
    TotalClusters: 17,
    ActiveClusters: 17,
    TotalDealers: 417,
    ActiveDealers: 412,
  },
  {
    FinancierId: "9c04643a-4d3c-4e1f-82b3-f362f0a2b8b5",
    Title: "Indian Overseas Bank",
    FinancierCode: "IOB-055",
    Logo: "https://devmedia.m-devsecops.com/dev/upload-master/files/e9dfdf2a304cd8bef308c.jpeg",
    IsActive: true,
    Status: "OnBoarded",
    OnBoardedAt: "2026-07-10T11:39:31.614Z",
    OffBoardedAt: null,
    CreatedAt: "2026-07-10T11:28:58.516Z",
    UpdatedAt: "2026-07-28T11:58:54.517Z",
    FinancierDealers: [
      {
        DealerId: "2613c1a4-9292-474c-9367-67b2d0145951",
        DealerCode: "MA011721",
        DealerName: "ASTRO INDIA AUTOMOBILE PVT LTD",
        DealerLocationId: "3db25de4-e9bb-413e-9b86-af0716439ee2",
        DealerLocationName: "CITY_TOPH_3S",
        DealerLocationCode: "AI15",
      },
    ],
    TotalClusters: 17,
    ActiveClusters: 13,
    TotalDealers: 417,
    ActiveDealers: 317,
  },
  {
    FinancierId: "d91390bf-2cad-460d-a3c7-cb38a9d75dc7",
    Title: "INDUSINDBANK",
    FinancierCode: "INDUSINDBANK-057",
    Logo: "https://devmedia.m-devsecops.com/dev/upload-master/files/8648c30e2e7dc6766ba9f.png",
    IsActive: true,
    Status: "OnBoarded",
    OnBoardedAt: "2026-07-28T11:58:36.826Z",
    OffBoardedAt: "2026-07-28T11:58:13.621Z",
    CreatedAt: "2026-07-09T10:02:00.737Z",
    UpdatedAt: "2026-08-07T11:28:56.655Z",
    FinancierDealers: [
      {
        DealerId: "8ed25c5a-9851-4041-8f66-c9bacce59dd5",
        DealerCode: "MC010671",
        DealerName: "CHENNAI EV",
        DealerLocationId: "b70a7643-063f-475c-842b-021f08e6d5a3",
        DealerLocationName: "CHENNAI CENTRAL_SH",
        DealerLocationCode: "CEV2",
      },
    ],
    TotalClusters: 17,
    ActiveClusters: 2,
    TotalDealers: 417,
    ActiveDealers: 39,
  },
  {
    FinancierId: "6576b078-ab8d-404a-98fd-62a3614b9979",
    Title: "testasdf",
    FinancierCode: "TESTASDF-053",
    Logo: "https://devmedia.m-devsecops.com/dev/upload-master/files/aae28fee40f1f3e0c472d.jpg",
    IsActive: true,
    Status: "OnBoarded",
    OnBoardedAt: "2026-07-28T11:58:14.908Z",
    OffBoardedAt: null,
    CreatedAt: "2026-07-02T12:04:44.911Z",
    UpdatedAt: "2026-07-28T11:58:14.935Z",
    FinancierDealers: [
      {
        DealerId: "f4ce5427-f787-4642-94d0-6341a7214083",
        DealerCode: "MS014531",
        DealerName: "SHREE KEDARNATH AUTOMOBILES",
        DealerLocationId: "e66e2b28-17dc-4958-be58-a98f3cc36cfd",
        DealerLocationName: "ANDAWA",
        DealerLocationCode: "SKD1",
      },
    ],
    TotalClusters: 17,
    ActiveClusters: 5,
    TotalDealers: 417,
    ActiveDealers: 136,
  },
  {
    FinancierId: "de24e30b-9a4e-4d0c-b12c-848f1b6dc00f",
    Title: "new bank",
    FinancierCode: "NB-048",
    Logo: "https://devmedia.m-devsecops.com/dev/upload-master/files/25cf4af7f4b0d32e55550.jpg",
    IsActive: true,
    Status: "OnBoarded",
    OnBoardedAt: "2026-07-28T11:58:45.560Z",
    OffBoardedAt: "2026-07-28T11:58:15.306Z",
    CreatedAt: "2026-04-23T08:54:01.435Z",
    UpdatedAt: "2026-07-28T11:58:45.626Z",
    FinancierDealers: [
      {
        DealerId: "81ed81f5-6a22-4452-9cc9-4adcb53d81c2",
        DealerCode: "MM011901",
        DealerName: "MAHARANI AUTOES",
        DealerLocationId: "6efa4b62-321e-4353-a6b6-68d55fa0fe53",
        DealerLocationName: "JAMUI_SH",
        DealerLocationCode: "MRA5",
      },
    ],
    TotalClusters: 17,
    ActiveClusters: 17,
    TotalDealers: 417,
    ActiveDealers: 412,
  },
  {
    FinancierId: "5b95ff76-12da-4b79-8e16-e6f070539109",
    Title: "testunion",
    FinancierCode: "TESTUNION-043",
    Logo: "https://devmedia.m-devsecops.com/dev/upload-master/files/6b784f87f91a379ffc5f5.png",
    IsActive: true,
    Status: "OnBoarded",
    OnBoardedAt: "2026-04-09T08:23:32.690Z",
    OffBoardedAt: null,
    CreatedAt: "2026-04-07T11:27:41.999Z",
    UpdatedAt: "2026-07-21T10:16:42.356Z",
    FinancierDealers: [
      {
        DealerId: "f14b743c-4b6d-484c-bf35-f56f8490e7c3",
        DealerCode: "MS011571",
        DealerName: "SREE RAVI RAJ AGRO SERVICE",
        DealerLocationId: "88fef0dd-9480-4428-8acf-679f12125515",
        DealerLocationName: "SRIKAKULAM_SH",
        DealerLocationCode: "SA02",
      },
    ],
    TotalClusters: 17,
    ActiveClusters: 10,
    TotalDealers: 417,
    ActiveDealers: 61,
  },
  {
    FinancierId: "15337a5d-e674-4a3b-bf34-ecaaa1164a24",
    Title: "Testpnb",
    FinancierCode: "TESTPNB-042",
    Logo: "https://devmedia.m-devsecops.com/dev/upload-master/files/16b784f87f91a379ffc5f.png",
    IsActive: true,
    Status: "OnBoarded",
    OnBoardedAt: "2026-04-23T08:55:09.602Z",
    OffBoardedAt: null,
    CreatedAt: "2026-04-07T11:26:20.279Z",
    UpdatedAt: "2026-08-07T14:10:33.757Z",
    FinancierDealers: [
      {
        DealerId: "fabe65fa-94cc-4d1d-9326-6da0c29e11a7",
        DealerCode: "MS010351",
        DealerName: "SRI RAMKRISHNA ENGG. WORKS",
        DealerLocationId: "aa3aa1eb-7230-44fe-9907-4c3fb4ba844b",
        DealerLocationName: "MANIPURI",
        DealerLocationCode: "SRE4",
      },
    ],
    TotalClusters: 17,
    ActiveClusters: 1,
    TotalDealers: 417,
    ActiveDealers: 27,
  },
];

// From the API response's `Data.meta` — real total across all pages, even
// though the mock above only holds this one page's 10 records.
const API_META = { totalItems: 31, currentPage: 1, totalPages: 4 };

function NotFound({
  icon,
  header,
  description,
}: {
  icon?: string;
  header: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl">
        {icon ? <img src={icon} alt="" className="h-full w-full object-contain" /> : "🔍"}
      </div>
      <div className="text-sm font-semibold text-gray-700">{header}</div>
      <div className="max-w-xs text-xs text-gray-500">{description}</div>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

const columns: ColumnDef<Financier>[] = [
  {
    accessorKey: "Logo",
    header: "Financier Logo",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <img
          src={row.original.Logo}
          alt=""
          className="h-10 w-20 object-contain"
        />
      </div>
    ),
  },
  {
    accessorKey: "Title",
    header: "Financier",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="min-w-0">
          <div className="font-medium truncate">{row.original.Title}</div>
          <div className="text-xs text-gray-500">{row.original.FinancierCode}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "Status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => {
      const isOnboarded = row.original.Status === "OnBoarded" && row.original.IsActive;
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
            isOnboarded ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
          )}
        >
          {row.original.Status}
        </span>
      );
    },
  },
  {
    id: "clusters",
    header: "Clusters (active/total)",
    enableSorting: false,
    cell: ({ row }) => `${row.original.ActiveClusters}/${row.original.TotalClusters}`,
  },
  {
    id: "dealers",
    header: "Dealers (active/total)",
    enableSorting: false,
    cell: ({ row }) => `${row.original.ActiveDealers}/${row.original.TotalDealers}`,
  },
  {
    accessorKey: "OnBoardedAt",
    header: "Onboarded",
    cell: ({ row }) =>
      row.original.OnBoardedAt
        ? new Date(row.original.OnBoardedAt).toLocaleDateString()
        : "—",
  },
];

export default function App() {
  const [pageIndex, setPageIndex] = useState(API_META.currentPage);
  const [sort, setSort] = useState<OnSortParam>({ key: "", order: "" });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewRow, setViewRow] = useState<Financier | null>(null);
  const [deleteRow, setDeleteRow] = useState<Financier | null>(null);

  const sorted = useMemo(() => {
    if (!sort.key) return ALL_FINANCIERS;
    const copy = [...ALL_FINANCIERS];
    copy.sort((a, b) => {
      const av = String(a[sort.key as keyof Financier]);
      const bv = String(b[sort.key as keyof Financier]);
      const cmp = av.localeCompare(bv);
      return sort.order === "desc" ? -cmp : cmp;
    });
    return copy;
  }, [sort]);

  const allColumns = useMemo<ColumnDef<Financier>[]>(
    () => [
      ...columns,
      {
        id: "action",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-start gap-2">
            <button
              type="button"
              title="View"
              aria-label="View"
              onClick={() => setViewRow(row.original)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Delete"
              aria-label="Delete"
              onClick={() => setDeleteRow(row.original)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div style={{ margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
        Custom Data Table Demo
      </h1>

      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 mb-4">
          <div className="text-sm font-medium text-gray-700">
            {selectedIds.length} row{selectedIds.length !== 1 ? "s" : ""} selected
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const lines = selectedIds.map((id) => {
                  const rowNumber =
                    ALL_FINANCIERS.findIndex((f) => f.FinancierId === id) + 1;
                  return `ID: ${id}, Row: ${rowNumber}`;
                });
                alert(lines.join("\n"));
              }}
              className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 h-auto rounded-md text-sm font-medium"
            >
              Alert rows
            </button>
          </div>
        </div>
      )}

      <CustomDataTable<Financier>
        theme={{
            headerBg: "",      // header field/background color
            headerText: "",    // header text color
            bodyBg: "",        // table data field/background color
            bodyText: "",      // table data text color
            accentColor: "",   // checkbox selectable color
            selectedRowBg: "", // selected row color
          }}
        idName="FinancierId"
        columns={allColumns}
        isColumnSwitch
        data={sorted}
        selectable={true}
        selectedIds={selectedIds}
        onSelectionChange={(rows) => setSelectedIds(rows.map((r) => r.FinancierId))}
        expandable={true}
        renderExpandedRow={(row) => (
          <div className="text-sm text-gray-700">
            <div className="mb-2 font-medium text-gray-800">Dealers</div>
            {row.FinancierDealers.length === 0 ? (
              <div className="text-gray-500">No dealers</div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pr-4 py-1 font-medium">Dealer Code</th>
                    <th className="pr-4 py-1 font-medium">Dealer Name</th>
                    <th className="pr-4 py-1 font-medium">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {row.FinancierDealers.map((dealer) => (
                    <tr key={dealer.DealerId} className="border-t border-gray-200">
                      <td className="pr-4 py-1">{dealer.DealerCode}</td>
                      <td className="pr-4 py-1">{dealer.DealerName}</td>
                      <td className="pr-4 py-1">
                        {dealer.DealerLocationName} ({dealer.DealerLocationCode})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        headingInsideTable={true}
        tableHeading={{
          icon: <Eye className="h-4 w-4" />,
          title: "Financier History",
          description: "Your onboarding timeline across financiers",
        }}
        onSort={setSort}
        pagination={true}
        pagingData={{
          total: API_META.totalItems,
          pageIndex,
          pageSize: ALL_FINANCIERS.length,
        }}
        onPaginationChange={setPageIndex}
        notFoundView={() => (
          <NotFound
            icon=""
            header="No Financier data found"
            description="Currently no financier data available"
          />
        )}
      />

      <p style={{ marginTop: 16, fontSize: 13, color: "#666" }}>
        Selected: {selectedIds.length ? selectedIds.join(", ") : "none"}
      </p>

      {viewRow && (
        <Modal title={viewRow.Title} onClose={() => setViewRow(null)}>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Financier Code</dt>
              <dd className="font-medium text-gray-800">{viewRow.FinancierCode}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Status</dt>
              <dd className="font-medium text-gray-800">{viewRow.Status}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Active</dt>
              <dd className="font-medium text-gray-800">{viewRow.IsActive ? "Yes" : "No"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Clusters (active/total)</dt>
              <dd className="font-medium text-gray-800">
                {viewRow.ActiveClusters}/{viewRow.TotalClusters}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Dealers (active/total)</dt>
              <dd className="font-medium text-gray-800">
                {viewRow.ActiveDealers}/{viewRow.TotalDealers}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Onboarded</dt>
              <dd className="font-medium text-gray-800">
                {viewRow.OnBoardedAt ? new Date(viewRow.OnBoardedAt).toLocaleString() : "—"}
              </dd>
            </div>
          </dl>
        </Modal>
      )}

      {deleteRow && (
        <Modal title="Delete Financier" onClose={() => setDeleteRow(null)}>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-800">{deleteRow.Title}</span>? This action
            cannot be undone.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteRow(null)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setDeleteRow(null)}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
