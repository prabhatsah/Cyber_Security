
import { useEffect, useState } from "react";
import IPRangeInput from "./IpRangeInput";
import { forwardRef } from 'react';
import { CredentialTableSchemaType } from '../type'
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { DataTable } from "@/ikon/components/data-table";
import { Card, CardContent, CardTitle } from "@/shadcn/ui/card";
import { getMyInstancesV2, getParameterizedDataForTaskId, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { Form } from "@/shadcn/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { IconTextButton } from "@/ikon/components/buttons";
import { Trash2 } from "lucide-react";
import FormInput from "@/ikon/components/form-fields/input";

import { subscribeToProcessEvents } from "@/ikon/utils/api/sockets";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getCurrentSoftwareId, getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { useDiscovery } from "../actions/context/DiscoveryContext";
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";


interface IPRange {
    start: string;
    end: string;
}

interface StartDiscoveryFormProps {
    IpRangeref: React.RefObject<HTMLButtonElement | null>;
    macDiscoveryRef: React.RefObject<HTMLButtonElement | null>;
    startDiscoveryRef: React.RefObject<HTMLButtonElement | null>;
}
interface MACsection {
    id: string;
    snmpPort: string;
    snmpVersion: string;
    communityString: string;
    routerIp: string;
}

const StartDiscoveryForm = forwardRef<HTMLFormElement, StartDiscoveryFormProps>((props, ref) => {
    const [ipRanges, setIpRanges] = useState<IPRange[]>([{ start: '', end: '' }]);
    const { IpRangeref, macDiscoveryRef, startDiscoveryRef } = props;
    const [windowsDatafetched, setWindowsDataFetched] = useState<boolean>(false)
    const [sshDatafetched, setSSHDataFetched] = useState<boolean>(false)
    const [snmpDatafetched, setSNMPDataFetched] = useState<boolean>(false)
    const [wincredData, setWinCredData] = useState<Object[]>([]
    )
    const[selectedCredentials,setSelectedCredentials] = useState<Object[]>([])  

    const [sshcredData, setSSHCredData] = useState<Object[]>([]
    )
    const [snmpcredData, setSNMPCredData] = useState<Object[]>([]
    )
    const [probeData, setProbeData] = useState<Object[]>([]
    )
    const [sections, setSections] = useState<MACsection[]>([]);


    const handleAddRange = () => {
        setIpRanges([...ipRanges, { start: '', end: '' }]);
    };

    const handleDeleteRange = (index: number) => {
        setIpRanges(ipRanges.filter((_, i) => i !== index));
    };

     //using context to update state
     const {setDiscoveryStarted,discoveryProgress,setDiscoveryProgress} = useDiscovery()
     

    const handleIPRangeChange = (index: number, value: IPRange) => {
        const newRanges = [...ipRanges];
        newRanges[index] = value;
        setIpRanges(newRanges);
    };
    const credentialTableColumns: DTColumnsProps<CredentialTableSchemaType>[] = [
        {
            accessorKey: "credentialName",
            header: "Credential Name",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("credentialName")}</div>
            ),
        },
    ]

    const ITSM_ROLES = [{ROLE_NAME:"Linux Admin",ROLE_VALUE:"itsm_linux_admin"},
        {ROLE_NAME:"Network Admin",ROLE_VALUE:"itsm_network_admin"},
        {ROLE_NAME:"Windows Admin",ROLE_VALUE:"itsm_windows_admin"}]

    const addSection = () => {
        const newSection: MACsection = {
            id: Math.random().toString(36).substring(7),
            snmpPort: '',
            snmpVersion: '',
            communityString: '',
            routerIp: '',
        };
        setSections([...sections, newSection]);
    };

    const deleteSection = (id: string) => {
        setSections(sections.filter(section => section.id !== id));
    };

    const updateSection = (id: string, field: keyof MACsection, value: string) => {
        setSections(sections.map(section =>
            section.id === id ? { ...section, [field]: value } : section
        ));
    };


   useEffect(() => {
    const fetchData = async () => {
        try {
            const softwareId = await getSoftwareIdByNameVersion("ITSM", "1");

            // Windows data
            getMyInstancesV2({
                softwareId,
                processName: 'Windows Credential Directory',
                predefinedFilters: { taskName: "View credential" }
            }).then((res) => {
                setWindowsDataFetched(true);
                const updatedData = res.map(e => ({ ...e.data }));
                setWinCredData(updatedData);
            }).catch((e) => {
                console.log(e);
            });

            // SSH Data
            getMyInstancesV2({
                softwareId,
                processName: 'SSH Credential Directory',
                predefinedFilters: { taskName: "View credential" }
            }).then((res) => {
                setSSHDataFetched(true);
                const updatedData = res.map(e => ({ ...e.data }));
                setSSHCredData(updatedData);
            }).catch((e) => {
                console.log(e);
            });

            // SNMP data
            getMyInstancesV2({
                softwareId,
                processName: 'SNMP Community Credential Directory',
                predefinedFilters: { taskName: "View credential" }
            }).then((res) => {
                setSNMPDataFetched(true);
                const updatedData = res.map(e => ({ ...e.data }));
                setSNMPCredData(updatedData);
            }).catch((e) => {
                console.log(e);
            });

            // Probe Management Process
            getMyInstancesV2({
                softwareId,
                processName: 'Probe Management Process',
                predefinedFilters: { taskName: "View Probe" }
            }).then((res) => {
                getParameterizedDataForTaskId({
                    taskId: res[0].taskId,
                    parameters: {},
                }).then((data) => {
                    setProbeData(data.probeDetails);
                }).catch((e) => {
                    console.log('Error in fetching probe data: ', e);
                });
            }).catch((e) => {
                console.log(e);
            });

        } catch (e) {
            console.log(e);
        }
    };

    fetchData();
}, []);

    const ext: DTExtraParamsProps = {
        pageSize: 5,
        checkBoxColumn: true,
        rowsPerPage: false,
        checkBoxColumnCallback: (selectedRows) => {
            
            setSelectedCredentials(selectedRows.map(eachRow=>eachRow.original))
        }




    }

    const schema = z.object({
        Role: z.array(z.string()).min(1, 'At least one role is required'),
        probeId: z.string().nonempty('Probe is required')
    });

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {

        },
    });

    async function startDiscovery(values: z.infer<typeof schema>) {
        debugger
       

        mapProcessName({processName:'Discovery-V2'}).then(async (processId)=>{
            debugger
            const currentAccountId = await getActiveAccountId()
            const currentSoftwareId = await getCurrentSoftwareId()

            //submitting discovery request
            startProcessV2({
                processId: processId,
                data: {...values,credentials:selectedCredentials,ipRanges:ipRanges.map(e=>{
                    return {
                        ipRangeStart:e.start,
                        ipRangeEnd:e.end
                    }
                }),assignedRoles:values.Role},
                processIdentifierFields: "probe"
            })
            setDiscoveryStarted(true)

            
            //subscribing to process events
            subscribeToProcessEvents({
                viewComponentId: 'discovery',
                accountId: currentAccountId,
                softwareId: currentSoftwareId,
                processId: processId,
                eventCallbackFunction: (event) => {
                    debugger
                    if (event.data.eventType === 'ProgressEvent') {
                        
                        setDiscoveryProgress({
                            ...discoveryProgress,
                            startingDiscovery:true,
                            deviceDiscoveryStarted:true
                            
                        })
                    }
                        

                    // if (event.data.discoveryStatus === 'Device Discovery Started' ||event.data.eventType === 'ProgressEvent' ) {
                    //     console.log('two')
                    //     setDiscoveryProgress({
                    //         ...discoveryProgress,
                    //         startingDiscovery:true,
                    //         deviceDiscoveryStarted:true
                    //     })
                    // }
                        

                     else if (event.data.eventType=== 'PartialDiscoveryEvent') {
                    //    console.log('three')
                        setDiscoveryProgress({
                            ...discoveryProgress,
                            // startingDiscovery:true,
                            // deviceDiscoveryStarted:true,
                            discoveringIPOnlyDevices:true
                        })
                    }
                        


                     else if (event.data.eventData === 'Discovery complete') {
                        console.log('four')
                        setDiscoveryProgress({
                            ...discoveryProgress,
                            // startingDiscovery:true,
                            // deviceDiscoveryStarted:true,
                            // discoveringIPOnlyDevices:true,
                            basicDiscoveryCompleted:true
   
                       })
                       
                    }
                    else if (event.data.eventType === "DiscoveryComplete") {
                        setTimeout(()=>{
                            setDiscoveryProgress({
                                startingDiscovery: true,
                                deviceDiscoveryStarted: true,
                                discoveringIPOnlyDevices: true,
                                basicDiscoveryCompleted: true,
                                DiscoveryCompleted: true

                            })
                        }, 3000)
                        setDiscoveryStarted(false)
                    }
                        
                    
                },
                connectionOpenFunction: () => {
                    console.log('Connection opened');
                },
                connectionClosedFunction: () => {
                    console.log('Connection closed');
                }
            })
        }).catch((e)=>{
            console.log('map processname failed : ',e)  
        })
    }


    return <>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(startDiscovery)} >

                <p>Router for MAC Discovery<span className="text-red-700">(Please add to display fields)</span></p>

                {sections.map((section) => (
                    <Card key={section.id} className="p-6 relative mb-6">
                        <IconTextButton
                            variant="destructive"
                            size="icon"
                            className="absolute top-4 right-4"
                            onClick={() => deleteSection(section.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </IconTextButton>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                
                                label={`Router IP for MAC Address Mapping`}
                                onChange={(e) => updateSection(section.id, 'routerIp', e.target.value)}
                                placeholder="Enter Router IP" name={`routerIp-${section.id}`} formControl={form.control} />

                            <FormInput
                                
                                label={`SNMP Port`}
                                onChange={(e) => updateSection(section.id, 'snmpPort', e.target.value)}
                                placeholder="ex.25" name={`snmpPort-${section.id}`} formControl={form.control} />

                            <FormComboboxInput
                                label={`SNMP Version`}

                                items={[
                                    { label: 'SNMP V1', value: '0' },
                                    { label: 'SNMP V2C', value: '1' },
                                ]}
                                formControl={form.control}
                                onSelect={(value) => updateSection(section.id, 'snmpVersion', value)}
                                placeholder="Select SNMP version" name={`snmpVersion-${section.id}`} />

                            <FormInput
                                type="password"
                                label={`SNMP Community String`}
                                onChange={(e) => updateSection(section.id, 'communityString', e.target.value)}
                                placeholder="******"
                                name={`communityString-${section.id}`}
                                formControl={form.control}
                            />
                        </div>
                    </Card>
                ))}

                {/* {sections.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No sections added. Click &quot;Add New Section&quot; to begin.
                    </div>
                )} */}

                <p>IP Range<span className="text-red-600">(Please add to display fields)</span></p>

                {ipRanges.map((range, index) => (
                    <IPRangeInput
                        key={index}
                        defaultValue={range}
                        onChange={(value) => handleIPRangeChange(index, value)}
                        onDelete={ipRanges.length > 1 ? () => handleDeleteRange(index) : undefined}
                    />
                ))}


                <p>Choose Credentials</p>

                <div className="flex items-start justify-between gap-2">

                    <Card className="p-2 w-1/3">
                        <CardTitle>Windows</CardTitle>
                        <CardContent className="p-2">
                            <DataTable data={wincredData} columns={credentialTableColumns} extraParams={ext} />
                        </CardContent>

                    </Card>
                    <Card className="p-2 w-1/3">
                        <CardTitle>SSH</CardTitle>
                        <CardContent className="p-2">
                            <DataTable data={sshcredData} columns={credentialTableColumns} extraParams={ext} />
                        </CardContent>

                    </Card>
                    <Card className="p-2 w-1/3">
                        <CardTitle>SNMP</CardTitle>
                        <CardContent className="p-2">
                            <DataTable data={snmpcredData} columns={credentialTableColumns} extraParams={ext} />
                        </CardContent>

                    </Card>


                </div>
                <div className="flex w-[60%] justify-between gap-2">
                    <div className="w-[50%]">
                        <FormComboboxInput placeholder="Select a Probe" name={"probeId"} items={probeData.map(e => {
                            e.label = e.PROBE_NAME
                            e.value = e.PROBE_ID
                            return e
                        }).filter(e => e.ACTIVE)} formControl={form.control} label={`Select Probe`}  />
                        
                    </div>
                    <div className="w-[50%]">
                        <FormMultiComboboxInput placeholder="Select a Role" name={"Role"} items={ITSM_ROLES.map(e => {
                                e.label = e.ROLE_NAME
                                e.value = e.ROLE_VALUE
                                return e
                            })} formControl={form.control} label={`Select a Role`}  />
                    </div>
                </div>

                





                <button type="button" ref={IpRangeref} onClick={handleAddRange} className="hidden" />
                <button type="button" ref={macDiscoveryRef} onClick={addSection} className="hidden" />
                <button type="submit" ref={startDiscoveryRef}  className="hidden" />

            </form>
        </Form>


    </>
})
export default StartDiscoveryForm;