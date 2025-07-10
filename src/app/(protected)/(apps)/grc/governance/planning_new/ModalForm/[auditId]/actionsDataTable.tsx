'use client'
import React, { useState } from "react";

import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';
import { format } from 'date-fns';
import { Badge } from "@/shadcn/ui/badge";
import FollowUpRemarks from "./FollowUpRemarks";
import EditableActionForm from "./editableActionForm";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shadcn/ui/dialog";
import ActionReviewForm from "./actionReviewForm";
import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { useRouter } from "next/navigation";
import FollowUpMeetingForm from "./followUpMeeting";
import AddActionSoln from "./actionMeetingSoln/addActionSoln";

type FindingActionItem = {
    assignedTo: string;
    description: string;
    dueDate: string;
    timeEntries: any[]; // or better type
    assigneAction?: FindingActionData[];
    status?: string;
    remarks?: string[];
    followUpMetting?: Record<string, string>[];
};


type FindingActionData = {
    auditId: string;
    actionsId: string;
    controlId: number;
    controlName: string;
    controlObjId: string;
    controlObjName: string;
    findingId: string;
    lastUpdateOn: string;
    meetingId: string;
    observation: string[];
    owner: string;
    recommendation: string[];
    severity: string;
    actions: FindingActionItem[];
};

