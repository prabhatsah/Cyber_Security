"use client";

import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { format } from "date-fns";
import { TicketData } from "../type";
import CreateTicketButtonWithModal from "../create-ticket";
import { useEffect, useState } from "react";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { Button } from "@/shadcn/ui/button";
import Link from "next/link";
import { ActionMenuProps } from "@/ikon/components/action-menu/type";
import { Ban, Edit, Eye, Info, Trash } from "lucide-react";
import CreateAssigneeModalForm from "../../all-tickets/details/ticket-details/components/ticket-workflow-component/components/assign-ticket-form";
import { Plus, Send, MessageCircle, Unlock } from "lucide-react";
import { fetchAllUserData } from "../fetchUserData";
import { UnlockTicket } from "../actionButton-Components/unlock-ticket";
import CommentModalForm from "../../all-tickets/details/ticket-details/components/ticket-workflow-component/allFunctionComponents/open-status-update-form";
import PostCommentModalForm from "../../all-tickets/details/ticket-details/components/ticket-workflow-component/allFunctionComponents/open-comment-form";
import { Checkbox } from "@/shadcn/ui/checkbox";
import {
  getUserIdWiseUserDetailsMap,
  getUsersByGroupName,
} from "@/ikon/utils/actions/users";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";

interface OpenTicketsDatatableProps {
  ticketData: TicketData[];
  showCreateTicket?: boolean; // Optional prop with a default value of false
  isOpen?:boolean;
  showActionBtn?: boolean;
  showExtraParam?: boolean;
}

