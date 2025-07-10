import React from "react";

import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import TrivyConfig from "./components/container-config/trivy-config";

const globalConfigMap: Record<
  string,
  React.FC<{
    containerUrl: string;
    containerName: string;
  }>
> = {
  "trivy": TrivyConfig,

};

export default function CloudcontainerDetails({
  params,
}: {
  params: Promise<{ containerName: string }>;
}) {
  const unwrappedParams = React.use(params); // Unwrap the Promise here
  const containerUrl = unwrappedParams.containerName;
  const containerName = containerUrl
    .split("-") // Split the string at hyphens
    .map((word) =>
      word === "ibm"
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    ) // Capitalize the first letter of each word
    .join(" ");

  // Get the corresponding config component
  const CloudConfigTemplate = globalConfigMap[containerUrl];

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
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 2,
          title: containerName,
          href: `/configuration/container-tools/${containerUrl}`
        }}
      />
      <div className=" flex flex-col flex-grow">
        <CloudConfigTemplate
          containerUrl={containerUrl}
          containerName={containerName}

        />
      </div>
    </>
  );
}
