import { any } from "zod";

export interface Dataset {
  processInstanceId: string;
  data: userSavedData;
  sender: string;
  processInstanceAccountId: string;
  lockedByMe: boolean;
  action: string;
  taskName: string;
  message: string;
  taskId: string;
  suspended: boolean;
  timestamp: string;
}

export interface userSavedData {
  source: string;
  userId: string;
  createdBy: string;
  createdByName?: string;
  createdOn: string;
  datasetId: string;
  popularity?: number;
  access: {
    read: {
      users: string[];
      groups: string[];
    };
    write: {
      users: string[];
      groups: string[];
    };
  };
  metadata: {
    datasetName: string;
    datasetDescription: string;
  };
  tableConfiguration: {
    sheetName: string;
    tableName: string;
    data: any[];
    fields: {
      [key: string]: {
        title: string;
        type: string;
        field: string;
      };
    };
  }[];
}

export interface DatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CreateNewDatasetModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  datasetType: string;
  existingDataset: Dataset[];
  selectedDatasetForEditing?: string;
  reRenderDatasetTable?: () => void;
}
export interface FileDetails {
  name: string;
  url: string;
  progress: number;
  file: File;
}

export interface FileResource {
  resourceId: string;
  inputControl: string;
  resourceName: string;
  resourceSize: number;
  resourceType: string;
  datasetId: string;
}

export interface DatasetTable {
  datasetName: string;
  tableName: string;
}

export interface UserData {
  [x: string]: any;
  date: any;
  userId: string;
  allotedRows: number;
  allotedSpace: number;
  excelFileListOwnedByUser: FileResource[];
  csvFileListOwnedByUser: FileResource[];
  jsonFileListOwnedByUser: FileResource[];
  allDatasetTablesListOwnedByUser: DatasetTable[];
}

export interface AccountData {
  userId: string;
  allotedRows: number;
  allotedSpace: number;
  allExcelFileList: FileResource[];
  allcsvFileList: FileResource[];
  alljsonFileList: FileResource[];
  allDatasetTablesListOwnedByUser: DatasetTable[];
}

export interface CompleteData {
  sheets: Sheet[];
}
export interface Sheet {
  sheetName: string;
  tableName: string;
  data: any[];
  fields: Fields;
  datasetId: string;
}
export interface Field {
  title: string;
  type: "STRING" | "NUMBER" | "DATE";
  dbKey: string;
}

export interface Fields {
  [key: string]: Field;
}

export interface DatasetFields {
  [key: string]: {
    title: string;
    type: string;
    field: string;
  };
}
export interface selectedColumnObjectFields {
  originalKey?: string;
  modifiedKey?: string;
  type?: string | number;
  dbKey: string;
  checked?: boolean; // for storing value of dataset field configuration
  modifiedType?: string | number; // for storing value of dataset field configuration
  datasetColumn?: string; // for storing value of dataset field configuration
  tableColumnName?: string;
}

export interface returnDataForDatasetFields {
  source: string;
  userId: string;
  createdBy: string;
  createdOn: Date;
  datasetId: string;
  access: {
    read: { users: string[]; groups: string[] };
    write: { users: string[]; groups: string[] };
  };
  metadata: {
    datasetName?: string;
    datasetDescription?: string;
    replaceOrAppendDatasetTable?: string;
  };
  tableConfiguration: any[];
}

export interface returnDataForFileTypeFields {
  columnObjectOriginal: selectedColumnObjectFields[];
  rowColDetails: {};
  datasetId: string;
  tableConfiguration: any[];
  metadata: {
    datasetName?: string;
    datasetDescription?: string;
    replaceOrAppendDatasetTable?: string;
    fieldsOfDatasetRelation?: {
      [key: string]: {
        title: string;
        type: string;
        field: string;
      };
    };
  };
  action: string;
  userId: string;
  createdBy: string;
  createdOn: Date;
  uploadedResource: {
    resource: {} | null;
  };
  sheetNumber: number;
}
