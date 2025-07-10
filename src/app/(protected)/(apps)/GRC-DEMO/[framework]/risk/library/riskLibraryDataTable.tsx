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
import { useRouter } from "next/navigation";
import {
    mapProcessName,
    startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { v4 } from "uuid";
import { Button } from "@/shadcn/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shadcn/ui/alert-dialog';
import { toast } from "sonner";




export default function RiskLibraryDataTable({ riskLibraryData, riskRegisterData, riskCategoryData }: { riskLibraryData: Record<string, any>[]; riskRegisterData: Record<string, any>[]; riskCategoryData: Record<string, any>[] }) {
    const [openRiskForm, setOpenRiskForm] = useState<boolean>(false);
    const [selectedRisk, setSelectedRisk] = useState<Record<string, any> | null>(null);
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState<Record<string, any> | null>(null);

    const router = useRouter();
    async function addInRegister(data: Record<string, any>) {
        const riskRegisterData = {
            riskLibraryId: data.riskId,
            riskRegisterID: v4(),
            riskName: data.riskLibName || "",
            riskDescription: data.description || "",
            riskVulnerability: data.vulnerability || "",
            riskCategory: data.category || "",
        };
        console.log("riskRegisterData", riskRegisterData);

        try {
            const riskRegisterProcessId = await mapProcessName({ processName: "Risk Register" });
            await startProcessV2({
                processId: riskRegisterProcessId,
                data: riskRegisterData,
                processIdentifierFields: "riskRegisterID",
            });

            toast.success("Added Successfully to Risk Register!", { duration: 2000 });
        } catch (error) {
            console.error("Failed to start risk register process:", error);
            toast.error("Failed to Add to Risk Register!", { duration: 2000 });
        }
        router.refresh();
    }


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
                    {riskCategoryData[0][row.original.category]['riskCategory']}
                </div>
            ),
        },
        // {
        //     accessorKey: "",
        //     header: "Status",
        //     cell: ({ row }) => {
        //         const rowData = row.original;
        //         const isAlreadyRegistered = riskRegisterData.some((entry) => entry.riskLibraryId === rowData.riskId);

        //         return isAlreadyRegistered ? (
        //             <Button variant="outline" className="w-20" disabled>Added</Button>
        //         ) : (
        //             <Button variant="outline" className="w-20" onClick={() => addInRegister(rowData)}>Add</Button>
        //         );
        //     },
        // }

        {
            accessorKey: "",
            header: "Status",
            cell: ({ row }) => {
                const rowData = row.original;
                const isAlreadyRegistered = riskRegisterData.some((entry) => entry.riskLibraryId === rowData.riskId);

                return isAlreadyRegistered ? (
                    <Button variant="outline" className="w-20" disabled>Added</Button>
                ) : (
                    <Button
                        variant="outline"
                        className="w-20"
                        onClick={() => {
                            setSelectedRowData(rowData);
                            setOpenAlertBox(true);
                        }}
                    >
                        Add
                    </Button>
                );
            },
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
    console.log("riskRegisterData", riskRegisterData);

    return (
        <>
            <div className="h-[90%] overflow-y-auto">
                <DataTable data={riskLibraryData} columns={columns} extraParams={extraParams} />
            </div>
            <RiskScenarioForm open={openRiskForm} setOpen={setOpenRiskForm} editRiskData={selectedRisk} riskCategoryData={riskCategoryData} riskRegisterData={riskRegisterData} />
            <AlertDialog open={openAlertBox} onOpenChange={setOpenAlertBox}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmation</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to add this risk to the Risk Register?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpenAlertBox(false)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            if (selectedRowData) {
                                addInRegister(selectedRowData);
                            }
                            setOpenAlertBox(false);
                        }}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
