'use client'
import { ColumnDef } from "@tanstack/react-table";
import { ActivityLog } from "../../../../components/type";
import { DataTable } from "@/ikon/components/data-table";

import { getDateTimeFormat } from "@/ikon/utils/actions/format";
import { UserIdWiseUserDetailsMapProps } from "@/ikon/utils/actions/users/type";

function ActivityDataTable({ activityLogsData, userIdWiseUserDetailsMap }: { activityLogsData: ActivityLog[], userIdWiseUserDetailsMap: UserIdWiseUserDetailsMapProps }) {
    
    // Column Schema
    const columns: ColumnDef<ActivityLog>[] = [
        {
            accessorKey: "activity",
            header: () => (
                <div style={{ textAlign: 'center' }}>
                    Description
                </div>
            ),
            cell: ({ row }) => <span>{row.original?.activity || "n/a"}</span>,
        },
        {
            accessorKey: "updatedBy",
            header: "Updated By",
            cell: ({ row }) => {
                return <span>{userIdWiseUserDetailsMap[row.original?.updatedBy]?.userName || "n/a"}</span>;
            },
        },
        {
            accessorKey: "updatedOn",
            header: "Updated On",
            cell: ({ row }) => {
                return <span>{getDateTimeFormat(row?.original?.updatedOn)}</span>;
            },
        },
    ];

    const extraParams: any = {
        searching: true,
        filtering: true,
        grouping: true,
    };
    return (
        <DataTable columns={columns} data={activityLogsData} extraParams={extraParams} />
    )
}

export default ActivityDataTable