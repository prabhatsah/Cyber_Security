import React, { startTransition } from "react";
import NotificationDataTable from "./components/notificationTable";
import { getNotifiactionData } from "./components/sampleNotificationData";

export default async function Notificataion() {
  // const router = useRouter()
  const dataObj = await getNotifiactionData();

  return (
    <div className="flex flex-col gap-2 overflow-auto">
      <h1 className="text-2xl font-semibold">Notification</h1>
      <h2 className="mt-2 mb-4">Manage your all notifications</h2>
      <NotificationDataTable data={dataObj} />
    </div>
  );
}

// 'use client';

// import { DTColumnsProps } from "@/components/ikon-components/data-table/type";
// import React, { useEffect, useState } from "react";
// import { NotificationType } from "./components/type";
// import { DataTable } from "@/components/ikon-components/data-table";
// import  { NotificationData } from "./components/sampleNotificationData";
// import ArchiveButton from "./components/archiveButton";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { TextButton } from "@/ikon/components/buttons";;
// import { EllipsisVertical, Eye, EyeOff, Star } from "lucide-react";
// import getNotifiactionData from "./components/sampleNotificationData";

// export default function Notificataion() {

//     const activeTableData:any = [];
//     const archiveTableData:any = [];

//     const notificationArchiveData = NotificationData.map((notifData)=>{
//         if(notifData.archived){
//             archiveTableData.push(notifData);
//         }else{
//             activeTableData.push(notifData)
//         }
//     })

//     const [activeRows, setActiveRows] = useState<NotificationType[]>(activeTableData);

//     const [archivedRows, setArchivedRows] = useState<NotificationType[]>(archiveTableData);

//     const [viewArchived, setViewArchived] = useState<boolean>(false);

//     const rowsToDisplay = viewArchived ? archivedRows : activeRows;

//     const extraParams: any = {
//         searching: true,
//         filtering: true,
//         grouping: true,
//         extraTools: [
//             <ArchiveButton viewArchived={viewArchived} setViewArchived={setViewArchived} />
//         ],
//     };

//     const handleArchive = (id: string) => {
//         const rowToArchive = activeRows.find((row) => row.notification_id === id);

//         if (rowToArchive) {
//             rowToArchive.archived = true;
//             setActiveRows(activeRows.filter((row) => row.notification_id !== id));
//             setArchivedRows([...archivedRows, rowToArchive]);
//         }
//     };

//     const handleUnarchive = (id: string) => {
//         const rowToUnarchive = archivedRows.find((row) => row.notification_id === id);
//         if (rowToUnarchive) {
//             rowToUnarchive.archived = false;
//             setArchivedRows(archivedRows.filter((row) => row.notification_id !== id));
//             setActiveRows([...activeRows, rowToUnarchive]);
//         }
//     };

//     const handleAddRemoveStar = (id: string) => {

//         const toggleStarInRows = (rows: NotificationType[]): NotificationType[] =>
//             rows.map(row =>
//                 row.notification_id === id ? { ...row, starred: !row.starred } : row
//             );
//         if (activeRows.some(row => row.notification_id === id)) {
//             setActiveRows(prevRows => toggleStarInRows(prevRows));
//         } else if (archivedRows.some(row => row.notification_id === id)) {
//             setArchivedRows(prevRows => toggleStarInRows(prevRows));
//         }

//     };

//     const handleRowView = (id: string) => {
//         const toggleViewInRows = (rows: NotificationType[]): NotificationType[] =>
//             rows.map(row =>
//                 row.notification_id === id ? { ...row, read: !row.read } : row
//             );

//         if (activeRows.some(row => row.notification_id === id)) {
//             setActiveRows(prevRows => toggleViewInRows(prevRows));
//         } else if (archivedRows.some(row => row.notification_id === id)) {
//             setArchivedRows(prevRows => toggleViewInRows(prevRows));
//         }
//     };

