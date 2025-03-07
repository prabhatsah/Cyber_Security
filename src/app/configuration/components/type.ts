export interface GoogleCloudConfig {
  cloudProvider: "gcp";
  configurationName: string;
  projectId: string;
  serviceAccountKey: File;
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
