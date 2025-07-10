"use client";
import { useState } from "react";
import { Plus, PlusCircle, Upload } from "lucide-react";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import OpenModal from "../response-upload-form";

export default function CreateResponseUploadButtonWithModal() {
  const [isModalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  return (
    <>
      <IconButtonWithTooltip
        tooltipContent="Upload Response File"
        onClick={toggleModal}
      >
        <Upload />
      </IconButtonWithTooltip>
      <OpenModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
}
