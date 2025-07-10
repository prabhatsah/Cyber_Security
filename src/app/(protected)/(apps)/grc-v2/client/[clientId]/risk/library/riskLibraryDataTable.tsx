// "use client";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { DataTable } from "@/ikon/components/data-table";
// import {
//     DTColumnsProps,
//     DTExtraParamsProps,
// } from "@/ikon/components/data-table/type";
// import { IconButtonWithTooltip } from "@/ikon/components/buttons";
// import { Plus, X } from "lucide-react";
// import RiskScenarioForm from "./RiskLibrararyModal";
// import { useRouter } from "next/navigation";
// import {
//     getMyInstancesV2,
//     invokeAction,
//     mapProcessName,
//     startProcessV2,
// } from "@/ikon/utils/api/processRuntimeService";
// import { v4 } from "uuid";
// import { Button } from "@/shadcn/ui/button";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shadcn/ui/alert-dialog';
// import { toast } from "sonner";
// import { LoadingSpinner } from "@/ikon/components/loading-spinner";
// import { ca } from "date-fns/locale";




// export default function RiskLibraryDataTable({ riskLibraryData, riskRegisterData, riskCategoryData, globalRiskLibraryData, profileData, clientId }: { riskLibraryData: Record<string, any>[]; riskRegisterData: Record<string, any>[]; riskCategoryData: Record<string, any>[]; globalRiskLibraryData: Record<string, any>[]; profileData: Record<string, any>; clientId: string }) {

//     const [openRiskForm, setOpenRiskForm] = useState<boolean>(false);
//     const [selectedRisk, setSelectedRisk] = useState<Record<string, any> | null>(null);
//     const [openAlertBox, setOpenAlertBox] = useState(false);
//     const [selectedRowData, setSelectedRowData] = useState<Record<string, any> | null>(null);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [processedRiskIds, setProcessedRiskIds] = useState<Set<string>>(new Set());

//     console.log("riskLibraryData", riskLibraryData);
//     console.log("globalRiskLibraryData", globalRiskLibraryData);

//     console.log("profileData", profileData);
//     const riskLibraryIds = useMemo(() => new Set(riskLibraryData.map(item => item.riskId)), [riskLibraryData]);

//     const { ExistingData, NewData } = useMemo(() => {
//         const existing = [];
//         const newData = [];
//         const seen = new Set();
//         for (const globalRisk of globalRiskLibraryData) {
//             if (riskLibraryIds.has(globalRisk.riskId)) {
//                 existing.push(globalRisk);
//             } else if (!seen.has(globalRisk.riskId)) {
//                 newData.push(globalRisk);
//                 seen.add(globalRisk.riskId);
//             }
//         }
        
//         return { ExistingData: existing, NewData: newData };
//     }, [globalRiskLibraryData, riskLibraryIds]);

//     console.log("ExistingData", ExistingData);
//     console.log("NewData", NewData);

//     const combinedData = [...ExistingData, ...NewData];

//     // const uniqueRiskLibraryData = useMemo(() => {
//     //     const seen = new Set();
//     //     return riskLibraryData.filter(item => {
//     //         if (seen.has(item.riskId)) return false;
//     //         seen.add(item.riskId);
//     //         return true;
//     //     });
//     // }, [riskLibraryData]);

//     useEffect(() => {
//         const unprocessed = NewData.filter(item => !processedRiskIds.has(item.riskId));
//         if (unprocessed.length > 0) {
//             startTheInstance(unprocessed);
//             setProcessedRiskIds(prev => {
//                 const newSet = new Set(prev);
//                 unprocessed.forEach(item => newSet.add(item.riskId));
//                 return newSet;
//             });
//         }
//     }, [NewData]);

//     async function startTheInstance(promptableRisks: Array<Record<string, any>>) {
//         setIsProcessing(true);
//         try {

