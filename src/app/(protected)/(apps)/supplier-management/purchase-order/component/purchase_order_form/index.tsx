"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import PurchaseOrderModal from "./purchase_order_modal";


export default function CreatePurchaseOrderButtonWithModal(purchaseData:any) {
  const [isModalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };
  return (
    <>
      <IconTextButtonWithTooltip
        tooltipContent="Create PO Manually"
        variant="outline"
        onClick={toggleModal}
      >
        <Plus /> Create PO
      </IconTextButtonWithTooltip>
      <PurchaseOrderModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        purchaseData={purchaseData}
      />
    </>
  );
}
