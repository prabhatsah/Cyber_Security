'use client'
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { SquarePenIcon } from "lucide-react";
import { useEffect, useState } from "react";
import EditRoleModal from "./grade-edit-modal-form";
import { useRouter } from 'next/navigation'; // Import useRouter
import CreateGradeButtonWithModal from "./create_grade";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";

interface GradeData {
    id: string;
    grade: string;
}

function GradeDataTable() {
    const router = useRouter(); 
    const [gradeTableData, setGradeTableData] = useState<GradeData[]>([]);
    const fetchGradeTableData = async () => {
        try {
            const gradeTableInstanceData = await getMyInstancesV2({ processName: "Grade", predefinedFilters: { taskName: "View State" } })
            const gradeTableData: GradeData[] = [];
            
            const instanceData = gradeTableInstanceData[0]?.data?.gradeDetails as Record<string, { grade: string }> || {};
            for (const [id, { grade }] of Object.entries(instanceData)) {
                gradeTableData.push({ id, grade });
            }
            setGradeTableData(gradeTableData);
        } catch (error) {
            console.error("Error fetching grade data:", error);
        }
    };
    const columns: ColumnDef<GradeData>[] = [
        {
            accessorKey: "Grade",
            header: () => (
                <div style={{ textAlign: 'center' }}>
                    Grade
                </div>
            ),
            cell: ({ row }) => <span>{row.original?.grade || "n/a"}</span>,
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
        fetchGradeTableData(); 
    };

     useEffect(() => {
        fetchGradeTableData();
    }, []);

    const extraParams: DTExtraParamsProps = {
        extraTools: [
            <CreateGradeButtonWithModal data={gradeTableData} />
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
    return (
        <>
        <DataTable columns={columns} data={gradeTableData} extraParams={extraParams} />
        { <EditRoleModal
            isOpen={isModalOpen}
            onClose={handleCloseModalEdit}
            selectedId={selectedId}
        /> }
        </>
    )
}

export default GradeDataTable;