"use client"
import { useState } from "react";
//import ButtonWithTooltip from '@/ikon/components/buttonWithTooltip';
import CreateTicketModalForm from "./CreateTicketModalFrom";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
//import CreateLeadModalForm from "../../../../deal/details/component/create-deal/CreateLeadModalForm";
import { Plus } from "lucide-react";

function CreateTicketButtonWithModal() {
    console.log("Rendering CreateTicketButtonWithModal");

    const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility

    // Toggle modal function
    const toggleModal = () => {
        setModalOpen((prev) => !prev);  // Toggle modal visibility
    };
        return (
            <div>
              {/* <IconButtonWithTooltip  tooltip="Create Ticket" icon={<Plus />} text={''} onClick={toggleModal} /> */}
              <IconButtonWithTooltip tooltipContent="Create Ticket" onClick={toggleModal}>
                    <Plus />
                </IconButtonWithTooltip>
              <CreateTicketModalForm isOpen={isModalOpen} onClose={toggleModal} />
            </div>
          );   
}

export default CreateTicketButtonWithModal;