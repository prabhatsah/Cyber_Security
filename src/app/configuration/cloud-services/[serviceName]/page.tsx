"use client";

import React, { useEffect } from "react";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import GoogleCloudConfig from "./components/cloud-configs/google-cloud-config";
import AmazonWebServicesConfig from "./components/cloud-configs/amazon-web-services-config";
import MicrosoftAzureConfig from "./components/cloud-configs/microsoft-azure-config";
import IbmCloudConfig from "./components/cloud-configs/ibm-cloud-config";
import OracleCloudConfig from "./components/cloud-configs/oracle-cloud-config";
import AlibabaCloudConfig from "./components/cloud-configs/alibaba-cloud-config";

const data = [
  {
    name: "Alissia Stone",
    initial: "AS",
    textColor: "text-fuchsia-800 dark:text-fuchsia-500",
    bgColor: "bg-fuchsia-100 dark:bg-fuchsia-500/20",
    email: "a.stone@gmail.com",
    href: "#",
    details: [
      {
        type: "Role",
        value: "member",
      },
      {
        type: "Last active",
        value: "2d ago",
      },
    ],
  },
  {
    name: "Emma Bern",
    initial: "EB",
    textColor: "text-blue-800 dark:text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-500/20",
    email: "e.bern@gmail.com",
    href: "#",
    details: [
      {
        type: "Role",
        value: "member",
      },
      {
        type: "Last active",
        value: "1d ago",
      },
    ],
  },
  {
    name: "Aaron McFlow",
    initial: "AM",
    textColor: "text-pink-800 dark:text-pink-500",
    bgColor: "bg-pink-100 dark:bg-pink-500/20",
    email: "a.flow@acme.com",
    href: "#",
    details: [
      {
        type: "Role",
        value: "admin",
      },
      {
        type: "Last active",
        value: "2min ago",
      },
    ],
  },
  {
    name: "Thomas Palstein",
    initial: "TP",
    textColor: "text-emerald-800 dark:text-emerald-500",
    bgColor: "bg-emerald-100 dark:bg-emerald-500/20",
    email: "t.palstein@acme.com",
    href: "#",
    details: [
      {
        type: "Role",
        value: "admin",
      },
      {
        type: "Last active",
        value: "18min ago",
      },
    ],
  },
  {
    name: "Sarah Johnson",
    initial: "SJ",
    textColor: "text-orange-800 dark:text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-500/20",
    email: "s.johnson@gmail.com",
    href: "#",
    details: [
      {
        type: "Role",
        value: "member",
      },
      {
        type: "Last active",
        value: "3h ago",
      },
    ],
  },
  {
    name: "David Smith",
    initial: "DS",
    textColor: "text-indigo-800 dark:text-indigo-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-500/20",
    email: "d.smith@gmail.com",
    href: "#",
    details: [
      {
        type: "Role",
        value: "guest",
      },
      {
        type: "Last active",
        value: "4h ago",
      },
    ],
  },
  {
    name: "Megan Brown",
    initial: "MB",
    textColor: "text-yellow-800 dark:text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-500/20",
    email: "m.brown@gmail.com",
    href: "#",
    details: [
      {
        type: "Role",
        value: "admin",
      },
      {
        type: "Last active",
        value: "1d ago",
      },
    ],
  },
];

const globalConfigMap: Record<
  string,
  React.FC<{
    serviceUrl: string;
    serviceName: string;
  }>
> = {
  "amazon-web-services": AmazonWebServicesConfig,
  "microsoft-azure": MicrosoftAzureConfig,
  "google-cloud-platform": GoogleCloudConfig,
  "ibm-cloud": IbmCloudConfig,
  "oracle-cloud-infrastructure": OracleCloudConfig,
  "alibaba-cloud": AlibabaCloudConfig,
};

export default function CloudServiceDetails({
  params,
}: {
  //params: Promise<{ serviceName: string }>
  params: Promise<{ serviceName: string }>;
}) {
  const unwrappedParams = React.use(params); // Unwrap the Promise here
  const serviceUrl = unwrappedParams.serviceName;
  const serviceName = serviceUrl
    .split("-") // Split the string at hyphens
    .map((word) =>
      word === "ibm"
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    ) // Capitalize the first letter of each word
    .join(" ");

  const { setItems } = useBreadcrumb();
  useEffect(() => {
    setItems([
      { label: "Configurations", href: "" },
      { label: "Cloud Services", href: "/configuration/cloud-services" },
      { label: serviceName, href: `/configuration/${serviceUrl}` },
    ]);
  }, []);

  // const [eachConfigData, setEachConfigData] = useState<
  //   EachConfigDataFormatted | Record<string, any>
  // >({});
  // const [isLoading, setIsLoading] = useState(false);

  // const fetchedData = useConfiguration();

  // useEffect(() => {
  //   let eachConfigDataFormatted: EachConfigDataFormatted | Record<string, any> =
  //     {};
  //   if (fetchedData && fetchedData.length > 0) {
  //     fetchedData
  //       .filter(
  //         (eachData: EachConfigDataFromServer) => eachData.name === serviceUrl
  //       )
  //       .forEach((element: EachConfigDataFromServer) => {
  //         eachConfigDataFormatted = {
  //           id: element.id,
  //           data: element.data,
  //         };
  //       });
  //     setEachConfigData(eachConfigDataFormatted);
  //     console.log(serviceName, " Data updated ", eachConfigDataFormatted);
  //   }
  // }, [fetchedData]);

  // Get the corresponding config component
  const CloudConfigTemplate = globalConfigMap[serviceUrl];

  return (
    <>
      <div className=" flex flex-col flex-grow">
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-tremor-default font-medium text-primary">
              {serviceName} Configurations
            </h3>
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-tremor-background-subtle text-tremor-label font-medium text-tremor-content-strong dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-strong">
              {Object.keys(eachConfigData).length > 0
                ? Object.keys(eachConfigData.data).length
                : 0}
            </span>
          </div>
          <AddConfigurationBtnWithFormDialog
            btnText="Add Configuration"
            serviceUrl={serviceUrl}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((eachConfigDetails) => (
            <ConfigWidget
              key={eachConfigDetails.name}
              eachConfigDetails={eachConfigDetails}
            />
          ))}
        </div> */}

        <CloudConfigTemplate
          serviceUrl={serviceUrl}
          serviceName={serviceName}
        />
      </div>
    </>
  );
}
