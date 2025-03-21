import { EachConfigDataFromServer } from "@/app/configuration/components/type";
import NoSavedConfigTemplate from "../../components/NoSavedConfigTemplate";
import { configDataGetter } from "@/app/scans/cloudContainer/components/configDataSaving";
import ConfigHeader from "../../components/ConfigHeader";

export default function OracleCloudConfig({
  serviceUrl,
  serviceName,
}: {
  serviceUrl: string;
  serviceName: string;
}) {
  // const [cloudConfigData, setCloudConfigData] = useState<Array<any>>([]);

  let fetchedData: any = configDataGetter();
  fetchedData = fetchedData.filter((eachData: EachConfigDataFromServer) => eachData.name === serviceUrl);
  console.log("Fetched data ", fetchedData);
  const eachConfigDataFormatted: Array<any> = [...Object.values(fetchedData[0].data)];
  console.log(serviceName, " Data updated ", eachConfigDataFormatted);

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
