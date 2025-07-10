import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

import { CredentialType, DeviceModalEditFormProps, ProfileDataType } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Separator } from "@/shadcn/ui/separator";
import { TextButtonWithTooltip } from "@/ikon/components/buttons";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import FormInput from "@/ikon/components/form-fields/input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { Form } from "@/shadcn/ui/form";
import { RotateCw } from "lucide-react";


import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";

type paramsType = {
    deviceId: string,
    taskId: string,
    clientId: string,
    deviceCredentialID: string,
    profile: ProfileDataType,
    
    city: string | null,
    state: string | null,
    location : string,
    country: string | null,
    assignedRoles: string | null
}

type CredentialSelectType = {
    label: string;
    value: string;
};

// Define the regular expression for IP address validation
const ipRegex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
// Define the regular expression for MAC address validation
//const macRegex = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/
const macRegex = /(?:[0-9A-Fa-f]{2}([-:]))(?:[0-9A-Fa-f]{2}\1){4}[0-9A-Fa-f]{2}|[0-9A-Fa-f]{12}|[0-9A-Fa-f]{4}\.[0-9A-Fa-f]{4}\.[0-9A-Fa-f]{4}/g;
const formSchema = z.object({
    hostName: z.string().min(2, {
        message: "Hostname is required",
    }),
    hostIp: z.string().regex(ipRegex, { message: "Invalid IP address format" }),
    shortCode: z.string().min(2, {
        message: "Shortcode is required",
    }),
    assetTag: z.string().min(2, {
        message: "Asset tag is required",
    }),
    classification: z.string().min(2, {
        message: "Classification is required",
    }),
    deviceType: z.string().min(2, {
        message: "Device type is required",
    }),
    os: z.string().min(2, {
        message: "Operating system is required",
    }),
    macAddress: z.string().regex(macRegex, { message: "Invalid MAC address format" }),
    dryRun: z.string().optional(),
    probe: z.string().min(1, {
        message: "Probe is required",
    }),
    description: z.string().optional(),
    protocol: z.string().min(2, {
        message: "Protocol is required",
    })
})

const onSubmit = async function(formValues: z.infer<typeof formSchema>, close: ()=>void, refresh:()=>void, params: paramsType){
    //console.log('FormValues: ', formValues);

    const formData = {
        hostName: formValues.hostName,
        hostIp: formValues.hostIp,
        shortCode: formValues.shortCode,
        assetTag: formValues.assetTag,
        description: formValues?.description,
        classification: formValues.classification,
        type: formValues.deviceType,
        os: formValues.os,
        macAddress: formValues.macAddress,
        probeId: formValues.probe,
        dryRunAccessable: formValues.dryRun,

        deviceId: params.deviceId,
        clientId: params.clientId, 
        editFlag: true,
        accountable: {
            userName: params.profile.USER_NAME,
            userId: params.profile.USER_ID 
        },
        assignedRoles: params.assignedRoles,
        city: params.city,
        country: params.country,
        osType: formValues.protocol,
        state: params.state,
        deviceCredentialID: params.deviceCredentialID,
        isDryRunEnabled: formValues.dryRun,
        location: params.location
    }

    //console.log('Formvalues: ', formValues);

    //console.log('Form Data: ', formData);

    //console.log('TaskId: ', params.taskId);
    

    await invokeAction({
        taskId: params.taskId,
        data: formData,
        transitionName: 'Update CI',
        processInstanceIdentifierField: "deviceId,clientId,probeId,hostName,hostIp"
    })

    //await getProfileData()

    close();
    refresh();
}

const getCredentialData = async function (processName: string, deviceCredentialId: string) {
  const credentialData = await getMyInstancesV2<CredentialType>({
    processName: processName,
    predefinedFilters: {
      taskName: "View credential",
    },
    processVariableFilters: {
        credentialId: deviceCredentialId
    }
  });

  //console.log('credential data: ', credentialData);

  return credentialData;
};

