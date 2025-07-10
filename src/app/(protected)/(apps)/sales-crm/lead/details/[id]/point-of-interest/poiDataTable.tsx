'use client'
import { DataTable } from "@/ikon/components/data-table";
import { POIData } from "../../../../components/type";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { format } from "date-fns";
import { VIEW_DATE_TIME_FORMAT } from "@/ikon/utils/config/const";
//import { VIEW_DATE_TIME_FORMAT } from "@/config/const";

export default function POIDataTable({ poiData }: { poiData: POIData[] }) {
    const columns: DTColumnsProps<POIData>[] = [
        {
            accessorKey: "remarks",
            header: () => <div style={{ textAlign: "center" }}>Description</div>,
        },
        {
            accessorKey: "updatedOn",
            header: "Updated On",
            cell: ({ row }) => {
                const formattedDate =
                    row?.original?.updatedOn &&
                    format(row.original.updatedOn, VIEW_DATE_TIME_FORMAT)
                return <span>{formattedDate}</span>;
            },
        },
        {
            accessorKey: "updatedBy",
            header: "Updated By",
        },
    ];
    const extraParams: any = {
        searching: true,
        filtering: true,
        grouping: true,
    };
    return (
        <DataTable columns={columns} data={poiData} extraParams={extraParams} />
    )
}

