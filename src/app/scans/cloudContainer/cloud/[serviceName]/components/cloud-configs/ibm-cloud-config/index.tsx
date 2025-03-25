import NoSavedConfigTemplate from "../../components/NoSavedConfigTemplate";
import ConfigHeader from "../../components/ConfigHeader";
import { fetchData } from "@/utils/api";

export default async function IbmCloudConfig({
  serviceUrl,
  serviceName,
}: {
  serviceUrl: string;
  serviceName: string;
}) {
  // const [cloudConfigData, setCloudConfigData] = useState<Array<any>>([]);
  // let fetchedData: any = configDataGetter();
  // fetchedData = fetchedData.filter((eachData: EachConfigDataFromServer) => eachData.name === serviceUrl);

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

  const fetchedData = (await fetchData("cloud_config", "id", { column: "name", value: serviceUrl }, null)).data;
  console.log("Fetched data ", fetchedData);
  const eachConfigDataFormatted: Array<any> = [...Object.values(fetchedData[0].data)];
  console.log(serviceName, " Data updated ", eachConfigDataFormatted);

  return (
    <>
      <ConfigHeader
        serviceUrl={serviceUrl}
        serviceName={serviceName}
        configDataLength={eachConfigDataFormatted.length}
      />

      {eachConfigDataFormatted.length === 0 ? <NoSavedConfigTemplate /> : <div className="mt-6">{serviceName} Configurations</div>}
    </>
  );
}
