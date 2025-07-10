
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
import FormOtpInput from "@/ikon/components/form-fields/otp-input";

import { subscribeToProcessEvents } from "@/ikon/utils/api/sockets";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getCurrentSoftwareId } from "@/ikon/utils/actions/software";
import { useDiscovery } from "../actions/context/DiscoveryContext";
import { on } from "events";
import { toast } from "sonner";


interface IPRange {
    start: string;
    end: string;
}
interface IPBacknet {
    id: string;
    ip: string;
    subnet: string;
    port: string;
}

interface StartDiscoveryFormProps {
    IpBacknetref: React.RefObject<HTMLButtonElement | null>;
    IpRangeref: React.RefObject<HTMLButtonElement | null>;
    macDiscoveryRef: React.RefObject<HTMLButtonElement | null>;
    startDiscoveryRef: React.RefObject<HTMLButtonElement | null>;
    onClose: () => void;
}
interface MACsection {
    id: string;
    snmpPort: string;
    snmpVersion: string;
    communityString: string;
    routerIp: string;
}

const StartDiscoveryForm = forwardRef<HTMLFormElement, StartDiscoveryFormProps>((props, ref) => {
    const [ipBacknet, setIpBacknet] = useState<IPBacknet[]>([]);
    const [ipRanges, setIpRanges] = useState<IPRange[]>([]);
    const { IpBacknetref, IpRangeref, macDiscoveryRef, startDiscoveryRef, onClose } = props;
    const [windowsDatafetched, setWindowsDataFetched] = useState<boolean>(false)
    const [sshDatafetched, setSSHDataFetched] = useState<boolean>(false)
    const [snmpDatafetched, setSNMPDataFetched] = useState<boolean>(false)
    const [wincredData, setWinCredData] = useState<Object[]>([]
    )
    const [selectedCredentials, setSelectedCredentials] = useState<Object[]>([])

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
    const handleAddBacknet = () => {
        const newBacknet: IPBacknet = {
            id: Math.random().toString(36).substring(7),
            ip: '',
            // subnet: '',
            // port: ''
            subnet: '24',
            port: '47808'
        };
        setIpBacknet([...ipBacknet, newBacknet]);
    };

    const handleDeleteRange = (index: number) => {
        setIpRanges(ipRanges.filter((_, i) => i !== index));
    };

    //using context to update state
    const { setDiscoveryStarted, discoveryProgress, setDiscoveryProgress } = useDiscovery()


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
    const deleteBacknet = (id: string) => {
        setIpBacknet(ipBacknet.filter(section => section.id !== id));
    };

    const updateSection = (id: string, field: keyof MACsection, value: string) => {
        setSections(sections.map(section =>
            section.id === id ? { ...section, [field]: value } : section
        ));
    };
    const updateBacknet = (id: string, field: keyof IPBacknet, value: string) => {
        console.log('id: ', id, 'field: ', field, 'value: ', value);
        setIpBacknet(ipBacknet.map(backnet =>
            backnet.id === id ? { ...backnet, [field]: value } : backnet
        ));
    };


    useEffect(() => {
        //windows data
        getMyInstancesV2({
            processName: 'Windows Credential Directory',
            predefinedFilters: { taskName: "View credential" }

        }).then((res) => {

            setWindowsDataFetched(true)
            const updatedData =
                res.map(e => {
                    return { ...e.data }
                }
                )

            debugger
            setWinCredData(updatedData)

        }).catch((e) => {
            console.log(e)
        })

        //SSH Data
        getMyInstancesV2({
            processName: 'SSH Credential Directory',
            predefinedFilters: { taskName: "View credential" }

        }).then((res) => {

            setSSHDataFetched(true)
            const updatedData =
                res.map(e => {
                    return { ...e.data }
                })



            setSSHCredData(updatedData)

        }).catch((e) => {
            console.log(e)
        })

        // SNMP data
        getMyInstancesV2({
            processName: 'SNMP Community Credential Directory',
            predefinedFilters: { taskName: "View credential" }

        }).then((res) => {

            setSNMPDataFetched(true)
            const updatedData = res.map(e => {
                return { ...e.data }
            }
            )

            debugger
            setSNMPCredData(updatedData)

        }).catch((e) => {
            console.log(e)
        })

        const processName = 'Get All Probe Details for Current Account';
        const predefinedFilters = { "taskName": 'Dashboard Query Activity' };
        const projections = ['Data.PROBE_ID', 'Data.PROBE_NAME'];
        const baseSoftareId = 'cbfc7c21-af73-4844-9f42-d830480f874b'
        //const accountId = '56b5c266-6a0f-437a-82b9-3715bb6f3d4c';
        getMyInstancesV2({
            processName, predefinedFilters, projections, softwareId: baseSoftareId

        }).then((res) => {

            getParameterizedDataForTaskId({
                taskId: res[0].taskId,
                parameters: {},
            }).then((data: any) => {
                debugger
                setProbeData(data.probeDetails)
                console.log('Probe data9990: ', data.probeDetails)
            }).catch((e) => {
                console.log('Error in fetching probe data: ', e)
            })

        }).catch((e) => {
            console.log(e)
        })
        // getMyInstancesV2({
        //     accountId,
        //     processName: 'Probe Management Process',
        //     predefinedFilters: { taskName: "View Probe" }

        // }).then((res) => {

        //     debugger
        //     getParameterizedDataForTaskId({
        //         accountId,
        //         taskId: res[0].taskId,
        //         parameters: {},
        //     }).then((data: any) => {
        //         debugger
        //         setProbeData(data.probeDetails)
        //         console.log('Probe data9990: ', data.probeDetails)
        //     }).catch((e) => {
        //         console.log('Error in fetching probe data: ', e)
        //     })

        // }).catch((e) => {
        //     console.log(e)
        // })

    }, [])

    const ext: DTExtraParamsProps = {
        pageSize: 5,
        checkBoxColumn: true,
        rowsPerPage: false,
        checkBoxColumnCallback: (selectedRows) => {

            setSelectedCredentials(selectedRows.map(eachRow => eachRow.original))
        }




    }

    // const schema = z.object({
    //     // ipRanges: z.array(z.object({
    //     //     start: z.string().nonempty('Start IP is required'),
    //     //     end: z.string().nonempty('End IP is required'),
    //     // })),
    //     // credentials: z.array(z.object({})),

    //     probeId: z.string().nonempty('Probe is required')
    // });

    // const form = useForm<z.infer<typeof schema>>({
    //     resolver: zodResolver(schema),
    //     defaultValues: {
    //     },
    // });

    const schema = z.object({
        backnet: z.array(
            z.object({
                id: z.string(),
                        // .min(1, "ID is required"),
                ip: z.string(),
                    // .min(7, "Invalid IP address") // Minimum length for IP (e.g., "1.1.1.1")
                    // .max(15, "Invalid IP address") // Maximum length for IP (e.g., "255.255.255.255")
                    // .regex(
                    //     /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}$/,
                    //     "Invalid IP format"
                    // )
                    // .nonempty("IP is required"),
                subnet: z.string(),
                            // .nonempty("Subnet is required"),
                port: z.string()
                    // .regex(/^\d+$/, "Port must be a number") // Ensures it's numeric
                    // .nonempty("Port is required"),
            })
        ).nonempty("At least one backnet entry is required"),
        probeId: z.string().nonempty("Probe is required"),
    });

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            // backnet: [],
            backnet: [
                {
                    id: "",
                    ip: "",
                    subnet: "24",
                    port: "47808",
                },
            ],
            probeId: "",
        },
    });

    async function startDiscovery(values: z.infer<typeof schema>) {
        debugger
        console.log('values 11231: ', values);
        const accountId = '56b5c266-6a0f-437a-82b9-3715bb6f3d4c';
        mapProcessName({ processName: "bacnet discovery Device Service Dry Run", accountId }).then(async (processId) => {
            debugger
            const currentAccountId = await getActiveAccountId()
            const currentSoftwareId = await getCurrentSoftwareId()
            //submitting discovery request
            let data = {
                ip : values.backnet[0].ip,
                subnet : values.backnet[0].subnet,
                port : values.backnet[0].port
            }
            startProcessV2({
                accountId,
                processId,
                data,
                processIdentifierFields: ""
            })
            toast.success('Discovery started successfully')
            onClose();
            // setDiscoveryStarted(true)


            // //subscribing to process events
            // subscribeToProcessEvents({
            //     viewComponentId: 'discovery',
            //     accountId: currentAccountId,
            //     softwareId: currentSoftwareId,
            //     processId: processId,
            //     eventCallbackFunction: (event) => {
            //         debugger
            //         if (event.data.eventType === 'ProgressEvent') {

            //             setDiscoveryProgress({
            //                 ...discoveryProgress,
            //                 startingDiscovery: true,
            //                 deviceDiscoveryStarted: true

            //             })
            //         }


            //         // if (event.data.discoveryStatus === 'Device Discovery Started' ||event.data.eventType === 'ProgressEvent' ) {
            //         //     console.log('two')
            //         //     setDiscoveryProgress({
            //         //         ...discoveryProgress,
            //         //         startingDiscovery:true,
            //         //         deviceDiscoveryStarted:true
            //         //     })
            //         // }


            //         else if (event.data.eventType === 'PartialDiscoveryEvent') {
            //             //    console.log('three')
            //             setDiscoveryProgress({
            //                 ...discoveryProgress,
            //                 // startingDiscovery:true,
            //                 // deviceDiscoveryStarted:true,
            //                 discoveringIPOnlyDevices: true
            //             })
            //         }



            //         else if (event.data.eventData === 'Discovery complete') {
            //             console.log('four')
            //             setDiscoveryProgress({
            //                 ...discoveryProgress,
            //                 // startingDiscovery:true,
            //                 // deviceDiscoveryStarted:true,
            //                 // discoveringIPOnlyDevices:true,
            //                 basicDiscoveryCompleted: true

            //             })

            //         }
            //         else if (event.data.eventType === "DiscoveryComplete") {
            //             setTimeout(() => {
            //                 setDiscoveryProgress({
            //                     startingDiscovery: true,
            //                     deviceDiscoveryStarted: true,
            //                     discoveringIPOnlyDevices: true,
            //                     basicDiscoveryCompleted: true,
            //                     DiscoveryCompleted: true

            //                 })
            //             }, 3000)
            //             setDiscoveryStarted(false)
            //         }


            //     },
            //     connectionOpenFunction: () => {
            //         console.log('Connection opened');
            //     },
            //     connectionClosedFunction: () => {
            //         console.log('Connection closed');
            //     }
            // })
        }).catch((e) => {
            console.log('map processname failed : ', e)
        })
    }

    useEffect(() => {
        console.log("ipBacknet is something to log");
        console.log(ipBacknet);
    }, [ipBacknet]);

    console.log("probedata is something to log");
    console.log(probeData);
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

                <p>IP Range<span className="text-red-600">(Please add to display fields)</span></p>

                {ipBacknet.map((backnet, index) => (
                    <div key={backnet.id} className="flex my-2 gap-2">
                        <FormOtpInput
                            label={<span>Router IP<span className="text-red-600 font-bold">*</span></span>}
                            value={backnet.ip}
                            onChange={(e) => updateBacknet(backnet.id, 'ip', e.target.value)}
                            placeholder="Enter Router IP"
                            name={`backnet.${index}.ip`} // ✅ Correct name
                            formControl={form.control}
                        />
                        <FormInput
                            label={<span>Subnet<span className="text-red-600 font-bold">*</span></span>}
                            value={backnet.subnet}
                            onChange={(e) => updateBacknet(backnet.id, 'subnet', e.target.value)}
                            placeholder="Enter Subnet"
                            name={`backnet.${index}.subnet`} // ✅ Correct name
                            formControl={form.control}
                        />
                        <FormInput
                            label={<span>Port<span className="text-red-600 font-bold">*</span></span>}
                            value={backnet.port}
                            onChange={(e) => updateBacknet(backnet.id, 'port', e.target.value)}
                            placeholder="Enter Port"
                            name={`backnet.${index}.port`} // ✅ Correct name
                            formControl={form.control}
                        />
                        <IconTextButton
                            variant="destructive"
                            size="icon"
                            className="mt-8"
                            onClick={() => deleteBacknet(backnet.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </IconTextButton>
                    </div>
                ))}


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
                <div className="w-1/3">
                    <FormComboboxInput placeholder="Select a Probe" name={"probeId"} items={probeData.map(e => {
                        e.label = e.PROBE_NAME
                        e.value = e.PROBE_ID
                        return e
                    }).filter(e => e.ACTIVE)} formControl={form.control} label={`Select Probe`} />
                </div>


                <button type="button" ref={IpBacknetref} onClick={handleAddBacknet} className="hidden" />
                <button type="button" ref={IpRangeref} onClick={handleAddRange} className="hidden" />
                <button type="button" ref={macDiscoveryRef} onClick={addSection} className="hidden" />
                <button type="submit" ref={startDiscoveryRef} className="hidden" />

            </form>
        </Form>


    </>
})
export default StartDiscoveryForm;