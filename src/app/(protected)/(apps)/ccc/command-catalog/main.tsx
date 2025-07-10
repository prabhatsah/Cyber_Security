'use client'

import { 
    CommandDataType, 
    CommandIdWiseDetailsType, 
    DeviceConfigDataType, 
    DeviceIdWiseDetailsType, 
    ProcessInstanceDeleteMapType, 
    UserCommandConfigType 
} from "./types";

import {Node, Edge} from "reactflow";

import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import HierchicalView from "./components/HierchicalView/HierchicalView";
//import TempclickDiv from "./components/HierchicalView/temp";
import CommandSchedule from "./components/HierchicalView/Forms/CommandSchedule";
import { useMemo, useRef, useState } from "react";
import CommandExecutionLogs from "./components/HierchicalView/Forms/CommandExecutionLogs";
import CommandConfigure from "./components/HierchicalView/Forms/CommandConfigure";
import { Button } from "@/shadcn/ui/button";
import clsx from "clsx";
import TableView from "./components/TableView";
//import HierchicalViewWrapper from "./components/HierchicalView/HierchicalViewWrapper";
import { v4 } from "uuid";
import { Input } from "@/shadcn/ui/input";

import { ReactFlowProvider } from "reactflow";

type MainProps = {
    commandIdWiseDetails: CommandIdWiseDetailsType;
    deviceIdWiseDetails: DeviceIdWiseDetailsType;
    commandsData: CommandDataType[];
    deviceConfigData: DeviceConfigDataType[];
    customCommandsData: UserCommandConfigType[];
    initialNodes: Node[];
    initialEdges: Edge[];
    currentRole: string;
    processInstanceDeleteMap: ProcessInstanceDeleteMapType;
}

const tableData:{
    key: string;
    parent: string | undefined;
    name: string;
    commandId?: string;
    deviceId?: string;
    executionStatus?: 'success' | 'failure' | 'in-progress' | 'waiting' | 'not scheduled' |'';
    selectedNode?: (deviceId: string, commandId: string) => void,
    showCommandSchedule?: (val: boolean) => void,
    showCommandExecutionLogs?: (val: boolean) => void,
}[] = []

