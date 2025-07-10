"use client";
import { DataTable } from "@/ikon/components/data-table";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import React, { useState } from "react";
import { Button } from "@/shadcn/ui/button";
import ControlNewForm from "../controlnewForm";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus, SquarePenIcon } from "lucide-react";
import ControlManagerModal from "../controlObjModal";

export default function ControlNewDataTable({
  controlNewDatas,
  controlObjData,
}: {
  controlNewDatas: any;
  controlObjData: any;
}) {
  console.log(controlNewDatas);

  const [openIncidentForm, setOpenIncidentForm] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<Record<string, string> | null>(null);

  function openModal(row: Record<string, string> | null) {
    setEditRow(row);
    setOpenIncidentForm(true);
  }

  const columnsControlNewTable: DTColumnsProps<Record<string, string>>[] = [
    {
      accessorKey: "framework",
      header: "Framework",
      cell: ({ row }) => {
        const formatted = row.original.framework
          .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
          .replace(/^./, str => str.toUpperCase()); // Capitalize first letter

        return <div className="capitalize">{formatted}</div>;
      },
    },
    {
      accessorKey: "frameworkType",
      header: "Framework Type",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.frameworkType}</div>
      ),
    },
    {
      accessorKey: "controlName",
      header: "Control Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.controlName}</div>
      ),
    },
    // {
    //   accessorKey: "controlObjectives",
    //   header: "Control Objectives",
    //   cell: ({ row }) => (
    //     <ul className="">
    //       {row.original.controlObjectives.map((objective: { name: string; description: string }, index: number) => (
    //         <li key={index}>
    //           <strong>{objective.name}</strong>
    //         </li>
    //       ))}
    //     </ul>
    //   ),
    // },
    {
      accessorKey: "controlObjectives",
      header: "Control Objectives",
      cell: ({ row }) => {
        const controlObjectives = Array.isArray(row.original.controlObjectives)
          ? row.original.controlObjectives
          : JSON.parse(row.original.controlObjectives || "[]");

        const objectiveNames = controlObjectives
          .map((objective: { name: string }) => objective.name)
          .join(", ");

        return (
          <div
            className="truncate max-w-[300px] whitespace-nowrap overflow-hidden text-ellipsis"
            title={objectiveNames} // Optional: tooltip with full names
          >
            {objectiveNames}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Action',
      enableHiding: false,
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => openModal(row.original)} // Pass the full row
        >
          <SquarePenIcon />
        </Button>
      ),
    },
  ];

  const extraParamsControlNewTable: DTExtraParamsProps = {
    extraTools: [
      <IconButtonWithTooltip
        tooltipContent="Add Control Objectives"
        onClick={() => openModal(null)}
      >
        <Plus />
      </IconButtonWithTooltip>,
    ],
  };
  return (
    <>
      <DataTable
        data={controlObjData}
        columns={columnsControlNewTable}
        extraParams={extraParamsControlNewTable}
      />
      {/* {openIncidentForm && (
        // <ControlNewForm
        //   open={openIncidentForm}
        //   setOpen={setOpenIncidentForm}
        //   dataOfFrameworks={controlNewDatas}
        //   editControlObj={editRow}
        // />
        <ControlManager
          open={openIncidentForm}
          setOpen={setOpenIncidentForm}
        />
      )} */}
      {openIncidentForm && (
        <ControlManagerModal
          open={openIncidentForm}
          setOpen={setOpenIncidentForm}
        />
      )}
    </>
  );
}
