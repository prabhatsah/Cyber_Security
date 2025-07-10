
import { IconTextButton } from "@/ikon/components/buttons"
import { DataTable } from "@/ikon/components/data-table"
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog"
import { forwardRef, use } from "react";
// import { DiscoveryStatusTableSchemaType } from "../type";
import { Ban, Check, CircleCheck, Cross } from "lucide-react";
import { useDiscovery } from "../actions/context/DiscoveryContext";

interface DiscoveryProgress {
    deviceDiscoveryStarted: boolean,
    startingDiscovery: boolean,
    discoveringIPOnlyDevices: boolean,
    basicDiscoveryCompleted: boolean,
    DiscoveryCompleted:boolean
  }
  
  interface DiscoveryProgressProps {
    progress: DiscoveryProgress;
  }
  




  const DiscoveryProgressComponent = forwardRef<HTMLDivElement, DiscoveryProgressProps>( (props, ref) => {
    debugger
    const discoveryStatusTableColumns: DTColumnsProps<DiscoveryProgress>[] = [
        {
            accessorKey: "deviceDiscoveryStarted",
            header: "Discovery Started",
            cell: ({ row }) => (
              <div className="capitalize">{row.getValue("deviceDiscoveryStarted")?<CircleCheck size={36} color="#18d848" strokeWidth={1} absoluteStrokeWidth />:<Ban size={36} color="#df1125" strokeWidth={1} absoluteStrokeWidth />}</div>
            ),
          }
          ,
          {
            accessorKey: "startingDiscovery",
            header: "Starting Discovery",
            cell: ({ row }) => (
              <div className="capitalize">{row.getValue("startingDiscovery")?<CircleCheck size={36} color="#18d848" strokeWidth={1} absoluteStrokeWidth />:<Ban size={36} color="#df1125" strokeWidth={1} absoluteStrokeWidth />}</div>
            ),
          }
          ,
          {
            accessorKey: "discoveringIPOnlyDevices",
            header: "Discovering IP Only Devices",
            cell: ({ row }) => (
              <div className="capitalize">{row.getValue("discoveringIPOnlyDevices")?<CircleCheck size={36} color="#18d848" strokeWidth={1} absoluteStrokeWidth />:<Ban size={36} color="#df1125" strokeWidth={1} absoluteStrokeWidth />}</div>
            ),
          },
          {
            accessorKey: "basicDiscoveryCompleted",
            header: "Basic discovery completed",
            cell: ({ row }) => (
              <div className="capitalize">{row.getValue("basicDiscoveryCompleted")?<CircleCheck size={36} color="#18d848" strokeWidth={1} absoluteStrokeWidth />:<Ban size={36} color="#df1125" strokeWidth={1} absoluteStrokeWidth />}</div>
            ),
          }
    ]
    //const {discoveryStarted} = useDiscovery()
    
    
    
    return (
        <Dialog open={ !props.progress.DiscoveryCompleted }>

            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Discovery Progress</DialogTitle>
                    <DialogDescription>
                        Track the progress of the discovery process below:
                    </DialogDescription>
                </DialogHeader>

                <DataTable data={[props.progress]} columns={discoveryStatusTableColumns} />
                

                
            </DialogContent>
        </Dialog>
    )
})

export default DiscoveryProgressComponent