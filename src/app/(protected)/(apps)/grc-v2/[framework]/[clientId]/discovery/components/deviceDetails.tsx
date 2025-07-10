import { IconButton } from "@/ikon/components/buttons";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { DeviceDetailsColumnSchemaType } from "../type";
import { useEffect, useState } from "react";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import Alert from "@/ikon/components/alert-dialog";
import { useGlobalContext } from "../../context/GlobalContext";
import { Ban } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/shadcn/ui/card";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";

export default function DeviceDetails({children,deviceData,isDiscovered}:{children:React.ReactNode} & {deviceData:DeviceDetailsColumnSchemaType[],isDiscovered:boolean}){ 
    
    const [deviceDetails,setDeviceDetails] = useState<DeviceDetailsColumnSchemaType[]>([])
    const[noAccess,setNoAccess] = useState<boolean>(false)
    const deviceDetailsColumn: DTColumnsProps<DeviceDetailsColumnSchemaType>[] = [
        {
            accessorKey: "hostName",
            header: "Host Name",
            // cell: ({ row }) => (
            //   <div className="capitalize">{row.getValue("ipRange")}</div>
            // ),
          },
          {
            accessorKey: "hostIp",
            header: "Host IP",
            // cell: ({ row }) => (
            //   <div className="capitalize">{row.getValue("user")}</div>
            // ),
           
          },
          {
            accessorKey: "os",
            header: "OS",
            // cell: ({ row }) => (
            //   <div className="capitalize">{row.getValue("probe")}</div>
            // ),
            
          },
          {
            accessorKey: "type",
            header: "Device type",
            // cell: ({ row }) => (
            //   <div className="capitalize">{moment((row.getValue("discoveredTime"))).format('YYYY-MM-DD HH:MM:SS')}</div>
            // ),
            
          },
          {
            accessorKey: "macAddress",
            header: "MAC Address",
            // cell: ({ row }) => (
            //   <div className="capitalize">{row.getValue("discoveredDevices")}</div>
            // ),
           
          },
          {
            accessorKey: "accountable",
            header: "Accoutable User",
            cell: ({ row }) => (
              <div className="capitalize">{row.getValue("accountable").userName}</div>
            ),
            
          },
      ]

      

      useEffect(()=>{
        debugger
        const deviceId = isDiscovered?deviceData.DiscoveredDeviceIds:deviceData.undiscoveredDeviceIds
        const mongoWhereClause = `this.Data.deviceId == '${deviceId.join("' || this.Data.deviceId == '")}'`
        const clientId = deviceData.clientId
        const fetchDeviceData = async () => {
          const softwareId = await getSoftwareIdByNameVersion("ITSM","1")
            getMyInstancesV2({
               softwareId:softwareId,
                processName: 'Configuration Item',
                predefinedFilters: { taskName: "View CI Activity" },
                processVariableFilters:  {"clientId":clientId} ,
                mongoWhereClause:mongoWhereClause
            }).then((res) => {
                debugger
                console.log('device data: ', res);
                setDeviceDetails(res.map((instance) => instance.data))
            }).catch((e) => { })
        }
        fetchDeviceData();
      }
      ,[])
      
    
    
    return (<>

        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <>
                    <DialogHeader>
                        <DialogTitle>{isDiscovered?`Discovered Devices`:`Undiscovered Devices`}</DialogTitle>
                        
                    </DialogHeader>
                    <DataTable data={deviceDetails} columns={deviceDetailsColumn}/>
                    
                </>
                
                
            </DialogContent>
        </Dialog>
        
    </>)
}