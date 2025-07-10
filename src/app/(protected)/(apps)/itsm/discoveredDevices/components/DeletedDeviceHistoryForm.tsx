"use client";

import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { DeletedDeviceHistoryFormProps } from "../types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Separator } from "@/shadcn/ui/separator";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { DataTable } from "@/ikon/components/data-table";
import DeletedDevicesTable from "./DeletedDevicesTable";

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

interface DeleteDeviceData2 {
    deleteDataAndTime: string;
    status: string;
    deviceId: string;
    userName: string;
    totalDeviceDeleted: number;
    deleteDeviceData : DeleteDeviceData[]
}

async function fetchDeletedDeviceHistoryData(){
    const data = await getMyInstancesV2<DeleteDeviceData>({
        processName: 'Device Delete History Process',
        predefinedFilters : {
            taskName: 'View Delete Device History'
        }
    })

    return data;
}

function getExtraParams(){
    const extraParams: DTExtraParamsProps = {
        grouping: true,
        pageSize: 5,
        pageSizeArray: [5, 10, 15],
    }

    return extraParams;
}

function getColumns(setModalOpen: Dispatch<SetStateAction<boolean>>, setShowDeletedDevices: Dispatch<SetStateAction<DeleteDeviceData[] | undefined>>){
    const columnDetailsSchema: DTColumnsProps<DeleteDeviceData2>[] = [
        {
            accessorKey: "data.acountable.userName",
            header: 'Deleted By',
            cell: ({ row }) => (
                <span>{ row.original.userName }</span>
            )
        },
        {
            accessorKey: "data.deleteDataAndTime",
            header: 'Deleted On',
            cell: ({ row }) => (
                <span>{ row.original.deleteDataAndTime }</span>
            )
        },
        {
            accessorKey: "data.totalDeviceDeleted",
            header: 'Deleted Count',
            cell: ({ row }) => (
                <span className="cursor-pointer" onClick={()=>{ 
                        console.log('++ ', row)
                        setShowDeletedDevices(row.original.deleteDeviceData)
                        setModalOpen(true) 
                    }}
                >{ row.original.totalDeviceDeleted }</span>
            )
        },
        {
            accessorKey: "data.status",
            header: 'Status',
            cell: ({ row }) => (
                <span>{ row.original.status }</span>
            )
        },
    ]

    return columnDetailsSchema;
}

const DeletedDeviceHistoryForm : FC<DeletedDeviceHistoryFormProps> = ({open, close, profile}) => {
    console.log('profile inside DeletedDeviceHistoryForm: ', profile);

    const [deletedDeviceData, setDeletedDeviceData] = useState<DeleteDeviceData2[]>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [showDeletedDevices, setShowDeletedDevices] = useState<DeleteDeviceData[]>();

    useEffect(() => {
        async function fetchData(){
            const transformedData : DeleteDeviceData2[] = [];

            const deletedDeviceData = await fetchDeletedDeviceHistoryData();

            console.log('deleted device data inside DeletedDeviceHistoryForm: ', deletedDeviceData);

            const innerData = deletedDeviceData.map(obj=>obj.data);

            console.log('deleted device inner data1 inside DeletedDeviceHistoryForm: ', innerData);

            
            innerData.forEach(obj=>{
                //@ts-expect-error : error
                const deviceDataArray = Object.values(obj.deleteDeviceData);

                transformedData.push({
                    //@ts-expect-error : error
                    deleteDataAndTime: deviceDataArray[0].deleteDataAndTime,
                    //@ts-expect-error : error
                    userName: deviceDataArray[0].accountable.userName,
                    //@ts-expect-error : error
                    status: deviceDataArray[0].status,
                    totalDeviceDeleted: Object.values(obj).length,
                    //@ts-expect-error : error
                    deviceId: deviceDataArray[0].deviceId,
                    //@ts-expect-error : error
                    deleteDeviceData: deviceDataArray.map(device => {
                        return device;
                    })
                });

                console.log('transformedData data: ', transformedData)
            })

            setDeletedDeviceData(transformedData);
        }

        fetchData();
    }, []);

    const extraParams = getExtraParams();
    const columns = getColumns(setModalOpen, setShowDeletedDevices);
    
    return (
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="overflow-auto min-w-[max-content]">
                    <DialogHeader>
                        <DialogTitle className="mb-2">Deleted Devices History</DialogTitle>

                        <Separator />

                        <DialogDescription>
                            Shows list of deleted devices
                        </DialogDescription>                    

                        {
                            !deletedDeviceData ? (
                                <div className="min-h-16">
                                    <LoadingSpinner size={60} />
                                </div>
                            ) : <DataTable data={deletedDeviceData} columns={columns} extraParams={extraParams} />
                        }
                        

                    </DialogHeader>
                </DialogContent>
            </Dialog>


            {
                modalOpen && showDeletedDevices?.length ? (
                    <DeletedDevicesTable 
                        deletedDeviceData={showDeletedDevices}
                        open={modalOpen} 
                        close={() => (
                            setModalOpen(false)
                        )} 
                    />
                ) : null
            }
        </>
    )
}

export default DeletedDeviceHistoryForm;