const handleProtocolChange = async function (protocol: string, deviceCredentialId: string, setCredentialData: Dispatch<SetStateAction<CredentialSelectType | undefined>>) {
    console.log('protocol: ', protocol);

    switch (protocol) {
      case "windows":
        await getWindowsCredentialData(setCredentialData, deviceCredentialId);
        break;

      case "Ssh":
        await getSSHCredentialData(setCredentialData, deviceCredentialId);
        break;

      case "snmp":
        await getSNMPCredentialData(setCredentialData, deviceCredentialId);
        break;
    }
  };

  const getWindowsCredentialData = async function (setCredentialData: Dispatch<SetStateAction<CredentialSelectType | undefined>>, deviceCredentialId: string) {
    const data = await getCredentialData("Windows Credential Directory", deviceCredentialId);

    //console.log('Windows credential data: ', data);

    const data1 = data.map((obj) => obj.data);

    setWindowsCredential(data1, setCredentialData);
  };

  const setWindowsCredential = function (data: CredentialType[], setCredentialData: Dispatch<SetStateAction<CredentialSelectType | undefined>>) {
    const selectData = data.map((obj) => ({
      value: obj.credentialId,
      label: obj.credentialName,
    }));

    //console.log("selectData: ",selectData);

    setCredentialData(selectData[0]);
  };

  const getSSHCredentialData = async function (setCredentialData: Dispatch<SetStateAction<CredentialSelectType | undefined>>, deviceCredentialId: string) {
    const data = await getCredentialData("SSH Credential Directory", deviceCredentialId);

    //console.log('Windows credential data: ', data);

    const data1 = data.map((obj) => obj.data);

    setSSHCredentialData(data1, setCredentialData);
  };

  const setSSHCredentialData = function (data: CredentialType[] , setCredentialData: Dispatch<SetStateAction<CredentialSelectType | undefined>>) {
    const selectData = data.map((obj) => ({
      value: obj.credentialId,
      label: obj.credentialName,
    }));

    console.log("selectData: ", selectData);

    setCredentialData(selectData[0]);
  };

  const getSNMPCredentialData = async function (setCredentialData: Dispatch<SetStateAction<CredentialSelectType | undefined>>, deviceCredentialId: string) {
    const data = await getCredentialData("SNMP Community Credential Directory", deviceCredentialId);

    //console.log('Windows credential data: ', data);

    const data1 = data.map((obj) => obj.data);

    setSNMPCredential(data1, setCredentialData);
  };

  const setSNMPCredential = function (data: CredentialType[], setCredentialData: Dispatch<SetStateAction<CredentialSelectType | undefined>>) {
    const selectData = data.map((obj) => ({
      value: obj.credentialId,
      label: obj.credentialName,
    }));

    //console.log("selectData: ",selectData);

    setCredentialData(selectData[0]);
  };

