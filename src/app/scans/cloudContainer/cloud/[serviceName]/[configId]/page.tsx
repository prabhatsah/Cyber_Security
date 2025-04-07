import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { fetchData } from "@/utils/api";
import { AmazonWebServicesConfiguration, GoogleCloudConfiguration } from "@/app/configuration/components/type";
import { ScoutSuiteScanData } from "@/app/api/cloud-container/scan/scoutSuite";
import { Label } from "@radix-ui/react-label";
import Header from "./components/Header";
import ServiceSummary from "./components/ServiceSummary";
import ServiceBreakdown from "./components/ServiceBreakdowns";

const cloudServiceNameWiseCodeMap: Record<string, string> = {
  "google-cloud-platform": "gcp",
  "amazon-web-services": "aws",
}

export default async function CloudConfigScanningMainDashboard({
  params,
}: {
  params: Promise<{ serviceName: string; configId: string }>;
}) {

  // Await the Promise to get the actual params object
  const { serviceName, configId } = (await params);

  const serviceNameAsDisplayStr = serviceName
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


  const cloudProvider = cloudServiceNameWiseCodeMap[serviceName];
  let scanData: any = undefined;
  if (serviceName === "google-cloud-platform") {
    const result = await ScoutSuiteScanData(
      cloudProvider,
      specificConfigData.serviceAccountKey.credentials
    );
    scanData = result.data;

  } else if (serviceName === "amazon-web-services") {
    const credentials = {
      "awsAccessKey": specificConfigData.accessKeyId,
      "awsSecretKey": specificConfigData.secretAccessKey,
    }
    const result = await ScoutSuiteScanData(
      cloudProvider,
      credentials
    );
    scanData = result.data;
  }
  console.log("Scan Data: ", scanData);


  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 3,
          title: serviceNameAsDisplayStr,
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
      {/* <Dashboard serviceName={serviceName} serviceNameAsDisplayStr={serviceNameAsDisplayStr} configId={configId} /> */}
      <div className="w-full">
        <Label className="text-[20px] font-bold text-gray-900 dark:text-gray-50">{serviceNameAsDisplayStr} Scan</Label>
        <Header summary={scanData.last_run.summary} scanTime={scanData.last_run.time} serviceNameAsDisplayStr={serviceNameAsDisplayStr} serviceCode={cloudProvider} projectId={specificConfigData.projectId} />
        <ServiceSummary summary={scanData.last_run.summary} />
        <ServiceBreakdown services={scanData.services} />
      </div>
    </>
  );
}
