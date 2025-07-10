import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { DataTable } from "@/ikon/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { fetchProductOfProjectDetails, getEmployeesDetails } from "../../../QueryForResource.tsx";

interface UnallocatedResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UnallocatedResourceModal: React.FC<UnallocatedResourceModalProps> = ({ isOpen, onClose }) => {
    const [filteredEmployees, setFilteredEmployees] = useState<any>([]);
    
    const makeData = async () => {
        try {
            // Fetch unallocated staff list
            const productOfProjectData = await fetchProductOfProjectDetails();
            const { unallocatedStaffsList } = productOfProjectData;

            // Fetch employee list
            const employeeDetails = await getEmployeesDetails();
            const { employeeList } = employeeDetails;

            // Filter employees whose staffId is in unallocatedStaffsList
            const filtered = employeeList.filter(emp => unallocatedStaffsList.includes(emp.staffId));

            console.log("Filtered Employees:", filtered);
            setFilteredEmployees(filtered);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        makeData();
    }, []);

    const columns: ColumnDef<any>[] = [
        { accessorKey: "fullName", header: "Name",},
        { accessorKey: "staffId", header: "Staff Id" }
    ];

    const extraParams: DTExtraParamsProps = {
        grouping: false,
    };

    return (
        <Dialog open={isOpen} onOpenChange={open => open || onClose()} modal>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Total Unallocated Resources</DialogTitle>
                </DialogHeader>

                <DataTable columns={columns} data={filteredEmployees} extraParams={extraParams} />

            </DialogContent>
        </Dialog>
    );
};

export default UnallocatedResourceModal;