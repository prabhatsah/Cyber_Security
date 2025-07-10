'use client'
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormInput from "@/ikon/components/form-fields/input";
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { Button } from "@/shadcn/ui/button";
import { Checkbox } from "@/shadcn/ui/checkbox"; // Adjust the path based on your project structure
import { Form } from "@/shadcn/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import {  useForm } from "react-hook-form";
import { z } from "zod";
import { forwardRef } from "react";
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { useLowCodeNoCodeContext } from "../context/LowCodeNoCodeContext";

import { getProfileData } from "@/ikon/utils/actions/auth";
import { getCurrentSoftwareId } from "@/ikon/utils/actions/software";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { UserDetailsProps } from "@/ikon/utils/actions/users/type";
import { toast } from "@/shadcn/hooks/use-toast";
import FormCheckbox from "../../../itsm/discoveredDevices/components/FormCheckBox";

interface saveMetricesProps{
    code:string,
    type:string,
}

const SaveServiceMetrices = forwardRef<HTMLButtonElement,saveMetricesProps>((props, ref) => {
    debugger
    //states 
    const [currentProtocol,setCurrentProtocol] = useState<'Snmp' | 'Ssh' | 'Windows'|''>('')
    const [authorisedPerons,setAuthorisedPerons] = useState<UserDetailsProps[]>([])
    const [tags,setTags] = useState<string[]>([])
    const [tokenNecessary,setTokenNecessary] = useState<boolean>(false)
    const [rootNecessary,setRootNecessary] = useState<boolean>(false)

    // const [devices,setDevies] = useState<Object[]>([])
    // const [deviceTypes,setDeviceTypes] = useState<string[]>([])
    // const [apiCreds,setAPICreds] = useState<object[]>([])
    //states end

    //refs 
    //const globalAccountIdref = useRef(null)
    // const ApiToHostAssociation = useRef<Record<string, string>>({})
    // const deviceIpWiseDeviceIdAssociation = useRef<Record<string, string>>({})

    const initiatorRef = useRef(null)
    //const softwareIdRef = useRef(null)
    //const currentAccountIdRef = useRef(null)

    //end
    //context 
    const {dryRunId} = useLowCodeNoCodeContext();

    const schema = z.object({
        commandName: z.string().min(1, 'Please Provide Commmand name'),
        commandDescription: z.string().min(1, 'Please Provide Command description'),
        monitoringProtocol: z.string().nonempty('Choose an Operating System'),
        tags: z.array(z.string()).optional(),
        authorisedPersons: z.array(z.string()).optional(),
        executionTarget: z.string().nonempty('Execution target can not be empty'),
        token: z.any().optional(),
        root: z.any().optional(),
    });

    

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {}
    });

    // useEffect(() => {
    //     form.watch((values) => {
    //         setTokenNecessary(values.token || false);
    //         setRootNecessary(values.root || false);
    //     });
    // }, [form.watch]);

    useEffect(() => {
            //fetch protocol , devices and their types
            // debugger
            // if(!globalAccountIdref.current)
            //      getActiveAccountId().then((globalAccountId)=>{
            debugger
                    //setting global accountId to ref
                    //globalAccountIdref.current = globalAccountId
                    //fetching devices
                    getMyInstancesV2({
                        processName:'Commands Metadata',
                        predefinedFilters:{taskName:"Protocol Metadata"},
                        
                    }).then((res)=>{
                        //setting devices
                        debugger
                        
                        const tags_ = res[0].data.tags
                        setTags(tags_)
                        //new
                        // devices.forEach(e=>{
                        //     deviceIpWiseDeviceIdAssociation.current[e.hostIp] = e.deviceId
                        // })
                        //
                    })
                //})
            
               getUserIdWiseUserDetailsMap().then((res) => {
                    const users_ = Object.values(res).map(user => user); // Adjust based on the actual structure of res
                    setAuthorisedPerons(users_);
               })
    
                // getMyInstancesV2({
                //     processName:'Api Credential Directory',
                //     predefinedFilters:{taskName:'View credential'},
    
                // }).then((res:Object[])=>{
                //     const data = res.map(e => e.data)
                //     setAPICreds(data)
                //     data.forEach(e=>{
                //         var apiKeyHost = e.ApiCredProperties.filter(credential => credential.key === 'host');
                //         ApiToHostAssociation.current[e.credentialId] = apiKeyHost[0].value;
                //     })
                // }).catch(()=>{
    
                // })
        //getting necessary details
        getProfileData().then((profile) => {
            initiatorRef.current = profile.USER_ID
        })
        // getActiveAccountId().then((accountId_) => {
        //     currentAccountIdRef.current = accountId_
        // })
        // getCurrentSoftwareId().then((softwareId_) => {
        //     softwareIdRef.current = softwareId_
        // })
        //end
    
               
                    
    
        }, []);

    async function saveServiceMetrices(values: z.infer<typeof schema>) {
        debugger;
        const catalogInstanceData = {
            commandId:dryRunId,
            commandName:values.commandName,
			commandDescription:values.commandDescription,
			commandProtocol:values.monitoringProtocol === 'wmi'? 'Windows': values.monitoringProtocol === 'Snmp' ||  values.monitoringProtocol === 'snmp' ? 'Snmp' : 'Ssh',
			source:'aiGenarated',
			script:props.code,
            updatedOn:format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            updatedBy:initiatorRef.current,
            createdOn:format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            createdBy:initiatorRef.current,
            tokensNecessary:values.token.length?true:false,
            rootNecessary:values.root.length?true:false,
            tagsSelector:values.tags,
            subType:props.type==='shell'?'bash':props.type,
            executionTarget:values.executionTarget,
            authorizedPersons:values.authorisedPersons
        }
        // const deviceIdtoApiIdAssociation: Record<string, string> = {};
        // values.apiKeys?.forEach(apiId => {
        //     const host = ApiToHostAssociation.current[apiId];
        //     if (host) {
        //         const deviceId = deviceIpWiseDeviceIdAssociation.current[host];
        //         if (deviceId) {
        //             deviceIdtoApiIdAssociation[deviceId] = apiId;
        //         }
        //     }
        // });
        
        mapProcessName({
            processName: 'Command Catalog'
        }).then((res) => {
            startProcessV2({
                processId: res,
                data: catalogInstanceData,
                processIdentifierFields: "commandId"
            }).then(()=>{
                debugger
                toast({
                    title:'Success',
                    description:`Command ${values.commandName} saved successfully`
                })
                // const target_probeId = devices.filter(e=>e.deviceId === values.devices)
                // const ApiId = deviceIdtoApiIdAssociation[values.devices]
                // const execution_target = values.executionTarget
                //start dry run 
                // startDryRunMetrics(
                //     globalAccountIdref.current,
                //     softwareIdRef.current,
                //     initiatorRef.current,
                //     scriptType,
                //     values.devices,
                //     globalAccountIdref.current,
                //     values.metricesName,
                //     dryRunId,
                //      props.code,
                //     values.monitoringProtocol ==='Snmp',
                //     target_probeId,
                //     catalogInstanceData.DryRunType,
                //     values.executionTarget,
                //     ApiId,
                //     ()=>{

                //     })
                //end of start dry run
                // if(ApiId)
                //     getMyInstancesV2({
                //         processName:'Api Credential Directory',
                //         predefinedFilters:{taskName:'Edit credential'},
                //         processVariableFilters:{
                //             credentialId: ApiId, 
                //             clientId: globalAccountIdref.current
                //         }
                //     }).then((responses)=>{
                //         if(responses.length){
                //             var { taskId, data } = responses[0][0];
                //             var currentService = catalogInstanceData.serviceId;

                //             if (data.associatedMetrics) {
                //                 data.associatedMetrics.push(currentService)
                //             }
                //             else {
                //                 data.associatedMetrics = [currentService]
                //             }
                //             invokeAction({
                //                 taskId:taskId,
                //                 transitionName:'Update Edit Credential',
                //                 data:data,
                //                 processInstanceIdentifierField:'clientId,credentialId'
                //             }).then(()=>{
                //                 console.log('Sucess in InvokeAction')
                //             }).catch(()=>{
                //                 console.log('Failure in InvokeAction')
                //             })
                //         }

                //     }).catch(()=>{

                //     })

            }).catch(()=>{

            });
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(saveServiceMetrices)}>
                <div className="w-full p-2 space-y-2">
                    <FormInput name={"commandName"} formControl={form.control} label={'Command Name'} />
                    <FormTextarea name={"commandDescription"} formControl={form.control} label={'Command Description'} />
                    <FormComboboxInput name={"monitoringProtocol"} items={[
                        
                            {label:'WMI',value:'Windows'},
                            {label:'SSH',value:'Ssh'},
                            {label:'SNMP',value:'Snmp'}
                        
                    ]} formControl={form.control} placeholder={"Select Operating System"}
                    onSelect={(value)=>{
                        //populate device type and devices accoring to device types
                        debugger
                        setCurrentProtocol(value)
                        //setDeviceTypes([])

                    }}
                     />
                     
                     <FormMultiComboboxInput
                        name={"tags"}
                        items={tags.map(e=>{
                            return {
                                label:e.tagName,
                                value:e.tagId,
                            }
                        })}
                        formControl={form.control}
                        placeholder="Select Tags"
                     />
                     
                    {/* <FormMultiComboboxInput name={"deviceTypes"} items={
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
                    } formControl={form.control} 
                    placeholder="Select Device types"
                    onSelect={(values)=>{
                        setDeviceTypes(values)
                    }}
                     />
                    <FormComboboxInput name={"devices"} items={
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
                    } formControl={form.control} placeholder="Select Device" /> */}
                    <div className="flex justify-between gap-3">
                       <FormCheckbox 
                           name="token" 
                           formControl={form.control} 
                           value={'token'}
                           onChange={(event)=>{
                            debugger
                            setTokenNecessary(event.target.checked)
                           }} 
                           label="Is Token Necessary"
                       />
                       <FormCheckbox 
                           name="root" 
                           formControl={form.control} 
                           value={'root'}
                           onChange={(event)=>{
                            debugger
                            setRootNecessary(event.target.hecked)
                           }} 
                           label="Is Root Necessary"
                       />
                    </div>
                    <FormMultiComboboxInput 
                        name={"authorisedPersons"} 
                        items={authorisedPerons.filter(e=>e.userActive).map(e=>{
                            return {
                                label:e.userName,
                                value:e.userId
                            }
                        })} 
                        formControl={form.control} 
                        placeholder="Select Authorized persons" 
                    />
                    <FormComboboxInput name={"executionTarget"} items={
                        [
                            {label:'Target Device',value:'targetDevice'},
                            {label:'Probe Device',value:'probeDevice'}
                        ]
                    } formControl={form.control} placeholder="Select Execution target" />
                    {/* <FormMultiComboboxInput name={"apiKeys"} items={
                        apiCreds.map((e)=>{
                            return {
                                label:e.credentialName,
                                value:e.credentialId
                            }
                        })
                    } formControl={form.control} placeholder="Select API keys" /> */}
                </div>
                <Button type="submit" className="hidden" ref={ref}>save</Button>
            </form>
        </Form>
    );
});

export default SaveServiceMetrices;

