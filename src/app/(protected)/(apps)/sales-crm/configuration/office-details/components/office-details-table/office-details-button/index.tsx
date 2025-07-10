"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import OfficeDetailsModal from "../office-details-modal";

function AddOfficeDtailsButtonWithModal(data: any) {
  const [isModalOpen, setModalOpen] = useState(false);
  console.log("office details ", data);
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };
  return (
    <>
      <IconTextButtonWithTooltip tooltipContent="Add/Edit Office Details" variant="outline" onClick={toggleModal}>
        <Plus />
      </IconTextButtonWithTooltip>
      <OfficeDetailsModal isOpen={isModalOpen} onClose={toggleModal}/>
    </>
  );
}

export default AddOfficeDtailsButtonWithModal;
