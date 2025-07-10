"use client";

import React, { Suspense, useEffect, useState } from "react";
import { format } from "date-fns";
import CreateAssignmentButtonWithModal from "../create-assignment";
import { DataTable } from "@/ikon/components/data-table";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import { ActionMenuProps } from "@/ikon/components/action-menu/type";
import AssignmentModal from "../create-assignment/createAssignmentModalForm";
import ClientAssigneeModal from "../assignment-invoke/clientComponent";
import {
  deleteAssignment,
  invokeAssignmentProcessAssigneeForm,
} from "../assignment-invoke";
import { Circle, Edit, Eye, Info, Loader2Icon, Trash } from "lucide-react";
import openStatusModal from "../assignment-status";
import OpenStatusModal from "../assignment-status";
import moment from "moment";
import {
  IconTextButton,
  TextButtonWithTooltip,
} from "@/ikon/components/buttons";

export const VIEW_DATE_TIME_FORMAT = {
  date: "dd-MM-yyyy",
  time: "HH:mm:ss",
  dateTime: "dd-MM-yyyy HH:mm:ss",
} as const;

type Assignment = {
  assignmentId: string;
  name: string;
  email: string;
  status: string;
  assignmentName: string;
  assignmentDescription: string;
  creationDate: string;
  creationTime: string;
  lastUpdatedOn: string;
  assigneeName: string;
};

