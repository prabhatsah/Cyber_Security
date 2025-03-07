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

const data = [
  {
    name: "Amazon Web Services",
    description:
      "AWS CloudFormation is a service that enables infrastructure as code, allowing users to define and provision AWS resources using templates.",
    configurations: 7,
    icon: RiAmazonLine,
    href: "/configuration/cloud-services/amazon-web-services",
  },
  {
    name: "Microsoft Azure",
    description:
      "Azure Resource Manager (ARM) is a service that enables infrastructure as code, allowing users to deploy, manage, and organize Azure resources using declarative templates.",
    configurations: 8,
    icon: RiWindowsFill,
    href: "/configuration/cloud-services/microsoft-azure",
  },
  {
    name: "Google Cloud Platform",
    description:
      "Google Cloud Deployment Manager is a service that enables infrastructure as code, allowing users to define, deploy, and manage Google Cloud resources using configuration templates.",
    configurations: 17,
    icon: RiGoogleFill,
    href: "/configuration/cloud-services/google-cloud-platform",
  },
  {
    name: "IBM Cloud",
    description:
      "IBM Cloud Schematics enables infrastructure as code, automating the deployment and management of IBM Cloud resources using Terraform.",
    configurations: 6,
    icon: RiCloudLine,
    href: "/configuration/cloud-services/ibm-cloud",
  },
  {
    name: "Oracle Cloud Infrastructure",
    description:
      "Oracle Cloud Infrastructure (OCI) Resource Manager enables infrastructure as code, allowing users to automate resource deployment and management using Terraform.",
    configurations: 2,
    icon: RiCloudy2Line,
    href: "/configuration/cloud-services/oracle-cloud-infrastructure",
  },
  {
    name: "Alibaba Cloud",
    description:
      "Alibaba Cloud Resource Orchestration Service (ROS) enables infrastructure as code, allowing users to define and manage cloud resources using templates.",
    configurations: 0,
    icon: RiAlibabaCloudFill,
    href: "/configuration/cloud-services/alibaba-cloud",
  },
];

export default function CloudServicesConfig() {
  return (
    <>
      <div className="px-6 py-3 flex flex-col gap-3">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-semibold text-primary">
            Cloud Services
          </h2>
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-tremor-background-subtle text-tremor-label font-medium text-tremor-content-strong dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-strong">
            {data.length}
          </span>
        </div>
        <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 h-fit">
          {data.map((item) => (
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
                    {item.configurations > 1
                      ? `${item.configurations} Configurations`
                      : `${item.configurations} Configuration`}
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
