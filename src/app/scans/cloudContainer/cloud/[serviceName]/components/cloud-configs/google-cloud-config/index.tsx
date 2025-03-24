import GoogleCloudConfigWidget from "./GoogleCloudConfigWidget";
import {
  GoogleCloudConfiguration,
} from "@/app/configuration/components/type";
import NoSavedConfigTemplate from "../../components/NoSavedConfigTemplate";
import ConfigHeader from "../../components/ConfigHeader";
import { fetchData } from "@/utils/api";

export default async function GoogleCloudConfig({
  serviceUrl,
  serviceName,
}: {
  serviceUrl: string;
  serviceName: string;
}) {

  const fetchedData = (await fetchData("cloud_config", "id", { column: "name", value: serviceUrl }, null)).data;
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
