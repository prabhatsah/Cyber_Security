'use client'
import { DataTable } from "@/ikon/components/data-table";
import { getMyInstancesV2, getMyInstancesV3, getParameterizedDataForTaskId } from "@/ikon/utils/api/processRuntimeService";
import { Card, CardContent } from "@/shadcn/ui/card";
import { Label } from "@/shadcn/ui/label";
import { Switch } from "@/shadcn/ui/switch";
import { CardHeader } from "@progress/kendo-react-layout";
import { useEffect, useRef, useState } from "react";

import { protocolWiseCommandCount, commandCount, commandCountByDevice, activityList, upcomingActivities, executionLogsProps, probeLogsProps } from "./type";
import { DTColumnsProps } from "@/ikon/components/data-table/type";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import { IconTextButton } from "@/ikon/components/buttons";
import { Ellipsis, Eye, EyeIcon } from "lucide-react";
import { format } from "date-fns";
import UpcomingActivitiesTemplate from "./components/UpcomingActivitiesTemplate";
import CustomDialog from "./components/CustomDialog";
import { getInstructionHistory,  getLogHistory2 } from "@/ikon/utils/api/probeManagementService";
import { se } from "date-fns/locale";



export default function DashboardPage() {

    const [protocolWiseCommandCount, setProtocolWiseCommandCount] = useState<protocolWiseCommandCount[]>([]);
    const [commandCount, setCommandCount] = useState<commandCount[]>([]); //Top most executed commands
    const [commandCountBydevice, setCommandCountBydevice] = useState<commandCountByDevice[]>([]); //Top most executed commands by device
    const [default_, setDefault_] = useState<'device' | 'command'>('device');
    const [activityList, setActivityList] = useState<activityList[]>([]); //activity list
    const [upcomingActivities, setUpcomingActivities] = useState<upcomingActivities[]>([]); //upcoming activities
    const [executionLogsData, setExecutionLogsData] = useState<executionLogsProps[]>([])
    const [probeLogs,setProbeLogs] = useState<probeLogsProps[]>([])
    const [probeLogsOpen, setprobeLogsOpen] = useState<boolean>(true)
    const [executionLogsOpen, setExecutionLogsOpen] = useState<boolean>(false)
    const [executionTime,setExecutionTime] = useState<string>('')

    const [deviceId,setDeviceId] = useState<string>('')
    const [commandId, setCommandId] = useState<string>('')
    const [host,setHost] = useState<string>('')
    const [status,setStatus] = useState<string>('') 


    const commandIdWiseCommandNameRef = useRef<Record<string, string>>({})
    const deviceIdWiseHostNameRef = useRef<Record<string, string>>({})


    useEffect(() => {
        //protocol wise command count
        getMyInstancesV2({
            processName: "Command Catalog",
            predefinedFilters: { taskName: "View Commands" },

        }).then((instances) => {

            const data = instances.map(e => e.data)
            let protocolWiseCommandCount_ = new Array();

            data.forEach((curr: any) => {

                commandIdWiseCommandNameRef.current[curr.commandId] = curr.commandName


                if (!protocolWiseCommandCount_.filter(e => e.protocol === curr.commandProtocol).length) {
                    protocolWiseCommandCount_.push({
                        protocol: curr.commandProtocol,
                        commandCount: 1
                    })
                }
                else {
                    protocolWiseCommandCount_ = protocolWiseCommandCount_.map(e => {

                        if (e.protocol === curr.commandProtocol)
                            e.commandCount = e.commandCount + 1
                        return e;
                    })
                }

            });

            setProtocolWiseCommandCount(protocolWiseCommandCount_)
        }).catch((error) => {
            console.error("Error fetching data:", error);
        })
        //Top most executed commands
        getMyInstancesV2({
            processName: "Execution History Process",
            predefinedFilters: { taskName: "Data Sore" },
        }).then((instances) => {

            const executionHistoryData = instances.map(e => e.data)
            let commandCount_ = new Array();
            let deviceCount_ = new Array();
            //creating command count
            executionHistoryData.forEach((curr: any) => {
                if (!commandCount_.filter(e => e.commandName === curr.commandName).length) {
                    commandCount_.push({
                        commandName: curr.commandName,
                        commandCount: 1
                    })
                }
                else {
                    commandCount_ = commandCount_.map(e => {
                        if (e.commandName === curr.commandName)
                            e.commandCount = e.commandCount + 1
                        return e;
                    })
                }




                //for device counts
                if (!deviceCount_.filter(e => e.device === curr.deviceId).length) {
                    deviceCount_.push({
                        device: curr.deviceId,
                        executionCount: 1
                    })
                }
                else {
                    deviceCount_ = deviceCount_.map(e => {
                        if (e.device === curr.deviceId)
                            e.executionCount = e.executionCount + 1
                        return e;
                    })
                }

            });

            //sorting command count
            commandCount_.sort((a, b) => b.commandCount - a.commandCount)
            //extracting only top 5  commands
            setCommandCount(commandCount_.splice(0, 5))

            //sorting command count
            deviceCount_.sort((a, b) => b.executionCount - a.executionCount)
            //extracting only top 5  commands by device
            getMyInstancesV2({
                processName: "Configuration Item",
                predefinedFilters: { taskName: "View CI Activity" },
            }).then((instances) => {
                const data = instances.map(e => e.data)
                data.forEach(element => {
                    deviceIdWiseHostNameRef.current[element.deviceId] = element.hostName
                });
                deviceCount_ = deviceCount_.map(e => {

                    const device = data.find((d: any) => d.deviceId === e.device)
                    if (device)
                        e.device = device.hostName
                    return e;
                })
                setCommandCountBydevice(deviceCount_.splice(0, 5))
            })



            //creating command count by device


        }).catch((error) => {
            console.error("Error fetching data:", error);
        })

        //activity list
        getMyInstancesV2({
            processName: 'scheduleId wise Results',
            predefinedFilters: {
                taskName: "Schedule Result",
                recordStartIndex: 0,
                pageSize: 20
            }

        }).then((instances) => {

            const data = instances.map(e => e.data)
            const activityList_ = new Array();
            data.forEach((curr: any) => {
                activityList_.push({
                    commandId: curr.commandId,
                    executedAt: curr.commandStartTime,
                    runStatus: curr.status,
                    deviceId: curr.deviceId,
                    hostIp: curr.hostIp,
                })
            })
            setActivityList(activityList_)

        })


        //upcoming activities 
        getMyInstancesV2({
            processName: "Command Device schedule association",
            predefinedFilters: { taskName: "Command Device Association" },

        }).then((instanceData) => {
            debugger
            const currentTime = new Date();
            const currentDay = currentTime.getDay();
            const currentMonth = currentTime.getMonth();
            const currentYear = currentTime.getFullYear();
            const todaysScheduled = [];

            let repeatedExecuteCommands = instanceData?.map(e => e.data) || [];

            getMyInstancesV2({
                processName: "Server DateTime"
            }).then(async (res) => {
                var ServerDateTimeTaskId = res[0].taskId
                var TimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const serverTime = await getParameterizedDataForTaskId({
                    taskId: ServerDateTimeTaskId,
                    parameters: {
                        localDateRequired: TimeZone,
                        userDate: new Date().getTime()
                    }
                })
                // util functions
                const gettingNextExecutionDatesForDailyCrons = (cronExp, count = 1) => {

                    const [second, minute, hour, dayOfMonth, month, dayOfWeek, year] = cronExp.split(' ');

                    let dayOfWeekArray = convertCronDayOfWeekToNumber(dayOfWeek);

                    console.log('Second:', second);
                    console.log('Minute:', minute);
                    console.log('Hour:', hour);
                    console.log('Day of Month:', dayOfMonth);
                    console.log('Month:', month);
                    console.log('Day of Week:', dayOfWeek);
                    console.log('Year:', year);

                    const daysOfWeekMap = {
                        'SUN': 1,
                        'MON': 2,
                        'TUE': 3,
                        'WED': 4,
                        'THU': 5,
                        'FRI': 6,
                        'SAT': 7
                    };

                    const todays = new Date();
                    const nextDates = [];
                    let nextDate = new Date(todays);

                    nextDate.setHours(hour, minute, second, 0);
                    if (nextDate <= todays) {
                        nextDate.setDate(nextDate.getDate() + 1);
                    }

                    while (nextDates.length < count) {
                        const jsDay = (nextDate.getDay() + 1) % 7 || 7;

                        if (dayOfWeekArray.includes(jsDay)) {
                            nextDates.push(new Date(nextDate));
                        }

                        nextDate.setDate(nextDate.getDate() + 1);
                    }

                    // nextDates.forEach((date, index) => {
                    //     console.log(`Execution ${index + 1}: ${date}`);
                    // });

                    return nextDates;
                }

                const convertCronDayOfWeekToNumber = (cronDayOfWeek) => {
                    const dayMapping = {
                        SUN: 1,
                        MON: 2,
                        TUE: 3,
                        WED: 4,
                        THU: 5,
                        FRI: 6,
                        SAT: 7
                    };
                    return cronDayOfWeek.split(',').map(day => dayMapping[day.trim()]);
                }

                const getDatesFromWeeklyCron = (cronExp, count = 1) => {

                    const [second, minute, hour, dayOfMonth, month, dayOfWeek, year] = cronExp.split(' ');

                    let dayOfWeekArray = convertCronDayOfWeekToNumber(dayOfWeek);

                    console.log('Second:', second);
                    console.log('Minute:', minute);
                    console.log('Hour:', hour);
                    console.log('Day of Month:', dayOfMonth);
                    console.log('Month:', month);
                    console.log('Day of Week:', dayOfWeek);
                    console.log('Year:', year);

                    const daysOfWeekMap = {
                        'SUN': 1,
                        'MON': 2,
                        'TUE': 3,
                        'WED': 4,
                        'THU': 5,
                        'FRI': 6,
                        'SAT': 7
                    };

                    const todays = new Date();
                    const nextDates = [];
                    let nextDate = new Date(todays);

                    nextDate.setHours(hour, minute, second, 0);
                    if (nextDate <= todays) {
                        nextDate.setDate(nextDate.getDate() + 1);
                    }

                    while (nextDates.length < count) {
                        const jsDay = (nextDate.getDay() + 1) % 7 || 7;

                        if (dayOfWeekArray.includes(jsDay)) {
                            nextDates.push(new Date(nextDate));
                        }

                        nextDate.setDate(nextDate.getDate() + 1);
                    }

                    nextDates.forEach((date, index) => {
                        console.log(`Execution ${index + 1}: ${date}`);
                    });

                    return nextDates;
                }
                //utils end


                //calculating repeated executed commands
                let nextExecuteCommandsDates = [];
                for (var i in repeatedExecuteCommands) {


                    if (repeatedExecuteCommands[i].scheduleObj && repeatedExecuteCommands[i].scheduleObj.scheduleConfig?.type == 'oneTime') {
                        //let upCommingOnceCommandsDate = new Date(repeatedExecuteCommands[i].scheduleObj.scheduleConfig.dateTime)  
                        //ref.getDateFromCronOnce(repeatedExecuteCommands[i].scheduleObj.scheduleConfig.cronExp);
                        //const serverTime = await ref.getServerTime(ServerDateTimeTaskId,TimeZone)

                        let upCommingOnceCommandsDate = new Date(repeatedExecuteCommands[i]?.scheduleObj?.scheduleConfig?.dateTime);

                        if (upCommingOnceCommandsDate < new Date(serverTime)) {
                            console.log("Not the upComming command")
                        } else {
                            if (repeatedExecuteCommands[i].skipped) {
                                nextExecuteCommandsDates.push({
                                    commandId: repeatedExecuteCommands[i].commandId,
                                    deviceList: repeatedExecuteCommands[i].deviceList,
                                    nextExecutionDate: upCommingOnceCommandsDate,
                                    skipped: true
                                })
                            }
                            else {
                                nextExecuteCommandsDates.push({
                                    commandId: repeatedExecuteCommands[i].commandId,
                                    deviceList: repeatedExecuteCommands[i].deviceList,
                                    nextExecutionDate: upCommingOnceCommandsDate,
                                    skipped: false
                                })

                                if (upCommingOnceCommandsDate.getDay() == currentDay && upCommingOnceCommandsDate.getMonth() == currentMonth && upCommingOnceCommandsDate.getFullYear() == currentYear) {
                                    todaysScheduled.push(repeatedExecuteCommands[i]);
                                }
                            }
                        }
                    }
                    else if (repeatedExecuteCommands[i].scheduleObj && repeatedExecuteCommands[i].scheduleObj.scheduleConfig?.type == 'daily') {
                        const timeValue = repeatedExecuteCommands[i].scheduleObj.scheduleConfig.timeVal.split(':');
                        let upComingDailyCommandsDate = gettingNextExecutionDatesForDailyCrons(repeatedExecuteCommands[i].scheduleObj.scheduleConfig.cronExp);

                        upComingDailyCommandsDate[0].setHours(timeValue[0], timeValue[1]);

                        if (repeatedExecuteCommands[i].skipped) {
                            nextExecuteCommandsDates.push({
                                commandId: repeatedExecuteCommands[i].commandId,
                                deviceList: repeatedExecuteCommands[i].deviceList,
                                nextExecutionDate: upComingDailyCommandsDate[0],
                                skipped: true
                            })
                        }
                        else {
                            nextExecuteCommandsDates.push({
                                commandId: repeatedExecuteCommands[i].commandId,
                                deviceList: repeatedExecuteCommands[i].deviceList,
                                nextExecutionDate: upComingDailyCommandsDate[0],
                                skipped: false
                            });

                            if (upComingDailyCommandsDate[0].getDay() == currentDay && upComingDailyCommandsDate[0].getMonth() == currentMonth && upComingDailyCommandsDate[0].getFullYear() == currentYear) {
                                todaysScheduled.push(repeatedExecuteCommands[i]);
                            }
                        }

                    }
                    else if (repeatedExecuteCommands[i].scheduleObj && repeatedExecuteCommands[i].scheduleObj.scheduleConfig?.type == 'weekly') {
                        let upcommingWeeklyCommandsDate = getDatesFromWeeklyCron(repeatedExecuteCommands[i].scheduleObj.scheduleConfig.cronExp);

                        if (repeatedExecuteCommands[i].skipped) {
                            nextExecuteCommandsDates.push({
                                commandId: repeatedExecuteCommands[i].commandId,
                                deviceList: repeatedExecuteCommands[i].deviceList,
                                nextExecutionDate: upcommingWeeklyCommandsDate[0],
                                skipped: true
                            })
                        }
                        else {
                            nextExecuteCommandsDates.push({
                                commandId: repeatedExecuteCommands[i].commandId,
                                deviceList: repeatedExecuteCommands[i].deviceList,
                                nextExecutionDate: upcommingWeeklyCommandsDate[0],
                                skipped: false
                                //"nextExecutionDate": "nan"
                            });

                            if (upcommingWeeklyCommandsDate[0].getDay() == currentDay && upcommingWeeklyCommandsDate[0].getMonth() == currentMonth && upcommingWeeklyCommandsDate[0].getFullYear() == currentYear) {
                                todaysScheduled.push(repeatedExecuteCommands[i]);
                            }
                        }
                    }
                }
                debugger
                setUpcomingActivities(nextExecuteCommandsDates.map((eachCommand) => {
                    let finalObj = {} as upcomingActivities;
                    if (eachCommand.skipped) {
                        finalObj = {
                            // ...eachCommand,
                            commandId: eachCommand.commandId,

                            devices: eachCommand.deviceList,
                            skipped: true,
                            executedAt: (function () {
                                const targetDate = new Date(eachCommand.nextExecutionDate);
                                return targetDate.toDateString() + " " + targetDate.toLocaleTimeString()
                            })()
                        }
                    } else {
                        finalObj = {
                            // ...eachCommand,
                            commandId: eachCommand.commandId,

                            devices: eachCommand.deviceList,
                            skipped: false,
                            executedAt: (function () {
                                const targetDate = new Date(eachCommand.nextExecutionDate);
                                return targetDate.toDateString() + " " + targetDate.toLocaleTimeString()
                            })()
                        }
                    }

                    return finalObj;
                }
                ))
            })
        })


    }, [])

    const protocolWiseCommandCountdatatableColumns: DTColumnsProps<protocolWiseCommandCount>[] = [
        {
            accessorKey: "protocol",
            header: "Protocol",
        },
        {
            accessorKey: "commandCount",
            header: "Command Count",
        }
    ]

    const TopExecutedCommandCountdatatableColumns: DTColumnsProps<commandCount>[] = [
        {
            accessorKey: "commandName",
            header: "Command Name",
        },
        {
            accessorKey: "commandCount",
            header: "Command Count",
        }
    ];

    const TopExecutedCommandByDeviceCountdatatableColumns: DTColumnsProps<commandCountByDevice>[] = [
        {
            accessorKey: "device",
            header: "Device Name",
        },
        {
            accessorKey: "executionCount",
            header: "Execution Count",
        }
    ]

    const activityListDataTableColumns: DTColumnsProps<activityList>[] = [
        {
            accessorKey: "commandId",
            header: "Command Name",
            cell: ({ cell }) => (
                <span>{commandIdWiseCommandNameRef.current[cell.getValue<string>()] ?? "N/A"}</span>
            )
        },
        {
            accessorKey: "executedAt",
            header: "Execution Time",
            cell: ({ cell }) => (
                <span>{cell.getValue<string>() ? format(new Date(cell.getValue<string>()), 'dd.MM.yyyy HH:mm:ss') : ''}</span>
            )
        },
        {
            accessorKey: "runStatus",
            header: "Run Status",
        },
        {
            accessorKey: "deviceId",
            header: "Action",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <IconTextButton variant="ghost" size="icon">
                            <Ellipsis />
                        </IconTextButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                            setExecutionLogsOpen(true)
                            //for modal
                                setDeviceId(row.getValue("deviceId"))
                                setCommandId(row.getValue("commandId"))
                                setHost(row.original.hostIp)
                                setStatus(row.getValue("runStatus"))
                                setExecutionTime(row.getValue("executedAt"))
                            //end
                            getMyInstancesV3({
                                processName: "scheduleId wise Results",
                                recordStartIndex: 0,
                                resultSize: 4,
                                mongoWhereClause: `this.Data!== null && this.Data.deviceId == '${row.getValue('deviceId')}' && this.Data.commandId == '${row.getValue('commandId')}'`
                            }).then((instances) => {
                                debugger
                                setExecutionLogsData(instances.map(e => e.data).map(e_ => {
                                    return {
                                        executedAt: e_.commandStartTime,
                                        finishedAt: e_.updatedOn,
                                        status: e_.status,
                                        probeId: e_.probeId,
                                        instructionList:e_.instructionList,
                                       
                                    }
                                }))
                            })
                        }}>
                            <EyeIcon className="mr-2 h-4 w-4" /> Execution Logs
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            )
        }
    ]


    const executionLogsDataTableColumns: DTColumnsProps<executionLogsProps>[] = [
        {
            accessorKey: "executedAt",
            header: "Execution Time",
            cell: ({ cell }) => (
                <span>{cell.getValue<string>() ? format(new Date(cell.getValue<string>()), 'dd.MM.yyyy HH:mm:ss') : ''}</span>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "probeId",
            header: "Action",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <IconTextButton variant="ghost" size="icon">
                            <Ellipsis />
                        </IconTextButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                            debugger
                            setprobeLogsOpen(true)
                            getInstructionHistory({
                                probeId:row.getValue("probeId"),
                                fromDate:row.getValue("executedAt"),
                                toDate:row.original.finishedAt,
                            }).then((instanceData)=>{
                                let requiredDataObj = {};
                                debugger
                                for (let index = 0, instanceData_len = instanceData.length; index < instanceData_len; index++) {
                                    if (instanceData[index].instruction_id == row.original.instructionList[0]) {
                                        requiredDataObj = instanceData[index];
                                        break;
                                    }
                                }
                                getLogHistory2({
                                    probeId: row.getValue("probeId"),
                                    instructionId: row.original.instructionList[0],
                                    fromDate: requiredDataObj.instruction_id_ts,
                                    toDate: requiredDataObj.finished_at,
                                }).then((res)=>{
                                    debugger
                                    setProbeLogs(res.map(e_ => {
                                        return {
                                            log_text:e_.log_text,
                                            log_type:e_.log_type,
                                            log_timestamp:e_.log_timestamp,
                                        }
                                    }))
                                })
                            })
                            //

                            
                        }}>
                            <Eye className="mr-2 h-4 w-4" /> Probe Logs
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            )
        }
    ]
    
    const probeLogsDataTableColumns: DTColumnsProps<probeLogsProps>[] = [
        {
            accessorKey: "log_text",
            header: "Log",
        },
        // {
        //     accessorKey: "log_type",
        //     header: "Log Type",
        // },
        {
            accessorKey: "log_timestamp",
            header: "Time",
            cell: ({ cell }) => (
                <span>{cell.getValue<string>() ? format(new Date(cell.getValue<string>()), 'dd.MM.yyyy HH:mm:ss') : ''}</span>
            )
        }
    ]

    const Comp = ()=>{
        return (
            <>
                <div className="flex gap-3 border-2 p-2 mb-2">
                    <div className="flex flex-col gap-2">
                        <span>Device Id : {deviceIdWiseHostNameRef.current[deviceId]}</span>
                        <span>Command Id : {commandIdWiseCommandNameRef.current[commandId]}</span>
                        <span>Host : {host}</span>
                        <span>Status : {status}</span>
                        <span>Execution Time : {executionTime ? format(new Date(executionTime), 'dd.MM.yyyy HH:mm:ss') : ''}</span>
                    </div>
                </div>
            <DataTable data={executionLogsData} columns={executionLogsDataTableColumns} />
            </>
        )
    }


    return (
        <>  
            
           
            { <CustomDialog content={<Comp/>} title="Execution Logs" description="Command Execution Logs" openState={executionLogsOpen} onOpenChange={setExecutionLogsOpen} width={500} />}
            
            
            { <CustomDialog content={<DataTable data={probeLogs} columns={probeLogsDataTableColumns} />} title="Probe Logs" description="Probe Logs" openState={probeLogsOpen} onOpenChange={setprobeLogsOpen} width={500} />}
            
            <div className="flex gap-3 w-full h-full">
                <div className="flex flex-col h-full w-1/3 gap-3">
                    <Card className="h-1/2 w-full">
                        <CardHeader className="flex">
                            <div className="flex items-center justify-between w-1/2">

                                Top 5 most executed command
                            </div>
                            <div className="flex items-start justify-end space-x-2 w-1/2">
                                <Switch id="airplane-mode" onCheckedChange={() => {
                                    setDefault_(prev => {

                                        return prev === 'device' ? 'command' : 'device'
                                    })
                                }} />
                                <Label htmlFor="airplane-mode">{default_ === "command" ? "Command" : "Device"}</Label>
                            </div>
                        </CardHeader>
                        <CardContent className="p-2 overflow-auto h-[300px]">
                            {
                                default_ === "command" ?
                                    <DataTable data={commandCount} columns={TopExecutedCommandCountdatatableColumns} extraParams={{
                                        rowsPerPage: false
                                    }} /> :
                                    <DataTable data={commandCountBydevice} columns={TopExecutedCommandByDeviceCountdatatableColumns} extraParams={{
                                        rowsPerPage: false
                                    }} />
                            }
                        </CardContent>
                    </Card>
                    <Card className="h-1/2 w-full">
                        <CardHeader>
                            Protocol wise command count
                        </CardHeader>
                        <CardContent className="p-2">
                            <DataTable data={protocolWiseCommandCount} columns={protocolWiseCommandCountdatatableColumns} extraParams={{
                                rowsPerPage: false
                            }} />
                        </CardContent>
                    </Card>
                </div>
                <div className="flex h-full w-1/3 gap-3">
                    <Card className="h-full w-full">
                        <CardHeader>
                            Activity List
                        </CardHeader>
                        <CardContent className="p-2 overflow-auto h-[90%]">
                            <DataTable data={activityList} columns={activityListDataTableColumns} extraParams={{
                                rowsPerPage: false
                            }} />
                        </CardContent>
                    </Card>
                </div>
                <div className="h-full w-1/3">
                    <Card className="h-full w-full">
                        <CardHeader>
                            Upcoming Activities
                        </CardHeader>
                        <CardContent className="overflow-auto h-[85%]">
                            {/* {<UpcomingActivitiesTemplate commandName="N/A" commandExecutionTime="N/A" devices={[]}/>
                        <UpcomingActivitiesTemplate commandName="N/A" commandExecutionTime="N/A" devices={['a','b']}/>
                        <UpcomingActivitiesTemplate commandName="N/A" commandExecutionTime="N/A" devices={[]}/>} */}
                            {
                                upcomingActivities.map((activity, index) => (
                                    <UpcomingActivitiesTemplate commandId_={activity.commandId} isSkipped={activity.skipped} key={index} commandName={commandIdWiseCommandNameRef.current[activity.commandId]} commandExecutionTime={activity.executedAt} devices={activity.devices.map(e => deviceIdWiseHostNameRef.current[e.deviceId])} />
                                ))
                            }
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}