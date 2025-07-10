import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { useEffect, useState } from "react";
import { getLatestStatus } from "../../utils/preloader_functions";

// type SoftwareDetails = {
//     serviceName: string;
//     description: string;
//     uptime: string;
//     memoryUsage: string;
//     cpuUsage: string;
// }

interface Props{
    open: boolean;
    close: () => void;
    param: {
        clientId: string;
        deviceId: string;
        serviceId: string;
    }
}

type InnerValueType = {
    CPUUsage: string;
    Description: string;
    MemoryUsage: string;
    Name: string;
    Uptime: string;
}

const getExtraParams = function(){
    const extraParams: DTExtraParamsProps = {
        grouping: false,
        pageSize: 5,
        pageSizeArray: [5, 10, 15],
    }

    return extraParams;
}

const getColumns = function(){
    const columnDetailsSchema: DTColumnsProps<InnerValueType>[] = [
        {
            accessorKey: "Name",
            header: 'Metric Name',

        },
        {
            accessorKey: "Description",
            header: 'Description',

        },
        {
            accessorKey: "Uptime",
            header: 'Uptime',
            
        },
        {
            accessorKey: "MemoryUsage",
            header: 'Memory Usage',
            
        },
        {
            accessorKey: "CPUUsage",
            header: 'CPU Usage',
            
        },
    ]

    return columnDetailsSchema;
}

const fetchRequiredData = async function(deviceId: string, serviceId: string, clientId: string){
   const data = await getLatestStatus({
    deviceId: deviceId,
    serviceId: serviceId,
    clientId: clientId
   })

   console.log('fetchRequiredData: ', data);

   const sofwareDeatilsData = (data && data.length > 0 ? data[0].value : []) as InnerValueType[];

   return sofwareDeatilsData;
}

  
  const Device3DViewSoftwareDetails: React.FC<Props> = ({open, close , param}) => {
    const [tableData, setTableData] = useState<InnerValueType[]>();

    console.log('params  : ', param)

    useEffect(()=>{
        const fetchData = async () => {
            const data = await fetchRequiredData(param.deviceId, param.serviceId, param.clientId);

            console.log('data: ', data);

            setTableData(data)
        }

        fetchData()
    }, [param])


    const extraParams = getExtraParams();
    const columns = getColumns();


    return (
        <Dialog open={open} onOpenChange={close}>
                <DialogContent className="min-w-[50vw]">

                    <div className="h-full">
                        <DialogHeader className="h-[10%]">
                            <DialogTitle>Software Details</DialogTitle>
                
                            <DialogDescription>
                            </DialogDescription>
                        </DialogHeader>
                
                        <div className="h-[90%]">
                            {
                                !tableData ? (
                                    <div className="h-full">
                                        <LoadingSpinner className="h-full" size={60} />
                                    </div>
                                    
                                ) : (
                                    <DataTable data={tableData} columns={columns} extraParams={extraParams} />
                                )
                            }
                        </div>

                    </div>

                </DialogContent>
            </Dialog>
    );
  };
  
  export default Device3DViewSoftwareDetails;