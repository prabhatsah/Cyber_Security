import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { DeviceListDataType, StartBasicServiceDiscoveryProps } from "../types";
import { TextButtonWithTooltip } from "@/ikon/components/buttons";
import { Check, LoaderCircle, Play } from "lucide-react";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { DataTable } from "@/ikon/components/data-table";
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { randomUUID } from "crypto";
import { subscribeToProcessEvents } from "@/ikon/utils/api/sockets";
import { useGlobalContext } from "../../context/GlobalContext";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import ProbeListTable from "./ProbeListTable";

type paramsType = {
    clientID: string;
    accountID: string;
    softwareID: string;
    deviceIdList: string[];
    setDeviceState: Dispatch<SetStateAction<deviceIdWiseStatusType>>
}

type deviceIdWiseStatusType = {
    [key: string] : {
        status: 'started' | 'completed';
        icon: ReactNode
    }
}


function getExtraParams(){
    const extraParams: DTExtraParamsProps = {
        grouping: false,
        pageSize: 5,
        pageSizeArray: [5, 10, 15],
    }

    return extraParams;
}

function getColumns(data_: deviceIdWiseStatusType){
    const columnDetailsSchema: DTColumnsProps<DeviceListDataType>[] = [
        {
            accessorKey: "data.hostIp",
            header: 'Device IP',
            cell: ({ row }) => (
                <span>{ row.original.hostIp }</span>
            )
        },
        {
            accessorKey: "data.hostName",
            header: 'Device Name',
            cell: ({ row }) => (
                <span>{ row.original.hostName }</span>
            )
        },
        {
            accessorKey: "",
            header: 'Dry Run Started',
            cell: ({ row }) => (
                <span id={"DryRunStarted_" + row.original.deviceId}> 
                    {
                        data_[row.original.deviceId] && data_[row.original.deviceId].icon
                    }
                </span>
            )
        },
        {
            accessorKey: "",
            header: 'Dry Run Completed',
            cell: ({row}) => (
                <span id={"DryRunCompleted_" + row.original.deviceId}>
                    {
                        data_[row.original.deviceId] && data_[row.original.deviceId].icon
                    }
                </span>
            )
        },
        {
            accessorKey: "",
            header: 'API Dry Run Started',
            cell: ({row}) => (
                <span id={"ApiDryRunStarted_" + row.original.deviceId}>
                    {
                        data_[row.original.deviceId] && data_[row.original.deviceId].icon
                    }
                </span>
            )
        },
        {
            accessorKey: "",
            header: 'API Dry Run Completed',
            cell: ({row}) => (
                <span id={"ApiDryRunCompleted_" + row.original.deviceId}>
                    {
                        data_[row.original.deviceId] && data_[row.original.deviceId].icon
                    }
                </span>
            )
        },
        {
            accessorKey: "",
            header: 'Metrics Monitoring Started',
            cell: ({row}) => (
                <span id={"MetricsMonitoringStarted_" + row.original.deviceId}> 
                    {
                        data_[row.original.deviceId] && data_[row.original.deviceId].icon
                    }
                </span>
            )
        },
        {
            accessorKey: "",
            header: 'Metrics Monitoring Completed',
            cell: ({row}) => (
                <span id={"MetricsMonitoringCompleted_" + row.original.deviceId}> 
                    {
                        data_[row.original.deviceId] && data_[row.original.deviceId].icon
                    }
                </span>
            )
        },
       
    ]

    return columnDetailsSchema;
}

