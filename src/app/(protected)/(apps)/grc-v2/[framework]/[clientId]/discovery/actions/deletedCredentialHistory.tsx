import { IconTextButton } from "@/ikon/components/buttons";
import { FileX2 } from "lucide-react";
import { Tooltip } from "@/ikon/components/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { DataTable } from "@/ikon/components/data-table";
import {DeletedCredHistoryTableDataType} from "../type"
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { useEffect, useState } from "react";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import moment from "moment";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";

export default function DeletedCredHistory() {

    const [deletedCredHistoryData,setDeletedCredHistoryData] = useState<DeletedCredHistoryTableDataType[]>([]);
    const [dataFetched,setDatafetched] = useState(false)
    
    const deletedCredHistoryColumns:DTColumnsProps<DeletedCredHistoryTableDataType>[] = [
        {
            accessorKey: "deletedBy",
            header: "Deleted By",
            cell: ({ row }) => (
              <div className="capitalize">{row.getValue("deletedBy")}</div>
            ),
          },
          {
            accessorKey: "deletedOn",
            header: "Deleted On",
            cell: ({ row }) => (
              <div className="capitalize">{row.getValue("deletedOn")}</div>
            ),
           
          },
          {
            accessorKey: "credentialName",
            header: "Credential Name",
            cell: ({ row }) => (
              <div className="capitalize">{row.getValue("credentialName")}</div>
            ),
            
          },
          {
            accessorKey: "credentialType",
            header: "Credential Type",
            cell: ({ row }) => (
              <div className="capitalize">{row.getValue("credentialType")}</div>
            ),
            
          },
          {
            accessorKey: "updatedOn",
            header: "Updated On",
            cell: ({ row }) => (
              <div className="capitalize">{row.getValue("updatedOn")}</div>
            ),
            
          },
          {
            accessorKey: "servies",
            header: "Services",
            cell: ({ row }) => (
              <div className="capitalize">{row.getValue("servies")}</div>
            ),
            
          },
    ]

   useEffect(() => {
    const fetchData = async () => {
        try {
            const softwareId = await getSoftwareIdByNameVersion("ITSM", "1");
            const instances = await getMyInstancesV2<DeletedCredHistoryTableDataType>({
                softwareId,
                processName: 'Credential Delete History Process',
                predefinedFilters: { taskName: "View Delete Credential History" },
            });
            const userMap = await getUserIdWiseUserDetailsMap();
            const response = instances.map(e => e.data).map((data) => ({
                deletedBy: userMap[data.deletedBy]?.userName || data.deletedBy,
                deletedOn: moment(data.createdOn).format('YYYY-MM-DD HH:mm:ss'),
                credentialName: data.credentialName,
                credentialType: data.credentialType,
                updatedOn: moment(data.updatedOn).format('YYYY-MM-DD HH:mm:ss'),
                services: data.services ? data.services : 'N/A'
            }));
            setDatafetched(true);
            setDeletedCredHistoryData(response);
        } catch (error) {
            console.log("Error in fetching deleted credential history or user map", error);
        }
    };

    fetchData();
}, []);
    
    const ext: DTExtraParamsProps = {
        pageSize: 5,
        
    }

    return (
        <>
           { dataFetched?<Dialog>
                <Tooltip tooltipContent={"Deleted Credential History"}>
                    <DialogTrigger asChild>

                        <IconTextButton
                        >
                            <FileX2 />
                        </IconTextButton>

                    </DialogTrigger>
                </Tooltip>
                <DialogContent className="sm:max-w-[1000px]">
                    <DialogHeader>
                        <DialogTitle>Deleted Credential History</DialogTitle>
                        
                    </DialogHeader>

                    <DataTable data={deletedCredHistoryData} columns={deletedCredHistoryColumns} extraParams={ext} />
                    
                </DialogContent>
            </Dialog>:<LoadingSpinner/>}


        </>
    )
}
