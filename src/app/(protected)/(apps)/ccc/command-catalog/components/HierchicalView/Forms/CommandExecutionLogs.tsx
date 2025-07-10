'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shadcn/ui/accordion";
//import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Eye } from "lucide-react";
import { getMyInstancesV2, getMyInstancesV3, getParameterizedDataForTaskId } from '@/ikon/utils/api/processRuntimeService';
import { DeviceIdWiseDetailsType, ExecutionLogType } from '../../../types';
import { v4 as uuid } from 'uuid';
import { LoadingSpinner } from '@/ikon/components/loading-spinner';
import { getFormattedDate } from '../../../utils/helper';
import SpecificInstructionLog from './SpecificInstructionLog';

type CommandExecutionLogsProps = {
    open : boolean;
    close: ()=>void;
    deviceIdWiseData: DeviceIdWiseDetailsType;
    deviceId: string;
    commandId: string;
}

interface SubCommand {
    instructionId: string;
    name: string;
    status: "Success" | "Failed";
}
  
interface ExecutionLogDataType {
    id: string;
    startedAt: string;
    finishedAt: string;
    status: "success" | "failure";
    subCommands: SubCommand[];
    instructionId?: string;
}


interface SpecificInstructionLog {
    dashboardItemId: string;
    dashboardItemName: string;
    assigneeGroups: string[];
    cqlList: string[];
    dataCollatingScript: {
      scriptId: string;
      scriptLanguage: string;
      lastUpdated: string; // ISO datetime string
      script: string;
    };
    serviceId: string;
    dashboardItemHtml: string;
    dashboardItemJs: string;
    handlebarTemplateList: string[];
    instructionLog: InstructionLogEntry[];
  }
  
interface InstructionLogEntry {
    executionid: string;
    finished_at: string;  // ISO datetime string
    log: string;
    start_at: string;     // ISO datetime string
    instruction_id: string;
}
  

// type SpecificExecutionLogDataType = {
//     log: {
//         log_timestamp: string;
//         log_text: string;
//     }[]
// }

const fetchCommandExecutionlogs = async function(deviceId: string, commandId: string){
    //const commandId = '73bd0144-dbbe-4eb0-a07d-0a228f261a54';
    //const deviceId = '90e89d72-592b-4c54-bf8a-003f5333a41f';

    console.log('oyyo')

    const data = await getMyInstancesV3<ExecutionLogType>({
        processName: 'scheduleId wise Results',
        mongoWhereClause: `this.Data != null && this.Data.deviceId == '${deviceId}' && this.Data.commandId == '${commandId}'`,
        recordStartIndex: 0,
        resultSize: 13
    })

    const innerData = data.map(obj=>obj.data);

    return innerData;
}

const formatData = function(data: ExecutionLogType[]){
    const executionLogs : ExecutionLogDataType[] = []

    //const lastRecord = data[data.length - 1];

    data.forEach(obj=>{

        if(obj.resultList.length > 1){
            const subcommand = obj.resultList.map((obj2, index)=>({'instructionId': obj.instructionList[index],  'status': obj2.dryRunStatus, 'name': Object.keys(obj2.result)[0]}));

            executionLogs.push({
                status : obj.status,
                startedAt: obj.commandStartTime,
                finishedAt: obj.updatedOn,
                subCommands: subcommand,
                id: uuid()
            });
        }else if(obj.resultList.length == 1){
            executionLogs.push({
                status : obj.status,
                startedAt: obj.commandStartTime,
                finishedAt: obj.updatedOn,
                instructionId: obj.instructionList[0],
                subCommands: [],
                id: uuid()
            });
        }
        
    })

    return executionLogs;
}

const fetchCommandSpecificLog = async function(
    instructionId: string | undefined, 
    showSpecificInstructionLogs: Dispatch<SetStateAction<boolean>>,
    specificInstructionLogsData: Dispatch<SetStateAction<string>>
){
    const data = await getMyInstancesV2({
        processName: 'Schedule Logs',
        predefinedFilters : { taskName: "View Schedule Log Activity" }
    })

    console.log('instructionId : ', instructionId, ' getMyInstancesV2 : ', data)

    if(!instructionId){
        return
    }

    const data2 = await getParameterizedDataForTaskId<SpecificInstructionLog>({
        taskId: data[0].taskId,
        parameters : {
            instructionId: instructionId
        }
    })

    //console.log('fetchCommandSpecificLog', data2.instructionLog[0]);

    specificInstructionLogsData(data2.instructionLog[0].log)
    showSpecificInstructionLogs(true);
}