//     // const handleDeleteRow = (id: string) => {
//     //     const rowToBeDeletedInActive = activeRows.find((row) => row.id === id);
//     //     if (rowToBeDeletedInActive) {
//     //         setActiveRows(activeRows.filter((row) => row.id !== id));
//     //     } else {
//     //         const rowToBeDeletedInArchive = archivedRows.find((row) => row.id === id);
//     //         if (rowToBeDeletedInArchive) {
//     //             setArchivedRows(archivedRows.filter((row) => row.id !== id));
//     //         }
//     //     }

//     // }

//     // Define your columns for NotificationData
//     const NotificationColumns: DTColumnsProps<NotificationType>[] = [

//         {
//             accessorKey: "starred",
//             header: "Favorite",
//             cell: ({ row }) => {
//                 const rowData = row.original;
//                 return (
//                     <span onClick={() => handleAddRemoveStar(rowData.notification_id)} style={{ cursor: "pointer" }}>
//                         {rowData.starred ? (
//                             <Star color="red" fill="red" />
//                         ) : (
//                             <Star />
//                         )}
//                     </span>
//                 );
//             },
//         },

//         {
//             accessorKey: "notificationName",
//             header: "Notification Name",
//             cell: ({ row }) => <span>{row.original.notification_name}</span>
//         },
//         {
//             accessorKey: "notificationPriority",
//             header: "Priority",
//             cell: ({ row }) => <span>{row.original.priority}</span>
//         },
//         {
//             accessorKey: "notificationType",
//             header: "Type",
//             cell: ({ row }) => <span>{row.original.type}</span>
//         },
//         {
//             accessorKey: "creationTime",
//             header: "Creation Time",
//             cell: ({ row }) => <span>{row.original.created_at}</span>
//         },
//         {
//             accessorKey: "description",
//             header: "Description",
//             cell: ({ row }) => <span>{row.original.description}</span>
//         },

//         {
//             accessorKey: "read",
//             header: "View Status",

//             cell: ({ row }) => {
//                 const rowData = row.original;
//                 return (
//                     <span onClick={() => handleRowView(rowData.notification_id)} style={{ cursor: "pointer" }}>
//                         {rowData.read ? (
//                             <Eye />
//                         ) : (
//                             <EyeOff />
//                         )}
//                     </span>
//                 );
//             },
//         },
//         {
//             accessorKey: "sourceApp",
//             header: "Source App",
//             cell: ({ row }) => <span>{row.original.created_by}</span>
//         },
//         {
//             id: "tableActions",
//             enableHiding: false,
//             cell: ({ row }) => {
//                 const rowData = row.original

//                 return (
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" className="h-8 w-8 p-0">
//                                 <span className="sr-only">Open menu</span>
//                                 <EllipsisVertical />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                             {
//                                 viewArchived ?

//                                     <DropdownMenuItem
//                                         onClick={() => handleUnarchive(rowData.notification_id)}
//                                     >
//                                         UnArchive
//                                     </DropdownMenuItem> :
//                                     <DropdownMenuItem
//                                         onClick={() => handleArchive(rowData.notification_id)}
//                                     >
//                                         Archive
//                                     </DropdownMenuItem>

//                             }
//                             <DropdownMenuItem
//                                 onClick={() => handleAddRemoveStar(rowData.notification_id)}
//                             >
//                                 {rowData.starred ? 'Remove from' : 'Add to'} Favourite
//                             </DropdownMenuItem>

//                             <DropdownMenuItem
//                                 onClick={() => handleRowView(rowData.notification_id)}
//                             >
//                                 Mark as {rowData.read ? 'Unread' : 'Read'}
//                             </DropdownMenuItem>

//                             {/* <DropdownMenuItem>View payment details</DropdownMenuItem> */}
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 )
//             },
//         },
//     ];

//     async function handleClick(){
//         const dataObj = await getNotifiactionData()
//         console.log(dataObj);

//     }

//     return (
//         <div className="flex flex-col gap-2 overflow-auto">
//             <h1 className="text-2xl font-semibold">Notification</h1>
//             <h2 className="mt-2 mb-4">Manage your all notifications</h2>
//             <DataTable columns={NotificationColumns} data={rowsToDisplay} extraParams={extraParams} />
//             <Button onClick={handleClick}>Click</Button>
//         </div>
//     );
// }
