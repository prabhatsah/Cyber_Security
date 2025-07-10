"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import BillingModal from "../billing-modal";

export default function CreateBillingButtonWithModal() {
  const [isModalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };
  return (
    <>
      <IconTextButtonWithTooltip
        tooltipContent="Create Billing"
        variant="outline"
        onClick={toggleModal}
      >
        <Plus /> Billing
      </IconTextButtonWithTooltip>
      <BillingModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        selectedAcc={undefined}
      />
    </>
  );
}
