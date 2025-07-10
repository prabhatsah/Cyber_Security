"use client";

import { useState, useEffect } from "react";
import { NotificationType } from "./type";
import { EllipsisVertical, Eye, EyeOff, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import ArchiveButton from "./archiveButton";
import { updateNotifiactionData } from "./sampleNotificationData";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";

export default function NotificationDataTable({ data }: any) {
  const [activeRows, setActiveRows] = useState<NotificationType[]>([]);
  const [archivedRows, setArchivedRows] = useState<NotificationType[]>([]);
  const [viewArchived, setViewArchived] = useState<boolean>(false);

  // Sorting the data into active and archived notifications
  useEffect(() => {
    const activeTableData: NotificationType[] = [];
    const archiveTableData: NotificationType[] = [];

    data.forEach((notifData: NotificationType) => {
      if (notifData.archived) {
        archiveTableData.push(notifData);
      } else {
        activeTableData.push(notifData);
      }
    });

    setActiveRows(activeTableData);
    setArchivedRows(archiveTableData);
  }, []); // Only run once when the component is mounted

  const rowsToDisplay = viewArchived ? archivedRows : activeRows;

  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    extraTools: [
      // <ArchiveButton
      //   viewArchived={viewArchived}
      //   setViewArchived={setViewArchived}
      // />,
    ],
  };

  const handleArchive = (id: string) => {
    const rowToArchive = activeRows.find((row) => row.notification_id === id);

    if (rowToArchive) {
      rowToArchive.archived = true;
      setActiveRows(activeRows.filter((row) => row.notification_id !== id));
      setArchivedRows([...archivedRows, rowToArchive]);
    }
  };

  const handleUnarchive = (id: string) => {
    const rowToUnarchive = archivedRows.find(
      (row) => row.notification_id === id
    );
    if (rowToUnarchive) {
      rowToUnarchive.archived = false;
      setArchivedRows(archivedRows.filter((row) => row.notification_id !== id));
      setActiveRows([...activeRows, rowToUnarchive]);
    }
  };

  const handleAddRemoveStar = (id: string) => {
    const toggleStarInRows = (rows: NotificationType[]): NotificationType[] =>
      rows.map((row) =>
        row.notification_id === id ? { ...row, starred: !row.starred } : row
      );
    if (activeRows.some((row) => row.notification_id === id)) {
      setActiveRows((prevRows) => toggleStarInRows(prevRows));
    } else if (archivedRows.some((row) => row.notification_id === id)) {
      setArchivedRows((prevRows) => toggleStarInRows(prevRows));
    }
  };

  const handleRowView = async (id: string, read: boolean) => {
    const toggleViewInRows = (rows: NotificationType[]): NotificationType[] =>
      rows.map((row) =>
        row.notification_id === id ? { ...row, read: !row.read } : row
      );

    if (activeRows.some((row) => row.notification_id === id)) {
      setActiveRows((prevRows) => toggleViewInRows(prevRows));
    } else if (archivedRows.some((row) => row.notification_id === id)) {
      setArchivedRows((prevRows) => toggleViewInRows(prevRows));
    }
    await updateNotifiactionData({ notification_ids: [id], read: !read });
  };

  const NotificationColumns: DTColumnsProps<NotificationType>[] = [
    {
      accessorKey: "starred",
      header: "Favorite",
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <span
            onClick={() => handleAddRemoveStar(rowData.notification_id)}
            style={{ cursor: "pointer" }}
          >
            {rowData.starred ? <Star color="red" fill="red" /> : <Star />}
          </span>
        );
      },
    },
    {
      accessorKey: "notificationName",
      header: "Notification Name",
      cell: ({ row }) => <span>{row.original.notification_name}</span>,
    },
    {
      accessorKey: "notificationPriority",
      header: "Priority",
      cell: ({ row }) => <span>{row.original.priority}</span>,
    },
    {
      accessorKey: "notificationType",
      header: "Type",
      cell: ({ row }) => <span>{row.original.type}</span>,
    },
    {
      accessorKey: "creationTime",
      header: "Creation Time",
      cell: ({ row }) => <span>{row.original.created_at}</span>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <span>{row.original.description}</span>,
    },
    {
      accessorKey: "read",
      header: "View Status",
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <span
            onClick={() => handleRowView(rowData.notification_id, rowData.read)}
            style={{ cursor: "pointer" }}
          >
            {rowData.read ? <Eye /> : <EyeOff />}
          </span>
        );
      },
    },
    {
      accessorKey: "sourceApp",
      header: "Source App",
      cell: ({ row }) => <span>{row.original.created_by}</span>,
    },
    {
      id: "tableActions",
      enableHiding: false,
      cell: ({ row }) => {
        const rowData = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {viewArchived ? (
                <DropdownMenuItem
                  onClick={() => handleUnarchive(rowData.notification_id)}
                >
                  UnArchive
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleArchive(rowData.notification_id)}
                >
                  Archive
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => handleAddRemoveStar(rowData.notification_id)}
              >
                {rowData.starred ? "Remove from" : "Add to"} Favourite
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleRowView(rowData.notification_id, rowData.read)
                }
              >
                Mark as {rowData.read ? "Unread" : "Read"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={NotificationColumns}
      data={rowsToDisplay}
      extraParams={extraParams}
    />
  );
}

// export default NotificationDataTable;
