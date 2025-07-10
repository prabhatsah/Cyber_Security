import { TextButtonWithTooltip } from "@/ikon/components/buttons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Save } from "lucide-react";
import { FC } from "react";
import { DeviceListDataType, DiscoveredDeviceDetailsTableProps } from "../types";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { DataTable } from "@/ikon/components/data-table";

function getExtraParams() {
    const extraParams: DTExtraParamsProps = {
      grouping: true,
      pageSize: 10,
      pageSizeArray: [10, 15, 20],
    };
  
    return extraParams;
}
  
function getColumns() {
    const columnDetailsSchema: DTColumnsProps<DeviceListDataType>[] = [
      {
        accessorKey: "data.hostName",
        header: "Device Name",
        cell: ({ row }) => <span>{row.original.hostName}</span>,
      },
      {
        accessorKey: "data.hostIp",
        header: "Host IP",
        cell: ({ row }) => <span>{row.original.hostIp}</span>,
      },
      {
        accessorKey: "data.description",
        header: "Description",
        cell: ({ row }) => <span>{row.original.description}</span>,
      },
      {
        accessorKey: "data.os",
        header: "OS",
        cell: ({ row }) => <span>{row.original.os}</span>,
      },
      {
        accessorKey: "data.type",
        header: "Type",
        cell: ({ row }) => <span>{row.original.type}</span>,
      },
      {
        accessorKey: "data.status",
        header: "Status",
        cell: ({ row }) => <span>{row.original.status}</span>,
      },
      {
        accessorKey: "data.noOfServices",
        header: "Services",
        cell: ({ row }) => <span>{row.original.noOfServices}</span>,
      },
    ];
  
    return columnDetailsSchema;
}

const DiscoveredDeviceDetailsTable : FC<DiscoveredDeviceDetailsTableProps> = ({deviceData, open, close}) => {
     const columns = getColumns();
     const extraParams = getExtraParams();

    return (
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="min-w-[50rem]">

                    <DialogHeader>
                        <DialogTitle>Devices Details</DialogTitle>
            
                        <DialogDescription>
                            List of devices discovered at once
                        </DialogDescription>
                    </DialogHeader>
            
                    <div>
                        <DataTable data={deviceData} columns={columns} extraParams={extraParams} />
                    </div>
                
                    <DialogFooter>
                        <TextButtonWithTooltip type="submit" tooltipContent="save"> <Save/> Save</TextButtonWithTooltip>
                    </DialogFooter>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default DiscoveredDeviceDetailsTable
