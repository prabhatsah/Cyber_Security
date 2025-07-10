import { use, useEffect, useState } from "react";
import { InstructionHistoryProps, InstructionHistoryTableDataType,  LogHistoryProps } from "../type";
import { getInstructionHistory, getInstructionRunData, getInstructionRunHistory, getInstructionRunLogs, getLogHistory1, getServiceParameters } from "@/ikon/utils/api/probeManagementService";
import { format } from "date-fns/format";
import { subHours } from "date-fns/subHours";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import { IconTextButton } from "@/ikon/components/buttons";
import { Database, Ellipsis, FolderClock, Logs, RadioTower, RefreshCw, Settings } from "lucide-react";
import { DataTable } from "@/ikon/components/data-table";
import Alert from "@/ikon/components/alert-dialog";
import JsonFormatter from 'react-json-formatter'
import moment from "moment";
import AdvanceDialog from "./AdvanceDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { get } from "http";



export default function InstructionHistory({ probeId }: { probeId: string }) {
    debugger
    const [instructionHistoryData, setInstructionHistoryData] = useState<InstructionHistoryTableDataType[]>([]);
    const [paramsOpen, setParamsOpen] = useState<boolean>(false);
    const [liveLogOpen, setLiveLogOpen] = useState<boolean>(false);
    // const [logHistoryOpen, setLogHistoryOpen] = useState<boolean>(false);
    // const [runHistoryOpen, setRunHistoryOpen] = useState<boolean>(false);

    const [instructionRunDataOpen, setInstructionRunDataOpen] = useState<boolean>(false);
    const [instructionRunLogOpen, setInstructionRunLogOpen] = useState<boolean>(false);

    const [workInProgressAlert, setWorkInProgressAlert] = useState<boolean>(false);

    const [serviceParams, setServiceparams] = useState<string>('');

    const [tabDefaultValue, setTabDefaultValue] = useState<'service' | 'logHistory' | 'runHistory'>('service')

    const [instructionRunHistoryData, setInstructionRunHistoryData] = useState<InstructionHistoryProps[]>([]);
    const [logHistoryData, setLogHistoryData] = useState<LogHistoryProps[]>([]);

    const [instructionRunData,setInstructionRunData] = useState<string>('');
    const [instructionRunLogs,setInstructionRunLogs] = useState<LogHistoryProps[]>([]);
    // function formatDateWithTimezone(date: Date): string {
    //     // Step 1: Format the date without timezone
    //     try{
    //     const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS");

    //     // Step 2: Get the timezone offset in minutes (negative value for positive timezone)
    //     const timezoneOffset = date.getTimezoneOffset(); // In minutes

    //     // Step 3: Convert the timezone offset into the "+0530" format
    //     const sign = timezoneOffset > 0 ? '-' : '+';  // Negative offset means the timezone is ahead of UTC
    //     const hours = String(Math.abs(timezoneOffset) / 60).padStart(2, '0');
    //     const minutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');

    //     const timezoneString = `${sign}${hours}${minutes}`;

    //     // Step 4: Combine the date and timezone into the final format
    //     return `${formattedDate}${timezoneString}`;
    //     }
    //     catch{
    //         return ''
    //     }
    //   }

    useEffect(() => {

        // const toDate = format(new Date(),"yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        // const fromDate = format(subHours(new Date(toDate), 48),"yyyy-MM-dd'T'HH:mm:ss.SSSXXX");

        const toDate = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ');

        const fromDate = moment(toDate).subtract(48, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');


        getInstructionHistory({
            probeId: probeId,
            fromDate: fromDate,
            toDate: toDate
        }).then((instrctionHistory) => {
            setInstructionHistoryData(instrctionHistory)
        }).catch(error => {
            debugger
            console.error("Error fetching instruction history:", error);

        })
    }, [])

    const instructionHistoryTableColumns: DTColumnsProps<InstructionHistoryTableDataType>[] = [

        {
            accessorKey: "serviceName",
            header: "Service",


        }, {
            accessorKey: "posted_by",
            header: "Posted By",

        },
        {
            accessorKey: "instruction_id_ts",
            header: "Posted At",
            cell: ({ row }) => (
                <div>{format(new Date(row.getValue("instruction_id_ts")), "yyyy-MM-dd HH:mm:ss")}</div>
            ),
        },
        {
            accessorKey: "instruction_id",
            header: "Action",

            cell: ({ row }) => (

                <span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <IconTextButton variant="ghost" size="icon">
                                <Ellipsis />
                            </IconTextButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                                setParamsOpen(true)
                                debugger
                                getServiceParameters({
                                    probeId: probeId,
                                    instructionId: row.getValue("instruction_id")
                                }).then((params) => {
                                    debugger
                                    setServiceparams(params as string)
                                }).catch(error => {
                                    debugger
                                    console.error("Error fetching service parameters:", error);
                                })

                            }}>

                                <div className="flex gap-2 items-center"><Settings /> Parameters</div>

                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {

                                setLiveLogOpen(true)
                                setWorkInProgressAlert(true)


                            }}>
                                <div className="flex gap-2 items-center"><RadioTower /> Live Logs</div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                setTabDefaultValue('logHistory')
                                getLogHistory1({
                                    probeId: probeId,
                                    fromDate: moment().subtract(48, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                                    toDate: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
                                }).then((logHistory) => {
                                    debugger
                                    setLogHistoryData(logHistory)
                                }).catch(error => {
                                    debugger
                                    console.error("Error fetching log history:", error);
                                })
                            }}>
                                <div className="flex gap-2 items-center"><FolderClock /> Log History</div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                debugger
                                //setting default tab value to run history
                                setTabDefaultValue('runHistory')
                                //
                                const toDate = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
                                const fromDate = moment(toDate).subtract(48, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
                                getInstructionRunHistory({
                                    probeId: probeId,
                                    instructionId: row.getValue("instruction_id"),
                                    fromDate: fromDate,
                                    toDate: toDate

                                }).then((runHistory) => {
                                    debugger
                                    setInstructionRunHistoryData(runHistory)
                                }).catch(error => {
                                    debugger
                                    console.error("Error fetching instruction run history:", error);
                                })
                            }}>
                                <div className="flex gap-2 items-center"><RefreshCw /> Run History</div>
                            </DropdownMenuItem>

                        </DropdownMenuContent>

                    </DropdownMenu>
                </span>

            ),
        },

    ];
    const ext: DTExtraParamsProps = {
        pageSize: 5,
    }

    const jsonStyle = {
        propertyStyle: { color: 'skyblue' },
        stringStyle: { color: 'green' },
        numberStyle: { color: 'grey' }
    }

    //instruction run history table columns
    const instructionRunHistoryTableColumns: DTColumnsProps<InstructionHistoryProps>[] = [
        {
            accessorKey: "instruction_run_id",
            header: "Instruction Run Id",


        },
        {
            accessorKey: "instruction_run_start",
            header: "Instruction Run Start",


        },
        {
            accessorKey: "instruction_run_end",
            header: "Instruction Run End",


        }
        ,
        {
            accessorKey: "instruction_run_status",
            header: "Status",


        },
        {
            accessorKey: "instruction_id",
            header: "Action",
            cell: ({ row }) => (
                <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <IconTextButton variant="ghost" size="icon">
                                <Ellipsis />
                            </IconTextButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={()=>{
                                //for modals
                                setInstructionRunDataOpen(true)
                                //API call
                                debugger
                                getInstructionRunData({
                                    probeId: probeId,
                                    instructionId: row.getValue("instruction_id"),
                                    instructionRunId: row.getValue("instruction_run_id")
                                }).then((data) => {
                                    debugger
                                    setInstructionRunData(data as string)
                                    console.log("data", data)
                                }).catch(error => {
                                    debugger
                                    console.error("Error fetching instruction run data:", error);
                                })
                            }} >
                                <div className="flex gap-2 items-center"><Database /> View Data</div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={()=>{
                                //for modal
                                debugger
                                setInstructionRunLogOpen(true)
                                //API call
                                getInstructionRunLogs({
                                    probeId: probeId,
                                    instructionId: row.getValue("instruction_id"),
                                    instructionRunId: row.getValue("instruction_run_id")
                                }).then((data) => {
                                    debugger
                                    setInstructionRunLogs(data as string)
                                    console.log("data", data)   
                                }).catch(error => {
                                    debugger
                                    console.error("Error fetching instruction run logs:", error);
                                })

                            }} >
                            <div className="flex gap-2 items-center"><Logs /> View Logs</div>
                                </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
            )


        }
    ]
    //log history table columns
    const logHistoryTableColumns: DTColumnsProps<LogHistoryProps>[] = [
        {
            accessorKey: "log_timestamp",
            header: "Time",


        },
        {
            accessorKey: "log_text",
            header: "Log",


        },
        
    ]

    const InstructionRunLogsContent = () => {
        
        return (
            <DataTable data={instructionRunLogs} columns={logHistoryTableColumns} />
        )
    }


    debugger
    return (<>
        <Tabs value={tabDefaultValue} className="w-full">
            <TabsList>
                <TabsTrigger value="service" onClick={()=>{
                    setTabDefaultValue('service')
                }} >Services</TabsTrigger>
                <TabsTrigger value="logHistory" disabled={tabDefaultValue!=='logHistory'}>Log History</TabsTrigger>
                <TabsTrigger value="runHistory" disabled={tabDefaultValue!=='runHistory'}>Run History</TabsTrigger>
            </TabsList>
            <TabsContent value="service">
                {<AdvanceDialog width={600} title={"Service Parameters"}
                    content={<JsonFormatter json={serviceParams} jsonStyle={jsonStyle} />}
                    openState={paramsOpen}
                    onOpenChange={setParamsOpen} />}
                {/* {
                    <AdvanceDialog width={600} title={"Run History"}
                        content={'fwffw'}
                        openState={runHistoryOpen}
                        onOpenChange={setRunHistoryOpen} />
                } */}
                {workInProgressAlert && <Alert title={"Work In Progress"} confirmText="Ok" onConfirm={() => {
                    setWorkInProgressAlert(false)
                }} />}

                <DataTable data={instructionHistoryData} columns={instructionHistoryTableColumns} extraParams={ext} />
            </TabsContent>
            <TabsContent value="logHistory">
                <DataTable data={logHistoryData} columns={logHistoryTableColumns}  /> 
            </TabsContent>
            <TabsContent value="runHistory">
                <DataTable data={instructionRunHistoryData} columns={instructionRunHistoryTableColumns}  />
                {
                    <AdvanceDialog width={600} title={"Instruction Run Data"}
                    content={instructionRunData}
                    openState={instructionRunDataOpen}
                    onOpenChange={setInstructionRunDataOpen} />
                }
                {
                    <AdvanceDialog width={600} title={"Instruction Run logs"}
                    content={<InstructionRunLogsContent />}
                    openState={instructionRunLogOpen}
                    onOpenChange={setInstructionRunLogOpen} />
                }
            </TabsContent>

        </Tabs>




    </>)
}