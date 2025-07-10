//import { TextButtonWithTooltip } from "@/ikon/components/buttons";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
//import { Save } from "lucide-react";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { DataPayload, DeviceConfigurationFormProps, params_DC } from "../types";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { useGlobalContext } from "../../context/GlobalContext";
//import NoDataComponent from "@/ikon/components/no-data";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";
import ConfigureServicesForDevice from "./ConfigureServicesForDeviceForm";

const loadFormForInitialConfigurationDetails = () => {

}

const loadExistingConfigurationDetails = () => {

}

const openDeviceServiceConfig = async (params: params_DC, clientId: string, userId: string | undefined, setDevicesConfigData: Dispatch<SetStateAction<DataPayload[] | undefined>>) => {
    const onSuccess = function(data: DataPayload[] | undefined){
        console.log('inside onSuccess data: ', data)

        if(data){
            if(data.length){
                loadExistingConfigurationDetails();
            }
            else{
                loadFormForInitialConfigurationDetails();
            }
        }    

        setDevicesConfigData(data)
    }
    
    const onFailure = function<T>(err: T){
        console.log(err)
    } 
    
    try{
        //const deviceIds =  params.deviceIds.join(',');

        //console.log('deviceIds: ', deviceIds, ' , userId: ', userId, ' , clientId: ', clientId);

        const data = await getMyInstancesV2<DataPayload>({
            processName: 'Device Wise Service Configuration',
            predefinedFilters: {
                taskName: "Edit Activity"
            },
            processVariableFilters: {
                'associatedUserId': userId, 
                'clientId': clientId, 
                //'associatedDeviceId': associatedDeviceId is absent in production
            }
        })

        const innerData = data.map(obj=>obj.data);

        onSuccess(innerData)
    }
    catch(err){
        onFailure<typeof err>(err)
    }
}

function display<T>(data: T[] | undefined, params: params_DC){
    if(data == undefined){
        return (
            <div className="h-full">
                <LoadingSpinner size={60} />
            </div>
        )
    }else if(data.length == 0){
        return (
            //<NoDataComponent text="Data Unavailable" />
            <ConfigureServicesForDevice state="Initial State" deviceIdWiseDetails={params.deviceIdWiseData} serviceIdWiseDetails={params.serviceIdWiseDetails}/>
        ) 
    }else{
        return (
            <ConfigureServicesForDevice state="Update State" deviceIdWiseDetails={params.deviceIdWiseData} serviceIdWiseDetails={params.serviceIdWiseDetails}/>
        )
    }
}

const DeviceConfiguration : FC<DeviceConfigurationFormProps> = ({open, close, params}) => {
    const [deviceConfigData, setDevicesConfigData] = useState<DataPayload[]>();

    const { CURRENT_ACCOUNT_ID, PROFILE_DETAILS } = useGlobalContext();

    console.log('CURRENT_ACCOUNT_ID: ', CURRENT_ACCOUNT_ID, ' , PROFILE_DETAILS: ', PROFILE_DETAILS, ' , params: ', params);

    useEffect(()=>{
        const fetchData = async () => {
            await openDeviceServiceConfig(params, CURRENT_ACCOUNT_ID, PROFILE_DETAILS?.USER_ID, setDevicesConfigData);
        }

        fetchData();
    }, [params, CURRENT_ACCOUNT_ID, PROFILE_DETAILS])

    return (
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="min-w-[100vw] h-screen">

                    <div>
                        <DialogHeader className="h-[5%]">
                            <DialogTitle>Device Configuration</DialogTitle>
                
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                
                        <div className="h-[90%]">
                            {
                                display(deviceConfigData, params)
                            }
                        </div>
                    
                        {/* <DialogFooter className="h-[5%]">
                            <TextButtonWithTooltip id="configDevicesSubmitBtn" type="button" tooltipContent="save"> 
                                <Save/> Save
                            </TextButtonWithTooltip>
                        </DialogFooter> */}
                    </div>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default DeviceConfiguration