import ConfigHeader from "../../components/ConfigHeader";
import { TrivyConfiguration } from "@/app/configuration/components/type";
import NoSavedConfigTemplate from "../../components/NoSavedConfigTemplate";
import { fetchData } from "@/utils/api";
import TrivyConfigWidget from "./TrivyConfigWidget";

export default async function TrivyConfig({
  containerUrl,
  containerName,
}: {
  containerUrl: string;
  containerName: string;
}) {
  const fetchedData = (await fetchData("container_config", "id", [{ column: "name", value: containerUrl }], null)).data;
  console.log("Fetched data ", fetchedData);
  const eachConfigDataFormatted: Array<TrivyConfiguration | any> = [...Object.values(fetchedData[0].data)];
  console.log(containerName, " Data updated ", eachConfigDataFormatted);

  return (
    <>
      <ConfigHeader
        containerUrl={containerUrl}
        containerName={containerName}
        configDataLength={eachConfigDataFormatted.length}
      />

      {eachConfigDataFormatted.length === 0 ? <NoSavedConfigTemplate /> :
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eachConfigDataFormatted.map((eachConfigDetails) => (
            <TrivyConfigWidget
              key={eachConfigDetails.configId}
              containerUrl={containerUrl}
              eachConfigDetails={eachConfigDetails}
            />
          ))}
        </div>}
    </>
  );
}
