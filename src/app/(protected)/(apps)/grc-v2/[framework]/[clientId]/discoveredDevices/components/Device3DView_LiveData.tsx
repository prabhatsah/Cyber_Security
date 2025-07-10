import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { useEffect, useState } from "react";
import { liveStreamingDatafunc } from "../../utils/preloader_functions";
import { serviceIdWiseDetailsType } from "../types";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";
import LiveDataAccordion from "./Device3DView_LiveDataAccordion";

interface Props{
    open: boolean;
    close: () => void;
    param: {
        deviceId: string;
        serviceIdWiseDetails: serviceIdWiseDetailsType;
        clientId: string;
    }
}

type LiveDataType = {
    metricsName: string;
    serviceId: string;
    value: unknown;
}[] | undefined
  
  const Device3DViewLiveData: React.FC<Props> = ({open, close, param }) => {
    console.log('param: ', param)

    const [liveData, setLiveData] = useState<LiveDataType>();

    useEffect(()=>{
        const fetchData = async () => {
            const data = await liveStreamingDatafunc(param, param.serviceIdWiseDetails)

            console.log("data: ", data)

            setLiveData(data)
        }

        fetchData();
    },[param])

    return (
        <Dialog open={open} onOpenChange={close}>
                <DialogContent className="h-auto min-w-[40rem]">

                    <div className="h-full">
                        <DialogHeader className="h-[5%]">
                            <DialogTitle>Live Data</DialogTitle>
                
                            <DialogDescription>
                                
                            </DialogDescription>
                        </DialogHeader>
                
                        <div className="h-[95%] overflow-auto">
                           {
                            !liveData ? (
                                <div className="h-full">
                                    <LoadingSpinner className="h-full" size={60} />
                                </div>
                            ) 
                            : 
                            (
                                <LiveDataAccordion data={liveData} />
                            )
                           }
                        </div>

                    </div>

                </DialogContent>
            </Dialog>
    );
  };
  
  export default Device3DViewLiveData;