'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shadcn/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Command, CommandIdWiseDetailsType, CommandScheduleType, DeviceIdWiseDetailsType } from "../../../types";
import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Save } from "lucide-react";

type PropsType = {
    open: boolean,
    close: (val: boolean) => void,
    commandId: string,
    commandIdWiseDetails: CommandIdWiseDetailsType,
    deviceIdWiseDetails: DeviceIdWiseDetailsType,
    savedScheduledInfo: RefObject<{
        [key: string]: CommandScheduleType;
      } | null>,
    selectedDevices: RefObject<{
        [key: string]: string[];
    }>
}

const deviceIpIdMap: Record<string, string> = {}

const handleChange = function(id1: string, id2: string | null, setSelected: Dispatch<SetStateAction<Record<string, string | null>>>){
    setSelected((prev)=>({
        ...prev,
        [id1]: prev[id1] === id2 ? null : id2
    }))
}

const onSubmit = function(
    commandId: string,
    selected: Record<string, string | null>, 
    subCommandDetails: Command[], 
    deviceIdWiseDetails: DeviceIdWiseDetailsType,
    close: (val: boolean) => void,
    savedScheduledInfo: RefObject<{
        [key: string]: CommandScheduleType;
    } | null>,
    selectedDevices: RefObject<{
        [key: string]: string[];
    }>
){
    const deviceDetailsWithAssociatedSubCommand: {
        [key: string] : {
            hostIp: string;
            deviceId: string;
            associatedSubcommandId: string;
            commandIndex: number;
        }
    } = {};

    subCommandDetails.forEach((obj, index) => {
        const deviceId = selected[obj.eachCommandId];
        
        if (deviceId != null) {
          const device = deviceIdWiseDetails[deviceId];
          deviceDetailsWithAssociatedSubCommand[obj.eachCommandId] = {
            hostIp: device.hostIp,
            deviceId: device.deviceId,
            associatedSubcommandId: obj.eachCommandId,
            commandIndex: index
          };
        }
        else{
            const deviceId_ = deviceIpIdMap[selectedDevices.current[commandId][0]];
            const device = deviceIdWiseDetails[deviceId_];
            deviceDetailsWithAssociatedSubCommand[obj.eachCommandId] = {
                hostIp: device.hostIp,
                deviceId: device.deviceId,
                associatedSubcommandId: obj.eachCommandId,
                commandIndex: index
          };
        }
      }
    );

    if(savedScheduledInfo.current)
        savedScheduledInfo.current[commandId].deviceDetailsWithAssociatedSubCommand = deviceDetailsWithAssociatedSubCommand;
    // else{
    //     savedScheduledInfo.current = {}
    //     savedScheduledInfo.current[commandId] = {}
    //     savedScheduledInfo.current[commandId].deviceDetailsWithAssociatedSubCommand = deviceDetailsWithAssociatedSubCommand;
    // }
        

    console.log('saved info: ', savedScheduledInfo);

    close(false);
}

export default function SubCommandDeviceSelection({open, close, commandId, commandIdWiseDetails, deviceIdWiseDetails, savedScheduledInfo, selectedDevices}: PropsType){    
    const [selected, setSelected] = useState<Record<string, string | null>>({});
    const subCommandDetails = commandIdWiseDetails[commandId].script.commands;	
	const subCommandDetailsWithDeviceSelection = commandIdWiseDetails[commandId].script.commands.filter(e => e.deviceSelectionObj && e.deviceSelectionObj.deviceSelection);
    
    const deviceHostWiseIpDetails = Object.keys(deviceIdWiseDetails).map((key)=>{
        deviceIpIdMap[deviceIdWiseDetails[key].hostIp] = deviceIdWiseDetails[key].deviceId;

        return {
            deviceId: deviceIdWiseDetails[key].deviceId,
            deviceName: deviceIdWiseDetails[key].hostName,
            hostIP: deviceIdWiseDetails[key].hostIp
        }
    })

    return (
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="max-w-[80vw] bg-background">
                    <DialogHeader>
                        <DialogTitle>Device List</DialogTitle>
                    </DialogHeader>

                    <div className="min-h-96">
                        <Accordion type="single" collapsible className="w-full">
                            {
                                subCommandDetailsWithDeviceSelection.map(obj=>{
                                    return (
                                    <AccordionItem key={obj.eachCommandId} value={obj.commandName}>
                                        <AccordionTrigger>{obj.commandName}</AccordionTrigger>

                                        {
                                            deviceHostWiseIpDetails.map((device)=>{
                                                return (
                                                    <AccordionContent key={device.deviceId}>
                                                        <div>
                                                            <Checkbox 
                                                                id={device.deviceId}
                                                                checked={selected[obj.eachCommandId] === device.deviceId} 
                                                                onCheckedChange={()=>{handleChange(obj.eachCommandId, device.deviceId, setSelected)}}
                                                            />
                                                            <label
                                                                htmlFor={device.deviceId}
                                                                className="ms-2 text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                            >
                                                            {
                                                                `${device.deviceName} [${device.hostIP}]`
                                                            }
                                                            </label>
                                                        </div>
                                                    </AccordionContent>
                                                )
                                            })
                                            
                                        }
                                    </AccordionItem>)
                                })
                            }
                        </Accordion>
                    </div>    

                    <div className="flex justify-end">
                        <div>
                            <IconButtonWithTooltip type="button" onClick={()=>{onSubmit(commandId, selected, subCommandDetails, deviceIdWiseDetails, close, savedScheduledInfo, selectedDevices)}} tooltipContent="save"><Save /> Save</IconButtonWithTooltip>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}