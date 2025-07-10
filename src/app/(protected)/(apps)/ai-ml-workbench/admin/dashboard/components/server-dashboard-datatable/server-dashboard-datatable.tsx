"use client";

import { DataTable } from "@/ikon/components/data-table";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import { ServerDashboard } from "../../../../components/type";

const columns: DTColumnsProps<ServerDashboard, unknown>[] = [
  {
    header: "Items",
    accessorKey: "heading", // Use the correct key in your data
    cell: (row) => <span>{row.row.original.heading}</span>,
  },
  {
    header: "Value",
    accessorKey: "value",
    cell: (row) => <span>{row.row.original.value}</span>,
  },
];

const extraParams: DTExtraParamsProps = {
  grouping: false,
  paginationBar: false,
  defaultTools: false,
};

export default function ServerDashboardDataTable({
  serverDashboardData,
}: {
  serverDashboardData: ServerDashboard[];
}) {
  return (
    <>
      <DataTable
        columns={columns}
        data={serverDashboardData}
        extraParams={extraParams}
      />
    </>
  );
}
