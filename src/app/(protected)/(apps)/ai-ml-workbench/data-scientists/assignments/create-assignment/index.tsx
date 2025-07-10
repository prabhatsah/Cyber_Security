"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import AssignmentModal from "./createAssignmentModalForm";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";

function CreateAssignmentButtonWithModal() {
  const [isModalOpen, setModalOpen] = useState(false); //State to control modal visibility

  // Toggle modal function
  const toggleModal = () => {
    setModalOpen((prev) => !prev); // Toggle modal visibility
  };

  return (
    <>
      <IconButtonWithTooltip
        tooltipContent="Create Assignment"
        onClick={toggleModal}
      >
        <Plus />
      </IconButtonWithTooltip>
      <AssignmentModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
}

export default CreateAssignmentButtonWithModal;
