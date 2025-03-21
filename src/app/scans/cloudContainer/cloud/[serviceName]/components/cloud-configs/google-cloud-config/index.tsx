import GoogleCloudConfigWidget from "./GoogleCloudConfigWidget";
import {
  EachConfigDataFromServer,
  GoogleCloudConfiguration,
} from "@/app/configuration/components/type";
import NoSavedConfigTemplate from "../components/NoSavedConfigTemplate";
import { fetchConfigDetails } from "@/app/scans/cloudContainer/components/fetchConfigDetails";
import { configDataGetter } from "@/app/scans/cloudContainer/components/configDataSaving";

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

  console.log("Service URL: ", serviceUrl);
  // const fetchedData = (await fetchConfigDetails(serviceUrl)).data;
  let fetchedData: any = configDataGetter();
  console.log("fetchedData - ");
  console.log(fetchedData);
  fetchedData = fetchedData.filter((eachData: EachConfigDataFromServer) => eachData.name === serviceUrl);
  console.log("Fetched data ", fetchedData);
  const eachConfigDataFormatted: Array<GoogleCloudConfiguration | any> = [...Object.values(fetchedData[0].data)];
  console.log(serviceName, " Data updated ", eachConfigDataFormatted);

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

  return (
    <>
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
