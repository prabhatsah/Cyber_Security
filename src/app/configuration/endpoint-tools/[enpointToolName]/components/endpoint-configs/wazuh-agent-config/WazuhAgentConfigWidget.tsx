"use client";

import { WazuhAgentConfiguration } from "@/app/configuration/components/type";
import { RiDeleteBin6Line, RiEdit2Line, RiUbuntuFill, RiWindowsFill } from "@remixicon/react";
import { Card } from "@tremor/react";
import { format } from "date-fns";
import { useState } from "react";

import { deleteConfigWithKey } from "@/utils/api";
import WazuhAgentConfigFormModal from "../../config-forms/WazuhAgentConfigFormModal";
import { Callout } from "@/components/Callout";

interface WazuhAgentConfigWidgetProps {
  enpointToolUrl: string;
  eachConfigDetails: WazuhAgentConfiguration;
}

export default function WazuhAgentConfigWidget({
  enpointToolUrl,
  eachConfigDetails,
}: WazuhAgentConfigWidgetProps) {
  const [isEditFormOpen, setEditFormOpen] = useState(false);

  function toggleFormModal() {
    setEditFormOpen((prev) => !prev);
  }

  async function handleDeleteConfig(configId: string) {
    try {
      await deleteConfigWithKey("endpoint_config", "configId", configId);
    } catch (error) {
      console.error("Error deleting configuration:", error);
    }
  }

  /**
   * Match the OS type against the lowercase values
   * we now use in the form: "windows" or "ssh"
   */
  const lowerOsType = eachConfigDetails.osType.toLowerCase();
  const DisplayIcon = lowerOsType === "windows" ? RiWindowsFill : RiUbuntuFill;

  // For date handling, ensure the value passed to format is a Date object
  const createdOnDate = new Date(eachConfigDetails.createdOn);

  return (
    <>
      <Card key={eachConfigDetails.configId} className="group p-4 rounded-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <span
              className="text-blue-800 dark:text-blue-500 bg-blue-100 dark:bg-blue-500/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-tremor-default font-medium"
              aria-hidden={true}
            >
              <DisplayIcon />
            </span>
            <div className="truncate">
              <p className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {eachConfigDetails.configurationName}
              </p>
              <p className="truncate text-tremor-default text-gray-600 dark:text-gray-300">
                {eachConfigDetails.managerIp}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              title="Edit Configuration"
              onClick={toggleFormModal}
              className="border-r border-dark-bgTertiary pr-3 text-blue-700 dark:text-blue-700 hover:text-blue-800 hover:dark:text-blue-600 cursor-pointer"
            >
              <RiEdit2Line className="size-5" aria-hidden={true} />
            </button>
            <button
              title="Delete Configuration"
              onClick={() => handleDeleteConfig(eachConfigDetails.configId)}
              className="pl-3 text-blue-700 dark:text-blue-700 hover:text-blue-800 hover:dark:text-blue-600 cursor-pointer"
            >
              <RiDeleteBin6Line className="size-5" aria-hidden={true} />
            </button>
          </div>
        </div>

        <div className="mt-6">
          <Callout variant="default" title="Probe Details">
            <p className="truncate">
              Name:{" "}
              <span
                title={eachConfigDetails.probeDetails.probeName}
                className="truncate font-semibold"
              >
                {eachConfigDetails.probeDetails.probeName}
              </span>
            </p>
            <p className="truncate">
              ID:{" "}
              <span
                title={eachConfigDetails.probeDetails.probeId}
                className="truncate font-semibold"
              >
                {eachConfigDetails.probeDetails.probeId}
              </span>
            </p>
          </Callout>
        </div>

        <div className="grid grid-cols-2 mt-6 divide-x divide-tremor-border dark:divide-dark-tremor-border border-tremor-border dark:border-dark-tremor-border">
          <div className="truncate px-3 py-2">
            <h4 className="text-widget-secondaryheader">List of Devices</h4>
            <div className="mt-2 h-14 overflow-y-auto pr-2">
              <ul className="space-y-1">
                {eachConfigDetails.listOfDevices.map((eachDevice) => (
                  <li
                    key={eachDevice}
                    title={eachDevice}
                    className="truncate text-sm leading-6 text-tremor-content dark:text-dark-tremor-content"
                  >
                    {eachDevice}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="truncate px-3 py-2">
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="text-widget-secondaryheader">Python Server</h4>
                <ul className="mt-2 space-y-1">
                  <li className="truncate text-sm leading-6 text-tremor-content dark:text-dark-tremor-content">
                    IP:{" "}
                    <span
                      title={eachConfigDetails.pythonServerIp}
                      className="truncate text-widget-secondaryheader"
                    >
                      {eachConfigDetails.pythonServerIp}
                    </span>
                  </li>
                  <li className="truncate text-sm leading-6 text-tremor-content dark:text-dark-tremor-content">
                    Port:{" "}
                    <span
                      title={eachConfigDetails.pythonServerPort}
                      className="truncate text-widget-secondaryheader"
                    >
                      {eachConfigDetails.pythonServerPort}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
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
              {/* Convert to Date object if needed */}
              {format(createdOnDate, "dd-MMM-yyyy HH:mm")}
            </p>
          </div>
        </div>
      </Card>

      {/* Edit Form Modal */}
      <WazuhAgentConfigFormModal
        enpointToolUrl={enpointToolUrl}
        isFormModalOpen={isEditFormOpen}
        onClose={toggleFormModal}
        savedDataToBePopulated={eachConfigDetails}
      />
    </>
  );
}
