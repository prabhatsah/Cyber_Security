import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { DataTable } from "@/ikon/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { fetchProductOfProjectDetails } from "../../../QueryForResource.tsx";
import moment from "moment";

interface PartiallyAllocatedResourceProps {
    isOpen: boolean;
    onClose: () => void;
}

const PartiallyAllocatedResource: React.FC<PartiallyAllocatedResourceProps> = ({ isOpen, onClose }) => {
    const [partiallyAllocatedResources, setPartiallyAllocatedResources] = useState<any>([]);
    useEffect(() => {
        const renderPartiallyAllocatedResourceTable = async () => {
            try {
                const { allResourcesAllocationTable } = await fetchProductOfProjectDetails();
                const currentMonthFte = moment().format("MMM_YYYY") + "_fte";

                const partiallyAllocatedResourcesObj: Record<string, { employeeName: string; resourceId: string; fte: number }> = {};

                for (let i = 0; i < allResourcesAllocationTable.length; i++) {
                    const resource = allResourcesAllocationTable[i];
                    if (partiallyAllocatedResourcesObj[resource.resourceId]) {
                        partiallyAllocatedResourcesObj[resource.resourceId]["fte"] += resource[currentMonthFte] || 0;
                    } else {
                        partiallyAllocatedResourcesObj[resource.resourceId] = {
                            employeeName: resource.employeeName,
                            resourceId: resource.resourceId,
                            fte: resource[currentMonthFte] || 0
                        };
                    }
                }

                const partiallyAllocated = Object.values(partiallyAllocatedResourcesObj)
                    .filter(resource => resource.fte > 0 && resource.fte < 1)
                    .sort((a, b) => a.fte - b.fte);

                console.log("Partially Allocated Resources:", partiallyAllocated);
                setPartiallyAllocatedResources(partiallyAllocated);
            } catch (error) {
                console.error("Error fetching project data:", error);
            }
        };

        renderPartiallyAllocatedResourceTable();
    }, []);

    const columns: ColumnDef<any>[] = [
        { accessorKey: "employeeName", header: "Name", },
        { accessorKey: "resourceId", header: "Resource Id" },
        { accessorKey: "fte", header: "Current Month FTE", },
    ];

    const extraParams: DTExtraParamsProps = {
        pageSize: 10,
        grouping: false,
        //defaultTools: false,
    };

    return (
        <Dialog open={isOpen} onOpenChange={open => open || onClose()} modal>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Partially Allocated Resources</DialogTitle>
                </DialogHeader>

                <DataTable columns={columns} data={partiallyAllocatedResources} extraParams={extraParams} />

            </DialogContent>
        </Dialog>
    );
};

export default PartiallyAllocatedResource;