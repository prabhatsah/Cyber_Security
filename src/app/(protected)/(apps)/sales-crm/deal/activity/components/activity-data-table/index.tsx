'use client'
import { ColumnDef } from "@tanstack/react-table";
import { ActivityLog } from "../../../../components/type";
import { DataTable } from "@/ikon/components/data-table";
import { format } from "date-fns";
import { VIEW_DATE_TIME_FORMAT } from "@/ikon/utils/config/const";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
//import { getUserName } from "@/ikon/utils/actions/users/userUtils";

const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();

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
             return <span>{row.original?.updatedBy}</span>;
        },
    },
    {
        accessorKey: "updatedOn",
        header: "Updated On",
        cell: ({ row }) => {
            const formattedDate = row?.original?.updatedOn && format(row.original.updatedOn, VIEW_DATE_TIME_FORMAT)
            return <span>{formattedDate}</span>;
        },
    },
];

const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
};

function ActivityDataTable({ activityLogsData }: { activityLogsData: ActivityLog[] }) {
    return (
        <DataTable columns={columns} data={activityLogsData?.map((e: any) => e.data) || []} extraParams={extraParams} />
    )
}

export default ActivityDataTable