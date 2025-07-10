import { TextButtonWithTooltip } from "@/ikon/components/buttons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Save } from "lucide-react";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { DeviceDiscoveryHistoryModalFormProps, DeviceHistoryDataType, DeviceIdWiseData, DeviceListDataType } from "../types";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";

import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { DataTable } from "@/ikon/components/data-table";
import { useGlobalContext } from "../../context/GlobalContext";
import DiscoveredDeviceDetailsTable from "./DiscoveredDeviceDetailsTable";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";

function getExtraParams() {
    const extraParams: DTExtraParamsProps = {
        grouping: true,
        pageSize: 10,
        pageSizeArray: [10, 15, 20],
    };

    return extraParams;
}

function getColumns(deviceIdData: DeviceIdWiseData | undefined, setShowDiscoveredDevicesTable: Dispatch<SetStateAction<boolean>>, setDeviceTableData: Dispatch<SetStateAction<DeviceListDataType[]>>) {
    const columnDetailsSchema: DTColumnsProps<DeviceHistoryDataType>[] = [
        {
            accessorKey: "data.accountable",
            header: "Discovered By",
            cell: ({ row }) => {
                //console.log('userName: ', row.original.accountable.userName);
                //console.log('accountable: ', row.original);
                return <span>
                    {
                        row.original?.accountable?.userName
                    }
                </span>
            },
        },
        {
            accessorKey: "data.discoveryHistoryData.countOfDiscoveredDevices",
            header: "Discovered Devices Count",
            cell: ({ row }) => <span className="cursor-pointer" onClick={
                () => {
                    showDevicesTable(deviceIdData, row.original.deviceIds ? row.original.deviceIds : [], setShowDiscoveredDevicesTable, setDeviceTableData)
                }
            }>{row.original.countOfDiscoveredDevices}</span>,
        },
        {
            accessorKey: "data.discoveryHistoryData.discoverDateAndTime",
            header: "Discovered Time",
            cell: ({ row }) => <span>{row.original.discoverDateAndTime}</span>,
        },
    ];

    return columnDetailsSchema;
}

function showDevicesTable(deviceIdData: DeviceIdWiseData | undefined, deviceIds: string[], setShowDiscoveredDevicesTable: Dispatch<SetStateAction<boolean>>, setDeviceTableData: Dispatch<SetStateAction<DeviceListDataType[]>>) {
    if (deviceIds.length && deviceIdData) {
        //console.log(deviceIds);

        const filteredDeviceData: DeviceListDataType[] = [];

        deviceIds.forEach(deviceId => {
            if (deviceIdData[deviceId]) {
                filteredDeviceData.push(deviceIdData[deviceId])
            }
        })

        setShowDiscoveredDevicesTable(true);
        setDeviceTableData(filteredDeviceData);
    }
}

const DeviceDiscoveryHistory: FC<DeviceDiscoveryHistoryModalFormProps> = ({ params, open, close }) => {
    const [discoveredDevicesHistoryData, setDiscoveredDevicesData] = useState<DeviceHistoryDataType[]>();
    const [showDiscoveredDevicesTable, setShowDiscoveredDevicesTable] = useState<boolean>(false);
    const [deviceTableData, setDeviceTableData] = useState<DeviceListDataType[]>([]);
    const { CURRENT_ACCOUNT_ID } = useGlobalContext();

    useEffect(() => {
        const fetchData = async () => {
            const onSuccess_discoveryHistoryData = (data: DeviceHistoryDataType[]) => {
                //console.log('discoveryHistoryData: ', data)

                setDiscoveredDevicesData(data)
            }

            // @ts-expect-error: ignore
            const onFailure_discoveryHistoryData = (err) => {
                console.error(err);
            }

            try {
                const softwareId = await getSoftwareIdByNameVersion("ITSM", "1");
                const discoveryHistoryData = await getMyInstancesV2<DeviceHistoryDataType>({
                    softwareId,
                    processName: 'Discovery History Process',
                    predefinedFilters: {
                        taskName: "View Discovery History"
                    }
                });
                //console.log("discoveryHistoryData0: ", discoveryHistoryData.map(obj=>obj.data));

                const innerData: DeviceHistoryDataType[] = [];


                discoveryHistoryData.forEach((obj) => {
                    if (obj.data.discoveryHistoryData) {
                        const filteredData = obj.data.discoveryHistoryData.filter(obj => obj.clientId == CURRENT_ACCOUNT_ID)

                        innerData.push({
                            countOfDiscoveredDevices: filteredData.length,
                            discoverDateAndTime: filteredData[0].discoverDateAndTime,
                            accountable: filteredData[0].accountable,
                            deviceIds: filteredData.map(obj => obj.deviceId)
                        });
                    }
                });

                onSuccess_discoveryHistoryData(innerData)
            }
            catch (err) {
                onFailure_discoveryHistoryData(err)
            }
        }

        fetchData()
    }, [CURRENT_ACCOUNT_ID])

    const columns = getColumns(params?.deviceIdWiseData, setShowDiscoveredDevicesTable, setDeviceTableData);
    const extraParams = getExtraParams();

    return (
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="min-w-[50rem]">

                    <DialogHeader>
                        <DialogTitle>Device Discovery History</DialogTitle>

                        <DialogDescription>
                            Shows discovered devices
                        </DialogDescription>
                    </DialogHeader>

                    <div className="min-h-16">
                        {
                            !discoveredDevicesHistoryData ? (
                                <div className="h-full">
                                    <LoadingSpinner size={60} />
                                </div>
                            ) : (
                                <div>
                                    <DataTable data={discoveredDevicesHistoryData} columns={columns} extraParams={extraParams} />
                                </div>
                            )
                        }
                    </div>

                    <DialogFooter>
                        <TextButtonWithTooltip type="submit" tooltipContent="save"> <Save /> Save</TextButtonWithTooltip>
                    </DialogFooter>

                </DialogContent>
            </Dialog>

            {
                showDiscoveredDevicesTable ?
                    <DiscoveredDeviceDetailsTable
                        deviceData={deviceTableData}
                        open={showDiscoveredDevicesTable}
                        close={
                            () => {
                                setShowDiscoveredDevicesTable(false);
                            }
                        }
                    />
                    : null
            }
        </>
    )
}

export default DeviceDiscoveryHistory