"use client";

import { useEffect, useState } from "react";
import ConfigHeader from "../../components/ConfigHeader";
import { useConfiguration } from "@/app/configuration/components/ConfigurationContext";
import { EachConfigDataFromServer } from "@/app/configuration/components/type";
import NoSavedConfigTemplate from "../../components/NoSavedConfigTemplate";
import AmazonWebServicesConfigWidget from "./AmazonWebServicesConfigWidget";

export default function AmazonWebServicesConfig({
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

      {/* {cloudConfigData.length === 0 ? <NoSavedConfigTemplate /> : <div className="mt-6">{serviceName} Configurations</div>} */}
      {cloudConfigData.length === 0 ? <NoSavedConfigTemplate /> :
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cloudConfigData.map((eachConfigDetails) => (
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
