"use client";

import { useEffect, useState } from "react";
import ConfigHeader from "../components/ConfigHeader";
import GoogleCloudConfigWidget from "./GoogleCloudConfigWidget";
import {
  EachConfigDataFromServer,
  GoogleCloudConfiguration,
} from "@/app/configuration/components/type";
import { useConfiguration } from "@/app/configuration/components/ConfigurationContext";
import NoSavedConfigTemplate from "../components/NoSavedConfigTemplate";

export default function GoogleCloudConfig({
  serviceUrl,
  serviceName,
}: {
  serviceUrl: string;
  serviceName: string;
}) {
  const [cloudConfigData, setCloudConfigData] = useState<
    Array<GoogleCloudConfiguration>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  let fetchedData = useConfiguration();

  useEffect(() => {
    let eachConfigDataFormatted: Array<GoogleCloudConfiguration | any> = [];
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
      {cloudConfigData.length === 0 ? <NoSavedConfigTemplate /> :
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cloudConfigData.map((eachConfigDetails) => (
            <GoogleCloudConfigWidget
              key={eachConfigDetails.configId}
              eachConfigDetails={eachConfigDetails}
            />
          ))}
        </div>}
    </>
  );
}
