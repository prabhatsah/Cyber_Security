import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import Dashboard from "./components/Dashboard";
import { fetchData } from "@/utils/api";
import { AmazonWebServicesConfiguration, GoogleCloudConfiguration } from "@/app/configuration/components/type";
import { testGoogleCloudConnection } from "./components/apis/googleCloud";

export default async function CloudConfigScanningMainDashboard({
  params,
}: {
  params: Promise<{ serviceName: string; configId: string }>;
}) {

  // Await the Promise to get the actual params object
  const { serviceName, configId } = (await params);

  const serviceNameFromUrl = serviceName
    .split("-")
    .map((word) =>
      word === "ibm"
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

  const fetchedData = (await fetchData("cloud_config", "id", { column: "name", value: serviceName })).data;

  const specificConfigData: GoogleCloudConfiguration | AmazonWebServicesConfiguration | any = fetchedData[0]['data'][configId];
  // console.log("Data for Config Id (", configId, "): ", specificConfigData);

  let apiBodyJson: Record<string, any> = {};
  if (serviceName === "google-cloud-platform") {
    const projectId = specificConfigData.projectId;
    const base64String = specificConfigData.serviceAccountKey;

    const byteCharacters = atob(base64String.split(",")[1]); // Decode Base64 (remove data URL prefix)
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/json" });
    const fileName = "service-account-key_" + projectId + ".json";
    const serviceAccountKeyFile: File | null = new File([blob], fileName, { type: "application/json", lastModified: Date.now(), });

    apiBodyJson = {
      serviceAccountKey: serviceAccountKeyFile,
      projectId: projectId,
    }
  }

  console.log("API JSON: ", apiBodyJson);

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 3,
          title: serviceName,
          href: `/scans/cloudContainer/cloud/${serviceName}`,
        }}
      />
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 4,
          title: "Scanning Dashboard",
          href: `/scans/cloudContainer/cloud/${serviceName}/${configId}`,
        }}
      />
      <Dashboard serviceName={serviceName} serviceNameFromUrl={serviceNameFromUrl} configId={configId} />
    </>
  );
}
