'use client'
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormInput from "@/ikon/components/form-fields/input";
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";
import { Form } from "@/shadcn/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import {  useForm } from "react-hook-form";
import { z } from "zod";
import { forwardRef } from "react";
import { getMyInstancesV2, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { StartDryRunProps } from "../type";
import { useLowCodeNoCodeContext } from "../context/LowCodeNoCodeContext";
import { startDryRunMetrics, SubscribeToGetProbeDryRunLogs } from "../../utils/preloader_functions";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { v4 } from "uuid";
import { getCurrentSoftwareId } from "@/ikon/utils/actions/software";
import { Button } from "@/shadcn/ui/button";
import { toast } from "@/shadcn/hooks/use-toast";

const StartDryRunForm = forwardRef<HTMLButtonElement,StartDryRunProps & { closeRef?: React.RefObject<HTMLButtonElement> }>(({script,scriptType,closeRef},ref) => {
    debugger
    
    // const [IsvalidCode,setIsValidCode] = useState<boolean>(true)
    const [currentProtocol,setCurrentProtocol] = useState<'Snmp' | 'Ssh' | 'Windows'|''>('')
    const [devices,setDevies] = useState<Object[]>([])
    const [deviceTypes,setDeviceTypes] = useState<string[]>([])
    const [apiCreds,setAPICreds] = useState<object[]>([])

    //refs
    const globalAccountIdref = useRef(null)
    const initiatorRef = useRef(null)
    const softwareIdRef = useRef(null)
    //end refs

    //use context
    const {setDryRunId,setDryRunResult,setError,setDryRunSuccess} = useLowCodeNoCodeContext()
    //end use context

    //prompts
//     const unitsSystemPrompt = `Follow the given rules properly. Given a code for monitoring a device and the data recieved write the unit for each of output metrics. The code for monitoring is
// ##language##

// ##code##


// The output must be in json format. The keys should mimic that of the output value keys. The output is given bellow,

// ##output##`
//     const unitsUserPrompt = `Follow the given rules, make sure the output is valid json and same structure as the output provided. The value of each key should be the corresponding unit (use n/a if there is not any unit for this values for example hostname). Enclose the json output in json
//  <your_given_json>
//`

    //end
    const schema = z.object({
        metricesName:z.string().min(1,'Provide Service Metrices name'),
        monitoringProtocol: z.string().nonempty('Choose Monitoring protocol'),
        deviceTypes: z.array(z.string()).optional(),
        device: z.string().nonempty(),
        apiCredential:z.string().optional(),
        executionTarget:z.string().nonempty(),
        
    });

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {}
    });
    

    useEffect(() => {
        //fetch protocol , devices and their types
        debugger
        if(!globalAccountIdref.current)
            getActiveAccountId().then((globalAccountId)=>{
                debugger
                //setting global accountId to ref
                globalAccountIdref.current = globalAccountId

                //fetching devices
                getMyInstancesV2({
                    processName:'Configuration Item',
                    predefinedFilters:{taskName:"View CI Activity"},
                    processVariableFilters:{clientId:globalAccountId }
                }).then((res)=>{
                    //setting devices
                    debugger
                    setDevies(res.map(e => e.data))
                })
            })
        
            getProfileData().then((profile)=>{
                initiatorRef.current = profile.USER_ID
            })

            getMyInstancesV2({
                processName:'Parameter Credential Directory',
                predefinedFilters:{taskName:'View credential'},

            }).then((res:Object[])=>{
                setAPICreds(res.map(e => e.data))
            }).catch(()=>{

            })

            
            getCurrentSoftwareId().then((softwareId_)=> {
                softwareIdRef.current = softwareId_
            })
                

    }, []);

    async function StartDryRun(values: z.infer<typeof schema>) {
        debugger;
        var script_ 
        var isSNMPService = false
        if (currentProtocol === "Snmp") {
            script_ = {
                oid: script,
                fieldName: values.metricesName
            };
            isSNMPService = true;
        }

        
        
        const latestDryRunId = v4();
        setDryRunId(latestDryRunId)

        //closing modal on validation success

        closeRef?.current.click()

        toast({
            title: "Dry run started",
            description: "Wait for getting the results/logs",
        })

        startDryRunMetrics(
            globalAccountIdref.current,
            softwareIdRef.current,
            initiatorRef.current,
            scriptType ,
            values.device,
            globalAccountIdref.current ,
            values.metricesName, 
            latestDryRunId, 
            isSNMPService ? script_ : script, 
            isSNMPService, 
            
            "DryRun", 
            values.executionTarget, 
            values.apiCredential,
            (error:string[])=>{
                debugger
                setDryRunSuccess(false)
                setDryRunResult(null)
                setError(error)
            },
            (response:string)=>{
                debugger
                // if(response.result)
                    
                    // queryOpenAIDirect(
                    //     [	
                    //         {role:"system",content:unitsSystemPrompt.replace("##code##",script)
                    //          .replace("##language##",scriptType)
                    //          .replace("##output##",response)},
                    //         {role:"user",content:unitsUserPrompt}
                    //     ],
                    //     2048,
                    //     0.2,
                    //     (res)=>{
                            //Sucess callback
                            
                            setDryRunSuccess(true)

                            setDryRunResult(response)
                            
                            setError([])
                        // },
                        // ()=>{
                        //     //Failure callback
                        //     console.log('failure of quering openAI')
                        // },
                        // 0.0,
                        // "gpt-4o-mini"
                        // )
                
            }
        );
        
        
    }

    return (
        <>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(StartDryRun)}>
                <div className="w-full p-2 space-y-2">
                    <FormInput name={"metricesName"} formControl={form.control} label={'Service Metrices Name'}/>
                    <FormComboboxInput name={"monitoringProtocol"} items={[
                        {label:'WMI',value:'Windows'},
                        {label:'SSH',value:'Ssh'},
                        {label:'SNMP',value:'Snmp'}
                    ]
                    } formControl={form.control} placeholder={"Select Protocol"} 
                    onSelect={(value)=>{
                        //populate device type and devices accoring to device types
                        debugger
                        setCurrentProtocol(value)
                        setDeviceTypes([])

                    }}
                    />
                    <FormMultiComboboxInput name={"deviceTypes"} items={
                        devices.filter((e)=>
                            e.osType === (currentProtocol.toLowerCase() === 'windows' ? 'windows' : currentProtocol.toLowerCase() === 'snmp'? 'Snmp' : 'Ssh')
                        ).map(e=>{
                            return {
                                label: e.type,
                                value: e.type,
                            }
                        }).reduce((accumulator,currentValue)=>{
                            if(!accumulator.includes(JSON.stringify(currentValue)))
                                accumulator.push(JSON.stringify(currentValue))
                            return accumulator


                        },[]).map(e => JSON.parse(e))//removing duplicate entries
                    } formControl={form.control} placeholder="Select Device types" 
                    onSelect={(values)=>{
                        setDeviceTypes(values)
                    }}/>
                    <FormComboboxInput name={"device"} items={
                        devices.filter((e)=>
                            e.osType === (currentProtocol.toLowerCase() === 'windows' ? 'windows' : currentProtocol.toLowerCase() === 'snmp'? 'Snmp' : 'Ssh')
                            
                        ).filter(e=>
                            deviceTypes?deviceTypes.includes(e.type):true
                        ).map(e=>{
                            return {
                                label:e.hostName,
                                value:e.deviceId

                            }
                        })
                    } formControl={form.control} placeholder="Select Device" />

                    <FormComboboxInput name={"apiKeys"} items={
                        apiCreds.map((e)=>{
                            return {
                                label:e.credentialName,
                                value:e.credentialId
                            }
                        })
                    } formControl={form.control} placeholder="Select API keys"/>
                    <FormComboboxInput name={"executionTarget"} items={[
                        {label:'Target Device',value:'targetDevice'},
                        {label:'Probe Device',value:'probeDevice'}
                    ]} formControl={form.control} placeholder="Select Execution Target" />
                   
                </div>
                <Button type="submit" className="hidden" ref={ref}>save</Button>
            </form>
        </Form>
        </>
    );
});

export default StartDryRunForm;

