"use client";
import { useState } from "react";
import { Edit, Plus } from "lucide-react";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import EditPurchaseOrderModal from "./purchaseOrderEditModal";

export default function EditPurchaseOrderButtonWithModal(purchaseData: any,itemData:any) {
  const [isModalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };
  return (
    <>
      <IconTextButtonWithTooltip
        tooltipContent="Edit Purchase Order"
        variant="outline"
        onClick={toggleModal}
      >
        <Edit /> Purchase Order
      </IconTextButtonWithTooltip>
      <EditPurchaseOrderModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        purchaseData={purchaseData}
        itemData={itemData}
      />
    </>
  );
}
