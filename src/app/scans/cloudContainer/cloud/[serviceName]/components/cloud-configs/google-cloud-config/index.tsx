import GoogleCloudConfigWidget from "./GoogleCloudConfigWidget";
import {
  GoogleCloudConfiguration,
} from "@/app/configuration/components/type";
import NoSavedConfigTemplate from "../../components/NoSavedConfigTemplate";
import { fetchConfigDetails } from "@/app/scans/cloudContainer/components/fetchConfigDetails";
import { configDataGetter } from "@/app/scans/cloudContainer/components/configDataSaving";
import ConfigHeader from "../../components/ConfigHeader";

export default async function GoogleCloudConfig({
  serviceUrl,
  serviceName,
}: {
  serviceUrl: string;
  serviceName: string;
}) {

  // const fetchedData = (await fetchConfigDetails(serviceUrl)).data;
  // let fetchedData: any = configDataGetter();
  // fetchedData = fetchedData.filter((eachData: EachConfigDataFromServer) => eachData.name === serviceUrl);
  const fetchedData = [
    {
      "id": "6c8e7468-a0c2-4d7f-830d-7370550a5b28",
      "data": {
        "50db2edd-d91b-4f5d-895a-2d50a19baedc": {
          "region": "us-central",
          "configId": "50db2edd-d91b-4f5d-895a-2d50a19baedc",
          "createdBy": {
            "userId": "be7a0ece-f3d8-4c5b-84dc-52c32c4adff4",
            "userName": "Sayan Roy",
            "userEmail": "sayan.roy@keross.com"
          },
          "createdOn": "2025-Mar-11 12:19:30",
          "projectId": "gcp-project-98341",
          "cloudProvider": "gcp",
          "configurationName": "gcp",
          "serviceAccountKey": {}
        },
        "d63f63b5-54e4-4723-b631-ac9f318a8afd": {
          "region": "us-central",
          "configId": "d63f63b5-54e4-4723-b631-ac9f318a8afd",
          "createdBy": {
            "userId": "be7a0ece-f3d8-4c5b-84dc-52c32c4adff4",
            "userName": "Sayan Roy",
            "userEmail": "sayan.roy@keross.com"
          },
          "createdOn": "2025-Mar-17 14:11:30",
          "projectId": "gcp-project-333336",
          "cloudProvider": "gcp",
          "configurationName": "gcp",
          "serviceAccountKey": {}
        },
        "fe2fd391-22eb-4c0a-af25-d37825794c83": {
          "region": "europe-west",
          "configId": "fe2fd391-22eb-4c0a-af25-d37825794c83",
          "createdBy": {
            "userId": "be7a0ece-f3d8-4c5b-84dc-52c32c4adff4",
            "userName": "Sayan Roy",
            "userEmail": "sayan.roy@keross.com"
          },
          "createdOn": "2025-Mar-11 12:38:44",
          "projectId": "gcp-project-111111",
          "cloudProvider": "gcp",
          "configurationName": "google test 2",
          "serviceAccountKey": {}
        }
      },
      "name": "google-cloud-platform"
    }
  ]
  console.log("Fetched data ", fetchedData);
  const eachConfigDataFormatted: Array<GoogleCloudConfiguration | any> = [...Object.values(fetchedData[0].data)];
  console.log(serviceName, " Data updated ", eachConfigDataFormatted);

  return (
    <>
      <ConfigHeader
        serviceUrl={serviceUrl}
        serviceName={serviceName}
        configDataLength={eachConfigDataFormatted.length}
      />

      {eachConfigDataFormatted.length === 0 ? <NoSavedConfigTemplate /> :
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eachConfigDataFormatted.map((eachConfigDetails) => (
            <GoogleCloudConfigWidget
              key={eachConfigDetails.configId}
              eachConfigDetails={eachConfigDetails}
            />
          ))}
        </div>}
    </>
  );
}
