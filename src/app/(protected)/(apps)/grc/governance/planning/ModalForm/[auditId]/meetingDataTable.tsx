"use client";
import React, { useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";
import { format } from "date-fns";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus } from "lucide-react";
import MeetingForm from "../../ScheduleMeeting";
import MeetObservatioForm from "./meetingObservation";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import AddActionsMetting from "./addActionsMetting";
import UpdateMeetingStatus from "./updateMeetingStatus";

export default function MeetingDataTable({
  userIdNameMap,
  tableData,
  auditData,
  isAllowedToScheduleMeeting
}: {
  userIdNameMap: { value: string; label: string }[];
  tableData: Record<string, any>[];
  auditData: Record<string, any>[];
  isAllowedToScheduleMeeting: boolean;
}) {
  const formatedAuditData = auditData[0] || {};
  const [openMeetingForm, setOpenMeetingForm] = useState<boolean>(false);
  const [openObserveForm, setOpenObserveForm] = useState<boolean>(false);
  const [openStatusForm, setOpenStatusForm] = useState<boolean>(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Record<
    string,
    any
  > | null>(null);

  const openModal = () => {
    setOpenMeetingForm(true);
  };

  // Helper function to get the name from userIdNameMap
  const getNameById = (id: string) => {
    const user = userIdNameMap.find((user) => user.value === id);
    return user ? user.label : "Unknown";
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
        const participantNames =
          row.original.meetingParticipants?.map((participantId: string) =>
            getNameById(participantId)
          ) || [];
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
        return dateValue
          ? format(new Date(dateValue), SAVE_DATE_FORMAT_GRC)
          : "N/A";
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

        return <div className="capitalize">{statusValue}</div>;
      },
    },
  ];

  const extraParams: DTExtraParamsProps = {
    pagination: false,
    actionMenu: {
      items: [
        {
          label: "Update Status",
          onClick: (rowData) => {
            setSelectedMeeting(rowData);
            setOpenStatusForm(true);
          },
          visibility: (rowData) =>{
            return isAllowedToScheduleMeeting;
          }
        },
        {
          label: "Add Findings",
          onClick: (rowData) => {
            setSelectedMeeting(rowData);
            setOpenObserveForm(true);
          },
          visibility: (rowData) =>{
            return isAllowedToScheduleMeeting;
          }
        },
        // {
        //     label: "Add Actions",
        //     onClick: (rowData) => {
        //         console.log(rowData);
        //         setOpenActionForm(true);
        //     }
        // },
      ],
    },
    extraTools: isAllowedToScheduleMeeting? [
      <IconButtonWithTooltip
        key="add-btn"
        tooltipContent="Schedule Meeting"
        onClick={() => openModal()}
      >
        <Plus />
      </IconButtonWithTooltip>
    ]: [],
  };

  return (
    <>
      <DataTable data={tableData} columns={columns} extraParams={extraParams} />

      <MeetingForm
        open={openMeetingForm}
        setOpen={setOpenMeetingForm}
        userIdNameMap={userIdNameMap}
        auditData={formatedAuditData}
        editMeeting={null}
      />

      <MeetObservatioForm
        open={openObserveForm}
        setOpen={setOpenObserveForm}
        userIdNameMap={userIdNameMap}
        selectedMeetData={selectedMeeting || {}}
        auditData={auditData}
      />

      <UpdateMeetingStatus
        open={openStatusForm}
        setOpen={setOpenStatusForm}
        meetingData={selectedMeeting || {}}
      />
    </>
  );
}
