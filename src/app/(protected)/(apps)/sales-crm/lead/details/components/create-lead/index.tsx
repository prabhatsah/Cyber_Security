"use client"
import { useState } from "react";
import { Circle, Plus, PlusCircle } from "lucide-react";
//import CreateLeadModalForm from "./CreateLeadModalForm_Old";
import { IconButtonWithTooltip, IconTextButtonWithTooltip, TextButtonWithTooltip } from "@/ikon/components/buttons";
import LeadModal from "../create_lead_definition";
//import CreateLeadModalForm from "../../../../deal/details/component/create-deal/CreateLeadModalForm";

function CreateLeadButtonWithModal() {
    const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility

    // Toggle modal function
    const toggleModal = () => {
        setModalOpen((prev) => !prev);  // Toggle modal visibility
    };
    return (
        <>

            {/* <IconButtonWithTooltip tooltipContent={"Create Lead"} onClick={toggleModal} >< Plus /></IconButtonWithTooltip> */}

            <IconTextButtonWithTooltip tooltipContent={"Create Lead"} onClick={toggleModal} >< Plus /> Lead</IconTextButtonWithTooltip>
            <LeadModal isOpen={isModalOpen} onClose={toggleModal} />
        </>
    )
}

export default CreateLeadButtonWithModal