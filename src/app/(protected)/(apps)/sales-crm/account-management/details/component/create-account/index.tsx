"use client"
import { useState } from "react";
//import ButtonWithTooltip from '@/ikon/components/buttonWithTooltip';
import { Plus, PlusCircle } from "lucide-react";
//import CreateDealModalForm from "./components/deal_form_definition";
import { IconTextButtonWithTooltip, TextButtonWithTooltip } from "@/ikon/components/buttons";
import CreateAccountModalForm from "./components/account-form-definition";

function CreateAccountButtonWithModal() {
    const [isModalOpen, setModalOpen] = useState(false); 
    const toggleModal = () => {
        setModalOpen((prev) => !prev); 
    };
    return (
        <>
            <IconTextButtonWithTooltip tooltipContent={"Create Account"} onClick={toggleModal}><Plus/> Account</IconTextButtonWithTooltip>
             <CreateAccountModalForm isOpen={isModalOpen} onClose={toggleModal}/> 
        </>
    )
}

export default CreateAccountButtonWithModal