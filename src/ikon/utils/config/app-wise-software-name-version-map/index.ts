export interface SoftwareNameVersionProps {
  softwareName: string;
  version: string;
}
export const appWiseSoftwareNameVersionMap: {
  [key: string]: SoftwareNameVersionProps;
} = {
  "base-app": {
    softwareName: "Base App",
    version: "1",
  },
  "sales-crm": {
    softwareName: "Sales CRM",
    version: "1",
  },
  "document-management": {
    softwareName: "Document Management",
    version: "1",
  },
  hcm: {
    softwareName: "HCM",
    version: "1",
  },
  ssd: {
    softwareName: "SSD",
    version: "1",
  },
  "ai-ml-workbench": {
    softwareName: "AI-ML Workbench",
    version: "1",
  },
  "tender-management": {
    softwareName: "Tender Management",
    version: "1",
  },
  ccc: {
    softwareName: "CCC",
    version: "1",
  },
  "project-management": {
    softwareName: "Project Management",
    version: "1",
  },
};
