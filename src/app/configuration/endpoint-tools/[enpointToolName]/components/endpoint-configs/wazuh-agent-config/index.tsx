import ConfigHeader from "../../components/ConfigHeader";
import {
  GoogleCloudConfiguration,
} from "@/app/configuration/components/type";
import NoSavedConfigTemplate from "../../components/NoSavedConfigTemplate";
import { fetchData } from "@/utils/api";
import WazuhAgentConfigWidget from "./WazuhAgentConfigWidget";

export default async function WazuhAgentConfig({
  enpointToolUrl,
  enpointToolName,
}: {
  enpointToolUrl: string;
  enpointToolName: string;
}) {
  // const fetchedData = (await fetchData("cloud_config", "id", { column: "name", value: enpointToolUrl }, null)).data;
  // console.log("Fetched data ", fetchedData);
  // const eachConfigDataFormatted: Array<GoogleCloudConfiguration | any> = [...Object.values(fetchedData[0].data)];
  // console.log(enpointToolName, " Data updated ", eachConfigDataFormatted);

  return (
    <>
      <ConfigHeader
        enpointToolUrl={enpointToolUrl}
        enpointToolName={enpointToolName}
        // configDataLength={eachConfigDataFormatted.length}
        configDataLength={0}
      />
      {/* {eachConfigDataFormatted.length === 0 ? <NoSavedConfigTemplate /> :
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eachConfigDataFormatted.map((eachConfigDetails) => (
            <WazuhAgentConfigWidget
              key={eachConfigDetails.configId}
              enpointToolUrl={enpointToolUrl}
              eachConfigDetails={eachConfigDetails}
            />
          ))}
        </div>} */}
      <NoSavedConfigTemplate />
    </>
  );
}
