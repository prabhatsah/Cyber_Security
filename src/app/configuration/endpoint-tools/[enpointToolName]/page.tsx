import React from "react";
import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import WazuhAgentConfig from "./components/endpoint-configs/wazuh-agent-config";

const globalConfigMap: Record<
  string,
  React.FC<{
    enpointToolUrl: string;
    enpointToolName: string;
  }>
> = {
  "wazuh-agent": WazuhAgentConfig,
};

export default function CloudenpointToolDetails({
  params,
}: {
  params: Promise<{ enpointToolName: string }>;
}) {
  const unwrappedParams = React.use(params); // Unwrap the Promise here
  const enpointToolUrl = unwrappedParams.enpointToolName;
  const enpointToolName = enpointToolUrl
    .split("-") // Split the string at hyphens
    .map((word) =>
      word === "ibm"
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    ) // Capitalize the first letter of each word
    .join(" ");

  // Get the corresponding config component
  const EndpointConfigTemplate = globalConfigMap[enpointToolUrl];

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "Endpoint Tools",
          href: "/configuration/endpoint-tools",
        }}
      />
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 2,
          title: enpointToolName,
          href: `/configuration/endpoint-tools/${enpointToolUrl}`
        }}
      />
      <div className=" flex flex-col flex-grow">
        <EndpointConfigTemplate
          enpointToolUrl={enpointToolUrl}
          enpointToolName={enpointToolName}
        />
      </div>
    </>
  );
}
