// Shadcn Components
import { 
    Dialog,
    DialogContent,
    //DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/shadcn/ui/dialog"

import { 
    FC,
    //useContext 
} from "react";
//import { DeviceContext } from "../contexts/DeviceContext";

import { Separator } from "@/shadcn/ui/separator";

import { 
    Database,
    Shapes,
    Settings,
    User,
    EthernetPort,
    Laptop
} from "lucide-react";

//import { DeviceListDataType } from "../types";
//import { InstanceV2Props } from "@/ikon/utils/api/processRuntimeService/type";

import { DeviceModalViewFormProps } from "../types";

// interface DeviceModalViewFormProps {
//     open: boolean;
//     close: () => void;
//     deviceData: InstanceV2Props<DeviceListDataType>;
// }

// Main Component
const DeviceModalViewForm : FC<DeviceModalViewFormProps> = ({open, close, deviceData}) => {
    //console.log('data inside DeviceModalViewForm : ', deviceData);

    //const { deviceIdWiseData } = useContext(DeviceContext);

    return(
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="max-w-[max-content]">
                    <DialogHeader>
                        <DialogTitle className="mb-4">Device Details</DialogTitle>
                        <Separator />
                    </DialogHeader>
                    {/* <DialogDescription> */}
                    <div className="flex items-center">
                        <div>
                            <Laptop />
                        </div>
                        <div>
                            {/* @ts-expect-error : data hallucination */ }
                            <div>{deviceData?.data?.hostName}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12">
                        <div className="min-w-max">
                            <div className="flex items-center">
                                <div>
                                    <Database />
                                </div>
                                <div>
                                    Host IP Address
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div>
                                    <Shapes />
                                </div>
                                <div>
                                    Classification
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div>
                                    <Settings />
                                </div>
                                <div>
                                    Operating System
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div>
                                    <User />
                                </div>
                                <div>
                                    Discovered By
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div>
                                    <EthernetPort />
                                </div>
                                <div>
                                    MAC Addresss
                                </div>
                            </div>
                        </div>
                        <div className="min-w-max">
                            {/* @ts-expect-error : data hallucination */ }
                            <div className="flex items-center">{deviceData?.data?.hostIp}</div>
                            {/* @ts-expect-error : data hallucination */ }
                            <div className="flex items-center">{deviceData?.data?.classification}</div>
                            {/* @ts-expect-error : data hallucination */ }
                            <div className="flex items-center">{deviceData?.data?.os}</div>
                            {/* @ts-expect-error : data hallucination */ }
                            <div className="flex items-center">{deviceData?.data?.accountable?.userName}</div>
                            {/* @ts-expect-error : data hallucination */ }
                            <div className="flex items-center">{deviceData?.data?.macAddress}</div>
                        </div>
                    </div>
                    {/* </DialogDescription> */}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DeviceModalViewForm;