function functionForConfigurationItemstatus(params: paramsType){
    async function runTask(){

        try{
            const processId = await mapProcessName({
                processName: "Configuration Item"
            })
            
			const metricsComponentUniqueIdentifier = `metricsStatusId-${randomUUID()}`;

            await subscribeToProcessEvents({
                viewComponentId : metricsComponentUniqueIdentifier,
                processId: processId,
                accountId: params.accountID,
                softwareId: params.softwareID,
                eventCallbackFunction : (arg) => {
                    const result = arg;

                    if (arg.data.clientId == params.clientID) {
                        const hostIp = arg.data.hostIp;
                        const deviceId = arg.data.deviceId;
                        
                        function updateIcon(deviceId: string) {
                            params.setDeviceState((prev) => ({
                                ...prev,
                                [deviceId]: {
                                    ...prev[deviceId],
                                    status: 'completed',
                                    icon: <Check />,
                                },
                            }));
                        }
                        
                        if (params.deviceIdList.includes(deviceId)) {
                            if (result.data.discoveryStatus == 'Dry Run Started') {
                                //$(".progress-wrapper").show();
                                updateIcon("DryRunStarted_" + deviceId);
                                //$(".progress-bar").attr("aria-valuenow", "18");
                                //$(".progress-bar").css("width", "18%");
                                //$(".progress-percentage .text-sm").text("Dry Run Started of " + hostIp);
                            }

                            if (result.data.discoveryStatus == 'Dry Run ends') {
                                updateIcon("DryRunCompleted_" + deviceId);
                                updateIcon("DryRunStarted_" + deviceId);
                                //$(".progress-bar").attr("aria-valuenow", "36");
                                //$(".progress-bar").css("width", "36%");
                                //$(".progress-percentage .text-sm").text("Dry Run Completed of " + hostIp);
                            }

                            if (result.data.discoveryStatus == 'Api Dry Run starts of ' + hostIp) {
                                updateIcon("ApiDryRunStarted_" + deviceId);
                                //$(".progress-bar").attr("aria-valuenow", "54");
                                //$(".progress-bar").css("width", "54%");
                                //$(".progress-percentage .text-sm").text("Api Dry Run Started of " + hostIp);
                            }

                            if (result.data.discoveryStatus == 'Api Dry Run ends') {
                                updateIcon("ApiDryRunCompleted_" + deviceId);
                                updateIcon("ApiDryRunStarted_" + deviceId);
                                //$(".progress-bar").attr("aria-valuenow", "72");
                                //$(".progress-bar").css("width", "72%");
                                //$(".progress-percentage .text-sm").text("Api Dry Run Completed of " + hostIp);
                            }

                        }
                    }

                },
                connectionOpenFunction : () => {
                    console.log("websocket connected")
                }
            })

        }
        catch(err){
            console.log(err)
        }
    }

    runTask()
}

function metricsMonitoringSubscribeEvent(params: paramsType){
    async function runTask(){
        try{
            const processId = await mapProcessName({
                processName: "metrics monitoring"
            });

            const metricsComponentUniqueIdentifier = `metricsStatusId-${randomUUID()}`;

            await subscribeToProcessEvents({
                viewComponentId : metricsComponentUniqueIdentifier,
                processId: processId,
                accountId: params.accountID,
                softwareId: params.softwareID,
                eventCallbackFunction : (arg) => {
                    const result = arg;

                    if (arg.data.clientId == params.clientID){
                        function updateIcon(deviceId: string){
                            params.setDeviceState((prev) => ({
                                ...prev,
                                [deviceId]: {
                                    ...prev[deviceId],
                                    status: 'completed',
                                    icon: <Check />,
                                },
                            }));
                        }

                        //const hostIp = arg.data.hostIp;
                        const deviceId = arg.data.deviceId;
                        if (params.deviceIdList.includes(deviceId)) {
                            if (arg.data.discoveryStatus == "Metrics Monitoring Starting") {
                                updateIcon("MetricsMonitoringStarted_" + deviceId);
                                // $(".progress-bar").attr("aria-valuenow", "80");
                                // $(".progress-bar").css("width", "80%");
                                // $(".progress-percentage .text-sm").text("Starting Metrics services of " + hostIp);
                            }

                            if (result.data.discoveryStatus == 'Metrics Monitoring Running') {                                
                                updateIcon("MetricsMonitoringCompleted_" + deviceId);
                                updateIcon("MetricsMonitoringStarted_" + deviceId);
                                // $(".progress-bar").attr("aria-valuenow", "88");
                                // $(".progress-bar").css("width", "88%");
                                // $(".progress-percentage .text-sm").text("Metrics Monitoring Running of " + hostIp);
                                // var hbFragment1 = Handlebars.compile(ref.handlebarfragmentMap["Specific Discovery Table-With Status"])({
                                //     deviceData: ref.selectedDeviceIdArray,
                                //     ipWiseDryRunStatusMap: ref.ipWiseDryRunStatusMap
                                // });
                            }
                            //if (result.data.discoveryStatus == 'Api Metrics Monitoring Starting') {
                                //updateIcon("ApiMetricsMonitoringStarted_" + deviceId);
                                // $(".progress-bar").attr("aria-valuenow", "95");
                                // $(".progress-bar").css("width", "95%");
                                // $(".progress-percentage .text-sm").text("Api Metrics Monitoring Started of " + hostIp);
                                // var hbFragment1 = Handlebars.compile(ref.handlebarfragmentMap["Specific Discovery Table-With Status"])({
                                //     deviceData: ref.selectedDeviceIdArray,
                                //     ipWiseDryRunStatusMap: ref.ipWiseDryRunStatusMap
                                // });
                            //}
                            //if (result.data.discoveryStatus == 'Api Metrics Monitoring Running') {    
                                //updateIcon("ApiMetricsMonitoringCompleted_" + deviceId);
                                //updateIcon("ApiMetricsMonitoringStarted_" + deviceId);
                                
                                // $(".progress-bar").attr("aria-valuenow", "100");
                                // $(".progress-bar").css("width", "100%");
                                // $(".progress-percentage .text-sm").text("Api Metrics Monitoring completed of " + hostIp);
                                // var hbFragment1 = Handlebars.compile(ref.handlebarfragmentMap["Specific Discovery Table-With Status"])({
                                //     deviceData: ref.selectedDeviceIdArray,
                                //     ipWiseDryRunStatusMap: ref.ipWiseDryRunStatusMap
                                // });
                                // $(".progress-wrapper").hide();
                            //}
                        }
                    }

                }
            })
        }
        catch(err){
            console.error(err)
        }
    }

    runTask();
}

