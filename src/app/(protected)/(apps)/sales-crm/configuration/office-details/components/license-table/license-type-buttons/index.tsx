"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import LicenseTypeModal from "../license-modal";

function LicenseButtonWithModal(data: any) {
  const [isModalOpen, setModalOpen] = useState(false);
  console.log("License ", data);
  //var selectId = (Object.keys(data.data).length + 1).toString();
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };
  return (
    <>
      <IconTextButtonWithTooltip tooltipContent="Add License" variant="outline" onClick={toggleModal}>
        <Plus />
      </IconTextButtonWithTooltip>
      <LicenseTypeModal isOpen={isModalOpen} onClose={toggleModal} selectedId={null} />
    </>
  );
}

export default LicenseButtonWithModal;
