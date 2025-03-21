import { GoogleCloudConfiguration } from "@/app/configuration/components/type";
import { RiEdit2Line } from "@remixicon/react";
import { Card } from "@tremor/react";
import { format } from "date-fns";
import { useState } from "react";
import GoogleCloudConfigFormModal from "../../config-forms/GoogleCloudConfigFormModal";

export default function GoogleCloudConfigWidget({
  serviceUrl,
  eachConfigDetails,
}: {
  serviceUrl: string;
  eachConfigDetails: GoogleCloudConfiguration;
}) {
  const [isEditFormOpen, setEditFormOpen] = useState(false);

  const toggleFormModal = () => {
    setEditFormOpen((prev) => !prev);
  };

  const configNameWords = eachConfigDetails.configurationName
    .trim()
    .split(/\s+/);
  let configNameInitial = "";
  if (configNameWords.length === 1) {
    configNameInitial = configNameWords[0][0].toUpperCase();
  } else {
    const firstInitial = configNameWords[0][0].toUpperCase();
    const lastInitial =
      configNameWords[configNameWords.length - 1][0].toUpperCase();
    configNameInitial = firstInitial + lastInitial;
  }

  return (
    <>
      <Card key={eachConfigDetails.configId} className="group p-4 rounded-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <span
              className="text-blue-800 dark:text-blue-500 bg-blue-100 dark:bg-blue-500/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-tremor-default font-medium"
              aria-hidden={true}
            >
              {configNameInitial}
            </span>
            <div className="truncate">
              <p className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {eachConfigDetails.configurationName}
              </p>
              <p className="truncate text-tremor-default text-gray-600 dark:text-gray-300">
                {eachConfigDetails.projectId}
              </p>
            </div>
          </div>

          <button onClick={toggleFormModal} className="text-blue-700 dark:text-blue-700 hover:text-blue-800 hover:dark:text-blue-600 cursor-pointer">
            <RiEdit2Line className="size-5" aria-hidden={true} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 divide-x divide-tremor-border border-t border-tremor-border dark:divide-dark-tremor-border dark:border-dark-tremor-border">
          <div className="truncate px-3 py-2">
            <p className="truncate text-tremor-label text-tremor-content dark:text-dark-tremor-content">
              Created By
            </p>
            <p className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {eachConfigDetails.createdBy.userName}
            </p>
          </div>

          <div className="truncate px-3 py-2">
            <p className="truncate text-tremor-label text-tremor-content dark:text-dark-tremor-content">
              Created On
            </p>
            <p className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {format(eachConfigDetails.createdOn, "dd-MMM-yyyy HH:mm")}
            </p>
          </div>
        </div>
      </Card>

      {/* Edit Form Modal */}
      <GoogleCloudConfigFormModal
        serviceUrl={serviceUrl}
        isFormModalOpen={isEditFormOpen}
        onClose={toggleFormModal}
        savedDataToBePopulated={eachConfigDetails}
      />
    </>
  );
}
