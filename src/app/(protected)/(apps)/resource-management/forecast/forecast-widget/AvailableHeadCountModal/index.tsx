import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { DataTable } from "@/ikon/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { getEmployeesDetails } from "../../../QueryForResource.tsx";

interface AvailableHeadcountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AvailableHeadCountModal: React.FC<AvailableHeadcountModalProps> = ({ isOpen, onClose }) => {
    const [empData, setEmpData] = useState<any>([]);

    const fetchProjectData = async () => {
        const employeeData = await getEmployeesDetails();
        const { employeeList } = employeeData;
        console.log("Employee Data:", employeeList);
        setEmpData(employeeList);

    };

    useEffect(() => {
        fetchProjectData();
    }, []);

    const columns: ColumnDef<any>[] = [
        { accessorKey: "fullName", header: "Name",},
        { accessorKey: "staffId", header: "Staff Id" },
        { accessorKey: "orgEmail", header: "Email",},
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
                    <DialogTitle>Total Resources</DialogTitle>
                </DialogHeader>

                <DataTable columns={columns} data={empData} extraParams={extraParams} />

            </DialogContent>
        </Dialog>
    );
};

export default AvailableHeadCountModal;