'use client'

import { useState } from "react"
import CommandSchedule from "./Forms/CommandSchedule"
import { CommandDataType, CommandIdWiseDetailsType, DeviceConfigDataType, DeviceIdWiseDetailsType, UserCommandConfigType } from "../../types";
import CommandExecutionLogs from "./Forms/CommandExecutionLogs";
import CommandConfigure from "./Forms/CommandConfigure";

type TempclickDivProps = {
    commandIdWiseData: CommandIdWiseDetailsType;
    deviceIdWiseData: DeviceIdWiseDetailsType;
    deviceConfigData: DeviceConfigDataType[];
    commandsData: CommandDataType[];
    customCommandsData: UserCommandConfigType[];

    //scheduleIdWiseDetails: ScheduleWiseDetailsType;
}

export default function TempclickDiv({ deviceIdWiseData, commandIdWiseData, commandsData, deviceConfigData, customCommandsData}: TempclickDivProps){    
    const [isCommandScheduleVisible, setIsCommandScheduleVisible] = useState(false);
    const [isCommandExecutionLogsVisible, setIsCommandExecutionLogsVisible] = useState(false);
    const [isCommandConfigurationVisible, setIsCommandConfigurationVisible] = useState(false);

    return (
        <>
            <div className="bg-slate-500 h-[5%]">
                <button 
                    type="button" 
                    onClick={
                        ()=>{
                            setIsCommandScheduleVisible(true);
                        }
                    }
                >
                    Open Command Schedule
                </button>

                <button 
                    type="button" 
                    onClick={
                        ()=>{
                            setIsCommandExecutionLogsVisible(true)
                        }
                    }
                >
                    Open Command Execution Logs
                </button>

                <button 
                    type="button" 
                    onClick={
                        ()=>{
                            setIsCommandConfigurationVisible(true)
                        }
                    }
                >
                    Command Configure
                </button>
            </div>

            {
                isCommandScheduleVisible && (
                    <CommandSchedule open={isCommandScheduleVisible} close={()=>{setIsCommandScheduleVisible(false)}} deviceIdWiseData={deviceIdWiseData} commandIdWiseData={commandIdWiseData} />
                )
            }

            {
                isCommandExecutionLogsVisible && (
                    <CommandExecutionLogs open={isCommandExecutionLogsVisible} close={()=>{setIsCommandExecutionLogsVisible(false)}} deviceIdWiseData={deviceIdWiseData} />
                )
            }

            {
                isCommandConfigurationVisible && (
                    <CommandConfigure open={isCommandConfigurationVisible} close={()=>{setIsCommandConfigurationVisible(false)}} customCommandsData={customCommandsData} commandsData={commandsData} deviceConfigData={deviceConfigData} associatedNodeId={'4'} />
                )
            }
        </>
    )
}