export default function StartBasicServiceDiscovery({open, close, deviceData, probeIdWiseData}: StartBasicServiceDiscoveryProps){
    //console.log('devicedata inside StartBasicServiceDiscovery ', deviceData);
    const [showProbeList, setShowProbeList] = useState<boolean>(false);

    const selectedDeviceIdWiseProbeId: {[key:string] : string} = {};
    const selectedDeviceIdArray = deviceData.map(obj=>{
        selectedDeviceIdWiseProbeId[obj.deviceId] = obj.probeId

        return obj.deviceId
    });
    
    console.log('selectedDeviceIdArray: ', selectedDeviceIdArray);

    const deviceIdWiseStatusData: deviceIdWiseStatusType = {};

    selectedDeviceIdArray.forEach((deviceId)=>{
        // deviceIdWiseStatusData[deviceId].status = 'started';
        // deviceIdWiseStatusData[deviceId].icon = <LoaderCircle className="text-red-800" />

        deviceIdWiseStatusData['DryRunStarted_'+deviceId].status = 'started';
        deviceIdWiseStatusData['DryRunStarted_'+deviceId].icon = <LoaderCircle className="text-red-800" />

        deviceIdWiseStatusData['DryRunCompleted_'+deviceId].status = 'started';
        deviceIdWiseStatusData['DryRunCompleted_'+deviceId].icon = <LoaderCircle className="text-red-800" />

        deviceIdWiseStatusData['ApiDryRunStarted_'+deviceId].status = 'started';
        deviceIdWiseStatusData['ApiDryRunStarted_'+deviceId].icon = <LoaderCircle className="text-red-800" />

        deviceIdWiseStatusData['ApiDryRunCompleted_'+deviceId].status = 'started';
        deviceIdWiseStatusData['ApiDryRunCompleted_'+deviceId].icon = <LoaderCircle className="text-red-800" />

        deviceIdWiseStatusData['MetricsMonitoringStarted_'+deviceId].status = 'started';
        deviceIdWiseStatusData['MetricsMonitoringStarted_'+deviceId].icon = <LoaderCircle className="text-red-800" />

        deviceIdWiseStatusData['MetricsMonitoringCompleted_'+deviceId].status = 'started';
        deviceIdWiseStatusData['MetricsMonitoringCompleted_'+deviceId].icon = <LoaderCircle className="text-red-800" />
    })

    const [deviceIdWiseStatus, setDeviceIdWiseStatus] = useState<deviceIdWiseStatusType>(deviceIdWiseStatusData);

    const {PROFILE_DETAILS, CURRENT_ACCOUNT_ID, CURRENT_SOFTWARE_ID} = useGlobalContext();

    //console.log('Profile data: ', PROFILE_DETAILS, ', Account data: ', CURRENT_ACCOUNT_ID, ', Software id: ', CURRENT_SOFTWARE_ID);

    const extraParams = getExtraParams();
    const columns = getColumns(deviceIdWiseStatus);

    const param: paramsType = {
        clientID: CURRENT_ACCOUNT_ID,
        accountID: CURRENT_ACCOUNT_ID,
        softwareID: CURRENT_SOFTWARE_ID,
        deviceIdList: selectedDeviceIdArray,
        setDeviceState: setDeviceIdWiseStatus
    }

    //functionForConfigurationItemstatus(param);
	//metricsMonitoringSubscribeEvent(param);

    const mongoWhereClause = `this.Data.deviceId == '${selectedDeviceIdArray.join("' || this.Data.deviceId == '")}'`;

    //console.log('mongo: ', mongoWhereClause);

    const monitorBasicServices = async function(){
        const instanceData = await getMyInstancesV2<DeviceListDataType>({
            processName: "Configuration Item",
            predefinedFilters: {
                taskName: "Update CI Acivity"
            },
            mongoWhereClause: mongoWhereClause
        });

        const deviceDataForDiscoveryStart = instanceData.length > 0 ? instanceData : [];

        if(instanceData.length){
            const invokeStartMonitoring = async function(i: number, len: number){
                if(i == len){

                    try{
                        const processId = await mapProcessName({
                            processName: "Discovery History Process"
                        })

                        const discoverHistoryData = [];

                        for (const i in deviceDataForDiscoveryStart) {
                            discoverHistoryData.push(deviceDataForDiscoveryStart[i].data);
                        }

                        const extractedData = discoverHistoryData.map(function (item) {
                            return {
                                hostName: item.hostName,
                                hostIp: item.hostIp,
                                description: item.description,
                                os: item.os,
                                type: item.type,
                                discoveryType: "discoverFormFornt",
                                discoverDateAndTime: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
                                deviceId: item.deviceId,
                                clientId: item.clientId,
                                accountable: { "userId": PROFILE_DETAILS?.USER_ID, "userName": PROFILE_DETAILS?.USER_NAME }
                            };
                        });
                        
                        const discoveryHistoryData = {
                            "discoveryHistoryData": extractedData
                        }

                        try{
                            const startData = await startProcessV2(
                                {
                                    processId: processId,
                                    data: discoveryHistoryData,
                                    processIdentifierFields: "probeId,clientId"
                                }
                            )

                            console.log("====Success in start process=====", startData);
                        }
                        catch(err){
                            console.error(err)
                        }

                    }
                    catch(err){
                        console.log(err)
                    }

                }
                else{
                    const taskId = instanceData[i].taskId;
                    const data = instanceData[i].data;

                    try{
                        await invokeAction(
                            {
                                taskId: taskId,
                                transitionName: "start basic monitoring",
                                data: data,
                                processInstanceIdentifierField: ''
                            }
                        )

                        invokeStartMonitoring(i + 1, deviceData.length);
                    }
                    catch(err){
                        console.log('InvokeAction failed')
                        console.error(err);
                    }

                }
            }

            invokeStartMonitoring(0, instanceData.length);
        }
        else{
            console.log('You are not authorized!');
        }
    }

    if(Object.values(selectedDeviceIdWiseProbeId).some(value=>value==undefined) ){
        setShowProbeList(true)
    }else{
        //monitorBasicServices();
    }

    return (
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="overflow-auto min-w-[max-content]">
                    <DialogHeader>
                        <DialogTitle>
                            Basic Service Discovery
                        </DialogTitle>

                        <DialogDescription>
                            Basic services will be monitored for the below devices
                        </DialogDescription>
                        
                    </DialogHeader>

                    <div>
                        <DataTable data={deviceData} columns={columns} extraParams={extraParams} />
                    </div>

                   
                    <DialogFooter>
                        <TextButtonWithTooltip tooltipContent='Save'> 
                            <Play /> Start
                        </TextButtonWithTooltip>
                    </DialogFooter>
                        
                </DialogContent>
           </Dialog>

           {
                showProbeList ? (
                    <ProbeListTable
                    selectedDeviceIdWiseProbeId={selectedDeviceIdWiseProbeId}
                        probleIdWiseDetails={probeIdWiseData} 
                        open={showProbeList} 
                        close={
                            ()=>{
                                setShowProbeList(false)
                            }
                        } 
                        refresh={
                            ()=>{
                                window.location.reload()
                            }
                        } 
                    />
                ) : null
           }
        </>
    )
} 