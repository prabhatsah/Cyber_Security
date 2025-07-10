import uaImage from '../../assets/ua.png';

import { Clock2, Ellipsis, EyeIcon, LayoutDashboard, Pause, Play, Tv } from 'lucide-react';
import Image from "next/image";
import CustomHoverCard from './CustomHoverCard';
import { Button } from '@/shadcn/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shadcn/ui/dropdown-menu';
import { IconTextButton } from '@/ikon/components/buttons';
import { getMyInstancesV2, invokeAction } from '@/ikon/utils/api/processRuntimeService';
export default function upcomingActivitiesTemplate({
    commandId_,
    commandName,
    commandExecutionTime,
    devices,
    isSkipped
}: {
    commandId_: string;
    commandName: string;
    commandExecutionTime: string;
    devices: string[];
    isSkipped: boolean;
}) {

    // Format the commandExecutionTime to "DD-MM-YYYY"
    const date = new Date(commandExecutionTime);
    const day = String(date.getDate()).padStart(2, '0'); // Adds leading zero if day < 10
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    console.log(formattedDate);

    //formatted time

    const hours = String(date.getHours()).padStart(2, '0'); // Adds leading zero if hours < 10
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Adds leading zero if minutes < 10
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Adds leading zero if seconds < 10

    const formattedTime = `${hours}:${minutes}:${seconds}`;
    console.log(formattedTime);


    //utils
    const pauseExecution = (commandId_: string, deviceIds_: string[]) => {
        const commandId = commandId_;
        const deviceIds = deviceIds_;


        const propObj = {
            processName: 'Command Execution Skip Storage',
            predefinedFilter: { taskName: "Skip Store" },

            processFilter: {
                commandId: commandId
            },
        };



        getMyInstancesV2({
            processName: propObj.processName,

            predefinedFilters: propObj.predefinedFilter,
            processVariableFilters: propObj.processFilter,


        }).then((instances) => {
            if (instances.length) {




                getMyInstancesV2({
                    processName: "Command Device schedule association",

                    predefinedFilters: {
                        taskName: "Command Device Association"
                    },
                    processVariableFilters: {
                        commandId: commandId
                    },
                }).then((instances2) => {


                    if (instances2.length) {




                        instances.forEach((obj) => {
                            const instance1TaskID = obj.taskId;

                            obj.data.skipExecution = true;

                            invokeAction({
                                taskId: instance1TaskID,
                                transitionName: "Update Skip Store",
                                data: obj.data,

                            })


                        });

                        instances2.forEach((obj) => {
                            const instance2TaskID = obj.taskId;

                            obj.data.skipped = true;

                            invokeAction({
                                taskId: instance2TaskID,
                                transitionName: "Update Assocation",
                                data: obj.data,

                            });
                        });







                    }
                })


            }
        })

    }

    const resumeExecution = (commandId_: string, devices: string[]) => {
        const commandId = commandId_;
        const deviceIds = devices;

        const propObj = {
            processName: 'Command Execution Skip Storage',
            predefinedFilter: { taskName: "Skip Store" },
            mongoSearch: null,
            processFilter: {
                commandId: commandId
            },
        };

        // Fetch instances for "Command Execution Skip Storage"
        getMyInstancesV2({
            processName: propObj.processName,
            predefinedFilters: propObj.predefinedFilter,
            processVariableFilters: propObj.processFilter,
        }).then((instances) => {
            if (instances.length) {

                // Fetch instances for "Command Device schedule association"
                getMyInstancesV2({
                    processName: "Command Device schedule association",
                    predefinedFilters: { taskName: "Command Device Association" },
                    processVariableFilters: { commandId: commandId },
                }).then((instances2) => {

                    if (instances2.length) {

                        // Update instances for "Command Execution Skip Storage"
                        instances.forEach((obj) => {
                            const instance1TaskID = obj.taskId;
                            obj.data.skipExecution = false; // Setting skipExecution to false

                            // Invoke the action to update "Skip Store"
                            invokeAction({
                                taskId: instance1TaskID,
                                transitionName: "Update Skip Store",
                                data: obj.data,
                            });
                        });

                        // Update instances for "Command Device schedule association"
                        instances2.forEach((obj) => {
                            const instance2TaskID = obj.taskId;
                            obj.data.skipped = false; // Setting skipped to false

                            // Invoke the action to update "Assocation"
                            invokeAction({
                                taskId: instance2TaskID,
                                transitionName: "Update Assocation",
                                data: obj.data,
                            });
                        });

                    }
                }).catch((error) => {
                    console.log("Error fetching instances2:", error);
                });
            }
        }).catch((err) => {
            console.error("Error fetching instances:", err);
        });
    }




    return (
        <div className='h-[30%] flex'>
            <div className='flex flex-col gap-2 w-[35%]'>
                <div className='flex'><LayoutDashboard className='mr-2' /> {!commandExecutionTime ? "N/A" : formattedDate}</div>
                <div className='flex'><Clock2 className='mr-2' /> {!commandExecutionTime ? "N/A" : formattedTime}</div>
            </div>
            <div className='w-[25%]' >
                <Image src={uaImage} alt={'Upcoming Activities Image..'} width={90} height={150} />
            </div>
            <div className='flex flex-col gap-2 w-[30%]'>
                <div>
                    <h3> Command Name : {!commandName ? "N/A" : commandName} </h3>
                </div>
                <div className='flex'>

                    <Tv className='mr-2' /> <CustomHoverCard content={devices}><Button>{devices.length ? devices.length : "N/A"}</Button></CustomHoverCard>
                </div>

            </div>
            <div className='flex p-2 w-[10%] justify-center items-center'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <IconTextButton variant="ghost" size="icon" className='opacity-50'>
                            <Ellipsis />
                        </IconTextButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            {isSkipped ? <span onClick={() => {
                                resumeExecution(commandId, devices);
                            }}
                            ><Play className="mr-2 h-4 w-4" />Resume Execution</span> :
                                <span onClick={() => {
                                    pauseExecution(commandId, devices);
                                }}><Pause className="mr-2 h-4 w-4" /> Pause Execution</span>
                            }
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )

}

        
