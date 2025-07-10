'use client'
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { Button } from "@/shadcn/ui/button";
import { SquarePenIcon } from "lucide-react";
import { useEffect, useState } from "react";
import EditRoleModal from "./role-edit-modal-form";
import { useRouter } from 'next/navigation'; // Import useRouter
import CreateRoleButtonWithModal from "./create_role";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";

// const roleTableInstanceData = await getMyInstancesV2({ processName: "HRMS - Roles", predefinedFilters: { taskName: "View" } })
// const roleTableData: RoleData[] = [];

// const instanceData = roleTableInstanceData[0]?.data as Record<string, { roleTitle: string }> || {};
// for (const [id, { roleTitle }] of Object.entries(instanceData)) {
//     roleTableData.push({ id, roleTitle });
// }

interface RoleData {
    id: string;
    roleTitle: string;
}

function RolesDataTable() {
    const router = useRouter(); 
    const [roleTableData, setRoleTableData] = useState<RoleData[]>([]);
    const fetchRoleTableData = async () => {
        try {
            const roleTableInstanceData = await getMyInstancesV2({ processName: "HRMS - Roles", predefinedFilters: { taskName: "View" } })
            const roleTableData: RoleData[] = [];
            
            const instanceData = roleTableInstanceData[0]?.data as Record<string, { roleTitle: string }> || {};
            for (const [id, { roleTitle }] of Object.entries(instanceData)) {
                 roleTableData.push({ id, roleTitle });
            }
            setRoleTableData(roleTableData);
        } catch (error) {
            console.error("Error fetching organization data:", error);
        }
    };
    const columns: ColumnDef<RoleData>[] = [
        {
            accessorKey: "Title",
            header: () => (
                <div style={{ textAlign: 'center' }}>
                    Title
                </div>
            ),
            cell: ({ row }) => <span>{row.original?.roleTitle || "n/a"}</span>,
        },
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleOpenModalEdit = (id: string) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const handleCloseModalEdit = () => {
        setIsModalOpen(false);
        setSelectedId(null);
        router.refresh(); // Refresh the page
        fetchRoleTableData(); 
    };

     useEffect(() => {
        fetchRoleTableData();
    }, []);

    const extraParams: DTExtraParamsProps = {
        extraTools: [
            <CreateRoleButtonWithModal data={roleTableData} />
        ],
        actionMenu: {
            items: [
                {
                    label: "Edit",
                    icon: SquarePenIcon,
                    onClick: (row : any) => {
                        console.log("Edit clicked", row);
                        handleOpenModalEdit(row.id)
                    }
                },
            ]
        }
    };

    // const extraParams: DTExtraParamsProps = {
    //     extraTools: [
    //         <CreateOrgButtonWithModal data={orgTableData} />
    //     ],
    //     actionMenu: {
    //         items: [
    //             {
    //                 label: "Edit",
    //                 icon: SquarePenIcon,
    //                 onClick: (row) => {
    //                     console.log("Edit clicked", row);
    //                     handleOpenModalEdit(row.id)
    //                 }
    //             },
    //         ]
    //     }
    // };
    return (
        <>
        <DataTable columns={columns} data={roleTableData} extraParams={extraParams} />
        { <EditRoleModal
            isOpen={isModalOpen}
            onClose={handleCloseModalEdit}
            selectedId={selectedId}
        /> }
        </>
    )
}

export default RolesDataTable;