//             try {
//                 const findingProcessId = await mapProcessName({ processName: "Risk Library" });
//                 for (let data of promptableRisks) {
//                     console.log('data to start', data);
//                     data.clientId = clientId
//                     await startProcessV2({
//                         processId: findingProcessId,
//                         data,
//                         processIdentifierFields: "riskId",
//                     });
//                 }

//             } catch (error) {
//                 console.error("Failed to start risk library process:", error)
//             }

//         } catch (error) {
//             console.error("Error starting global risk instances:", error);
//         } finally {
//             setIsProcessing(false);
            
//         }
//     }

//     const router = useRouter();


//     async function addInRegister(data: Record<string, any>) {
//         const riskRegisterData = {
//             riskLibraryId: data.riskId,
//             riskRegisterID: v4(),
//             riskName: data.riskLibName || "",
//             riskDescription: data.description || "",
//             riskVulnerability: data.vulnerability || "",
//             riskCategory: data.category || "",
//             clientId: clientId,
//         };
//         console.log("riskRegisterData", riskRegisterData);

//         try {
//             const riskRegisterProcessId = await mapProcessName({ processName: "Risk Register" });
//             await startProcessV2({
//                 processId: riskRegisterProcessId,
//                 data: riskRegisterData,
//                 processIdentifierFields: "riskRegisterID",
//             });

//             toast.success("Added Successfully to Risk Register!", { duration: 2000 });
//         } catch (error) {
//             console.error("Failed to start risk register process:", error);
//             toast.error("Failed to Add to Risk Register!", { duration: 2000 });
//         }
//         router.refresh();
//     }


//     const columns: DTColumnsProps<Record<string, any>>[] = [
//         {
//             accessorKey: "riskLibName",
//             header: "Risk Scenario",
//             cell: ({ row }) => (
//                 <div className="truncate max-w-[300px]" title={row.getValue("riskLibName")}>
//                     {row.getValue("riskLibName")}
//                 </div>
//             ),
//         },
//         {
//             accessorKey: "description",
//             header: "Description",
//             cell: ({ row }) => (
//                 <div className="truncate max-w-[300px]" title={row.getValue("description")}>
//                     {row.getValue("description")}
//                 </div>
//             ),
//         },
//         {
//             accessorKey: "vulnerability",
//             header: "Vulnerability",
//             cell: ({ row }) => {
//                 const value = row.getValue("vulnerability");
//                 const displayValue = typeof value === "string" && value.trim() !== "" ? value : "N/A";

//                 return (
//                     <div className="truncate max-w-[300px]" title={displayValue}>
//                         {displayValue}
//                     </div>
//                 );
//             },
//         },
//         {
//             accessorKey: "category",
//             header: "Category",
//             cell: ({ row }) => {
//                 let categoryLabel = "N/A";
//                 const categoryKey = row.original.category;
//                 if (
//                     riskCategoryData.length > 0 &&
//                     riskCategoryData[0].riskCategory &&
//                     riskCategoryData[0].riskCategory[categoryKey] &&
//                     riskCategoryData[0].riskCategory[categoryKey]['riskCategory']
//                 ) {
//                     categoryLabel = riskCategoryData[0].riskCategory[categoryKey]['riskCategory'];
//                 }
//                 return (
//                     <div className="truncate max-w-[300px]" title={categoryLabel}>
//                         {categoryLabel}
//                     </div>
//                 );
//             },
//         },
//         // {
//         //     accessorKey: "",
//         //     header: "Status",
//         //     cell: ({ row }) => {
//         //         const rowData = row.original;
//         //         const isAlreadyRegistered = riskRegisterData.some((entry) => entry.riskLibraryId === rowData.riskId);

//         //         return isAlreadyRegistered ? (
//         //             <Button variant="outline" className="w-20" disabled>Added</Button>
//         //         ) : (
//         //             <Button variant="outline" className="w-20" onClick={() => addInRegister(rowData)}>Add</Button>
//         //         );
//         //     },
//         // }

