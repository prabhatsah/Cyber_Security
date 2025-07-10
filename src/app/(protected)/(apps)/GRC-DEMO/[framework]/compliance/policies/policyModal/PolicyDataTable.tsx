'use client'
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import PolicyModalForm from "./AddPolicyModal";

export default function PolicyTable({ userIdNameMap, riskLibraryData, riskCategoryData, policyData, profileData, dropDownControl }: { userIdNameMap: { value: string; label: string }[]; riskLibraryData: { value: string; label: string }[]; riskCategoryData: Record<string, any>[]; policyData: Record<string, any>[]; profileData: Record<string, any>; dropDownControl: { id: string; label: string; options: { id: string; label: string; description: string }[] }[] }) {
  const [openPolicyForm, setOpenPolicyForm] = useState<boolean>(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Record<string, any> | null>(null);
  const columns: DTColumnsProps<Record<string, any>>[] = [
    {
      accessorKey: "policyTitle",
      header: "Policy Title",
      cell: ({ row }) => (
        <div className="truncate max-w-[150px]" title={row.getValue("policyTitle")}>
          {row.getValue("policyTitle")}
        </div>
      ),
    },
    {
      accessorKey: "policyOwner",
      header: "Policy Owner",
      cell: ({ row }) => {
        const ownerId = row.original.policyOwner;
        const owner = userIdNameMap.find((u) => u.value === ownerId);
        return <div className="truncate max-w-[200px]" title={owner ? owner.label : ""}>{owner ? owner.label : "N/A"}</div>;
      },
    },
    {
      accessorKey: "policyStatement",
      header: "Policy Statement",
      cell: ({ row }) => (
        <div className="truncate max-w-[150px]" title={row.original.policyStatement}>
          {row.original.policyStatement || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="truncate max-w-[150px]" title={row.original.status}>
          {row.original.status}
        </div>
      ),
    },
    {
      accessorKey: "policyCategory",
      header: "Policy Category",
      cell: ({ row }) => (
        <div className="truncate max-w-[150px]" title={row.original.policyCategory || "N/A"}>
          {riskCategoryData[0]?.[row.original.policyCategory]?.['riskCategory'] || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "relatedRisk",
      header: "Related Risk",
      cell: ({ row }) => {
        const relatedRiskId = row.original.relatedRisk;
        const matchedRisk = riskLibraryData.find(risk => risk.riskId === relatedRiskId);
        return (
          <div className="truncate max-w-[150px]" title={matchedRisk?.riskLibName || "N/A"}>
            {matchedRisk?.riskLibName || "N/A"}
          </div>
        );
      }
    }
  ];

  function openModal(row: Record<string, string> | null) {
    setSelectedPolicy(null);
    setOpenPolicyForm(true);
  }

  const extraParams: DTExtraParamsProps = {
    actionMenu: {
      items: [
        {
          label: "Edit",
          visibility: (rowData) => {
             console.log("Row Data for Edit", rowData);
             return rowData?.status !== "Approved"; // Only show edit option if status is not Approved
          },
          onClick: (rowData) => {
            console.log("Edit Risk Scenario", rowData);
            setSelectedPolicy(rowData);
            setOpenPolicyForm(true);
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
      <DataTable data={policyData} columns={columns} extraParams={extraParams} />
      {openPolicyForm && (
        <PolicyModalForm open={openPolicyForm} setOpen={setOpenPolicyForm} userIdNameMap={userIdNameMap} riskLibraryData={riskLibraryData} riskCategoryData={riskCategoryData} profileData={profileData} editPolicy={selectedPolicy} dropDownControl={dropDownControl}/>
      )}
    </>
  )
}
