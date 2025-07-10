"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { statusColors } from "../../lib/chart-theme"
import { DataTable } from "@/ikon/components/data-table"
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";
import { format } from 'date-fns';

const recentAudits = [
  {
    id: "1",
    name: "IT Security Audit",
    status: "In Progress",
    date: "2024-03-15",
    color: statusColors["In Progress"]
  },
  {
    id: "2",
    name: "Financial Controls Review",
    status: "Completed",
    date: "2024-03-10",
    color: statusColors.Completed
  },
  {
    id: "3",
    name: "GDPR Compliance Audit",
    status: "Planned",
    date: "2024-03-20",
    color: statusColors.Planned
  },
  {
    id: "4",
    name: "ISO 27001 Assessment",
    status: "In Progress",
    date: "2024-03-12",
    color: statusColors["In Progress"]
  },
]

const columnsProductDetails: DTColumnsProps<any>[] = [
  { accessorKey: "name", header: () => <div style={{ textAlign: 'center' }}>Name</div> },
  { accessorKey: "status", header: () => <div style={{ textAlign: 'center' }}>Status</div> },
  { accessorKey: "date", header: () => <div style={{ textAlign: 'center' }}>Date</div> },
];
const extraParams: any = {
  defaultTools: false,
  grouping: false
};

export function RecentAudits({ auditData, userIdNameMap }: { auditData: Record<string, any>[]; userIdNameMap: { value: string; label: string }[]; }) {
  // return (
  //   // <Table>
  //   //   <TableHeader>
  //   //     <TableRow>
  //   //       <TableHead>Name</TableHead>
  //   //       <TableHead>Status</TableHead>
  //   //       <TableHead>Date</TableHead>
  //   //     </TableRow>
  //   //   </TableHeader>
  //   //   <TableBody>
  //   //     {recentAudits.map((audit) => (
  //   //       <TableRow key={audit.id}>
  //   //         <TableCell className="font-medium">{audit.name}</TableCell>
  //   //         <TableCell>
  //   //           <Badge style={{ backgroundColor: audit.color, color: "white" }}>
  //   //             {audit.status}
  //   //           </Badge>
  //   //         </TableCell>
  //   //         <TableCell>{audit.date}</TableCell>
  //   //       </TableRow>
  //   //     ))}
  //   //   </TableBody>
  //   // </Table>
  //   <DataTable columns={columnsProductDetails} data={recentAudits} extraParams={extraParams} />
  // )

  // previous code it was now we are adding new audit data 





  const columns: DTColumnsProps<Record<string, any>>[] = [
    {
      accessorKey: "auditName",
      header: "Audit Name",

    },
    {
      accessorKey: "auditCycle",
      header: "Type",
    },
    // {
    //   accessorKey: "auditorTeam",
    //   header: "Auditor Team",
    //   cell: ({ row }) => {
    //     const auditorTeamIds = row.original.auditorTeam;

    //     // Map the IDs to their corresponding names using userIdNameMap
    //     const auditorTeamNames = Array.isArray(auditorTeamIds)
    //       ? auditorTeamIds
    //         .map((id: string) => userIdNameMap.find((user) => user.value === id)?.label)
    //         .filter((name) => name) // Filter out undefined names
    //       : [];

    //     // Join names and truncate with ellipses if too long
    //     const fullNames = auditorTeamNames.join(", ");
    //     const displayNames = fullNames.length > 20 ? `${fullNames.slice(0, 20)}...` : fullNames;

    //     return (
    //       <span
    //         title={fullNames} // Show full names on hover
    //       >
    //         {displayNames}
    //       </span>
    //     );
    //   }
    // },
    // {
    //   accessorKey: "auditeeTeam",
    //   header: "Auditee Team",
    //   cell: ({ row }) => {
    //     const auditeeTeamIds = row.original.auditeeTeam || row.original.auditeeTeamName;

    //     // Map the IDs to their corresponding names using userIdNameMap
    //     const auditeeTeamNames = Array.isArray(auditeeTeamIds)
    //       ? auditeeTeamIds
    //         .map((id: string) => userIdNameMap.find((user) => user.value === id)?.label)
    //         .filter((name) => name) // Filter out undefined names
    //       : [];

    //     // Join names and truncate with ellipses if too long
    //     const fullNames = auditeeTeamNames.join(", ");
    //     const displayNames = fullNames.length > 20 ? `${fullNames.slice(0, 20)}...` : fullNames;

    //     return (
    //       <span
    //         title={fullNames} // Show full names on hover
    //       >
    //         {displayNames}
    //       </span>
    //     );
    //   }
    // },
    {
      accessorKey: "auditStart",
      header: "Audit Start",
      cell: ({ row }) => {
        const dateValue = row.original.auditStart;
        return dateValue ? format(new Date(dateValue), SAVE_DATE_FORMAT_GRC) : "N/A";
      },
    },
    // {
    //   accessorKey: "auditEnd",
    //   header: "Audit End",
    //   cell: ({ row }) => {
    //     const dateValue = row.original.auditEnd;
    //     return dateValue ? format(new Date(dateValue), SAVE_DATE_FORMAT_GRC) : "N/A";
    //   },
    // },
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
    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ row }) => {
    //     if (row.original.status) {
    //       return (
    //         <span className="badge-info">
    //           {row.original.status}
    //         </span>
    //       );
    //     } else {
    //       return (
    //         <span className="badge-info">
    //           Planning
    //         </span>
    //       );
    //     }
    //   }
    // }
  ];

  const extraParams: DTExtraParamsProps = {
    pagination: false,
    grouping: false,
    
  }

  return (
    <>
      <div className="h-80 overflow-y-auto">
        <DataTable data={auditData} columns={columns} extraParams={extraParams} />
      </div>

    </>
  );
}