export default function OpenTicketsDatatable({
  ticketData,
  showCreateTicket,
  showExtraParam,
  showActionBtn,
  isOpen,
}: OpenTicketsDatatableProps) {
  const [showMyTickets, setShowMyTickets] = useState(false);
  const [showUnassignedTickets, setShowUnassignedTickets] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<TicketData[]>(ticketData);

  useEffect(() => {
    async function fetchProfileData() {
      const profileData = await getProfileData();
      setUserId(profileData.USER_ID);
    }
    fetchProfileData();
  }, []);
  const { openDialog } = useDialog();
  // Simplified state types - just arrays of strings
  const [adminsIds, setAdminIds] = useState<string[]>([]);
  const [level1UserIds, setLevel1UserIds] = useState<string[]>([]);
  const [level2UserIds, setLevel2UserIds] = useState<string[]>([]);
  const [allUserIds, setAllUserIds] = useState<string[]>([]);

  // Fetch Level 1 Users
  useEffect(() => {
    const fetchLevel1Users = async () => {
      const data = await getUsersByGroupName(
        "Customer Support Team Level 1 (NOC)"
      );
      console.log("Customer Support Team Level 1 (NOC)------>>>", data);
      if (data?.users) {
        const userIds = Object.values(data.users).map((user) => user.userId);
        setLevel1UserIds(userIds);
      }
    };
    fetchLevel1Users();
  }, []);

  // Fetch Customer Support Admin Users
  useEffect(() => {
    const fetchCustomerSupportAdminUsers = async () => {
      const data = await getUsersByGroupName("Customer Support Admin");
      console.log("Customer Support Admin------>>>", data);
      if (data?.users) {
        const userIds = Object.values(data.users).map((user) => user.userId);
        setAdminIds(userIds);
      }
    };
    fetchCustomerSupportAdminUsers();
  }, []);

  // Fetch Level 2 Users
  useEffect(() => {
    const fetchLevel2Users = async () => {
      const data = await getUsersByGroupName("Customer Support Level 2 (PM)");
      console.log("Customer Support Team Level 2 (PM)------ new>>>", data);
      if (data?.users) {
        const userIds = Object.values(data.users).map((user) => user.userId);
        setLevel2UserIds(userIds);
      }
    };
    fetchLevel2Users();
  }, []);

  // Fetch All Active Users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const data = await getUserIdWiseUserDetailsMap();
        console.log("Fetched Data (Raw):", data);

        // Convert object of objects into an array of userIds for active users
        const userIds = Object.values(data)
          .filter((user) => user.userActive)
          .map((user) => user.userId);

        console.log("Processed Active User IDs:", userIds);
        setAllUserIds(userIds);
      } catch (error) {
        console.error("Error fetching users:", error);
        setAllUserIds([]); // Ensure it's never undefined
      }
    };

    fetchAllUsers();
  }, []);

  // Debugging UseEffect (Optional)
  useEffect(() => {
    console.log("Updated allUserIds:", allUserIds);
  }, [allUserIds]);

  console.log("level2UserIds---------------->>>>>", level2UserIds);
  console.log("usrId--------->", userId);
  if (userId && level2UserIds.includes(userId)) {
    console.log("User ID exists.");
  } else {
    console.log("User ID is null or not found.");
  }
  const columns: DTColumnsProps<TicketData>[] = [
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <Link
          href={`/customer-support/all-tickets/details/${row.original.ticketNo}`}
          className="underline hover:text-blue-200"
        >
          {row.original.subject}
        </Link>
      ),
    },
    {
      accessorKey: "ticketNo",
      header: "Ticket No.",
      cell: ({ row }) => <span>{row.original.ticketNo}</span>,
    },
    {
      accessorKey: "priority",
      header: "Severity",
      cell: ({ row }) => <span>{row.original.priority}</span>,
    },
    {
      accessorKey: "dateCreated",
      header: "Created On",
      cell: ({ row }) => (
        <span>{format(row.original.dateCreated, "yyyy-MM-dd HH:mm")}</span>
      ),
    },
    {
      accessorKey: "issueDate",
      header: "Issue Date & Time",
      cell: ({ row }) => (
        <span>{format(row.original.issueDate, "yyyy-MM-dd HH:mm")}</span>
      ),
    },
    {
      accessorKey: "accountName",
      header: "Account Name",
      cell: ({ row }) => <span>{row.original.accountName}</span>,
    },
    {
      accessorKey: "assigneeName",
      header: "Assignee Name",
      cell: ({ row }) => <span>{row.original.assigneeName || "..."}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <span>{row.original.status}</span>,
    },
    {
      header: "",
      accessorKey: "actions",
      enableSorting: false,
      cell: (row) => <div className="flex items-center"></div>,
    },

    // Conditionally include the Actions column based on showActionBtn
    // ...(showActionBtn
    //   ? [
    //       {
    //         header: "Actions",
    //         accessorKey: "actions",
    //         enableSorting: false,
    //         cell: () => <div className="flex items-center"></div>,
    //       },
    //     ]
    //   : []),
  ];

  console.log("showActionBtn:", showActionBtn);
  console.log("Columns:", columns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedTicketNo, setSelectedTicketNo] = useState("");
  const [selectedTicketNoForComment, setSelectedTicketNoForComment] =
    useState("");

  const isAdmin = userId && adminsIds.includes(userId);
  const isNOC = userId && level1UserIds.includes(userId);
  const isLevel2 = userId && level2UserIds.includes(userId);

  const addedButtons = new Set<string>();
  const buttons: ActionButton[] = [];

  console.log("what is showActionBtn do you know?", showActionBtn);

  interface ActionButton {
    label: string;
    icon: React.ComponentType;
    onClick?: (rowData: any) => void;
    hidden?: (rowData: any) => boolean;
  }
  const confirmUnlock = (ticketNo: string) => {
    openDialog({
      title: `Unlock Ticket #${ticketNo}?`,
      description: "This will allow other users to assign this ticket.",
      confirmText: "Unlock",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await UnlockTicket({
            ticketNo: ticketNo,
            presentUserId: userId || "",
          });
          // Optionally add success feedback here
        } catch (error) {
          console.error("Failed to unlock ticket:", error);
          // Optionally add error feedback here
        }
      },
      onCancel: () => console.log("Unlock cancelled"),
    });
  };

  const actionMenu = {
    items: showActionBtn
      ? [
          {
            label: "Post Comment",
            icon: MessageCircle,
            onClick: (rowData: any) => openCommentForm(rowData.ticketNo),
            visibility: (rowData: {
              creatorId: string | null;
              assigneeId: string | null;
            }) => {
              if (
                rowData.creatorId === userId ||
                isAdmin ||
                isNOC ||
                isLevel2 ||
                rowData.assigneeId === userId
              ) {
                return true;
              } else {
                return false;
              }
            },
          },
          {
            label: "Assign Ticket",
            icon: Plus,
            onClick: (rowData: any) => openAssigneeForm(rowData.ticketNo),
            visibility: (rowData: {
              assigneeId: any;
              status: string;
              assigneeLockStatus: string;
            }) => {
              if (rowData.assigneeLockStatus) {
                if (
                  rowData.assigneeLockStatus === "unlocked" &&
                  rowData.status === "New" &&
                  (isAdmin || isNOC || isLevel2)
                ) {
                  return true; // Return false if unlocked
                }
              }

              if ((isAdmin || isNOC || isLevel2) && rowData.status === "New") {
                return true;
              }

              // if ((isAdmin || isNOC || isLevel2) && rowData.status === "New" && !rowData.assigneeId) {
              //   if (rowData.assigneeLockStatus && rowData.assigneeLockStatus === "unlocked") {
              //     return true;
              //   }

              return false;
            },
          },
          {
            label: "Re-Assign Ticket",
            icon: Plus,
            onClick: (rowData: any) => openAssigneeForm(rowData.ticketNo),
            visibility: (rowData: any) => {
              if (
                rowData.assigneeLockStatus === "unlocked" &&
                (isAdmin ||
                  isNOC ||
                  isLevel2 ||
                  rowData.assigneeId === userId) &&
                rowData.status !== "New" &&
                rowData.assigneeId
              ) {
                return true;
              } else {
                return false;
              }
            },
          },

          {
            label: "Unlock Ticket",
            icon: Unlock,
            onClick: (rowData: any) => confirmUnlock(rowData.ticketNo),
            visibility: (rowData: {
              assigneeId: string | null;
              assigneeLockStatus: string;
              ACTIVE: any;
            }) => {
              if (
                rowData.assigneeLockStatus === "locked" &&
                (isAdmin || rowData.assigneeId === userId)
              ) {
                return true;
              } else {
                return false;
              }
            },
          },
        ]
      : [
          {
            label: "No Action",
            icon: Ban,
          },
        ],
  };

  const openCommentForm = (ticketNo: string) => {
    setSelectedTicketNoForComment(ticketNo);
    setIsCommentModalOpen(true);
  };

  const closeCommentForm = () => {
    setIsCommentModalOpen(false);
    setSelectedTicketNoForComment("");
  };

  const openAssigneeForm = (ticketNo: string) => {
    setSelectedTicketNo(ticketNo);
    setIsModalOpen(true);
  };

  const closeAssigneeForm = () => {
    setIsModalOpen(false);
    setSelectedTicketNo("");
  };

  useEffect(() => {
    let newFilteredData = ticketData;

    if (showMyTickets && userId) {
      newFilteredData = newFilteredData.filter(
        (ticket) => ticket.assigneeId === userId
      );
    }

    if (showUnassignedTickets) {
      newFilteredData = newFilteredData.filter((ticket) => !ticket.assigneeId);
    }

    setFilteredData(newFilteredData);
  }, [showMyTickets, showUnassignedTickets, userId, ticketData]);

  if (showCreateTicket) {
  }
  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    actionMenu: actionMenu,
    // ...(showActionBtn ?? false ? { actionMenu } : {}),
    extraTools: [
      ...(showExtraParam // Your new conditional check
        ? [
            <label key="my-tickets" className="ml-4 mt-1.5">
              <Checkbox
                checked={showMyTickets}
                onCheckedChange={() => setShowMyTickets(!showMyTickets)}
              />{" "}
              My Tickets
            </label>,
            <label key="unassigned-tickets" className="mt-1.5">
              <Checkbox
                checked={showUnassignedTickets}
                onCheckedChange={() =>
                  setShowUnassignedTickets(!showUnassignedTickets)
                }
              />{" "}
              Unassigned Tickets
            </label>,
          ]
        : []),
      ...(showCreateTicket
        ? [<CreateTicketButtonWithModal key="create-ticket" />]
        : []),
  
    ],
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredData}
        extraParams={extraParams}
      />
      {isModalOpen && selectedTicketNo && (
        <CreateAssigneeModalForm
          isOpen={isModalOpen}
          onClose={closeAssigneeForm}
          ticketNo={selectedTicketNo}
        />
      )}
      {isCommentModalOpen && selectedTicketNoForComment && (
        <PostCommentModalForm
          isOpen={isCommentModalOpen}
          onClose={closeCommentForm}
          ticketNo={selectedTicketNoForComment}
        />
      )}
    </>
  );
}
