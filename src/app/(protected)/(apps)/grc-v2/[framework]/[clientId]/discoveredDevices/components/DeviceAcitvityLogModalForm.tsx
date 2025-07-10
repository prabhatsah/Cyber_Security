import { 
    IconTextButton, 
    //TextButtonWithTooltip 
} from "@/ikon/components/buttons";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    //DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/shadcn/ui/dialog";
import { 
    FileClock, 
    FolderClock, 
    MoreHorizontal, 
    //RadioTower, 
    //Save 
} from "lucide-react";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { DeviceActivityLogModalFormProps, paramsType_DA } from "../types";
import { getInstructionRunData, getInstructionRunHistory, getInstructionRunLogs, getLiveInstructions, getLogHistory2 } from "@/ikon/utils/api/probeManagementService";
import { InstructionRun, LiveInstructionProps, LogEntry } from "@/ikon/utils/api/probeManagementService/type";
import { useGlobalContext } from "../../context/GlobalContext";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { DataTable } from "@/ikon/components/data-table";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";
import NoDataComponent from "@/ikon/components/no-data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";

import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';  // Choose a theme you like
import 'prismjs/components/prism-javascript'; // For JavaScript syntax highlighting
import 'prismjs/components/prism-json';       // For JSON syntax highlighting

type probeDetailstType = {
    [key: string] : string
}

type probeDetailstArrType = {
    instructionId: string;
    serviceName: string;
}

