"use client";
import { CheckCheck } from "lucide-react";
import WorkflowComponent from "../../buyer/my-rfps/rfp-details-page/draft-workflow/workflow-component-draft";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import startBiding, {
  approveDraft,
  backToDraft,
  backToTemplateSelection,
  backToTenderAnalyzer,
  completeBid,
  proceedToApproval,
  proceedToDraft,
  proceedToTempalteSelection,
  rejectBid,
  rejectDraft,
} from "../../../_utils/supplier/bid-workflow-functions";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { startTransition, useEffect, useState } from "react";
import getSupplierId from "../../../_utils/supplier/supplier-id";
import getParticularBidData from "../get-particular-bid-data";
import SelectCardModalResponse from "../response-template-selection";
import { useRouter } from "next/navigation";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import ChatWithTextareaModal from "../finalize-respone-draft-form";
import {
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import OpenProfileReview from "../profile-review/page";
import { getAccount } from "@/ikon/utils/actions/account";
import SupplierRegistrationModal from "../../profile/profile-page/supplier-register-modal";
import { Button } from "@/shadcn/ui/button";
import SupplierNegotiation from "../supplier-negotiation";
import moment from "moment";
//import moment from "moment";

export default function BidWorkFlow({
  details,
  currentUserGroupDetails,
}: {
  details: any;
  currentUserGroupDetails: any;
}) {
  //const supplierId = getSupplierId();
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [bidData, setBidData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [isTemplateDialogOpen, setisTemplateDialogOpen] = useState(false);
  const [isProfileDialogOpen, openProfileReviewModal] = useState(false);
  const [isResponseCreator, setResponseCreator] = useState(false);
  const [isResponseReviewer, setResponseViewer] = useState(false);
  const [isFinalizeDraftDialogOpen, setisFinalizeDraftDialogOpen] =
    useState(false);
  const [accountId, setAccountId] = useState("");
  const [isNegotiationOpen, setIsNegotiationOpen] = useState(false);
  const router = useRouter();
  const { openDialog } = useDialog();
  useEffect(() => {
    if (currentUserGroupDetails) {
      const isResponseCreator = currentUserGroupDetails.some(
        (group: any) => group.groupName === "Response Creator"
      );
      const isResponseReviewer = currentUserGroupDetails.some(
        (group: any) => group.groupName === "Response Reviewer"
      );
      setResponseCreator(isResponseCreator);
      setResponseViewer(isResponseReviewer);
      // setResponseCreator(true);
      // setResponseViewer(true);
    }
  }, [currentUserGroupDetails]);

  useEffect(() => {
    const fetchData = async () => {
      const supplierId: any = await getSupplierId();
      setSupplierId(supplierId);
      setIsLoading(true);

      const account = await getAccount();
      setAccountId(account.ACCOUNT_ID);
      const data = await getParticularBidData(details.id, account.ACCOUNT_ID);
      setBidData(data);
      setIsLoading(false);
    };
    fetchData();
  }, [details.id, supplierId]); // Ensure dependencies are included

  const stepTracker = bidData[0]?.bidSteptracker || {};
  console.log("stepTracker", stepTracker);

  useEffect(() => {
    const findCurrentStep = () => {
      for (let step in stepTracker) {
        if (stepTracker[step] === "IN PROGRESS") {
          setCurrentStep(step);
          return; // Exit early to avoid unnecessary state updates
        }
      }
    };
    findCurrentStep();
  }, [bidData]); // Depend only on bidData to avoid unnecessary re-renders

  const handleCloseDialog = () => {
    setisTemplateDialogOpen(false);
    setisFinalizeDraftDialogOpen(false);
    openProfileReviewModal(false);
    setIsNegotiationOpen(false);
  };

  if (isLoading) {
    return <div>Loading bid workflow...</div>;
  }

  console.log("bidData", bidData);

  const getStatusColor = (status: string) => {
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
  };

  const handleGenerateUUID = () => {
    const newUUID = uuidv4();
    console.log("Generated UUID:", newUUID);
    return newUUID;
  };
  function hasDatePassed(date: string) {
    return moment(date).isBefore(moment(), "day");
  }

  const items = [
    {
      name: "Negotiation",
      status:
        stepTracker["Bid Completion"] == "COMPLETED"
          ? "IN PROGRESS"
          : "PENDING",
      color: getStatusColor(
        stepTracker["Bid Completion"] == "COMPLETED" ? "IN PROGRESS" : "PENDING"
      ),
      dropdown:
        (stepTracker["Bid Completion"] === "COMPLETED" &&
          isResponseReviewer &&
          !hasDatePassed(details.submissionDeadline)) ||
        false,
    },
    {
      name: "Send for Bidding",
      status: stepTracker["Bid Completion"] || "PENDING",
      color: getStatusColor(stepTracker["Bid Completion"] || "PENDING"),
      dropdown:
        (stepTracker["Bid Completion"] === "IN PROGRESS" &&
          isResponseReviewer &&
          !hasDatePassed(details.submissionDeadline)) ||
        false,
    },
    {
      name: "Draft Approval",
      status: stepTracker["Approve"] || "PENDING",
      color: getStatusColor(stepTracker["Approve"] || "PENDING"),
      dropdown:
        (stepTracker["Approve"] === "IN PROGRESS" &&
          isResponseReviewer &&
          !hasDatePassed(details.submissionDeadline)) ||
        false,
    },

    {
      name: "Response Draft",
      status: stepTracker["Draft"] || "PENDING",
      color: getStatusColor(stepTracker["Draft"] || "PENDING"),
      dropdown:
        (stepTracker["Draft"] === "IN PROGRESS" &&
          isResponseCreator &&
          !hasDatePassed(details.submissionDeadline)) ||
        false,
    },

    {
      name: "Response Template Section",
      status: stepTracker["Template Selection"] || "PENDING",
      color: getStatusColor(stepTracker["Template Selection"] || "PENDING"),
      dropdown:
        (stepTracker["Template Selection"] === "IN PROGRESS" &&
          isResponseCreator &&
          !hasDatePassed(details.submissionDeadline)) ||
        false,
    },
    {
      name: "Tender Analyzer",
      status: stepTracker["Tender Analyzer"] || "PENDING",
      color: getStatusColor(stepTracker["Tender Analyzer"] || "PENDING"),
      dropdown:
        (stepTracker["Tender Analyzer"] === "IN PROGRESS" &&
          isResponseCreator &&
          !hasDatePassed(details.submissionDeadline)) ||
        false,
    },
    {
      name: "Supplier Profile Review",
      status:
        stepTracker["Bid Initialization"] === "COMPLETED"
          ? "COMPLETED"
          : "IN PROGRESS",
      color: getStatusColor(stepTracker["Bid Initialization"] || "PENDING"),
      dropdown:
        (stepTracker["Bid Initialization"] !== "COMPLETED" &&
          isResponseCreator &&
          !hasDatePassed(details.submissionDeadline)) ||
        false,
    },
  ];

  const getActionMenu = (step: string): any[] => {
    switch (step) {
      case "Bid Initialization":
        return [
          {
            btnText: "Review Profile",
            btnIcon: <CheckCheck />,
            btnFn: async () => {
              // const stepTracker = {
              //   "Bid Initialization": "COMPLETED",
              //   "Template Selection": "IN PROGRESS",
              //   Draft: "PENDING",
              //   Approve: "PENDING",
              //   "Bid Completion": "PENDING",
              // };
              // const uid = handleGenerateUUID();
              // const data = {
              //   ...details,
              //   bidSteptracker: stepTracker,
              //   bidId: uid,
              //   supplierId: supplierId,
              // };

              // console.log(data);

              // await startBiding({ tenderData: data });
              // console.log("Instance started");

              // toast.success("Bid Initiated");

              openProfileReviewModal(true);
            },
          },
        ];
      case "Tender Analyzer":
        return [
          {
            btnText: "Proceed to Template Selection",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              if (bidData[0]?.allPrerequisiteProvided) {
                await proceedToTempalteSelection(bidData[0].id, accountId);
                toast.success("Proceeded to Draft");
              } else {
                openDialog({
                  title: "Alert",
                  description: "Upload all prerequisites before proceeding",
                  confirmText: "Okay",
                  //  cancelText: "Cancel",
                  //  thirdOptionText: "Print",
                  onConfirm: () => console.log("Confirmed action executed!"),
                  //  onCancel: () => console.log("Cancel action executed!"),
                  //  onThird: () => console.log("Third action executed!"),
                });
              }
            },
          },
          {
            btnText: "Analyze Tender",
            btnIcon: <CheckCheck />,
            btnID: "analyzetenderId",
            btnFn: () => {
              console.log("Template Selected");
              router.push(`./supplier/analyze-tender/${bidData[0].tenderId}`);
            },
          },
        ];
      case "Template Selection":
        return [
          {
            btnText: "Proceed to Draft",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("Proceeded to draft");
              if (bidData[0]?.selectedResponseTemplate) {
                await proceedToDraft(bidData[0].id, accountId);
                toast.success("Proceeded to Draft");

                // startTransition(() => {
                //   console.log("refreshing............................................");
                setTimeout(() => {
                  router.refresh();
                }, 100);

                // });
                //window.location.reload();
              } else {
                openDialog({
                  title: "Alert",
                  description: "Select a template before proceeding",
                  confirmText: "Okay",
                  //  cancelText: "Cancel",
                  //  thirdOptionText: "Print",
                  onConfirm: () => console.log("Confirmed action executed!"),
                  //  onCancel: () => console.log("Cancel action executed!"),
                  //  onThird: () => console.log("Third action executed!"),
                });
              }
            },
          },
          {
            btnText: "Select Template",
            btnIcon: <CheckCheck />,
            btnID: "templateSelectId",
            btnFn: () => {
              console.log("Template Selected");
              setisTemplateDialogOpen(true);
            },
          },
          {
            btnText: "Back to Tender Analyzer",
            btnIcon: <CheckCheck />,
            btnID: "backTenderAnalyzerId",
            btnFn: async () => {
              await backToTenderAnalyzer(bidData[0].id, accountId);
              toast.success("Back to Tender Analyzer");
            },
          },
        ];
      case "Draft":
        return [
          {
            btnText: "Proceed to Approval",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("Proceeded to approval");
              if (bidData[0]?.responseDraftFinalized) {
                await proceedToApproval(bidData[0].id, accountId);
                toast.success("Draft Proceeded to Approval");
              } else {
                openDialog({
                  title: "Alert",
                  description: "Review draft before proceeding",
                  confirmText: "Okay",
                  //  cancelText: "Cancel",
                  //  thirdOptionText: "Print",
                  onConfirm: () => console.log("Confirmed action executed!"),
                  //  onCancel: () => console.log("Cancel action executed!"),
                  //  onThird: () => console.log("Third action executed!"),
                });
              }
              startTransition(() => {
                router.refresh();
              });
            },
          },
          {
            btnText: "Finalize Draft",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: () => {
              console.log("finalize draft");
              console.log("bid data id", bidData[0].tenderId);
              console.log(
                "routed to",
                `./${bidData[0].tenderId}/draft-review/${bidData[0].tenderId}`
              );
              //setisFinalizeDraftDialogOpen(true);
              router.push(
                `./${bidData[0].tenderId}/draft-review/${bidData[0].tenderId}`
              );
            },
          },
          {
            btnText: "Back to Template Selection",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("back");
              await backToTemplateSelection(bidData[0].id, accountId);
              toast.success("Back to Template Selection");
              startTransition(() => {
                router.refresh();
              });
            },
          },
        ];
      case "Approve":
        return [
          {
            btnText: "Approve",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("approve");
              await approveDraft(bidData[0].id, accountId);
              toast.success("Draft Approved");
              startTransition(() => {
                router.refresh();
              });
            },
          },
          {
            btnText: "Reject",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("reject");
              await rejectDraft(bidData[0].id, accountId);
              toast.success("Draft Rejected");
              startTransition(() => {
                router.refresh();
              });
            },
          },
          {
            btnText: "Back to Draft",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("back");
              await backToDraft(bidData[0].id, accountId);
              toast.success("Back to Draft");
              startTransition(() => {
                router.refresh();
              });
            },
          },
        ];
      case "Bid Completion":
        return [
          {
            btnText: "Complete Bid",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("publish draft");
              await completeBid(bidData[0].id, accountId);
              toast.success("Bid Completed");
              bidData[0]["bidSteptracker"]["Bid Completion"] = "COMPLETED";
              const processId = await mapProcessName({
                processName: "Tender Management",
              });
              await startProcessV2({
                processId,
                data: {
                  ...bidData[0],
                  bidCompletionTime: new Date().toISOString(),
                },
                processIdentifierFields: "tenderId,accountId,bidId",
              });
              startTransition(() => {
                router.refresh();
              });
            },
          },
          {
            btnText: "Reject Bid",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("back");
              await rejectBid(bidData[0].id, accountId);
              toast.success("Bid Rejected");
              startTransition(() => {
                router.refresh();
              });
            },
          },
        ];
      case "Negotiation":
        return [
          {
            btnText: "Negotiate",
            btnIcon: <CheckCheck />,
            btnFn: async () => {
              setIsNegotiationOpen(true);
            },
          },
        ];
      default:
        return [];
    }
  };

  const RfpDraftActionBtns = getActionMenu(
    stepTracker["Bid Completion"] === "COMPLETED"
      ? "Negotiation"
      : currentStep
      ? currentStep
      : "Bid Initialization"
  );

  return (
    <>
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>
            Workflow
            {/* <Button onClick={() => setIsNegotiationOpen(true)}>
              Negotiation
            </Button> */}
          </CardTitle>
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
      {isTemplateDialogOpen && (
        <SelectCardModalResponse
          isOpen={isTemplateDialogOpen}
          onClose={handleCloseDialog}
          draftId={details.id}
          accountId={accountId}
        />
      )}
      {isFinalizeDraftDialogOpen && (
        <ChatWithTextareaModal
          isOpen={isFinalizeDraftDialogOpen}
          onClose={handleCloseDialog}
          draftId={details.id}
          accountId={accountId}
        />
      )}

      {isProfileDialogOpen && (
        <SupplierRegistrationModal
          isOpen={isProfileDialogOpen}
          onClose={handleCloseDialog}
          accountId={accountId}
          openedFrom={"review"}
          tenderId={details.id}
        />
      )}

      {isNegotiationOpen && (
        <SupplierNegotiation
          isOpen={isNegotiationOpen}
          onClose={handleCloseDialog}
          bidId={bidData[0].bidId}
        />
      )}
    </>
  );
}
