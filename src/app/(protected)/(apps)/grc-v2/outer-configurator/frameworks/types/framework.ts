export interface FrameworkEntry {
  id: string;
  index: string;
  title: string;
  description: string;
  parentId: string | null;
  treatAsParent: boolean;
}

export interface FrameworkDetails {
  name: string;
  description: string;
  version: string;
  owners: string[];
  pricing: {
    type: "free" | "paid";
    amount?: number;
    currency?: string;
  };
  lastUpdated: string;
  responsibilityMatrixExists: boolean;
  soaExists: boolean;
}


export interface InputData {
  frameworkDetails: FrameworkDetails;
  entries: FrameworkEntry[];
};

export type OutputData = FrameworkDetails & {
  entries: Record<string, FrameworkEntry>;
  parentEntries: (FrameworkEntry & { childrenArray: string[] })[];
};