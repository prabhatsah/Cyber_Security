"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { IconButtonWithTooltip, IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import EditOrgDetailsModal from "../edit-organization/org-edit-modal-form";

function CreateOrgButtonWithModal(data: any) {
  const [isModalOpen, setModalOpen] = useState(false);
  var selectId = (Object.keys(data.data).length + 1).toString();
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };
  return (
    <>
      {/* <IconButtonWithTooltip
        tooltipContent="Create Organization"
        variant="outline"
        onClick={toggleModal}
      >
        <Plus />
      </IconButtonWithTooltip> */}

      <IconTextButtonWithTooltip
        tooltipContent="Create Organization"
        variant="outline"
        onClick={toggleModal}
      >
        <Plus /> Organization
      </IconTextButtonWithTooltip>
      <EditOrgDetailsModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        selectedId={selectId}
      />
    </>
  );
}

export default CreateOrgButtonWithModal;
