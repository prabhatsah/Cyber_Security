"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { CheckCheck, CornerRightDown, Send } from "lucide-react";
import WorkflowComponent from "./workflow-component-draft";
import { Dropdown } from "react-day-picker";
import { use, useEffect, useMemo, useState, useTransition } from "react";
import {
  approveDraft,
  backToDraft,
  backToTemplateSelection,
  proceedToApproval,
  proceedToDraft,
  publishDraft,
  rejectBid,
  rejectDraft,
} from "../../../../../_utils/buyer/my-rfps/rfp-details-page/workflow-functions";
import SelectCardModal from "../template-selection-form";
import { useRouter } from "next/navigation";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import { toast } from "sonner";
import ChatWithTextareaModal from "../draft-editor-with-ai";

export default function Workflow({
  // stepTracker,
  // draftId,
  draftDetails,
  currentUserGroups,
}: {
  // stepTracker: any;
  // draftId: string;
  draftDetails: any;
  currentUserGroups: any;
}) {
  const [currentStep, setcurrentStep] = useState<string>("");
  const [isTemplateDialogOpen, setisTemplateDialogOpen] = useState(false);
  const [isFinalizeDraftDialogOpen, setisFinalizeDraftDialogOpen] =
    useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isTenderCreator, setTenderCreator] = useState(false);
  const [isTenderReviewer, setTenderReviewer] = useState(false);
  const stepTracker = draftDetails?.stepTracker;
  const draftId = draftDetails?.id;
  const { openDialog } = useDialog();
  const handleCloseDialog = () => {
    setisTemplateDialogOpen(false);
    setisFinalizeDraftDialogOpen(false);
  };

  useEffect(() => {
    for (let step in stepTracker) {
      if (stepTracker[step] === "IN PROGRESS") {
        setcurrentStep(step);
        break;
      }
    }
  }, [stepTracker]);

  useEffect(() => {
    if (currentUserGroups) {
      const isResponseCreator = currentUserGroups.some(
        (group: any) => group.groupName === "Tender Creator"
      );
      const isResponseViewer = currentUserGroups.some(
        (group: any) => group.groupName === "Tender Reviewer"
      );
      setTenderCreator(isResponseCreator);
      setTenderReviewer(isResponseViewer);
    }
  }, [currentUserGroups]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-500"; // Green for completed
      case "IN PROGRESS":
        return "text-yellow-500"; // Yellow for in-progress
      case "PENDING":
        return "text-red-500"; // Gray for pending
      default:
        return "text-gray-400"; // Default color
    }
  };

  const getActionButtons = (step: string): any[] => {
    switch (step) {
      case "Template Selection":
        return [
          {
            btnText: "Proceed to Draft",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("Proceeded to draft");
              if (draftDetails?.selectedTemplate) {
                await proceedToDraft(draftId);
                toast.success("Proceeded to Draft");
                startTransition(() => {
                  router.refresh();
                });
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
        ];
      case "Draft":
        return [
          {
            btnText: "Proceed to Approval",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("Proceeded to approval");
              console.log("draftDetails", draftDetails);
              if (draftDetails?.draftFinalized) {
                //UNCOMMENT AFTER TESTING
                if (draftDetails) {
                  for (const [key, value] of Object.entries(draftDetails)) {
                    if (value === "" || value === null || value === undefined) {
                      openDialog({
                        title: "Alert",
                        description: "Fill all the fields before proceeding",
                        confirmText: "Okay",
                        //  cancelText: "Cancel",
                        //  thirdOptionText: "Print",
                        onConfirm: () =>
                          console.log("Confirmed action executed!"),
                        //  onCancel: () => console.log("Cancel action executed!"),
                        //  onThird: () => console.log("Third action executed!"),
                      });
                      return;
                    }
                  }
                }
                await proceedToApproval(draftId);
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
            btnText: "Finalize Tender Draft",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: () => {
              console.log("finalize draft");
              //setisFinalizeDraftDialogOpen(true);
              router.push(`./${draftId}/draft-review/${draftId}`);
            },
          },
          {
            btnText: "Back to Template Selection",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("back");
              await backToTemplateSelection(draftId);
              startTransition(() => {
                router.refresh();
              });
            },
          },
        ];
      case "Approval":
        return [
          // {
          //   btnText: "Proceed to Publish",
          //   btnIcon: <CheckCheck />,
          //   //btnID: "templateSelectId",
          //   btnFn: () => {
          //     console.log("Proceeded to publish");
          //   },
          // },
          {
            btnText: "Approve",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("approve");
              await approveDraft(draftId);
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
              await rejectDraft(draftId);
              startTransition(() => {
                router.refresh();
              });
            },
          },
          {
            btnText: "Back to Tender Draft",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("back");
              await backToDraft(draftId);
              startTransition(() => {
                router.refresh();
              });
            },
          },
        ];
      case "Publish":
        return [
          {
            btnText: "Publish Tender",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("publish draft");
              await publishDraft(draftId);
              toast.success("Draft Published");
              startTransition(() => {
                router.refresh();
              });
            },
          },
          {
            btnText: "Reject Tender",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("back");
              await rejectBid(draftId);
              startTransition(() => {
                router.refresh();
              });
            },
          },
        ];
      default:
        return [];
    }
  };

  const items = [
    {
      name: "Publish Tender for Bidding",
      status: stepTracker["Publish"],
      color: getStatusColor(stepTracker["Publish"]),
      dropdown:
        stepTracker["Publish"] === "IN PROGRESS" && isTenderReviewer
          ? true
          : false,
    },
    {
      name: "Tender Draft Approval",
      status: stepTracker["Approval"],
      color: getStatusColor(stepTracker["Approval"]),
      dropdown:
        stepTracker["Approval"] === "IN PROGRESS" && isTenderReviewer
          ? true
          : false,
    },
    {
      name: "Tender Draft",
      status: stepTracker["Draft"],
      color: getStatusColor(stepTracker["Draft"]),
      dropdown:
        stepTracker["Draft"] === "IN PROGRESS" && isTenderCreator
          ? true
          : false,
    },
    {
      name: "Buyer Template Section",
      status: stepTracker["Template Selection"],
      color: getStatusColor(stepTracker["Template Selection"]),
      dropdown:
        stepTracker["Template Selection"] === "IN PROGRESS" && isTenderCreator
          ? true
          : false,
    },
    {
      name: "Draft Creation",
      status: stepTracker["Draft Creation"],
      color: getStatusColor(stepTracker["Draft Creation"]),
      dropdown:
        stepTracker["Draft Creation"] === "IN PROGRESS" && isTenderCreator
          ? true
          : false,
    },
  ];

  const RfpDraftActionBtns = useMemo(
    () => getActionButtons(currentStep),
    [currentStep]
  );
  // RfpDraftActionBtns.push({
  //   btnText: "Select Template",
  //   btnIcon: <CheckCheck />,
  //   btnID: "templateSelectId",
  //   btnFn: () => {},
  // });

  return (
    <>
    <div className="flex-1 h-full w-full">
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
      </div>

      {isTemplateDialogOpen && (
        <SelectCardModal
          isOpen={isTemplateDialogOpen}
          onClose={handleCloseDialog}
          draftId={draftId}
        />
      )}

      {isFinalizeDraftDialogOpen && (
        <ChatWithTextareaModal
          isOpen={isFinalizeDraftDialogOpen}
          onClose={handleCloseDialog}
          draftId={draftId}
        />
      )}
    </>
  );
}
