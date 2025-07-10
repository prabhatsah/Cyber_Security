'use client'
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { useEffect, useState } from "react";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { Button } from "@/shadcn/ui/button";
import { Plus, SquarePenIcon } from "lucide-react";
import AssessmentModal from "./AssessmentForm";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";

export default function AssessmentTable() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
    const [assessmentData, setAssessmentData] = useState<any[]>([]);

    const openModal = (riskId: string | null) => {
        setSelectedRiskId(riskId);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedRiskId(null);
    };

    const fetchAssessmentData = async () => {
        try {
            const assessmentInsData = await getMyInstancesV2<any>({
                processName: "Add Risk Assessment",
                predefinedFilters: { taskName: "View Risk" },
            });

            const assessmentData = assessmentInsData.map((e: any) => e.data);
            setAssessmentData(assessmentData);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchAssessmentData();
    }, []);

    const columnsProductDetails: DTColumnsProps<any>[] = [
        {
            accessorKey: "riskTitle",
            header: 'Risk Title',
        },
        {
            accessorKey: "riskCategory",
            header: 'Risk Category',
        },
        {
            accessorKey: "riskOwner",
            header: 'Risk Owner',
        },
        {
            accessorKey: "riskLevel",
            header: 'Risk Level',
        },
        {
            accessorKey: "riskTimeline",
            header: 'Risk Timeline',
        },
        {
            id: 'actions',
            header: 'Action',
            enableHiding: false,
            cell: ({ row }) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openModal(row.original?.riskId)} // Open modal for edit
                >
                    <SquarePenIcon />
                </Button>
            ),
        },
    ];

    const extraParams: any = {
        searching: true,
        filtering: true,
        grouping: true,
        extraTools: [
            <IconButtonWithTooltip tooltipContent="Add Risk Assessment" onClick={() => openModal(null)}>
                <Plus />
            </IconButtonWithTooltip>
        ],
    };

    return (
        <>
            <DataTable columns={columnsProductDetails} data={assessmentData} extraParams={extraParams} />
            {isModalOpen && (
                <AssessmentModal isOpen={isModalOpen} onClose={closeModal} selectedRiskId={selectedRiskId} />
            )}
        </>
    );
}
