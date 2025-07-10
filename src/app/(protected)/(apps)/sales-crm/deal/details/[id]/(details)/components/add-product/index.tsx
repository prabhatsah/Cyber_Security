"use client"
import { useState } from "react";
import { Circle, Plus, PlusCircle } from "lucide-react";
import CreateProductDetailsForm from "./components_add_product/add_product_form_definition";
import { DealProductDetailsData } from "@/app/(protected)/(apps)/sales-crm/components/type";
import { IconButtonWithTooltip, IconTextButtonWithTooltip } from "@/ikon/components/buttons";


function AddProductButtonWithModal({ dealIdentifier }: { dealIdentifier: string }) {
    const [isModalOpen, setModalOpen] = useState(false);
    console.log("deal identifier ", dealIdentifier)
    
    const toggleModal = () => {
        setModalOpen((prev) => !prev);
    };
    return (
        <>

            <IconTextButtonWithTooltip tooltipContent="Add New Product" onClick={toggleModal}>
                <Plus /> Product
            </IconTextButtonWithTooltip>
            <CreateProductDetailsForm isOpen={isModalOpen} onClose={toggleModal} dealIdentifier={dealIdentifier} />

        </>
    )
}

export default AddProductButtonWithModal