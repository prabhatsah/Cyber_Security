"use client";
import { useEffect, useState } from "react";
import { WidgetProps } from "@/ikon/components/widgets/type";
import Widgets from "@/ikon/components/widgets";
import TotalProjectModal from "./TotalProjectModal.tsx";
import AvailableHeadCountModal from "./AvailableHeadCountModal";
import { fetchProductOfProjectDetails } from "../../QueryForResource.tsx";
import moment from "moment";
import UnallocatedResourceModal from "./UnAllocatedResourcesModa";
import PartiallyAllocatedResource from "./PartiallyAllocatedModal";

export default function ResourceWidgetData() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<string | null>(null);
    const [totalUtilizationHeadcount, setTotalUtilizationHeadcount] = useState<number>(0);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const { allResourcesAllocationTable } = await fetchProductOfProjectDetails();

                if (!allResourcesAllocationTable || allResourcesAllocationTable.length === 0) return;

                const monthKey = `${moment().format("MMM_YYYY")}_fte`;

                const totalFTE = allResourcesAllocationTable.reduce(
                    (acc, curr) => ({
                        prospectFte: acc.prospectFte + (curr.projectOrProspect === "Prospect" ? parseFloat(curr[monthKey]) || 0 : 0),
                        projectFte: acc.projectFte + (curr.projectOrProspect === "Project" ? parseFloat(curr[monthKey]) || 0 : 0),
                        changeFte: acc.changeFte + (curr.projectOrProspect === "Change" ? parseFloat(curr[monthKey]) || 0 : 0),
                    }),
                    { prospectFte: 0, projectFte: 0, changeFte: 0 }
                );

                const fteForecast = totalFTE.prospectFte + totalFTE.projectFte + totalFTE.changeFte;
                setTotalUtilizationHeadcount(fteForecast === 0 ? 0 : parseFloat(fteForecast.toFixed(2)));
            } catch (error) {
                console.error("Error fetching project data:", error);
            }
        };

        fetchProjectData();
    }, []);

    const handleOpenModal = (type: string) => {
        setIsModalOpen(true);
        setModalType(type);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalType(null);
    };

    const widgetData: WidgetProps[] = [
        {
            id: "totalProjectCount",
            widgetText: "Total Project(s)",
            widgetNumber: "5",
            iconName: "user" as const,
            onButtonClickfunc: () => handleOpenModal("totalProjects"),
        },
        {
            id: "totalAvailableHeadcount",
            widgetText: "Available Headcount",
            widgetNumber: "10",
            iconName: "user-minus" as const,
            onButtonClickfunc: () => handleOpenModal("availableHeadCount"),
        },
        {
            id: "totalUtilizationHeadcount",
            widgetText: "FTE Forecast",
            widgetNumber: totalUtilizationHeadcount.toString(),
            iconName: "user" as const,
        },
        {
            id: "totalUnallocatedResourcesHeadcount",
            widgetText: "Unallocated Resources",
            widgetNumber: "40",
            iconName: "user" as const,
            onButtonClickfunc: () => handleOpenModal("unallocatedResource"),
        },
        {
            id: "partiallyAllocatedResourcesHeadcount",
            widgetText: "Partially Allocated Resources",
            widgetNumber: "90", // Provide a default value
            iconName: "user-minus" as const,
            onButtonClickfunc: () => handleOpenModal("partiallyAllocatedResources"),
        },
    ];

    return (
        <div className="flex flex-col gap-3">
            <Widgets widgetData={widgetData} />

            {modalType === "totalProjects" && (
                <TotalProjectModal isOpen={isModalOpen} onClose={handleCloseModal} />
            )}

            {modalType === "availableHeadCount" && (
                <AvailableHeadCountModal isOpen={isModalOpen} onClose={handleCloseModal} />
            )}

            {modalType === "unallocatedResource" && (
                <UnallocatedResourceModal isOpen={isModalOpen} onClose={handleCloseModal} />
            )}

            {modalType === "partiallyAllocatedResources" && (
                <PartiallyAllocatedResource isOpen={isModalOpen} onClose={handleCloseModal} />
            )}
        </div>
    );
}
