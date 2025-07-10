"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import EditRoleModal from "../role-edit-modal-form";

function CreateRoleButtonWithModal(data: any) {
  const [isModalOpen, setModalOpen] = useState(false);
  console.log("Role ", data);
  var selectId = (Object.keys(data.data).length + 1).toString();
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };
  return (
    <>
      {/* <IconButtonWithTooltip
        tooltipContent="Create Role"
        variant="outline"
        onClick={toggleModal}
      >
        <Plus />
      </IconButtonWithTooltip> */}

      <IconTextButtonWithTooltip
        tooltipContent="Create Role"
        variant="outline"
        onClick={toggleModal}
      >
        <Plus /> Role
      </IconTextButtonWithTooltip>
      <EditRoleModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        selectedId={selectId}
      />
    </>
  );
}

export default CreateRoleButtonWithModal;
