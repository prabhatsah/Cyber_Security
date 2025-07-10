'use client';
import React, { useState } from "react";
import { useEffect } from "react";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';
import { format } from 'date-fns';
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus } from "lucide-react";
import MeetingForm from "../../ScheduleMeeting";
import MeetObservatioForm from "./meetingObservation";
import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";
import AddActionsMetting from "./addActionsMetting";
import UpdateMeetingStatus from "./updateMeetingStatus";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Textarea } from "@/shadcn/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import MeetingRemarkDialog from "./MeetingRemarkDialog";
import { useRouter } from "next/navigation";

export default function FollowUpDataTable({ userIdNameMap, followUpMeetingData, findActionData }: { userIdNameMap: { value: string; label: string }[]; followUpMeetingData: Record<string, any>[]; findActionData: any }) {


    console.log('followUpMeetingData---', followUpMeetingData);
    console.log(findActionData);
    const [openMeetingForm, setOpenMeetingForm] = useState<boolean>(false);
    const [openObserveForm, setOpenObserveForm] = useState<boolean>(false);
    const [openModalDialog, setOpenModalDialog] = useState<boolean>(false);
    const [selectedMeeting, setSelectedMeeting] = useState<Record<string, any> | null>(null);
    const router = useRouter()
    // const openModal = () => {
    //     setOpenMeetingForm(true);
    // }

    // Helper function to get the name from userIdNameMap
    const getNameById = (id: string) => {
        const user = userIdNameMap.find((user) => user.value === id);
        return user ? user.label : "Unknown";
    };

    const [status, setStatus] = React.useState("");
    const [remark, setRemark] = React.useState("");
    const [duration, setDuration] = React.useState("");
    const [openModal, setOpenModal] = React.useState(false);

    // Inside your component
    useEffect(() => {
        if (selectedMeeting) {
            setStatus(selectedMeeting.meetingStatus ?? "");
            setRemark(selectedMeeting.description ?? "");
            setDuration(selectedMeeting.duration ?? "");
        }
    }, [selectedMeeting]);

    // Example submit function
    const handleSubmit = async () => {
        console.log({ status, remark, duration });
        console.log("Selected Meeting:", selectedMeeting);
        const newData = {
            ...selectedMeeting,
            meetingStatus: status,
            remark,
            duration
        } as { meetingParticipants: string[], meetingStatus: string, remark: string, duration: string, startDate: string }

        console.log("New Data:=====>", newData);


        const selectedRowData = {
            ...findActionData[0],
            meeting: [
                ...(Array.isArray(findActionData[0]?.meeting) ? findActionData[0]?.meeting : []),
                {
                    owner: newData?.meetingParticipants,
                    date: newData?.startDate,
                    remark: newData?.remark

                },
            ]
        }

        console.log(selectedRowData);

        const meetingFindingInstances = await getMyInstancesV2({
            processName: "Meeting Findings Actions",
            predefinedFilters: { taskName: "Edit Action" },
            mongoWhereClause: `this.Data.actionsId == "${selectedRowData?.actionsId}"`,
        })
        console.log(meetingFindingInstances)
        const taskId = meetingFindingInstances[0]?.taskId;
        console.log(taskId);
        await invokeAction({
            taskId: taskId,
            transitionName: 'Update Edit',
            data: selectedRowData,
            processInstanceIdentifierField: ''
        })

        const followUpInstances = await getMyInstancesV2({
            processName: "FollowUp Meeting",
            predefinedFilters: { taskName: "Edit FollowUp Meeting" },
            mongoWhereClause: `this.Data.auditId == "${selectedMeeting?.auditId}"`,
        });
        const followUpMeetingTaskId = followUpInstances[0].taskId;
        await invokeAction({
            taskId: followUpMeetingTaskId,
            data: newData,
            transitionName: 'Update Edit',
            processInstanceIdentifierField: 'auditId',
        });

        router.refresh()

        setOpenModalDialog(false);



    };

    const columns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: "meetingTitle",
            header: "Meeting Title",
        },
        {
            accessorKey: "meetingMode",
            header: "Meeting Mode",
        },
        {
            accessorKey: "meetingParticipants",
            header: "Participants",
            cell: ({ row }) => {
                const participantNames = row.original.meetingParticipants
                    ?.map((participantId: string) => getNameById(participantId)) || [];
                const displayedNames = participantNames.slice(0, 3).join(", ");
                const hasMore = participantNames.length > 3;
                return (
                    <div>
                        {displayedNames}
                        {hasMore && " ..."}
                    </div>
                );
            },
        },
        {
            accessorKey: "startDate",
            header: "Meeting Date",
            cell: ({ row }) => {
                const dateValue = row.original.startDate;
                return dateValue ? format(new Date(dateValue), SAVE_DATE_FORMAT_GRC) : "N/A";
            },
        },
        {
            accessorKey: "startTime",
            header: "Meeting Time",
        },
        {
            accessorKey: "duration",
            header: "Duration (Hours)",
        },
        {
            accessorKey: "meetingStatus",
            header: "Status",
            cell: ({ row }) => {
                let statusValue = row.original.meetingStatus;
                console.log("status value --->", statusValue);

                if (!statusValue || statusValue === "Open") {
                    statusValue = "Planned and Open";
                } else if (statusValue === "Close") {
                    statusValue = "Complete and Closed";
                }

                return (
                    <div className="capitalize">{statusValue}</div>
                );
            },
        },
    ];

    const extraParams: DTExtraParamsProps = {
        pagination: false,
        actionMenu: {
            items: [
                {
                    label: "Edit",
                    onClick: (rowData) => {
                        setSelectedMeeting(rowData);
                        setOpenModalDialog(true);
                    },
                }
                // {
                //     label: "Add Findings",
                //     onClick: (rowData) => {
                //         setSelectedMeeting(rowData);
                //         setOpenObserveForm(true);
                //     },
                // },
                // {
                //     label: "Add Actions",
                //     onClick: (rowData) => {
                //         console.log(rowData);
                //         setOpenActionForm(true);
                //     }
                // },
            ],
        },
        // extraTools: [
        //     <IconButtonWithTooltip
        //         key="add-btn"
        //         tooltipContent="Schedule Meeting"
        //         onClick={() => openModal()}
        //     >
        //         <Plus />
        //     </IconButtonWithTooltip>,
        // ],
    };

    return (
        <>
            <DataTable data={followUpMeetingData} columns={columns} extraParams={extraParams} />

            {openModalDialog && (
                <MeetingRemarkDialog
                    open={openModalDialog}
                    onOpenChange={setOpenModalDialog}
                    status={status}
                    remark={remark}
                    duration={duration}
                    onStatusChange={setStatus}
                    onRemarkChange={setRemark}
                    onDurationChange={setDuration}
                    onSubmit={handleSubmit}
                />
                // <Dialog open={openModalDialog} onOpenChange={setOpenModalDialog}>
                //     <DialogContent>
                //         <DialogHeader>
                //             <DialogTitle>Meeting Remarks</DialogTitle>
                //         </DialogHeader>

                //         {/* Status Dropdown */}
                //         <div className="grid gap-2">
                //             <Label>Status</Label>
                //             <Select onValueChange={(value) => setStatus(value)} defaultValue={status}>
                //                 <SelectTrigger>
                //                     <SelectValue placeholder="Select status" />
                //                 </SelectTrigger>
                //                 <SelectContent>
                //                     <SelectItem value="Open">Open</SelectItem>
                //                     <SelectItem value="Closed">Closed</SelectItem>
                //                 </SelectContent>
                //             </Select>
                //         </div>

                //         {/* Remark Field */}
                //         <div className="grid gap-2 mt-4">
                //             <Label>Remark</Label>
                //             <Textarea
                //                 placeholder="Enter remark"
                //                 value={remark}
                //                 onChange={(e) => setRemark(e.target.value)}
                //             />
                //         </div>

                //         {/* Duration Field */}
                //         <div className="grid gap-2 mt-4">
                //             <Label>Duration (in hours)</Label>
                //             <Input
                //                 type="number"
                //                 placeholder="Enter duration"
                //                 value={duration}
                //                 onChange={(e) => setDuration(e.target.value)}
                //             />
                //         </div>

                //         <DialogFooter className="mt-6">
                //             <Button onClick={handleSubmit}>Submit</Button>
                //         </DialogFooter>
                //     </DialogContent>
                // </Dialog>
            )}
        </>
    );
}