"use client"
import { useState } from "react";
import { Plus, PlusCircle, Upload } from "lucide-react";
import OpenRfpModal from "../rfp-upload-form";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";

export default function CreateRFPButtonWithModal() {
    const [isModalOpen, setModalOpen] = useState(false);
    const toggleModal = () => {
        setModalOpen((prev) => !prev);
    };

    return (
      <>
        <IconButtonWithTooltip
          tooltipContent="Upload RFP"
          onClick={toggleModal}
        >
          <Upload />
        </IconButtonWithTooltip>
        <OpenRfpModal isOpen={isModalOpen} onClose={toggleModal} />
      </>
    );

}