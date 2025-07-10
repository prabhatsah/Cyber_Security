import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { Eye, FileLock, Save, Ticket, Trash2 } from "lucide-react";
import { useForm } from 'react-hook-form';
import { object, z } from 'zod';
import { CredentialType } from "../type";
import FormInput from "@/ikon/components/form-fields/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef } from "react";

import { Form } from "@/shadcn/ui/form";
import { Button } from "@/shadcn/ui/button";

import FormComboboxInput from "@/ikon/components/form-fields/combobox-input"

import { getProfileData } from "@/ikon/utils/actions/auth";
import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { useGlobalCred } from "../actions/context/credContext";


type CredViewProps = {
    credentialData: any
    type: CredentialType;
    ref: React.RefObject<null>;
    
  };



  const CredView = forwardRef<HTMLButtonElement, CredViewProps>(
    ({ credentialData, type }, ref) => {
    debugger
    // const CredTypeWiseSchemaKeys = {
    //     'Parameter': parameterSchemaObject,
    //     'SSH': sshSchemaObject,
    //     'SNMP': snmpSchemaObject,
    //     'Windows': winSchemaObject
    // }
    
    // const currentSchemaObject = CredTypeWiseSchemaKeys[type]

    

    //windows schema
    // const winSchemaObject = {

    //     credentialName: z.string(),
    //     userName: z.string(),
    //     password: z.string(),

    // }

    const {globalCredData,updatedCreds,setGlobalCredData} = useGlobalCred() // using context to get data of all credentials


    const winSchemaKeys = ['credentialName','userName','password']
    

    //SSH Schema
    // const sshSchemaObject = {
    //     credentialName: z.string(),
    //     userName: z.string(),
    //     port: z.number(),
    //     password: z.string(),
    // }
    const sshSchemaKeys = ['credentialName','userName','password','port']
    

    //SNMP Schema
    // const snmpSchemaObject = {
    //     credentialName: z.string(),
    //     port: z.string(),
    //     version: z.string(),
    //     communityString: z.string(),
    // }
    const snmpSchemaKeys = ['credentialName','version','communityString','port']
    

    //Parameter Credential Schema
    // const parameterSchemaObject = {
    //     credentialName: z.string(),
    //     key: z.string(),
    //     value: z.string(),
    //     selectValueType: z.string(),
    // }
    const parameterSchemaKeys = ['credentialName','key','value','selectValueType']
    

    const TypeWiseCredentialStorage = {
        'Windows': 'Windows Credential Directory',
        'SNMP': 'SNMP Community Credential Directory',
        'SSH': 'SSH Credential Directory',
        'Parameter': 'Parameter Credential Directory'
    }
    

    let currentCredentialSchema = {}


    let defaultValueObjectfrCurrentSchema = {}

    switch (type) {
        case 'Windows': 

            credentialData.forEach((eachCredentialdata: any) => {
                winSchemaKeys.forEach((eachKey: string) => {
                    currentCredentialSchema = {...currentCredentialSchema,[eachKey + '_' + eachCredentialdata.credentialId]:z.string()}
                    defaultValueObjectfrCurrentSchema = { ...defaultValueObjectfrCurrentSchema, [eachKey + '_' + eachCredentialdata.credentialId]: eachCredentialdata[eachKey] }
                })
            })
            break


        case 'SSH':
            credentialData.forEach((eachCredentialdata: any) => {
                
                sshSchemaKeys.forEach((eachKey: string) => {
                    currentCredentialSchema = {...currentCredentialSchema,[eachKey + '_' + eachCredentialdata.credentialId]:eachKey!='port'?z.string():z.number()}
                    defaultValueObjectfrCurrentSchema = { ...defaultValueObjectfrCurrentSchema, [eachKey + '_' + eachCredentialdata.credentialId]: eachCredentialdata[eachKey] }
                })
            })
            break

        case 'SNMP':
            credentialData.forEach((eachCredentialdata: any) => {
                snmpSchemaKeys.forEach((eachKey: string) => {
                    currentCredentialSchema = {...currentCredentialSchema,[eachKey + '_' + eachCredentialdata.credentialId]:eachKey!='port'?z.string():z.number()}
                    defaultValueObjectfrCurrentSchema = { ...defaultValueObjectfrCurrentSchema, [eachKey + '_' + eachCredentialdata.credentialId]: eachCredentialdata[eachKey] }
                })
            })
            break

        case 'Parameter':
            credentialData.forEach((eachCredentialdata: any) => {
                currentCredentialSchema = {...currentCredentialSchema,['credentilaName_' + eachCredentialdata.credentialId]:z.string()}
                defaultValueObjectfrCurrentSchema = { ...defaultValueObjectfrCurrentSchema, [ 'credentialName_' + eachCredentialdata.credentialId]: eachCredentialdata['credentialName']}
                eachCredentialdata.ApiCredProperties.forEach((eachApiCredProperty: any) => {
                    
                    parameterSchemaKeys.forEach((eachKey: string) => {
                        currentCredentialSchema = {...currentCredentialSchema,[eachKey + '_' + eachCredentialdata.credentialId+ "_" + eachApiCredProperty.uniqueIdForInput]:eachKey!='version'?z.string():z.number()}
                        
                        defaultValueObjectfrCurrentSchema = { ...defaultValueObjectfrCurrentSchema, [eachKey + '_' + eachCredentialdata.credentialId + "_" + eachApiCredProperty.uniqueIdForInput]: eachApiCredProperty[eachKey]                     }
                    })
                })
                    
               
            })
            console.log(defaultValueObjectfrCurrentSchema)
            break


    }
    
    const schema = z.object(currentCredentialSchema)


    
    

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: defaultValueObjectfrCurrentSchema,
    });

    async function saveCredential(values: z.infer<typeof schema>) {
        
        debugger
        
        const profileData = await getProfileData() //getting profile data

        // const updatedCredentialData = credentialData.filter((e:any)=>
        //     e.added
        // ).map((credentialData: any) => {
        //     const credentialId = credentialData.credentialId;

        //     // Collecting form data from the values object
        //     const credentialName = values[`credentialName_${credentialId}`];
        //     const userName = values[`userName_${credentialId}`];
        //     const password = values[`password_${credentialId}`];

        //     // Set the other fields
        //     return {
        //         credentialId: credentialId.toString(),
        //         credentialType: type,
        //         credentialName: credentialName,
        //         userName: userName,
        //         password: password,
        //         createdOn: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
        //         updatedOn: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                
        //         clientAccess: profileData.USER_ID, 
        //     };
        // });
    
    
    
        
        //updating credentials
        updatedCreds.forEach(async (type:string)=>{
            const processId = await mapProcessName({
                processName: TypeWiseCredentialStorage[type]
            })
            updatedCredentialData.forEach((eachUpdatedCreddata:any)=>{
                startProcessV2({
                    processId: processId,
                    data:globalCredData[type],
                    processIdentifierFields:"clientId,credentialId"
                    
            
                })
            })
        })
        
    

    }
   
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(saveCredential)}>
                <div className="w-full">
                    {credentialData.map((credentialData: any, index: number) => {
                        return <div key={index}>
                            <div className="flex items-end shadow-sm p-2 space-x-2 w-full border rounded-md mb-2">

                                <div className="w-1/2">

                                    <FormInput label={`Credential Name`} disabled={!!credentialData.credentialName} name={`credentialName_${credentialData.credentialId}`} formControl={form.control} onChange={(e)=>{
                                        let currentTypeWiseCredData = globalCredData[type]
                                        currentTypeWiseCredData = currentTypeWiseCredData.map(e=>{
                                            if(e.credentialId === credentialData.credentialId)
                                                credentialData.credentialName = e.target.value
                                        })
                                        return currentTypeWiseCredData

                                    }} />

                                </div>

                                <div className="w-1/2 items-start h-[36px]">

                                    <IconTextButtonWithTooltip className="mx-2 p-2" tooltipContent={`Delete Credential`}><Trash2 /></IconTextButtonWithTooltip>

                                    <IconTextButtonWithTooltip className=" p-2" tooltipContent={`User Access`}><FileLock /></IconTextButtonWithTooltip>

                                </div>

                            </div>
                            <div className={'flex items-end rounded-md shadow-sm p-2 space-x-2 w-full border mb-2'}>

                                {
                                    type == 'SSH' && (
                                        <div className="w-1/4">

                                            <FormInput disabled={!!credentialData.port} label={`SSH Port`} name={`port_${credentialData.credentialId}`} formControl={form.control} 
                                                onChange={(e) => {
                                                    let currentTypeWiseCredData = globalCredData[type]
                                                    currentTypeWiseCredData = currentTypeWiseCredData.map(e => {
                                                        if (e.credentialId === credentialData.credentialId)
                                                            credentialData.port = e.target.value
                                                    })
                                                    return currentTypeWiseCredData
                                                }}
                                            />

                                        </div>

                                    )
                                }
                                {
                                    type == 'SNMP' && (
                                        <div className="w-1/4">

                                            <FormInput label={`SNMP Port`} disabled={!!credentialData.port} name={`port_${credentialData.credentialId}`} formControl={form.control}
                                            onChange={(e) => {
                                                let currentTypeWiseCredData = globalCredData[type]
                                                currentTypeWiseCredData = currentTypeWiseCredData.map(e => {
                                                    if (e.credentialId === credentialData.credentialId)
                                                        credentialData.port = e.target.value
                                                })
                                                return currentTypeWiseCredData
                                            }}
                                            />

                                        </div>

                                    )
                                }





                                {type !== 'Parameter' ? <>
                                    <div className="w-1/4">
                                        <FormInput label={type !== 'SNMP' ? 'username' : 'SNMP Version'} disabled={!!credentialData.userName} name={`userName_${credentialData.credentialId}`} formControl={form.control} />
                                    </div>

                                    <div className="w-1/4">
                                        <FormInput label={`Password`} disabled={!!credentialData.password} type="password" name={`password_${credentialData.credentialId}`} formControl={form.control} 
                                        onChange={(e) => {
                                            debugger
                                            let currentTypeWiseCredData = globalCredData[type]
                                            currentTypeWiseCredData = currentTypeWiseCredData.map(e => {
                                                if (e.credentialId === credentialData.credentialId)
                                                    credentialData.password = e.target.value
                                            })
                                            console.log(globalCredData)
                                            return currentTypeWiseCredData
                                        }}/>
                                    </div>
                                    <div className="w-1/4 h-[36px]">
                                        <IconTextButtonWithTooltip className="p-2" tooltipContent={`View Credential`}><Eye /></IconTextButtonWithTooltip>
                                    </div>

                                </>
                                    : <div className="w-full">{
                                        credentialData.
                                            ApiCredProperties
                                            .map((e: any, index: any) => {
                                                return <div className={'flex w-full mt-2 gap-2'} key={index}>

                                                    <div className="w-1/4">

                                                        <FormInput label={`Key`} disabled={!!e.key} name={`key_${credentialData.credentialId}_${e.uniqueIdForInput}`} formControl={form.control} />

                                                    </div>

                                                    <div className="w-1/4">

                                                        <FormInput label={`Value`} disabled={!!e.value} type={e.selectValueType} name={`value_${credentialData.credentialId}_${e.uniqueIdForInput}`} formControl={form.control} />

                                                    </div>

                                                    <div className="w-1/4">

                                                        <FormComboboxInput label={`Type`} disabled={!!e.selectValueType} name={`selectValueType_${credentialData.credentialId}_${e.uniqueIdForInput}`} formControl={form.control} items={[{value:'text',label:'Text',},{value:'password',label:'Password'}]} />

                                                    </div>

                                                    <div className="w-1/4 h-[65px] flex items-end">

                                                        <IconTextButtonWithTooltip className="p-2" tooltipContent={`View Credential`}><Eye /></IconTextButtonWithTooltip>

                                                    </div>

                                                </div>
                                            })
                                    }
                                    </div>}
                            </div>
                        </div>
                    })}


                </div>
                
                    
                    <Button type="submit" className="hidden" ref={ref} >Save</Button>
                
            </form>
        </Form>

    )

})

export default CredView

