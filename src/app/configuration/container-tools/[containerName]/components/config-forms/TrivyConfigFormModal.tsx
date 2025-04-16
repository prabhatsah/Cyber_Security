import { Input } from "@/components/Input";
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
import { useState } from "react";
import { Button } from "@/components/Button";
import { format } from "date-fns";
import { TrivyConfiguration } from "@/app/configuration/components/type";
import { updateDataObject } from "@/utils/api";
import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";
import { IpInput } from "@/components/IpInput";
import { SiTrivy } from "react-icons/si";
import { addNewConfiguration } from "../apis/containerConfigDataHandler";

export default function TrivyConfigFormModal({
  containerUrl,
  isFormModalOpen,
  onClose,
  savedDataToBePopulated,
}: {
  containerUrl: string;
  isFormModalOpen: boolean;
  onClose: () => void;
  savedDataToBePopulated?: TrivyConfiguration;
}) {
  const containerNameArray = containerUrl.split("-");
  let containerName = "";
  containerNameArray.forEach((eachPart) => {
    containerName +=
      eachPart.substring(0, 1).toUpperCase() +
      eachPart.substring(1, eachPart.length) +
      " ";
  });
  containerName.trim();

  // const { setConfigurationData } = useConfiguration();

  const [formData, setFormData] = useState({
    configurationName: savedDataToBePopulated?.configurationName ?? "",
    osType: savedDataToBePopulated?.osType ?? "",
    listOfDevices: savedDataToBePopulated?.listOfDevices ?? [],
    probeId: savedDataToBePopulated?.probeDetails.probeId ?? "",
    pythonServerIp: savedDataToBePopulated?.pythonServerIp ?? "",
    pythonServerPort: savedDataToBePopulated?.pythonServerPort ?? "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [testConnectionResult, setTestConnectionResult] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (formData.osType.trim().length <= 0) {
      newErrors.osType =
        "OS Type must be specified. Please select an OS type!";
    }

    if (formData.configurationName.trim().length < 3) {
      newErrors.configurationName =
        "Configuration name must be at least 3 characters long. Please provide a valid name!";
    }

    if (formData.listOfDevices.length <= 0) {
      newErrors.listOfDevices =
        "List of devices cannot be empty. Please select one or more devices!";
    }

    if (formData.probeId.length <= 0) {
      newErrors.probeId =
        "List of devices cannot be empty. Please select one or more devices!";
    }

    if (formData.pythonServerIp.trim().length <= 0) {
      newErrors.pythonServerIp =
        "Python Server IP must be specified. Please provide a valid Server IP!";
    }

    if (formData.pythonServerPort.trim().length <= 0) {
      newErrors.pythonServerPort =
        "Python Server Port must be specified. Please provide a valid Server Port!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setErrors({});

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIpInputChange = (inputName: string, ip: string) => {
    setErrors({});

    inputName = inputName.split("-")[0];
    setFormData((prev) => ({ ...prev, [inputName]: ip }));
  };

  const handleTestConnection = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    // setIsLoading(true);
    // setTestConnectionResult("");

    // const result = await GoogleCloudConnection(
    //   formData.projectId,
    //   formData.serviceAccountKey
    // );
    // if (result.success) {
    //   setTestConnectionResult("Connection Successfull");
    //   setIsConnected(true);
    // } else {
    //   setTestConnectionResult("Connection Failed!");
    // }

    // setIsLoading(false);
  };

  async function handleFormSave(event: React.FormEvent) {
    event.preventDefault();

    if (!validateForm()) return;

    const configId = crypto.randomUUID();
    const loggedInUserDetails = await getLoggedInUserProfile();
    const createdBy = {
      userId: loggedInUserDetails.USER_ID,
      userName: loggedInUserDetails.USER_NAME,
    }
    const dataToBeSaved: TrivyConfiguration = {
      configId: configId,
      containerName: "trivy",
      configurationName: formData.configurationName,
      osType: formData.osType,
      listOfDevices: formData.listOfDevices,
      probeDetails: {
        probeId: formData.probeId,
        probeName: probeList.filter(eachProbe => eachProbe.probeId === formData.probeId)[0].probeName,
      },
      pythonServerIp: formData.pythonServerIp,
      pythonServerPort: formData.pythonServerPort,
      createdOn: format(new Date(), "yyyy-MMM-dd HH:mm:ss"),
      createdBy: createdBy,
    };

    addNewConfiguration(dataToBeSaved, containerUrl);
    handleClose();

  };

  async function handleConfigUpdate(event: React.FormEvent) {
    event.preventDefault();

    if (!validateForm()) return;

    if (savedDataToBePopulated) {
      const updatedConfigData = [
        {
          key: "configurationName",
          value: formData.configurationName
        },
      ];

      const tableName = "container_config";
      const filterColumn = "configId";
      const filterColumnValue = savedDataToBePopulated.configId;
      await updateDataObject(tableName, updatedConfigData, filterColumn, filterColumnValue);
    }
    handleClose();
  }

  const handleClose = () => {
    setFormData({
      configurationName: "",
      osType: "",
      listOfDevices: [],
      probeId: "",
      pythonServerIp: "",
      pythonServerPort: "",
    });
    setErrors({});
    setIsLoading(false);
    setTestConnectionResult("");
    setIsConnected(false);
    onClose();
  };

  const listOfDevices = [
    { value: 'Keross LPTP - 07', label: 'Keross LPTP - 07' },
    { value: 'Keross LPTP - 12', label: 'Keross LPTP - 12' },
    { value: 'Keross LPTP - 10', label: 'Keross LPTP - 10' },
    { value: 'Keross LPTP - 49', label: 'Keross LPTP - 49' },
    { value: 'Keross LPTP - 51', label: 'Keross LPTP - 51' },
  ];

  const probeList = [
    { probeName: "Trivy Probe", probeId: 'c2bff3a9-f939-46fd-b38a-a22b360a3fb5' },
    { probeName: "Trivy Services Probe", probeId: 'b096dd57-1a8d-432c-95ba-cf828a8269f2' }
  ]

  return (
    <>
      <Dialog
        open={isFormModalOpen}
        onClose={() => handleClose()}
        static={true}
        className="z-[100]"
      >
        <DialogPanel className="overflow-visible rounded-md p-0 sm:max-w-5xl">
          <form
            action="#"
            method="POST"
            onSubmit={savedDataToBePopulated ? handleConfigUpdate : (!isConnected ? handleFormSave : handleTestConnection)}
          >
            <div className="absolute right-0 top-0 pr-3 pt-3">
              <button
                type="button"
                className="rounded-sm p-2 text-tremor-content-subtle hover:bg-tremor-background-subtle hover:text-tremor-content dark:text-dark-tremor-content-subtle hover:dark:bg-dark-tremor-background-subtle hover:dark:text-tremor-content"
                onClick={() => handleClose()}
                aria-label="Close"
              >
                <RiCloseLine className="size-5 shrink-0" aria-hidden={true} />
              </button>
            </div>
            <div className="border-b border-tremor-border px-6 py-4 dark:border-dark-tremor-border">
              <h3 className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Add Configuration
              </h3>
            </div>
            <div className="max-h-[80vh] overflow-y-auto flex flex-col-reverse md:flex-row">
              <div className="flex flex-col justify-between md:w-80 md:border-r md:border-tremor-border md:dark:border-dark-tremor-border">
                <div className="flex-1 grow">
                  <div className="flex flex-col justify-between h-full border-t border-tremor-border p-6 dark:border-dark-tremor-border md:border-none">
                    <div className="flex flex-col space-y-6">
                      <div className="flex items-center space-x-3">
                        <div
                          className="flex size-12 shrink-0 items-center justify-center text-primary rounded-md 
                      border border-tremor-border p-1 dark:border-dark-tremor-border"
                        >
                          <SiTrivy className="size-5" aria-hidden={true} />
                        </div>
                        <div>
                          <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {containerName}
                          </h3>
                        </div>
                      </div>
                      <Divider />
                      <div className="flex flex-col space-y-2">
                        <h4 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                          Description:
                        </h4>
                        <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                          Trivy is a simple and comprehensive vulnerability scanner for container images and file systems. It detects vulnerabilities in operating system packages (such as apt, yum, apk),
                          programming language dependencies (such as npm, pip, bundler), and configuration files.
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <h4 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                          Supported functionality:
                        </h4>
                        <p className="text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                          Supports computing, storage, networking, AI, machine
                          learning, security, and analytics.
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
                <div className="flex items-center justify-between border-t border-tremor-border p-6 dark:border-dark-tremor-border">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => handleClose()}
                  >
                    Cancel
                  </Button>

                  {isLoading ? (
                    <Button isLoading>Loading</Button>
                  ) : (
                    <Button variant="primary">
                      {savedDataToBePopulated ? "Update" : (!isConnected ? "Save" : "Connect")}
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-8 p-6 md:px-6 md:pb-20 md:pt-6">
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
                        onValueChange={(val) => {
                          setFormData((prev) => ({ ...prev, osType: val }))
                        }}
                      >
                        <SelectItem value="windows">Windows</SelectItem>
                        <SelectItem value="ubuntu">Ubuntu</SelectItem>
                      </Select>

                      {errors.osType ? (
                        <p className="text-xs text-red-500">
                          {errors.osType}
                        </p>
                      ) : undefined}
                    </div>
                  </div>
                </div>

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

                      {errors.configurationName ? (
                        <p className="text-xs text-red-500">
                          {errors.configurationName}
                        </p>
                      ) : undefined}
                    </div>
                  </div>
                </div>

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
                          setFormData((prev) => ({ ...prev, listOfDevices: val }))
                        }
                      >
                        {listOfDevices.map((device) => (
                          <MultiSelectItem key={device.value} value={device.value}>
                            {device.label}
                          </MultiSelectItem>
                        ))}
                      </MultiSelect>

                      {errors.listOfDevices ? (
                        <p className="text-xs text-red-500">
                          {errors.listOfDevices}
                        </p>
                      ) : undefined}
                    </div>
                  </div>
                </div>

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
                        {probeList.map((probe) => (
                          <SelectItem key={probe.probeId} value={probe.probeId}>
                            {probe.probeName}
                          </SelectItem>
                        ))}
                      </Select>

                      {errors.probeId ? (
                        <p className="text-xs text-red-500">
                          {errors.probeId}
                        </p>
                      ) : undefined}
                    </div>
                  </div>
                </div>

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
                          error={errors.pythonServerIp ? true : false}
                          value={formData.pythonServerIp}
                          onChangeFunction={handleIpInputChange}
                        />

                        {errors.pythonServerIp ? (
                          <p className="text-xs text-red-500">{errors.pythonServerIp}</p>
                        ) : undefined}
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

                        {errors.pythonServerPort ? (
                          <p className="text-xs text-red-500">
                            {errors.pythonServerPort}
                          </p>
                        ) : undefined}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </DialogPanel>
      </Dialog >
    </>
  );
}
