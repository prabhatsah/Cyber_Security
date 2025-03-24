import ConfigHeader from "../../components/ConfigHeader";
import { AmazonWebServicesConfiguration } from "@/app/configuration/components/type";
import NoSavedConfigTemplate from "../../components/NoSavedConfigTemplate";
import AmazonWebServicesConfigWidget from "./AmazonWebServicesConfigWidget";
import { fetchData } from "@/utils/api";

export default async function AmazonWebServicesConfig({
  serviceUrl,
  serviceName,
}: {
  serviceUrl: string;
  serviceName: string;
}) {

  const fetchedData = (await fetchData("cloud_config", "id", { column: "name", value: serviceUrl }, null)).data;
  // const fetchedData = (await fetchConfigDetails(serviceUrl)).data;
  // let fetchedData: any = configDataGetter();
  // fetchedData = fetchedData.filter((eachData: EachConfigDataFromServer) => eachData.name === serviceUrl);
  // const fetchedData = [{
  //   "id": "1b8c662e-e2df-41cd-89dc-5b71f8989720",
  //   "data": {
  //     "fe5d0c7c-5891-4dc3-9cc6-4aac4d19ba0f": {
  //       "region": "us-central",
  //       "configId": "fe5d0c7c-5891-4dc3-9cc6-4aac4d19ba0f",
  //       "createdBy": {
  //         "userId": "be7a0ece-f3d8-4c5b-84dc-52c32c4adff4",
  //         "userName": "Sayan Roy",
  //         "userEmail": "sayan.roy@keross.com"
  //       },
  //       "createdOn": "2025-Mar-21 17:40:35",
  //       "accessKeyId": "AKIAVENOVO2WH64GSJB2",
  //       "cloudProvider": "aws",
  //       "secretAccessKey": "R8O4gSTCFyGebPYrBOAxvFTRp21HFBfafjbasjdf1u21",
  //       "configurationName": "AWS test"
  //     }
  //   },
  //   "name": "amazon-web-services"
  // }];

  console.log("Fetched data ", fetchedData);
  const eachConfigDataFormatted: Array<AmazonWebServicesConfiguration | any> = [...Object.values(fetchedData[0].data)];
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
            <AmazonWebServicesConfigWidget
              key={eachConfigDetails.configId}
              eachConfigDetails={eachConfigDetails}
            />
          ))}
        </div>}
    </>
  );
}
