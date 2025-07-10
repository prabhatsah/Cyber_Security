"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import WorkflowComponent from "../../rfp-details-page/draft-workflow/workflow-component-draft";

import { CheckCheck } from "lucide-react";
import { toast } from "sonner";
import {
  completeAwardedTender,
  proceedToAwardedTender,
  proceedToContractFinalisation,
} from "@/app/(protected)/(apps)/tender-management/_utils/buyer/my-rfps/tender-workflow-functions";
import { useEffect, useMemo, useState } from "react";
import ContractModal from "../contract-modal";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import AwardTenderModal from "../award-tender-modal";
import BuyerNegotiation from "../../../buyer-negotiation-modal";
import SupplierNegotiation from "../../../../supplier/supplier-negotiation";

export default function TenderWorkflow({ bidData }: { bidData: any }) {
  console.log("in bid workflow", bidData);
  const [currentStep, setcurrentStep] = useState<string>("");
  const [bidId, setBidId] = useState<string | null>(bidData.bidId);
  const [isNegotiateModalOpen, setIsNegotiateModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const { openDialog } = useDialog();
  const stepTracker = bidData?.tenderFlow;
  useEffect(() => {
    for (let step in stepTracker) {
      if (stepTracker[step] === "IN PROGRESS") {
        setcurrentStep(step);
        break;
      }
    }
  }, [stepTracker]);

  // const stepTracker = {
  //   "Supplier Shortlisted": "COMPLETED",
  //   "Supplier Negotiation": "IN PROGRESS",
  //   "Contract Finalisation": "PENDING",
  //   "Awarded Tender": "PENDING",
  // };

  function getStatusColor(status: string) {
    switch (status) {
      case "COMPLETED":
        return "text-green-500";
      case "IN PROGRESS":
        return "text-yellow-500";
      case "PENDING":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  }

  const items = [
    {
      name: "Awarded Tender",
      status:
        stepTracker["Awarded Tender"] == "COMPLETED"
          ? "AWARDED"
          : stepTracker["Awarded Tender"],
      color: getStatusColor(stepTracker["Awarded Tender"]),
      dropdown: stepTracker["Awarded Tender"] === "IN PROGRESS" ? true : false,
    },
    {
      name: "Contract Finalisation",
      status: stepTracker["Contract Finalisation"],
      color: getStatusColor(stepTracker["Contract Finalisation"]),
      dropdown:
        stepTracker["Contract Finalisation"] === "IN PROGRESS" ? true : false,
    },
    {
      name: "Supplier Negotiation",
      status: stepTracker["Supplier Negotiation"],
      color: getStatusColor(stepTracker["Supplier Negotiation"]),
      dropdown:
        stepTracker["Supplier Negotiation"] === "IN PROGRESS" ? true : false,
    },
    {
      name: "Supplier Shortlisted",
      status: stepTracker["Supplier Shortlisted"],
      color: getStatusColor(stepTracker["Supplier Shortlisted"]),
      dropdown:
        stepTracker["Supplier Shortlisted"] === "IN PROGRESS" ? true : false,
    },
  ];

  const getActionButtons = (step: string): any[] => {
    switch (step) {
      case "Supplier Negotiation":
        return [
          {
            btnText: "Proceed to Contract Finalisation",
            btnIcon: <CheckCheck />,
            btnFn: async () => {
              console.log("Proceeded to contract finalisation");
              // Add your logic here
              try {
                if (bidData.negotiationComplete) {
                  await proceedToContractFinalisation(bidId);
                  toast.success("Proceeded to Contract Finalisation");
                } else {
                  openDialog({
                    title: "Alert",
                    description: "Finalize negotiation before proceeding",
                    confirmText: "Okay",
                    //  cancelText: "Cancel",
                    //  thirdOptionText: "Print",
                    onConfirm: () => console.log("Confirmed action executed!"),
                    //  onCancel: () => console.log("Cancel action executed!"),
                    //  onThird: () => console.log("Third action executed!"),
                  });
                }
              } catch (error) {
                toast.error("Failed to proceed to Contract Finalisation");
              }
              //toast.success("Proceeded to Contract Finalisation");
            },
          },
          {
            btnText: "Negotiate",
            btnIcon: <CheckCheck />,
            btnFn: async () => {
              setIsNegotiateModalOpen(true);
            },
          },
        ];
      case "Contract Finalisation":
        return [
          {
            btnText: "Proceed to Awarded Tender",
            btnIcon: <CheckCheck />,
            btnFn: async () => {
              console.log("Proceeded to contract finalisation");
              // Add your logic here
              try {
                if (bidData.contractFinalizedFlag) {
                  await proceedToAwardedTender(bidId);
                  toast.success("Proceeded to Awarded Tender");
                } else {
                  openDialog({
                    title: "Alert",
                    description: "Finalize contract before proceeding",
                    confirmText: "Okay",
                    //  cancelText: "Cancel",
                    //  thirdOptionText: "Print",
                    onConfirm: () => console.log("Confirmed action executed!"),
                    //  onCancel: () => console.log("Cancel action executed!"),
                    //  onThird: () => console.log("Third action executed!"),
                  });
                }
              } catch (error) {
                toast.error("Failed to proceed to awarded tender");
              }
              //toast.success("Proceeded to Contract Finalisation");
            },
          },
          {
            btnText: "Finalize Contract",
            btnIcon: <CheckCheck />,
            btnFn: async () => {
              setIsContractModalOpen(true);
            },
          },
        ];
      case "Awarded Tender":
        return [
          {
            btnText: "Award Tender",
            btnIcon: <CheckCheck />,
            btnFn: async () => {
              console.log("Proceeded to contract finalisation");
              // Add your logic here
              try {
                if (bidData.tenderAwardedFlag) {
                  await completeAwardedTender(bidId);
                  toast.success("Proceeded to Awarded Tender");
                } else {
                  openDialog({
                    title: "Alert",
                    description: "Finalize award details before proceeding",
                    confirmText: "Okay",
                    //  cancelText: "Cancel",
                    //  thirdOptionText: "Print",
                    onConfirm: () => console.log("Confirmed action executed!"),
                    //  onCancel: () => console.log("Cancel action executed!"),
                    //  onThird: () => console.log("Third action executed!"),
                  });
                }
              } catch (error) {
                toast.error("Failed to proceed to awarded tender");
              }

              //toast.success("Proceeded to Contract Finalisation");
            },
          },
          {
            btnText: "Finalize",
            btnIcon: <CheckCheck />,
            btnFn: async () => {
              setIsFinalizeModalOpen(true);
            },
          },
        ];
      default:
        return [];
    }
  };

  const RfpDraftActionBtns = useMemo(
    () => getActionButtons(currentStep),
    [currentStep]
  );

  const handleCloseDialog = () => {
    setIsNegotiateModalOpen(false);
    setIsContractModalOpen(false);
    setIsFinalizeModalOpen(false);
  };

  return (
    <>
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Workflow</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <CardDescription>
            <WorkflowComponent
              items={items}
              RfpDraftActionBtns={RfpDraftActionBtns}
            />
          </CardDescription>
        </CardContent>
      </Card>

      {isNegotiateModalOpen && (
        // <BuyerNegotiation
        //   isOpen={isNegotiateModalOpen}
        //   onClose={handleCloseDialog}
        //   bidId={bidId}
        // />
        <SupplierNegotiation
          isOpen={isNegotiateModalOpen}
          onClose={handleCloseDialog}
          bidId={bidId}
        />
      )}

      {isContractModalOpen && (
        <ContractModal
          isOpen={isContractModalOpen}
          onClose={handleCloseDialog}
          bidId={bidId}
        />
      )}

      {isFinalizeModalOpen && (
        <AwardTenderModal
          isOpen={isFinalizeModalOpen}
          onClose={handleCloseDialog}
          bidId={bidId}
        />
      )}
    </>
  );
}
