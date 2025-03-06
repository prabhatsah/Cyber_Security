"use client";

import { Button } from "@/components/Button";
import CloudConfigurationFormModal from "./CloudConfigurationFormModal";
import { useState } from "react";

export default function AddConfigurationBtnWithFormDialog({
  btnText,
  serviceName,
}: {
  btnText: string;
  serviceName: string;
}) {
  const [isFormModalOpen, setFormModalOpen] = useState(false); // State to control modal visibility

  // Toggle modal function
  const toggleFormModal = () => {
    setFormModalOpen((prevModalState) => !prevModalState); // Toggle modal visibility
  };

  return (
    <>
      <Button onClick={toggleFormModal}>{btnText}</Button>
      <CloudConfigurationFormModal
        serviceName={serviceName}
        isFormModalOpen={isFormModalOpen}
        onClose={toggleFormModal}
      />
    </>
  );
}
