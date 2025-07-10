import { FC, useEffect, useState } from "react";

import { DeviceModalEditFormProps, ProfileDataType } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Separator } from "@/shadcn/ui/separator";

import { TextButtonWithTooltip } from "@/ikon/components/buttons";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import FormInput from "@/ikon/components/form-fields/input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { Form } from "@/shadcn/ui/form";
import { FileBox, RotateCw } from "lucide-react";

import { invokeAction } from "@/ikon/utils/api/processRuntimeService";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { useGlobalContext } from "../../context/GlobalContext";
import { getRoleMap } from "../../utils/preloader_functions";
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";
import Choose3DModelSelection from "./Choose3DModelSelection";

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
    assignedRoles: string[] | null
    dryRunAccessable: string;
    modelId: string | undefined;
}

type CustomRoleType = {
    label: string;
    value: string;
}[]

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
    //dryRun: z.string().optional(),
    deviceModel: z.string().optional(),
    probe: z.string().min(1, {
        message: "Probe is required",
    }),
    description: z.string().optional(),
    protocol: z.string().min(2, {
        message: "Protocol is required",
    }),
    //groups: z.string().optional()
    groups: z.array(z.string()).optional()
})

const onSubmit = async function(formValues: z.infer<typeof formSchema>, close: ()=>void, refresh:()=>void, params: paramsType){
    console.log('FormValues: ', formValues);

    debugger;

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
        dryRunAccessable: params.dryRunAccessable,

        deviceId: params.deviceId,
        clientId: params.clientId, 
        editFlag: true,
        accountable: {
            userName: params.profile.USER_NAME,
            userId: params.profile.USER_ID 
        },
        assignedRoles: formValues.groups ? formValues.groups : params.assignedRoles,
        city: params.city,
        country: params.country,
        osType: formValues.protocol,
        state: params.state,
        deviceCredentialID: params.deviceCredentialID,
        //isDryRunEnabled: formValues.dryRun,
        modelId: formValues.deviceModel ? (formValues.deviceModel) : (params.modelId),
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

const DeviceModalEditForm : FC<DeviceModalEditFormProps> = ({open, close, refresh, taskId, deviceData, profile, probleIdWiseDetails}) => {
    const { CURRENT_SOFTWARE_ID } = useGlobalContext();
    
    console.log('device data in DeviceModalEditForm: ', deviceData);
    const [customGroupData, setCustomGroupData] = useState<CustomRoleType>([]);

    const [isSelectModelTypeVisible, setIsSelectModelTypeVisible] = useState(false);



    const param : paramsType = {
        deviceId: deviceData.deviceId,
        taskId: taskId,
        clientId: deviceData.clientId,
        deviceCredentialID: deviceData.deviceCredentialID,
        profile: profile,
        location: deviceData.location,
        state: deviceData.state,
        country: deviceData.country,
        city: deviceData.city,
        assignedRoles: deviceData.assignedRoles,
        dryRunAccessable: deviceData.dryRunAccessable ? deviceData.dryRunAccessable : '',
        modelId: deviceData.modelId
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            hostName: deviceData.hostName,
            hostIp: deviceData.hostIp,
            shortCode: deviceData.shortCode,
            assetTag: deviceData.assetTag,
            classification: deviceData.classification,
            deviceType: deviceData.type,
            os: deviceData.os ? deviceData.os : 'N/A',
            macAddress: deviceData.macAddress,
            //dryRun: deviceData.dryRunAccessable ? deviceData.dryRunAccessable : 'No',
            deviceModel: deviceData.modelId ? deviceData.modelId : 'No model selected',
            probe: deviceData.probeId,
            description: deviceData.description,
            protocol: deviceData.osType,
            //groups: deviceData.assignedRoles ? deviceData.assignedRoles : ['']
            groups: deviceData.assignedRoles ? deviceData.assignedRoles : ['']
        }
    })
    
    const handleSelectChange = function(field: string, value: string){
        // @ts-expect-error : ignore following line
        form.setValue(field, value)
    }

    console.log('device data inside deviceEditModal: ', deviceData);

    console.log('formState: ', form.formState);

    useEffect(() => {
        // Trigger validation when the component mounts or when default values change
        form.trigger();

        async function fetchData(){
            const roleData = await getRoleMap(CURRENT_SOFTWARE_ID);

            console.log('roleData: ', roleData);
        
            setCustomGroupData(roleData);
        }
        //const roleData = await getRoleMap(CURRENT_SOFTWARE_ID);
        
        //setCustomGroupData(roleData);

        //// Trigger validation when the component mounts or when default values change
        ////form.trigger();

        fetchData()
      }, [form, CURRENT_SOFTWARE_ID]);

    return(
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="min-w-[40rem]">
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
                                    disabled 
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
                                                    value: deviceData.type, label: deviceData.type
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
                                                    value: deviceData.os ? deviceData.os : '' , label: deviceData.os ? deviceData.os : ''
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
                                                    value: deviceData.osType, label: deviceData.osType
                                                }
                                            ]
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div>
                                    
                                    <FormComboboxInput 
                                        name="credential" 
                                        label="Credential"
                                        //onSelect={(value)=>{ handleSelectChange('deviceType', value as string) }} 
                                        formControl={form.control}
                                        placeholder="Select credential"
                                        disabled
                                        items={
                                            [
                                                {
                                                    value: 'credential1', label: 'credential'
                                                }
                                            ]
                                        }
                                    />
                                </div>
                                
                                <FormInput id="macAddress" name="macAddress" label="MAC Address" formControl={form.control} disabled />
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
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

                                    {/* <FormComboboxInput 
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
                                    /> */}

                                    <FormInput 
                                        name="deviceModel" 
                                        label={
                                            <>
                                              Device Model
                                            </>
                                          } 
                                        formControl={form.control}
                                        disabled
                                    />

                                </div>
                            </div>

                            <div className="grid mb-4">
                                <FormTextarea id="description" name="description" label="Description" formControl={form.control} />
                            </div>

                            <div className="grid">
                                <FormMultiComboboxInput 
                                    formControl={form.control}
                                    name="groups"
                                    label="Custom groups"
                                    items={customGroupData}
                                />
                            </div>

                            <Separator />

                            <div className="flex justify-end mt-4">
                                <TextButtonWithTooltip type="button" onClick={()=>{setIsSelectModelTypeVisible(true)}} tooltipContent="Manage Model">
                                   <FileBox /> Manage Model
                                </TextButtonWithTooltip>

                                <TextButtonWithTooltip className="ms-2" disabled={!form.formState.isValid} type="submit" tooltipContent='Save device'>
                                    <RotateCw /> Update
                                </TextButtonWithTooltip>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {
                isSelectModelTypeVisible && (
                    <Choose3DModelSelection open={isSelectModelTypeVisible} close={()=>{setIsSelectModelTypeVisible(false)}} modelId={deviceData.modelId}/>
                )
            }

            
        </>
    )
}

export default DeviceModalEditForm;