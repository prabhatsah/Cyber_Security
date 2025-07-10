"use client";

import { useState } from "react";
//import ButtonWithTooltip from "@/ikon/components/buttonWithTooltip";
import { Plus } from "lucide-react";
import ExpenseModal from "./AddExpenseModal";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";

export default function AddExpenseButton({ productIdentifier }: { productIdentifier: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="flex flex-row items-center justify-end">
                <IconButtonWithTooltip tooltipContent="Add/Edit Expenses" onClick={handleOpenModal}>
                    <Plus />
                </IconButtonWithTooltip>
            </div>
            <ExpenseModal isOpen={isModalOpen} onClose={handleCloseModal} productIdentifier={productIdentifier} />
        </>
    );
}
