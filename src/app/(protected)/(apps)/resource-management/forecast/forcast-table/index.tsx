"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { DataTable } from "@/ikon/components/data-table";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { ColumnDef } from "@tanstack/react-table";
import { renderResourceAllocationView } from "../../QueryForResource.tsx";

export default function ForecastTable() {
  const [tableData, setTableData] = useState<any>([]);
  const [monthKeysList, setMonthKeysList] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const renderResourceAllocation = await renderResourceAllocationView();
      const { filteredData, monthKeysList } = renderResourceAllocation;

      setTableData(filteredData);
      setMonthKeysList(generateNextSixMonths(monthKeysList));
    }
    fetchData();
  }, []);

  function generateNextSixMonths(allMonths: string[]) {
    const currentMonth = moment().format("MMM");
    const currentYear = moment().format("YYYY");
    const currentMonthKey = `${currentMonth}_${currentYear}`;
    
    const startIndex = allMonths.indexOf(currentMonthKey);
    return startIndex !== -1 ? allMonths.slice(startIndex, startIndex + 6) : [];
  }

  const columns: ColumnDef<any>[] = [
    { accessorKey: "employeeName", header: "Staff Name", cell: ({ row }) => row.original.employeeName || "N/A" },
    { accessorKey: "projectOrProspectName", header: "Project Name", cell: ({ row }) => row.original.projectOrProspectName || "N/A" },
    { accessorKey: "projectOrProspect", header: "Source", cell: ({ row }) => row.original.projectOrProspect || "N/A" },
    { accessorKey: "billableOrNonBillable", header: "Billable", cell: ({ row }) => row.original.billableOrNonBillable || "N/A" },
    { accessorKey: "resourceId", header: "Resource ID", cell: ({ row }) => row.original.resourceId || "N/A" },
  ];

  // Dynamically add FTE columns for the next 6 months
  const fteColumns: ColumnDef<any>[] = monthKeysList.map((monthKey) => ({
    accessorKey: `${monthKey}_fte`,
    header: monthKey.replace("_", " "),
    cell: ({ row }) => {
        const fteValue = parseFloat(row.original[`${monthKey}_fte`] || "0");
        return fteValue
    },
  }));

  const extraParams: DTExtraParamsProps = {};

  return (
    <div className="flex flex-col gap-3">
      <DataTable columns={[...columns, ...fteColumns]} data={tableData} extraParams={extraParams} />
    </div>
  );
}
