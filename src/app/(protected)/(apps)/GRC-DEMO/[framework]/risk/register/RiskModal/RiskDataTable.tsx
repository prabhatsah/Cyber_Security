'use client'
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import RiskRegisterForm from "./RiskRegisterModal";

export default function RiskDataTable({ userIdNameMap, profileData, riskLibraryData, riskRegisterData, riskCategoryData, riskImpactData }: { userIdNameMap: { value: string; label: string }[]; profileData: Record<string, any> ;riskLibraryData: { value: string; label: string }[]; riskRegisterData: Record<string, any>[]; riskCategoryData: Record<string, any>[]; riskImpactData: Record<string, any>[] }) {
  const [openRegisterForm, setOpenRegisterForm] = useState<boolean>(false);
  const [selectedRegister, setSelectedRegister] = useState<Record<string, any> | null>(null);
  const columns: DTColumnsProps<Record<string, any>>[] = [
    {
      accessorKey: "riskName",
      header: "Risk",
      cell: ({ row }) => (
        <div className="truncate max-w-[150px]" title={row.getValue("riskName")}>
          {row.getValue("riskName")}
        </div>
      ),
    },
    {
      accessorKey: "riskCategory",
      header: "Category",
      cell: ({ row }) => (
        <div className="truncate max-w-[300px]" title={row.original.riskCategory}>
          {riskCategoryData[0][row.original.riskCategory]['riskCategory']}
        </div>
      ),
    },
    {
      accessorKey: "riskImpact",
      header: "Impact",
      cell: ({ row }) => (
        <div className="truncate max-w-[150px]" title={row.original.riskImpact}>
          {row.original.riskImpact && riskImpactData[0][row.original.riskImpact]
            ? riskImpactData[0][row.original.riskImpact]['riskImpact']
            : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "riskLikelihood",
      header: "Likelihood",
      cell: ({ row }) => (
        <div className="truncate max-w-[150px]" title={row.original.riskLikelihood}>
          {row.original.riskLikelihood}
        </div>
      ),
    },
    {
      accessorKey: "riskOwner",
      header: "Owner",
      cell: ({ row }) => {
        const ownerId = row.original.riskOwner;
        // userIdNameMap should be available in the component's scope
        const owner = userIdNameMap.find((u) => u.value === ownerId);
        return <div className="truncate max-w-[200px]" title={owner ? owner.label : ""}>{owner ? owner.label : ""}</div>;
      },
    },
    {
      accessorKey: "dueDate",
      header: "Action Due Date",
      cell: ({ row }) => (
        <div className="truncate max-w-[150px]" title={row.original.dueDate}>
          {row.original.dueDate || "N/A"}
        </div>
      ),
    },
  ];

  function openModal(row: Record<string, string> | null) {
    setSelectedRegister(null);
    setOpenRegisterForm(true);
  }

  const extraParams: DTExtraParamsProps = {
    actionMenu: {
      items: [
        {
          label: "Edit",
          onClick: (rowData) => {
            console.log("Edit Risk Scenario", rowData);
            setSelectedRegister(rowData);
            setOpenRegisterForm(true);
          },
        },

      ],
    },
    extraTools: [
      <IconButtonWithTooltip
        key="add-btn"
        tooltipContent="Add Risk"
        onClick={() => 
          openModal(null)
        }
      >
        <Plus />
      </IconButtonWithTooltip>,
    ],
  };
  return (
    <>
      <DataTable data={riskRegisterData} columns={columns} extraParams={extraParams} />
      {openRegisterForm && (
        <RiskRegisterForm open={openRegisterForm} setOpen={setOpenRegisterForm} userIdNameMap={userIdNameMap} profileData={profileData} riskLibraryData={riskLibraryData} riskRegisterData={riskRegisterData} riskCategoryData={riskCategoryData} riskImpactData={riskImpactData} editRisk={selectedRegister} />
      )}
    </>
  )
}