const formatDate = (date: Date): string => {
    const pad = (num: number) => String(num).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are zero-based
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    // Timezone offset calculation
    const offset = date.getTimezoneOffset();
    const offsetSign = offset > 0 ? '-' : '+';
    const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
    const offsetMinutes = pad(Math.abs(offset) % 60);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetSign}${offsetHours}${offsetMinutes}`;
};

async function fetchActivityLogData(probeId: string , hostIp: string, hostName: string, clientId: string) {
    
    
    const probeDetails : probeDetailstType = {}
    const probeDetailsArr : probeDetailstArrType[] = []

    const successFunction = (instructionData: LiveInstructionProps[]) => {
        for (let i = 0; i < instructionData.length; i++) {
            let serviceName = instructionData[i].serviceName;
            if (instructionData[i].service_id.split("-")[0] === hostIp) {
                const seprateFromId = serviceName.split("_")[0];
                const client_Id = instructionData[i].account_id;
                const dashCount = seprateFromId.split("-").length - 1;
                if (dashCount == 1) {
                    serviceName = seprateFromId.split("-")[1]
                }
                else if (dashCount == 2) {
                    serviceName = seprateFromId.split("-")[1] + "-" + seprateFromId.split("-")[2];
                }
                const instructionId = instructionData[i].instruction_id;
                if (client_Id == clientId) {
                    probeDetails[instructionId] = serviceName;
                    probeDetailsArr.push({
                        instructionId: instructionId,
                        serviceName: serviceName
                    })
                }
            }
        }

        ///console.log('probeDetails: ', probeDetails)

        return probeDetailsArr;

    }

    const failureFunction = (err: unknown) => {
        console.error(err)
        return null;
    }

    try{
        console.log('Fetching probe id: ', probeId)
        const data = await getLiveInstructions({probeId: probeId})

        console.log('getLiveInstructions data: ', data)

        return successFunction(data)
    }
    catch(err){
        return failureFunction(err)
    }

    //ref.openFormModule2(probeId, hostIp, hostName);
}

async function fetchLogHistoryData(probeId: string, instructionId: string, serviceName: string, setLogHistoryData: Dispatch<SetStateAction<LogEntry[] | undefined>>){
    const toDate: string = formatDate(new Date());
    const fromDate: string = formatDate(new Date(Date.now() - 48 * 60 * 60 * 1000));

    //console.log('Inside fetchLogHistoryData: probeId: ', probeId, ' , instructionId: ', instructionId, ' , serviceName: ', serviceName);
    
    const successFunction = (data: LogEntry[]) => {
        //console.log('logHistoryData: ', data);

        setLogHistoryData(data);
    }

    const failureFunction = (err: unknown) => {
        console.error(err)
    }

    try{
        const logHistoryData = await getLogHistory2({
            probeId: probeId,
            instructionId: instructionId,
            fromDate: fromDate,
            toDate: toDate
        })

        successFunction(logHistoryData);
    }
    catch(err){
        failureFunction(err)
    }

}

async function fetchRunHistoryData(probeId: string, instructionId: string, setRunHistoryData: Dispatch<SetStateAction<InstructionRun[] | undefined>>){
    const toDate: string = formatDate(new Date());
    const fromDate: string = formatDate(new Date(Date.now() - 48 * 60 * 60 * 1000));

    const successFunction = (data: InstructionRun[]) => {
        setRunHistoryData(data);
    }

    const failureFunction = (err: unknown) => {
        console.error(err)
    }

    try{
        const data = await getInstructionRunHistory({
            probeId: probeId,
            instructionId: instructionId,
            fromDate: fromDate,
            toDate: toDate 
        })

        successFunction(data)
    }
    catch(err){
        failureFunction(err)
    }
}

async function fetchRunHistorySpecificData(probeId: string, instructionId: string, instructionRunId: string, setRunHistorySpecificData: Dispatch<SetStateAction<string | undefined>>){
    const data = await getInstructionRunData({
        probeId: probeId,
        instructionId: instructionId,
        instructionRunId: instructionRunId
    });

    setRunHistorySpecificData(data)
}

async function fetchRunHistorySpecificLogs(probeId: string, instructionId: string, instructionRunId: string, setRunHistorySpecificLogs: Dispatch<SetStateAction<LogEntry[] | undefined>>){
    const data = await getInstructionRunLogs({
        probeId: probeId,
        instructionId: instructionId,
        instructionRunId: instructionRunId
    })

    console.log('fetchRunHistorySpecificData: ', data);

    setRunHistorySpecificLogs(data)
}

// postponed
// function openLiveLogs(probeId: string, instructionId: string) {
// 	return(
//         window.open("../ikon/probelog.html?probeId=" + probeId + "&instructionId=" + instructionId, probeId + ":" + instructionId)
//     )
// }


function getExtraParams() {
    const extraParams: DTExtraParamsProps = {
      grouping: true,
      pageSize: 10,
      pageSizeArray: [10, 15, 20],
    };
  
    return extraParams;
}

function getExtraParams2() {
    const extraParams: DTExtraParamsProps = {
      grouping: false,
      pageSize: 10,
      pageSizeArray: [10, 15, 20],
    };
  
    return extraParams;
}
  

function getColumns(params: paramsType_DA, setActiveTab: Dispatch<SetStateAction<string>>, setLogHistoryData: Dispatch<SetStateAction<LogEntry[] | undefined>>, setRunHistoryData: Dispatch<SetStateAction<InstructionRun[] | undefined>>) {

    const columnDetailsSchema: DTColumnsProps<probeDetailstArrType>[] = [
      {
        accessorKey: "data.serviceName",
        header: "Metrics Name",
        cell: ({ row }) => <span>{row.original.serviceName}</span>,
      },
      {
        accessorKey: "action",
        header: 'Action',
        enableGrouping: false,
        enableSorting: false,
        cell: ({ row }) => (
          <span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <IconTextButton variant="ghost" size="icon">
                      <MoreHorizontal className="w-5 h-5" />
                    </IconTextButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {/* <DropdownMenuItem 
                        className=""  
                        onClick={
                            () => { 
                                //console.log('Live logs');
                                //openLiveLogs(params?.probeId, row.original.instructionId)
                            }
                        }
                    >
                      <div>
                        <RadioTower />
                      </div>
                      <div>
                        Live Logs
                      </div>
                    </DropdownMenuItem> */}

                    <DropdownMenuItem 
                        className=""  
                        onClick={
                          () => { 
                            setActiveTab('logHistory');
                            fetchLogHistoryData(params.probeId, row.original.instructionId, row.original.serviceName, setLogHistoryData);
                          }
                        }
                    >
                        <div>
                          <FolderClock />
                        </div>
                        <div>
                          Log History
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                        className=""  
                        onClick={
                          () => {
                            setActiveTab('runHistory');
                            fetchRunHistoryData(params.probeId, row.original.instructionId, setRunHistoryData);
                          }
                        }>
                      <div>
                        <FileClock />
                      </div>
                      <div>
                        Run History
                      </div>  
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </span>
        ),
    }

    ];
  
    return columnDetailsSchema;
}

function getColumns2() {

    const columnDetailsSchema: DTColumnsProps<LogEntry>[] = [
      {
        accessorKey: "data.log_timestamp",
        header: "Timestamp",
        cell: ({ row }) => <span>{row.original.log_timestamp}</span>,
      },
      {
        accessorKey: "data.log_text",
        header: "Log Text",
        cell: ({ row }) => <span>{row.original.log_text}</span>,
      }
    ];
  
    return columnDetailsSchema;
}

function getColumns3(params: paramsType_DA, setActiveTab: Dispatch<SetStateAction<string>>, setRunHistorySpecificData: Dispatch<SetStateAction<string | undefined>>, setRunHistorySpecificLogs: Dispatch<SetStateAction<LogEntry[] | undefined>>) {

    const columnDetailsSchema: DTColumnsProps<InstructionRun>[] = [
      {
        accessorKey: "data.instruction_id",
        header: "InstructionId",
        cell: ({ row }) => <span>{row.original.instruction_id}</span>,
      },
      {
        accessorKey: "data.instruction_run_start",
        header: "Start Date",
        cell: ({ row }) => <span>{row.original.instruction_run_start}</span>,
      },
      {
        accessorKey: "data.instruction_run_end",
        header: "End Date",
        cell: ({ row }) => <span>{row.original.instruction_run_end}</span>,
      },
      {
        accessorKey: "data.instruction_run_status",
        header: "Status",
        cell: ({ row }) => <span>{row.original.instruction_run_status}</span>,
      },
      {
        accessorKey: "action",
        header: 'Action',
        enableGrouping: false,
        enableSorting: false,
        cell: ({ row }) => (
            <span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <IconTextButton variant="ghost" size="icon">
                        <MoreHorizontal className="w-5 h-5" />
                        </IconTextButton>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                            className=""  
                            onClick={
                                () => { 
                                    setActiveTab('runHistoryData');
                                    fetchRunHistorySpecificData(params.probeId, row.original.instruction_id, row.original.instruction_run_id, setRunHistorySpecificData)
                                }
                            }
                        >
                            <div>
                                
                            </div>

                            <div>
                                View Data
                            </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem 
                            className=""  
                            onClick={
                                () => {
                                    setActiveTab('runHistoryLogs');
                                    fetchRunHistorySpecificLogs(params.probeId, row.original.instruction_id, row.original.instruction_run_id, setRunHistorySpecificLogs)
                                }
                            }
                        >
                            <div>
                                
                            </div>
                            
                            <div>
                                View Logs
                            </div>  
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </span>
        ),
      }
    ];
  
    return columnDetailsSchema;
}

function returnOutput(probeDetailstArr: probeDetailstArrType[] | undefined, columns:DTColumnsProps<probeDetailstArrType>[], extraParams: DTExtraParamsProps){
   
    if(probeDetailstArr == undefined){
        return (
            <div className="h-full">
                <LoadingSpinner size={60} />
            </div>
        )
    }else if(probeDetailstArr.length == 0){
        return (
            <NoDataComponent text="Data Unavailable" />
        ) 
    }else{
        return (
            <DataTable data={probeDetailstArr} columns={columns} extraParams={extraParams} />
        )
    }
}

function display<T>(data: T[] | undefined, columns: DTColumnsProps<T>[], extraParams: DTExtraParamsProps){
    if(data == undefined){
        return (
            <div className="h-full">
                <LoadingSpinner size={60} />
            </div>
        )
    }else if(data.length == 0){
        return (
            <NoDataComponent text="Data Unavailable" />
        ) 
    }else{
        return (
            <DataTable data={data} columns={columns} extraParams={extraParams} />
        )
    }
}

function showOutput2(jsonData: string | undefined){    
    const onSuccess = (data: string) => {
        console.log(data)

        const formattedString = JSON.stringify(data, null, 4)
        return (
            <pre className="overflow-auto">
                <code className="language-json">
                    {formattedString}
                </code>
            </pre>
        );
    }

    const onFailure = (err: unknown) => {
        console.error(err)

        return <NoDataComponent text="Data Unavailable" />;
    }
    
    const onLoad = () => {
        return (
            <div className="h-full">
                <LoadingSpinner size={60} />
            </div>
        )
    }
    
    try{
        if(!jsonData){
            return onLoad();
        }

        const parsedData = JSON.parse(jsonData);

        return onSuccess(parsedData)
    }
    catch(err){
        return onFailure(err);
    }
}

const DeviceActivityLog : FC<DeviceActivityLogModalFormProps> = ({open, close, params}) => {
    const { CURRENT_ACCOUNT_ID } = useGlobalContext();
    const [probeDetailstArr, setProbeDetailstArrType] = useState<probeDetailstArrType[]>()
    const [logHistoryData, setLogHistoryData] = useState<LogEntry[]>();
    const [runHistoryData, setRunHistoryData] = useState<InstructionRun[]>();
    const [runHistorySpecificData, setRunHistorySpecificData] = useState<string>();
    const [runHistorySpecificLogs, setRunHistorySpecificLogs] = useState<LogEntry[]>();
    const [activeTab, setActiveTab] = useState("services");

    useEffect(()=>{
        const fetchData = async () => {
            console.log('Fetchdata called with ', params, ' , client id: ', CURRENT_ACCOUNT_ID);


            //if(params){
                const data = await fetchActivityLogData(params?.probeId, params?.hostIp, params?.hostName, CURRENT_ACCOUNT_ID);

                console.log('DeviceActivityLog data:', data);

                if(data){
                    setProbeDetailstArrType(data)
                }
            //}
            
        }

        fetchData();
    }, [params, CURRENT_ACCOUNT_ID])

    const columns = getColumns(params, setActiveTab, setLogHistoryData, setRunHistoryData);
    const columns2 = getColumns2();
    const columns3 = getColumns3(params, setActiveTab, setRunHistorySpecificData, setRunHistorySpecificLogs);
    const extraParams = getExtraParams();
    const extraParams2 = getExtraParams2();

    return (
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="min-w-[100vw] h-screen">

                    <div>

                        <DialogHeader className="h-[5%]">
                            <DialogTitle>Activity Logs</DialogTitle>
                
                            <DialogDescription>
                                Activity logs of {params?.hostName ? params?.hostName : ''} are shown
                            </DialogDescription>
                        </DialogHeader>
                
                        <div className="h-[95%]">

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">

                                <TabsList className="grid w-full grid-cols-5 h-auto">
                                    <TabsTrigger value="services">Services</TabsTrigger>
                                    <TabsTrigger value="logHistory" className="opacity-50" disabled>Log History</TabsTrigger>
                                    <TabsTrigger value="runHistory" className="opacity-50" disabled>Run History</TabsTrigger>
                                    <TabsTrigger value="runHistoryData" className="opacity-50" disabled>History Data</TabsTrigger>
                                    <TabsTrigger value="runHistoryLogs" className="opacity-50" disabled>History Logs</TabsTrigger>
                                </TabsList>

                                <TabsContent value="services" className="h-[95%]">
                                    <Card className="h-full">
                                        <CardHeader>
                                            <CardTitle></CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 h-full">
                                            {
                                                returnOutput(probeDetailstArr, columns, extraParams)
                                            }
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="logHistory" className="h-[95%]">
                                    <Card className="h-full">
                                        <CardHeader>
                                            <CardTitle>Log history of {params?.hostName ? params?.hostName : ''}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 h-full">
                                            {
                                                display<LogEntry>(logHistoryData, columns2, extraParams2)
                                            }
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="runHistory" className="h-[95%]">
                                    <Card className="h-full">
                                        <CardHeader>
                                            <CardTitle>Run history of {params?.hostName ? params?.hostName : ''}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 h-full">
                                            {
                                                display<InstructionRun>(runHistoryData, columns3, extraParams)
                                            }
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="runHistoryData" className="h-[95%]">
                                    <Card className="h-full">
                                        <CardHeader>
                                            <CardTitle>Run history data of {params?.hostName ? params?.hostName : ''}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 h-full w-screen">
                                            {
                                                showOutput2(runHistorySpecificData)
                                            }
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="runHistoryLogs" className="h-[95%]">
                                    <Card className="h-full">
                                        <CardHeader>
                                            <CardTitle>Run history logs of {params?.hostName ? params?.hostName : ''}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 h-full w-screen">
                                            {
                                                display<LogEntry>(runHistorySpecificLogs, columns2, extraParams2)
                                            }
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                            </Tabs>    

                        </div>
                    
                        {/* <DialogFooter>
                            <TextButtonWithTooltip type="submit" tooltipContent="save"> 
                                <Save/> Save
                            </TextButtonWithTooltip>
                        </DialogFooter> */}

                    </div>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default DeviceActivityLog