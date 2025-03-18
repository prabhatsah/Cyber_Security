export interface GoogleCloudConfig {
  configId: string;
  cloudProvider: string;
  configurationName: string;
  projectId: string;
  serviceAccountKey: File | null;
  region: string | null;
  createdOn: string;
  createdBy: {
    userName: string;
    userId: string;
    userEmail: string;
  };
}

export interface ConfigurationData {
  "amazon-web-services": Array<Record<string, any>>;
  "microsoft-azure": Array<Record<string, any>>;
  "google-cloud-platform": Array<GoogleCloudConfig | null>;
  "ibm-cloud": Array<Record<string, any>>;
  "oracle-cloud-infrastructure": Array<Record<string, any>>;
  "alibaba-cloud": Array<Record<string, any>>;
}

export interface ConfigurationContextType {
  configurationData: ConfigurationData;
  setConfigurationData: React.Dispatch<React.SetStateAction<ConfigurationData>>;
}

export interface EachConfigDataFromServer {
  id: string;
  name: string;
  data: Record<string, object>;
}

export interface EachConfigDataFormatted {
  id: string;
  data: Record<string, GoogleCloudConfig | any>;
}

export interface ConfigDataFormatted {
  "amazon-web-services": EachConfigDataFormatted;
  "microsoft-azure": EachConfigDataFormatted;
  "google-cloud-platform": EachConfigDataFormatted;
  "ibm-cloud": EachConfigDataFormatted;
  "oracle-cloud-infrastructure": EachConfigDataFormatted;
  "alibaba-cloud": EachConfigDataFormatted;
}
