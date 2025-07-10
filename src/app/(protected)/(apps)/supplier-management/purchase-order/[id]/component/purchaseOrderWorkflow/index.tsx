"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import WorkflowComponent from "../../../../components/workflows";
import { Items, WorkflowActionBtns } from "../../../../components/type";
import { Send, Check, X, DollarSign } from "lucide-react";
import { useMemo, useState } from "react";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import { invokePOWorkflowTransition } from "./invokePurchaseOrder";
import { PaymentForm } from "./paidOrPartiallyPaidForm/paidOrPartiallyPaidModal";

export default function PurchaseOrderWorkflow({
  id,
  purchaseOrderData,
}: {
  id: string;
  purchaseOrderData: any;
}) {
  const { openDialog } = useDialog();
  const [paidOrPartiallyPaid, setOpenPaidOrPartiallyPaid] = useState(false);

  const toggleModal = () => {
    setOpenPaidOrPartiallyPaid((prev) => !prev);
  };

  const invokeRecallPOCreatedFromApproval = () => {
    const taskName = "Edit Purchase Order";
    const transitionName = "Transition To Send For Approval";
    const msg = `Do you want to send this purchase order for approval?`;
    const status = "Waiting Approval";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: async () =>
        invokePOWorkflowTransition(
          taskName,
          transitionName,
          status,
          id
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };


  const invokeApprovePurchaseOrder = () => {
    const taskName = "Send for Approval";
    const transitionName = "Transition To Approve Purchase Order";
    const msg = `Do you want to approve this order?`;
    const status = "Order Approved";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: async () =>
        invokePOWorkflowTransition(
          taskName,
          transitionName,
          status,
          id
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };

  const invokeRejectPurchaseOrder = () => {
    const taskName = "Send for Approval";
    const transitionName = "Transition To Reject Purchhase Order";
    const msg = `Do you want to reject this order?`;
    const status = "Order Rejected";

    openDialog({
      title: msg,
      description: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      onConfirm: async () =>
        invokePOWorkflowTransition(
          taskName,
          transitionName,
          status,
          id
        ),
      onCancel: () => console.log("Cancel action executed!"),
    });
  };

  const { items, actionButtons } = useMemo(() => {
    const baseItems: Items[] = [
      {
        name: "Update Payment Status",
        status: "OUTSTANDING",
        color: "text-red-500",
        dropdown: false,
      },
      {
        name: "Waiting Approval",
        status: "OUTSTANDING",
        color: "text-red-500",
        dropdown: false,
      },
      {
        name: "Purchase Order Created",
        status: "COMPLETED",
        color: "text-green-500",
        dropdown: true,
      },
    ];

    const baseActions: WorkflowActionBtns[] = [
      {
        btnText: "Send For Approval",
        btnIcon: <Send size={16} />,
        btnID: "sendForApprovalBtn",
        btnFn: invokeRecallPOCreatedFromApproval,
      },
      {
        btnText: "Approve Purchase Order",
        btnIcon: <Check size={16} />,
        btnID: "approvePurchaseOrderId",
        btnFn: invokeApprovePurchaseOrder,
      },
      {
        btnText: "Reject Purchase Order",
        btnIcon: <X size={16} />,
        btnID: "rejectPurchaseOrderId",
        btnFn: invokeRejectPurchaseOrder,
      },
      {
        btnText: "Mark as Paid/Partially Paid",
        btnIcon: <DollarSign size={16} />,
        btnID: "paidOrPartiallyPaidId",
        btnFn: () =>  setOpenPaidOrPartiallyPaid(true),
      },
    ];

    if (!purchaseOrderData?.purchaseOrderStatus) {
      return {
        items: baseItems,
        actionButtons: baseActions,
      };
    }

    const status = purchaseOrderData.purchaseOrderStatus;
    const updatedItems = [...baseItems];
    const updatedActions = [...baseActions];

    switch (status) {
      case "Created":
        updatedItems[1].status = "OUTSTANDING";
        updatedItems[1].color = "text-red-500";
        updatedItems[0].status = "OUTSTANDING";
        updatedItems[0].color = "text-red-500";
        updatedItems[0].dropdown = false;
        updatedItems[1].dropdown = false;
        updatedItems[2].dropdown = true;
        break;

      case "Waiting Approval":
        updatedItems[1].status = "IN PROGRESS";
        updatedItems[1].color = "text-yellow-500";
        updatedItems[1].dropdown = true;
        updatedItems[2].dropdown = false;
        updatedItems[0].dropdown = false;
        updatedItems[0].status = "OUTSTANDING";
        updatedItems[0].color = "text-red-500";
        break;

      case "Order Approved":
        updatedItems[1].name = "Approved";
        updatedItems[1].color = "text-green-500";
        updatedItems[0].status = "IN PROGRESS";
        updatedItems[0].color = "text-yellow-500";
        updatedItems[0].dropdown = true;
        updatedItems[1].dropdown = false;
        updatedItems[2].dropdown = false;
        break;

      case "Order Rejected":
        updatedItems[1].name = "Rejected";
        updatedItems[1].color = "text-green-500";
        updatedItems[0].status = "OUTSTANDING";
        updatedItems[1].status = "COMPLETED";
        updatedItems[0].color = "text-red-500";
        updatedItems[0].dropdown = false;
        updatedItems[1].dropdown = false;
        updatedItems[2].dropdown = false;
        break;

      case "paid":
        updatedItems[1].name = "Approved";
        updatedItems[1].color = "text-green-500";
        updatedItems[0].status = "COMPLETED";
        updatedItems[0].color = "text-green-500";
        break;
    }

    return {
      items: updatedItems,
      actionButtons: updatedActions.filter((action) => {
        if (status === "Created") {
          return ["sendForApprovalBtn"].includes(action.btnID);
        }
        if (status === "Waiting Approval") {
          return ["approvePurchaseOrderId", "rejectPurchaseOrderId"].includes(
            action.btnID
          );
        }
        if (status === "Order Approved") {
          return ["paidOrPartiallyPaidId"].includes(action.btnID);
        }
        return false;
      }),
    };
  }, [purchaseOrderData, id, openDialog]);

  return (
    <Card className="h-1/2">
      <CardHeader className="flex flex-row justify-between items-center border-b">
        <CardTitle>Purchase Order Workflow</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <WorkflowComponent items={items} pipelineActionBtns={actionButtons} />
      </CardContent>

      
        <PaymentForm isOpen={paidOrPartiallyPaid} onClose={toggleModal} data={purchaseOrderData} />
      
    </Card>

    
  );
}