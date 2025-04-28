import ConfigHeader from "../../components/ConfigHeader";
import GoogleCloudConfigWidget from "./GoogleCloudConfigWidget";
import {
  GoogleCloudConfiguration,
} from "@/app/configuration/components/type";
import NoSavedConfigTemplate from "../../components/NoSavedConfigTemplate";
import { fetchData } from "@/utils/api";

export default async function GoogleCloudConfig({
  serviceUrl,
  serviceName,
}: {
  serviceUrl: string;
  serviceName: string;
}) {
  // const [cloudConfigData, setCloudConfigData] = useState<
  //   Array<GoogleCloudConfiguration>
  // >([]);

  // let fetchedData = useConfiguration();

  // useEffect(() => {
  //   let eachConfigDataFormatted: Array<GoogleCloudConfiguration | any> = [];
  //   if (fetchedData && fetchedData.length > 0) {
  //     fetchedData = fetchedData.filter(
  //       (eachData: EachConfigDataFromServer) => eachData.name === serviceUrl
  //     );

  //     eachConfigDataFormatted = [...Object.values(fetchedData[0].data)];
  //     setCloudConfigData(eachConfigDataFormatted);
  //     console.log(serviceName, " Data updated ", eachConfigDataFormatted);
  //   }
  // }, [fetchedData]);


  const fetchedData = (await fetchData("cloud_config", "id", [{ column: "name", value: serviceUrl }], null)).data;
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
              serviceUrl={serviceUrl}
              eachConfigDetails={eachConfigDetails}
            />
          ))}
        </div>}
    </>
  );
}
