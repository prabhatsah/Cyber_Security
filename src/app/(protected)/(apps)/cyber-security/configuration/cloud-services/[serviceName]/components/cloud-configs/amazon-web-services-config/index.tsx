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
  // const [cloudConfigData, setCloudConfigData] = useState<Array<any>>([]);

  // let fetchedData = useConfiguration();

  // useEffect(() => {
  //   let eachConfigDataFormatted: Array<any> = [];
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
  const eachConfigDataFormatted: Array<AmazonWebServicesConfiguration | any> = [...Object.values(fetchedData[0].data)];
  console.log(serviceName, " Data updated ", eachConfigDataFormatted);

  return (
    <>
      <ConfigHeader
        serviceUrl={serviceUrl}
        serviceName={serviceName}
        configDataLength={eachConfigDataFormatted.length}
      />

      {/* {eachConfigDataFormatted.length === 0 ? <NoSavedConfigTemplate /> : <div className="mt-6">{serviceName} Configurations</div>} */}
      {eachConfigDataFormatted.length === 0 ? <NoSavedConfigTemplate /> :
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eachConfigDataFormatted.map((eachConfigDetails) => (
            <AmazonWebServicesConfigWidget
              key={eachConfigDetails.configId}
              serviceUrl={serviceUrl}
              eachConfigDetails={eachConfigDetails}
            />
          ))}
        </div>}
    </>
  );
}
