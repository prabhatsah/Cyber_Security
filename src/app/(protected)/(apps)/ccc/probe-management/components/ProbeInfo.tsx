import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/shadcn/ui/form";
import FormInput from '@/ikon/components/form-fields/input';
import { useEffect, useState } from 'react';
import { checkProbeInfo } from '../../utils/preloader_functions';
import { Skeleton } from '@/shadcn/ui/skeleton';

interface ProbeInfoProps {

    probeId: string;
    probeName_:string
}

export default function ProbeInfo({

    probeId,
    probeName_

}: ProbeInfoProps) {

    const [probeName, setProbeName] = useState<string>(probeName_);
    const [hostName, setHostName] = useState<string>('NIL');
    const [hostIp, setHostIp] = useState<string>('NIL');
    const [connectionStatus, setConnectionStatus] = useState<string>('NIL');

    const [connectionEstablished, setConnectionEstablished] = useState<boolean>(false);


    useEffect(() => {
        
        checkProbeInfo(probeId,(probeInfo:{
            hostname: string
            ipAddress: string
            status: string
            })=>{
                setConnectionEstablished(true);
            if (probeInfo) {
                
                setHostName(probeInfo.hostname);
                setHostIp(probeInfo.ipAddress);
                setConnectionStatus(probeInfo.status);
            }
        })
    }, [])

    const schema = z.object({
        probeName: z.string(),
        probeId: z.string(),
        hostName: z.string(),
        hostIp: z.string(),
        connectionStatus: z.string(),

    });
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            
        }
    });
    return (
        <>
            <Form {...form}>
                <form>
                    {!connectionEstablished ?
                        <>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                            <div className="space-y-2 mt-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                            <div className="space-y-2 mt-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                            <div className="space-y-2 mt-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </> :
                        <>
                            <FormInput name={'probeName'} formControl={form.control} label={"Probe Name"} defaultValue={probeName} />
                            <FormInput name={'probeId'} formControl={form.control} label={"Probe Id"} defaultValue={probeId} />
                            <FormInput name={'hostName'} formControl={form.control} label={"Host Name"} defaultValue={hostName} />
                            <FormInput name={'hostIp'} formControl={form.control} label={"Host Ip"} defaultValue={hostIp} />
                            <FormInput name={'connectionStatus'} formControl={form.control} label={"Connection Status"} defaultValue={connectionStatus} />
                        </>}
                </form>
            </Form>
        </>
    )
}