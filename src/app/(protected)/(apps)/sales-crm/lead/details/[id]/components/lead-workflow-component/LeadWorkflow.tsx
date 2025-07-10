"use client";
import WorkflowComponent from "@/app/(protected)/(apps)/sales-crm/components/workflows";
import { Items, WorkflowActionBtns } from "../../../../../components/type";
import { CornerRightDown, Send } from "lucide-react";
import { invokeLeadsPipelineTransition } from "./InvokeLeadWorkflow";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import { useState } from "react";
import POIModal from "./PoiForm";
import CreateLeadToDealModalForm from "./componenets-deal-form/deal_form";

interface WorkflowDataComponentProps {
  leadIdentifier: string;
  leadStatus: string;
}

var items: Items[] = [];
var leadsPipelineActionBtns: WorkflowActionBtns[] = [];
const LeadWorkflowComponent: React.FC<WorkflowDataComponentProps> = ({
  leadIdentifier,
  leadStatus,
}) => {
  const { openDialog } = useDialog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDeal, setModalOpenDeal] = useState(false);
  const [stage, setIStage] = useState("");
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const invokeCreateOpportunityFromLead = () => {
    console.log("hii");
    const taskName = "Lead";
    const transitionName = "Lead To Opportunity";
    const msg = `Do you want to create Opportunity?`;

    const leadStatus = "Opportunity Created From Lead";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () =>
        invokeLeadsPipelineTransition(
          taskName,
          transitionName,
          leadStatus,
          leadIdentifier
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
    //invokeLeadsPipelineTransition(taskName, transitionName, msg, leadStatus, leadIdentifier);
  };
  const invokeRecallDiscoveryFromOpportunity = () => {
    const taskName = "Opportunity";
    const transitionName = "Opportunity To Discovery";
    const msg = `Do you want to recall to Discovery from Opportunity?`;

    const leadStatus = "Recall Discovery From Opportunity";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () =>
        invokeLeadsPipelineTransition(
          taskName,
          transitionName,
          leadStatus,
          leadIdentifier
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };

  const createDealFromLead = () => {
    console.log("Opening deal modal for leadIdentifier:", leadIdentifier);
    setModalOpenDeal(true);
  };

  const handleCloseDealModal = () => {
    console.log("Closing deal modal...");
    setModalOpenDeal(false);
  };

  const invokeRecallLeadFromDiscovery = () => {
    const taskName = "Discovery";
    const transitionName = "Convert To Lead";
    const msg = `Do you want to recall to Lead from Discovery?`;

    const leadStatus = "Recall Lead From Discovery";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () =>
        invokeLeadsPipelineTransition(
          taskName,
          transitionName,
          leadStatus,
          leadIdentifier
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };
  if (
    leadStatus == "Lead Created" ||
    leadStatus == "Recall Lead From Discovery" ||
    leadStatus == "Recall Lead From Negotiation" ||
    leadStatus == "Rejected From Lead"
  ) {
    leadsPipelineActionBtns = [];
    items = [
      { name: "Account", status: "OUTSTANDING", color: "text-red-500" },
      { name: "Deal", status: "OUTSTANDING", color: "text-red-500" },
      { name: "Opportunity", status: "OUTSTANDING", color: "text-red-500" },
      { name: "Discovery", status: "OUTSTANDING", color: "text-red-500" },
      {
        name: "Lead",
        status: "IN PROGRESS",
        color: "text-yellow-500",
        dropdown: true,
      },
    ];
    leadsPipelineActionBtns.push({
      btnText: "Proceed to Opportunity",
      btnIcon: <Send />,
      btnID: "createOpportunityId",
      btnFn: invokeCreateOpportunityFromLead,
    });
    leadsPipelineActionBtns.push({
      btnText: "Proceed to Discovery",
      btnIcon: <Send />,
      btnID: "scheduleCallId",
      btnFn: () => {
        setIsModalOpen(true);
        setIStage("Discovery");
      },
    });
  }
  if (
    leadStatus == "Discovery Created" ||
    leadStatus == "Recall Discovery From Opportunity" ||
    leadStatus == "Recall Discovery From Negotiation" ||
    leadStatus == "Rejected From Discovery"
  ) {
    leadsPipelineActionBtns = [];
    items = [
      { name: "Account", status: "OUTSTANDING", color: "text-red-500" },
      { name: "Deal", status: "OUTSTANDING", color: "text-red-500" },
      { name: "Opportunity", status: "OUTSTANDING", color: "text-red-500" },
      {
        name: "Discovery",
        status: "IN PROGRESS",
        color: "text-yellow-500",
        dropdown: true,
      },
      { name: "Lead", status: "COMPLETED", color: "text-green-500" },
    ];
    leadsPipelineActionBtns.push({
      btnText: "Recall to Lead",
      btnIcon: <CornerRightDown />,
      btnID: "recallLeadId",
      btnFn: invokeRecallLeadFromDiscovery,
    });
    leadsPipelineActionBtns.push({
      btnText: "Create Opportunity",
      btnIcon: <Send />,
      btnID: "opportunityId",
      btnFn: () => {
        setIsModalOpen(true);
        setIStage("Opportunity");
      },
    });
  }
  if (
    leadStatus == "Opportunity Created From Lead" ||
    leadStatus == "Opportunity Created From Discovery" ||
    leadStatus == "Recall Opportunity From Proposal" ||
    leadStatus == "Rejected From Opportunity"
  ) {
    leadsPipelineActionBtns = [];
    if (leadStatus == "Rejected From Opportunity") {
      items = [
        { name: "Account", status: "OUTSTANDING", color: "text-red-500" },
        { name: "Deal", status: "OUTSTANDING", color: "text-red-500" },
        {
          name: "Opportunity",
          status: "REJECTED",
          color: "text-black-500",
        },
        { name: "Discovery", status: "COMPLETED", color: "text-green-500" },
        { name: "Lead", status: "COMPLETED", color: "text-green-500" },
      ];
    } else {
      items = [
        { name: "Account", status: "OUTSTANDING", color: "text-red-500" },
        { name: "Deal", status: "OUTSTANDING", color: "text-red-500" },
        {
          name: "Opportunity",
          status: "IN PROGRESS",
          color: "text-yellow-500",
          dropdown: true,
        },
        { name: "Discovery", status: "COMPLETED", color: "text-green-500" },
        { name: "Lead", status: "COMPLETED", color: "text-green-500" },
      ];
      leadsPipelineActionBtns.push({
        btnText: "Recall to Discovery",
        btnIcon: <CornerRightDown />,
        btnID: "recallLeadId",
        btnFn: invokeRecallDiscoveryFromOpportunity,
      });
      leadsPipelineActionBtns.push({
        btnText: "Create Deal",
        btnIcon: <Send />,
        btnID: "opportunityId",
        btnFn: createDealFromLead,
      });
    }
  }
  if (
    leadStatus == "New Proposal Requested" ||
    leadStatus == "Rejected From Proposal" ||
    leadStatus == "Proposal Prepared"
  ) {
    leadsPipelineActionBtns = [];
    items = [
      { name: "Account", status: "OUTSTANDING", color: "text-red-500" },
      {
        name: "Deal",
        status: "IN PROGRESS",
        color: "text-yellow-500",
        dropdown: false,
      },
      { name: "Opportunity", status: "COMPLETED", color: "text-green-500" },
      { name: "Discovery", status: "COMPLETED", color: "text-green-500" },
      { name: "Lead", status: "COMPLETED", color: "text-green-500" },
    ];
    if (leadStatus != "Proposal Prepared") {
      leadsPipelineActionBtns.push({
        btnText: "Recall to Opportunity",
        btnIcon: <CornerRightDown />,
        btnID: "recallLeadId",
        btnFn: () => {},
      });
      leadsPipelineActionBtns.push({
        btnText: "Submit To Client",
        btnIcon: <Send />,
        btnID: "opportunityId",
        btnFn: () => {},
      });
    }
  }
  if (leadStatus == "Account Created") {
    items = [
      { name: "Account", status: "IN PROGRESS", color: "text-yellow-500" },
      { name: "Deal", status: "COMPLETED", color: "text-green-500" },
      { name: "Opportunity", status: "COMPLETED", color: "text-green-500" },
      { name: "Discovery", status: "COMPLETED", color: "text-green-500" },
      { name: "Lead", status: "COMPLETED", color: "text-green-500" },
    ];
  }
  return (
    // <div>
    //   <h3>Notes</h3>
    //   {noteData !== "n/a" ? (
    //     <div>
    //       (<NoteComponent noteData={noteData} />)
    //     </div>
    //   ) : (
    //     <p>No notes available</p>
    //   )}
    // </div>
    <>
      <WorkflowComponent
        items={items}
        pipelineActionBtns={leadsPipelineActionBtns}
      />
      <POIModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        stage={stage}
        leadIdentifier={leadIdentifier}
      />

      {isModalOpenDeal && (
        <CreateLeadToDealModalForm
          isOpen={isModalOpenDeal}
          onClose={() => setModalOpenDeal(false)}
          leadIdentifier={leadIdentifier}
        />
      )}
    </>
  );
};

export default LeadWorkflowComponent;
