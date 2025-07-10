'use client'
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { probeManagementColumnDataType } from './type'
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Copy, Edit, Info, History, Ellipsis, Check, CircleOff, BadgeCheck, ThumbsUp, ThumbsDown, SquareUser, Download, CircleHelp, Plus, InfoIcon } from "lucide-react";
import { IconTextButton } from "@/ikon/components/buttons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import { useEffect, useState, useRef } from "react";
import { Switch } from "@/shadcn/ui/switch"; // Adjust the path if necessary
import { Label } from "@/shadcn/ui/label"; // Adjust the path if necessary
import { format } from "date-fns";
import Alert from "@/ikon/components/alert-dialog";
import { getMyInstancesV2, getParameterizedDataForTaskId } from "@/ikon/utils/api/processRuntimeService";
import CustomDialog from './components/CustomDialog'
import AdvanceDialog from "./components/AdvanceDialog";
import CreateEditProbeForm from "./components/CreateProbe";

import { toast } from "@/shadcn/hooks/use-toast";
import { Badge } from "@/shadcn/ui/badge";
import InstructionHistory from "./components/InstructionHistory";
import ProbeInfo from "./components/ProbeInfo";

interface probeDataStructure {
    ACTIVE: boolean
    IS_PLATFORM_PROBE: boolean
    LAST_HEARTBEAT: string | null
    PROBE_ID: string
    PROBE_NAME: string
    SOFTWARE_ID: string
    USER_ID: string
    USER_NAME: string
}
interface probe {
    PROBE_NAME: string
    PROBE_ID: string
    STATUS: boolean
}

