'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { FC } from "react";
import { DeletedDevicesTableProps } from "../types";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { DataTable } from "@/ikon/components/data-table";

interface Accountable {
    userId: string;
    userName: string;
}

interface DeleteDeviceData {
    accountable: Accountable;
    clientId: string;
    deleteDataAndTime: string; // Consider using Date type if you will parse it
    description: string;
    deviceId: string;
    hostIp: string;
    hostName: string;
    os: string;
    serviceCount: number;
    serviceData: unknown[]; // Change `any` to a more specific type if serviceData has a structure
    status: string;
    type: string;
}

function getExtraParams(){
    const extraParams: DTExtraParamsProps = {
        grouping: false,
        pageSize: 5,
        pageSizeArray: [5, 10, 15],
    }

    return extraParams;
}

function getColumns(){
    const columnDetailsSchema: DTColumnsProps<DeleteDeviceData>[] = [
        {
            accessorKey: "data.hostIp",
            header: 'Host IP',
            cell: ({ row }) => (
                <span>{ row.original.hostIp }</span>
            )
        },
        {
            accessorKey: "data.hostName",
            header: 'Hostname',
            cell: ({ row }) => (
                <span>{ row.original.hostName}</span>
            )
        },
        {
            accessorKey: "data.os",
            header: 'OS',
            cell: ({ row }) => (
                <span>{ row.original.os }</span>
            )
        },
        {
            accessorKey: "data.type",
            header: 'Type',
            cell: ({ row }) => (
                <span>{ row.original.type}</span>
            )
        },
        {
            accessorKey: "data.serviceCount",
            header: 'Service Count',
            cell: ({ row }) => (
                <span>{ row.original.serviceCount}</span>
            )
        },
    ]

    return columnDetailsSchema;
}

const DeletedDevicesTable : FC<DeletedDevicesTableProps> = ({open, close, deletedDeviceData }) => {
    //console.log('deviceId: ', deviceId);

    const extraParams = getExtraParams();
    const columns = getColumns();

    return (
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="overflow-auto min-w-[max-content]">
                    <DialogHeader>
                        <DialogTitle>Deleted Devices</DialogTitle>
                        <DialogDescription>
                            List of deleted devices
                        </DialogDescription>

                        <div>
                            <DataTable data={deletedDeviceData} columns={columns} extraParams={extraParams} />
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DeletedDevicesTable;