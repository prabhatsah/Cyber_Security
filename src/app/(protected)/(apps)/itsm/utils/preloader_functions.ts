import { getBaseSoftwareId, getCurrentSoftwareId, getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getDataForTaskId, getMyInstancesV2, getParameterizedDataForTaskId } from "@/ikon/utils/api/processRuntimeService";
import { LatestDataType, memoryCacheReturn, param, probleIdMapType, RoleMembershipInfoType, serviceIdWiseDetailsType } from "../discoveredDevices/types";
import { getUserMapForCurrentAccount } from "../../document-management/actions";
import RoleMembershipInfo from "@/app/(protected)/(base-app)/setting/users/components/roleMembershipInfo";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { getAllRoleForSoftwaresV2 } from "@/ikon/utils/api/roleService";
import { InstanceV2Props } from "@/ikon/utils/api/processRuntimeService/type";



const ref_2006 = {
    allProbeDetailsMap : <probleIdMapType>{},
    activeProbeDetailsMap : <probleIdMapType>{},
};

export async function getAllProbesDetails() {
    const processName = 'Get All Probe Details for Current Account';
    const predefinedFilters = { "taskName": 'Dashboard Query Activity' };
    const projections = ['Data.PROBE_ID', 'Data.PROBE_NAME'];

    // @ts-expect-error: ignore this line
    const onSuccess = async function(data){
        console.log("Inside getMyInstances Success Function.");
        //console.log('data : ', data);

        const taskId= data[0].taskId;

        // @ts-expect-error: ignore this line
        const onSuccess = function(data){
            console.log('Inside getDataForTaskId Success Function.')
            //console.log('data : ', data);

            const allProbeDetails = data.probeDetails;

            for (let i = 0, probeCount = allProbeDetails.length; i < probeCount; i++) {
                if(allProbeDetails[i].ACTIVE){
                    ref_2006.activeProbeDetailsMap[allProbeDetails[i].PROBE_ID] = allProbeDetails[i].PROBE_NAME;
                }
                //else{
                    ref_2006.allProbeDetailsMap[allProbeDetails[i].PROBE_ID] = allProbeDetails[i].PROBE_NAME;
                //}
                
            }

            return ref_2006;
        }

        const onFailure = function(){
            console.log(processName + ' data could not be loaded.');
        }

        try{
            //run post processing script for the mentioned task
            const resultingData = await getDataForTaskId({taskId});

            return onSuccess(resultingData);
        }
        catch(err){
            onFailure();
            console.error(err);
        }
        
    }

    const onFailure = function(){
        console.log(processName + ' could not be fetched.')
    }

    try{
        const baseSoftareId =  await getBaseSoftwareId()
        const resultingData = await getMyInstancesV2({processName, predefinedFilters, projections, softwareId:baseSoftareId});

        return onSuccess(resultingData);
    }
    catch(err){
        onFailure();
        console.error(err);
    }

}

type callback = (() => void) | undefined;

export async function getMemoryCache(param: param, callback: callback) : Promise<memoryCacheReturn[] | unknown>{
    try{
        const instanceData = await getMyInstancesV2({
            processName: "Dynamic Monitoring Status Dashboard",
            predefinedFilters: { taskName: "Fetch Memory Cache" }
        });

        console.log('Dynamic Monitoring Status Dashboard data: ', instanceData);

        try{
            const parameters: param = {
                deviceIdList: [],
                serviceIdWiseDetails: {}
            };

            if(param['clientId']){
                parameters['clientId'] = param['clientId'];
            }

            if(param['deviceId']){
                parameters['deviceId'] = param['deviceId'];
            }

            if(param['deviceIdList']){
                parameters['deviceIdList'] = param['deviceIdList'];
            }

            const data = await getParameterizedDataForTaskId({
                taskId: instanceData[0].taskId,
                parameters: parameters
            });

            console.log("getParameterizedDataForTaskId data: ", data);

            // @ts-expect-error : ignore
            const data1 = data.daashboardData; 

            if(callback){
                // @ts-expect-error : ignore
                callback(data1);
            }
            else{
                return data1;
            }
        }
        catch(error){
            console.log("Error fetching getParameterizedDataForTaskId data:", error);
            return (error);
        }
    }
    catch(err){
        console.log("Error getting getMyInstancesV2 data:", err);
        return err;
    }
}



export async function getRoleMap(currentSoftwareId: string){
    type currentAccountRoleDataType = {
        userId : string
    }[]

    const ignoreList = ['System Admin', 'System Viewer', 'Asset Administrator'];
    const roleIdWiseMap : { [key: string] : string } = {};
    const customRoleArray : {
        label: string,
        value: string
    }[] = []; 

    console.log('current software id: ', currentSoftwareId)

    const currentAccountRoleData = await getUserMapForCurrentAccount(
        {
            isRoleNameWiseUserDetailsMap:true,
            softwareId : currentSoftwareId
        }
    ) as currentAccountRoleDataType

    console.log('currentAccountRoleData: ', currentAccountRoleData);

    currentAccountRoleData.forEach((obj, index)=>{
        if((ignoreList.includes(obj.userId) == false)){
            roleIdWiseMap[currentAccountRoleData[index].userId] = obj.userId;
            customRoleArray.push({
                label: obj.userId,
                value: obj.userId
            });	
        }
    })

    console.log('currentAccountRoleData: ', customRoleArray);

    // for(const role_name in currentAccountRoleData){
    //     if((ignoreList.includes(role_name) == false)){
    //         roleIdWiseMap[currentAccountRoleData[role_name].roleId] = role_name;	
    //     }
    // }

    //console.log('roleIdWiseMap: ', roleIdWiseMap);

    return customRoleArray;
}

