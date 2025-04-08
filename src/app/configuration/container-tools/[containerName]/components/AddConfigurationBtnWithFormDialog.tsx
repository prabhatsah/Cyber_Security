"use client";

import { Button } from "@/components/Button";
import { useState } from "react";
import TrivyConfigFormModal from "./config-forms/TrivyConfigFormModal";
// import { addCloudEntry, createTable } from "./apis/cloudConfigDataHandler";

const globalFormMap: Record<
  string,
  React.FC<{
    isFormModalOpen: boolean;
    onClose: () => void;
    containerUrl: string;
  }>
> = {
  "trivy": TrivyConfigFormModal,
  
};

export default function AddConfigurationBtnWithFormDialog({
  btnText,
  containerUrl,
}: {
  btnText: string;
  containerUrl: string;
}) {
  const [isFormModalOpen, setFormModalOpen] = useState(false);

  const toggleFormModal = () => {
    setFormModalOpen((prev) => !prev);
  };

  // Get the corresponding form component
  const ConfigFormModal = globalFormMap[containerUrl];

  return (
    <>
      <Button onClick={toggleFormModal}>{btnText}</Button>
      {ConfigFormModal && (
        <ConfigFormModal
        containerUrl={containerUrl}
          isFormModalOpen={isFormModalOpen}
          onClose={toggleFormModal}
        />
      )}
    </>
  );
}
