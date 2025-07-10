'use client'

import { FC, useEffect, useState } from "react";
import { DeviceListDataType, DevicePollingIntervalProps, serviceIdWiseDetails } from "../types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { getMyInstancesV2, invokeAction, mapProcessName } from "@/ikon/utils/api/processRuntimeService";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { DataTable } from "@/ikon/components/data-table";
import { TextButtonWithTooltip } from "@/ikon/components/buttons";
import { Save } from "lucide-react";
import { Form } from "@/shadcn/ui/form";
import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/ikon/components/form-fields/input";
import FormCheckbox from "./FormCheckBox";
import { subscribeToProcessEvents } from "@/ikon/utils/api/sockets";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getCurrentSoftwareId } from "@/ikon/utils/actions/software";

type deviceServiceAssociationDataType = {
    clientId: string;
    deviceId: string;
    serviceId: string;
    service_interval_in_sec: number;
}

async function fetchData(deviceId: string){
    const data = await getMyInstancesV2<deviceServiceAssociationDataType>({
        processName: 'Device-Service Association',
        predefinedFilters: {
            taskName: 'View association details'
        },
        processVariableFilters: {
            deviceId: deviceId
        }
    });

    return data;
}

function getExtraParams(){
    const extraParams: DTExtraParamsProps = {
        grouping: false,
        pageSize: 5,
        pageSizeArray: [5, 10, 15],
    }

    return extraParams;
}

function getColumns(viewmode: boolean, serviceIdWiseDetails: serviceIdWiseDetails, form : UseFormReturn<{pollingInterval: string; serviceChkb: string[];}, unknown, undefined>){

    const columnDetailsSchema: DTColumnsProps<deviceServiceAssociationDataType>[] = [
        
        {
            accessorKey: "data.serviceId",
            header: 'Service Name',
            cell: ({ row }) => (
                <div className="flex gap-6">
                    <div>
                        <FormCheckbox
                            name='serviceChkb'
                            value={row.original.serviceId}
                            formControl={form.control}
                        />
                    </div>
                    <div>
                        { 
                            serviceIdWiseDetails[row.original.serviceId].metricsName 
                        }
                    </div>
                </div>
            ),
            enableGrouping: false,
        },
        {
            accessorKey: "data.service_interval_in_sec",
            header: 'Polling Interval',
            cell: ({ row }) => (
                <span >{ row.original.service_interval_in_sec }</span>
            )
        },
    ]

    if(viewmode){
        columnDetailsSchema.shift();
    }

    return columnDetailsSchema;
}

const formSchema = z.object({
    pollingInterval: z
    .string()
    .refine(val => !isNaN(Number(val)) && Number(val) >= 300, {
      message: "Please enter a valid polling interval (>= 300 seconds)",
    }),

    serviceChkb: z.array(z.string()).min(1, {
        message: "Please select at least one service.",
    }),
});

const DevicePollingIntervalModal : FC<DevicePollingIntervalProps> = ({open, close, deviceId, refresh, serviceIdWiseDetails, viewMode}) => {
    const [deviceServiceAssociationData, setDeviceServiceAssociationData] = useState<deviceServiceAssociationDataType[]>([]);

    console.log('viewmode: ', viewMode);

    console.log('deviceId: ', deviceId);

    // Transform boolean checkboxes into an array of selected values
    const onSubmit = async (data: FormValues) => {
        //console.log("Selected Services:", data.serviceChkb);
        //console.log("Selected polling interval: ", data.pollingInterval);

        const selectedServices = data.serviceChkb;
        // @ts-expect-error : ignore
        const serviceIdToNewTimeMap = []
        const serviceIdFromCheckBox:{
            [ket: string] : number
        } = {}

        try{

            selectedServices.forEach(checkboxs => {
                const newTime = parseInt(data.pollingInterval);
                const serviceId = checkboxs;
                serviceIdFromCheckBox[serviceId] = newTime
                serviceIdToNewTimeMap.push(serviceIdFromCheckBox);
            })

            const deviceData = await getMyInstancesV2<DeviceListDataType>({
                processName: 'Configuration Item',
                predefinedFilters: { 
                    taskName: "Update Service Interval Activity" 
                },
                processVariableFilters: {
                    deviceId: deviceId
                }

            });

            deviceData.forEach(async (device)=>{
                // @ts-expect-error : ignore
                device.data.temp = serviceIdToNewTimeMap;
                await invokeAction({
                    taskId: deviceData[0].taskId,
                    transitionName: 'Update Service Interval Activity',
                    data: device.data,
                    processInstanceIdentifierField: ''
                })
            })

            const processId = await mapProcessName({
                processName: 'Configuration Item'
            })

            const accountId = await getActiveAccountId();

            const softwareId = await getCurrentSoftwareId();

            deviceData.forEach(async (device)=>{
                await subscribeToProcessEvents({
                    viewComponentId: 'pollingIntervalComponent',
                    processId: processId,
                    processInstanceId: device.processInstanceId,
                    accountId: accountId,
                    softwareId: softwareId,
                    eventCallbackFunction: (arg)=>{console.log("1. Event Callback", arg)},
                    connectionOpenFunction: ()=>{console.log("2. Connection Open")},
                    connectionClosedFunction: ()=>{console.log("3. Connection Close")}
                })
            })

            close()
            refresh();
        }
        catch(err){
            console.error(err);
        }
        
    };

    type FormValues = z.infer<typeof formSchema>

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            pollingInterval: '300',
            serviceChkb: []
        },
    });

    useEffect(()=>{
        const fetchAsyncData = async () => {
            if(deviceId){
                const data = await fetchData(deviceId)
                const formattedData = data.map(obj=>obj.data);

                setDeviceServiceAssociationData(formattedData)
            }
        }

        fetchAsyncData();

    }, [deviceId])

    const extraParams = getExtraParams();
    const columns = getColumns(viewMode, serviceIdWiseDetails, form);

    return (
        <>
           <Dialog open={open} onOpenChange={close}>
                <DialogContent className="overflow-auto min-w-[max-content]">
                    <DialogHeader>
                        <DialogTitle>
                            Servicewise Polling Interval
                        </DialogTitle>

                        <DialogDescription  className={viewMode ? 'hidden' : ''}>
                            Note: Please enter time &gt;= 120 seconds and press Enter to update.
                        </DialogDescription>
                        
                    </DialogHeader>

                    <Form {...form}>

                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-3 mb-4">
                                {
                                    !deviceServiceAssociationData.length ? (
                                        <div className="min-h-16 mt-16">
                                            <LoadingSpinner size={60} />
                                        </div>
                                    ) : (
                                            <>
                                                <div className={viewMode ? 'hidden' : 'mb-4'}>
                                                    <FormInput name="pollingInterval" formControl={form.control} label={ <>Polling Interval<span className="text-destructive">*</span></> } />
                                                </div>
                                                <DataTable data={deviceServiceAssociationData} columns={columns} extraParams={extraParams} />
                                                <DialogFooter className={viewMode ? 'hidden' : ''}>
                                                    <TextButtonWithTooltip type="submit" tooltipContent='Save' disabled={!form.formState.isValid}> 
                                                        <Save /> Save
                                                    </TextButtonWithTooltip>
                                                </DialogFooter>
                                            </>
                                    )
                                }
                            </div>
                        </form>

                    </Form>

                    
                </DialogContent>
           </Dialog>
        </>
    )
}

export default DevicePollingIntervalModal;