const columns: DTColumnsProps<Assignment, unknown>[] = [
  {
    header: "Status",
    accessorKey: "status",
    enableSorting: false,
    cell: (row) => {
      const status = row.getValue<string>();
      let borderClass = "border-success";
      if (status === "New" || status === "Assignment Created")
        borderClass = "border-danger";
      else if (status === "Project Created") borderClass = "border-warning";

      return (
        <span className={`me-2 px-2 border rounded-full ${borderClass}`}>
          {status || "N/A"}
        </span>
      );
    },
  },
  {
    header: "Assignment Name",
    accessorKey: "assignmentName",
    enableSorting: false,
    cell: (row) => <span>{row.getValue<string>() || "N/A"}</span>,
  },
  {
    header: "Description",
    accessorKey: "assignmentDescription",
    enableSorting: false,
    cell: (row) => {
      const description = row.getValue<string>();
      return (
        <div
          className="ellipsis whitespace-normal"
          title={description}
          style={{
            maxWidth: "300px",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description || "N/A"}
        </div>
      );
    },
  },
  {
    id: "creationDate",
    header: "Creation Date",
    accessorKey: "createdOn",
    enableSorting: false,
    cell: (row) => {
      const rawDate = row.getValue<string>();
      try {
        return (
          <span>{format(new Date(rawDate), VIEW_DATE_TIME_FORMAT.date)}</span>
        );
      } catch (e) {
        return <span>N/A</span>;
      }
    },
  },
  {
    id: "creationTime",
    header: "Creation Time",
    accessorKey: "createdOn",
    enableSorting: false,
    cell: (row) => {
      const rawDate = row.getValue<string>();
      try {
        return (
          <span>{format(new Date(rawDate), VIEW_DATE_TIME_FORMAT.time)}</span>
        );
      } catch (e) {
        return <span>N/A</span>;
      }
    },
  },
  {
    header: "Updated On",
    accessorKey: "lastUpdatedOn",
    enableSorting: false,
    cell: (row) => {
      const rawDate = row.getValue<string>();
      try {
        return (
          <span>
            {format(new Date(rawDate), VIEW_DATE_TIME_FORMAT.dateTime)}
          </span>
        );
      } catch (e) {
        return <span>N/A</span>;
      }
    },
  },
  {
    header: "Assignee Name",
    accessorKey: "assigneeName",
    enableSorting: false,
    cell: (row) => <span>{row.getValue<string>() || "N/A"}</span>,
  },
];

function AssignmentDataTable({
  assignmentData,
}: {
  assignmentData: Assignment[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);
  const [assignmentStatus, setAssignmentStatus] = useState<any>({});
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const openStatusModal = async (assignmentId: any) => {
    try {
      const assignmentData = await invokeAssignmentProcessAssigneeForm(
        assignmentId
      );
      console.log("Fetched assignmentData:", assignmentData);

      // Update the selectedAssignment state (if applicable)
      setSelectedAssignment(assignmentData);

      // Extract deployed goal details
      const deployedGoal = assignmentData?.assignmentDetails.goalsArray?.find(
        (goal) => goal?.modelDeatils?.[0]?.status === "deployed"
      );

      // Update assignment status
      setAssignmentStatus({
        assignmentId: assignmentData?.assignmentDetails.assignmentId,
        assignmentName: assignmentData?.assignmentDetails.assignmentName,
        assignmentDescription:
          assignmentData?.assignmentDetails.assignmentDescription,
        assignTime: moment(
          assignmentData?.assignmentDetails.assigneeTime
        ).format("YYYY-MMM-DD"),
        status:
          assignmentData?.assignmentDetails.pastProjectStatus ??
          assignmentData?.status,
        createdOn: assignmentData?.createdOn,
        projectCreatedDate: assignmentData?.assignmentDetails.projectCreatedDate
          ? moment(assignmentData.assignmentDetails.projectCreatedDate).format(
              "YYYY-MMM-DD"
            )
          : "N/A",
        requirementFinalizedOn:
          assignmentData?.assignmentDetails.requirementFinalizedOn,
        modelBuiltOn: assignmentData?.assignmentDetails.goalsArray,
        modelBuiltOnDate: assignmentData?.assignmentDetails.goalsArray?.[0]
          ?.modelDeatils?.[0]?.updatedOn
          ? moment(
              assignmentData.assignmentDetails.goalsArray[0].modelDeatils[0]
                .updatedOn,
              "DD-MM-YYYY HH:mm:ss"
            ).format("YYYY-MMM-DD")
          : "N/A",
        modelValidatedOn: assignmentData?.assignmentDetails.goalsArray,
        modelTestedOn: assignmentData?.assignmentDetails.modelTestedOn,
        modelDeployedOn: assignmentData?.assignmentDetails.goalsArray,
        assignmentAcceptedOn:
          assignmentData?.assignmentDetails.assignmentAcceptedOn,
        assignmentDeliveredOn:
          assignmentData?.assignmentDetails.assignmentDeliveredOn,
        // clientName: assignmentData?assignmentDetails.clientName,
        workspaceName: assignmentData?.assignmentDetails.workspaceName,
        modelDeploymentDate: deployedGoal?.modelDeatils?.[0]?.updatedOn
          ? moment(
              deployedGoal.modelDeatils[0].updatedOn,
              "DD-MM-YYYY HH:mm:ss"
            ).format("YYYY-MMM-DD")
          : "N/A",
        assignHistoryStatus:
          assignmentData?.assignmentDetails.assignHistory?.length > 0,
        assignmentDeliveredDate: "N/A",
      });

      // Open the modal after state update
      setTimeout(() => setIsStatusModalOpen(true), 0);
    } catch (error) {
      console.error("Error fetching assignment data:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
  };

  const handleCloseAssigneeModal = () => {
    setIsAssigneeModalOpen(false);
    setSelectedAssignment(null);
  };

  const handleView = (assignmentId: string) => {
    const found = assignmentData.find((a) => a.assignmentId === assignmentId);
    if (found) {
      setSelectedAssignment(found);
      setIsModalOpen(true);
    } else {
      console.error("Assignment not found with id:", assignmentId);
    }
  };

  const openAssigneeForm = async (assignmentId: string) => {
    try {
      setSelectedAssignment(null); // Reset first
      setIsAssigneeModalOpen(false); // Ensure modal is closed before updating data

      const assignmentData = await invokeAssignmentProcessAssigneeForm(
        assignmentId
      );
      console.log("assignmentData i am here", assignmentData);

      setTimeout(() => {
        //@ts-ignore
        setSelectedAssignment(assignmentData); // Set fetched assignment details
        setIsAssigneeModalOpen(true);
      }, 0); // Delay ensures re-rendering happens correctly
    } catch (error) {
      console.error("Error fetching assignment details:", error);
    }
  };

  // const actionMenus: ActionMenuProps[] = [
  //   {
  //     label: "View",
  //     icon: Eye,
  //     onClick: (row: any) => handleView(row.original.assignmentId),
  //   },
  //   {
  //     label: "Update Assignee",
  //     icon: Edit,
  //     onClick: (row: any) => openAssigneeForm(row.original.assignmentId),
  //   },
  //   {
  //     label: "View Status",
  //     icon: Info,
  //   },
  //   {
  //     label: "Delete",
  //     icon: Trash,
  //   },
  // ];

  const actionMenu = {
    items: [
      {
        label: "View",
        icon: Eye,
        onClick: (rowData: any) => handleView(rowData.assignmentId),
      },
      {
        label: "Update Assignee",
        icon: Edit,
        onClick: (rowData: any) => openAssigneeForm(rowData.assignmentId),
      },
      {
        label: "View Status",
        icon: Info,
        onClick: (rowData: any) => openStatusModal(rowData.assignmentId),
      },
      {
        label: "Delete",
        icon: Trash,
        onClick: (rowData: any) => deleteAssignment(rowData.assignmentId),
      },
    ],
  };

  const extraParams: DTExtraParamsProps = {
    grouping: true,
    extraTools: [<CreateAssignmentButtonWithModal key="create-assignment" />],
    actionMenu: actionMenu,
  };

  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Loader2Icon className="animate-spin w-16 h-16" />
          </div>
        }
      >
        <DataTable
          columns={columns}
          data={assignmentData || []}
          extraParams={extraParams}
        />
        {/* Assignment Details Modal */}
        {selectedAssignment && (
          <AssignmentModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            assignment={selectedAssignment}
          />
        )}
        {/* Assignee Update Modal */}
        {isAssigneeModalOpen && (
          <ClientAssigneeModal
            //@ts-ignore
            assignmentId={selectedAssignment?.assignmentId}
            //@ts-ignore
            assignmentName={selectedAssignment?.assigneeName}
            //@ts-ignore
            assignees={selectedAssignment.assignees}
            assignmentData={assignmentData}
            onClose={handleCloseAssigneeModal}
          />
        )}
        {isStatusModalOpen && (
          <OpenStatusModal
            open={isStatusModalOpen}
            setOpen={setIsStatusModalOpen}
            assignmentStatus={assignmentStatus}
          />
        )}
      </Suspense>
    </>
  );
}

export default AssignmentDataTable;
