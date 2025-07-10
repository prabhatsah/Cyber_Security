import { Tooltip } from "@/ikon/components/tooltip";
import { IconTextButton, IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { Layers } from "lucide-react";
import { useDiscovery } from "./context/DiscoveryContext";
import { useState } from "react";
import  Alert  from "@/ikon/components/alert-dialog"


export default function ProbeLog(){
    const {discoveryStarted} = useDiscovery()
    const [getProbeLog,setProbeLog] = useState<boolean>(false)
    debugger
    return (
        <>
            {!discoveryStarted && getProbeLog && <Alert confirmText="Ok" title={"Please Start Discovery To see Probe Logs"} onConfirm={()=>{
                setProbeLog(false)
            }}  />}
            <IconTextButtonWithTooltip tooltipContent={"Probe Log"} onClick={()=>{
                debugger
                setProbeLog(true)
            }}>
                <Layers/>
            </IconTextButtonWithTooltip>

        </>
    )
}