export default function Main(
    {
        commandIdWiseDetails, 
        deviceIdWiseDetails, 
        commandsData, 
        deviceConfigData, 
        customCommandsData,
        initialNodes,
        initialEdges,
        currentRole
    }
    : MainProps
){
    const [selectedNode, setSelectedNode] = useState<{deviceId: string; commandId: string;} | null>(null)
    const [selectedCustomNode, setSelectedCustomNode] = useState<string | undefined>(undefined);
    const [isCommandScheduleVisible, setIsCommandScheduleVisible] = useState(false);
    const [isCommandExecutionLogsVisible, setIsCommandExecutionLogsVisible] = useState(false);
    const [isCommandConfigurationVisible, setIsCommandConfigurationVisible] = useState(false);

    const [isHierarchicalView, setIsHierarchicalView] = useState(true);

    //console.log('initial ', initialNodes);

    const search = useRef<HTMLInputElement>(null)

    useMemo(()=>{
        initialNodes.forEach(node=>{
            node.data.showCommandSchedule = (val: boolean) => setIsCommandScheduleVisible(val);
            node.data.showCommandExecutionLogs = (val: boolean) => setIsCommandExecutionLogsVisible(val);
            node.data.selectedNode = (deviceId: string, commandId: string) => setSelectedNode({deviceId, commandId});
    
            node.data.showCommandConfigure = (val: boolean) => setIsCommandConfigurationVisible(val)
            node.data.selectedCustomNode = (associatedTabId: string | undefined) => setSelectedCustomNode(associatedTabId);
            node.data.viewOnly = currentRole == 'System Viewer' ? true : false;

            if(!node.data.isLeaf){
                tableData.push({
                    name: node.data.label,
                    key: node.id,
                    parent: node.data.source
                })
            }
            else{
                tableData.push({
                    name: node.data.label,
                    key: node.id,
                    parent: node.data.source
                })

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                node.data.leafValues.map((obj: any)=>{
                    tableData.push({
                        name: obj.label,
                        key: v4(),
                        parent: node.data.source,
                        commandId: obj.commandId,
                        deviceId: obj.deviceId,
                        executionStatus: obj.executionStatus,
                        selectedNode: node.data.selectedNode,
                        showCommandSchedule: node.data.showCommandSchedule,
                        showCommandExecutionLogs: node.data.showCommandExecutionLogs
                    })
                })
            }
            
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[initialNodes])
    
    return (
        <div className="h-full">
            <RenderAppBreadcrumb breadcrumb={{ level: 2, title: "Command Catalog", href: "/command-catalog" }}/>
            
            {/* <TempclickDiv 
                commandIdWiseData={commandIdWiseDetails}
                deviceIdWiseData={deviceIdWiseDetails}
                commandsData={commandsData}
                deviceConfigData={deviceConfigData}
                customCommandsData={customCommandsData}
            /> */}

            <div className="flex justify-end mb-2">
                <div className="border border-[#1f1f1f] rounded-sm me-2">
                    <Input
                        ref={search} 
                        type='text' 
                        className="border-none" 
                        placeholder="Search ..." />
                </div>

                <div className="border border-[#1f1f1f] rounded-sm">
                    <Button type="button" 
                        className={
                            clsx("rounded-none bg-transparent rounded-s-sm",
                                    {
                                        'bg-[#5002c5]': isHierarchicalView==true
                                    }
                                )} 
                        onClick={()=>{setIsHierarchicalView(true)}}>Tree View</Button>
                    <Button type="button" className={
                            clsx("rounded-none bg-transparent rounded-e-sm",
                                    {
                                        'bg-[#5002c5]': isHierarchicalView==false
                                    }
                                )} onClick={()=>{setIsHierarchicalView(false)}}>Table view</Button>
                </div>
            </div>

            <div className="h-[95%]" hidden={!isHierarchicalView}>
                <ReactFlowProvider>
                    <HierchicalView nodeData={initialNodes} edgeData={initialEdges} search={search} currentRole={currentRole}/>
                </ReactFlowProvider>
            </div>

            <div className="h-[95%]" hidden={isHierarchicalView}>
                <TableView data={tableData}/>
            </div>

            {
                isCommandScheduleVisible && (
                    <CommandSchedule 
                        open={isCommandScheduleVisible} 
                        close={()=>{setIsCommandScheduleVisible(false)}} 
                        deviceIdWiseData={deviceIdWiseDetails} 
                        commandIdWiseData={commandIdWiseDetails}
                        commandId={selectedNode?.commandId} 
                        deviceId={selectedNode?.deviceId}
                    />
                )
            }

            {
                isCommandExecutionLogsVisible && (
                    <CommandExecutionLogs 
                        open={isCommandExecutionLogsVisible} 
                        close={()=>{setIsCommandExecutionLogsVisible(false)}} 
                        deviceIdWiseData={deviceIdWiseDetails}
                        commandId={selectedNode ? selectedNode.commandId : ''}
                        deviceId={selectedNode ? selectedNode.deviceId : ''} 
                    />
                )
            }

            {
                isCommandConfigurationVisible && (
                    <CommandConfigure 
                        open={isCommandConfigurationVisible} 
                        close={()=>{setIsCommandConfigurationVisible(false)}} 
                        customCommandsData={customCommandsData} 
                        commandsData={commandsData} 
                        deviceConfigData={deviceConfigData} 
                        associatedNodeId={selectedCustomNode}
                        commandIdWiseDetails={commandIdWiseDetails} 
                        deviceIdWiseDetails={deviceIdWiseDetails}
                    />
                )
            }
        </div>
    )
}