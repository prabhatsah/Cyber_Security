"use client";
import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import {
    DTColumnsProps,
    DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus, X } from "lucide-react";
import RiskScenarioForm from "./RiskLibrararyModal";
import { useRouter } from "next/navigation";
import {
    getMyInstancesV2,
    invokeAction,
    mapProcessName,
    startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { v4 } from "uuid";
import { Button } from "@/shadcn/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shadcn/ui/alert-dialog';
import { toast } from "sonner";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";
import { ca } from "date-fns/locale";




export default function RiskLibraryDataTable({ riskLibraryData, riskRegisterData, riskCategoryData, globalRiskLibraryData, profileData, userActivityApprovalData }: { riskLibraryData: Record<string, any>[]; riskRegisterData: Record<string, any>[]; riskCategoryData: Record<string, any>[]; globalRiskLibraryData: Record<string, any>[]; profileData: Record<string, any>; userActivityApprovalData: Record<string, any> }) {

    const [openRiskForm, setOpenRiskForm] = useState<boolean>(false);
    const [selectedRisk, setSelectedRisk] = useState<Record<string, any> | null>(null);
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState<Record<string, any> | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [promptableRisks, setPromptableRisks] = useState([]);
    const [openNewRiskAlert, setOpenNewRiskAlert] = useState(false);

    console.log("riskLibraryData", riskLibraryData);
    console.log("globalRiskLibraryData", globalRiskLibraryData);

    console.log("profileData", profileData);
    const riskLibraryIds = useMemo(() => new Set(riskLibraryData.map(item => item.riskId)), [riskLibraryData]);

    const { ExistingData, NewData } = useMemo(() => {
        const existing = [];
        const newData = [];
        for (const globalRisk of globalRiskLibraryData) {
            if (riskLibraryIds.has(globalRisk.riskId)) {
                existing.push(globalRisk);
            } else {
                newData.push(globalRisk);
            }
        }
        return { ExistingData: existing, NewData: newData };
    }, [globalRiskLibraryData, riskLibraryIds]);
    // ExistingData now contains global risks that are already in riskLibraryData
    // NewData contains global risks that are not in riskLibraryData
    console.log("ExistingData", ExistingData);
    console.log("NewData", NewData);

    useEffect(() => {
        const risks = getPromptableNewRisks(NewData, userActivityApprovalData);
        setPromptableRisks(risks);
        setOpenNewRiskAlert(risks.length > 0);
    }, [NewData, userActivityApprovalData]);

    const router = useRouter();

    function getPromptableNewRisks(NewData, userActivityApprovalData) {
        // userActivityApprovalData is assumed to be an array of records like your payload
        // If it's an object, adjust accordingly
        const neverAskIds = new Set();
        const remindMeLaterIds = new Set();
        const now = new Date();

        if (Array.isArray(userActivityApprovalData)) {
            userActivityApprovalData.forEach(entry => {
                if (entry.action === "never_ask_again") {
                    entry.riskIds.forEach(id => neverAskIds.add(id));
                }
                if (entry.action === "remind_me_later") {
                    // Only skip if remindAfter is in the future
                    if (!entry.remindAfter || new Date(entry.remindAfter) > now) {
                        entry.riskIds.forEach(id => remindMeLaterIds.add(id));
                    }
                }
            });
        }

        // Only prompt for risks not in neverAskIds or remindMeLaterIds
        return NewData.filter(risk =>
            !neverAskIds.has(risk.riskId) && !remindMeLaterIds.has(risk.riskId)
        );
    }


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

    async function startTheInstance() {
        setIsProcessing(true);
        try {
            const findingProcessId = await mapProcessName({ processName: "Risk Library" });

            for (const data of promptableRisks) {
                await startProcessV2({
                    processId: findingProcessId,
                    data,
                    processIdentifierFields: "riskId",
                });
            }


            // const findingProcessIdOfActivity = await mapProcessName({ processName: "Activity Log for adding risk library from Global " });

            const ActivityLogInstance = await getMyInstancesV2({
                processName: "Activity Log for adding risk library from Global",
                predefinedFilters: { taskName: "Edit Activity" }
            })
            console.log("activity log --------------------->")
            console.log(ActivityLogInstance);

            if (ActivityLogInstance.length === 0) {
                const activityLogProcessId = await mapProcessName({ processName: "Activity Log for adding risk library from Global" });
                const activityLogPayload = {
                    lastAddedBy: profileData.USER_ID,
                    lastAddedOn: new Date().toISOString(),
                    Activity: [
                        {
                            lastAddedBy: profileData.USER_ID,
                            lastAddedOn: new Date().toISOString(),
                            riskAddedId: promptableRisks.map(risk => risk.riskId),
                        }
                    ]
                };
                await startProcessV2({
                    processId: activityLogProcessId,
                    data: activityLogPayload,
                    processIdentifierFields: "lastAddedBy",
                });
            }else{
                const taskId = ActivityLogInstance[0]?.taskId;
                console.log(taskId);
                console.log("activity log payload --------------------->")
                console.log(ActivityLogInstance[0]?.data);

                const updatedActivityData = ActivityLogInstance[0]?.data as Record<string, any>;

                updatedActivityData.lastAddedBy = profileData.USER_ID;
                updatedActivityData.lastAddedOn = new Date().toISOString();
                updatedActivityData.Activity.push({
                    lastAddedBy: profileData.USER_ID,
                    lastAddedOn: new Date().toISOString(),
                    riskAddedId: promptableRisks.map(risk => risk.riskId)
                })
                
                await invokeAction({
                    taskId: taskId,
                    data: updatedActivityData,
                    transitionName: 'update edit activity',
                    processInstanceIdentifierField: 'lastAddedBy'
                })
            }




        } catch (error) {
            console.error("Error starting global risk instances:", error);
        } finally {
            setIsProcessing(false);
            router.refresh();
        }
    }

    async function handleGlobalRiskPromptAction(
        action: "remind_me_later" | "never_ask_again",
        riskIds: string[]
    ) {
        const userId = profileData.USER_ID;
        const now = new Date();
        let payload: Record<string, any> = {
            userId,
            action,
            riskIds,
            timestamp: now.toISOString(),
        };

        if (action === "remind_me_later") {
            // Set remindAfter to 1 day later
             const remindAfter = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
            //const remindAfter = new Date(now.getTime() + 30 * 1000).toISOString();
            payload.remindAfter = remindAfter;
        }

        console.log("User prompt action saved:", payload);

        try {

            const userApprovalActivitiesInstance = await getMyInstancesV2({
                processName: "User Approval Activities",
                predefinedFilters: { taskName: "Edit User Acitivity" },
                mongoWhereClause: `this.Data.userId == "${userId}"`,
            })
            console.log(userApprovalActivitiesInstance);

            if (userApprovalActivitiesInstance.length === 0) {
                const userApprovalProcessId = await mapProcessName({ processName: "User Approval Activities" });
                console.log(userApprovalProcessId);
                await startProcessV2({
                    processId: userApprovalProcessId,
                    data: payload,
                    processIdentifierFields: "userId"
                })
            } else {
                const taskId = userApprovalActivitiesInstance[0]?.taskId;
                console.log(taskId);
                await invokeAction({
                    taskId: taskId,
                    data: payload,
                    transitionName: 'update edit user activity',
                    processInstanceIdentifierField: 'userId'
                })
            }

        } catch (error) {
            console.error("Error handling global risk prompt action:", error);
            toast.error("Failed to handle global risk prompt action!", { duration: 2000 });
        }


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


            {/* alter dialog for new risk from global risk library */}
            {/* <AlertDialog open={openNewRiskAlert} onOpenChange={setOpenNewRiskAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmation</AlertDialogTitle>
                        <AlertDialogDescription>
                            A new risk has been added in global configurator. Do you want to add those risks into your account?
                            <br />
                            <span className="font-semibold">
                                ({promptableRisks.length} new risk{promptableRisks.length > 1 ? "s" : ""} found)
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>

                        <AlertDialogAction
                            onClick={async () => {
                                setOpenNewRiskAlert(false);
                                await startTheInstance();
                            }}
                        >
                            Add Now
                        </AlertDialogAction>

                        <Button
                            variant="outline"
                            onClick={async () => {
                                setOpenNewRiskAlert(false);
                                await handleGlobalRiskPromptAction("remind_me_later", promptableRisks.map(risk => risk.riskId));
                            }}
                        >
                            Remind Me Later
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                setOpenNewRiskAlert(false);
                                await handleGlobalRiskPromptAction("never_ask_again", promptableRisks.map(risk => risk.riskId));
                            }}
                        >
                            Ask Never
                        </Button>

                        <AlertDialogCancel onClick={() => setOpenNewRiskAlert(false)}>
                            Cancel
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog> */}

            <AlertDialog open={openNewRiskAlert} onOpenChange={setOpenNewRiskAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmation</AlertDialogTitle>
                        <AlertDialogDescription>
                            A new risk has been added in global configurator. Do you want to add those risks into your account?
                            <br />
                            <span className="font-semibold">
                                ({promptableRisks.length} new risk{promptableRisks.length > 1 ? "s" : ""} found)
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* Close button */}
                    <AlertDialogCancel className="px-2 absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <X className="h-2 w-2" />
                        <span className="sr-only">Close</span>
                    </AlertDialogCancel>

                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={async () => {
                                setOpenNewRiskAlert(false);
                                await startTheInstance();
                            }}
                        >
                            Add Now
                        </AlertDialogAction>

                        <Button
                            variant="outline"
                            onClick={async () => {
                                setOpenNewRiskAlert(false);
                                await handleGlobalRiskPromptAction("remind_me_later", promptableRisks.map(risk => risk.riskId));
                            }}
                        >
                            Remind Me Later
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                setOpenNewRiskAlert(false);
                                await handleGlobalRiskPromptAction("never_ask_again", promptableRisks.map(risk => risk.riskId));
                            }}
                        >
                            Ask Never
                        </Button>

                        {/* This Cancel button is part of the footer, so it can stay here if desired,
          or you can remove it if the top-right X button is sufficient. */}
                        {/* <AlertDialogCancel onClick={() => setOpenNewRiskAlert(false)}>
        Cancel
      </AlertDialogCancel> */}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            {isProcessing && <LoadingSpinner size={60} />}


        </>
    )
}
