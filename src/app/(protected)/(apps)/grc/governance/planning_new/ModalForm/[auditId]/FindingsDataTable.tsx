"use client";
import React, { useMemo, useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import { format } from "date-fns";
import { Badge } from "@/shadcn/ui/badge";
import AddActionsMetting from "./actionMetting/addMettingActions";
import MeetObservatioForm from "./meetingObservation";
import EditFindingForm from "./EditFindingForm";
import AddMettingActions from "./actionMetting/addMettingActions";

export default function FindingsDataTable({
  auditData,
  findingsData,
  userIdNameMap,
  frameworkId,
  currentUserId,
  isAllowedForFindingAndActions
}: {
  auditData: Record<string, any>[];
  findingsData: any[];
  userIdNameMap: { value: string; label: string }[];
  frameworkId: string;
  currentUserId: string;
  isAllowedForFindingAndActions: boolean;
}) {
  console.log(frameworkId)
  const [openActionForm, setOpenActionForm] = useState<boolean>(false);
  const [selectedRowData, setSelectedRowData] = useState<Record<
    string,
    any
  > | null>(null);

  const [selectedMeeting, setSelectedMeeting] = useState<Record<
    string,
    any
  > | null>(null);
  const [openObserveForm, setOpenObserveForm] = useState<boolean>(false);



  // 🔁 Flatten observationDetails
  const flattenedData = useMemo(() => {
    const rows: any[] = [];
    findingsData.forEach((item) => {
      if (
        Array.isArray(item.observationDetails) &&
        item.observationDetails.length > 0
      ) {
        item.observationDetails.forEach((obs: any) => {
          rows.push({
            ...item,
            ...obs,
            controlObjName: item.controlObjective, // for clarity
          });
        });
      } else {
        rows.push({
          ...item,
          controlObjName: item.controlObjective,
        });
      }
    });
    return rows;
  }, [findingsData]);

  const columns: DTColumnsProps<Record<string, any>>[] = [
    {
      accessorKey: "controlName",
    },
    {
      accessorKey: "controlObjName",
      // header: "Control Objective",
    },
    {
      accessorKey: "conformity",
      header: "Conformity",
      cell: ({ row }) => {
        const riskLevel = row.original.conformity;
        return (
          <Badge
            variant="outline"
            className={`text-xs ${riskLevel === "Major"
              ? "text-red-500 border-red-500"
              : riskLevel === "Minor"
                ? "text-yellow-500 border-yellow-500"
                : riskLevel === "Confirm"
                  ? "text-green-500 border-green-500"
                  : "text-gray-500 border-gray-500"
              }`}
          >
            {riskLevel}
          </Badge>
        );
      },
    },
    {
      accessorKey: "observation",
      header: "Observation",
      cell: ({ row }) => (
        <div
          className="truncate max-w-[300px]"
          title={row.getValue("observation")}
        >
          {row.getValue("observation")}
        </div>
      ),
    },
    {
      accessorKey: "recommendation",
      header: "Recommendation",
      cell: ({ row }) => (
        <div
          className="truncate max-w-[250px]"
          title={row.getValue("recommendation")}
        >
          {row.getValue("recommendation")}
        </div>
      ),
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => {
        const ownerId = row.original.owner;
        const ownerName =
          userIdNameMap.find((user) => user.value === ownerId)?.label ||
          "Unknown";
        return ownerName;
      },
    },
    {
      accessorKey: "lastUpdatedOn",
      header: "Last Updated On",
      cell: ({ row }) => {
        const dateValue = row.original.lastUpdatedOn;
        return dateValue
          ? format(new Date(dateValue), "dd-MMM-yyyy HH:mm")
          : "N/A";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusValue = row.original.status || "Open";
        return (
          <Badge
            variant="outline"
            className={`text-xs ${statusValue === "Pass"
              ? "text-green-500 border-green-500"
              : statusValue === "Failed"
                ? "text-red-500 border-red-500"
                : statusValue === "On-hold"
                  ? "text-yellow-500 border-yellow-500"
                  : statusValue === "Open"
                    ? "text-blue-500 border-blue-500"
                    : "text-gray-500 border-gray-500"
              }`}
          >
            {statusValue}
          </Badge>
        );
      },
    },
  ];

  const extraParams: DTExtraParamsProps = {
    grouping: false,
    pagination: false,
    actionMenu: {
      items: [
        {
          label: "Edit Finding",
          onClick: (rowData) => {
            console.log(rowData);
            setSelectedMeeting(rowData);
            setOpenObserveForm(true);
          },
          visibility: (rowData) => {
            return isAllowedForFindingAndActions? true: rowData.owner !== currentUserId ? false : true;
          },
        },
        {
          label: "Add Actions",
          onClick: (rowData) => {
            console.log(rowData);
            setSelectedRowData(rowData);
            setOpenActionForm(true);
          },
          visibility: (rowData) => {
            return isAllowedForFindingAndActions? true: rowData.owner !== currentUserId ? false : rowData.status === "Pass" ? false : true;
          },
        },
      ],
    },
    defaultGroups: ["controlName", "controlObjName"],
  };

  return (
    <>
      <DataTable
        data={flattenedData}
        columns={columns}
        extraParams={extraParams}
      />
      {openActionForm && (
        <AddMettingActions
          openActionForm={openActionForm}
          setOpenActionForm={setOpenActionForm}
          userIdNameMap={userIdNameMap}
          selectedRowData={selectedRowData}
          frameworkId={frameworkId}
        />
      )}

      {openObserveForm && (
        <EditFindingForm
          open={openObserveForm}
          setOpen={setOpenObserveForm}
          userIdNameMap={userIdNameMap}
          findingData={selectedMeeting || {}}
          auditData={auditData}
        />
      )}

    </>
  );
}
