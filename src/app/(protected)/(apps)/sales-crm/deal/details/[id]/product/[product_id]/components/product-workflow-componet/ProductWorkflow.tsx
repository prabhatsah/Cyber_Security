"use client"
import WorkflowComponent from "@/app/(protected)/(apps)/sales-crm/components/workflows";

import { CornerRightDown, Send } from "lucide-react";
//import { invokeLeadsPipelineTransition } from "./InvokeLeadWorkflow";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import { useState } from "react";
//import { invokeDealWorkflowTransition } from "./InvokeDealWorkflow";
import { Items, WorkflowActionBtns } from "@/app/(protected)/(apps)/sales-crm/components/type";
import { InvokeProductWorkflowTransition } from "./InvokeProductWorkflow";


interface WorkflowDataComponentProps {
    productIdentifier: string;
    productStatus: string;
    productType: string
  }
  

 var items: Items[] = [];
var productWorkflowActionBtns: WorkflowActionBtns[] = [];
const ProductWorkflowComponent: React.FC<WorkflowDataComponentProps> = ({
  productIdentifier,
  productStatus,
  productType
  }) => {
    const { openDialog } = useDialog();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stage, setIStage] = useState("");
    const handleCloseModal = ()=>{
        setIsModalOpen(false)
    }
    const productStatesMap: any = {
      "Professional Service": ["Product Created", "Schedule", "Resources and Expenses", "Quotation", "Closed State"],
      "User License": ["Product Created", "Quotation", "Closed State"],
      "Service Level Agreement" :  ["Product Created", "Quotation", "Closed State"],
    }
   
    const invokeSubmitSchedule_ProfessionalService = () => {
      console.log("hii");
      const taskName = "Schedule";
      const transitionName = "Submit Schedule";
      const msg = `Do you want to Proceed to Resource & Expenses ?`;
  
      const productStatus = "Schedule Submitted From Deal";
  
      openDialog({
        title: msg,
        description: "",
        confirmText: "Okay",
        cancelText: "Cancel",
        onConfirm: () =>
          InvokeProductWorkflowTransition(
            taskName,
            transitionName,
            productStatus,
            productIdentifier
          ),
        onCancel: () => console.log("Cancel action executed!"),
      });
     
    }

    const invokeSubmitQuotation_ProfessionalService = () => {
      console.log("hii");
      const taskName = "Resources";
      const transitionName = "Submit Resources";
      const msg = `Do you want to proceed ?`;
  
      const productStatus = "Submitted Resources and Expenses For Quotation";
  
      openDialog({
        title: msg,
        description: "",
        confirmText: "Okay",
        cancelText: "Cancel",
        onConfirm: () =>
          InvokeProductWorkflowTransition(
            taskName,
            transitionName,
            productStatus,
            productIdentifier
          ),
        onCancel: () => console.log("Cancel action executed!"),
      });
     
    }

    const invokeRecallScheduleFromResourceAndExpenses_ProfessionalService = () => {
      console.log("hii");
      const taskName = "Resources";
      const transitionName = "Recall From Resources to Schedule";
      const msg = `Do you want to recall to Schedule ?`;
  
      const productStatus = "Recall Schedule from Resource and Expenses";
  
      openDialog({
        title: msg,
        description: "",
        confirmText: "Okay",
        cancelText: "Cancel",
        onConfirm: () =>
          InvokeProductWorkflowTransition(
            taskName,
            transitionName,
            productStatus,
            productIdentifier
          ),
        onCancel: () => console.log("Cancel action executed!"),
      });
    }
    const invokeClosedState_ProfessionalService = () => {
      console.log("hii");
      const taskName = "PS Quotation";
      const transitionName = "Transition from PS Quotation to Closed State";
      const msg = `Do you want to proceed ?`;
  
      const productStatus = "Proceed from Quotation to Closed State";
  
      openDialog({
        title: msg,
        description: "",
        confirmText: "Okay",
        cancelText: "Cancel",
        onConfirm: () =>
          InvokeProductWorkflowTransition(
            taskName,
            transitionName,
            productStatus,
            productIdentifier
          ),
        onCancel: () => console.log("Cancel action executed!"),
      });
    }
    const invokeRecallResourcesAndExpenses_ProfessionalService = () => {
      console.log("hii");
      const taskName = "PS Quotation";
      const transitionName = "Recall from PS Quotation to Schedule";
      const msg = `Do you want to recall to Resources and Expenses ?`;
  
      const productStatus = "Recall Resources and Expenses from Quotation";
  
      openDialog({
        title: msg,
        description: "",
        confirmText: "Okay",
        cancelText: "Cancel",
        onConfirm: () =>{
          InvokeProductWorkflowTransition(
            taskName,
            transitionName,
            productStatus,
            productIdentifier
          )
          InvokeProductWorkflowTransition(
            "Schedule",
            "Submit Schedule",
            productStatus,
            productIdentifier
          )
        },
        onCancel: () => console.log("Cancel action executed")
      });
    }
    const invokeRecallScheduleFromSalesReview_ProfessionalService = () => {
      console.log("hii");
      const taskName = "PS Quotation";
      const transitionName = "Recall from PS Quotation to Schedule";
      const msg = `Do you want to recall to Schedule ?`;
  
      const productStatus = "Recall Schedule from Quotation";
  
      openDialog({
        title: msg,
        description: "",
        confirmText: "Okay",
        cancelText: "Cancel",
        onConfirm: () =>
          InvokeProductWorkflowTransition(
            taskName,
            transitionName,
            productStatus,
            productIdentifier
          ),
        onCancel: () => console.log("Cancel action executed!"),
      });
    }
    const invokeRecallQuotationFromClosedState_ProfessionalService = () => {
      console.log("hii");
      const taskName = "Closed State";
      const transitionName = "Recall From Closed State to PS Quotation";
      const msg = `Do you want to recall to Quotation ?`;
  
      const productStatus = "Recall to Quotation";
  
      openDialog({
        title: msg,
        description: "",
        confirmText: "Okay",
        cancelText: "Cancel",
        onConfirm: () =>
          InvokeProductWorkflowTransition(
            taskName,
            transitionName,
            productStatus,
            productIdentifier
          ),
        onCancel: () => console.log("Cancel action executed!"),
      });
    }
 
    if(productType == "Professional Service"){
      if(productStatus == "Product Created" || productStatus == "Recall from Resources and Expenses to Schedule" || productStatus == "Recall Schedule from Quotation" || productStatus == "Recall Schedule from Resource and Expenses"){
        items = [
          { name: "Closed State", status: "OUTSTANDING", color: "text-red-500" },
          { name: "Quotation", status: "OUTSTANDING", color: "text-red-500" },
          { name: "Resources and Expenses", status: "OUTSTANDING", color: "text-red-500" },
          { name: "Schedule", status: "In Progress", color: "text-yellow-500",dropdown: true },
          { name: "Product Created", status: "Completed", color: "text-green-500" },
        ];
        productWorkflowActionBtns = []
        productWorkflowActionBtns.push({
          btnText: "Proceed to Resources & Expenses",
          btnIcon: <Send />,
          btnID: "btnSubmitSchedule",
          btnFn: invokeSubmitSchedule_ProfessionalService
        });
      }
      if(productStatus == "Schedule Submitted From Deal" || productStatus == "Recall from Quotation to Resources and Expenses" || productStatus == "Recall Resources and Expenses from Quotation"){
        items = [
          { name: "Closed State", status: "OUTSTANDING", color: "text-red-500" },
          { name: "Quotation", status: "OUTSTANDING", color: "text-red-500" },
          { name: "Resources and Expenses", status: "In Progress", color: "text-yellow-500",dropdown: true },
          { name: "Schedule", status: "Completed", color: "text-green-500" },
          { name: "Product Created", status: "Completed", color: "text-green-500" },
        ];
        productWorkflowActionBtns = []
        productWorkflowActionBtns.push({
          btnText: "Recall to Schedule",
          btnIcon: <CornerRightDown />,
          btnID: "btnRecallSchedule",
          btnFn : invokeRecallScheduleFromResourceAndExpenses_ProfessionalService
        });
        productWorkflowActionBtns.push({
          btnText: "Proceed to Pricing",
          btnIcon: <Send />,
          btnID: "btnSubmitQuotation",
          btnFn: invokeSubmitQuotation_ProfessionalService
        });
      }
      if(productStatus == "Submitted Resources and Expenses For Quotation" || productStatus == "Recall to Quotation"){
        items = [
          { name: "Closed State", status: "OUTSTANDING", color: "text-red-500" },
          { name: "Quotation", status: "In Progress", color: "text-yellow-500" ,dropdown: true },
          { name: "Resources and Expenses", status: "Completed", color: "text-green-500" },
          { name: "Schedule", status: "Completed", color: "text-green-500" },
          { name: "Product Created", status: "Completed", color: "text-green-500" },
        ];
        productWorkflowActionBtns = []
        productWorkflowActionBtns.push({
          btnText: "Recall to Schedule",
          btnIcon: <CornerRightDown />,
          btnID: "btnRecallScheduleFromSalesReview",
          btnFn : invokeRecallScheduleFromSalesReview_ProfessionalService
        });
        productWorkflowActionBtns.push({
          btnText: "Recall to Resources and Expenses",
          btnIcon: <CornerRightDown />,
          btnID: "btnRecallToResourcesAndExpenses",
          btnFn : invokeRecallResourcesAndExpenses_ProfessionalService
        });
        productWorkflowActionBtns.push({
          btnText: "Submit Pricing",
          btnIcon: <Send />,
          btnID: "btnCloseProduct",
          btnFn: invokeClosedState_ProfessionalService
        });
      }
      if(productStatus == "Proceed from Quotation to Closed State"){
        items = [
          { name: "Closed State", status: "In Progress", color: "text-yellow-500" ,dropdown: true},
          { name: "Quotation", status: "Completed", color: "text-green-500" },
          { name: "Resources and Expenses", status: "Completed", color: "text-green-500" },
          { name: "Schedule", status: "Completed", color: "text-green-500" },
          { name: "Product Created", status: "Completed", color: "text-green-500" },
        ];
        productWorkflowActionBtns = []
        productWorkflowActionBtns.push({
          btnText: "Recall to Pricing",
          btnIcon: <CornerRightDown />,
          btnID: "btnRecallQuotationFromClosedState",
          btnFn : invokeRecallQuotationFromClosedState_ProfessionalService
        });
      
      }

   
    }
 
    return (
     
      <WorkflowComponent
      items={items}
      pipelineActionBtns={productWorkflowActionBtns}
    />


    );
  };
  
  export default ProductWorkflowComponent;
  