// temp

export async function fetchCurrentRoleData(id: string | undefined){
    const softwareName = "ITSM";
    const version = "1";
    const profile = await getProfileData();
    const softwareId = id ? id : await getSoftwareIdByNameVersion(softwareName, version);
    const roleData = await RoleMembershipInfo({
      userId: profile.USER_ID
    }) as RoleMembershipInfoType[];

    const currentRole = roleData ? roleData.filter(role => role.SOFTWARE_ID == softwareId) : [];

    console.log("currentRole: ", currentRole);

    // if(currentRole.length){
    //     setAccessControl(currentRole[0].ROLE_NAME, access)
    // }

    return currentRole;
  }

  export async function fetchRoleData2(){
    const softwareId = await getCurrentSoftwareId()
    const roles = await getAllRoleForSoftwaresV2({softwareIds: [softwareId]})

    return roles;
  }

  export function convertDate(dateStr_: string) {
    const dateStr = dateStr_.split(';')[0];

    // Step 1: Parse the input date
    const parsedDate = new Date(dateStr.replace("UTC", "GMT")); // Ensure proper parsing
  
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date format");
    }
  
    // Step 2: Subtract time (Modify as needed)
    parsedDate.setDate(parsedDate.getDate() - 23); // Subtract 23 days
    parsedDate.setHours(parsedDate.getHours() - 20); // Subtract 20 hours
    parsedDate.setMinutes(parsedDate.getMinutes() - 5); // Subtract 5 minutes
  
    // Step 3: Format the output (YYYY-MM-DD HH:mm:ss)
    const pad = (num: number) => String(num).padStart(2, "0");
    return `${parsedDate.getFullYear()}-${pad(parsedDate.getMonth() + 1)}-${pad(parsedDate.getDate())} ` +
           `${pad(parsedDate.getHours())}:${pad(parsedDate.getMinutes())}:${pad(parsedDate.getSeconds())}`;
  }

  type getLatestStatus_paramType = {
    clientId?: string;
    deviceId?: string;
    serviceId?: string;
    deviceIdList?: string[];
    protocol?: string;
    serviceIdList?: string[];
    dataCount?: number;
  } | null

  export async function getLatestStatus(param: getLatestStatus_paramType){
    const onSuccess = async (data: InstanceV2Props<getLatestStatus_paramType>[]) => {
        console.log("data fetched: ", data);

        const paramData = await getParameterizedDataForTaskId<LatestDataType>({
            taskId: data[0].taskId,
            parameters: {
                clientId: param?.clientId,
                deviceId: param?.deviceId,
                serviceId: param?.serviceId,
                deviceIdList: param?.deviceIdList,
                protocol: param?.protocol,
                serviceIdList: param?.serviceIdList,
                dataCount: param?.dataCount
            }
        })

        console.log('param data: ', paramData)

           if(paramData){
            const dashboardData = [];
            const list = paramData.daashboardData;

                for (const eachData of list) {
                    const monitoringData = JSON.parse(eachData.monitoring_data).result;
                    for (const serviceName in monitoringData) {
                        try {
                            monitoringData[serviceName] = JSON.parse(monitoringData[serviceName])
                        } catch (e) {
                            monitoringData[serviceName] = monitoringData[serviceName];
                            console.log("Cannot Parse Monitoring Data" + e);
                        }
                        eachData["value"] = monitoringData[serviceName];
                    }

                    //const dataReceivedOnDate = eachData["data_received_on"].split(" UTC")[0];
                    //eachData["data_received_on"] = moment.utc(dataReceivedOnDate).local().format('YYYY-MM-DD HH:mm:ss');
                    //eachData["data_received_on"] = convertDate(dataReceivedOnDate)
                    eachData["data_received_on"] = "";
                    try {
                        eachData["service_status"] = JSON.parse(eachData["service_status"]);
                    } catch (e) {
                        console.log("Cannot Parse Service Status" + e);
                    }
                    dashboardData.push(eachData);

                    
                    // dashboardData.sort(function (a, b) {
                    //     return new Date(a.data_received_on) - new Date(b.data_received_on);
                    // });

                    

                    dashboardData.sort((a, b) => new Date(a.data_received_on).getTime() - new Date(b.data_received_on).getTime());


                }

                console.log('dashboardData: ', dashboardData)

                return dashboardData;

            }
    }

    const onFailure = (err: unknown) => {
        console.error(err);

        return [];
    }
    
    try{
        const data = await getMyInstancesV2<getLatestStatus_paramType>({
            processName: 'Dynamic Monitoring Status Dashboard',
            predefinedFilters: {
                taskName: 'View Dashboard Item Activity'
            }   
        })

        if(!data.length){
            throw new Error('No record fetched!');
        }

        return onSuccess(data);
    }
    catch(err){
        return onFailure(err)
    }
  }

  export async function liveStreamingDatafunc(params: getLatestStatus_paramType, serviceIdWiseDetails: serviceIdWiseDetailsType){
    const onSuccess = async (data: { metricsName: string; serviceId: string; value: unknown; }[]) => {
        console.log("data fetched: ", data);

        return data;
    }

    const onFailure = (err: unknown) => {
        console.error(err);

        return [];
    }

    try{
        const liveStreamingData = await getLatestStatus(params);

        console.log('liveStreamingData: ', liveStreamingData);

        if(liveStreamingData){
            const liveStreamingDataFormtted = liveStreamingData.map(data => ({
                metricsName: serviceIdWiseDetails[data.service_id].metricsName,
                serviceId: data.service_id,
                value: data.value
            }))

            return onSuccess(liveStreamingDataFormtted)
        }

        
    }
    catch(err){
        return onFailure(err)
    }

  }