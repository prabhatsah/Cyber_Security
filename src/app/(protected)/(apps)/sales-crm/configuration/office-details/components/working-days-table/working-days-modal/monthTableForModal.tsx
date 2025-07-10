"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";
import { Input } from "@/shadcn/ui/input";
import { useEffect, useState } from "react";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";

interface WorkingDaysDetailsData {
  year: string;
  month: string;
  workingDays: number;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface MonthTableProps {
  year: string;
  workingDaysDetails: Record<string, WorkingDaysDetailsData>;
  onUpdate: (updatedData: Record<string, WorkingDaysDetailsData>) => void;
}

function MonthTable({ year, workingDaysDetails, onUpdate }: MonthTableProps) {
  const [tableData, setTableData] = useState<WorkingDaysDetailsData[]>([]);

  useEffect(() => {
    const data = months.map((month) => ({
      year,
      month,
      workingDays: workingDaysDetails?.[month]?.workingDays ?? 0, // Default to 0 if no data
    }));
    setTableData(data);
  }, [year, workingDaysDetails]);

  const handleChange = (month: string, value: number) => {
    if (value < 0 || value > 31) return; // Prevent invalid days

    const updatedData = {
      ...workingDaysDetails,
      [month]: { year, month, workingDays: value },
    };

    onUpdate(updatedData);
    setTableData(Object.values(updatedData));
  };

  const columns: ColumnDef<WorkingDaysDetailsData>[] = [
    {
      accessorKey: "month",
      header: () => <div style={{ textAlign: "center" }}>Month</div>,
    },
    {
      accessorKey: "workingDays",
      header: () => <div style={{ textAlign: "center" }}>Working Days</div>,
      cell: ({ row }) => (
        <Input
          type="number"
          min="0"
          max="31"
          value={row.original.workingDays}
          onChange={(e) =>
            handleChange(row.original.month, Number(e.target.value))
          }
        />
      ),
    },
  ];

  const extraParams: DTExtraParamsProps = {
    paginationBar: false,
    grouping: false,
    defaultTools: false,
    sorting: false,
  };

  return (
    <DataTable columns={columns} data={tableData} extraParams={extraParams} />
  );
}

export default MonthTable;
