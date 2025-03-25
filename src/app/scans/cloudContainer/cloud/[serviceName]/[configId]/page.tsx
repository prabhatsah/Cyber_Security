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
  console.log("Data for Config Id (", configId, "): ", fetchedData);

  const specificConfigData: GoogleCloudConfiguration | AmazonWebServicesConfiguration | any = fetchedData[0]['data'][configId];

  let apiBodyJson: Record<string, any> = {};
  if (serviceName === "google-cloud-platform") {
    const projectId = specificConfigData.projectId;
    const base64String = specificConfigData.serviceAccountKey;

    // const byteCharacters = atob(base64String.split(",")[1]); // Decode Base64 (remove data URL prefix)
    // const byteNumbers = new Array(byteCharacters.length);
    // for (let i = 0; i < byteCharacters.length; i++) {
    //   byteNumbers[i] = byteCharacters.charCodeAt(i);
    // }
    // const byteArray = new Uint8Array(byteNumbers);
    // const blob = new Blob([byteArray], { type: "application/json" });
    // const fileName = "service-account-key_" + projectId + ".json";
    // const serviceAccountKeyFile: File | null = new File([blob], fileName, { type: "application/json", lastModified: Date.now(), });

    const fileName = "service-account-key_" + projectId + ".json";
    const response = await fetch(base64String);
    const buffer = await response.arrayBuffer();
    const serviceAccountKeyFile = new File([buffer], fileName, { type: "application/json" })

    const result = await testGoogleCloudConnection(
      projectId,
      serviceAccountKeyFile
    );
    console.log("Result: ", result);

    // function base64toFile(base64Str: string, fileName: string, mimeType: string) {
    //   if (base64Str.startsWith('data:')) {
    //     const arr = base64String.split(',');
    //     const bstr = atob(arr[arr.length - 1]);
    //     let n = bstr.length;
    //     const u8arr = new Uint8Array(n);
    //     while (n--) {
    //       u8arr[n] = bstr.charCodeAt(n);
    //     }
    //     var file = new File([u8arr], fileName, { type: mimeType });
    //     return Promise.resolve(file);
    //   }
    //   return fetch(base64Str).then(res => res.arrayBuffer()).then(buf => new File([buf], fileName, { type: mimeType }));
    // }

    // const fileName = "service-account-key_" + projectId + ".json";
    // base64toFile(base64String, fileName, 'application/json').then((serviceAccountKeyFile) => {
    //   apiBodyJson = {
    //     serviceAccountKey: serviceAccountKeyFile,
    //     projectId: projectId,
    //   }

    //   console.log("API JSON: ", apiBodyJson);
    // });
    // 
    // let serviceAccountKeyFile: File | Promise<File> | null = null;
    // if (base64String.startsWith('data:')) {
    //   const arr = base64String.split(',');
    //   const mime = arr[0].match(/:(.*?);/)[1];
    //   const bstr = atob(arr[arr.length - 1]);
    //   let n = bstr.length;
    //   const u8arr = new Uint8Array(n);
    //   while (n--) {
    //     u8arr[n] = bstr.charCodeAt(n);
    //   }

    //   const derivedFile = new File([u8arr], fileName, { type: "application/json" });
    //   serviceAccountKeyFile = Promise.resolve(derivedFile);
    // }
    // serviceAccountKeyFile = fetch(base64String).then(res => res.arrayBuffer()).then(buf => new File([buf], fileName, { type: "application/json" }));

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