//         {
//             accessorKey: "",
//             header: "Status",
//             cell: ({ row }) => {
//                 const rowData = row.original;
//                 const isAlreadyRegistered = riskRegisterData.some((entry) => entry.riskLibraryId === rowData.riskId);

//                 return isAlreadyRegistered ? (
//                     <Button variant="outline" className="w-20" disabled>Added</Button>
//                 ) : (
//                     <Button
//                         variant="outline"
//                         className="w-20"
//                         onClick={() => {
//                             setSelectedRowData(rowData);
//                             setOpenAlertBox(true);
//                         }}
//                     >
//                         Add
//                     </Button>
//                 );
//             },
//         }
//     ];

//     const extraParams: DTExtraParamsProps = {
//         pagination: false,
//         actionMenu: {
//             items: [
//                 {
//                     label: "Edit",
//                     onClick: (rowData) => {
//                         console.log("Edit Risk Scenario", rowData);
//                         setSelectedRisk(rowData);
//                         setOpenRiskForm(true);
//                     },
//                 },

//             ],
//         },
//         extraTools: [
//             <IconButtonWithTooltip
//                 key="add-risk-btn"
//                 tooltipContent="Add Risk Scenario"
//                 onClick={() => {
//                     setSelectedRisk(null);
//                     setOpenRiskForm(true);
//                 }}
//             >
//                 <Plus />
//             </IconButtonWithTooltip>,
//         ],
//     };
//     console.log("riskRegisterData", riskRegisterData);

//     return (
//         <>
//             <div className="h-[90%] overflow-y-auto">
//                 <DataTable data={combinedData} columns={columns} extraParams={extraParams} />
//             </div>
//             <RiskScenarioForm open={openRiskForm} setOpen={setOpenRiskForm} editRiskData={selectedRisk} riskCategoryData={riskCategoryData} riskRegisterData={riskRegisterData} clientId={clientId} />
//             <AlertDialog open={openAlertBox} onOpenChange={setOpenAlertBox}>
//                 <AlertDialogContent>
//                     <AlertDialogHeader>
//                         <AlertDialogTitle>Confirmation</AlertDialogTitle>
//                         <AlertDialogDescription>
//                             Are you sure you want to add this risk to the Risk Register?
//                         </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                         <AlertDialogCancel onClick={() => setOpenAlertBox(false)}>
//                             Cancel
//                         </AlertDialogCancel>
//                         <AlertDialogAction onClick={() => {
//                             if (selectedRowData) {
//                                 addInRegister(selectedRowData);
//                             }
//                             setOpenAlertBox(false);
//                         }}>
//                             Continue
//                         </AlertDialogAction>
//                     </AlertDialogFooter>
//                 </AlertDialogContent>
//             </AlertDialog>

//             {isProcessing && <LoadingSpinner size={60} />}


//         </>
//     )
// }


"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
// import { ca } from "date-fns/locale"; // This import seems unused.

