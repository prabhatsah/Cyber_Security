"use client";

import {
  RiAlibabaCloudFill,
  RiAmazonLine,
  RiCloudLine,
  RiCloudy2Line,
  RiGoogleFill,
  RiWindowsFill,
} from "@remixicon/react";
import * as api from "@/utils/api";
import CloudWidget from "./EachCloudWidget";
import { CloudSkeleton } from "../components/Skeleton";
import { Suspense, useEffect, useState } from "react";
import { useConfiguration } from "../components/ConfigurationContext";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import {
  ConfigDataFormatted,
  EachConfigDataFormatted,
  EachConfigDataFromServer,
} from "../components/type";

const cloudConfigList = [
  {
    name: "Amazon Web Services",
    description:
      "AWS CloudFormation is a service that enables infrastructure as code, allowing users to define and provision AWS resources using templates.",
    configurationCount: 0,
    icon: <RiAmazonLine className="size-5" aria-hidden={true} />,
    href: "/configuration/cloud-services/amazon-web-services",
    configurations: [],
  },
  {
    name: "Microsoft Azure",
    description:
      "Azure Resource Manager (ARM) is a service that enables infrastructure as code, allowing users to deploy, manage, and organize Azure resources using declarative templates.",
    configurationCount: 0,
    icon: <RiWindowsFill className="size-5" aria-hidden={true} />,
    href: "/configuration/cloud-services/microsoft-azure",
    configurations: [],
  },
  {
    name: "Google Cloud Platform",
    description:
      "Google Cloud Deployment Manager is a service that enables infrastructure as code, allowing users to define, deploy, and manage Google Cloud resources using configuration templates.",
    configurationCount: 0,
    icon: <RiGoogleFill className="size-5" aria-hidden={true} />,
    href: "/configuration/cloud-services/google-cloud-platform",
    configurations: [],
  },
  {
    name: "IBM Cloud",
    description:
      "IBM Cloud Schematics enables infrastructure as code, automating the deployment and management of IBM Cloud resources using Terraform.",
    configurationCount: 0,
    icon: <RiCloudLine className="size-5" aria-hidden={true} />,
    href: "/configuration/cloud-services/ibm-cloud",
    configurations: [],
  },
  {
    name: "Oracle Cloud Infrastructure",
    description:
      "Oracle Cloud Infrastructure (OCI) Resource Manager enables infrastructure as code, allowing users to automate resource deployment and management using Terraform.",
    configurationCount: 0,
    icon: <RiCloudy2Line className="size-5" aria-hidden={true} />,
    href: "/configuration/cloud-services/oracle-cloud-infrastructure",
    configurations: [],
  },
  {
    name: "Alibaba Cloud",
    description:
      "Alibaba Cloud Resource Orchestration Service (ROS) enables infrastructure as code, allowing users to define and manage cloud resources using templates.",
    configurationCount: 0,
    icon: <RiAlibabaCloudFill className="size-5" aria-hidden={true} />,
    href: "/configuration/cloud-services/alibaba-cloud",
    configurations: [],
  },
];

export default function CloudServicesConfig() {
  let currentTime = new Date();
  console.log("Comp called: " + currentTime.toISOString());

  const { setItems } = useBreadcrumb();
  useEffect(() => {
    setItems([
      { label: "Configurations", href: "" },
      { label: "Cloud Services", href: "/configuration/cloud-services" },
    ]);
  }, []);

  const [configData, setConfigData] = useState<
    Record<string, EachConfigDataFormatted>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchedData = useConfiguration();
  console.log("configData in cloud service page.tsx - ");
  console.log(fetchedData);

  useEffect(() => {
    let configDataFormatted: Record<string, EachConfigDataFormatted> = {};
    if (fetchedData && fetchedData.length > 0) {
      fetchedData.forEach((element: EachConfigDataFromServer) => {
        configDataFormatted[element.name] = {
          id: element.id,
          data: element.data,
        };
      });
      setConfigData(configDataFormatted);
      console.log("configData updated", configDataFormatted);
    }
  }, [fetchedData]);

  for (let index = 0; index < cloudConfigList.length; index++) {
    const cloudServiceName = cloudConfigList[0].name;

    cloudConfigList[index].configurationCount =
      Object.keys(configData).length > 0
        ? Object.keys(configData[cloudServiceName].data).length
        : 0;

    // if (configData[index].name === "amazon-web-services") {
    //   cloudConfigList[0].configurationCount = Object.keys(
    //     configData[index].data
    //   ).length;
    //   cloudConfigList[0].configurations = Object.values(configData[index].data);
    // } else if (configData[index].name === "microsoft-azure") {
    //   cloudConfigList[1].configurationCount = Object.keys(
    //     configData[index].data
    //   ).length;
    //   cloudConfigList[1].configurations = Object.values(configData[index].data);
    // } else if (configData[index].name === "google-cloud-platform") {
    //   cloudConfigList[2].configurationCount = Object.keys(
    //     configData[index].data
    //   ).length;
    //   cloudConfigList[2].configurations = Object.values(configData[index].data);
    // } else if (configData[index].name === "ibm-cloud") {
    //   cloudConfigList[3].configurationCount = Object.keys(
    //     configData[index].data
    //   ).length;
    //   cloudConfigList[3].configurations = Object.values(configData[index].data);
    // } else if (configData[index].name === "oracle-cloud-infrastructure") {
    //   cloudConfigList[4].configurationCount = Object.keys(
    //     configData[index].data
    //   ).length;
    //   cloudConfigList[4].configurations = Object.values(configData[index].data);
    // } else if (configData[index].name === "alibaba-cloud") {
    //   cloudConfigList[5].configurationCount = Object.keys(
    //     configData[index].data
    //   ).length;
    //   cloudConfigList[5].configurations = Object.values(configData[index].data);
    // }
  }

  currentTime = new Date();
  console.log("Now returning: " + currentTime.toISOString());

  if (isLoading) {
    return <CloudSkeleton />;
  }

  return (
    <>
      <div className=" flex flex-col relative">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-semibold text-primary ">
            Cloud Services
          </h2>
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-tremor-background-subtle text-tremor-label font-medium text-tremor-content-strong dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-strong">
            {cloudConfigList.length}
          </span>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 h-fit">
          {cloudConfigList.map((item) => (
            <CloudWidget key={item.name} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}
