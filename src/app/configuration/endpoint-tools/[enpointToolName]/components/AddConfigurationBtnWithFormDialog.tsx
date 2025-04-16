"use client";

import { Button } from "@/components/Button";
import { useState } from "react";
import WazuhAgentConfigFormModal from "./config-forms/WazuhAgentConfigFormModal";

const globalFormMap: Record<
  string,
  React.FC<{
    isFormModalOpen: boolean;
    onClose: () => void;
    enpointToolUrl: string;
  }>
> = {
  "wazuh-agent": WazuhAgentConfigFormModal,
};

export default function AddConfigurationBtnWithFormDialog({
  btnText,
  enpointToolUrl,
}: {
  btnText: string;
  enpointToolUrl: string;
}) {
  const [isFormModalOpen, setFormModalOpen] = useState(false);

  const toggleFormModal = () => {
    setFormModalOpen((prev) => !prev);
  };

  // Get the corresponding form component
  const ConfigFormModal = globalFormMap[enpointToolUrl];

  return (
    <>
      <Button onClick={toggleFormModal}>{btnText}</Button>
      {ConfigFormModal && (
        <ConfigFormModal
          enpointToolUrl={enpointToolUrl}
          isFormModalOpen={isFormModalOpen}
          onClose={toggleFormModal}
        />
      )}
    </>
  );
}
