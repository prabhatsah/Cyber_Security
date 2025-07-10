'use client'

import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService"

async function fetchDeletedDeviceHistoryData(){
    const softwareId = await getSoftwareIdByNameVersion("ITSM", "1");
    const data = await getMyInstancesV2({
        softwareId,
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