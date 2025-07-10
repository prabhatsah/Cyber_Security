"use client";
import { useState } from "react";
import { Eye } from "lucide-react";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import PurchaseOrderViewModal from "./purchaseOrderViewModal";

export default function ViewPurchaseOrderButtonWithModal(purchaseData: any) {
  const [isModalOpen, setModalOpen] = useState(false);
  console.log("view purchaseData ",purchaseData)
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };
  return (
    <>
      <IconTextButtonWithTooltip
        tooltipContent="View Purchase Order"
        variant="outline"
        onClick={toggleModal}
      >
        <Eye /> Purchase Order
      </IconTextButtonWithTooltip>
      <PurchaseOrderViewModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        purchaseOrder={purchaseData.purchaseData[0]}
      />
    </>
  );
}
