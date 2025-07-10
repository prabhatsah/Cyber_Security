"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import EditFXModal from "../edit-fx-rate-modal";


export default function CreateFXRateButtonWithModal(fxRates:any) {
  const [isModalOpen, setModalOpen] = useState(false);
 const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };
  return (
    <>
      <IconTextButtonWithTooltip
        tooltipContent="Create FX Rate"
        variant="outline"
        onClick={toggleModal}
      >
        <Plus /> FX Rate
      </IconTextButtonWithTooltip>
      <EditFXModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        selectedFX={null}
      />
    </>
  );
}

 