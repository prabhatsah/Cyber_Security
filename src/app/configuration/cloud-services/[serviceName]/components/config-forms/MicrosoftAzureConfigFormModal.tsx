import { Input } from "@/components/Input";
import { RiCloseLine, RiWindowsLine } from "@remixicon/react";
import {
  Dialog,
  DialogPanel,
  Divider,
  Select,
  SelectItem,
} from "@tremor/react";
import { useState } from "react";

export default function MicrosoftAzureConfigFormModal({
  serviceUrl,
  isFormModalOpen,
  onClose,
  savedDataToBePopulated
}: {
  serviceUrl: string;
  isFormModalOpen: boolean;
  onClose: () => void;
  savedDataToBePopulated?: any;
}) {
  const serviceNameArray = serviceUrl.split("-");
  let serviceName = "";
  serviceNameArray.forEach((eachPart) => {
    serviceName +=
      eachPart.substring(0, 1).toUpperCase() +
      eachPart.substring(1, eachPart.length) +
      " ";
  });
  serviceName.trim();

  const [formData, setFormData] = useState({
    configurationName: savedDataToBePopulated?.configurationName ?? "",
    accessKeyId: savedDataToBePopulated?.accessKeyId ?? "",
    secretAccessKey: savedDataToBePopulated?.secretAccessKey ?? "",
    region: savedDataToBePopulated?.region ?? "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [testConnectionResult, setTestConnectionResult] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setErrors({});
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Dialog
        open={isFormModalOpen}
        onClose={() => onClose()}
        static={true}
        className="z-[100]"
      >
        <DialogPanel className="overflow-visible rounded-md p-0 sm:max-w-5xl">
          <form action="#" method="POST">
            <div className="absolute right-0 top-0 pr-3 pt-3">
              <button
                type="button"
                className="rounded-sm p-2 text-tremor-content-subtle hover:bg-tremor-background-subtle hover:text-tremor-content dark:text-dark-tremor-content-subtle hover:dark:bg-dark-tremor-background-subtle hover:dark:text-tremor-content"
                onClick={() => onClose()}
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
            <div className="flex flex-col-reverse md:flex-row">
              <div className="flex flex-col justify-between md:w-80 md:border-r md:border-tremor-border md:dark:border-dark-tremor-border">
                <div className="flex-1 grow">
                  <div className="border-t border-tremor-border p-6 dark:border-dark-tremor-border md:border-none">
                    <div className="flex items-center space-x-3">
                      <div
                        className="flex size-12 shrink-0 items-center justify-center text-primary rounded-md 
                      border border-tremor-border p-1 dark:border-dark-tremor-border"
                      >
                        <RiWindowsLine className="size-5" aria-hidden={true} />
                      </div>
                      <div>
                        <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                          {serviceName}
                        </h3>
                      </div>
                    </div>
                    <Divider />
                    <h4 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                      Description:
                    </h4>
                    <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                      Microsoft Azure is a cloud platform offering computing,
                      storage, AI, and security solutions.
                    </p>
                    <h4 className="mt-6 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                      Supported functionality:
                    </h4>
                    <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                      Supports computing, storage, AI, analytics, networking,
                      and security services.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-tremor-border p-6 dark:border-dark-tremor-border">
                  <button
                    type="button"
                    className="whitespace-nowrap rounded-md text-tremor-default px-3 py-2 font-medium border border-gray-300 dark:border-gray-800 text-tremor-content-strong dark:text-dark-tremor-content-strong"
                    onClick={() => onClose()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="whitespace-nowrap rounded-md bg-primary text-gray-100 px-3 py-2 text-center text-tremor-default font-medium  hover:bg-tremor-brand-emphasis"
                  >
                    Connect
                  </button>
                </div>
              </div>
              <div className="flex-1 space-y-8 p-6 md:px-6 md:pb-20 md:pt-6">
                <div>
                  <div className="flex flex-col space-y-3">
                    <label
                      htmlFor="configurationName"
                      className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                    >
                      Configuration Name
                    </label>

                    <Input
                      id="configurationName"
                      name="configurationName"
                      value={formData.configurationName}
                      className={
                        errors.configurationName
                          ? "w-full border border-red-500 rounded-md"
                          : "w-full"
                      }
                      onChange={handleChange}
                      placeholder="Enter Configuration Name"
                    />

                    {errors.configurationName ? (
                      <p className="text-xs text-red-500">
                        {errors.configurationName}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-300">
                        A user-friendly name for this GCP configuration
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex flex-col space-y-3">
                    <label
                      htmlFor="accessKeyId"
                      className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                    >
                      Access Key Id
                    </label>

                    <Input
                      id="accessKeyId"
                      name="accessKeyId"
                      value={formData.accessKeyId}
                      disabled={savedDataToBePopulated ? true : false}
                      type="password"
                      className={`w-full ${savedDataToBePopulated ? "cursor-not-allowed" : ""} ${errors.accessKeyId ? "border border-red-500 rounded-md" : ""}`}
                      onChange={handleChange}
                      placeholder="Enter Access Key Id"
                    />

                    {errors.accessKeyId ? (
                      <p className="text-xs text-red-500">{errors.accessKeyId}</p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-300">
                        The unique identifier for the user's access
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex flex-col space-y-3">
                    <label
                      htmlFor="accessKeyId"
                      className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                    >
                      Secret Access Key
                    </label>

                    <Input
                      id="secretAccessKey"
                      name="secretAccessKey"
                      value={formData.secretAccessKey}
                      disabled={savedDataToBePopulated ? true : false}
                      type="password"
                      className={`w-full ${savedDataToBePopulated ? "cursor-not-allowed" : ""} ${errors.accessKeyId ? "border border-red-500 rounded-md" : ""}`}
                      onChange={handleChange}
                      placeholder="Enter Secret Access Key"
                    />

                    {errors.secretAccessKey ? (
                      <p className="text-xs text-red-500">{errors.secretAccessKey}</p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-300">
                        The unique access key provided to the user
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex flex-col space-y-3">
                    <label
                      htmlFor="region"
                      className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                    >
                      Select Region/Zone (Optional)
                    </label>

                    <Select
                      id="region"
                      name="region"
                      className={
                        errors.region
                          ? "w-full border border-red-500 rounded-md"
                          : "w-full"
                      }
                      value={formData.region}
                      onValueChange={(val) =>
                        setFormData((prev) => ({ ...prev, region: val }))
                      }
                    >
                      <SelectItem value="us-central">US Central</SelectItem>
                      <SelectItem value="europe-west">Europe West</SelectItem>
                      <SelectItem value="asia-east">Asia East</SelectItem>
                    </Select>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      The Region or Zone where the resources are located. It
                      helps narrow down the scan if the user only wants to scan
                      a Specific Region
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </DialogPanel>
      </Dialog>
    </>
  );
}
