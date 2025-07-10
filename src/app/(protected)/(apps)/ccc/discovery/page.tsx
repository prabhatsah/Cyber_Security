'use client'
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { DiscoveryTableDataType } from "./type";
import { useEffect, useState } from "react";
import moment from "moment";
import { getAllProbesDetails } from "../utils/preloader_functions";
import StartDiscovery from "./actions/startDiscovery";
import ProbeLog from "./actions/probeLog";
import ManageCredentails from "./actions/manageCredentials";
import DeletedCredHistory from "./actions/deletedCredentialHistory";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";
import CredentialForm from "./actions/manageCredentials_new";
import { DiscoveryProvider, useDiscovery } from "./actions/context/DiscoveryContext";
import DiscoveryProgressCompoent from "./components/DiscoveryPorgressModal";


export default function Page() {


  const [discoveryData,setDiscoveryData] = useState<DiscoveryTableDataType[]>([]);
  const [dataFetched,setDatafetched] = useState(false)

  const{discoveryStarted,discoveryProgress} = useDiscovery()

  const discoveryTableColumns: DTColumnsProps<DiscoveryTableDataType>[] = [
    {
        accessorKey: "ipRange",
        header: "IP Range/Router Configs",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("ipRange")}</div>
        ),
      },
      {
        accessorKey: "user",
        header: "Accountable User",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("user")}</div>
        ),
       
      },
      {
        accessorKey: "probe",
        header: "Probe",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("probe")}</div>
        ),
        
      },
      {
        accessorKey: "discoveredTime",
        header: "Discovered Time",
        cell: ({ row }) => (
          <div className="capitalize">{moment((row.getValue("discoveredTime"))).format('YYYY-MM-DD HH:MM:SS')}</div>
        ),
        
      },
      {
        accessorKey: "discoveredDevices",
        header: "Discovered Devices",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("discoveredDevices")}</div>
        ),
       
      },
      {
        accessorKey: "undiscoveredDevices",
        header: "Undiscovered Devices",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("undiscoveredDevices")}</div>
        ),
        
      },
  ]

 


  useEffect(() => {
   
    getMyInstancesV2<DiscoveryTableDataType>({
        processName: 'Discovery History Process',
        predefinedFilters:{taskName : "View Discovery History"},
    }).then(async (res)=>{
        
            const response = await getAllProbesDetails()
            
            const discoveryData = res.map((instance)=>
                instance.data
            ).map((data)=>{
                
                return {
                    id: data.id,
                    ipRange: `${data.ipRanges[0].
                        ipRangeStart
                        } - ${data.ipRanges[0].ipRangeEnd}`,
                    user: data.accountable.userName,
                    probe: response?.allProbeDetailsMap[data.probeId],
                    discoveredTime: data.discoverDateAndTime,
                    discoveredDevices: data.countOfDiscoveredDevices,
                    undiscoveredDevices: data.countOfUnDiscoveredDevices
                    
                }
            })
            console.log(discoveryData)
            setDatafetched(true)
            setDiscoveryData(discoveryData)

        

       
    }).catch((err)=>{
        console.log(err)
    })

    

  },[discoveryStarted]);


    const ext: DTExtraParamsProps = {
        // actionMenu: {
        //     items: [
        //         {
        //             label: "View Details",
        //             onClick: (row) => {
        //                 console.log(row)
        //             }
        //         }
        //     ]
        // },
        pageSize: 10,
        extraTools:
            [
            <StartDiscovery />,
            <ProbeLog />,
            <CredentialForm />,
            <DeletedCredHistory/>
        ]
        
    }
  
    
  

  return (
    
      <>
          {dataFetched?(<DataTable columns={discoveryTableColumns} 
          data={discoveryData} extraParams={ext} />):
          <div className="h-[100vh]">
            <LoadingSpinner/>
          </div>}
          {discoveryStarted && <DiscoveryProgressCompoent progress={discoveryProgress}/>}
          </>
       
       
    
  );
}