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

  const fetchedData = (await fetchData("cloud_config", "id", { column: "name", value: serviceName }, [{ column: "data", keyPath: ["configId"], value: configId }])).data;
  console.log("Fetched Data: ", fetchedData);

  const specificConfigData: GoogleCloudConfiguration | AmazonWebServicesConfiguration | any = fetchedData[0]['config_filtered'];
  console.log("Data for Config Id (", configId, "): ", fetchedData);


  // let apiBodyJson: Record<string, any> = {};
  if (serviceName === "google-cloud-platform") {
    // const projectId = specificConfigData.projectId;
    // const serviceAccountKeyData = specificConfigData.serviceAccountKey;

    const apiBodyJson = {
      "cloudProvider": "gcp",
      "credentials": specificConfigData.serviceAccountKey.credentials
    }

    const response = await fetch("http://localhost:3000/src/app/api/cloud-container/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiBodyJson), // This should include serviceAccountKey
    });

    const text = await response.text(); // Get response as text
    try {
      const result = JSON.parse(text);
      console.log("GCP Scan Result: ", result);
    } catch (error) {
      console.log("Failed to parse JSON.");
    }

    // const byteCharacters = atob(base64String.split(",")[1]); // Decode Base64 (remove data URL prefix)
    // const byteNumbers = new Array(byteCharacters.length);
    // for (let i = 0; i < byteCharacters.length; i++) {
    //   byteNumbers[i] = byteCharacters.charCodeAt(i);
    // }
    // const byteArray = new Uint8Array(byteNumbers);
    // const blob = new Blob([byteArray], { type: "application/json" });
    // const fileName = "service-account-key_" + projectId + ".json";
    // const serviceAccountKeyFile: File | null = new File([blob], fileName, { type: "application/json", lastModified: Date.now(), });

    // const fileName = "service-account-key_" + projectId + ".json";
    // const response = await fetch(base64String);
    // const buffer = await response.arrayBuffer();
    // const serviceAccountKeyFile = new File([buffer], fileName, { type: "application/json" });

    // const blob = new Blob([serviceAccountKeyData.data], { type: serviceAccountKeyData.mimeType });
    // const serviceAccountKeyFile = new File([blob], serviceAccountKeyData.fileName, { type: serviceAccountKeyData.mimeType });


    // const result = await testGoogleCloudConnection(
    //   projectId,
    //   serviceAccountKeyFile
    // );
    // console.log("Result: ", result);

    // apiBodyJson = {
    //   serviceAccountKey: serviceAccountKeyFile,
    //   projectId: projectId,
    // }

    // console.log("API Body Json: ", apiBodyJson);

  }


  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 3,
          title: serviceNameFromUrl,
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