const DeviceModalEditForm : FC<DeviceModalEditFormProps> = ({open, close, refresh, deviceData, profile, probleIdWiseDetails}) => {
    const [credentialData, setCredentialData] = useState<CredentialSelectType>();

    // @ts-expect-error : ignore
    const deviceType = deviceData.data.osType;
    // @ts-expect-error : ignore
    const deviceCredentialId = deviceData.data.deviceCredentialID;

    useEffect(()=>{
        async function fetchData(){
            await handleProtocolChange(deviceType, deviceCredentialId, setCredentialData);
        }

        fetchData();

    }, [deviceType, deviceCredentialId])

    const param : paramsType = {
        /* @ts-expect-error : data hallucination */
        deviceId: deviceData.data.deviceId,
        taskId: deviceData.taskId,
        /* @ts-expect-error : data hallucination */
        clientId: deviceData.data.clientId,
        /* @ts-expect-error : data hallucination */
        deviceCredentialID: deviceData.data.deviceCredentialID,
        profile: profile,
        
        /* @ts-expect-error : data hallucination */
        location: deviceData.data.location,
        /* @ts-expect-error : data hallucination */
        state: deviceData.data.state,
        /* @ts-expect-error : data hallucination */
        country: deviceData.data.country,
        /* @ts-expect-error : data hallucination */
        city: deviceData.data.city,
         /* @ts-expect-error : data hallucination */
        assignedRoles: deviceData.data.assignedRoles
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            /* @ts-expect-error : data hallucination */ 
            hostName: deviceData.data.hostName,
            /* @ts-expect-error : data hallucination */
            hostIp: deviceData.data.hostIp,
            /* @ts-expect-error : data hallucination */
            shortCode: deviceData.data.shortCode,
            /* @ts-expect-error : data hallucination */
            assetTag: deviceData.data.assetTag,
            /* @ts-expect-error : data hallucination */
            classification: deviceData.data.classification,
            /* @ts-expect-error : data hallucination */
            deviceType: deviceData.data.type,
            /* @ts-expect-error : data hallucination */
            os: deviceData.data.os,
            /* @ts-expect-error : data hallucination */
            macAddress: deviceData.data.macAddress,
            /* @ts-expect-error : data hallucination */
            dryRun: deviceData.data.dryRunAccessable ? deviceData.data.dryRunAccessable : 'No',
            /* @ts-expect-error : data hallucination */
            probe: deviceData.data.probeId,
            /* @ts-expect-error : data hallucination */
            description: deviceData.data.description,
            /* @ts-expect-error : data hallucination */
            protocol: deviceData.data.osType
        }
    })
    
    const handleSelectChange = function(field: string, value: string){
        // @ts-expect-error : ignore following line
        form.setValue(field, value)
    }

    //console.log('device data inside deviceEditModal: ', deviceData);

    //console.log('formState: ', form.formState);

    useEffect(() => {
        // Trigger validation when the component mounts or when default values change
        form.trigger();
      }, [form]);

    return(
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Device Details</DialogTitle>
                    </DialogHeader>

                    <Separator />
                    
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit((val)=>{onSubmit(val, close, refresh, param)})}>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <FormInput 
                                    id="hostName" 
                                    name="hostName" 
                                    label={
                                        <>
                                            Host Name <span className="text-destructive">*</span>
                                        </>
                                    } 
                                    formControl={form.control} />
                                <FormInput 
                                    id="hostIp" 
                                    name="hostIp" 
                                    label={
                                        <>
                                          Host IP <span className="text-destructive">*</span>
                                        </>
                                      } 
                                    formControl={form.control} 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <FormInput 
                                    id="shortCode" 
                                    name="shortCode" 
                                    label={
                                        <>
                                          Short Code <span className="text-destructive">*</span>
                                        </>
                                      } 
                                    formControl={form.control} 
                                />
                                <FormInput 
                                    id="assetTag" 
                                    name="assetTag" 
                                    label={
                                        <>
                                          Asset Tag <span className="text-destructive">*</span>
                                        </>
                                      } 
                                    formControl={form.control} 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <FormInput 
                                    id="classification" 
                                    name="classification" 
                                    label={
                                        <>
                                          Classification <span className="text-destructive">*</span>
                                        </>
                                      } 
                                    formControl={form.control} 
                                />
                                
                                <div>
                                    <FormComboboxInput 
                                        name="deviceType" 
                                        label={
                                            <>
                                              Device Type <span className="text-destructive">*</span>
                                            </>
                                          }
                                        //onSelect={(value)=>{ handleSelectChange('deviceType', value as string) }} 
                                        formControl={form.control}
                                        placeholder="Select device type"
                                        disabled
                                        items={
                                            [
                                                {
                                                    // @ts-expect-error : data hallucination
                                                    value: deviceData.data.type, label: deviceData.data.type
                                                }
                                            ]
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div>
                                    <FormComboboxInput 
                                        name="os" 
                                        label={
                                            <>
                                              Operating System <span className="text-destructive">*</span>
                                            </>
                                          }
                                        //onSelect={(value)=>{ handleSelectChange('deviceType', value as string) }} 
                                        formControl={form.control}
                                        placeholder="Select os"
                                        disabled
                                        items={
                                            [
                                                {
                                                    // @ts-expect-error : data hallucination
                                                    value: deviceData.data.os, label: deviceData.data.os
                                                }
                                            ]
                                        }
                                    />
                                </div>
                                <div>
                                    
                                    <FormComboboxInput 
                                        name="protocol"
                                        label={
                                            <>
                                              Protocol <span className="text-destructive">*</span>
                                            </>
                                          }
                                        //onSelect={(value)=>{ handleSelectChange('deviceType', value as string) }} 
                                        formControl={form.control}
                                        placeholder="Select protocol"
                                        disabled
                                        items={
                                            [
                                                {
                                                    // @ts-expect-error : data hallucination
                                                    value: deviceData.data.osType, label: deviceData.data.osType
                                                }
                                            ]
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div>
                                    
                                    {/* <FormComboboxInput 
                                        name="credential" 
                                        label="Credential"
                                        //onSelect={(value)=>{ handleSelectChange('deviceType', value as string) }} 
                                        formControl={form.control}
                                        placeholder="Select credential"
                                        //disabled
                                        items={
                                            [
                                                credentialData ? credentialData : { value: 'credential1', label: 'credential' } 
                                            ]
                                        }
                                    /> */}

                                    
                                        
                                    <FormComboboxInput 
                                        name="credential" 
                                        label="Credential"
                                        //onSelect={(value)=>{ handleSelectChange('deviceType', value as string) }} 
                                        formControl={form.control}
                                        placeholder={ credentialData ? credentialData.label : "Select credential"}
                                        disabled
                                        items={
                                            credentialData ? (
                                                [credentialData]
                                            ) : (
                                                    [
                                                        { value: 'credential1', label: 'credential' } 
                                                    ]
                                                )
                                            
                                        }
                                    />
                                        
                                    
                                </div>
                                
                                <FormInput id="macAddress" name="macAddress" label="MAC Address" formControl={form.control} disabled />
                            </div>

                            <div className="grid grid-cols-2 3 mb-4">
                                <div className="overflow-hidden">
                                    
                                    <FormComboboxInput 
                                        name="probe" 
                                        label={
                                            <>
                                              Probe <span className="text-destructive">*</span>
                                            </>
                                          } 
                                        formControl={form.control}
                                        placeholder="Select probe"
                                        onSelect={(value)=>{ handleSelectChange('probe', value as string) }}
                                        items={
                                                probleIdWiseDetails ?  
                                                    Object.keys(probleIdWiseDetails).map(
                                                        (probeId)=>(
                                                            {
                                                                value: probeId, label: probleIdWiseDetails[probeId]
                                                            }
                                                        )
                                                    ) : []
                                        }
                                    />

                                </div>
                                <div>

                                    <FormComboboxInput 
                                        name="dryRun" 
                                        label={
                                            <>
                                              Dry Run Accessible <span className="text-destructive">*</span>
                                            </>
                                          }
                                        //onSelect={(value)=>{ handleSelectChange('deviceType', value as string) }} 
                                        formControl={form.control}
                                        placeholder="Select a option"
                                        items={
                                            [
                                                {
                                                    value: 'Yes', label: 'Yes'
                                                },
                                                {
                                                    value: 'No', label: 'No'
                                                }
                                            ]
                                        }
                                    />

                                </div>
                            </div>

                            <div className="grid mb-4">
                                <FormTextarea id="description" name="description" label="Description" formControl={form.control} />
                            </div>

                            <Separator />

                            <div className="flex justify-end mt-4">
                                <TextButtonWithTooltip disabled={!form.formState.isValid} type="submit" tooltipContent='Save device'>
                                    <RotateCw /> Update
                                </TextButtonWithTooltip>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DeviceModalEditForm;