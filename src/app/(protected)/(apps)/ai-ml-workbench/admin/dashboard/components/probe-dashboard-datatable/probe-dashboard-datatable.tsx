"use client";

import { DataTable } from "@/ikon/components/data-table";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import { ProbeData } from "../../../../components/type";
import { format } from "date-fns";
import { VIEW_DATE_TIME_FORMAT } from "@/ikon/utils/config/const";

const columns: DTColumnsProps<ProbeData, unknown>[] = [
  {
    header: "Probe Name",
    accessorKey: "PROBE_NAME", // Use the correct key in your data
    cell: (row) => <span>{row.row.original.PROBE_NAME}</span>,
  },
  {
    header: "User",
    accessorKey: "USER_NAME",
    cell: (row) => <span>{row.row.original.USER_NAME}</span>,
  },
  {
    header: "Last Heartbeat",
    accessorKey: "LAST_HEARTBEAT",
    cell: (row) => (
      <span>
        {row.row.original.LAST_HEARTBEAT !== null
          ? format(row.row.original.LAST_HEARTBEAT, VIEW_DATE_TIME_FORMAT)
          : "NO HEARTBEAT"}
      </span>
    ),
  },
];

const extraParams: DTExtraParamsProps = {
  grouping: false,
  paginationBar: false,
  defaultTools: false,
};

export default function ProbeDashboardDataTable({
  probeDashboardData,
}: {
  probeDashboardData: ProbeData[];
}) {
  return (
    <>
      <DataTable
        columns={columns}
        data={probeDashboardData}
        extraParams={extraParams}
      />
    </>
  );
}
