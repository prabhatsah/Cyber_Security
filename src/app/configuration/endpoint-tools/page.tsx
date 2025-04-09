import { RiCodeBoxLine } from "@remixicon/react";
import EachEndPointWidget from "./EachEndPointWidget";
import {
  EachConfigDataFormatted,
  EachConfigDataFromServer,
} from "../components/type";
import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { fetchData } from "@/utils/api";

const endPointConfigList = [
  {
    name: "Wazuh Agent",
    description:
      "Wazuh Agent is a lightweight security monitoring tool that collects and forwards system data to a Wazuh Manager for threat detection and compliance analysis.",
    configurationCount: 0,
    icon: <RiCodeBoxLine className="size-5" aria-hidden={true} />,
    href: "/configuration/endpoint-tools/wazuh-agent",
  },
];

export default async function EndPointToolsConfig() {
  const fetchedData = (await fetchData("endpoint_config", "id")).data;

  let configDataFormatted: Record<string, EachConfigDataFormatted> = {};
  if (fetchedData && fetchedData.length > 0) {
    fetchedData.forEach((element: EachConfigDataFromServer) => {
      configDataFormatted[element.name] = {
        id: element.id,
        data: element.data,
      };
    });
  }

  const updatedEndpointConfigList = endPointConfigList.map((endpointTool) => {
    const cloudServiceName = endpointTool.href.split("/")[3];

    if (configDataFormatted[cloudServiceName]) {
      return {
        ...endpointTool,
        configurationCount: Object.keys(configDataFormatted[cloudServiceName].data)
          .length,
      };
    }

    return { ...endpointTool, configurationCount: 0 };
  });

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 0,
          title: "Configuration",
        }}
      />
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "Endpoint Tools",
          href: "/configuration/endpoint-tools",
        }}
      />
      <div className=" flex flex-col relative">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-semibold text-primary ">
            Endpoint Tools
          </h2>
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-tremor-background-subtle text-tremor-label font-medium text-tremor-content-strong dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-strong">
            {updatedEndpointConfigList.length}
          </span>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 h-fit">
          {updatedEndpointConfigList.map((item) => (
            <EachEndPointWidget key={item.name} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}
