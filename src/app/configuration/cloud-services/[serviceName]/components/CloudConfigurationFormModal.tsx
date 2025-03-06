import { Input } from "@/components/Input";
import { Label } from "@/components/ui/label";
import { RiCloseLine, RiGoogleFill } from "@remixicon/react";
import {
  Dialog,
  DialogPanel,
  Divider,
  Select,
  SelectItem,
} from "@tremor/react";

export default function CloudConfigurationFormModal({
  serviceName,
  isFormModalOpen,
  onClose,
}: {
  serviceName: string;
  isFormModalOpen: boolean;
  onClose: () => void;
}) {
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
                        <RiGoogleFill className="size-5" aria-hidden={true} />
                      </div>
                      <div>
                        <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                          {serviceName}
                        </h3>
                        {/* <p className="mt-0.5 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                          Lorem ipsum dolor sit amet
                        </p> */}
                      </div>
                    </div>
                    <Divider />
                    <h4 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                      Description:
                    </h4>
                    <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                      Google Cloud Infrastructure delivers scalable, secure, and
                      high-performance cloud services.
                    </p>
                    <h4 className="mt-6 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                      Supported functionality:
                    </h4>
                    <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                      Supports computing, storage, networking, AI, and security
                      services.
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
                      className="w-full"
                      placeholder="Enter Configuration Name"
                    />

                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      A user-friendly name for this GCP configuration
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex flex-col space-y-3">
                    <label
                      htmlFor="projectId"
                      className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                    >
                      GCP Project Id
                    </label>

                    <Input
                      id="projectId"
                      name="projectId"
                      className="w-full"
                      placeholder="Enter GCP Project Id"
                    />

                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      The unique identifier for the user's GCP Project
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col space-y-3">
                    <label
                      htmlFor="serviceAccountKey"
                      className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                    >
                      Service Account Key (JSON)
                    </label>

                    <Input
                      id="serviceAccountKey"
                      name="serviceAccountKey"
                      type="file"
                      className="w-full"
                      accept=".json"
                    />

                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      The Service Account Key (JSON) file that provides
                      authentication to access the GCP Resources
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col space-y-3">
                    <label
                      htmlFor="region"
                      className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                    >
                      Select Region/Zone
                    </label>

                    <Select
                      name="region"
                      id="region"
                      className="w-full"
                      defaultValue="us-central"
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
