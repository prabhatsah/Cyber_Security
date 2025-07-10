"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shadcn/ui/dialog";
import { TextButton } from "@/ikon/components/buttons";
import {
  CompleteData,
  CreateNewDatasetModalFormProps,
  Sheet,
  returnDataForDatasetFields,
  returnDataForFileTypeFields,
  selectedColumnObjectFields,
  DatasetFields,
} from "../../../../components/type";
import Tabs from "@/ikon/components/tabs";
import { TabArray } from "@/ikon/components/tabs/type";
import { v4 } from "uuid";
import {
  FileDetails,
  UserData,
  AccountData,
} from "../../../../components/type";
import DatasetUploadInfo from "./DatasetUploadInfo";
import DatasetDetails from "./DatasetDetails";
import { getProfileData } from "@/ikon/utils/actions/auth";
import {
  getcurrentUserDataFromSSDUserDataSummaryProcess,
  getAccountDataUsage,
  scriptExecutorforDatasetUploaders,
  getPreviewDataFromScriptExecuter,
} from "../../../../common-functions";
import {
  getParameterizedDataForTaskId,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import Loading from "./loading";
import PreviewDatasetTable from "./PreviewDatasetTable";
import DatasetColumnTypeSelection from "./DatasetColumnTypeSelection";
import AppendOrReplaceColumnsTable from "./AppendOrReplaceColumnsTable";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import { toast } from "sonner";

export default function CreateNewDatasetModalForm({
  isOpen,
  onClose,
  datasetType,
  existingDataset,
  selectedDatasetForEditing,
  reRenderDatasetTable,
}: CreateNewDatasetModalFormProps) {
  const [datasetDetails, setDatasetDetails] = useState({
    name: "",
    description: "",
    actionType: "NEW",
    selectedDatasetId: "",
    isCalledFromEdit: false,
  });
  const [uploadedFileData, setUploadedFileData] = useState<{
    uploadedFiles: FileDetails[];
    uploadedResource: {} | null; // Single resource object
  }>({
    uploadedFiles: [],
    uploadedResource: null,
  });
  const [availableSpaceForAccount, setAvailableSpaceForAccount] = useState(0);
  const [availableSpaceForUser, setAvailableSpaceForUser] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upload-tab");
  const [selectedSheet, setSelectedSheet] = useState(0);
  const [sheetIdVsrowColDetailsMap, setSheetIdVsrowColDetailsMap] = useState<{
    [key: number]: {};
  }>({});
  const [completeData, setCompleteData] = useState<Sheet[]>([]);

  const allWorksheets = useMemo(
    () => completeData.map((sheet) => sheet.sheetName),
    [completeData]
  );

  const sheetNameSheetIdMap = useMemo(() => {
    let map: Record<number, string> = {};
    allWorksheets.forEach((name, index) => {
      map[index] = name;
    });
    return map;
  }, [allWorksheets]);

  const selectedSheetValueArray = useMemo(
    () => allWorksheets.map((_, index) => `${index}`),
    [allWorksheets]
  );

  // this function does what populateColumnsField function was doing eariler
  const selectedColumnObject = useMemo(() => {
    let columns: Record<string, selectedColumnObjectFields[]> = {};

    completeData.forEach((sheet) => {
      if (sheet?.sheetName) {
        columns[sheet.sheetName] = sheet.fields
          ? Object.keys(sheet.fields).map((key) => ({
              originalKey: sheet.fields[key].title,
              modifiedKey: key,
              type: sheet.fields[key].type,
              modifiedType: sheet.fields[key].type,
              dbKey: sheet.fields[key].dbKey,
              checked: true,
              // datasetColumn: sheet.fields[key].title,
              datasetColumn:
                datasetDetails.actionType === "NEW" ? key : undefined,
            }))
          : []; // If fields is empty or missing, store an empty array
      }
    });

    return columns;
  }, [completeData, datasetDetails.actionType]);

  const previewTabData = useMemo(() => {
    if (completeData.length === 0)
      return { previewData: [], previewDataKeys: [] };

    const firstSheet = completeData[selectedSheet];
    return {
      previewData: firstSheet.data.slice(0, 5), // First 5 rows
      previewDataKeys: Object.keys(firstSheet.fields),
    };
  }, [completeData]);

  const allColumnEntry = useMemo(() => {
    let allColumnEntryTemp = [];
    for (let i = 0; i < existingDataset.length; i++) {
      if (
        existingDataset[i].data.datasetId == datasetDetails.selectedDatasetId
      ) {
        let DatasetFields = structuredClone(
          existingDataset[i].data.tableConfiguration[0].fields
        );

        let existingDatasetName = existingDataset[i].data.metadata.datasetName;
        let columnNameforExistingDataset = `${existingDatasetName} Dataset Column`;
        // Iterate over the keys (e.g., "col_1", "col_2", "col_3") in the fields object
        for (const key in DatasetFields) {
          if (DatasetFields.hasOwnProperty(key)) {
            allColumnEntryTemp.push({
              [columnNameforExistingDataset]: DatasetFields[key].title,
              datasetType: DatasetFields[key].type,
              datasetField: DatasetFields[key].field,
              existingDatasetName: existingDatasetName,
            });
          }
        }
      }
    }
    return allColumnEntryTemp;
  }, [datasetDetails.selectedDatasetId]);

  const DatasetFields: DatasetFields | undefined = useMemo<
    DatasetFields | undefined
  >(() => {
    for (let i = 0; i < existingDataset.length; i++) {
      if (
        existingDataset[i].data.datasetId == datasetDetails.selectedDatasetId
      ) {
        return structuredClone(
          existingDataset[i].data.tableConfiguration[0].fields
        );
      }
    }
  }, [datasetDetails.selectedDatasetId]);

  async function fetchCurrentUserProfileData() {
    try {
      const profileData = await getProfileData();
      if (profileData) {
        const instanceOfSSDUserDataSummaryProcess =
          await getcurrentUserDataFromSSDUserDataSummaryProcess(
            profileData.USER_ID
          );
        if (instanceOfSSDUserDataSummaryProcess) {
          let taskId = instanceOfSSDUserDataSummaryProcess[0].taskId;
          let parameters = {
            userId: profileData.USER_ID,
          };

          const parameterizedUserData: UserData =
            await getParameterizedDataForTaskId({ taskId, parameters });
          if (parameterizedUserData) {
            let total = parameterizedUserData.allotedSpace;
            let usedSpace = 0;

            [
              ...parameterizedUserData.excelFileListOwnedByUser,
              ...parameterizedUserData.csvFileListOwnedByUser,
              ...parameterizedUserData.jsonFileListOwnedByUser,
            ].forEach((file) => (usedSpace += file.resourceSize));

            usedSpace = parseFloat(
              (usedSpace / (1024 * 1024 * 1024)).toFixed(3)
            );
            setAvailableSpaceForUser(total - usedSpace);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchAccountDataUsage() {
    try {
      const instances = await getAccountDataUsage();
      if (instances.length) {
        console.log("Inside getAccountDataUsage");
        // console.log(instances);
        let taskId = instances[0].taskId;
        let parameters = {};
        const data: AccountData = await getParameterizedDataForTaskId({
          taskId,
          parameters,
        });
        if (data) {
          console.log("Inside parameterized data fetch");

          let total = data.allotedSpace;
          let usedSpace = 0;
          [
            ...data.allExcelFileList,
            ...data.allcsvFileList,
            ...data.alljsonFileList,
          ].forEach((file) => {
            usedSpace += file.resourceSize;
          });
          usedSpace = parseFloat((usedSpace / (1024 * 1024 * 1024)).toFixed(3));
          setAvailableSpaceForAccount(total - usedSpace);
        }
      }
    } catch (error) {
      console.error("Error fetching account data usage:", error);
    }
  }

  useEffect(() => {
    if (isOpen) {
      setActiveTab("upload-tab");
      const fetchData = async () => {
        setIsLoading(true);
        await Promise.all([
          fetchCurrentUserProfileData(),
          fetchAccountDataUsage(),
        ]);
        setIsLoading(false);
      };

      fetchData();

      handleUploadedFiles([], null);

      setDatasetDetails({
        name: "",
        description: "",
        actionType: selectedDatasetForEditing === "" ? "NEW" : "APPEND",
        selectedDatasetId:
          selectedDatasetForEditing === "" ? "" : selectedDatasetForEditing,
        isCalledFromEdit: selectedDatasetForEditing === "" ? false : true,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    console.log("Active tab changed:", activeTab);
  }, [activeTab]);

  const { openDialog } = useDialog();
  const handleUploadedFiles = (files: FileDetails[], resource: {} | null) => {
    setUploadedFileData((prev) => ({
      ...prev,
      uploadedFiles: files, // Update files
      uploadedResource: resource, // Update resource
    }));
  };

  const updateDatasetName = (name: string) => {
    setDatasetDetails((prev) => ({ ...prev, name }));
  };

  const updateDatasetDescription = (description: string) => {
    setDatasetDetails((prev) => ({ ...prev, description }));
  };

  const updateDatasetAction = (actionType: string) => {
    setDatasetDetails((prev) => ({ ...prev, actionType }));
  };

  const updateSelectedDataset = (selectedDatasetId: string) => {
    setDatasetDetails((prev) => ({ ...prev, selectedDatasetId }));
  };

  const parseFileToGetPreviewData = async (
    sheetId: number,
    rowColDetails: {},
    file: FileDetails[],
    resource: {}
  ) => {
    setActiveTab("preview-tab");
    setIsLoading(true); // checking

    handleUploadedFiles(file, resource);
    setSheetIdVsrowColDetailsMap((prev) => ({
      ...prev,
      [sheetId]: rowColDetails,
    }));
    console.log(rowColDetails);
    console.log(resource + "resource----------");
    setSelectedSheet(sheetId);
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
    let parameters = {
      resource: resource,
      sheetToBeImported: selectedSheet,
      rowColDetails: rowColDetails,
      userId: userId,
      uniqueness: uniqueness,
    };
    try {
      let res = await getPreviewDataFromScriptExecuter(
        currentProcessInstanceId,
        parameters,
        uniqueness,
        taskId,
        processId
      );

      prepareDataRecievedFromFileReader(res, sheetId);
    } catch (error) {
      console.error("Error getting preview data:", error);
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const guessDate = (key: string) => {
    const dateRegex =
      /\b(?:date|timestamp|birthday|dob|doj|anniversary|on|from|to|day|start|end|check|deadline|till)\b/i;
    return dateRegex.test(key);
  };

  const prepareDataRecievedFromFileReader = (
    data: Record<string, CompleteData>,
    sheetId: number
  ) => {
    setCompleteData((prevCompleteData) => {
      let newCompleteData = data[
        datasetType === "CSV" ? "csvFile" : "excelFile"
      ].sheets.map((sheet: Sheet, index: number) => {
        let existingSheet = prevCompleteData?.[index] || {};

        return index === sheetId
          ? {
              sheetName: sheet.sheetName,
              tableName:
                existingSheet.tableName ||
                "datasetTable_" + v4().replaceAll("-", ""),
              data: sheet.data.map((row) => {
                let rowData: Record<string, any> = {};
                for (const key in row) {
                  try {
                    if (guessDate(key) && sheet.fields[key].type === "DATE") {
                      sheet.fields[key].type = "DATE";
                    } else if (sheet.fields[key].type === "DATE") {
                      sheet.fields[key].type = "NUMBER";
                    }

                    rowData[key] =
                      sheet.fields[key].type === "NUMBER"
                        ? row[key].valueAsNumber
                        : sheet.fields[key].type === "DATE"
                        ? row[key].valueAsDate
                        : row[key].valueAsString;
                  } catch (e) {
                    // add alert here
                    // openDialog({
                    //   title: "error",
                    //   description: "error In fetching some cells",
                    // });
                    console.log("error" + " -- " + e);
                  }
                }
                return rowData;
              }),
              fields: sheet.fields,
              datasetId: existingSheet.datasetId || v4(),
            }
          : existingSheet; // Keep old sheet data if not updating
      });

      return newCompleteData;
    });
    setIsLoading(false);
    // setActiveTab("preview-tab");
  };

  const createFinalFieldsData = () => {
    let tempData = JSON.parse(JSON.stringify(completeData));
    let fields: Record<string, any> = {};
    selectedColumnObject[tempData[selectedSheet].sheetName] =
      selectedColumnObject[tempData[selectedSheet].sheetName].filter(
        (column) => column.checked
      );
    for (let column of selectedColumnObject[
      tempData[selectedSheet].sheetName
    ]) {
      if (column.checked) {
        let columnKey = column.dbKey;
        let title: string | undefined = column.originalKey;
        let type: string | number | Date | undefined = column.type;

        if (datasetDetails.actionType == "NEW") {
          title = column?.datasetColumn;
          type = column.modifiedType;

          // deleting keys not requied to be saved
          delete column.checked;
          delete column.datasetColumn;
          delete column.modifiedType;
        }

        column.tableColumnName = columnKey;
        column.type = type;
        column.modifiedKey = title;

        fields[columnKey] = { title, type, field: column.dbKey };
      }
    }

    tempData[selectedSheet].fields = fields;
    tempData[selectedSheet].data = [];
    // }

    createFinalData(tempData);
  };

  const createFinalData = async (data) => {
    let returnDataForDataset: Record<string, returnDataForDatasetFields> = {};
    let returnDataForFileType: Record<string, returnDataForFileTypeFields> = {}; // Dynamically named based on datasetType
    let uniqueIdForTheForm = v4();
    const profileData = await getProfileData();

    let sourceType = datasetType === "CSV" ? "csv" : "excel"; // Determine type dynamically
    let returnDataKey = `${sourceType}Data`; // Key dynamically named

    for (let i = 0; i < 1; i++) {
      let sheetNumber = parseInt(selectedSheetValueArray[i]);
      let sheet = data.find(
        (s: Sheet) => s.sheetName === sheetNameSheetIdMap[sheetNumber]
      );
      if (!sheet) continue;

      let tableConfiguration = [sheet];
      let datasetId = sheet.datasetId;
      delete sheet.datasetId;

      if (datasetDetails.actionType === "NEW") {
        returnDataForDataset[sheet.sheetName] = {
          source: sourceType,
          userId: profileData.USER_ID,
          createdBy: profileData.USER_ID,
          createdOn: new Date(),
          datasetId,
          access: {
            read: { users: [profileData.USER_ID], groups: [] },
            write: { users: [profileData.USER_ID], groups: [] },
          },
          metadata: {
            datasetName: datasetDetails.name,
            datasetDescription: datasetDetails.description,
          },
          tableConfiguration: tableConfiguration,
        };

        returnDataForFileType[sheet.sheetName] = {
          columnObjectOriginal: selectedColumnObject[sheet.sheetName],
          rowColDetails: sheetIdVsrowColDetailsMap[sheetNumber],
          datasetId: returnDataForDataset[sheet.sheetName].datasetId,
          tableConfiguration:
            returnDataForDataset[sheet.sheetName].tableConfiguration,
          metadata: {
            datasetName: datasetDetails.name,
            datasetDescription: datasetDetails.description,
          },
          action: "NEW",
          userId: profileData.USER_ID,
          createdBy: profileData.USER_ID,
          createdOn: returnDataForDataset[sheet.sheetName].createdOn,
          uploadedResource: { resource: uploadedFileData.uploadedResource },
          sheetNumber: sheetNumber,
        };
      } else {
        let appendOrReplaceDatasetId = datasetDetails.selectedDatasetId;
        let selectedExistingDataset = existingDataset.find(
          (ds) => ds.data.datasetId === appendOrReplaceDatasetId
        );

        if (!selectedExistingDataset) continue;

        let fieldsOfDataset = structuredClone(
          selectedExistingDataset.data.tableConfiguration[0].fields
        );
        for (const key in fieldsOfDataset) {
          const foundColumn = selectedColumnObject[
            sheetNameSheetIdMap[selectedSheet]
          ]?.find((col) => col.datasetColumn === key);

          fieldsOfDataset[key].title = foundColumn?.originalKey || "";
        }

        selectedColumnObject[sheetNameSheetIdMap[selectedSheet]]?.forEach(
          (column) => {
            delete column.checked;
            delete column.datasetColumn;
            delete column.modifiedType;
          }
        );

        returnDataForDataset[sheet.sheetName] = {
          source: sourceType,
          userId: profileData.USER_ID,
          createdBy: profileData.USER_ID,
          createdOn: new Date(),
          datasetId: appendOrReplaceDatasetId,
          access: {
            read: { users: [profileData.USER_ID], groups: [] },
            write: { users: [profileData.USER_ID], groups: [] },
          },
          metadata: {
            replaceOrAppendDatasetTable:
              selectedExistingDataset.data.tableConfiguration[0].tableName,
          },
          tableConfiguration: tableConfiguration,
        };

        returnDataForFileType[sheet.sheetName] = {
          columnObjectOriginal: selectedColumnObject[sheet.sheetName],
          rowColDetails: sheetIdVsrowColDetailsMap[sheetNumber],
          datasetId: returnDataForDataset[sheet.sheetName].datasetId,
          tableConfiguration:
            returnDataForDataset[sheet.sheetName].tableConfiguration,
          metadata: {
            replaceOrAppendDatasetTable:
              selectedExistingDataset.data.tableConfiguration[0].tableName,
            fieldsOfDatasetRelation: fieldsOfDataset,
          },
          action: datasetDetails.actionType,
          userId: profileData.USER_ID,
          createdBy: profileData.USER_ID,
          createdOn: returnDataForDataset[sheet.sheetName].createdOn,
          uploadedResource: { resource: uploadedFileData.uploadedResource },
          sheetNumber: sheetNumber,
        };
      }
    }

    console.log(returnDataForDataset);
    console.log(returnDataForFileType);

    let finalDatasetData = {
      [returnDataKey]: returnDataForFileType, // Becomes "csvData" or "excelData"
      datasetData: returnDataForDataset,
      uniqueIdForTheForm: uniqueIdForTheForm,
    };

    const startProcessdata = await executeProcess({
      data: finalDatasetData,
      processName: `Read ${
        sourceType.charAt(0).toUpperCase() + sourceType.slice(1)
      } And Show Preview`,
    });
  };

  const executeProcess = async ({
    data,
    processName,
  }: {
    data: any;
    processName: string;
  }) => {
    try {
      const processId = await mapProcessName({
        processName,
      });
      let processIdentifierFields = null;

      const result = await startProcessV2({
        processId,
        data,
        processIdentifierFields,
      });

      console.log("Process started successfully:", result);
      toast.success(`Dataset created successfully`);

      onClose();
      if (reRenderDatasetTable) {
        reRenderDatasetTable();
      }
      return result;
    } catch (error) {
      toast.error(`Failed to create dataset. Please refresh and try again.`);
      console.error("Error executing process:", error);
      throw error;
    }
  };

  const tabArray: TabArray[] = [
    {
      tabName: "Upload File",
      tabId: "upload-tab",
      default: activeTab === "upload-tab",
      tabContent: isLoading ? (
        <div className="max-h-[70vh] h-[85vh]">
          <Loading />
        </div>
      ) : (
        <DatasetUploadInfo
          selectedFileType={datasetType}
          uploadedFiles={uploadedFileData.uploadedFiles}
          availableSpaceForUser={availableSpaceForUser}
          availableSpaceForAccount={availableSpaceForAccount}
          parseFileToGetPreviewData={parseFileToGetPreviewData}
        />
      ),
    },
    {
      tabName: "Preview Details",
      tabId: "preview-tab",
      default: activeTab === "preview-tab",
      tabContent: isLoading ? (
        <div className="max-h-[70vh] h-[85vh]">
          <Loading />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto h-[85vh]">
          <div className="grid col-span-2 items-center gap-1.5">
            <PreviewDatasetTable
              previewData={previewTabData.previewData}
              previewDataKeys={previewTabData.previewDataKeys}
            />
          </div>
        </div>
      ),
    },
    {
      tabName: "Dataset Details",
      tabId: "dataset-details-tab",
      default: activeTab === "dataset-details-tab",
      tabContent: (
        <DatasetDetails
          sheetId="0"
          // name={datasetDetails.name}
          // description={datasetDetails.description}
          datasetDetails={datasetDetails}
          updateName={updateDatasetName}
          updateDescription={updateDatasetDescription}
          updateAction={updateDatasetAction}
          existingDataset={existingDataset}
          setSelectedDatasetId={updateSelectedDataset}
        />
      ),
    },
    {
      tabName: "Field Configuration",
      tabId: "configuration-tab",
      default: activeTab === "configuration-tab",
      tabContent: (
        <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto h-[85vh]">
          <div className="grid col-span-2 items-center gap-1.5">
            {datasetDetails.actionType === "NEW" ? (
              <DatasetColumnTypeSelection
                selectedColumnSchema={selectedColumnObject}
                sheetId={selectedSheet}
                sheetNameSheetIdMap={sheetNameSheetIdMap}
              />
            ) : (
              <AppendOrReplaceColumnsTable
                selectedColumnSchema={selectedColumnObject}
                sheetId={selectedSheet}
                sheetNameSheetIdMap={sheetNameSheetIdMap}
                datasetFields={DatasetFields}
                allColumnEntry={allColumnEntry}
              />
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="max-w-5xl"
          onInteractOutside={(event) => {
            event.preventDefault(); // Prevents closing on outside click
          }}
        >
          <DialogHeader>
            <DialogTitle>Create New Dataset</DialogTitle>
          </DialogHeader>
          <form>
            <Tabs
              key={activeTab}
              tabArray={tabArray}
              onTabChange={handleTabChange}
              tabListClass="py-6 px-3"
              tabListButtonClass="text-md"
              tabListInnerClass="justify-between items-center"
            />
          </form>
          <DialogFooter>
            <TextButton
              variant="default"
              type="button"
              onClick={createFinalFieldsData}
            >
              Save
            </TextButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div id="divProductivityPage"></div>
    </>
  );
}
