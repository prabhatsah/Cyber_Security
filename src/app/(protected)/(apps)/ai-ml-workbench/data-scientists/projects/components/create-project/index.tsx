"use client";

import { useState } from "react";
// import ButtonWithTooltip from "@/components/ikon-components/buttonWithTooltip";
import { Circle, Plus, PlusCircle } from "lucide-react";
import CreateProjectModalForm from "./createProjectModalForm";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
//import CreateLeadModalForm from "../../../../deal/details/component/create-deal/CreateLeadModalForm";

function CreateProjectButtonWithModal() {
  const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility

  // Toggle modal function
  const toggleModal = () => {
    setModalOpen((prev) => !prev); // Toggle modal visibility
  };
  return (
    <>
      <IconButtonWithTooltip
        tooltipContent="Create New Server"
        onClick={toggleModal}
      >
        <Plus />
      </IconButtonWithTooltip>
      {/* <CreateProjectModalForm isOpen={isModalOpen} onClose={toggleModal} /> */}
      <CreateProjectModalForm isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
}

export default CreateProjectButtonWithModal;
