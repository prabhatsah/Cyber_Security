"use client"; // Ensure this is a client component in Next.js 13+

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {
  RiCheckboxCircleLine,
  RiCloseLine,
  RiCodeBoxLine,
  RiErrorWarningLine,
} from "@remixicon/react";
import {
  Dialog,
  DialogPanel,
  Divider,
  MultiSelect,
  MultiSelectItem,
  Select,
  SelectItem,
} from "@tremor/react";
import { format } from "date-fns";

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { IpInput } from "@/components/IpInput";
import { WazuhAgentConfiguration } from "@/app/configuration/components/type";
import { updateDataObject } from "@/utils/api";
import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";
import { addNewConfiguration } from "@/app/configuration/endpoint-tools/[enpointToolName]/components/apis/endPointConfigDataHandler";
import {
  configureWazuhAgent,
  prefillWazuhForm,
} from "@/app/api/wazuh/WazuhConfigService";

// Types
interface WazuhAgentConfigFormModalProps {
  enpointToolUrl: string;
  isFormModalOpen: boolean;
  onClose: () => void;
  savedDataToBePopulated?: WazuhAgentConfiguration;
}

interface FormState {
  configurationName: string;
  osType: string;
  listOfDevices: string[];
  probeId: string;
  managerIp: string;
  pythonServerIp: string;
  pythonServerPort: string;
}

interface ErrorState {
  [key: string]: string;
}

interface DeviceDetails {
  osType: string;
}

interface DeviceOption {
  value: string; // deviceId
  label: string; // Something like "1.2.3.4(hostName)"
  osType: string;
}

interface ProbeOption {
  probeName: string;
  probeId: string;
}

// Keep these at module scope if needed
let allDeviceOptions: DeviceOption[] = [];
let probeOptions: ProbeOption[] = [];
const devicesMap = new Map<string, DeviceDetails>();
const devicesKeyMap = new Map<string, string>();