export default function ActionsDataTable({ findActionData, userIdNameMap, profileData, role, currentUserId, isAllowedForFindingAndActions }: { findActionData: any[], userIdNameMap: { value: string; label: string }[], profileData: any[], role: string, currentUserId: string, isAllowedForFindingAndActions: boolean }) {
    const router = useRouter();
    console.log(findActionData);
    console.log(userIdNameMap);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRemarks, setSelectedRemarks] = useState([]);

    const [selectedRow, setSelectedeRow] = useState<Record<string, any> | null>(null);
    const [reviewSelectedRow, setReviewSelectedRow] = useState<Record<string, any> | null>(null)
    const [followUpMeetingRow, setFollowUpMeetingRow] = useState<Record<string, any> | null>(null);
    const [openFollowUpMeeting, setOpenFollowUpMeeting] = useState<boolean>(false);



    const handleOpenModal = (rowData: Record<string, any>) => {
        setSelectedRemarks(rowData.meeting || []);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRemarks([]);
    };

    const revokeActionFn = async (rowData: Record<string, string | any>) => {
        // const groupedDataMap: Map<string, FindingActionData> = new Map();

        // for (const flatAction of findActionData) {
        //     if (!groupedDataMap.has(flatAction.actionsId)) {
        //         groupedDataMap.set(flatAction.actionsId, {
        //             auditId: flatAction.auditId,
        //             actionsId: flatAction.actionsId,
        //             controlId: flatAction.controlId,
        //             controlName: flatAction.controlName,
        //             controlObjId: flatAction.controlObjId,
        //             controlObjName: flatAction.controlObjName,
        //             findingId: flatAction.findingId,
        //             lastUpdateOn: flatAction.lastUpdateOn,
        //             meetingId: flatAction.meetingId,
        //             observation: flatAction.observation,
        //             owner: flatAction.owner,
        //             recommendation: flatAction.recommendation,
        //             severity: flatAction.severity,
        //             actions: [],
        //         });
        //     }

        //     const group = groupedDataMap.get(flatAction.actionsId);
        //     if (group) {
        //         const { status, editActionId } = flatAction;

        //         let resolvedStatus: 'Completed' | 'Pending' | 'In Progress' | undefined;
        //         if (status === 'Completed' || status === 'Pending' || status === 'In Progress') {
        //             resolvedStatus = status;
        //         }
        //         if (editActionId === rowData?.editActionId) {
        //             resolvedStatus = 'In Progress';
        //         }
        //         group.actions.push({
        //             description: flatAction.description,
        //             assignedTo: flatAction.assignedTo,
        //             dueDate: flatAction.dueDate,
        //             timeEntries: flatAction.timeEntries,
        //             assigneAction: flatAction.assigneAction || [],
        //             status: resolvedStatus,
        //             remarks: flatAction.remarks || [],
        //             followUpMetting: flatAction.followUpMetting || [],
        //         })

        //     }
        // }
        // const currentActionId = rowData?.actionsId;
        // const matchedAction = groupedDataMap.get(currentActionId);

        const saveDataFormat = {
            ...rowData,
            actionStatus: 'In Progress',
        }
        console.log(saveDataFormat);


        if (saveDataFormat) {
            const meetingFindingInstances = await getMyInstancesV2({
                processName: "Meeting Findings Actions",
                predefinedFilters: { taskName: "View Action" },
                mongoWhereClause: `this.Data.actionsId == "${saveDataFormat?.actionsId}"`,
            })
            console.log(meetingFindingInstances)
            const taskId = meetingFindingInstances[0]?.taskId;
            console.log(taskId);
            await invokeAction({
                taskId: taskId,
                transitionName: 'Update View',
                data: saveDataFormat,
                processInstanceIdentifierField: ''
            })
            router.refresh();
        } else {
            alert("Could Not Save Data")
        }

    }

    // Hardcoded data for demo
    const [openEditableActionForm, setOpenEditableActionForm] = useState<boolean>(false);
    const [openReviewForm, setOpenReviewForm] = useState<boolean>(false);
    // const tableData = [
    //     {
    //         description: "Review financial controls",
    //         controlPolicy: "Financial Policy",
    //         controlObjectives: "Ensure compliance with regulations",
    //         owner: "John Doe",
    //         dueDate: "2025-05-01",
    //         startDate: "2025-04-01",
    //         status: "In Progress",
    //         followUpMeetings: [
    //             {
    //                 date: "2025-04-05",
    //                 remark: "Initial review completed",
    //                 owner: "John Doe",
    //             },
    //             {
    //                 date: "2025-04-10",
    //                 remark: "Identified gaps in compliance",
    //                 owner: "Jane Smith",
    //             },
    //             {
    //                 date: "2025-04-15",
    //                 remark: "Finalized action plan",
    //                 owner: "Alice Brown",
    //             },
    //         ],
    //         // actions: "Update documentation",
    //     },
    //     {
    //         description: "Evaluate IT security",
    //         controlPolicy: "IT Security Policy",
    //         controlObjectives: "Protect sensitive data",
    //         owner: "Jane Smith",
    //         dueDate: "2025-06-15",
    //         startDate: "2025-05-15",
    //         status: "Completed",
    //         followUpMeetings: [
    //             {
    //                 date: "2025-05-20",
    //                 remark: "Reviewed current firewall setup",
    //                 owner: "Chris Johnson",
    //             },
    //             {
    //                 date: "2025-05-25",
    //                 remark: "Implemented new firewall",
    //                 owner: "Jane Smith",
    //             },
    //         ],
    //         // actions: "Implement new firewall",
    //     },
    //     {
    //         description: "Analyze budget allocation",
    //         controlPolicy: "Financial Policy",
    //         controlObjectives: "Optimize resource allocation",
    //         owner: "Alice Brown",
    //         dueDate: "2025-07-10",
    //         startDate: "2025-06-01",
    //         status: "Pending",
    //         followUpMeetings: [
    //             {
    //                 date: "2025-06-05",
    //                 remark: "Initial budget analysis completed",
    //                 owner: "Alice Brown",
    //             },
    //         ],
    //         // actions: "Prepare detailed report",
    //     },
    //     {
    //         description: "Audit expense reports",
    //         controlPolicy: "Financial Policy",
    //         controlObjectives: "Ensure compliance with regulations",
    //         owner: "Michael Green",
    //         dueDate: "2025-08-20",
    //         startDate: "2025-07-01",
    //         status: "In Progress",
    //         followUpMeetings: [
    //             {
    //                 date: "2025-07-10",
    //                 remark: "Reviewed expense reports for Q1",
    //                 owner: "Michael Green",
    //             },
    //         ],
    //         // actions: "Verify all receipts",
    //     },
    //     {
    //         description: "Review tax compliance",
    //         controlPolicy: "Financial Policy",
    //         controlObjectives: "Optimize resource allocation",
    //         owner: "Sarah White",
    //         dueDate: "2025-09-15",
    //         startDate: "2025-08-01",
    //         status: "Completed",
    //         followUpMeetings: [
    //             {
    //                 date: "2025-08-10",
    //                 remark: "Reviewed tax filings for last year",
    //                 owner: "Prity",
    //             },
    //             {
    //                 date: "2025-08-20",
    //                 remark: "Identified areas for improvement",
    //                 owner: "Alisha",
    //             },
    //         ],
    //         // actions: "Submit tax filings",
    //     },
    //     {
    //         description: "Monitor network traffic",
    //         controlPolicy: "IT Security Policy",
    //         controlObjectives: "Protect sensitive data",
    //         owner: "Chris Johnson",
    //         dueDate: "2025-10-05",
    //         startDate: "2025-09-01",
    //         status: "In Progress",
    //         followUpMeetings: [
    //             {
    //                 date: "2025-09-10",
    //                 remark: "Set up initial monitoring tools",
    //                 owner: "Chris Johnson",
    //             },
    //             {
    //                 date: "2025-09-20",
    //                 remark: "Analyzed traffic patterns",
    //                 owner: "Jane Smith",
    //             },
    //             {
    //                 date: "2025-09-30",
    //                 remark: "Implemented intrusion detection system",
    //                 owner: "Chris Johnson",
    //             },
    //             {
    //                 date: "2025-10-01",
    //                 remark: "Reviewed system performance",
    //                 owner: "Michael Green",
    //             },
    //             {
    //                 date: "2025-10-03",
    //                 remark: "Finalized monitoring strategy",
    //                 owner: "Chris Johnson",
    //             },
    //         ],
    //         // actions: "Set up intrusion detection system",
    //     },
    //     {
    //         description: "Update access controls",
    //         controlPolicy: "IT Security Policy",
    //         controlObjectives: "Restrict access to sensitive systems",
    //         owner: "Emily Davis",
    //         dueDate: "2025-11-20",
    //         startDate: "2025-10-01",
    //         status: "Pending",
    //         followUpMeetings: [
    //             {
    //                 date: "2025-10-10",
    //                 remark: "Reviewed current access controls",
    //                 owner: "Emily Davis",
    //             },
    //             {
    //                 date: "2025-10-20",
    //                 remark: "Proposed new access policies",
    //                 owner: "Chris Johnson",
    //             },
    //             {
    //                 date: "2025-10-30",
    //                 remark: "Implemented updated controls",
    //                 owner: "Emily Davis",
    //             },
    //         ],
    //         // actions: "Revise user permissions",
    //     },
    // ];


    const columns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: "controlName",
        },
        {
            accessorKey: "controlObjName",
        },
        {
            accessorKey: "observation",
            header: "Observation",
            cell: ({ row }) => (
                <div className="truncate max-w-[200px]" title={row.getValue("observation")}>
                    {row.getValue("observation")}
                </div>
            ),
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <div className="truncate max-w-[250px]" title={row.getValue("description")}>
                    {row.getValue("description")}
                </div>
            ),
        },
        // {
        //     accessorKey: "assignedTo",
        //     header: "Owner",
        //     cell: ({ row }) => {
        //         return userIdNameMap.find(u => u.value === row.original.assignedTo)?.label || 'N/A'
        //     }
        // },
        {
            accessorKey: "assignedTo",
            header: "Owner",
            cell: ({ row }) => {
                if (role === "auditeeType1" || role === "auditeeType2") {
                    const assignedName = userIdNameMap.find(user => user.value === profileData?.USER_ID)?.label || "Unknown";
                    return assignedName;
                } else {
                    const assignedId = row.original.assignedTo;
                    const assignedName = userIdNameMap.find(user => user.value === assignedId)?.label || "Unknown";
                    return assignedName;
                }
            },
        },
        {
            accessorKey: "dueDate",
            header: "Due Date",
            cell: ({ row }) => {
                const dateValue = row.original.dueDate;
                return dateValue ? format(new Date(dateValue), SAVE_DATE_FORMAT_GRC) : "N/A";
            },
        },
        {
            accessorKey: "actionStatus",
            header: "Status",
            cell: ({ row }) => {
                const statusValue = row.original.actionStatus || "Pending"; // Default to "Pending" if status is not present
                return (
                    <Badge
                        variant="outline"
                        className={`text-xs ${statusValue === "In Progress"
                            ? "text-blue-500 border-blue-500"
                            : statusValue === "Completed"
                                ? "text-green-500 border-green-500"
                                : "text-gray-500 border-gray-500"
                            }`}
                    >
                        {statusValue}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "meeting",
            header: "Follow Up Meetings",
            cell: ({ row }) => {
                const meetings = row.original.meeting || [];
                const meetingsCount = meetings.length;
                return (
                    <div
                        className="cursor-pointer text-blue-500 underline"
                        onClick={() => handleOpenModal(row.original)}
                    >
                        {meetingsCount}
                    </div>
                );
            },
        },
    ];

    const extraParams: DTExtraParamsProps = {
        actionMenu: {
            items: [
                {
                    label: "Edit Action",
                    onClick: (rowData) => {
                        console.log(rowData);
                        setSelectedeRow(rowData);
                        setOpenEditableActionForm(true);
                    },
                    visibility: (rowData) => {
                        console.log(rowData.assignedTo + " " + currentUserId);
                        return isAllowedForFindingAndActions && rowData.actionStatus === 'In Progress' ? true : rowData.assignedTo !== currentUserId ? false : rowData.actionStatus === 'In Progress' ? true : false;
                        // return rowData.actionStatus === 'In Progress' ? true : false;
                    }
                },
                {
                    label: "Schedule Follow Up Meeting",
                    onClick: (rowData) => {
                        console.log(rowData);
                        setFollowUpMeetingRow(rowData)
                        setOpenFollowUpMeeting(true);
                    },
                    visibility: (rowData) => {
                        return isAllowedForFindingAndActions || rowData.assignedTo === currentUserId || rowData.owner === currentUserId;
                    }
                },
                {
                    label: "Review Action",
                    onClick: (rowData) => {
                        console.log(rowData);
                        setReviewSelectedRow(rowData)
                        setOpenReviewForm(true);
                    },
                    visibility: (rowData) => {
                        return isAllowedForFindingAndActions && rowData.actionStatus === 'Pending' ? true : rowData.owner !== currentUserId ? false : rowData.actionStatus === 'Pending' ? true : false;
                    }
                },
                {
                    label: 'Revoke Previous Action',
                    onClick: async (rowData) => {
                        console.log(rowData);
                        await revokeActionFn(rowData);
                    },
                    visibility: (rowData) => {
                        return isAllowedForFindingAndActions && rowData.actionStatus === 'Pending' ? true : rowData.assignedTo !== currentUserId ? false : rowData.actionStatus === 'Pending' ? true : false;
                    }
                }

            ],
        },
        defaultGroups: ["controlName", "controlObjName"],
        grouping: false,
        pagination: false,
    };

    return (
        <>
            <DataTable data={findActionData} columns={columns} extraParams={extraParams} />
            {isModalOpen &&
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Follow-up Meetings</DialogTitle>
                        </DialogHeader>

                        <FollowUpRemarks remarks={selectedRemarks.map(meeting => ({
                            date: new Date(meeting.date),
                            remark: meeting.remark,
                            providedBy: meeting?.owner?.map(val => {
                                const match = userIdNameMap.find(p => p.value === val);
                                return match ? match.label : null;
                            })
                        }))} />

                    </DialogContent>
                </Dialog>}
            {
                openEditableActionForm &&
                // <EditableActionForm openEditableActionForm={openEditableActionForm} setOpenEditableActionForm={setOpenEditableActionForm} selectedRow={selectedRow} findActionData={findActionData} />
                <AddActionSoln openEditableActionForm={openEditableActionForm} setOpenEditableActionForm={setOpenEditableActionForm} selectedRow={selectedRow} />
            }
            {
                openReviewForm &&
                <ActionReviewForm openReviewForm={openReviewForm} setOpenReviewForm={setOpenReviewForm} reviewRow={reviewSelectedRow} findActionData={findActionData} />
            }
            {
                openFollowUpMeeting &&
                <FollowUpMeetingForm open={openFollowUpMeeting} setOpen={setOpenFollowUpMeeting} userIdNameMap={userIdNameMap} auditData={[]} findActionData={findActionData} editMeeting={followUpMeetingRow} profileData={profileData} />

            }
        </>
    );
}