"use client";
import React, { useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import {
    DTColumnsProps,
    DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus } from "lucide-react";
import RiskScenarioForm from "./RiskLibrararyModal";


export default function RiskLibraryDataTable({ riskLibraryData, riskCategoryData, profileData }: { riskLibraryData: Record<string, any>[]; riskCategoryData: Record<string, any>[]; profileData: string }) {
    const [openRiskForm, setOpenRiskForm] = useState<boolean>(false);
    const [selectedRisk, setSelectedRisk] = useState<Record<string, any> | null>(null);
   
    const columns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: "riskLibName",
            header: "Risk Scenario",
            cell: ({ row }) => (
                <div className="truncate max-w-[300px]" title={row.getValue("riskLibName")}>
                    {row.getValue("riskLibName")}
                </div>
            ),
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <div className="truncate max-w-[300px]" title={row.getValue("description")}>
                    {row.getValue("description")}
                </div>
            ),
        },
        {
            accessorKey: "vulnerability",
            header: "Vulnerability",
            cell: ({ row }) => {
                const value = row.getValue("vulnerability");
                const displayValue = typeof value === "string" && value.trim() !== "" ? value : "N/A";

                return (
                    <div className="truncate max-w-[300px]" title={displayValue}>
                        {displayValue}
                    </div>
                );
            },
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => (
                <div className="truncate max-w-[300px]" title={row.getValue("category")}>
                    {riskCategoryData[0].riskCategory[row.original.category]['riskCategory']}
                </div>
            ),
        }
    ];

    const extraParams: DTExtraParamsProps = {
        pagination: false,
        actionMenu: {
            items: [
                {
                    label: "Edit",
                    onClick: (rowData) => {
                        console.log("Edit Risk Scenario", rowData);
                        setSelectedRisk(rowData);
                        setOpenRiskForm(true);
                    },
                },

            ],
        },
        extraTools: [
            <IconButtonWithTooltip
                key="add-risk-btn"
                tooltipContent="Add Risk Scenario"
                onClick={() => {
                    setSelectedRisk(null);
                    setOpenRiskForm(true);
                }}
            >
                <Plus />
            </IconButtonWithTooltip>,
        ],
    };
 

    return (
        <>
            <div className="h-[90%] overflow-y-auto">
                <DataTable data={riskLibraryData} columns={columns} extraParams={extraParams} />
            </div>
            <RiskScenarioForm open={openRiskForm} setOpen={setOpenRiskForm} editRiskData={selectedRisk} riskCategoryData={riskCategoryData} profileData={profileData}/>
        </>
    )
}
