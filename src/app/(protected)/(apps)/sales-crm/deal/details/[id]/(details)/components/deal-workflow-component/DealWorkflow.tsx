"use client"
import { Items, WorkflowActionBtns } from "../../../../../../components/type";
import { CornerRightDown, Send } from "lucide-react";
//import { invokeLeadsPipelineTransition } from "./InvokeLeadWorkflow";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import { useState } from "react";
import { invokeDealWorkflowTransition } from "./InvokeDealWorkflow";
import WorkflowComponent from "@/app/(protected)/(apps)/sales-crm/components/workflows";
import WonFormDiablogBox from "../won-form";


interface WorkflowDataComponentProps {
  dealIdentifier: string;
  dealStatus: string;
  allProductsCompleteFlag: boolean
}


var items: Items[] = [];
var dealWorkflowActionBtns: WorkflowActionBtns[] = [];
const DealWorkflowComponent: React.FC<WorkflowDataComponentProps> = ({
  dealIdentifier,
  dealStatus,
  allProductsCompleteFlag
}) => {
  const { openDialog } = useDialog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stage, setIStage] = useState("");
  const [openWonForm, setOpenWonForm] = useState(false);



  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // const invokeCreateOpportunityFromLead = ()=>{
  //     console.log("hii")
  //     const taskName = "Lead";
  // const transitionName = "Lead To Opportunity";
  // const msg = `Do you want to create Opportunity?`;

  //     const leadStatus = "Opportunity Created From Lead"

  //     openDialog({
  //         title: msg,
  //         description: "",
  //         confirmText: "Okay",
  //         cancelText: "Cancel",
  //         onConfirm: () => invokeLeadsPipelineTransition(taskName, transitionName, leadStatus, leadIdentifier),
  //         onCancel: () => console.log("Cancel action executed!"),   
  //     });
  // //invokeLeadsPipelineTransition(taskName, transitionName, msg, leadStatus, leadIdentifier);
  // }
  // const invokeRecallDiscoveryFromOpportunity = ()=>{
  //     const taskName = "Opportunity";
  // const transitionName = "Opportunity To Discovery";
  // const msg = `Do you want to recall to Discovery from Opportunity?`;

  //     const leadStatus = "Recall Discovery From Opportunity"

  //     openDialog({
  //         title: msg,
  //         description: "",
  //         confirmText: "Okay",
  //         cancelText: "Cancel",
  //         onConfirm: () => invokeLeadsPipelineTransition(taskName, transitionName, leadStatus, leadIdentifier),
  //         onCancel: () => console.log("Cancel action executed!"),   
  //     });
  // }
  // const invokeRecallLeadFromDiscovery = ()=>{
  //     const taskName = "Discovery";
  // const transitionName = "Convert To Lead";
  // const msg = `Do you want to recall to Lead from Discovery?`;

  //     const leadStatus = "Recall Lead From Discovery"

  //     openDialog({
  //         title: msg,
  //         description: "",
  //         confirmText: "Okay",
  //         cancelText: "Cancel",
  //         onConfirm: () => invokeLeadsPipelineTransition(taskName, transitionName, leadStatus, leadIdentifier),
  //         onCancel: () => console.log("Cancel action executed!"),   
  //     });
  // }
  const invokeSubmitProductForQuotation = () => {
    console.log("hii")
    const taskName = "Product";
    const transitionName = "Submit Product";
    const msg = `Do you want to submit Product(s) for Quotation ?`;
    const dealStatus = "Product Submitted for Quotation"

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () => invokeDealWorkflowTransition(taskName, transitionName, dealStatus, dealIdentifier),
      onCancel: () => console.log("Cancel action executed!"),
    });
  }
  const invokeSubmitProductForSalesReview = () => {
    console.log("hii")
    const taskName = "Quotation";
    const transitionName = "Proceed to Sales Review from Quotation";
    const msg = `Do you want to submit Quotation for Sales Review ?`;
    const dealStatus = "Sales Review from Quotation"

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () => invokeDealWorkflowTransition(taskName, transitionName, dealStatus, dealIdentifier),
      onCancel: () => console.log("Cancel action executed!"),
    });
  }
  const invokeRecallQuotationToProduct = () => {
    console.log("hii")
    const taskName = "Quotation";
    const transitionName = "Back from Quotation to Product";
    const msg = `Do you want to recall Product from Quotation ?`;
    const dealStatus = "Recall Product from Quotation"

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () => invokeDealWorkflowTransition(taskName, transitionName, dealStatus, dealIdentifier),
      onCancel: () => console.log("Cancel action executed!"),
    });
  }

  const invokeSubmitProductForClientReview = () => {
    console.log("hii")
    const taskName = "Final Sales Review";
    const transitionName = "Transition to Client Review";
    const msg = `Do you want to submit Quotation for Client Review ?`;
    const dealStatus = "Submit Quotation for Client Review"

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () => invokeDealWorkflowTransition(taskName, transitionName, dealStatus, dealIdentifier),
      onCancel: () => console.log("Cancel action executed!"),
    });
  }
  const invokeRecallQuotationFromSalesReview = () => {
    console.log("hii")
    const taskName = "Final Sales Review";
    const transitionName = "Recall From Sales Review to Quotation";
    const msg = `Do you want to recall Quotation from Sales Review ?`;
    const dealStatus = "Recall Quotation from Sales Review"

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () => invokeDealWorkflowTransition(taskName, transitionName, dealStatus, dealIdentifier),
      onCancel: () => console.log("Cancel action executed!"),
    });
  }
  const invokeRecallToSalesReview = () => {
    console.log("hii")
    const taskName = "Client Review";
    const transitionName = "Recall From Client Review to Sales Review";
    const msg = `Do you want to Recall From Client Review to Sales Review ?`;
    const dealStatus = "Recall From Client Review to Sales Review"

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: () => invokeDealWorkflowTransition(taskName, transitionName, dealStatus, dealIdentifier),
      onCancel: () => console.log("Cancel action executed!"),
    });
  }
  if (
    dealStatus == "Deal Created" ||
    dealStatus == "Recall Product From Quotation" ||
    dealStatus == "BAFO" ||
    dealStatus == "Recall from Lost to Product"
  ) {
    dealWorkflowActionBtns = []
    if (allProductsCompleteFlag) {
      items = [
        { name: "Won", status: "OUTSTANDING", color: "text-red-500" },
        { name: "Client Review", status: "OUTSTANDING", color: "text-red-500" },
        { name: "Sales Review", status: "OUTSTANDING", color: "text-red-500" },
        { name: "Quotation", status: "OUTSTANDING", color: "text-red-500" },
        { name: "Product", status: "In Progress", color: "text-yellow-500", dropdown: true },
        { name: "Deal", status: "Completed", color: "text-green-500" },
      ];
      dealWorkflowActionBtns.push({
        btnText: "Submit Product(s) for Quotation",
        btnIcon: <Send />,
        btnID: "btnSubmitProductForQuotation",
        btnFn: invokeSubmitProductForQuotation
      });
    }
    else {
      items = [
        { name: "Won", status: "OUTSTANDING", color: "text-red-500" },
        { name: "Client Review", status: "OUTSTANDING", color: "text-red-500" },
        { name: "Sales Review", status: "OUTSTANDING", color: "text-red-500" },
        { name: "Quotation", status: "OUTSTANDING", color: "text-red-500" },
        { name: "Product", status: "In Progress", color: "text-yellow-500" },
        { name: "Deal", status: "Completed", color: "text-green-500" },
      ];
    }

  }
  if (
    dealStatus == "Product Submitted for Quotation" ||
    dealStatus == "Recall Quotation from Sales Review"
  ) {
    dealWorkflowActionBtns = []
    items = [
      { name: "Won", status: "OUTSTANDING", color: "text-red-500" },
      { name: "Client Review", status: "OUTSTANDING", color: "text-red-500" },
      { name: "Sales Review", status: "OUTSTANDING", color: "text-red-500" },
      { name: "Quotation", status: "In Progress", color: "text-yellow-500", dropdown: true },
      { name: "Product", status: "Completed", color: "text-green-500" },
      { name: "Deal", status: "Completed", color: "text-green-500" },
    ];
    dealWorkflowActionBtns.push({
      btnText: "Recall to Product",
      btnIcon: <CornerRightDown />,
      btnID: "btnRecallProduct",
      btnFn: invokeRecallQuotationToProduct
    });
    dealWorkflowActionBtns.push({
      btnText: "Submit for Sales Review",
      btnIcon: <Send />,
      btnID: "btnSubmitDealForSalesReview",
      btnFn: invokeSubmitProductForSalesReview
    });
  }
  if (
    dealStatus == "Sales Review from Quotation" ||
    dealStatus == "Recall From Client Review to Sales Review"
  ) {
    dealWorkflowActionBtns = []
    items = [
      { name: "Won", status: "OUTSTANDING", color: "text-red-500" },
      { name: "Client Review", status: "OUTSTANDING", color: "text-red-500" },
      { name: "Sales Review", status: "In Progress", color: "text-yellow-500", dropdown: true },
      { name: "Quotation", status: "Completed", color: "text-green-500" },
      { name: "Product", status: "Completed", color: "text-green-500" },
      { name: "Deal", status: "Completed", color: "text-green-500" },
    ];
    dealWorkflowActionBtns.push({
      btnText: "Recall to Quotation",
      btnIcon: <CornerRightDown />,
      btnID: "btnRecallQuotationFromSalesReview",
      btnFn: invokeRecallQuotationFromSalesReview
    });
    dealWorkflowActionBtns.push({
      btnText: "Submit for Client Review",
      btnIcon: <Send />,
      btnID: "btnSubmitDealForClientReview",
      btnFn: invokeSubmitProductForClientReview
    });
  }
  if (dealStatus == "Submit Quotation for Client Review") {
    dealWorkflowActionBtns = []
    items = [
      { name: "Won", status: "OUTSTANDING", color: "text-red-500" },
      { name: "Client Review", status: "In Progress", color: "text-yellow-500", dropdown: true },
      { name: "Sales Review", status: "Completed", color: "text-green-500" },
      { name: "Quotation", status: "Completed", color: "text-green-500" },
      { name: "Product", status: "Completed", color: "text-green-500" },
      { name: "Deal", status: "Completed", color: "text-green-500" },
    ];

    dealWorkflowActionBtns.push({
      btnText: "Recall to Sales Review",
      btnIcon: <CornerRightDown />,
      btnID: "btnDealRecallToSalesReview",
      btnFn: invokeRecallToSalesReview
    });
    dealWorkflowActionBtns.push({
      btnText: "Won",
      btnIcon: <Send />,
      btnID: "btnDealWon",
      btnFn: () => {
        console.log("Button Won Clicked");
        setOpenWonForm(true);
      }
    });
    dealWorkflowActionBtns.push({
      btnText: "Lost",
      btnIcon: <Send />,
      btnID: "btnDealLost",
      btnFn: () => {

      }
    });
    dealWorkflowActionBtns.push({
      btnText: "BAFO",
      btnIcon: <Send />,
      btnID: "btnDealBAFO",
      btnFn: () => {

      }
    });

  }
  if (dealStatus == "Won") {
    items = [
      { name: "Won", status: "CONTRACTED", color: "text-green-500", dropdown: true },
      { name: "Client Review", status: "Completed", color: "text-green-500" },
      { name: "Sales Review", status: "Completed", color: "text-green-500" },
      { name: "Quotation", status: "Completed", color: "text-green-500" },
      { name: "Product", status: "Completed", color: "text-green-500" },
      { name: "Deal", status: "Completed", color: "text-green-500" },
    ];
    dealWorkflowActionBtns = []
    dealWorkflowActionBtns.push({
      btnText: "Update Won Date: ",
      btnIcon: <Send />,
      btnID: "btnSubmitDealForSalesReview",
      btnFn: () => {

      }
    });
  }
  if (dealStatus == "Won") {
    items = [
      { name: "Won", status: "CONTRACTED", color: "text-green-500", dropdown: true },
      { name: "Client Review", status: "Completed", color: "text-green-500" },
      { name: "Sales Review", status: "Completed", color: "text-green-500" },
      { name: "Quotation", status: "Completed", color: "text-green-500" },
      { name: "Product", status: "Completed", color: "text-green-500" },
      { name: "Deal", status: "Completed", color: "text-green-500" },
    ];
    dealWorkflowActionBtns = []
    dealWorkflowActionBtns.push({
      btnText: "Update Won Date: ",
      btnIcon: <Send />,
      btnID: "btnSubmitDealForSalesReview",
      btnFn: () => {

      }
    });
  }
  if (dealStatus == "Lost") {
    items = [
      { name: "Won", status: "Lost", color: "text-red-500" },
      { name: "Client Review", status: "Completed", color: "text-green-500" },
      { name: "Sales Review", status: "Completed", color: "text-green-500" },
      { name: "Quotation", status: "Completed", color: "text-green-500" },
      { name: "Product", status: "Completed", color: "text-green-500" },
      { name: "Deal", status: "Completed", color: "text-green-500" },
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
      {
        openWonForm &&
        <WonFormDiablogBox open={openWonForm} setOpen={setOpenWonForm} />
      }
      <WorkflowComponent
        items={items}
        pipelineActionBtns={dealWorkflowActionBtns}
      />
      {/* <POIModal
    isOpen={isModalOpen}
    onClose={handleCloseModal}
    stage={stage}
    leadIdentifier={leadIdentifier}
  /> */}
    </>
  );
};

export default DealWorkflowComponent;
