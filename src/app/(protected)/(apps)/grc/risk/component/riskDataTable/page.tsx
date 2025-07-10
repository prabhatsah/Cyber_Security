"use client";
import { DataTable } from "@/ikon/components/data-table";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import React, { useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus, SquarePenIcon } from "lucide-react";

export default function RiskDataTable({
  riskData
}: {
    riskData: any;
}) {
  console.log("riskData");
  console.log(riskData);

  

  const columnsRiskTable: DTColumnsProps<Record<string, string>>[] = [
    {
      accessorKey: "riskTitle",
      header: "Risk Title"
    },
    {
        accessorKey: "category",
        header: "Category"
    },
    {
        accessorKey: "riskScore",
        header: "Risk Score"
    },
    {
        accessorKey: "priority",
        header: "Priority"
    },
    {
        accessorKey: "assignedTo",
        header: "Assigned To"
    },
    {
        accessorKey: "status",
        header: "Status"
    }
  ];

  const extraParamsRiskTable: DTExtraParamsProps = {
    extraTools: [
      <IconButtonWithTooltip
        tooltipContent="Add Risk(Work in Progress)"
        
      >
        <Plus />
      </IconButtonWithTooltip>,
    ],
    actionMenu: {
        items: [
            {
                label: "Edit",
            },
            {
                label: "View Details",
            },
            {
                label: "Close risk",
            }
        ]
    },
  };
  return (
    <>
      <DataTable
        data={riskData}
        columns={columnsRiskTable}
        extraParams={extraParamsRiskTable}
      />
    </>
  );
}
