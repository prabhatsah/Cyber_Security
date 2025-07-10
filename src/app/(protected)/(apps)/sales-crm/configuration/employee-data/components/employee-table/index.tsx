'use client'
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { Button } from "@/shadcn/ui/button";
import { SquarePenIcon } from "lucide-react";

//import EditOrgDetailsModal from "./edit-organization/org-edit-modal-form";
//import CreateOrgButtonWithModal from "./create-organization";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
interface OrgData {
    id: string;
    name: string;
    region: string;
    workingHours: string;
}

function EmployeeDataTable() {
    const router = useRouter(); // Initialize router
    const [orgTableData, setOrgTableData] = useState<OrgData[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Fetch organization data
    const fetchEmpTableData = async () => {
        try {
            const empTableInstanceData = await getMyInstancesV2({
                processName: "HRMS - Create User New",
                predefinedFilters: { taskName: "Employee Details View" }
            });

            const instanceData = empTableInstanceData[0]?.data as Record<string, { name: string; region: string; workingHours: string }> || {};
            console.log('instanceData', instanceData)
            // const newTableData = Object.entries(instanceData).map(([id, { name, region, workingHours }]) => ({
            //     id,
            //     name,
            //     region,
            //     workingHours,
            // }));
            // setOrgTableData(newTableData);
        } catch (error) {
            console.error("Error fetching organization data:", error);
        }
    };

    // Handle modal state
    const handleOpenModalEdit = (id: string) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const handleCloseModalEdit = () => {
        setIsModalOpen(false);
        setSelectedId(null);
        fetchEmpTableData(); // Re-fetch data when modal closes
        //router.refresh(); // Refresh the page
    };

    const extraParams: DTExtraParamsProps = {
        // extraTools: [
        //     <CreateOrgButtonWithModal />
        // ],
        actionMenu: {
            items: [
                {
                    label: "Edit",
                    icon: SquarePenIcon,
                    onClick: (row) => {
                        console.log("Edit clicked", row);
                        handleOpenModalEdit(row.id)
                    }
                },
            ]
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchEmpTableData();
    }, []);

    const columns: ColumnDef<OrgData>[] = [
        {
            accessorKey: "name",
            header: () => (
                <div style={{ textAlign: 'center' }}>
                    Name
                </div>
            ),
            cell: ({ row }) => <span>{row.original?.name || "n/a"}</span>,
        },
        {
            accessorKey: "region",
            header: () => (
                <div style={{ textAlign: 'center' }}>
                    Address
                </div>
            ),
            cell: ({ row }) => {
                return <span>{row.original?.region || "n/a"}</span>;
            },
        },
        {
            accessorKey: "workingHours",
            header: () => (
                <div style={{ textAlign: 'center' }}>
                    Working Hours
                </div>
            ),
            cell: ({ row }) => {
                return <span>{row.original?.workingHours || "n/a"}</span>;
            },
        },
        // {
        //     id: "actions",
        //     header: () => (
        //         <div style={{ textAlign: 'center' }}>
        //             Actions
        //         </div>
        //     ),
        //     enableHiding: false,
        //     cell: ({ row }) => {
        //         return (
        //             <Button variant="outline" size="sm" onClick={() => handleOpenModalEdit(row.original?.id)}>
        //                 <SquarePenIcon />
        //             </Button>
        //         );
        //     },
        // },
    ];

    return (
        <>
            <DataTable columns={columns} data={orgTableData} extraParams={extraParams} />
            {/* <EditOrgDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModalEdit}
                selectedId={selectedId}
            /> */}
        </>
    );
}

export default EmployeeDataTable;
