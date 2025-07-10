"use client"
import { useState } from "react";
//import ButtonWithTooltip from '@/ikon/components/buttonWithTooltip';
import { Plus, PlusCircle } from "lucide-react";
import CreateDealModalForm from "./components/deal_form_definition";
import { IconTextButtonWithTooltip, TextButtonWithTooltip } from "@/ikon/components/buttons";

function CreateDealButtonWithModal({ dealsData, accountData, productData }: { dealsData: any; accountData: any; productData:any }) {
    const [isModalOpen, setModalOpen] = useState(false); 
    const toggleModal = () => {
        setModalOpen((prev) => !prev); 
    };
    return (
        <>
            <IconTextButtonWithTooltip tooltipContent={"Create Deal"} onClick={toggleModal}><Plus/> Deal</IconTextButtonWithTooltip>
            <CreateDealModalForm isOpen={isModalOpen} onClose={toggleModal} dealsData={dealsData} accountData={accountData} productData={productData}/>
        </>
    )
}

export default CreateDealButtonWithModal