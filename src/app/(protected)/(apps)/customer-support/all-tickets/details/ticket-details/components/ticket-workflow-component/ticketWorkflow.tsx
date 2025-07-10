"use client";
import { ArchiveRestore, Check, CircleCheckBig, CornerRightDown, Pause, RotateCcw, Send, UserPlus, X } from "lucide-react";
//import { invokeLeadsPipelineTransition } from "./InvokeLeadWorkflow";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import { useEffect, useState } from "react";
import WorkflowComponent from "@/app/(protected)/(apps)/sales-crm/components/workflows";

import { InvokeTicketWorkflowTransition } from "./invokeTicketWorkflow";
import CreateAssigneeModalForm from "./components/assign-ticket-form";
import CommentModalForm from "./allFunctionComponents/open-status-update-form";
import { getProfileData } from "@/ikon/utils/actions/auth";
import {
  getUsersByGroupName,
  getUserIdWiseUserDetailsMap,
} from "@/ikon/utils/actions/users";
import { TicketData, TicketWorkflowItems } from "@/app/(protected)/(apps)/customer-support/components/type";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import TicketWorkflowComponentTemplet from "./ticketWorkflowComponent";
import { WorkflowActionBtns } from "@/app/(protected)/(apps)/sales-crm/components/type";
interface ActivityLog {
  action: 'creation' | 'assignment' | 'stateChange' | 'lockAcquired';
  userId: string;
  userName: string;
  dateOfAction: string;
  actionString: string;
  assignedToId?: string;
  previousState?: string;
  newState?: string;
  lockAcquiredById?: string;
}
interface WorkflowDataComponentProps {
  ticketNo: string;
  ticketStatus: string;
  allProductsCompleteFlag: boolean;
  assigneeName: string;
  assigneeId: string;
  assigneeLockStatus: string;
  activityLogsData:[];
  dateCreated:string;
}
var items: TicketWorkflowItems[] = [];
var ticketWorkflowActionBtns: WorkflowActionBtns[] = [];
const TicketWorkflowComponent: React.FC<WorkflowDataComponentProps> = ({
  ticketNo,
  ticketStatus,
  allProductsCompleteFlag,
  assigneeName,
  assigneeId,
  assigneeLockStatus,
  activityLogsData,
  dateCreated
}) => {

  console.log("activityLogsData---------------->>>>>>>>>>>>>>>>>>>>", activityLogsData)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAssigneeForm = () => {
    console.log("Opening Assign modal for ticketNo:", ticketNo);
    setIsModalOpen(true);
  };

  const closeAssigneeForm = () => {
    console.log("Closing Assign modal for ticketNo:", ticketNo);
    setIsModalOpen(false);
  };

  const [userData, setUserData] = useState<{
    profileData: any;
    level1Users: any[];
    level2Users: any[];
    adminUsers: any[];
  } | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  const [isAssignToInProgress, setIsAssignToInProgress] = useState(false);
  const [isAssignToCancel, setIsAssignToCancel] = useState(false);
  const [isInProgressToRestore, setIsInProgressToRestore] = useState(false);
  const [isInProgressToOnHold, setIsInProgressToOnHold] = useState(false);
  const [isInProgressToResolve, setIsInProgressToResolve] = useState(false);
  const [isInProgressToCancel, setIsInProgressToCancel] = useState(false);
  const [isOnHoldToInProgress, setIsOnHoldToInProgress] = useState(false);
  const [isOnHoldToCancel, setIsOnHoldToCancel] = useState(false);
  const [isRestorationToResolve, setIsRestorationToResolve] = useState(false);
  const [isResolvedToClose, setIsResolvedToClose] = useState(false);
  const [isResolvedToPeOpen, setIsResolvedToReOpen] = useState(false);
  const [isCancelToReOpen, setIsCancelToReOpen] = useState(false);
  const [isCancelToClose, setIsCancelToClose] = useState(false);

  const [selectedTicketNoforComment, setSelectedTicketNoforComment] =
    useState("");

  const openCommentFormForAssignToInProgress = () => {
    setSelectedTicketNoforComment(ticketNo);
    setIsAssignToInProgress(true);
  };

  const closeCommentForm = () => {
    setSelectedTicketNoforComment("");
    setIsAssignToInProgress(false);
  };

  const openCommentFormForAssignToCancel = () => {
    setSelectedTicketNoforComment(ticketNo);
    setIsAssignToCancel(true);
  };

  const openCommentFormForInProgressToRestore = () => {
    setSelectedTicketNoforComment(ticketNo);
    setIsInProgressToRestore(true);
  };

  const openCommentFormForInProgressToOnHold = () => {
    setSelectedTicketNoforComment(ticketNo);
    setIsInProgressToOnHold(true);
  };

  const openCommentFormForInProgressToResolve = () => {
    setSelectedTicketNoforComment(ticketNo);
    setIsInProgressToResolve(true);
  };

  const openCommentFormForInProgressToCancell = () => {
    setSelectedTicketNoforComment(ticketNo);
    setIsInProgressToCancel(true);
  };

  const openCommentFormForOnHoldToInProgress = () => {
    setSelectedTicketNoforComment(ticketNo);
    setIsOnHoldToInProgress(true);
  };

  const openCommentFormForOnHoldToCancel = () => {
    setSelectedTicketNoforComment(ticketNo);
    setIsOnHoldToCancel(true);
  };

  const openCommentFormForRestorationToResolve = () => {
    setSelectedTicketNoforComment(ticketNo);
    setIsRestorationToResolve(true);
  };

  const openCommentFormForResolvedToClose = () => {
    setSelectedTicketNoforComment(ticketNo);
    setIsResolvedToClose(true);
  };

  const openCommentFormForResolvedToReOpen = () => {
    setSelectedTicketNoforComment(ticketNo);
    setIsResolvedToReOpen(true);
  };
  const openCommentFormForCancelToReOpen = () => {
    setSelectedTicketNoforComment(ticketNo);
    setIsCancelToReOpen(true);
  };
  const openCommentFormForCancelToClose = () => {
    setSelectedTicketNoforComment(ticketNo);
    setIsCancelToClose(true);
  };

  useEffect(() => {
    async function fetchProfileData() {
      const profileData = await getProfileData();
      setUserId(profileData.USER_ID);
    }
    fetchProfileData();
  }, []);
  const { openDialog } = useDialog();
  // Simplified state types - just arrays of strings
  const [adminsIds, setAdminIds] = useState<string[]>([]);
  const [level1UserIds, setLevel1UserIds] = useState<string[]>([]);
  const [level2UserIds, setLevel2UserIds] = useState<string[]>([]);
  const [allUserIds, setAllUserIds] = useState<string[]>([]);

  // Fetch Level 1 Users
  useEffect(() => {
    const fetchLevel1Users = async () => {
      const data = await getUsersByGroupName(
        "Customer Support Team Level 1 (NOC)"
      );
      console.log("Customer Support Team Level 1 (NOC)------>>>", data);
      if (data?.users) {
        const userIds = Object.values(data.users).map((user) => user.userId);
        setLevel1UserIds(userIds);
      }
    };
    fetchLevel1Users();
  }, []);

  const funcAccessControl = (ticketNo: string) => {
    openDialog({
      title: "Assign Ticket",
      description: "This will allow other users to assign this ticket.",
      confirmText: "Unlock",
      cancelText: "Cancel",
      onCancel: () => console.log("Unlock cancelled"),
    });
  };

  // Fetch Customer Support Admin Users
  useEffect(() => {
    const fetchCustomerSupportAdminUsers = async () => {
      const data = await getUsersByGroupName("Customer Support Admin");
      console.log("Customer Support Admin------>>>", data);
      if (data?.users) {
        const userIds = Object.values(data.users).map((user) => user.userId);
        setAdminIds(userIds);
      }
    };
    fetchCustomerSupportAdminUsers();
  }, []);

  // Fetch Level 2 Users
  useEffect(() => {
    const fetchLevel2Users = async () => {
      const data = await getUsersByGroupName("Customer Support Level 2 (PM)");
      console.log("Customer Support Team Level 2 (PM)------ new>>>", data);
      if (data?.users) {
        const userIds = Object.values(data.users).map((user) => user.userId);
        setLevel2UserIds(userIds);
      }
    };
    fetchLevel2Users();
  }, []);

  // Fetch All Active Users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const data = await getUserIdWiseUserDetailsMap();
        console.log("Fetched Data (Raw):", data);

        // Convert object of objects into an array of userIds for active users
        const userIds = Object.values(data)
          .filter((user) => user.userActive)
          .map((user) => user.userId);

        console.log("Processed Active User IDs:", userIds);
        setAllUserIds(userIds);
      } catch (error) {
        console.error("Error fetching users:", error);
        setAllUserIds([]); // Ensure it's never undefined
      }
    };

    fetchAllUsers();
  }, []);

  // Debugging UseEffect (Optional)
  useEffect(() => {
    console.log("Updated allUserIds:", allUserIds);
  }, [allUserIds]);

  console.log("level2UserIds---------------->>>>>", level2UserIds);
  console.log("usrId--------->", userId);
  if (userId && level2UserIds.includes(userId)) {
    console.log("User ID exists.");
  } else {
    console.log("User ID is null or not found.");
  }

  const isAdmin = userId && adminsIds.includes(userId);
  const isNOC = userId && level1UserIds.includes(userId);
  const isLevel2 = userId && level2UserIds.includes(userId);

  const [stage, setIStage] = useState("");
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const invokeProceedAssigned = () => {
    console.log("hii");
    const taskName = "Edit Activity";
    const transitionName = "Update";
    const msg = `Do you want to Proceed to Assigned?`;
    const ticketStatus = "New";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () =>
        InvokeTicketWorkflowTransition(
          taskName,
          transitionName,
          ticketStatus,
          ticketNo
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };

  const invokeProceedToInProgress = () => {
    console.log("hii");
    const taskName = "Edit Activity";
    const transitionName = "Update";
    const msg = `Do you want to Proceed to In Progress?`;
    const ticketStatus = "In Progress";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () =>
        InvokeTicketWorkflowTransition(
          taskName,
          transitionName,
          ticketStatus,
          ticketNo
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };

  //Resolve State Functions
  const invokeResolveToInProgress = () => {
    console.log("hii");
    const taskName = "Resolve Activity";
    const transitionName = "Reopen from Resolve";
    const msg = `Do you want to Proceed to In Progress?`;
    const ticketStatus = "In Progress";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () =>
        InvokeTicketWorkflowTransition(
          taskName,
          transitionName,
          ticketStatus,
          ticketNo
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };

  const invokeResolveToClose = () => {
    console.log("hii");
    const taskName = "Resolve Activity";
    const transitionName = "Close";
    const msg = `Do you want to Proceed to Close the Ticket?`;
    const ticketStatus = "Closed";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () =>
        InvokeTicketWorkflowTransition(
          taskName,
          transitionName,
          ticketStatus,
          ticketNo
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };
  // Restroration Done

  //In Progress State Functions
  const invokeProceedToRestoration = () => {
    console.log("hii");
    const taskName = "Edit Activity";
    const transitionName = "Update";
    const msg = `Do you want to Proceed to Restoration?`;
    const ticketStatus = "Restoration";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () =>
        InvokeTicketWorkflowTransition(
          taskName,
          transitionName,
          ticketStatus,
          ticketNo
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };

  const invokeProceedToResolve = () => {
    console.log("hii");
    const taskName = "Edit Activity";
    const transitionName = "Resolve";
    const msg = `Do you want to Proceed to Resolved?`;
    const ticketStatus = "Resolved";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () =>
        InvokeTicketWorkflowTransition(
          taskName,
          transitionName,
          ticketStatus,
          ticketNo
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };

  const invokeProceedToOnHold = () => {
    console.log("hii");
    const taskName = "Edit Activity";
    const transitionName = "Update";
    const msg = `Do you want to Proceed to On Hold?`;
    const ticketStatus = "On Hold";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () =>
        InvokeTicketWorkflowTransition(
          taskName,
          transitionName,
          ticketStatus,
          ticketNo
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };

  const invokeInProgressToCancelled = () => {
    console.log("hii");
    const taskName = "Edit Activity";
    const transitionName = "Cancel";
    const msg = `Do you want to Proceed to Cancelled?`;
    const ticketStatus = "Cancelled";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () =>
        InvokeTicketWorkflowTransition(
          taskName,
          transitionName,
          ticketStatus,
          ticketNo
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };

  // const openAssigneeForm = () => {
  //   console.log("hii")
  //   const taskName = "Edit Activity";
  //   const transitionName = "Update";
  //   const msg = `Do you want to Assign this Ticket?`;
  //   const ticketStatus = "New"

  //   openDialog({
  //     title: msg,
  //     description: "",
  //     confirmText: "Okay",
  //     cancelText: "Cancel",
  //     onConfirm: () => openAssigneeForm,
  //     onCancel: () => console.log("Cancel action executed!"),
  //   });
  // }
  //In Progress Done

  // const invokeProceedToReAssignTicket = () => {
  //   console.log("hii")
  //   const taskName = "Edit Activity";
  //   const transitionName = "Update";
  //   const msg = `Do you want to Proceed to On Hold?`;
  //   const ticketStatus = "On Hold"

  //   openDialog({
  //     title: msg,
  //     description: "",
  //     confirmText: "Okay",
  //     cancelText: "Cancel",
  //     onConfirm: () => invokeDealWorkflowTransition(taskName, transitionName, ticketStatus, ticketNo),
  //     onCancel: () => console.log("Cancel action executed!"),
  //   });
  // }

  //Cancelled State Functions
  const invokeCancelToCloseTicket = () => {
    console.log("hii");
    const taskName = "Cancel Activity";
    const transitionName = "Cancel To Close";
    const msg = `Do you want to Proceed to Close the Ticket?`;
    const ticketStatus = "Closed";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () =>
        InvokeTicketWorkflowTransition(
          taskName,
          transitionName,
          ticketStatus,
          ticketNo
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };

  const invokeCancelToInProgress = () => {
    console.log("hii");
    const taskName = "Cancel Activity";
    const transitionName = "Reopen from Cancel";
    const msg = `Do you want to Proceed to Close the Ticket?`;
    const ticketStatus = "In Progress";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () =>
        InvokeTicketWorkflowTransition(
          taskName,
          transitionName,
          ticketStatus,
          ticketNo
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };

  // Cancelled Done

  //Onhold start
  const invokeOnHoldToInProgress = () => {
    console.log("hii");
    const taskName = "Edit Activity";
    const transitionName = "Update";
    const msg = `Do you want to Proceed to In Progress?`;
    const ticketStatus = "In Progress";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () =>
        InvokeTicketWorkflowTransition(
          taskName,
          transitionName,
          ticketStatus,
          ticketNo
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };
  const invokeOnHoldToCancel = () => {
    console.log("hii");
    const taskName = "Edit Activity";
    const transitionName = "Cancel";
    const msg = `Do you want to Proceed to Close the Ticket?`;
    const ticketStatus = "In Progress";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () =>
        InvokeTicketWorkflowTransition(
          taskName,
          transitionName,
          ticketStatus,
          ticketNo
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };

  //onhole end
  const invokeProceedToCloseTicket = () => {
    console.log("hii");
    const taskName = "Closed Activity";
    const transitionName = "Close";
    const msg = `Do you want to Proceed to Close the Ticket?`;
    const ticketStatus = "Closed";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () =>
        InvokeTicketWorkflowTransition(
          taskName,
          transitionName,
          ticketStatus,
          ticketNo
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };
  const invokeProceedToReOpenTicket = () => {
    console.log("hii");
    const taskName = "Edit Activity";
    const transitionName = "Reopen from Resolve";
    const msg = `Do you want to Proceed to Re-Open the ticket?`;
    const ticketStatus = "In Progress";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () =>
        InvokeTicketWorkflowTransition(
          taskName,
          transitionName,
          ticketStatus,
          ticketNo
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };

  const getStateCompletionStatus = (activityLogs: ActivityLog[]) => {
    const expectedOrder = [
      'Created',
      'Assigned',
      'In Progress',
      'On Hold',
      'Restoration',
      'Resolved',
      'Cancelled',
      'Closed'
    ];
  
    // Parse all state transitions with their direction
    const transitions: Array<{state: string; isBackward: boolean; index: number}> = [];
  
    // Process creation and assignment first
    if (activityLogs.some(log => log.action === 'creation')) {
      transitions.push({state: 'Created', isBackward: false, index: 0});
    }
    if (activityLogs.some(log => log.action === 'assignment')) {
      transitions.push({state: 'Assigned', isBackward: false, index: 1});
    }
  
    // Process state changes with direction detection - MODIFIED HERE
    activityLogs.forEach(log => {
      if (log.action === 'stateChange' && log.newState) {
        const prevIndex = expectedOrder.indexOf(log.previousState || '');
        const newIndex = expectedOrder.indexOf(log.newState);
        
        // Only validate newState existence
        if (newIndex === -1) return;
        
        transitions.push({
          state: log.newState,
          isBackward: prevIndex !== -1 && newIndex < prevIndex,
          index: newIndex
        });
      }
    });
  
    // Find last backward transition
    let lastBackwardIndex = -1;
    for (let i = transitions.length - 1; i >= 0; i--) {
      if (transitions[i].isBackward) {
        lastBackwardIndex = i;
        break;
      }
    }
  
    // Determine valid transitions to consider
    const validTransitions = lastBackwardIndex >= 0 
      ? transitions.slice(lastBackwardIndex)
      : transitions;
  
    // Track visited and skipped states
    const visitedStates = new Set<string>();
    const skippedStates = new Set<string>();
    let currentMaxIndex = -1;
  
    validTransitions.forEach(transition => {
      const stateIndex = expectedOrder.indexOf(transition.state);
      
      // Track visited states
      visitedStates.add(transition.state);
  
      // Track skipped states for forward moves
      if (!transition.isBackward && stateIndex > currentMaxIndex) {
        for (let i = currentMaxIndex + 1; i < stateIndex; i++) {
          if (!validTransitions.some(t => t.index === i)) {
            skippedStates.add(expectedOrder[i]);
          }
        }
        currentMaxIndex = stateIndex;
      }
      
      if (transition.isBackward) {
        // Reset tracking for backward moves
        currentMaxIndex = stateIndex;
      }
    });
  
    // Determine current state
    const currentState = validTransitions.length > 0 
      ? validTransitions[validTransitions.length - 1].state 
      : transitions.length > 0 ? transitions[0].state : 'Created';
  
    const currentStateIndex = expectedOrder.indexOf(currentState);
  
    // Build status map
    const statusMap: Record<string, string> = {};
  
    // Always mark Created/Assigned if present in original logs
    if (activityLogs.some(log => log.action === 'creation')) {
      visitedStates.add('Created');
    }
    if (activityLogs.some(log => log.action === 'assignment')) {
      visitedStates.add('Assigned');
    }
  
    expectedOrder.forEach((state, index) => {
      if (index < currentStateIndex) {
        statusMap[state] = visitedStates.has(state) ? 'COMPLETED' :
                          skippedStates.has(state) ? 'SKIPPED' : 'OUTSTANDING';
      } else if (index === currentStateIndex) {
        statusMap[state] = 'In Progress';
      } else {
        statusMap[state] = 'OUTSTANDING';
      }
    });
  
    return { statusMap, currentState };
  };
  
  const getLogDataForState = (stateName: string, activityLogs: ActivityLog[] = [], status: string = '') => {
    if (!activityLogs || !Array.isArray(activityLogs)) return {};
  
    const formatDate = (date: Date) => {
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      };
      return date.toLocaleDateString('en-GB', options)
                 .replace(',', '')
                 .replace(' ', '-');
    };
  
  
    if (status === 'SKIPPED' || status === 'OUTSTANDING') return {};
  
    // PROPERLY SORTED SEARCH
    const stateLogs = activityLogs
      .filter(log => {
        if (stateName === 'Created') return log.action === 'creation';
        if (stateName === 'Assigned') return log.action === 'assignment';
        return log.action === 'stateChange' && log.newState === stateName;
      })
      .sort((a, b) => new Date(b.dateOfAction).getTime() - new Date(a.dateOfAction).getTime());
  
    return stateLogs[0] ? {
      assigneeName: stateLogs[0].userName,
      actionDate: formatDate(new Date(stateLogs[0].dateOfAction))
    } : {};
  };
  
  // Add this color mapping function
  const getColorForStatus = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'text-green-500';
      case 'In Progress': return 'text-yellow-500';
      case 'SKIPPED': return 'text-gray-500';
      default: return 'text-red-500';
    }
  };

  if (ticketStatus == "New") {
    if (assigneeName == undefined) {
      ticketWorkflowActionBtns = [];
      const creationData = getLogDataForState('Created', activityLogsData);
      items = [
        { name: "Closed", status: "OUTSTANDING", color: "text-red-500" },
        { name: "Cancelled", status: "OUTSTANDING", color: "text-red-500" },
        { name: "Resolved", status: "OUTSTANDING", color: "text-red-500" },
        { name: "Restoration", status: "OUTSTANDING", color: "text-red-500" },
        { name: "On Hold", status: "OUTSTANDING", color: "text-red-500" },
        { name: "In Progress", status: "OUTSTANDING", color: "text-red-500" },
        { name: "Assigned", status: "OUTSTANDING", color: "text-red-500" },
        {
          name: "Created",
          status: "COMPLETED",
          color: "text-yellow-500",
          dropdown: true, ...(creationData || {})
        },
      ];
      if (isAdmin || isLevel2 || isNOC) {
        ticketWorkflowActionBtns.push({
          btnText: "Assign Ticket",
          btnIcon: <UserPlus />,
          btnID: "btnProceedAssigned",
          btnFn: openAssigneeForm,
        });
      } else {
        ticketWorkflowActionBtns.push({
          btnText: "Assign Ticket",
          btnIcon: <UserPlus />,
          btnID: "btnProceedAssigned",
          btnFn: openAssigneeForm,
        });
      }
    } else {
      ticketWorkflowActionBtns = [];
      const assignedData = getLogDataForState('Assigned', activityLogsData);
      const createdData = getLogDataForState('Created', activityLogsData);
      items = [
        { name: "Closed", status: "OUTSTANDING", color: "text-red-500" },
        { name: "Cancelled", status: "OUTSTANDING", color: "text-red-500" },
        { name: "Resolved", status: "OUTSTANDING", color: "text-red-500" },
        { name: "Restoration", status: "OUTSTANDING", color: "text-red-500" },
        { name: "On Hold", status: "OUTSTANDING", color: "text-red-500" },
        { name: "In Progress", status: "OUTSTANDING", color: "text-red-500" },
        {
          name: "Assigned",
          status: "In Progress",
          color: "text-yellow-500",
          dropdown: true,
          ...assignedData
        },
        { name: "Created", status: "COMPLETED", color: "text-green-500",  ...createdData// Add dynamic assignee name
           },
      ];
      if (assigneeId === userId) {
        ticketWorkflowActionBtns.push({
          btnText: "Proceed to In Progress",
          btnIcon: <Send />,
          btnID: "btnProceedToInProgress",
          btnFn: openCommentFormForAssignToInProgress,
        });
        ticketWorkflowActionBtns.push({
          btnText: "Cancel Ticket",
          btnIcon: <X />,
          btnID: "btnProceedToCancelled",
          btnFn: openCommentFormForAssignToCancel,
        });
      }
    }
  }
  if (ticketStatus == "In Progress") {
    ticketWorkflowActionBtns = [];
    const inProgressData = getLogDataForState('In Progress', activityLogsData);
    const { statusMap } = getStateCompletionStatus(activityLogsData);

    items = [
      { 
        name: "Closed",
        ...getLogDataForState('Closed', activityLogsData, statusMap.Closed),
        status: statusMap.Closed,
        color: getColorForStatus(statusMap.Closed)
      },
      {
        name: "Cancelled",
        ...getLogDataForState('Cancelled', activityLogsData, statusMap.Cancelled),
        status: statusMap.Cancelled,
        color: getColorForStatus(statusMap.Cancelled),
      },
      { 
        name: "Resolved",
        ...getLogDataForState('Resolved', activityLogsData,  statusMap.Restoration),
        status: statusMap.Resolved,
        color: getColorForStatus(statusMap.Resolved)
      },
      { 
        name: "Restoration",
        ...getLogDataForState('Restoration', activityLogsData,  statusMap.Restoration),
        status: statusMap.Restoration,
        color: getColorForStatus(statusMap.Restoration)
      },
      { 
        name: "On Hold",
        ...getLogDataForState('On Hold', activityLogsData, statusMap['On Hold']),
        status: statusMap['On Hold'],
        color: getColorForStatus(statusMap['On Hold'])
      },
      { 
        name: "In Progress",
        ...getLogDataForState('In Progress', activityLogsData, statusMap['In Progress']),
        status: statusMap['In Progress'],
        color: getColorForStatus(statusMap['In Progress']),
        dropdown: true
      },
      { 
        name: "Assigned",
        ...getLogDataForState('Assigned', activityLogsData, statusMap.Assigned),
        status: statusMap.Assigned,
        color: getColorForStatus(statusMap.Assigned)
      },
      { 
        name: "Created",
        ...getLogDataForState('Created', activityLogsData,statusMap.Created),
        status: statusMap.Created,
        color: getColorForStatus(statusMap.Created)
      }
    ];
    if (assigneeId === userId) {
      ticketWorkflowActionBtns.push({
        btnText: "Proceed to Restoration",
        btnIcon: <Send />,
        btnID: "btnProceedToRestoration",
        btnFn: openCommentFormForInProgressToRestore,
      });
      ticketWorkflowActionBtns.push({
        btnText: "Proceed to Resolve",
        btnIcon: <CircleCheckBig />,
        btnID: "btnProceedToResolve",
        btnFn: openCommentFormForInProgressToResolve,
      });
      ticketWorkflowActionBtns.push({
        btnText: "Put On Hold",
        btnIcon: <Pause />,
        btnID: "btnProceedToOnHold",
        btnFn: openCommentFormForInProgressToOnHold,
      });
      ticketWorkflowActionBtns.push({
        btnText: "Cancel Ticket",
        btnIcon: <X />,
        btnID: "btnopenCommentFormForInProgressToCancell",
        btnFn: openCommentFormForInProgressToCancell,
      });
    }
    if (
      assigneeLockStatus === "unlocked" &&
      (userId === assigneeId || isAdmin)
    ) {
      ticketWorkflowActionBtns.push({
        btnText: "Re-Assign Ticket",
        btnIcon: <UserPlus />,
        btnID: "btnInProgressReAssign",
        btnFn: openAssigneeForm,
      });
    }
  }
  if (ticketStatus == "On Hold") {
    ticketWorkflowActionBtns = [];
    const { statusMap } = getStateCompletionStatus(activityLogsData);

    items = [
      { 
        name: "Closed",
        ...getLogDataForState('Closed', activityLogsData, statusMap.Closed),
        status: statusMap.Closed,
        color: getColorForStatus(statusMap.Closed)
      },
      {
        name: "Cancelled",
        ...getLogDataForState('Cancelled', activityLogsData, statusMap.Cancelled),
        status: statusMap.Cancelled,
        color: getColorForStatus(statusMap.Cancelled),
      },
      { 
        name: "Resolved",
        ...getLogDataForState('Resolved', activityLogsData,  statusMap.Restoration),
        status: statusMap.Resolved,
        color: getColorForStatus(statusMap.Resolved)
      },
      { 
        name: "Restoration",
        ...getLogDataForState('Restoration', activityLogsData,  statusMap.Restoration),
        status: statusMap.Restoration,
        color: getColorForStatus(statusMap.Restoration)
      },
      { 
        name: "On Hold",
        ...getLogDataForState('On Hold', activityLogsData, statusMap['On Hold']),
        status: statusMap['On Hold'],
        color: getColorForStatus(statusMap['On Hold']),
        dropdown: true
      },
      { 
        name: "In Progress",
        ...getLogDataForState('In Progress', activityLogsData, statusMap['In Progress']),
        status: statusMap['In Progress'],
        color: getColorForStatus(statusMap['In Progress'])
      },
      { 
        name: "Assigned",
        ...getLogDataForState('Assigned', activityLogsData, statusMap.Assigned),
        status: statusMap.Assigned,
        color: getColorForStatus(statusMap.Assigned)
      },
      { 
        name: "Created",
        ...getLogDataForState('Created', activityLogsData,statusMap.Created),
        status: statusMap.Created,
        color: getColorForStatus(statusMap.Created)
      }
    ];
    if (assigneeId === userId) {
      ticketWorkflowActionBtns.push({
        btnText: "Proceed to in Progress",
        btnIcon: <Send />,
        btnID: "btnopenCommentFormForOnHoldToInProgress",
        btnFn: openCommentFormForOnHoldToInProgress,
      });
      ticketWorkflowActionBtns.push({
        btnText: "Cancel Ticket",
        btnIcon: <X />,
        btnID: "btnopenCommentFormForOnHoldToCancel",
        btnFn: openCommentFormForOnHoldToCancel,
      });
    }
    if (
      assigneeLockStatus === "unlocked" &&
      (userId === assigneeId || isAdmin)
    ) {
      ticketWorkflowActionBtns.push({
        btnText: "Re-Assign Ticket",
        btnIcon: <UserPlus />,
        btnID: "btnOnHoldReAssign",
        btnFn: openAssigneeForm,
      });
    }
  }

  if (ticketStatus == "Restoration") {
    const { statusMap } = getStateCompletionStatus(activityLogsData);
    ticketWorkflowActionBtns = [];
    items = [
      { 
        name: "Closed",
        ...getLogDataForState('Closed', activityLogsData, statusMap.Closed),
        status: statusMap.Closed,
        color: getColorForStatus(statusMap.Closed)
      },
      {
        name: "Cancelled",
        ...getLogDataForState('Cancelled', activityLogsData, statusMap.Cancelled),
        status: statusMap.Cancelled,
        color: getColorForStatus(statusMap.Cancelled),
      },
      { 
        name: "Resolved",
        ...getLogDataForState('Resolved', activityLogsData,  statusMap.Resolved),
        status: statusMap.Resolved,
        color: getColorForStatus(statusMap.Resolved)
      },
      { 
        name: "Restoration",
        ...getLogDataForState('Restoration', activityLogsData,  statusMap.Restoration),
        status: statusMap.Restoration,
        color: getColorForStatus(statusMap.Restoration),
        dropdown: true
      },
      { 
        name: "On Hold",
        ...getLogDataForState('On Hold', activityLogsData, statusMap['On Hold']),
        status: statusMap['On Hold'],
        color: getColorForStatus(statusMap['On Hold'])
      },
      { 
        name: "In Progress",
        ...getLogDataForState('In Progress', activityLogsData, statusMap['In Progress']),
        status: statusMap['In Progress'],
        color: getColorForStatus(statusMap['In Progress'])
      },
      { 
        name: "Assigned",
        ...getLogDataForState('Assigned', activityLogsData, statusMap.Assigned),
        status: statusMap.Assigned,
        color: getColorForStatus(statusMap.Assigned)
      },
      { 
        name: "Created",
        ...getLogDataForState('Created', activityLogsData,statusMap.Created),
        status: statusMap.Created,
        color: getColorForStatus(statusMap.Created)
      }
    ];

    if (assigneeId === userId) {
      ticketWorkflowActionBtns.push({
        btnText: "Proceed to Resolve",
        btnIcon: <CircleCheckBig />,
        btnID: "btnopenCommentFormForRestorationToResolve",
        btnFn: openCommentFormForRestorationToResolve,
      });
    }
    // ticketWorkflowActionBtns.push({
    //   btnText: "Cancel Ticket",
    //   btnIcon: <Send />,
    //   btnID: "btnProceedToCancelled",
    //   btnFn: invokeProceedToCancelled
    // });

    if (
      assigneeLockStatus === "unlocked" &&
      (userId === assigneeId || isAdmin)
    ) {
      ticketWorkflowActionBtns.push({
        btnText: "Re-Assign Ticket",
        btnIcon: <UserPlus />,
        btnID: "btnInRestorationReAssign",
        btnFn: openAssigneeForm,
      });
    }
  }

  if (ticketStatus == "Resolved") {
    ticketWorkflowActionBtns = [];
    const { statusMap } = getStateCompletionStatus(activityLogsData);

    items = [
      { 
        name: "Closed",
        ...getLogDataForState('Closed', activityLogsData, statusMap.Closed),
        status: statusMap.Closed,
        color: getColorForStatus(statusMap.Closed)
      },
      {
        name: "Cancelled",
        ...getLogDataForState('Cancelled', activityLogsData, statusMap.Cancelled),
        status: statusMap.Cancelled,
        color: getColorForStatus(statusMap.Cancelled),
      },
      { 
        name: "Resolved",
        ...getLogDataForState('Resolved', activityLogsData,  statusMap.Restoration),
        status: statusMap.Resolved,
        color: getColorForStatus(statusMap.Resolved),
        dropdown: true
      },
      { 
        name: "Restoration",
        ...getLogDataForState('Restoration', activityLogsData,  statusMap.Restoration),
        status: statusMap.Restoration,
        color: getColorForStatus(statusMap.Restoration)
      },
      { 
        name: "On Hold",
        ...getLogDataForState('On Hold', activityLogsData, statusMap['On Hold']),
        status: statusMap['On Hold'],
        color: getColorForStatus(statusMap['On Hold'])
      },
      { 
        name: "In Progress",
        ...getLogDataForState('In Progress', activityLogsData, statusMap['In Progress']),
        status: statusMap['In Progress'],
        color: getColorForStatus(statusMap['In Progress'])
      },
      { 
        name: "Assigned",
        ...getLogDataForState('Assigned', activityLogsData, statusMap.Assigned),
        status: statusMap.Assigned,
        color: getColorForStatus(statusMap.Assigned)
      },
      { 
        name: "Created",
        ...getLogDataForState('Created', activityLogsData,statusMap.Created),
        status: statusMap.Created,
        color: getColorForStatus(statusMap.Created)
      }
    
    ];

    if (assigneeId === userId) {
      ticketWorkflowActionBtns.push({
        btnText: "Close Ticket",
        btnIcon: <Check />,
        btnID: "btnProceedToClose",
        btnFn: openCommentFormForResolvedToClose,
      });
      ticketWorkflowActionBtns.push({
        btnText: "Re-Open Ticket",
        btnIcon: <RotateCcw />,
        btnID: "btnProceedToInProgress",
        btnFn: openCommentFormForResolvedToReOpen,
      });
    }

    if (
      assigneeLockStatus === "unlocked" &&
      (userId === assigneeId || isAdmin)
    ) {
      ticketWorkflowActionBtns.push({
        btnText: "Re-Assign Ticket",
        btnIcon: <UserPlus />,
        btnID: "btnInResolvedReAssign",
        btnFn: openAssigneeForm,
      });
    }
  }

 if (ticketStatus == "Cancelled") {
  ticketWorkflowActionBtns = [];
  const { statusMap } = getStateCompletionStatus(activityLogsData);

  items = [
    { 
      name: "Closed",
      ...getLogDataForState('Closed', activityLogsData, statusMap.Closed),
      status: statusMap.Closed,
      color: getColorForStatus(statusMap.Closed)
    },
    {
      name: "Cancelled",
      ...getLogDataForState('Cancelled', activityLogsData, statusMap.Cancelled),
      status: statusMap.Cancelled,
      color: getColorForStatus(statusMap.Cancelled),
      dropdown: true
    },
    { 
      name: "Resolved",
      ...getLogDataForState('Resolved', activityLogsData,  statusMap.Restoration),
      status: statusMap.Resolved,
      color: getColorForStatus(statusMap.Resolved)
    },
    { 
      name: "Restoration",
      ...getLogDataForState('Restoration', activityLogsData,  statusMap.Restoration),
      status: statusMap.Restoration,
      color: getColorForStatus(statusMap.Restoration)
    },
    { 
      name: "On Hold",
      ...getLogDataForState('On Hold', activityLogsData, statusMap['On Hold']),
      status: statusMap['On Hold'],
      color: getColorForStatus(statusMap['On Hold'])
    },
    { 
      name: "In Progress",
      ...getLogDataForState('In Progress', activityLogsData, statusMap['In Progress']),
      status: statusMap['In Progress'],
      color: getColorForStatus(statusMap['In Progress'])
    },
    { 
      name: "Assigned",
      ...getLogDataForState('Assigned', activityLogsData, statusMap.Assigned),
      status: statusMap.Assigned,
      color: getColorForStatus(statusMap.Assigned)
    },
    { 
      name: "Created",
      ...getLogDataForState('Created', activityLogsData,statusMap.Created),
      status: statusMap.Created,
      color: getColorForStatus(statusMap.Created)
    }
  ];

    if (assigneeId === userId) {
      ticketWorkflowActionBtns.push({
        btnText: "Close Ticket",
        btnIcon: <Check />,
        btnID: "btnProceedToClose",
        btnFn: openCommentFormForCancelToClose,
      });
      ticketWorkflowActionBtns.push({
        btnText: "Re-Open Ticket",
        btnIcon: <RotateCcw />,
        btnID: "btnProceedToInProgress",
        btnFn: openCommentFormForCancelToReOpen,
      });
    }

    if (
      assigneeLockStatus === "unlocked" &&
      (userId === assigneeId || isAdmin)
    ) {
      ticketWorkflowActionBtns.push({
        btnText: "Re-Assign Ticket",
        btnIcon: <UserPlus />,
        btnID: "btnCloseReAssign",
        btnFn: openAssigneeForm,
      });
    }
  }

  if (ticketStatus == "Closed") {
    ticketWorkflowActionBtns = [];
  const { statusMap } = getStateCompletionStatus(activityLogsData);

  items = [
    { 
      name: "Closed",
      ...getLogDataForState('Closed', activityLogsData, statusMap.Closed),
      status: "COMPLETED",
      color: 'text-green-500'
    },
    {
      name: "Cancelled",
      ...getLogDataForState('Cancelled', activityLogsData, statusMap.Cancelled),
      status: statusMap.Cancelled,
      color: getColorForStatus(statusMap.Cancelled),
      dropdown: true
    },
    { 
      name: "Resolved",
      ...getLogDataForState('Resolved', activityLogsData,  statusMap.Restoration),
      status: statusMap.Resolved,
      color: getColorForStatus(statusMap.Resolved)
    },
    { 
      name: "Restoration",
      ...getLogDataForState('Restoration', activityLogsData,  statusMap.Restoration),
      status: statusMap.Restoration,
      color: getColorForStatus(statusMap.Restoration)
    },
    { 
      name: "On Hold",
      ...getLogDataForState('On Hold', activityLogsData, statusMap['On Hold']),
      status: statusMap['On Hold'],
      color: getColorForStatus(statusMap['On Hold'])
    },
    { 
      name: "In Progress",
      ...getLogDataForState('In Progress', activityLogsData, statusMap['In Progress']),
      status: statusMap['In Progress'],
      color: getColorForStatus(statusMap['In Progress'])
    },
    { 
      name: "Assigned",
      ...getLogDataForState('Assigned', activityLogsData, statusMap.Assigned),
      status: statusMap.Assigned,
      color: getColorForStatus(statusMap.Assigned)
    },
    { 
      name: "Created",
      ...getLogDataForState('Created', activityLogsData,statusMap.Created),
      status: statusMap.Created,
      color: getColorForStatus(statusMap.Created)
    }
  ];
  }

  console.log("Load Won Form function triggered." , items);
  console.log(items)
  console.log(
    "Load Won Form function ticketWorkflowActionBtns." +
      ticketWorkflowActionBtns
  );
  console.log(ticketWorkflowActionBtns);
  console.log(items);
  return (
    <>
      <TicketWorkflowComponentTemplet
        items={items}
        pipelineActionBtns={ticketWorkflowActionBtns}
      />

      <CreateAssigneeModalForm
        isOpen={isModalOpen}
        onClose={closeAssigneeForm}
        ticketNo={ticketNo}
      />

      {/* ASSIGN ------------>>>>>>>>>>>>>>>>>>...*/}
      {/* Assign to In Progress */}
      {isAssignToInProgress && selectedTicketNoforComment && (
        <CommentModalForm
          isOpen={isAssignToInProgress}
          onClose={closeCommentForm}
          ticketNo={selectedTicketNoforComment}
          action="updateTicketStatus"
          transition="Update"
          state="In Progress"
        />
      )}

      {/* Cancel Ticket*/}
      {(isAssignToCancel || isInProgressToCancel || isOnHoldToCancel) &&
        selectedTicketNoforComment && (
          <CommentModalForm
            isOpen={
              isAssignToCancel
                ? isAssignToCancel
                : isInProgressToCancel
                ? isInProgressToCancel
                : isOnHoldToCancel
            }
            onClose={closeCommentForm}
            ticketNo={selectedTicketNoforComment}
            action="updateTicketStatus"
            transition="Cancel"
            state="Cancelled"
          />
        )}

      {/* In Progress -------------------->>>>>>>>>>*/}
      {/* Proceed to Restoration */}
      {isInProgressToRestore && selectedTicketNoforComment && (
        <CommentModalForm
          isOpen={isInProgressToRestore}
          onClose={closeCommentForm}
          ticketNo={selectedTicketNoforComment}
          action="updateTicketStatus"
          transition="Update"
          state="Restoration"
        />
      )}

      {/* Proceed to Resolve */}

      {isInProgressToResolve && selectedTicketNoforComment && (
        <CommentModalForm
          isOpen={isInProgressToResolve}
          onClose={closeCommentForm}
          ticketNo={selectedTicketNoforComment}
          action="updateTicketStatus"
          transition="Resolve"
          state="Resolved"
        />
      )}

      {/* Put On Hold */}

      {isInProgressToOnHold && selectedTicketNoforComment && (
        <CommentModalForm
          isOpen={isInProgressToOnHold}
          onClose={closeCommentForm}
          ticketNo={selectedTicketNoforComment}
          action="updateTicketStatus"
          transition="Update"
          state="On Hold"
        />
      )}

      {/* .--------------------------------------- */}

      {/* On Hold=--------------------------->>>>>> */}
      {/* Proceed to In Progress */}
      {isOnHoldToInProgress && selectedTicketNoforComment && (
        <CommentModalForm
          isOpen={isOnHoldToInProgress}
          onClose={closeCommentForm}
          ticketNo={selectedTicketNoforComment}
          action="updateTicketStatus"
          transition="Update"
          state="In Progress"
        />
      )}

      {/* Restoration -------------->>>>>>>>>*/}

      {/* Proceed to Resolve */}

      {isRestorationToResolve && selectedTicketNoforComment && (
        <CommentModalForm
          isOpen={isRestorationToResolve}
          onClose={closeCommentForm}
          ticketNo={selectedTicketNoforComment}
          action="updateTicketStatus"
          transition="Resolve"
          state="Resolved"
        />
      )}
      {/* Resolved--------------------------->>>>>>>>>>>>>>> */}
      {/* Close Ticket*/}
      {isResolvedToClose && selectedTicketNoforComment && (
        <CommentModalForm
          isOpen={isResolvedToClose}
          onClose={closeCommentForm}
          ticketNo={selectedTicketNoforComment}
          action="updateTicketStatus"
          transition="Close"
          state="Closed"
        />
      )}

      {/* Re-Open Ticket */}
      {isResolvedToPeOpen && selectedTicketNoforComment && (
        <CommentModalForm
          isOpen={isResolvedToPeOpen}
          onClose={closeCommentForm}
          ticketNo={selectedTicketNoforComment}
          action="updateTicketStatus"
          transition="Reopen from Resolve"
          state="In Progress"
        />
      )}
      {/* Cancelled ---------------->>>>>>>>>>>>*/}
      {/* Re-Open Ticket */}
      {isCancelToReOpen && selectedTicketNoforComment && (
        <CommentModalForm
          isOpen={isCancelToReOpen}
          onClose={closeCommentForm}
          ticketNo={selectedTicketNoforComment}
          action="updateTicketStatus"
          transition="Reopen from Cancel"
          state="In Progress"
        />
      )}

      {/* Close Ticket */}

      {isCancelToClose && selectedTicketNoforComment && (
        <CommentModalForm
          isOpen={isCancelToClose}
          onClose={closeCommentForm}
          ticketNo={selectedTicketNoforComment}
          action="updateTicketStatus"
          transition="Cancel To Close"
          state="Closed"
        />
      )}
    </>
  );
};

export default TicketWorkflowComponent;
function toggleModal(): void {
  throw new Error("Function not implemented.");
}