export default function RiskLibraryDataTable({ riskLibraryData, riskRegisterData, riskCategoryData, globalRiskLibraryData, profileData, clientId }: { riskLibraryData: Record<string, any>[]; riskRegisterData: Record<string, any>[]; riskCategoryData: Record<string, any>[]; globalRiskLibraryData: Record<string, any>[]; profileData: Record<string, any>; clientId: string }) {

    const [openRiskForm, setOpenRiskForm] = useState<boolean>(false);
    const [selectedRisk, setSelectedRisk] = useState<Record<string, any> | null>(null);
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState<Record<string, any> | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedRiskIds, setProcessedRiskIds] = useState<Set<string>>(new Set());

    console.log("riskLibraryData", riskLibraryData);
    console.log("globalRiskLibraryData", globalRiskLibraryData);
    console.log("profileData", profileData);

    const riskLibraryIds = useMemo(() => new Set(riskLibraryData.map(item => item.riskId)), [riskLibraryData]);

    const { ExistingData, NewData } = useMemo(() => {
        const existing = [];
        const newData = [];
        const seenInGlobal = new Set(); // To ensure uniqueness from globalRiskLibraryData

        for (const globalRisk of globalRiskLibraryData) {
            // Check if this riskId is already in the client's risk library
            if (riskLibraryIds.has(globalRisk.riskId)) {
                existing.push(globalRisk);
            } else if (!seenInGlobal.has(globalRisk.riskId)) {
                // Only add to NewData if it's not in client's library and hasn't been seen in global data yet
                newData.push(globalRisk);
                seenInGlobal.add(globalRisk.riskId);
            }
        }
        return { ExistingData: existing, NewData: newData };
    }, [globalRiskLibraryData, riskLibraryIds]);

    console.log("ExistingData", ExistingData);
    console.log("NewData", NewData);

    // Combine existing and new data for display in the table
    const combinedData = useMemo(() => [...ExistingData, ...NewData], [ExistingData, NewData]);


    // Using a ref to prevent unnecessary re-runs of startTheInstance on re-renders
    // This ref will store the set of risk IDs that have already been initiated for processing
    const initiatedProcessRiskIdsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        const risksToProcess = NewData.filter(item => !initiatedProcessRiskIdsRef.current.has(item.riskId));

        if (risksToProcess.length > 0 && !isProcessing) { // Add !isProcessing to prevent concurrent calls
            risksToProcess.forEach(item => initiatedProcessRiskIdsRef.current.add(item.riskId));
            startTheInstance(risksToProcess);
        }
    }, [NewData, isProcessing]); // Depend on NewData. Adding isProcessing to ensure we don't start new processes while one is ongoing.


    async function startTheInstance(promptableRisks: Array<Record<string, any>>) {
        if (isProcessing) return; // Prevent starting if already processing

        setIsProcessing(true);
        try {
            const findingProcessId = await mapProcessName({ processName: "Risk Library" });
            const processPromises = promptableRisks.map(async (data) => {
                console.log('data to start', data);
                data.clientId = clientId;
                await startProcessV2({
                    processId: findingProcessId,
                    data,
                    processIdentifierFields: "riskId",
                });
            });
            await Promise.all(processPromises); // Wait for all processes to complete
            toast.success("New risk library instances started successfully!", { duration: 2000 });
        } catch (error) {
            console.error("Failed to start risk library process:", error);
            toast.error("Failed to start new risk library instances!", { duration: 2000 });
        } finally {
            setIsProcessing(false);
        }
    }

    const router = useRouter();


    async function addInRegister(data: Record<string, any>) {
        const riskRegisterData = {
            riskLibraryId: data.riskId,
            riskRegisterID: v4(),
            riskName: data.riskLibName || "",
            riskDescription: data.description || "",
            riskVulnerability: data.vulnerability || "",
            riskCategory: data.category || "",
            clientId: clientId,
        };
        console.log("riskRegisterData for registration", riskRegisterData);

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
            cell: ({ row }) => {
                let categoryLabel = "N/A";
                const categoryKey = row.original.category;
                if (
                    riskCategoryData.length > 0 &&
                    riskCategoryData[0].riskCategory &&
                    riskCategoryData[0].riskCategory[categoryKey] &&
                    riskCategoryData[0].riskCategory[categoryKey]['riskCategory']
                ) {
                    categoryLabel = riskCategoryData[0].riskCategory[categoryKey]['riskCategory'];
                }
                return (
                    <div className="truncate max-w-[300px]" title={categoryLabel}>
                        {categoryLabel}
                    </div>
                );
            },
        },
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
    console.log("riskRegisterData", riskRegisterData); // This console log is fine.

    return (
        <>
            <div className="h-[90%] overflow-y-auto">
                <DataTable data={combinedData} columns={columns} extraParams={extraParams} />
            </div>
            <RiskScenarioForm open={openRiskForm} setOpen={setOpenRiskForm} editRiskData={selectedRisk} riskCategoryData={riskCategoryData} riskRegisterData={riskRegisterData} clientId={clientId} />
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

            {isProcessing && <LoadingSpinner size={60} />}


        </>
    )
}
