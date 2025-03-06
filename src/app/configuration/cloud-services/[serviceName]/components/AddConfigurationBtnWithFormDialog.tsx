"use client";

import { Button } from "@/components/Button";
import { useState } from "react";
import GoogleCloudConfigFormModal from "./config-forms/GoogleCloudConfigFormModal";
import MicrosoftAzureConfigFormModal from "./config-forms/MicrosoftAzureConfigFormModal";
import AmazonWebServicesConfigFormModal from "./config-forms/AmazonWebServicesConfigFormModal";
import IbmCloudConfigFormModal from "./config-forms/IbmCloudConfigFormModal";
import OracleCloudConfigFormModal from "./config-forms/OracleCloudConfigFormModal";
import AlibabaCloudConfigFormModal from "./config-forms/AlibabaCloudConfigFormModal";

const globalFormMap: Record<
  string,
  React.FC<{
    isFormModalOpen: boolean;
    onClose: () => void;
    serviceNameInUrl: string;
  }>
> = {
  "amazon-web-services": AmazonWebServicesConfigFormModal,
  "microsoft-azure": MicrosoftAzureConfigFormModal,
  "google-cloud-platform": GoogleCloudConfigFormModal,
  "ibm-cloud": IbmCloudConfigFormModal,
  "oracle-cloud-infrastructure": OracleCloudConfigFormModal,
  "alibaba-cloud": AlibabaCloudConfigFormModal,
};

export default function AddConfigurationBtnWithFormDialog({
  btnText,
  serviceNameInUrl,
}: {
  btnText: string;
  serviceNameInUrl: string;
}) {
  const [isFormModalOpen, setFormModalOpen] = useState(false);

  const toggleFormModal = () => {
    setFormModalOpen((prev) => !prev);
  };

  // Get the corresponding form component
  const ConfigFormModal = globalFormMap[serviceNameInUrl];

  return (
    <>
      <Button onClick={toggleFormModal}>{btnText}</Button>
      {ConfigFormModal && (
        <ConfigFormModal
          serviceNameInUrl={serviceNameInUrl}
          isFormModalOpen={isFormModalOpen}
          onClose={toggleFormModal}
        />
      )}
    </>
  );
}
