"use client";

import { useEffect, useState } from "react";
import GoogleCloudConfigWidget from "./GoogleCloudConfigWidget";
import {
  EachConfigDataFromServer,
  GoogleCloudConfiguration,
} from "@/app/configuration/components/type";
import NoSavedConfigTemplate from "../components/NoSavedConfigTemplate";
import { useConfiguration } from "@/app/scans/cloudContainer/components/ConfigurationContext";

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
