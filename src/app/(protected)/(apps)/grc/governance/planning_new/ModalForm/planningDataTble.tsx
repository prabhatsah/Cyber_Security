'use client'
import React, { useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus } from "lucide-react";
import PlanningForm from "./planningModal";
import MeetingForm from "../ScheduleMeeting";
import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";
import { format } from 'date-fns';
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/shadcn/ui/alert-dialog";

export default function PlanningDataTable({ userIdNameMap, tableData, selectedRole, isAllowedToCreateAudits }: { userIdNameMap: { value: string; label: string }[]; tableData: Record<string, any>[]; selectedRole: string | null; isAllowedToCreateAudits: boolean }) {

    console.log("Role which is selected", selectedRole);
    const [showAlert, setShowAlert] = useState(false);
    const [openFrameworkForm, setOpenFrameworkForm] = useState<boolean>(false);
    const [openMeetingForm, setOpenMeetingForm] = useState<boolean>(false);
    const [editPlanningData, setEditPlanningData] = useState<Record<string, any> | null>(null);

    // const [editMeeting, setEditMeeting] = useState<Record<string, any> | null>(null);

    // const [openMeetingForm, setOpenMeetingForm] = useState(false);
    const [editMeetingData, setEditMeetingData] = useState(null);

    function openModal(row: Record<string, string> | null) {
        //setEditRow(row);
        setEditPlanningData(null)
        setOpenFrameworkForm(true);
    }

    function openMeetingModal(row: Record<string, any> | null) {
        //setEditMeeting(row);
        setOpenMeetingForm(true);
    }

    function openEditPlanningModal(row: Record<string, any>) {
        console.log(row, "Row data to be edited");
        setEditPlanningData(row); // Set the row data to be edited
        setOpenFrameworkForm(true); // Open the PlanningForm
    }


    const columns: DTColumnsProps<Record<string, any>>[] = [
        // {
        //     accessorKey: "auditName",
        //     header: "Audit Name",
        //     cell: ({ row }) => (
        //         <Link
        //             className="underline"
        //             href={`/grc/governance/planning/ModalForm/${row.original.auditId  || row.original.auditName}_${selectedRole}`}
        //             style={{ cursor: "pointer" }}
        //         >
        //             {row.original.auditName}
        //         </Link>
        //     )
        // },
        {
            accessorKey: "auditName",
            header: "Audit Name",
            cell: ({ row }) => {
                const status = row.original.auditStatus;
                const [showAlert, setShowAlert] = React.useState(false);

                const handleClick = (e: React.MouseEvent) => {
                    if (status === "Pending") {
                        e.preventDefault();
                        setShowAlert(true);
                    }
                };

                return (
                    <>
                        <Link
                            className="underline cursor-pointer"
                            href={`/grc/governance/planning_new/ModalForm/${row.original.auditId || row.original.auditName}_${selectedRole}`}
                            onClick={handleClick}
                        >
                            {row.original.auditName}
                        </Link>
                        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                            <AlertDialogContent>
                                <AlertDialogTitle>Info</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This audit is still in the planning phase. So you cannot open it now.
                                </AlertDialogDescription>
                                <div className="flex justify-center mt-4">
                                    <AlertDialogAction onClick={() => setShowAlert(false)}>
                                        OK
                                    </AlertDialogAction>
                                </div>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                );
            }
        },
        {
            accessorKey: "auditCycle",
            header: "Type",
        },
        {
            accessorKey: "auditorTeam",
            header: "Auditor Team",
            cell: ({ row }) => {
                const auditorTeamIds = row.original.auditorTeam;

                // Map the IDs to their corresponding names using userIdNameMap
                const auditorTeamNames = Array.isArray(auditorTeamIds)
                    ? auditorTeamIds
                        .map((id: string) => userIdNameMap.find((user) => user.value === id)?.label)
                        .filter((name) => name) // Filter out undefined names
                    : [];

                // Join names and truncate with ellipses if too long
                const fullNames = auditorTeamNames.join(", ");
                const displayNames = fullNames.length > 20 ? `${fullNames.slice(0, 20)}...` : fullNames;

                return (
                    <span
                        title={fullNames} // Show full names on hover
                    >
                        {displayNames}
                    </span>
                );
            }
        },
        {
            accessorKey: "auditeeTeam",
            header: "Auditee Team",
            cell: ({ row }) => {
                const auditeeTeamIds = row.original.auditeeTeam || row.original.auditeeTeamName;

                // Map the IDs to their corresponding names using userIdNameMap
                const auditeeTeamNames = Array.isArray(auditeeTeamIds)
                    ? auditeeTeamIds
                        .map((id: string) => userIdNameMap.find((user) => user.value === id)?.label)
                        .filter((name) => name) // Filter out undefined names
                    : [];

                // Join names and truncate with ellipses if too long
                const fullNames = auditeeTeamNames.join(", ");
                const displayNames = fullNames.length > 20 ? `${fullNames.slice(0, 20)}...` : fullNames;

                return (
                    <span
                        title={fullNames} // Show full names on hover
                    >
                        {displayNames}
                    </span>
                );
            }
        },
        {
            accessorKey: "auditStart",
            header: "Audit Start",
            cell: ({ row }) => {
                const dateValue = row.original.auditStart;
                return dateValue ? format(new Date(dateValue), SAVE_DATE_FORMAT_GRC) : "N/A";
            },
        },
        {
            accessorKey: "auditEnd",
            header: "Audit End",
            cell: ({ row }) => {
                const dateValue = row.original.auditEnd;
                return dateValue ? format(new Date(dateValue), SAVE_DATE_FORMAT_GRC) : "N/A";
            },
        },
        {
            accessorKey: "progress",
            header: "Progress %",
            cell: ({ row }) => {
                const auditProgress = row.original.auditProgress || 0.00
                return (
                    <span className="badge-info flex flex-row-reverse mr-16">
                        {Number(auditProgress).toFixed(2)}
                    </span>
                );
            }
        },
        {
            accessorKey: "auditStatus",
            header: "Status",
            cell: ({ row }) => {
                if (row.original.auditStatus) {
                    return (
                        <span className="badge-info">
                            {row.original.auditStatus}
                        </span>
                    );
                } else {
                    return (
                        <span className="badge-info">
                            Planning
                        </span>
                    );
                }
            }
        }
    ];

    const extraParams: DTExtraParamsProps = {
        actionMenu: {
            items: [
                {
                    label: "Schedule Meeting",
                    onClick: (rowData) => {
                        setEditMeetingData(rowData);
                        setOpenMeetingForm(true);
                    },
                    visibility: (rowData) => {
                        return isAllowedToCreateAudits && rowData.auditStatus == 'Planned' ? true : false;
                    }
                },
                {
                    label: "Edit",

                    onClick: (rowData) => {
                        openEditPlanningModal(rowData); // Open the PlanningForm with the row data
                    },
                    visibility: (rowData) => {
                        return isAllowedToCreateAudits && rowData.auditStatus != 'Planned' ? true : false;
                    }
                },
                {
                    label: "View",

                    onClick: (rowData) => {
                        openEditPlanningModal(rowData); // Open the PlanningForm with the row data
                    },
                    visibility: (rowData) => {
                        return isAllowedToCreateAudits && rowData.auditStatus === 'Planned' ? true : false;
                    },
                }
            ]
        },
        extraTools: isAllowedToCreateAudits ? [
            <IconButtonWithTooltip
                key="add-btn"
                tooltipContent="Add Planning"
                onClick={() => openModal(null)}
            >
                <Plus />
            </IconButtonWithTooltip>,
        ] : [],
    }

    return (
        <>
            <DataTable data={tableData} columns={columns} extraParams={extraParams} />
            {
                openFrameworkForm &&
                <PlanningForm
                    open={openFrameworkForm}
                    setOpen={setOpenFrameworkForm}
                    userIdNameMap={userIdNameMap}
                    editPlanning={editPlanningData}
                />
            }
            {
                openMeetingForm &&
                <MeetingForm
                    open={openMeetingForm}
                    setOpen={setOpenMeetingForm}
                    userIdNameMap={userIdNameMap}
                    auditData={editMeetingData}
                    editMeeting={null}
                />
            }
        </>
    );
}
