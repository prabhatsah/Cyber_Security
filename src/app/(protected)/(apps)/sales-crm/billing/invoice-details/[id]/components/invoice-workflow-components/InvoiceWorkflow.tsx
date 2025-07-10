"use client";
import WorkflowComponent from "@/app/(protected)/(apps)/sales-crm/components/workflows";
import { AccountData, Items, WorkflowActionBtns } from "../../../../../components/type";
import { CornerRightDown, Send, X } from "lucide-react";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import { useState } from "react";
import RaiseInvoiceModalForm from "../raise-invoice-form";
import { UserIdWiseUserDetailsMapProps } from "@/ikon/utils/actions/users/type";
import PaidInvoiceModalForm from "../update-payment-status-paid-form";
import PaidOrPartiallyPaidInvoiceModalForm from "../update-payment-status-paid-partiallyPaid-form";

interface WorkflowDataComponentProps {
  invoiceIdentifier: string;
  invoiceStatus: string;
  userEmails: { label: string; value: string; }[],
  accountData: AccountData,
  invoiceDate: string,
  productInitials: string,
  userIdWiseUserDetailsMap: UserIdWiseUserDetailsMapProps,
  accountNoWiseDetails: Record<string, any>,
  thisInvoiceData: any,
  defaultBankAEDNum: string
}

var items: Items[] = [];
var invoicePipelineActionBtns: WorkflowActionBtns[] = [];
const InvoiceWorkflowComponent: React.FC<WorkflowDataComponentProps> = ({
  invoiceIdentifier,
  invoiceStatus,
  userEmails,
  accountData,
  invoiceDate,
  productInitials,
  userIdWiseUserDetailsMap,
  accountNoWiseDetails,
  thisInvoiceData,
  defaultBankAEDNum
}) => {
  const { openDialog } = useDialog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenPaid, setIsModalOpenPaid] = useState(false);
  const [isModalOpenPaidOrPartiallyPaid, setIsModalOpenPaidOrPartiallyPaid] = useState(false);
 
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleCloseModalPaid = () => {
    setIsModalOpenPaid(false);
  }
  const handleCloseModalPaidOrPartiallyPaid = () => {
    setIsModalOpenPaidOrPartiallyPaid(false);
  }

  const invokeCreateOpportunityFromLead = () => {
    console.log("hii");
    const taskName = "Lead";
    const transitionName = "Lead To Opportunity";
    const msg = `Do you want to create Opportunity?`;

    const leadStatus = "Opportunity Created From Lead";

    // openDialog({
    //   title: msg,
    //   description: "",
    //   confirmText: "Okay",
    //   cancelText: "Cancel",
    //   onConfirm: () =>
    //     invokeLeadsPipelineTransition(
    //       taskName,
    //       transitionName,
    //       leadStatus,
    //       leadIdentifier
    //     ),
    //   onCancel: () => console.log("Cancel action executed!"),
    // });
    //invokeLeadsPipelineTransition(taskName, transitionName, msg, leadStatus, leadIdentifier);
  };

  if (invoiceStatus == "unpaid") {
    invoicePipelineActionBtns = [];
    items = [
      { name: "Update Payment Status", status: "INCOMPLETE", color: "text-red-500" },
      { name: "Raise Invoice", status: "OUTSTANDING", color: "text-green-500" },
      { name: "Generated", status: "COMPLETED", color: "text-green-500" },
    ]

  }
  if (invoiceStatus == "created") {
    invoicePipelineActionBtns = [];
    items = [
      { name: "Update Payment Status", status: "OUTSTANDING", color: "text-red-500" },
      { name: "Raise Invoice", status: "IN PROGRESS", color: "text-yellow-500", dropdown: true },
      { name: "Generated", status: "COMPLETED", color: "text-green-500" },
    ]
    invoicePipelineActionBtns.push({
      btnText: "Raise Invoice",
      btnIcon: <Send />,
      btnID: "raiseInvoice",
      btnFn: () => { 
        setIsModalOpen(true)
      },
    });
  }
  if (invoiceStatus == "invoiced") {
    invoicePipelineActionBtns = [];
    items = [
      { name: "Update Payment Status", status: "IN PROGRESS", color: "text-yellow-500", dropdown: true },
      { name: "Raise Invoice", status: "COMPLETED", color: "text-green-500" },
      { name: "Generated", status: "COMPLETED", color: "text-green-500" },
    ]
    invoicePipelineActionBtns.push({
      btnText: "Paid or Partially Paid",
      btnIcon: <Send />,
      btnID: "paidOrPartiallyPaidInvoice",
      btnFn: () => {
        setIsModalOpenPaidOrPartiallyPaid(true)
       },
    },
      {
        btnText: "Cancel",
        btnIcon: <X />,
        btnID: "cancelInvoice",
        btnFn: () => { },
      }
    );
  }
  if (invoiceStatus == "paid" || invoiceStatus == "Paid") {
    invoicePipelineActionBtns = [];
    items = [
      { name: "Paid", status: "COMPLETED", color: "text-green-500" },
      { name: "Raise Invoice", status: "COMPLETED", color: "text-green-500" },
      { name: "Generated", status: "COMPLETED", color: "text-green-500" },
    ]

  }
  if (invoiceStatus == "partiallyPaid") {
    invoicePipelineActionBtns = [];
    items = [
      { name: "Partially Paid", status: "IN PROGRESS", color: "text-yellow-500", dropdown: true },
      { name: "Raise Invoice", status: "COMPLETED", color: "text-green-500" },
      { name: "Generated", status: "COMPLETED", color: "text-green-500" },
    ]
    invoicePipelineActionBtns.push({
      btnText: "Paid",
      btnIcon: <Send />,
      btnID: "paidInvoice",
      btnFn: () => { 
        setIsModalOpenPaid(true)
      },
    });

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
        pipelineActionBtns={invoicePipelineActionBtns}
      />
      <RaiseInvoiceModalForm isOpen={isModalOpen} onClose={handleCloseModal} invoiceIdentifier={invoiceIdentifier} userEmails={userEmails} accountData={accountData} invoiceDate={invoiceDate} productInitials={productInitials} userIdWiseUserDetailsMap={userIdWiseUserDetailsMap}/>
      <PaidInvoiceModalForm isOpen={isModalOpenPaid} onClose={handleCloseModalPaid} invoiceIdentifier={invoiceIdentifier} accountNoWiseDetails={accountNoWiseDetails} thisInvoiceData={thisInvoiceData}/>
      <PaidOrPartiallyPaidInvoiceModalForm isOpen={isModalOpenPaidOrPartiallyPaid} onClose={handleCloseModalPaidOrPartiallyPaid} invoiceIdentifier={invoiceIdentifier} accountNoWiseDetails={accountNoWiseDetails} thisInvoiceData={thisInvoiceData} defaultBankAEDNum={defaultBankAEDNum}/>

    </>
  );
};

export default InvoiceWorkflowComponent;
