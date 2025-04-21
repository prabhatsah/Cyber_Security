import AddConfigurationBtnWithFormDialog from "../../AddConfigurationBtnWithFormDialog";

export default function ConfigHeader({
  serviceUrl,
  serviceName,
  configDataLength,
}: {
  serviceUrl: string;
  serviceName: string;
  configDataLength: number;
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-tremor-default font-medium text-primary">
            {serviceName} Configurations
          </h3>
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-tremor-background-subtle text-tremor-label font-medium text-tremor-content-strong dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-strong">
            {configDataLength}
          </span>
        </div>
        <AddConfigurationBtnWithFormDialog
          btnText="Add Configuration"
          serviceUrl={serviceUrl}
        />
      </div>
    </>
  );
}
