"use client";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus } from "lucide-react";
import { useState } from "react";
import ProbeFormModal from "./CreateProbeModalForm";

function CreateProbeButtonWithModal() {
  const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility

  // Toggle modal function
  const toggleModal = () => {
    setModalOpen((prevModalState) => !prevModalState); // Toggle modal visibility
  };
  return (
    <>
      <IconButtonWithTooltip
        tooltipContent="Create New Probe"
        onClick={toggleModal}
      >
        <Plus />
      </IconButtonWithTooltip>
      <ProbeFormModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
}

export default CreateProbeButtonWithModal;
