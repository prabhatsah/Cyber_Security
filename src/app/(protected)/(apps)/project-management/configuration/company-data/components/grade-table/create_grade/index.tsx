"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import EditGradeModal from "../grade-edit-modal-form";
import { v4 } from "uuid";

function CreateGradeButtonWithModal(data: any) {
  const [isModalOpen, setModalOpen] = useState(false);
  console.log("Grade ", data.data);
  var selectId = v4();
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };
  return (
    <>
      <IconTextButtonWithTooltip
        tooltipContent="Create Role"
        variant="outline"
        onClick={toggleModal}
      >
        <Plus /> Grade
      </IconTextButtonWithTooltip>
      <EditGradeModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        selectedId={selectId}
      />
    </>
  );
}

export default CreateGradeButtonWithModal;
