"use client";

import { DataTable } from "@/ikon/components/data-table";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import React, { useMemo, useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus, SquarePenIcon } from "lucide-react";
import ControlManagerModal from "../controlObjModal";

export default function ControlNewDataTable({
  frameworkData,
  controlObjData,
}: {
  frameworkData: any;
  controlObjData: any;
}) {
  const [openIncidentForm, setOpenIncidentForm] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<Record<string, string> | null>(null);

  // function openModal(row: Record<string, string> | null) {
  //   setEditRow(controlObjData);
  //   setOpenIncidentForm(true);
  // }

  function openModal(row: Record<string, string> | null) {
    if (!row) {
      setEditRow(null);
      setOpenIncidentForm(true);
      return;
    }
  
    const matchedFramework = controlObjData.find(
      (f: any) => f.framework === row.framework
    );
  
    const matchedControl = matchedFramework?.controls.find(
      (c: any) => c.controlName === row.controlName
    );
  
    const matchedControlObj = matchedControl?.controlObjectives.find(
      (obj: any) => obj.name === row.controlObjName
    );
  
    const fullData = {
      ...matchedFramework,
      ...matchedControl,
      ...matchedControlObj,
    };
  
    setEditRow(fullData);
    setOpenIncidentForm(true);
  }  

  // ✅ Flatten data to have one row per control objective
  const flattenedData = useMemo(() => {
    return controlObjData.flatMap((framework: any) =>
      framework.controls.flatMap((control: any) =>
        control.controlObjectives.map((objective: any) => ({
          framework: framework.framework,
          frameworkType: framework.frameworkType,
          controlName: control.controlName,
          controlObjName: objective.name,
        }))
      )
    );
  }, [controlObjData]);

  // ✅ Columns setup
  const columnsControlNewTable: DTColumnsProps<Record<string, string>>[] = [
    {
      accessorKey: "framework",
      header: "Framework",
      cell: ({ row }) => <div>{row.original.framework}</div>,
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
        <div className="truncate max-w-[300px]" title={row.original.controlName}>
          {row.original.controlName}
        </div>
      ),
    },
    {
      accessorKey: "controlObjName",
      header: "Control Objective",
      cell: ({ row }) => (
        <div className="truncate max-w-[500px]" title={row.original.controlObjName}>
          {row.original.controlObjName}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => openModal(row.original)}
        >
          <SquarePenIcon />
        </Button>
      ),
    },
  ];

  const extraParamsControlNewTable: DTExtraParamsProps = {
    extraTools: [
      <IconButtonWithTooltip
        key="add-btn"
        tooltipContent="Add Control Objective"
        onClick={() => openModal(null)}
      >
        <Plus />
      </IconButtonWithTooltip>,
    ],
    defaultGroups: ["frameworkType", "framework", "controlName"],

  };

  return (
    <>
    
      <DataTable
        data={flattenedData}
        columns={columnsControlNewTable}
        extraParams={extraParamsControlNewTable}
      />
   
      {openIncidentForm && (
        <ControlManagerModal
          open={openIncidentForm}
          setOpen={setOpenIncidentForm}
          frameworkData={frameworkData}
          editControlObj={editRow}
        />
      )}
    </>
  );
}
