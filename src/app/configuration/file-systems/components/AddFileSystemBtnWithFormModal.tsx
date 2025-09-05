"use client";

import { Button } from "@/components/Button";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import FileSystemConfigForm from "./FileSystemConfigForm";

export default function AddFileSystemBtnWithFormModal() {
    const [isFormModalOpen, setFormModalOpen] = useState(false);

    const toggleFormModal = () => {

        setFormModalOpen((prev) => !prev);
    };

    return (
        <>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={toggleFormModal}>
                <Plus className="w-4 h-4 mr-2" />
                Add Configuration
            </Button>
            {FileSystemConfigForm && (
                <FileSystemConfigForm
                    isFormModalOpen={isFormModalOpen}
                    onClose={toggleFormModal}
                />
            )}
        </>
    )
}