'use client'

import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService"

async function fetchDeletedDeviceHistoryData(){
    const data = await getMyInstancesV2({
        processName: 'Device Delete History Process',
        predefinedFilters : {
            taskName: 'View Delete Device History'
        }
    })

    return data;
}

export default function DeletedDeviceHistoryTable(){

    const deletedDeviceData = fetchDeletedDeviceHistoryData();

    console.log('DeletedHistoryTable data: ', deletedDeviceData);

    return (
        <>
        </>
    )
}