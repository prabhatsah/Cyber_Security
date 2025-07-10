"use client";
// import { DataTable } from "@/components/ikon-components/data-table";
// import { DTColumnsProps } from "@/components/ikon-components/data-table/type";
import React from "react";
import { ProjectData } from "../../../../components/type";
// import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import CreateProjectButtonWithModal from "../create-project";
import { format } from "date-fns";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { Button } from "@/shadcn/ui/button";
import { DataTable } from "@/ikon/components/data-table";
// import { VIEW_DATE_TIME_FORMAT } from "@/config/const";
// Column Schema
const columns: DTColumnsProps<ProjectData>[] = [
  {
    accessorKey: "projectName",
    header: ({ column }) => (
      <div style={{ textAlign: "center" }}>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project Name
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: (info: any) => (
      <Link
        className="underline"
        href={
          "../lead/details/" + info.row.original.leadIdentifier + "/event-tab"
        }
      >
        {info.getValue()}
      </Link>
    ),
    getGroupingValue: (row) => `${row.projectName}`,
  },
  {
    accessorKey: "assignmentDetails.assignmentName",
    header: () => <div style={{ textAlign: "center" }}>Assignment</div>,
    cell: ({ row }) => (
      <span>{row.original.assignmentDetails.assignmentName || "n/a"}</span>
    ),
  },
  {
    accessorKey: "assignmentDetails.createdBy",
    header: "Created By",
    cell: ({ row }) => (
      <span>{row.original.assignmentDetails.createdBy || "n/a"}</span>
    ),
  },
  {
    accessorKey: "assignmentDetails.createdOn",
    header: "Created On",
    cell: ({ row }) => (
      <span>{row.original.assignmentDetails.createdOn || "n/a"}</span>
    ),
  },
  {
    accessorKey: "assignmentDetails.assigneeTime",
    header: "Last Updated",
    cell: ({ row }) => (
      <span>{row.original.assignmentDetails.assigneeTime || "n/a"}</span>
    ),
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: (row) => (
      <button
        className="bg-blue-500 text-white px-4 py-1 rounded"
        onClick={() =>
          alert(`Action clicked for ${row.row.original.projectName}`)
        }
      >
        Action
      </button>
    ),
  },
];
const extraParams: any = {
  searching: true,
  filtering: true,
  grouping: true,
  extraTools: [<CreateProjectButtonWithModal />],
};
function ProjectDataTable({ projectsData }: { projectsData: ProjectData[] }) {
  return (
    <DataTable
      columns={columns}
      data={projectsData}
      extraParams={extraParams}
    />
  );
}

export default ProjectDataTable;
