"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import WorkingDaysModal from "../working-days-modal";

function WorkingDaysButtonWithModal(data: any) {
  const [isModalOpen, setModalOpen] = useState(false);
  console.log("WorkingDays", data);
  //var selectId = (Object.keys(data.data).length + 1).toString();
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };
  return (
    <>
      <IconTextButtonWithTooltip tooltipContent="Add Working Days" variant="outline" onClick={toggleModal}>
        <Plus />
      </IconTextButtonWithTooltip>
      <WorkingDaysModal isOpen={isModalOpen} onClose={toggleModal} selectedId={null} />
    </>
  );
}

export default WorkingDaysButtonWithModal;
