import { TextButtonWithTooltip } from "@/ikon/components/buttons";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { FolderCode, HardDrive, RadioTower } from "lucide-react";
import { FC, useState } from "react";
import { Device3DModalViewFormProps } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import Device3DViewHardwareDetails from "./Device3DView_HardwareDetails";
import Device3DViewSoftwareDetails from "./Device3DView_SoftwareDetails";
import { useGlobalContext } from "../../context/GlobalContext";
import Device3DViewLiveData from "./Device3DView_LiveData";

const Device3DModalView : FC<Device3DModalViewFormProps> = ({open, close, params}) => {
    console.log('params: ', params);

    const {CURRENT_ACCOUNT_ID} = useGlobalContext();

    const [showHardwareInfo, setShowHardwareInfo] = useState(false);
    const [showSoftwareInfo, setShowSoftwareInfo] = useState(false);
    const [showLiveInfo, setShowLiveInfo] = useState(false);

    return (
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="min-w-[100vw] h-screen">

                    <div className="h-full">
                        <DialogHeader className="h-[5%]">
                            <DialogTitle>Device 3D View</DialogTitle>
                
                            <DialogDescription>
                                Shows 3D view of device
                            </DialogDescription>
                        </DialogHeader>
                
                        <div className="h-[95%]">
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>3D view</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col items-end gap-4">
                                        <div>
                                            <TextButtonWithTooltip onClick={()=>{setShowHardwareInfo(true)}} tooltipContent="Hardware Info">
                                                <HardDrive />
                                            </TextButtonWithTooltip>
                                        </div>
                                        <div>
                                            <TextButtonWithTooltip onClick={()=>{setShowSoftwareInfo(true)}} tooltipContent="Software Info">
                                                <FolderCode />
                                            </TextButtonWithTooltip>
                                        </div>
                                        <div>
                                            <TextButtonWithTooltip onClick={()=>{setShowLiveInfo(true)}} tooltipContent="Live Data">
                                                <RadioTower />
                                            </TextButtonWithTooltip>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                    </div>

                </DialogContent>
            </Dialog>

            {
                showHardwareInfo && <Device3DViewHardwareDetails 
                    open={showHardwareInfo}
                    close={()=>{setShowHardwareInfo(false)}}
                    param={{
                        MAC: params.macAddr,
                        classification: params.deviceCategory,
                        os: params.osName,
                        discoveredBy: params.discoveredBy,
                        hostIP: params.hostIp
                 }}
                />
            }

            {
                showSoftwareInfo && <Device3DViewSoftwareDetails 
                    open={showSoftwareInfo}
                    close={()=>{setShowSoftwareInfo(false)}}  
                    param={{
                        deviceId: params.deviceId,
                        serviceId: "74851bc3-9345-4f2c-a422-22c04bf157fc",
                        clientId: CURRENT_ACCOUNT_ID
                    }}  
                />
            }

            {
                showLiveInfo && <Device3DViewLiveData 
                    open={showLiveInfo}
                    close={()=>{setShowLiveInfo(false)}}  
                    param={{
                        deviceId: params.deviceId,
                        serviceIdWiseDetails: params.serviceIdWiseDetails,
                        clientId: CURRENT_ACCOUNT_ID
                    }}  
                />
            }
        </>
    )
}

export default Device3DModalView