import { getBaseSoftwareId } from "@/ikon/utils/actions/software";
import { getDataForTaskId, getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { probleIdMapType } from "../deviceList/types";

const ref_2006 = {
    allProbeDetailsMap: <probleIdMapType>{},
    activeProbeDetailsMap: <probleIdMapType>{},
};

export async function getAllProbesDetails() {
    const processName = 'Get All Probe Details for Current Account';
    const predefinedFilters = { "taskName": 'Dashboard Query Activity' };
    const projections = ['Data.PROBE_ID', 'Data.PROBE_NAME'];


    // @ts-expect-error: ignore this line
    const onSuccess = async function (data) {
        console.log("Inside getMyInstances Success Function.");
        //console.log('data : ', data);

        const taskId = data[0].taskId;

        // @ts-expect-error: ignore this line
        const onSuccess = function (data) {
            console.log('Inside getDataForTaskId Success Function.')
            console.log('data : ', data);

            const allProbeDetails = data.probeDetails;

            for (let i = 0, probeCount = allProbeDetails.length; i < probeCount; i++) {
                if (allProbeDetails[i].ACTIVE) {
                    ref_2006.activeProbeDetailsMap[allProbeDetails[i].PROBE_ID] = allProbeDetails[i].PROBE_NAME;
                }
                ref_2006.allProbeDetailsMap[allProbeDetails[i].PROBE_ID] = allProbeDetails[i].PROBE_NAME;


            }

            return ref_2006;
        }

        const onFailure = function () {
            console.log(processName + ' data could not be loaded.');
        }

        try {
            //run post processing script for the mentioned task
            //const resultingData = await getDataForTaskId({ accountId: '56b5c266-6a0f-437a-82b9-3715bb6f3d4c', taskId });
            const resultingData = await getDataForTaskId({ taskId });

            return onSuccess(resultingData);
        }
        catch (err) {
            onFailure();
            console.error(err);
        }

    }

    const onFailure = function () {
        console.log(processName + ' could not be fetched.')
    }

    try {
        debugger
        //const accountId = '56b5c266-6a0f-437a-82b9-3715bb6f3d4c';
        const baseSoftareId = await getBaseSoftwareId()
        const resultingData = await getMyInstancesV2({ processName, predefinedFilters, projections, softwareId: baseSoftareId });
        console.log('resultingData : ', resultingData);
        return onSuccess(resultingData);
    }
    catch (err) {
        onFailure();
        console.error(err);
    }

}