export default function Probemanagement() {
    //states
    const [copied, setCopied] = useState<boolean>(false);
    const [alert, setAlert] = useState<boolean>(false)
    const [probeData, setProbeData] = useState<probeDataStructure[]>([])
    const [targetProbe, setTargetProbe] = useState<probe | null>(null)
    const [time, setTime] = useState<number>(0)
    const [open, setOpen] = useState<boolean>(false)
    const [open_, setOpen_] = useState<boolean>(false)
    const [open__,setOpen__] = useState<boolean>(false)
    const [showActiveProbes,setShowActiveProbes] = useState<boolean>(false)
    const [activeprobeData,setActiveProbeData] = useState<probeDataStructure[]>([])
    //end

    //custom functions
    const activateProbefn = (probeId: string, probename: string) => {
        debugger
        getMyInstancesV2({
            processName: 'Probe Management Process',
            predefinedFilters: { taskName: 'Activate/Deactivate Probe' }
        }).then((response) => {
            getParameterizedDataForTaskId({
                taskId: response[0].taskId,
                parameters: {
                    actionType: 'activate',
                    probeId: probeId

                }
            }).then(() => {
                toast({
                    title: "Success",
                    description: `${probename} activated successfully`
                })
            })
        })
    }
    const deactivateProbefn = (probeId: string, probename: string) => {
        debugger
        getMyInstancesV2({
            processName: 'Probe Management Process',
            predefinedFilters: { taskName: 'Activate/Deactivate Probe' }
        }).then((response) => {
            getParameterizedDataForTaskId({
                taskId: response[0].taskId,
                parameters: {
                    actionType: 'deactivate',
                    probeId: probeId

                }
            }).then(() => {
                toast({
                    title: "Success",
                    description: `${probename} deactivated successfully`
                })
            })
        })
    }
    //end

    useEffect(() => {

        //get probe details
        // getBaseSoftwareId().then((baseSoftware_ID)=>{
        //     getMyInstancesV2({
        //         processName:'Get All Probe Details for Current Account',
        //         predefinedFilters:{ taskName: 'Dashboard Query Activity' },
        //         softwareId:baseSoftware_ID
        //     }).then((res)=>{
        //         getParameterizedDataForTaskId({
        //             taskId:res[0].taskId,
        //             parameters:{

        //             }
        //         }).then((response)=>{
        //             //setting probe data
        //             setProbeData(response.probeDetails)
        //         })
        //     })
        // })

        getMyInstancesV2({
            processName: 'Probe Management Process',
            predefinedFilters: { taskName: 'View Probe' }
        }).then((response) => {
            debugger
            getParameterizedDataForTaskId({
                taskId: response[0].taskId,
                parameters: {


                }
            }).then((res) => {
                debugger
                setProbeData(res.probeDetails)
                setActiveProbeData(res.probeDetails.filter((item: probeDataStructure) => item.ACTIVE))

                //fetch probe status
                setTimeout(() => {
                    debugger
                    setTime((prev: number) => {
                        return prev + 10
                    })
                }, 10000)
            })
        })




    }, [time])


    //
    const modalCloseRef = useRef(null)
    const submitBtnRef = useRef(null)




    const probeManegementColumns: DTColumnsProps<probeManagementColumnDataType>[] = [
        {
            accessorKey: "PROBE_NAME",
            header: "Probe Name",

        },
        {
            accessorKey: "PROBE_ID",
            header: "Probe Id",
            cell: ({ row }) => {
                return <div className="gap-3">{row.getValue("PROBE_ID")} <IconButtonWithTooltip tooltipContent={'Copy to clipboard'}
                    onClick={() => {

                        navigator.clipboard.writeText(row.getValue('PROBE_ID'));
                        setCopied(true)
                        //after 1.5 seconds icon will change
                        setTimeout(() => {
                            setCopied(false)
                        }, 1500)
                    }}
                >
                    {!copied ? <Copy /> : <Check />}</IconButtonWithTooltip>
                </div>
            }

        },
        {
            accessorKey: "ACTIVE",
            header: "Status",
            cell: ({ row }) => {
                return <div>{row.getValue("ACTIVE") ? 'Active' : 'Inactive'}</div>
            }


        },
        {
            accessorKey: "USER_NAME",
            header: "User",
            cell: ({ row }) => {
                return (<div className="flex gap-2 items-center">
                    <SquareUser /> {row.getValue('USER_NAME')}
                </div>)
            }

        },
        {
            accessorKey: "LAST_HEARTBEAT",
            header: "Last Heartbeat",
            cell: ({ row }) => (
                <span>
                    {row.getValue('ACTIVE') && row.getValue('LAST_HEARTBEAT') && (new Date().getTime() - new Date(row.getValue('LAST_HEARTBEAT')).getTime() < 30000) ? (
                        <div className="flex gap-2 animate-pulse-3s items-center" >
                            <ThumbsUp color="#22d61f" /> {format(row.getValue('LAST_HEARTBEAT'), "yyyy-MM-dd' 'HH:mm:ss")}
                        </div>
                    ) : row.getValue('LAST_HEARTBEAT') ? (
                        <div className="flex gap-2 items-center">
                            <ThumbsDown color="#d61f1f" /> {format(row.getValue('LAST_HEARTBEAT'), "yyyy-MM-dd' 'HH:mm:ss")}
                        </div>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <ThumbsDown color="#d61f1f" />
                            NO HEARTBEAT
                        </div>
                    )}
                </span>

            ),

        },
        {
            accessorKey: "ACTIVE",
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
                            <DropdownMenuItem>

                                <div className="flex gap-2 items-center w-full" onClick={() => {
                                    setOpen(true)
                                    setTargetProbe({
                                        PROBE_ID: row.getValue('PROBE_ID'),
                                        PROBE_NAME: row.getValue('PROBE_NAME'),
                                        STATUS: row.getValue('ACTIVE')
                                    })
                                }
                                }><Edit /> Edit</div>

                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                setOpen_(true)
                                setTargetProbe({
                                    PROBE_ID: row.getValue('PROBE_ID'),
                                    PROBE_NAME: row.getValue('PROBE_NAME'),
                                    STATUS: row.getValue('ACTIVE')
                                })
                            }}>
                                <div className="flex gap-2 items-center"><History /> Instruction History</div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                 setOpen__(true)
                                setTargetProbe({
                                    PROBE_ID: row.getValue('PROBE_ID'),
                                    PROBE_NAME: row.getValue('PROBE_NAME'),
                                    STATUS: row.getValue('ACTIVE')
                                })
                            }}>
                                <div className="flex gap-2 items-center"><Info /> View Information</div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                               
                                setTargetProbe({
                                    PROBE_ID: row.getValue('PROBE_ID'),
                                    PROBE_NAME: row.getValue('PROBE_NAME'),
                                    STATUS: row.getValue('ACTIVE')
                                })
                                setAlert(true)
                            }}>
                                <div className="flex gap-2 items-center">
                                    {
                                        row.getValue('ACTIVE') ? <><CircleOff />Deactivate Probe </> : <><BadgeCheck />Activate Probe</>
                                    }
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>

                    </DropdownMenu>
                </span>

            ),

        },
    ]

    const CreateProbeInfo = () => {
        return (<>
            <Badge variant={"info"}>
                <InfoIcon />Make sure you have installed the probe and set it up on the target machine.
            </Badge>
        </>)
    }

    const ext: DTExtraParamsProps = {

        pageSize: 10,
        extraTools:
            [
                <>
                    <div className="flex items-center space-x-2">
                        <Switch id="airplane-mode" defaultChecked={false} onCheckedChange={()=>{
                            // setProbeData((prev:probeDataStructure[])=>{
                            //     return prev.filter((item:probeDataStructure)=>item.ACTIVE
                                    
                            //     )
                            // })
                            setShowActiveProbes((prev:boolean)=>!prev)
                        }} />
                        <Label htmlFor="airplane-mode">{showActiveProbes?`Active Probes`:`All Probes`}</Label>
                    </div>
                </>,
                <CustomDialog title={'Create Probe'} content={<CreateEditProbeForm action="create" closeRef={modalCloseRef} ref={submitBtnRef} />}
                    description={
                        <CreateProbeInfo />
                    }
                    closeRef={modalCloseRef}
                    ref={submitBtnRef}
                >
                    <IconButtonWithTooltip tooltipContent={'Create Probe'}>
                        <Plus />
                    </IconButtonWithTooltip>
                </CustomDialog>,
                <IconButtonWithTooltip tooltipContent={'Download the help file (pdf)'}
                    onClick={() => {
                        window.open(encodeURI(process.env.IKON_BASE_URL + 'portal/uaresource' + '/SSD/IKON Probe - Documentation.pdf'));

                    }}
                ><CircleHelp /></IconButtonWithTooltip>,
                <IconButtonWithTooltip tooltipContent={'Download the Probe Installer (exe)'}
                    onClick={() => {

                        window.open(encodeURI(process.env.IKON_BASE_URL + 'portal/uaresource' + '/SSD/Probe Setup.exe'));
                    }}
                ><Download /></IconButtonWithTooltip>,

            ]

    }

    return (<div className="h-[72vh]">
        {alert ?
            <Alert title={`Are you sure you want to ${targetProbe?.STATUS ? 'Deactivate' : 'Activate'} ${targetProbe?.PROBE_NAME}`}
                cancelText="Cancel"
                confirmText="Ok"
                onConfirm={() => {
                    targetProbe?.STATUS ?
                        deactivateProbefn(targetProbe.PROBE_ID, targetProbe.PROBE_NAME) :
                        activateProbefn(targetProbe.PROBE_ID, targetProbe.PROBE_NAME)

                    //setting alert to false
                    setAlert(false)
                    setTargetProbe(null)
                }
                }

                onCancel={() => {
                    setTargetProbe(null)
                    //setting alert to false
                    setAlert(false)
                }}

            /> : null}
        {/*dialog for edit probe */}
        <AdvanceDialog title={'Edit Probe'} content={<CreateEditProbeForm action="edit" probeId={targetProbe?.PROBE_ID} probeName={targetProbe?.PROBE_NAME} closeRef={modalCloseRef} ref={submitBtnRef} />}
            ref={submitBtnRef}
            openState={open}
            onOpenChange={setOpen}
            closeRef={modalCloseRef} />

        {/*dialog for Instruction History */}
        <AdvanceDialog width={800} title={'Instruction History'} content={
            <InstructionHistory probeId={targetProbe?.PROBE_ID} />
        }
            openState={open_}
            onOpenChange={setOpen_} />

        {/*dialog for view probe info */}
        {
            <AdvanceDialog width={800} title={'Probe Information'} content={
                <ProbeInfo probeId={targetProbe?.PROBE_ID || ""} probeName_={targetProbe?.PROBE_NAME || ""} />
            }
                openState={open__}
                onOpenChange={setOpen__} />
        }


        <DataTable
            data={showActiveProbes?activeprobeData:probeData}
            columns={probeManegementColumns}
            extraParams={ext}
        />

    </div>)
}