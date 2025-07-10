"use client";

import { Handle, Position } from "reactflow";
import { AlarmClockOff, Calendar, ChevronDown, ChevronUp, CircleCheck, CircleOff, Computer, Hourglass, Image, MoreHorizontal, Plus, ScrollText, Terminal } from "lucide-react";
import { GetTooltip } from "../General/Toolltip";
import { Button } from "@/shadcn/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import clsx from "clsx";
import { Tooltip } from "@/ikon/components/tooltip";
import { getMyInstancesV2, getParameterizedDataForTaskId } from "@/ikon/utils/api/processRuntimeService";

interface TreeNodeProps {
  data: {
    label: string;
    expanded: boolean;
    onToggle: () => void;
    isRoot: undefined | boolean;
    isLeaf: undefined | boolean;
    commandsCount: number;
    deviceCount: number;
    statusColor: string;
    leafValues?: {
      label: string;
      executionStatus: 'not scheduled' | 'waiting' | 'success' | 'failure';
      deviceId: string;
      commandId: string;
    }[];
    source: string;
    nodeViewType: 'device' | 'service' | 'custom';
    associatedTabId: string | undefined;
    processInstanceId: string;
    showCommandSchedule: (val: boolean) => void;
    showCommandExecutionLogs: (val: boolean) => void;
    showCommandConfigure: (val : boolean) => void;
    selectedNode: (deviceId: string, commandId: string) => void;
    selectedCustomNode: (associatedTabId: string | undefined) => void;
    addNewNode: (val: string) => void;
    viewOnly: boolean;
  };
  isConnectable?: boolean;
  
}

const invokeBCR = async function(pid: string){
  console.log('invokeBCR called ', pid);
  debugger;

  if(pid=='')
    return;

  try{
    const data = await getMyInstancesV2({
      processName: 'Backend Query Executer',
      predefinedFilters: {
        taskName: 'Backend Script Runner'
      }
    })

    if(!data.length)
      return;


    await getParameterizedDataForTaskId({
      taskId: data[0].taskId,
      parameters: {
        scriptName : 'DPI',
        processInstanceId : pid
      }
    })

    //window.location.reload();
  }
  catch(err){
    console.error(err)
  }

}

export default function TreeNode({ data, isConnectable }: TreeNodeProps) {
  const isRootNode = data.isRoot; // Flag to determine if it's the root node
  const isleafNode = data.isLeaf;
  const isExpanded = data.expanded;
  const deviceCount = data.deviceCount;
  const commandCount = data.commandsCount;
  const leafValues = data.leafValues;
  //const nodeViewType = data.nodeViewType; border-${data.statusColor}-500

  return (
    <div className={clsx('relative p-1 shadow-md rounded-sm border-2 w-[150px]  bg-white min-w-32',
      {
        "border-green-500": data.statusColor === 'green',
        "border-red-500": data.statusColor === 'red',
        "border-transparent": data.statusColor === 'transparent'
      }
    )}>
      
      {
        isRootNode!=true && (
            <Handle
              type="target"
              position={Position.Top}
              className="!w-2 !h-2"
              isConnectable={isConnectable}
              style={{
                backgroundColor: data.statusColor != 'transparent' ? data.statusColor : 'white'
              }}
            />
        )
      }

      <div className="flex flex-col items-center gap-1">
        <div className="flex flex-col w-full gap-1">

          <GetTooltip tooltiTtext={data.label}>
            <div className="text-sm text-white bg-[#111051] px-2 rounded-sm text-ellipsis whitespace-nowrap overflow-hidden">{data.label}</div>
          </GetTooltip>          

          <div className="flex items-center gap-1 relative">

            <div>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image />
            </div>

            <div>
                <div className="flex items-center gap-1">
                  <div>
                    <Computer size={12} />
                  </div>
                  <div className="text-xs font-sans">
                    Devices: {deviceCount}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <div>
                    <Terminal size={12} />
                  </div>
                  <div className="text-xs font-sans">
                    Commands: {commandCount}
                  </div>
                </div>
            </div>

            {
              !data.viewOnly && data.source == '1' && (
                <div className="absolute right-[-1rem]">
                  <GetTooltip tooltiTtext='Add new node'>
                    <Button type='button' className="p-1 h-4 w-4 rounded-sm" onClick={()=>{data.addNewNode('4')}}> {/* Add onclick func here */}
                      <Plus />
                    </Button>
                  </GetTooltip>
                </div>
              )
            }

            {
              !data.viewOnly && data.source != '1' && data.nodeViewType == 'custom' ? (
                <div className="absolute right-[-1rem]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type='button' className="p-1 h-4 w-4 rounded-sm">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-auto">
                      <DropdownMenuLabel className="text-center">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {/* <DropdownMenuItem>Edit</DropdownMenuItem> */}
                      <DropdownMenuItem 
                        onClick={()=>{
                          console.log('associatedTabId: ', data.associatedTabId);
                            if(data.selectedCustomNode!= undefined)
                              data.selectedCustomNode(data.associatedTabId);
                            data.showCommandConfigure(true)
                        }}>Config</DropdownMenuItem>
                      <DropdownMenuItem onClick={()=>{
                        invokeBCR(data.processInstanceId)
                      }}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : null
            }

          </div>

        </div>

        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onToggle();
            }}
            className="block hover:bg-gray-100  transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {
        isleafNode!=true && (
            <Handle
              type="source"
              position={Position.Bottom}
              className="!w-2 !h-2"
              isConnectable={isConnectable}
              style={{
                backgroundColor: 'white'
              }}
            />
        )
      }

      {
        isleafNode && isExpanded && leafValues && (
          <div className="p-1 absolute w-full left-0 text-center mt-2 text-sm flex flex-col gap-1 bg-transparent">

            {
              data.leafValues && data.leafValues.map(obj=>{
                return (

                  <div key={obj.label} className="flex justify-between items-center p-1 rounded-sm bg-white">
                    <div>
                      <Tooltip tooltipContent={obj.label}>
                        <div className="text-xs truncate whitespace-nowrap overflow-hidden max-w-[5rem]">{obj.label}</div>
                      </Tooltip>
                    </div>
                    <div className="flex gap-1">
                      <div className="cursor-default">
                        <Tooltip tooltipContent={obj.executionStatus}>
                          {
                            obj.executionStatus == 'waiting' ? (<Hourglass color="blue" size={12} />) : (obj.executionStatus == 'success' ? (<CircleCheck size={12} color="green" />) : (obj.executionStatus == 'failure' ? (<CircleOff size={12} color="red" />) : (<AlarmClockOff size={12} color="red" />)))
                          }
                        </Tooltip>
                      </div>

                      {
                        obj.executionStatus != 'not scheduled' && (
                          <div className="cursor-pointer" 
                            onClick={()=>{
                              data.selectedNode(obj.deviceId, obj.commandId); 
                              data.showCommandSchedule(true)
                            }}
                          >
                            <Tooltip tooltipContent="Command schedule">
                              <Calendar size={12} />
                            </Tooltip>
                          </div>
                        )
                      }
                      
                      {
                        obj.executionStatus != 'not scheduled' && (
                          <div className="cursor-pointer" 
                            onClick={()=>{
                              data.selectedNode(obj.deviceId, obj.commandId); 
                              data.showCommandExecutionLogs(true)
                            }}  
                          >
                            <Tooltip tooltipContent="Command logs">
                              <ScrollText size={12} />
                            </Tooltip>  
                          </div>
                        )
                      }
                        
                    </div>
                  </div>

                )
              })
            }

          </div>
        )
      }
    </div>
  );
}