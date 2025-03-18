import { useEffect, useState } from "react";
import ConfigHeader from "../components/ConfigHeader";
import { useConfiguration } from "@/app/configuration/components/ConfigurationContext";
import { EachConfigDataFromServer } from "@/app/configuration/components/type";

export default function OracleCloudConfig({
  serviceUrl,
  serviceName,
}: {
  serviceUrl: string;
  serviceName: string;
}) {
  const [cloudConfigData, setCloudConfigData] = useState<Array<any>>([]);

  let fetchedData = useConfiguration();

  useEffect(() => {
    let eachConfigDataFormatted: Array<any> = [];
    if (fetchedData && fetchedData.length > 0) {
      fetchedData = fetchedData.filter(
        (eachData: EachConfigDataFromServer) => eachData.name === serviceUrl
      );

      eachConfigDataFormatted = [...Object.values(fetchedData[0].data)];
      setCloudConfigData(eachConfigDataFormatted);
      console.log(serviceName, " Data updated ", eachConfigDataFormatted);
    }
  }, [fetchedData]);

  return (
    <>
      <ConfigHeader
        serviceUrl={serviceUrl}
        serviceName={serviceName}
        configDataLength={cloudConfigData.length}
      />

      <div className="mt-6">Oracle Cloud Infrastructure Configurations</div>
    </>
  );
}
