import { useEffect, useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { useForm } from "react-hook-form";
import { DataTable } from "@/ikon/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { fetchProjectDetails } from "../../../QueryForResource.tsx";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";

interface TotalProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TotalProjectModal: React.FC<TotalProjectModalProps> = ({ isOpen, onClose }) => {
    const [allProjectData, setAllProjectData] = useState<any>([]);
    const [userDetails, setUserDetails] = useState<any>([]);
    
    const fetchProjectData = async () => {
        const projectData = await fetchProjectDetails();
        const { allProjectDetails } = projectData;
        setAllProjectData(allProjectDetails);

        const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
        setUserDetails(userIdWiseUserDetailsMap);
    };

    useEffect(() => {
        fetchProjectData();
    }, []);

    const columns: ColumnDef<any>[] = [
        { accessorKey: "projectName", header: "Name",},
        { accessorKey: "projectStartDate", header: "Start Date" },
        { accessorKey: "projectClient", header: "Client Name",},
        { accessorKey: "projectManager", header: "Project Manager", cell: ({ row }) => {
            const projectManagerId = row.original.projectManager;
            return userDetails[projectManagerId]?.userName || "N/A";
          }
        },
    ];

    const extraParams: DTExtraParamsProps = {
        //pageSize: 10,
        grouping: false,
        //defaultTools: false,
    };

    return (
        <Dialog open={isOpen} onOpenChange={open => open || onClose()} modal>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Total Project(s)</DialogTitle>
                </DialogHeader>

                <DataTable columns={columns} data={allProjectData} extraParams={extraParams} />

            </DialogContent>
        </Dialog>
    );
};

export default TotalProjectModal;