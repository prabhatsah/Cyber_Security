"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import BankingDetailsModal from "../banking-details-modal";

function BankDetailsButtonWithModal(data: any) {
  const [isModalOpen, setModalOpen] = useState(false);
  console.log("BankingDetails", data);
  //var selectId = (Object.keys(data.data).length + 1).toString();
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };
  return (
    <>
      <IconTextButtonWithTooltip tooltipContent="Add Banking Details" variant="outline" onClick={toggleModal}>
        <Plus />
      </IconTextButtonWithTooltip>
      <BankingDetailsModal isOpen={isModalOpen} onClose={toggleModal} selectedId={null} />
    </>
  );
}

export default BankDetailsButtonWithModal;
