'use client'
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService"
import { SquarePenIcon } from "lucide-react";
import { useEffect, useState } from "react";
import EditRoleModal from "./role-edit-modal-form";
import { useRouter } from 'next/navigation'; // Import useRouter
import CreateRoleButtonWithModal from "./create_role";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";

interface RiskData {
    id: string;
    riskTitle: string;
}

function RiskDataTable() {
    const router = useRouter(); 
    const [riskTableData, setRiskTableData] = useState<RiskData[]>([]);
    const fetchRiskTableData = async () => {
        try {
            const riskTableInstanceData = await getMyInstancesV2({ processName: "Risk Configuration", predefinedFilters: { taskName: "View" } })
            const riskTableData: RiskData[] = [];
            
            const instanceData = riskTableInstanceData[0]?.data as Record<string, { riskTitle: string }> || {};
            for (const [id, { riskTitle }] of Object.entries(instanceData)) {
                 riskTableData.push({ id, riskTitle });
            }
            setRiskTableData(riskTableData);
        } catch (error) {
            console.error("Error fetching organization data:", error);
        }
    };
    const columns: ColumnDef<RiskData>[] = [
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
        fetchRiskTableData(); 
    };

     useEffect(() => {
        fetchRiskTableData();
    }, []);

    const extraParams: DTExtraParamsProps = {
        extraTools: [
            <CreateRoleButtonWithModal data={riskTableData} />
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
        <DataTable columns={columns} data={riskTableData} extraParams={extraParams} />
        { <EditRoleModal
            isOpen={isModalOpen}
            onClose={handleCloseModalEdit}
            selectedId={selectedId}
        /> }
        </>
    )
}

export default RiskDataTable;