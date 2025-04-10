
import {
  RiAlibabaCloudFill,
  RiAmazonLine,
  RiCloudLine,
  RiCloudy2Line,
  RiGoogleFill,
  RiWindowsFill,
} from "@remixicon/react";
import { SiTrivy } from "react-icons/si";
import EachContainerWidget from "./EachContainerWidget";
import {
  EachConfigDataFormatted,
  EachConfigDataFromServer,
} from "../components/type";
import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { fetchData } from "@/utils/api";

const containerConfigList = [
  {
    name: "Trivy ",
    description:
      "Trivy is a simple and comprehensive vulnerability scanner for container images and file systems. It detects vulnerabilities in operating system packages (such as apt, yum, apk), programming language dependencies (such as npm, pip, bundler), and configuration files",
    configurationCount: 0,

    icon: <SiTrivy className="size-5" />,
    href: "/configuration/container-tools/trivy",
  },

];


export  async function ContainerToolsConfig() {
  const fetchedData = (await fetchData("container_config", "id")).data;

  let configDataFormatted: Record<string, EachConfigDataFormatted> = {};
  if (fetchedData && fetchedData.length > 0) {
    fetchedData.forEach((element: EachConfigDataFromServer) => {
      configDataFormatted[element.name] = {
        id: element.id,
        data: element.data,
      };
    });
  }

  const updatedcontainerConfigList = containerConfigList.map((cloudService) => {
    const cloudServiceName = cloudService.href.split("/")[3];

    if (configDataFormatted[cloudServiceName]) {
      return {
        ...cloudService,
        configurationCount: Object.keys(configDataFormatted[cloudServiceName].data)
          .length,
      };
    }

    return { ...cloudService, configurationCount: 0 };
  });
}



export default function ContainerServicesConfig() {

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
          title: "Container Tools",
          href: "/configuration/container-tools",
        }}
      />
      <div className=" flex flex-col relative">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-semibold text-primary ">
            Container Tools
          </h2>
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-tremor-background-subtle text-tremor-label font-medium text-tremor-content-strong dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-strong">
            {containerConfigList.length}
          </span>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 h-fit">
          {containerConfigList.map((item) => (
            <EachContainerWidget key={item.name} item={item} />
          ))}
        </div>

      </div>
    </>
  )
}
