interface LicenseDetailsPrpos {
  date: string;
  name: string;
  billed: number;
  unbilled: number;
  suspend: number;
}

import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<LicenseDetailsPrpos>[] = [
  {
    accessorKey: "date",
    header: () => <div style={{ textAlign: "center" }}>Date</div>,
    cell: ({ row }) => <span>{row.original?.date}</span>,
  },
  {
    accessorKey: "name",
    header: () => <div style={{ textAlign: "center" }}>Administration</div>,
    cell: ({ row }) => <span>{row.original?.name}</span>,
  },
  {
    accessorKey: "billed",
    header: () => <div style={{ textAlign: "center" }}>Billed Users</div>,
    cell: ({ row }) => <span>{row.original?.billed}</span>,
  },
  {
    accessorKey: "unbilled",
    header: () => <div style={{ textAlign: "center" }}>Unbilled Users</div>,
    cell: ({ row }) => <span>{row.original?.unbilled}</span>,
  },
  {
    accessorKey: "suspend",
    header: () => <div style={{ textAlign: "center" }}>Suspended Users</div>,
    cell: ({ row }) => <span>{row.original?.suspend}</span>,
  },
];




