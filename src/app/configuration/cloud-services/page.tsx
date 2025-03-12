import {
  RiAlibabaCloudFill,
  RiAmazonLine,
  RiCloudLine,
  RiCloudy2Line,
  RiGoogleFill,
  RiSettings5Line,
  RiWindowsFill,
} from "@remixicon/react";
import { Card } from "@tremor/react";
import * as api from "@/utils/api";

const cloudConfigList = [
  {
    name: "Amazon Web Services",
    description:
      "AWS CloudFormation is a service that enables infrastructure as code, allowing users to define and provision AWS resources using templates.",
    configurationCount: 0,
    icon: RiAmazonLine,
    href: "/configuration/cloud-services/amazon-web-services",
    configurations: [],
  },
  {
    name: "Microsoft Azure",
    description:
      "Azure Resource Manager (ARM) is a service that enables infrastructure as code, allowing users to deploy, manage, and organize Azure resources using declarative templates.",
    configurationCount: 0,
    icon: RiWindowsFill,
    href: "/configuration/cloud-services/microsoft-azure",
    configurations: [],
  },
  {
    name: "Google Cloud Platform",
    description:
      "Google Cloud Deployment Manager is a service that enables infrastructure as code, allowing users to define, deploy, and manage Google Cloud resources using configuration templates.",
    configurationCount: 0,
    icon: RiGoogleFill,
    href: "/configuration/cloud-services/google-cloud-platform",
    configurations: [],
  },
  {
    name: "IBM Cloud",
    description:
      "IBM Cloud Schematics enables infrastructure as code, automating the deployment and management of IBM Cloud resources using Terraform.",
    configurationCount: 0,
    icon: RiCloudLine,
    href: "/configuration/cloud-services/ibm-cloud",
    configurations: [],
  },
  {
    name: "Oracle Cloud Infrastructure",
    description:
      "Oracle Cloud Infrastructure (OCI) Resource Manager enables infrastructure as code, allowing users to automate resource deployment and management using Terraform.",
    configurationCount: 0,
    icon: RiCloudy2Line,
    href: "/configuration/cloud-services/oracle-cloud-infrastructure",
    configurations: [],
  },
  {
    name: "Alibaba Cloud",
    description:
      "Alibaba Cloud Resource Orchestration Service (ROS) enables infrastructure as code, allowing users to define and manage cloud resources using templates.",
    configurationCount: 0,
    icon: RiAlibabaCloudFill,
    href: "/configuration/cloud-services/alibaba-cloud",
    configurations: [],
  },
];

export async function fetchdata() {
  const tableName = "cloud_config";
  const provider = "google-cloud-platform";
  const data = await api.fetchData(tableName, provider, "name", null, null);
  return data;
}

export default async function CloudServicesConfig() {
  const configData = await fetchdata();
  console.log("configData - ");
  console.log(configData.data);
  console.log(configData.data.length);

  for (let index = 0; index < configData.data.length; index++) {
    console.log("cloudConfigList[0].configurationCount - " + cloudConfigList);

    if (configData.data[index].name === "amazon-web-services") {
      cloudConfigList[0].configurationCount = Object.keys(
        configData.data[index].data
      ).length;
      cloudConfigList[0].configurations = Object.values(
        configData.data[index].data
      );
    } else if (configData.data[index].name === "microsoft-azure") {
      cloudConfigList[1].configurationCount = Object.keys(
        configData.data[index].data
      ).length;
      cloudConfigList[1].configurations = Object.values(
        configData.data[index].data
      );
    } else if (configData.data[index].name === "google-cloud-platform") {
      cloudConfigList[2].configurationCount = Object.keys(
        configData.data[index].data
      ).length;
      cloudConfigList[2].configurations = Object.values(
        configData.data[index].data
      );
    } else if (configData.data[index].name === "ibm-cloud") {
      cloudConfigList[3].configurationCount = Object.keys(
        configData.data[index].data
      ).length;
      cloudConfigList[3].configurations = Object.values(
        configData.data[index].data
      );
    } else if (configData.data[index].name === "oracle-cloud-infrastructure") {
      cloudConfigList[4].configurationCount = Object.keys(
        configData.data[index].data
      ).length;
      cloudConfigList[4].configurations = Object.values(
        configData.data[index].data
      );
    } else if (configData.data[index].name === "alibaba-cloud") {
      cloudConfigList[5].configurationCount = Object.keys(
        configData.data[index].data
      ).length;
      cloudConfigList[5].configurations = Object.values(
        configData.data[index].data
      );
    }
  }

  return (
    <>
      <div className="px-6 py-3 flex flex-col gap-3">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-semibold text-primary">
            Cloud Services
          </h2>
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-tremor-background-subtle text-tremor-label font-medium text-tremor-content-strong dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-strong">
            {cloudConfigList.length}
          </span>
        </div>
        <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 h-fit">
          {cloudConfigList.map((item) => (
            <Card
              key={item.name}
              className="relative flex flex-col rounded-lg justify-between 
               hover:bg-tremor-background-muted 
               hover:dark:bg-dark-tremor-background-muted"
            >
              <div className="flex items-center space-x-3">
                <span
                  className="flex size-12 shrink-0 items-center 
                justify-center text-primary rounded-md border 
                border-tremor-border p-1 dark:border-dark-tremor-border"
                >
                  <item.icon className="size-5" aria-hidden={true} />
                </span>
                <dt
                  className="text-tremor-default font-medium 
                text-tremor-content-strong dark:text-dark-tremor-content-strong"
                >
                  <a href={item.href} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden={true} />
                    {item.name}
                  </a>
                </dt>
              </div>
              <div className="mt-4 flex flex-1 flex-col">
                <div className="flex-1">
                  <dd
                    className="text-tremor-default leading-6 
                  text-tremor-content dark:text-dark-tremor-content"
                  >
                    {item.description}
                  </dd>
                </div>
                <div className="mt-6 flex items-center space-x-2">
                  <RiSettings5Line
                    className="size-5 text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                    aria-hidden={true}
                  />
                  <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    {item.configurationCount > 1
                      ? `${item.configurationCount} configurationCount`
                      : `${item.configurationCount} Configuration`}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </dl>
      </div>
    </>
  );
}
