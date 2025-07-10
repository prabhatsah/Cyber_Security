'use client'
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { useEffect, useState } from "react";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { Button } from "@/shadcn/ui/button";
import { Plus, SquarePenIcon } from "lucide-react";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import RegisterModal from "./RegisterForm";
import { userMap } from "../UserMap";

export default function RegisterTable() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedRegisterId, setSelectedRegisterId] = useState<string | null>(null);
    const [assessmentData, setAssessmentData] = useState<any[]>([]);
    const [userDetails, setUserDetails] = useState<{ value: string; label: string }[]>([]);

    const openModal = (riskId: string | null) => {
        setSelectedRegisterId(riskId);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedRegisterId(null);
    };

    const fetchAssessmentData = async () => {
        try {
            const users = await userMap();
            setUserDetails(users || []);

            const assessmentInsData = await getMyInstancesV2<any>({
                processName: "Add Risk Register",
                predefinedFilters: { taskName: "View Risk Register" },
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
            accessorKey: "riskRegisterTitle",
            header: 'Risk Title',
        },
        {
            accessorKey: "riskRegisterOwner",
            header: 'Risk Owner',
            cell: ({ row }) => {
                const ownerLabel = userDetails.find(user => user.value === row.original.riskRegisterOwner)?.label || "Unknown";
                return ownerLabel;
            },
        },
        {
            accessorKey: "riskRegisterDescription",
            header: 'Description',
        },
        {
            accessorKey: "riskRegisterTimeline",
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
                    onClick={() => openModal(row.original?.riskRegisterId)} // Open modal for edit
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
                <RegisterModal isOpen={isModalOpen} onClose={closeModal} selectedRegisterId={selectedRegisterId} />
            )}
        </>
    );
}
