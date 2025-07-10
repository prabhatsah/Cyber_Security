import { TextButtonWithTooltip } from "@/ikon/components/buttons";
import { MoveRight, Save, Undo2 } from "lucide-react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { ConfigureServicesForDeviceProps, CredentialType, DeviceListDataType, serviceDetails, serviceIdWiseDetailsType } from "../types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { DataTable } from "@/ikon/components/data-table";
import { Switch } from "@/shadcn/ui/switch";
import { Label } from "@/shadcn/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { Accordion, AccordionContent, AccordionTrigger } from "@/shadcn/ui/accordion";
import { AccordionItem } from "@radix-ui/react-accordion";
import { Badge } from "@/shadcn/ui/badge";
import ComboboxInput from "@/ikon/components/combobox-input";
import { Separator } from "@/shadcn/ui/separator";
import { getMyInstancesV2, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { DialogFooter } from "@/shadcn/ui/dialog";
import { useGlobalContext } from "../../context/GlobalContext";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";

type AccordionServicesType = {
    deviceId: string;
    hostIP: string;
    osType: string;
    totalServices: number;
    services: string[];
}[]

type CurrentlySelectedDeviceType = {
    deviceId: string;
    hostIP: string;
    osType: string;
}

type CredentialSelctorType = {
    label: string;
    value: string;
}

type deviceIDDetailsType = {
    [key: string]: {
        apiCredentialId: string;
        monitoringProtocol: string;
        serviceId: string;
        serviceName: string;
    }[]
}

let selectedServices: string[] = [];

const selectedDeviceData: deviceIDDetailsType = {}

function updateSelectedMetrics(
    setAccordionServices: Dispatch<SetStateAction<AccordionServicesType>>,
    currentlySelectedDevice: CurrentlySelectedDeviceType | undefined,
    selectedCredentialData: string
) {
    console.log('currentlySelectedDevice: ', currentlySelectedDevice)

    if (currentlySelectedDevice) {
        setAccordionServices([
            {
                deviceId: currentlySelectedDevice.deviceId,
                hostIP: currentlySelectedDevice.hostIP,
                osType: currentlySelectedDevice.osType,
                services: selectedServices,
                totalServices: selectedServices.length
            }
        ])

        if (!selectedDeviceData[currentlySelectedDevice.deviceId]) {
            selectedDeviceData[currentlySelectedDevice.deviceId] = [];
            selectedDeviceData[currentlySelectedDevice.deviceId].push({
                apiCredentialId: selectedCredentialData,
                monitoringProtocol: currentlySelectedDevice.osType,
                serviceId: '',
                serviceName: ''
            })
        }

        // selectedDeviceData[currentlySelectedDevice.deviceId] = {
        //     apiCredentialId: selectedCredentialData,
        //     monitoringProtocol: '',
        //     serviceId: '',
        //     serviceName: ''
        // }
    }

}

function getColumns3(setShowCredentialSelector: Dispatch<SetStateAction<boolean>>) {
    console.log('selectedServices inside getColumns3: ', selectedServices)

    const columnDetailsSchema: DTColumnsProps<serviceDetails>[] = [
        {
            accessorKey: "serviceId",
            header: '',
            cell: ({ row }) => {

                //if(selectedServices.length>0 && selectedServices.includes(row.original.metricsName))
                return (<div className="text-left">
                    <Switch
                        id={`service_basicChkb_${row.original.serviceId}`}
                        defaultChecked={selectedServices.length > 0 && selectedServices.includes(row.original.metricsName)}
                        onCheckedChange={
                            (checked) => {
                                if (checked) {
                                    selectedServices.push(row.original.metricsName)
                                    console.log(selectedServices)

                                    if (row.original.tokensNecessary) {
                                        setShowCredentialSelector(true)
                                    }
                                    else {
                                        setShowCredentialSelector(false);
                                    }

                                }
                                else {
                                    selectedServices = selectedServices.filter(service => service != row.original.metricsName)
                                    console.log(selectedServices)

                                    setShowCredentialSelector(false);
                                }
                            }
                        }
                    />
                    <Label htmlFor="airplane-mode"></Label>
                </div>)
                // else
                //     return (<div className="text-left">
                //         <Switch 
                //             id={ `service_basicChkb_${row.original.serviceId}` }
                //             defaultChecked={false}
                //             onCheckedChange={
                //                 (checked) => {
                //                     if(checked){
                //                         selectedServices.push(row.original.metricsName)
                //                         console.log(selectedServices)

                //                         setShowCredentialSelector(true);

                //                     }
                //                     else{
                //                         selectedServices = selectedServices.filter(service=>service!=row.original.metricsName)
                //                         console.log(selectedServices)

                //                         setShowCredentialSelector(false);
                //                     }
                //                 }
                //             }
                //         />
                //         <Label htmlFor="airplane-mode"></Label>
                //     </div>)
            },
            enableGrouping: false,
            enableSorting: false,
        },
        {
            accessorKey: "metricsName",
            header: 'Metric Name'
        }
    ]

    return columnDetailsSchema;
}

function getExtraParams2() {
    const extraParams: DTExtraParamsProps = {
        grouping: false,
        pageSize: 10,
        pageSizeArray: [5, 10, 15]
    }
    return extraParams;
}

function getColumns2() {
    console.log('selectedServices inside getColumns2: ', selectedServices)

    const columnDetailsSchema: DTColumnsProps<serviceDetails>[] = [
        {
            accessorKey: "serviceId",
            header: '',
            cell: ({ row }) => {

                if (selectedServices.length > 0 && selectedServices.includes(row.original.metricsName))
                    return (<div className="text-left">
                        <Switch
                            id={`service_basicChkb_${row.original.serviceId}`}
                            defaultChecked={true}
                            onCheckedChange={
                                (checked) => {
                                    if (checked) {
                                        selectedServices.push(row.original.metricsName)
                                        console.log(selectedServices)

                                    }
                                    else {
                                        selectedServices = selectedServices.filter(service => service != row.original.metricsName)
                                        console.log(selectedServices)

                                    }
                                }
                            }
                        />
                        <Label htmlFor="airplane-mode"></Label>
                    </div>)
                else
                    return (<div className="text-left">
                        <Switch
                            id={`service_basicChkb_${row.original.serviceId}`}
                            defaultChecked={false}
                            onCheckedChange={
                                (checked) => {
                                    if (checked) {
                                        selectedServices.push(row.original.metricsName)
                                        console.log(selectedServices)

                                    }
                                    else {
                                        selectedServices = selectedServices.filter(service => service != row.original.metricsName)
                                        console.log(selectedServices)

                                    }
                                }
                            }
                        />
                        <Label htmlFor="airplane-mode"></Label>
                    </div>)
            },
            enableGrouping: false,
            enableSorting: false,
        },
        {
            accessorKey: "metricsName",
            header: 'Metric Name'
        }
    ]

    return columnDetailsSchema;
}

function getExtraParams() {
    const extraParams: DTExtraParamsProps = {
        grouping: false,
        pageSize: 5,
        pageSizeArray: [5, 10, 15]
    }
    return extraParams;
}

function getColumns(
    activeSwitch: string,
    setActiveSwitch: Dispatch<SetStateAction<string | null>>,
    serviceIdWiseDetails: serviceIdWiseDetailsType,
    setBasicServices: Dispatch<SetStateAction<serviceDetails[]>>,
    setAdvancedServices: Dispatch<SetStateAction<serviceDetails[]>>,
    setNoCodeServices: Dispatch<SetStateAction<serviceDetails[]>>,
    setCurrentlySelectedDevice: Dispatch<SetStateAction<CurrentlySelectedDeviceType | undefined>>,
    setCredentialData: Dispatch<SetStateAction<CredentialSelctorType[]>>
) {
    const columnDetailsSchema: DTColumnsProps<DeviceListDataType>[] = [
        {
            accessorKey: "deviceId",
            header: '',
            cell: ({ row }) => (
                <div className="text-left">
                    <Switch
                        id={`deviceChkb_${row.original.deviceId}`}
                        checked={activeSwitch == `deviceChkb_${row.original.deviceId}`}
                        onCheckedChange={() => {
                            setActiveSwitch(`deviceChkb_${row.original.deviceId}`);
                            getServicesForDevice(row.original, serviceIdWiseDetails, setBasicServices, setAdvancedServices, setNoCodeServices, setCurrentlySelectedDevice, setCredentialData)
                        }}
                    />
                    <Label htmlFor="airplane-mode"></Label>
                </div>
            ),
            enableGrouping: false,
            enableSorting: false,
        },
        {
            accessorKey: "hostIp",
            header: 'HostIP'
        },
        {
            accessorKey: "hostName",
            header: 'HostName'
        },
    ]

    return columnDetailsSchema;
}

function getServicesForDevice(
    selectedDevice: DeviceListDataType,
    serviceIdWiseDetails: serviceIdWiseDetailsType,
    setBasicServices: Dispatch<SetStateAction<serviceDetails[]>>,
    setAdvancedServices: Dispatch<SetStateAction<serviceDetails[]>>,
    setNoCodeServices: Dispatch<SetStateAction<serviceDetails[]>>,
    setCurrentlySelectedDevice: Dispatch<SetStateAction<CurrentlySelectedDeviceType | undefined>>,
    setCredentialData: Dispatch<SetStateAction<CredentialSelctorType[]>>
) {
    const services = selectedDevice.serviceIdList;
    const basicServicesArr: serviceDetails[] = [];
    const advancedServicesArr: serviceDetails[] = [];
    const noCodeServicesArr: serviceDetails[] = [];

    if (services) {
        for (const serviceId in serviceIdWiseDetails) {
            if (services.includes(serviceId)) {
                //console.log('serviceId: ', serviceId, ' , data: ', serviceIdWiseDetails[serviceId]);

                if (serviceIdWiseDetails[serviceId].type == 'basic') {
                    basicServicesArr.push(serviceIdWiseDetails[serviceId]);
                }
                else if (serviceIdWiseDetails[serviceId].type == 'advanced') {
                    advancedServicesArr.push(serviceIdWiseDetails[serviceId]);
                }
                else {
                    noCodeServicesArr.push(serviceIdWiseDetails[serviceId])
                }



            }

        }

        setBasicServices(basicServicesArr)
        setAdvancedServices(advancedServicesArr)
        setNoCodeServices(noCodeServicesArr)

        //console.log('basic services: ', basicServicesArr);
        //console.log('advanced services: ', advancedServicesArr);
        //console.log('no code: ', noCodeServicesArr);

        fetchCredentialData(selectedDevice.osType, setCredentialData);
    }

    setCurrentlySelectedDevice({
        deviceId: selectedDevice.deviceId,
        hostIP: selectedDevice.hostIp,
        osType: selectedDevice.type
    })
}

function fetchCredentialData(osType: string, setCredentialData: Dispatch<SetStateAction<CredentialSelctorType[]>>) {
    console.log('osType inside fetchCredentialData: ', osType);

    const fetchData = async () => {
        const ostype = osType.toLocaleLowerCase();
        let processname = '';

        if (ostype == 'ssh') {
            processname = 'SSH Credential Directory';
        }
        else if (ostype == 'windows') {
            processname = 'Windows Credential Directory';
        }
        else if (ostype == 'snmp') {
            processname = 'SNMP Community Credential Directory';
        }
        else {
            processname = 'Api Credential Directory';
        }


        const softwareId = await getSoftwareIdByNameVersion("ITSM", "1");
        const data = await getMyInstancesV2<CredentialType>({
            softwareId,
            processName: processname,
            predefinedFilters: {
                taskName: 'View credential'
            }
        });

        const formattedData = data.map(obj => obj.data);

        const selectData = formattedData.map(obj => (
            {
                value: obj.credentialId,
                label: obj.credentialName
            }
        ))

        setCredentialData(selectData);


        console.log('credential data fetched: ', formattedData);
    }

    fetchData();
}

function handleSubmit(userId: string, clientId: string, selectedDeviceData: deviceIDDetailsType) {
    //console.log('currently selected device: ', currentlySelectedDevice)
    //console.log('currently selected services: ', selectedServices);
    //console.log('currently selected credential id: ', selectedCredentialData);

    const deviceIds = Object.keys(selectedDeviceData);

    const startData: {
        'associatedUserId': string;
        'clientId': string;
        'deviceIdDetails': deviceIDDetailsType;
        "uncheckedMetricsList": unknown[];
        "allSelectedDeviceId": string[];
        "allUncheckedServiceId": unknown[]
    } = {
        'associatedUserId': userId,
        'clientId': clientId,
        'deviceIdDetails': selectedDeviceData,
        "uncheckedMetricsList": [],
        "allSelectedDeviceId": deviceIds,
        "allUncheckedServiceId": []
    }

    const doTask = async () => {
        try {
            const processId = await mapProcessName({
                processName: 'Devicewise service association'
            })

            await startProcessV2({
                processId: processId,
                data: startData,
                processIdentifierFields: 'associatedUserId,clientId'
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    doTask()

}

const ConfigureServicesForDevice: FC<ConfigureServicesForDeviceProps> = ({ deviceIdWiseDetails, serviceIdWiseDetails }) => {
    const [activeSwitch, setActiveSwitch] = useState<string | null>(null);
    const [basicServices, setBasicServices] = useState<serviceDetails[]>([]);
    const [advancedServices, setAdvancedServices] = useState<serviceDetails[]>([]);
    const [noCodeServices, setNoCodeServices] = useState<serviceDetails[]>([]);
    const [currentlySelectedDevice, setCurrentlySelectedDevice] = useState<CurrentlySelectedDeviceType>();

    const [accordionServices, setAccordionServices] = useState<AccordionServicesType>([]);
    const [showCredentialSelector, setShowCredentialSelector] = useState<boolean>(false);
    const [credentailData, setCredentialData] = useState<CredentialSelctorType[]>([]);

    const [selectedCredentialData, setSelectedCredentialData] = useState<string>('');

    const columns = getColumns(activeSwitch ? activeSwitch : '', setActiveSwitch, serviceIdWiseDetails, setBasicServices, setAdvancedServices, setNoCodeServices, setCurrentlySelectedDevice, setCredentialData);
    const extraParams = getExtraParams();

    const extraParams2 = getExtraParams2();
    const columns2 = getColumns2();
    const columns3 = getColumns3(setShowCredentialSelector);

    console.log('deviceIdWiseDetails: ', deviceIdWiseDetails)

    const deviceIdWiseDetailsArr: DeviceListDataType[] = []

    const { PROFILE_DETAILS, CURRENT_ACCOUNT_ID } = useGlobalContext()

    Object.keys(deviceIdWiseDetails).forEach((id: string) => {
        const deviceData = deviceIdWiseDetails[id];
        deviceIdWiseDetailsArr.push(deviceData);
    })

    console.log('selectedServices in ConfigureServicesForDevice: ', selectedServices)


    return (
        <>
            <div className="grid grid-cols-3 gap-3 h-full w-full">
                <div>
                    <Card className="p-4 shadow-md rounded-lg h-full">
                        <CardHeader className="h-[10%]">
                            <CardTitle>
                                List of Devices
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[90%]">
                            <div className="h-4/5">
                                <DataTable data={deviceIdWiseDetailsArr} columns={columns} extraParams={extraParams} />
                            </div>

                            {
                                showCredentialSelector
                                &&
                                <div className="h-1/5">
                                    <div className="p-12">
                                        <Separator />
                                    </div>

                                    <div className="gap-3 flex items-center">
                                        <div>{currentlySelectedDevice?.hostIP}</div>
                                        <ComboboxInput
                                            placeholder="Select credential"
                                            items={credentailData}
                                            onSelect={
                                                (credentialId) => {
                                                    setSelectedCredentialData(credentialId as string)
                                                }
                                            }
                                        />
                                    </div>
                                </div>
                            }


                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card className="p-4 shadow-md rounded-lg h-full">
                        <CardHeader>
                            <CardTitle>
                                List of Metrices
                            </CardTitle>
                        </CardHeader>
                        <CardContent>

                            <Tabs defaultValue="basic" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="basic">Basic</TabsTrigger>
                                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                                    <TabsTrigger value="noCode">No Code</TabsTrigger>
                                </TabsList>

                                <TabsContent value="basic">
                                    <div>
                                        <DataTable data={basicServices} columns={columns2} extraParams={extraParams2} />
                                    </div>
                                </TabsContent>
                                <TabsContent value="advanced">
                                    <div>
                                        <DataTable data={advancedServices} columns={columns3} extraParams={extraParams2} />
                                    </div>
                                </TabsContent>
                                <TabsContent value="noCode">
                                    <div>
                                        <DataTable data={noCodeServices} columns={columns3} extraParams={extraParams2} />
                                    </div>
                                </TabsContent>
                            </Tabs>

                            {/* <DataTable data={tableData} columns={columns} extraParams={extraParams} /> */}
                        </CardContent>
                        <CardFooter className="justify-end">
                            <TextButtonWithTooltip type="button" tooltipContent='Save' className="me-2">
                                <Undo2 /> Reset
                            </TextButtonWithTooltip>

                            <TextButtonWithTooltip type="button" tooltipContent='Save' onClick={() => { updateSelectedMetrics(setAccordionServices, currentlySelectedDevice) }}>
                                <MoveRight /> Update
                            </TextButtonWithTooltip>
                        </CardFooter>
                    </Card>
                </div>

                <div>
                    <Card className="p-4 shadow-md rounded-lg h-full">
                        <CardContent className="text-center text-gray-500">

                            <Accordion type="single" collapsible className="w-full">

                                {
                                    accordionServices.map((obj, index) => {
                                        return (
                                            <AccordionItem key={obj.deviceId} value={`item-${index}`}>
                                                <AccordionTrigger>{obj.hostIP}-{obj.osType} <Badge>{obj.totalServices}</Badge> </AccordionTrigger>
                                                <AccordionContent>
                                                    <ol>
                                                        {
                                                            obj.services.map((serviceName) => {
                                                                return (<li key={serviceName}>{serviceName}</li>);
                                                            })
                                                        }
                                                    </ol>

                                                </AccordionContent>
                                            </AccordionItem>
                                        )
                                    })
                                }

                            </Accordion>

                        </CardContent>

                    </Card>
                </div>
            </div>
            <DialogFooter className="h-[5%]">
                <TextButtonWithTooltip id="configDevicesSubmitBtn" type="button" tooltipContent="save" onClick={() => {
                    handleSubmit(PROFILE_DETAILS?.USER_ID, CURRENT_ACCOUNT_ID, selectedCredentialData, currentlySelectedDevice);
                    //alert('clicked');
                }}>
                    <Save /> Save
                </TextButtonWithTooltip>
            </DialogFooter>
        </>
    )
}

export default ConfigureServicesForDevice