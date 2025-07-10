export interface MLServer {
  createdBy: string; //User ID
  createdOn: string; //ISO date string
  hostName?: string;
  ipAddress?: string;
  probeId: string;
  probeMachineOsType: string;
  probeName: string;
  status: string;
  workspaceId: string;
  workspaceName: string;
}

export interface Probe {
  probeDetails: [];
}

export interface ProbeData {
  ACTIVE: boolean;
  Status?: "Active" | "Inactive";
  IS_PLATFORM_PROBE: boolean;
  LAST_HEARTBEAT: string | null; //ISO date string
  PROBE_ID: string;
  PROBE_NAME: string;
  SOFTWARE_ID: string | null;
  USER_ID: string; //User ID
  USER_NAME: string;
}

export interface ProjectData {
  projectId: string;
  projectName: string;
  assignmentId: string;
  projectDescription: string;
  assignmentDetails: Assignment;
}

export interface Assignment {
  assignmentId: string;
  assignmentName: string;
  assignmentDescription: string;
  goalsArray: Goal[];
  datasetArray: Dataset[];
  createdOn: string; // ISO date string
  createdBy: string; // User ID
  status: string;
  pastStateList: string[];
  activityLogsData: ActivityLog[];
  assignedBy: string; // User ID
  assigneeName: string;
  assigneeId: string;
  assigneeTime: string; // ISO date string
  assignHistory: AssignmentHistory[];
  pastProjectStatus: string;
  projectCreatedDate: string; // ISO date string
  lockStatus: Record<string, LockStatus>;
}

interface Goal {
  goalId: string;
  goalName: string;
  goalDescription: string;
  modelDeatils: ModelDetail[];
}

interface ModelDetail {
  name: string;
  modelId: string;
  status: string;
  Accuracy: string;
  Precision: string;
  Recall: string;
  updatedOn: string; // Date string in "dd-MM-yyyy HH:mm:ss" format
}

interface Dataset {
  tableName: string;
  datasetName: string;
}

interface ActivityLog {
  action: string;
  actionString: string;
  dateOfAction: string; // ISO date string
  userId: string;
  userName: string;
  assignedToId?: string; // Optional as it is not always present
}

interface AssignmentHistory {
  assigneeId: string;
  assigneeName: string;
  assigneeTime: string; // ISO date string
  assignedBy: string;
}

interface LockStatus {
  loggedInUserId: string;
  loggedInUserName: string;
}
export interface AssignemntData {
  productType: string;
  productDescription?: string;
}
