import {
  RiAlibabaCloudFill,
  RiAmazonLine,
  RiCloudLine,
  RiCloudy2Line,
  RiGoogleFill,
  RiWindowsFill,
} from "@remixicon/react";
import CloudWidget from "./EachCloudWidget";
import {
  EachConfigDataFormatted,
  EachConfigDataFromServer,
} from "../components/type";
import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { fetchData } from "@/utils/api";

const cloudConfigList = [
  {
    name: "Amazon Web Services",
    description:
      "AWS CloudFormation is a service that enables infrastructure as code, allowing users to define and provision AWS resources using templates.",
    configurationCount: 0,
    icon: <RiAmazonLine className="size-5" aria-hidden={true} />,
    href: "/configuration/cloud-services/amazon-web-services",
  },
  {
    name: "Microsoft Azure",
    description:
      "Azure Resource Manager (ARM) is a service that enables infrastructure as code, allowing users to deploy, manage, and organize Azure resources using declarative templates.",
    configurationCount: 0,
    icon: <RiWindowsFill className="size-5" aria-hidden={true} />,
    href: "/configuration/cloud-services/microsoft-azure",
  },
  {
    name: "Google Cloud Platform",
    description:
      "Google Cloud Deployment Manager is a service that enables infrastructure as code, allowing users to define, deploy, and manage Google Cloud resources using configuration templates.",
    configurationCount: 0,
    icon: <RiGoogleFill className="size-5" aria-hidden={true} />,
    href: "/configuration/cloud-services/google-cloud-platform",
  },
  {
    name: "IBM Cloud",
    description:
      "IBM Cloud Schematics enables infrastructure as code, automating the deployment and management of IBM Cloud resources using Terraform.",
    configurationCount: 0,
    icon: <RiCloudLine className="size-5" aria-hidden={true} />,
    href: "/configuration/cloud-services/ibm-cloud",
  },
  {
    name: "Oracle Cloud Infrastructure",
    description:
      "Oracle Cloud Infrastructure (OCI) Resource Manager enables infrastructure as code, allowing users to automate resource deployment and management using Terraform.",
    configurationCount: 0,
    icon: <RiCloudy2Line className="size-5" aria-hidden={true} />,
    href: "/configuration/cloud-services/oracle-cloud-infrastructure",
  },
  {
    name: "Alibaba Cloud",
    description:
      "Alibaba Cloud Resource Orchestration Service (ROS) enables infrastructure as code, allowing users to define and manage cloud resources using templates.",
    configurationCount: 0,
    icon: <RiAlibabaCloudFill className="size-5" aria-hidden={true} />,
    href: "/configuration/cloud-services/alibaba-cloud",
  },
];

export default async function CloudServicesConfig() {
  const fetchedData = (await fetchData("cloud_config", "id")).data;

  let configDataFormatted: Record<string, EachConfigDataFormatted> = {};
  if (fetchedData && fetchedData.length > 0) {
    fetchedData.forEach((element: EachConfigDataFromServer) => {
      configDataFormatted[element.name] = {
        id: element.id,
        data: element.data,
      };
    });
  }

  const updatedCloudConfigList = cloudConfigList.map((cloudService) => {
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

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "Cloud Services",
          href: "/configuration/cloud-services",
        }}
      />
      <div className=" flex flex-col relative">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-semibold text-primary ">
            Cloud Services
          </h2>
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-tremor-background-subtle text-tremor-label font-medium text-tremor-content-strong dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-strong">
            {updatedCloudConfigList.length}
          </span>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 h-fit">
          {updatedCloudConfigList.map((item) => (
            <CloudWidget key={item.name} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}
