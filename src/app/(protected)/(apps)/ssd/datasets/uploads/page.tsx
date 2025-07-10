"use client";
import {
  getAllInstancesForDatasetConfigurationStorage,
  scriptExecutorforDatasetUploaders,
  getPreviewDataFromScriptExecuter,
} from "../../common-functions";
import DatasetDatatable from "./components/dataset-datatable";
import { getProfileData } from "@/ikon/utils/actions/auth";

import { v4 } from "uuid";
import { mapProcessName } from "@/ikon/utils/api/processRuntimeService";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { Dataset } from "../../components/type";

export default function Uploads() {
  const [datasetsArray, setDatasetsArray] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOnLoadFunctions = async () => {
    try {
      setIsLoading(true);
      let datasets = [];
      const fileReaderInstance = await scriptExecutorforDatasetUploaders(
        "fileReader"
      );
      const scriptExecutorforDatasetUploadersProcess = await mapProcessName({
        processName: "Script Executor for Dataset Uploaders",
      });

      const profileData = await getProfileData();
      let taskId = fileReaderInstance[0].taskId;
      let currentProcessInstanceId = fileReaderInstance[0].processInstanceId;
      let processId = scriptExecutorforDatasetUploadersProcess;
      let userId = profileData.USER_ID;
      let uniqueness = v4();
      const parameters = {
        calledFrom: "createdatasetWiseTemplatateMap",
        userId: userId,
        uniqueness: uniqueness,
      };

      const res: { datasetIdsWiseTemplateMap: any } =
        (await getPreviewDataFromScriptExecuter(
          currentProcessInstanceId,
          parameters,
          uniqueness,
          taskId,
          processId
        )) as { datasetIdsWiseTemplateMap: any };
      const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
      const datasetConfigurationStorageInstance =
        await getAllInstancesForDatasetConfigurationStorage();
      const datasetMap = new Map<string, Dataset>();
      datasetConfigurationStorageInstance.forEach((item: any) => {
        if (item.taskName === "Dataset Update Activity") {
          datasetMap.set(item.data.datasetId, item);
        }
      });
      datasetConfigurationStorageInstance.forEach((item: any) => {
        if (
          item.taskName === "Dataset View Activity" &&
          !datasetMap.has(item.data.datasetId)
        ) {
          datasetMap.set(item.data.datasetId, item);
        }
      });
      datasets = Array.from(datasetMap.values());
      console.log("datasets------");

      console.log(datasets);

      datasets.forEach((dataset) => {
        dataset.data.popularity =
          res.datasetIdsWiseTemplateMap?.[dataset.data.datasetId]?.length ?? 0;
        // dataset.data.popularity = res.createdatasetWiseTemplatateMap.[dataset.data.datasetId]?.length ?? 0;
        dataset.data.createdByName =
          userIdWiseUserDetailsMap[dataset.data.createdBy]?.userName ?? "";
      });

      console.log("datasets------");

      console.log(datasets);
      setDatasetsArray(datasets);
      setIsLoading(false);
    } catch (error) {
      console.error("Error getting preview data:", error);
    }
  };

  useEffect(() => {
    fetchOnLoadFunctions();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <div className="h-full w-full">
      <DatasetDatatable
        datasets={datasetsArray}
        reRenderDatasetTable={fetchOnLoadFunctions}
      />
      <div id="divProductivityPage"></div>
    </div>
  );
}

////////////////////// backup /////////////////////////////

/*

import { getAllInstancesForDatasetConfigurationStorage , scriptExecutorforDatasetUploaders, getPreviewDataFromScriptExecuter} from "../../common-functions";
import DatasetDatatable from "./components/dataset-datatable";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { v4 } from "uuid";
import {
  mapProcessName,
 
} from "@/ikon/utils/api/processRuntimeService";
import { getUserIdWiseUserDetailsMap } from '@/ikon/utils/actions/users';



export default async function Uploads() {
  let datasets;
  const fileReaderInstance = await scriptExecutorforDatasetUploaders(
    "fileReader"
  );
  const scriptExecutorforDatasetUploadersProcess = await mapProcessName({
    processName: "Script Executor for Dataset Uploaders",
  });

  const profileData = await getProfileData();
  let taskId = fileReaderInstance[0].taskId;
  let currentProcessInstanceId = fileReaderInstance[0].processInstanceId;
  let processId = scriptExecutorforDatasetUploadersProcess;
  let userId = profileData.USER_ID;
  let uniqueness = v4();
  const parameters = {
    calledFrom: "createdatasetWiseTemplatateMap",
    userId: userId,
    uniqueness: uniqueness,
  };

  try {
    const res = await getPreviewDataFromScriptExecuter(
      currentProcessInstanceId,
      parameters,
      uniqueness,
      taskId,
      processId
    );
    const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
    const datasetConfigurationStorageInstance =
    await getAllInstancesForDatasetConfigurationStorage();
  const datasetMap = new Map<string, any>();
  datasetConfigurationStorageInstance.forEach((item: any) => {
    if (item.taskName === "Dataset Update Activity") {
      datasetMap.set(item.data.datasetId, item);
    }
  });
  datasetConfigurationStorageInstance.forEach((item: any) => {
    if (
      item.taskName === "Dataset View Activity" &&
      !datasetMap.has(item.data.datasetId)
    ) {
      datasetMap.set(item.data.datasetId, item);
    }
  });
  datasets = Array.from(datasetMap.values());
  console.log("datasets------");

  console.log(datasets);
 
  datasets.forEach(dataset => {
    dataset.data.popularity = res.datasetIdsWiseTemplateMap?.[dataset.data.datasetId]?.length??0 ;
    // dataset.data.popularity = res.createdatasetWiseTemplatateMap.[dataset.data.datasetId]?.length ?? 0;
    dataset.data.createdByName =   userIdWiseUserDetailsMap[dataset.data.createdBy]?.userName
   
  });

  console.log("datasets------");

  console.log(datasets);
  } catch (error) {
    console.error("Error getting preview data:", error);
  }


  return (
    <div className="h-full w-full">
      <DatasetDatatable datasets={datasets} />
      <div id="divProductivityPage"></div>
    </div>
  );
}


*/
