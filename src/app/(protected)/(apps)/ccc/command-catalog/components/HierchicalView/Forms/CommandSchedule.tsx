'use client';

import { LoadingSpinner } from "@/ikon/components/loading-spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { useEffect, useState } from "react";
import { CommandIdWiseDetailsType, DeviceIdWiseDetailsType, TaskScheduleDataType } from "../../../types";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getFormattedDate } from "../../../utils/helper";
import { Label } from "@/shadcn/ui/label";

type CommandScheduleProps = {
    open : boolean;
    close: ()=>void;
    commandIdWiseData: CommandIdWiseDetailsType; 
    deviceIdWiseData: DeviceIdWiseDetailsType;
    deviceId?: string;
    commandId?: string;
}

type CommandScheduleDataType = {
    commandName: string;
    deviceName: string;
    hostIP: string;
    scheduleData: {
        date: string;
        interval: string;
    }[]
}

const fetchCommandScheduleData = async function(
    commandIdWiseData: CommandIdWiseDetailsType, 
    deviceIdWiseData: DeviceIdWiseDetailsType,
    deviceId: string | undefined,
    commandId: string | undefined
){
    //const commandId = '73bd0144-dbbe-4eb0-a07d-0a228f261a54';
    //const deviceId = '90e89d72-592b-4c54-bf8a-003f5333a41f';

    if(deviceId == undefined || commandId == undefined){
        return;
    }
    
    const data = await getMyInstancesV2<TaskScheduleDataType>({
        processName: 'Task Scheduler',
        predefinedFilters: {
            taskName: 'Task Schedule'
        },
        processVariableFilters: {
            deviceId: deviceId,
            commandId: commandId
        }
    });

    const scheduleData0: {
        date: string;
        interval: string;
    }[] = []

    data.forEach((obj)=>{
        scheduleData0.push({
            interval: obj.data.scheduleConfig.type,
            date: getFormattedDate(obj.data.scheduledOn)
        })
    })

    console.log('data in showCommandSchedule: ', data);

    const scheduleData: CommandScheduleDataType = {
        commandName: commandIdWiseData[commandId].commandName,
        deviceName: deviceIdWiseData[deviceId].hostName,
        hostIP:  deviceIdWiseData[deviceId].hostIp,
        scheduleData: scheduleData0
    }

    return scheduleData
}

export default function CommandSchedule({open, close, commandIdWiseData, deviceIdWiseData, deviceId, commandId}: CommandScheduleProps) {
    const [commandScheduleData, setCommandScheduleData] = useState<CommandScheduleDataType>();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(()=>{
        const fetchData = async () => {
            const scheduleData = await fetchCommandScheduleData(commandIdWiseData, deviceIdWiseData, deviceId, commandId);

            setCommandScheduleData(scheduleData)
        }

        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    let filteredShedule = commandScheduleData?.scheduleData.filter(obj => {
        const searchLower = searchQuery.toLowerCase();
        return (
            obj.date.toLowerCase().includes(searchLower) ||
            obj.interval.toLowerCase().includes(searchLower)
        );
      });

    if(!filteredShedule){
        filteredShedule = [];
    }

  return (
    <div className="min-h-screen bg-background p-8">
      <Dialog open={open} onOpenChange={close}>

        <DialogContent className="sm:max-w-[500px] min-h-[10rem]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Command Schedule</DialogTitle>
          </DialogHeader>
          
          {
            commandScheduleData ? (
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <div className="grid gap-2">
                            <div>
                                <div className="flex gap-2">
                                    <div className="w-1/2">
                                        <Label className="text-sm text-gray-400">Device Name:</Label>
                                        <div className="text-white">{commandScheduleData.deviceName}</div>
                                    </div>

                                    <div>
                                        <Label className="text-sm text-gray-400">Device IP:</Label>
                                        <div className="text-white">{commandScheduleData.hostIP}</div>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm text-gray-400">Command Name:</Label>
                                    <div className="text-white">{commandScheduleData.commandName}</div>
                                </div>


                                {/* <p className="text-sm font-medium mb-2">Device Name: {commandScheduleData.deviceName}</p>
                                <p className="text-sm font-medium mb-2">Device IP: {commandScheduleData.hostIP}</p>
                                <p className="text-sm font-medium mb-2">Command Name: {commandScheduleData.commandName}</p> */}
                            </div>
                            <Input 
                                placeholder="Search..." 
                                className="w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        {/* <div className="flex justify-between mb-2">
                            <h3 className="text-sm font-medium">Scheduled On</h3>
                            <h3 className="text-sm font-medium">Interval</h3>
                        </div> */}
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="p-4">Scheduled On</TableHead>
                                        <TableHead className="p-4">Interval</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredShedule.map((schedule, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="py-2 px-4">{schedule.date}</TableCell>
                                        <TableCell className="py-2 px-4">{schedule.interval}</TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            ) : (<LoadingSpinner size={60} />)
          }
          
        </DialogContent>
      </Dialog>
    </div>
  );
}