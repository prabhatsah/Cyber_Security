"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import ServerFormModal from "./CreateServerModalForm";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";

function CreateServerButtonWithModal() {
  const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility

  // Toggle modal function
  const toggleModal = () => {
    setModalOpen((prevModalState) => !prevModalState); // Toggle modal visibility
  };
  return (
    <>
      <IconButtonWithTooltip
        tooltipContent="Create New Server"
        onClick={toggleModal}
      >
        <Plus />
      </IconButtonWithTooltip>
      <ServerFormModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
}

export default CreateServerButtonWithModal;
