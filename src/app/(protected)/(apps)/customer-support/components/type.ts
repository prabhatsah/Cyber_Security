export interface ImageCommentDetails { // Renamed to avoid conflict
  commentIdList: number[]; // List of comment IDs
  imageIdList: string[]; // List of image IDs
}

export interface CommentDetails { // This is the actual comment structure
  comment: string;
  commentId: number;
  creationDate: Date; // Ensure consistency in format (ISO string)
  userId: string;
  userName: string;
  userThumbnailUrl: string;
}

export interface ImageCommentObj {
  commentIdList: number[];
  imageIdList: string[];
}

export interface UploadedResource {
  resourceId: any;
  inputControl: string;
}

export interface TicketData {
  pastStateList: string[];
  isStatusChange: boolean;
  previousStatus: string;
  activityLogsData: any;
  taskId: string;
  subject: string;
  ticketNo: string;
  dateCreated: string;
  issueDate: string;
  accountName: string;
  assigneeLockStatus: string;
  accountId: string;
  assigneeName: string;
  assigneeId: string;
  type: "Bugs" | "Incident" | "Feature" | "Service Request";
  priority: "Critical" | "High" | "Medium" | "Low";
  status: string;
  serverName: string;
  createdByBot: string;
  portalName: string;
  requestedFrom: string;
  assinedTo: string;
  lockChanged: boolean;
  commentsUsers?: CommentDetails[];
  linkUploadedImageToComments?: ImageCommentObj[];
  uploadedResources?: UploadedResource[];
  assignHistory?:[];
  supportMessage:string;
}

export interface TicketWorkflowActionBtns {
  btnText: string
  btnIcon: React.ReactNode
  btnID: string
  btnFn: () => any
}
export interface TicketWorkflowItems {
  name: string
  dropdown?: boolean
  color: string
  status: string
  assigneeName?: string  // Make optional with ?
  actionDate?: string 
}

export interface TicketDetails extends Partial<TicketData> { // Ensure compatibility
  commentsUsers?: CommentDetails[];
  linkUploadedImageToComments?: ImageCommentObj[];
  uploadedResources?: UploadedResource[];
}

export interface TicketsDetails {
  openTickets: TicketData[];
  closedTickets: TicketData[];
  priorityWiseTicketInfo: TicketData[];
  myTickets: number;
  completedTicketsCount: number;
  totalTicketsCount: number;
  openTicketsCount: number;
  unassignedTicketsCount: number;

  infraGrouped: Record<string, TicketData[]>;
  accountGrouped: Record<string, TicketData[]>;
  statusGrouped: Record<string, TicketData[]>;
  priorityGrouped: Record<string, TicketData[]>;
  typeGrouped: Record<string, TicketData[]>;

  typeChartData: { label: string; value: number }[];
  priorityChartData: { label: string; value: number }[];
  statusChartData: { label: string; value: number }[];
  accountChartData: { label: string; value: number }[];
  infraChartData: { label: string; value: number }[];
}
interface Items {
  name: string;
  status: string;
  color: string;
  dropdown?: boolean;
  assigneeName?: string;  // ✅ Add this property
  date?: string;          // ✅ Add this property
}