export default function WazuhAgentConfigFormModal({
  enpointToolUrl,
  isFormModalOpen,
  onClose,
  savedDataToBePopulated,
}: WazuhAgentConfigFormModalProps) {
  // Derive display name from endpoint tool URL
  const enpointToolName = enpointToolUrl
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .trim();

  // State for devices filtered by OS
  const [filteredDeviceOptions, setFilteredDeviceOptions] = useState<
    DeviceOption[]
  >([]);

  // Form state
  const [formData, setFormData] = useState<FormState>({
    configurationName: savedDataToBePopulated?.configurationName ?? "",
    osType: savedDataToBePopulated?.osType ?? "",
    listOfDevices: savedDataToBePopulated?.listOfDevices ?? [],
    probeId: savedDataToBePopulated?.probeDetails?.probeId ?? "",
    managerIp: savedDataToBePopulated?.managerIp ?? "",
    pythonServerIp: savedDataToBePopulated?.pythonServerIp ?? "",
    pythonServerPort: savedDataToBePopulated?.pythonServerPort ?? "",
  });

  // Prefill data on mount
  useEffect(() => {
    const fetchPrefilledData = async () => {
      try {

        const [fetchedDevices, fetchedProbes] = await prefillWazuhForm();
        // Build device options
        const devicesMapByLabel: Record<string, DeviceOption> = {};

        fetchedDevices.forEach((device: any) => {
          const label = `${device.data.hostIp}(${device.data.hostName})`;
          // Save full details by deviceId
          devicesMap.set(device.data.deviceId, {
            ...device.data,
            osType: device.data.osType,
          });
          // For easy lookups by label
          devicesKeyMap.set(
            label,
            device.data.deviceId
          );

          devicesMapByLabel[label] = {
            label: label,
            value: device.data.deviceId,
            osType: device.data.osType,
          };
        });

        const devices: DeviceOption[] = Object.values(devicesMapByLabel);
        allDeviceOptions = devices;
        probeOptions = fetchedProbes;

        // If an OS is already selected (e.g., when editing), filter devices accordingly
        if (savedDataToBePopulated?.osType) {
          const existingOsType = savedDataToBePopulated.osType.toLowerCase();
          setFilteredDeviceOptions(
            devices.filter(
              (device) => device?.osType?.toLowerCase() === existingOsType
            )
          );
        } else if (formData.osType) {
          // If OS is selected in the form state, filter accordingly on initial load
          const initialOsType = formData.osType.toLowerCase();
          setFilteredDeviceOptions(
            devices.filter(
              (device) => device.osType?.toLowerCase() === initialOsType
            )
          );
        } else {
          // Otherwise, you can show all or none. Showing none for initial clarity.
          setFilteredDeviceOptions([]);
        }
      } catch (error) {
        console.error("Error fetching prefilled Wazuh form data:", error);
      }
    };

    fetchPrefilledData();
  }, []);

  // Error states and other feedback
  const [errors, setErrors] = useState<ErrorState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [testConnectionResult, setTestConnectionResult] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: ErrorState = {};

    if (!formData.osType.trim()) {
      newErrors.osType = "OS Type must be specified. Please select an OS!";
    }

    if (formData.configurationName.trim().length < 3) {
      newErrors.configurationName =
        "Configuration name must be at least 3 characters long.";
    }

    if (formData.listOfDevices.length <= 0) {
      newErrors.listOfDevices =
        "Please select one or more devices!";
    }

    if (!formData.probeId) {
      newErrors.probeId = "Please select a probe!";
    }

    if (!formData.managerIp.trim()) {
      newErrors.managerIp = "Manager IP is required.";
    }

    if (formData.osType === "ssh" && !formData.pythonServerIp.trim()) {
      newErrors.pythonServerIp = "Python Server IP is required for Ubuntu/SSH!";
    }

    if (formData.osType === "ssh" && !formData.pythonServerPort.trim()) {
      newErrors.pythonServerPort =
        "Python Server Port is required for Ubuntu/SSH!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (isFormModalOpen && savedDataToBePopulated) {
      setFormData({
        configurationName: savedDataToBePopulated.configurationName ?? "",
        osType: savedDataToBePopulated.osType ?? "",
        listOfDevices: savedDataToBePopulated.listOfDevices ?? [],
        probeId: savedDataToBePopulated.probeDetails?.probeId ?? "",
        managerIp: savedDataToBePopulated.managerIp ?? "",
        pythonServerIp: savedDataToBePopulated.pythonServerIp ?? "",
        pythonServerPort: savedDataToBePopulated.pythonServerPort ?? "",
      });

      // If needed, also recalculate your filtered device list:
      const existingOsType = savedDataToBePopulated.osType?.toLowerCase();
      if (existingOsType) {
        const filteredDevices = allDeviceOptions.filter(
          (device) => device?.osType?.toLowerCase() === existingOsType
        );
        setFilteredDeviceOptions(filteredDevices);
      }
    }
  }, [isFormModalOpen, savedDataToBePopulated]);


  // Standard input handler
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setErrors({});
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // IP input handler
  const handleIpInputChange = (inputName: string, ip: string) => {
    setErrors({});
    const fieldName = inputName.split("-")[0];
    setFormData((prev) => ({ ...prev, [fieldName]: ip }));
  };

  // (Optional) Test connection code
  const handleTestConnection = async (event: FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setTestConnectionResult("");
    // Simulate a connection test
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Replace with actual test logic

    // For demonstration purposes, randomly set connection status
    const isTestSuccessful = Math.random() > 0.5;
    setIsConnected(isTestSuccessful);
    setTestConnectionResult(isTestSuccessful ? "Connection successful!" : "Connection failed.");
    setIsLoading(false);
  };

  // Save a new configuration
  const handleFormSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Configure Wazuh agent on each selected device
      await Promise.all(
        formData.listOfDevices.map(async (key) => {
          const deviceId = devicesKeyMap.get(key);
          if (deviceId) {
            const deviceDetails = devicesMap.get(deviceId);
            if (deviceDetails) {
              await configureWazuhAgent(deviceDetails, formData.probeId);
            }
          }
        })
      );

      // Create the config metadata
      const configId = crypto.randomUUID();
      const loggedInUserDetails = await getLoggedInUserProfile();
      const createdBy = {
        userId: loggedInUserDetails.USER_ID,
        userName: loggedInUserDetails.USER_NAME,
      };
      const selectedProbe = probeOptions.find(
        (probe) => probe.probeId === formData.probeId
      );

      const dataToBeSaved: WazuhAgentConfiguration = {
        configId,
        toolName: "wazuh",
        configurationName: formData.configurationName,
        osType: formData.osType,
        listOfDevices: formData.listOfDevices,
        probeDetails: {
          probeId: formData.probeId,
          probeName: selectedProbe?.probeName ?? "",
        },
        managerIp: formData.managerIp,
        pythonServerIp: formData.pythonServerIp ?? "",
        pythonServerPort: formData.pythonServerPort ?? "",
        createdOn: format(new Date(), "yyyy-MMM-dd HH:mm:ss"),
        createdBy,
      };

      // Save the new config
      await addNewConfiguration(dataToBeSaved, enpointToolUrl);
      handleClose();
    } catch (error) {
      console.error("Error saving Wazuh agent configuration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing configuration
  const handleConfigUpdate = async (event: FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (savedDataToBePopulated) {
        // Reconfigure Wazuh agent for updated devices if needed
        await Promise.all(
          formData.listOfDevices.map(async (key) => {
            const deviceId = devicesKeyMap.get(key);
            if (deviceId) {
              const deviceDetails = devicesMap.get(deviceId);
              if (deviceDetails) {
                await configureWazuhAgent(deviceDetails, formData.probeId);
              }
            }
          })
        );

        // Update any fields you want in the "endpoint_config" table
        const updatedConfigData = [
          {
            key: "configurationName",
            value: formData.configurationName,
          },
          {
            key: "osType",
            value: formData.osType,
          },
          {
            key: "listOfDevices",
            value: formData.listOfDevices,
          },
          {
            key: "probeDetails",
            value: {
              probeId: formData.probeId,
              probeName: probeOptions.find(
                (probe) => probe.probeId === formData.probeId
              )?.probeName ?? "",
            },
          },
          {
            key: "managerIp",
            value: formData.managerIp,
          },
          {
            key: "pythonServerIp",
            value: formData.pythonServerIp ?? "",
          },
          {
            key: "pythonServerPort",
            value: formData.pythonServerPort ?? "",
          },
          // add more fields here as needed
        ];

        const tableName = "endpoint_config";
        const filterColumn = "configId";
        const filterColumnValue = savedDataToBePopulated.configId;
        await updateDataObject(
          tableName,
          updatedConfigData,
          filterColumn,
          filterColumnValue
        );
      }
      handleClose();
    } catch (error) {
      console.error("Error updating Wazuh agent configuration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal handler
  const handleClose = () => {
    setFormData({
      configurationName: "",
      osType: "",
      listOfDevices: [],
      probeId: "",
      managerIp: "",
      pythonServerIp: "",
      pythonServerPort: "",
    });
    setErrors({});
    setIsLoading(false);
    setTestConnectionResult("");
    setIsConnected(false);
    onClose();
  };

  // OS change -> filter device list
  const handleOsTypeChange = (osType: string) => {
    setFormData((prev) => ({ ...prev, osType, listOfDevices: [] }));
    const filtered = allDeviceOptions.filter(
      (device) => device.osType?.toLowerCase() === osType.toLowerCase()
    );
    setFilteredDeviceOptions(filtered);
  };

  return (
    <Dialog
      open={isFormModalOpen}
      onClose={handleClose}
      static
      className="z-[100]"
    >
      <DialogPanel className="overflow-visible rounded-md p-0 sm:max-w-5xl">
        <form
          onSubmit={
            savedDataToBePopulated ? handleConfigUpdate : handleFormSave
          }
        >
          {/* Header */}
          <div className="absolute right-0 top-0 pr-3 pt-3">
            <button
              type="button"
              className="rounded-sm p-2 text-tremor-content-subtle hover:bg-tremor-background-subtle hover:text-tremor-content dark:text-dark-tremor-content-subtle hover:dark:bg-dark-tremor-background-subtle hover:dark:text-tremor-content"
              onClick={handleClose}
              aria-label="Close"
            >
              <RiCloseLine className="size-5 shrink-0" aria-hidden={true} />
            </button>
          </div>
          <div className="border-b border-tremor-border px-6 py-4 dark:border-dark-tremor-border">
            <h3 className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {savedDataToBePopulated ? "Edit Configuration" : "Add Configuration"}
            </h3>
          </div>

          {/* Body */}
          <div className="max-h-[80vh] overflow-y-auto flex flex-col-reverse md:flex-row">
            {/* Left Section */}
            <div className="flex flex-col justify-between md:w-80 md:border-r md:border-tremor-border md:dark:border-dark-tremor-border">
              <div className="flex-1 grow">
                <div className="flex flex-col justify-between h-full border-t border-tremor-border p-6 dark:border-dark-tremor-border md:border-none">
                  <div className="flex flex-col space-y-6">
                    <div className="flex items-center space-x-3">
                      <div
                        className="flex size-12 shrink-0 items-center justify-center text-primary rounded-md
                          border border-tremor-border p-1 dark:border-dark-tremor-border"
                      >
                        <RiCodeBoxLine className="size-5" aria-hidden={true} />
                      </div>
                      <div>
                        <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                          {enpointToolName}
                        </h3>
                      </div>
                    </div>
                    <Divider />
                    <div className="flex flex-col space-y-2">
                      <h4 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        Description:
                      </h4>
                      <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                        Wazuh Agent collects and sends security data for threat detection.
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <h4 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        Supported functionality:
                      </h4>
                      <p className="text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                        Threat detection, log analysis, and security monitoring.
                      </p>
                    </div>
                  </div>

                  {isConnected && testConnectionResult ? (
                    <span className="w-fit inline-flex items-center gap-x-1 rounded-md bg-emerald-100 px-2 py-1 font-semibold text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-500">
                      <RiCheckboxCircleLine
                        className="-ml-0.5 size-4"
                        aria-hidden={true}
                      />
                      {testConnectionResult}
                    </span>
                  ) : (
                    testConnectionResult && (
                      <span className="w-fit inline-flex items-center gap-x-1 rounded-md bg-red-100 px-2 py-1 font-semibold text-red-800 dark:bg-red-400/20 dark:text-red-500">
                        <RiErrorWarningLine
                          className="-ml-0.5 size-4"
                          aria-hidden={true}
                        />
                        {testConnectionResult}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex items-center justify-between border-t border-tremor-border p-6 dark:border-dark-tremor-border">
                <Button variant="secondary" type="button" onClick={handleClose}>
                  Cancel
                </Button>

                {isLoading ? (
                  <Button isLoading>Loading</Button>
                ) : (
                  <>
                    {!savedDataToBePopulated && (
                      <Button variant="primary" type="button" onClick={handleTestConnection} className="mr-2">
                        Test Connection
                      </Button>
                    )}
                    <Button variant="primary" type="submit">
                      {savedDataToBePopulated ? "Update" : "Save"}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Right Section: Form Inputs */}
            <div className="flex-1 space-y-8 p-6 md:px-6 md:pb-20 md:pt-6">
              {/* OS Type */}
              <div>
                <div className="flex flex-col space-y-3">
                  <label
                    htmlFor="osType"
                    className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                  >
                    Select Operating System
                  </label>
                  <div className="flex flex-col gap-1">
                    <Select
                      id="osType"
                      name="osType"
                      className={
                        errors.osType
                          ? "w-full border border-red-500 rounded-md"
                          : "w-full"
                      }
                      value={formData.osType}
                      onValueChange={(val) => handleOsTypeChange(val)}
                    >
                      <SelectItem value="windows">Windows</SelectItem>
                      {/* The value for Ubuntu-based OS is "ssh" */}
                      <SelectItem value="ssh">Ubuntu</SelectItem>
                    </Select>

                    {errors.osType && (
                      <p className="text-xs text-red-500">{errors.osType}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Configuration Name */}
              <div>
                <div className="flex flex-col space-y-3">
                  <label
                    htmlFor="configurationName"
                    className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                  >
                    Configuration Name
                  </label>
                  <div className="flex flex-col gap-1">
                    <Input
                      id="configurationName"
                      name="configurationName"
                      value={formData.configurationName}
                      className={
                        errors.configurationName
                          ? "w-full border border-red-500 rounded-md"
                          : "w-full"
                      }
                      onChange={handleInputChange}
                      placeholder="Enter Configuration Name"
                    />

                    {errors.configurationName && (
                      <p className="text-xs text-red-500">
                        {errors.configurationName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Devices */}
              <div>
                <div className="flex flex-col space-y-3">
                  <label
                    htmlFor="listOfDevices"
                    className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                  >
                    Select List of Devices
                  </label>
                  <div className="flex flex-col gap-1">
                    <MultiSelect
                      id="listOfDevices"
                      name="listOfDevices"
                      className={
                        errors.listOfDevices
                          ? "w-full border border-red-500 rounded-md"
                          : "w-full"
                      }
                      value={formData.listOfDevices}
                      onValueChange={(val) =>
                        setFormData((prev) => ({
                          ...prev,
                          listOfDevices: val,
                        }))
                      }
                    >
                      {filteredDeviceOptions.map((device) => (
                        <MultiSelectItem
                          key={device.label}
                          value={device.label}
                        >
                          {device.label}
                        </MultiSelectItem>
                      ))}
                    </MultiSelect>

                    {errors.listOfDevices && (
                      <p className="text-xs text-red-500">
                        {errors.listOfDevices}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Probe */}
              <div>
                <div className="flex flex-col space-y-3">
                  <label
                    htmlFor="probeId"
                    className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                  >
                    Select Probe
                  </label>
                  <div className="flex flex-col gap-1">
                    <Select
                      id="probeId"
                      name="probeId"
                      className={
                        errors.probeId
                          ? "w-full border border-red-500 rounded-md"
                          : "w-full"
                      }
                      value={formData.probeId}
                      onValueChange={(val) =>
                        setFormData((prev) => ({ ...prev, probeId: val }))
                      }
                    >
                      {probeOptions.map((probe) => (
                        <SelectItem key={probe.probeId} value={probe.probeId}>
                          {probe.probeName}
                        </SelectItem>
                      ))}
                    </Select>

                    {errors.probeId && (
                      <p className="text-xs text-red-500">{errors.probeId}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Manager IP */}
              <div>
                <div className="flex flex-col space-y-3">
                  <label
                    htmlFor="managerIp"
                    className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                  >
                    Manager IP
                  </label>
                  <div className="flex flex-col gap-1">
                    <IpInput
                      name="managerIp"
                      id="managerIp"
                      error={!!errors.managerIp}
                      value={formData.managerIp}
                      onChangeFunction={handleIpInputChange}
                    />

                    {errors.managerIp && (
                      <p className="text-xs text-red-500">{errors.managerIp}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Python Server Info (only used for SSH/Ubuntu) */}

              <div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-3">
                    <label
                      htmlFor="pythonServerIp"
                      className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                    >
                      Python Server IP
                    </label>
                    <div className="flex flex-col gap-1">
                      <IpInput
                        name="pythonServerIp"
                        id="pythonServerIp"
                        error={!!errors.pythonServerIp}
                        value={formData.pythonServerIp}
                        onChangeFunction={handleIpInputChange}
                      />

                      {errors.pythonServerIp && (
                        <p className="text-xs text-red-500">
                          {errors.pythonServerIp}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <label
                      htmlFor="pythonServerPort"
                      className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                    >
                      Python Server Port
                    </label>
                    <div className="flex flex-col gap-1">
                      <Input
                        id="pythonServerPort"
                        name="pythonServerPort"
                        value={formData.pythonServerPort}
                        className={
                          errors.pythonServerPort
                            ? "w-full border border-red-500 rounded-md"
                            : "w-full"
                        }
                        onChange={handleInputChange}
                        placeholder="Enter Python Server Port Number"
                      />

                      {errors.pythonServerPort && (
                        <p className="text-xs text-red-500">
                          {errors.pythonServerPort}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* End of Form Inputs */}
            </div>
          </div>
        </form>
      </DialogPanel>
    </Dialog>
  );
}