export default function CommandExecutionLogs({open, close, deviceIdWiseData, commandId, deviceId}: CommandExecutionLogsProps) {
    //const commandId = '73bd0144-dbbe-4eb0-a07d-0a228f261a54';
    //const deviceId = '90e89d72-592b-4c54-bf8a-003f5333a41f';
  const [searchQuery, setSearchQuery] = useState('');
  const [executionLogData, setExecutionLogData] = useState<ExecutionLogDataType[]>([]);
  const [showSpecificInstructionLogs, setSpecificInstructionLogs] = useState(false);
  const [specificInstructionLogData, setSpecificInstructionLogData] = useState('');

  useEffect(()=>{
    const fetchData = async ()=>{
        const data = await fetchCommandExecutionlogs(deviceId, commandId);

        console.log('fetchCommandExecutionlogs data: ', data);

        const formattedData = formatData(data);

        console.log('formatted_data: ', formattedData);

        setExecutionLogData(formattedData);
    }

    fetchData();
  },[commandId, deviceId])

  const filteredLogs = executionLogData.filter(log => {
    const searchLower = searchQuery.toLowerCase();
    return (
      log.startedAt.toLowerCase().includes(searchLower) ||
      log.finishedAt.toLowerCase().includes(searchLower) ||
      log.status.toLowerCase().includes(searchLower) ||
      log.subCommands.some(cmd => 
        cmd.name.toLowerCase().includes(searchLower) ||
        cmd.status.toLowerCase().includes(searchLower)
      )
    );
  });

  return (
    <div className=" bg-black p-8">
      <Dialog open={open} onOpenChange={close}>
        <DialogContent className="min-h-[50vh] sm:max-w-[800px] bg-[#1a1a1a] border-gray-800">

            <div className='h-full'>

                <DialogHeader className="flex pb-4 h-[5%]">
                    <DialogTitle className="text-xl font-semibold text-white">Execution Logs</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                {
                    filteredLogs.length>0 ? (
                        <div className="space-y-6 h-[95%]">
                            {/* Device Info */}
                            <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm text-gray-400">Device Name</Label>
                                <div className="text-white">{deviceIdWiseData[deviceId].hostName}</div>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-400">Device IP</Label>
                                <div className="text-white">{deviceIdWiseData[deviceId].hostIp}</div>
                            </div>
                            </div>

                            {/* Status Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm text-gray-400">Latest Status</Label>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-white">{executionLogData[executionLogData.length-1] ? executionLogData[executionLogData.length-1].status : ''}</span>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-400">Latest Time</Label>
                                    <div className="text-white">{executionLogData[executionLogData.length-1] ? getFormattedDate(executionLogData[executionLogData.length-1].finishedAt) : ''}</div>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div>
                                <Input 
                                    placeholder="Search..." 
                                    className=""
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Log Table with Accordion */}
                            <div className="border border-gray-800 rounded-lg overflow-hidden">
                                <div className="p-3 grid grid-cols-4 gap-4">
                                    <div className="text-sm font-medium text-gray-400">Started At</div>
                                    <div className="text-sm font-medium text-gray-400">Finished At</div>
                                    <div className="text-sm font-medium text-gray-400">Status</div>
                                    <div className="text-sm font-medium text-gray-400">Actions</div>
                                </div>
                            
                                <Accordion type="multiple" className="divide-y divide-gray-800 border-t-2 px-2 max-h-[50vh] overflow-auto">
                                    {
                                        filteredLogs.map((log) => {
                                            return log.subCommands.length > 0 ? (

                                                <AccordionItem
                                                    key={log.id}
                                                    value={log.id}
                                                    className="border-none"
                                                >
                                                    <AccordionTrigger className="flex flex-row-reverse py-0 hover:no-underline hover:bg-[#2a2a2a]">
                                                        <div className="grid grid-cols-4 gap-4 w-full py-3 px-3">
                                                            <div className="text-sm text-white">{getFormattedDate(log.startedAt)}</div>
                                                            <div className="text-sm text-white">{getFormattedDate(log.finishedAt)}</div>
                                                            <div className="text-sm text-green-500">{log.status}</div>
                                                            {/* <div className="flex items-center justify-between">
                                                                <span className="text-gray-400 hover:text-white">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </span>
                                                            </div> */}
                                                        </div>
                                                    </AccordionTrigger>
                                                    {
                                                        log.subCommands.length > 0 && (
                                                        <AccordionContent className="pt-0 pb-2">
                                                            <div className="space-y-1 bg-[#242424] px-8 py-2">
                                                                {log.subCommands.map((cmd, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="grid grid-cols-4 gap-4 text-sm py-1"
                                                                    >
                                                                        <div className="col-span-2 text-gray-300">
                                                                            {cmd.name}
                                                                        </div>
                                                                        <div className="text-green-500">
                                                                            {cmd.status}
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-gray-400 hover:text-white" onClick={()=>{ fetchCommandSpecificLog(cmd.instructionId,  setSpecificInstructionLogs, setSpecificInstructionLogData) }}>
                                                                                <Eye className="h-4 w-4" />
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </AccordionContent>
                                                        )
                                                    }
                                                </AccordionItem>
                                            ) 
                                            : 
                                            (
                                                <div key={log.id} className="grid grid-cols-4 gap-4 w-full py-3 px-3">
                                                    <div className="text-sm text-white ms-4">{getFormattedDate(log.startedAt)}</div>
                                                    <div className="text-sm text-white ms-3">{getFormattedDate(log.finishedAt)}</div>
                                                    <div className="text-sm text-green-500 ms-2">{log.status}</div>
                                                    <div className="flex items-center justify-between ms-1">
                                                        <span className="text-gray-400 hover:text-white" onClick={()=>{ fetchCommandSpecificLog(log.instructionId, setSpecificInstructionLogs, setSpecificInstructionLogData) }}>
                                                            <Eye className="h-4 w-4" />
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </Accordion>
                            </div>
                        </div>
                    ) 
                    : 
                    (
                        <LoadingSpinner size={60} className='h-[90%]' />
                    )
                }

            </div>

        </DialogContent>
      </Dialog>

      {
        showSpecificInstructionLogs && (
            <SpecificInstructionLog open={showSpecificInstructionLogs} close={()=>{setSpecificInstructionLogs(false)}} data={specificInstructionLogData} />
        )
      }
    </div>
  );
}