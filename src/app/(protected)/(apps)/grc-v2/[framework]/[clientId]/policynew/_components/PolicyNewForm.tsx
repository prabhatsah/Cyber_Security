import { Input } from "@/app/(protected)/(apps)/ai-workforce/components/ui/Input";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormDateInput from "@/ikon/components/form-fields/date-input";
import FormInput from "@/ikon/components/form-fields/input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Form } from "@/shadcn/ui/form";
import { Label } from "@/shadcn/ui/label";
import { RadioGroupItem } from "@/shadcn/ui/radio-group";
import { Textarea } from "@/shadcn/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Schema
const PolicyFormSchema = z.object({
  POLICY_TITLE: z.string().min(1, { message: "Policy Title is Required." }),
  POLICY_OWNER: z.string().min(1, { message: "Policy Owner is Required." }),
  PROCESS_INCLUDED: z
    .string()
    .min(1, { message: "Process Included is Required" }),
  DATE_CREATED: z
    .union([z.string().transform((val) => new Date(val)), z.date()])
    .refine((val) => val instanceof Date, {
      message: "Date Created is required.",
    }),
  LAST_REVIEWED: z
    .union([
      z.string().transform((val) => (val ? new Date(val) : undefined)),
      z.date(),
    ])
    .optional(),
  NEXT_REVIEW: z
    .union([
      z.string().transform((val) => (val ? new Date(val) : undefined)),
      z.date(),
    ])
    .optional(),
});

export default function PolicyForm({
  openPolicyForm,
  setOpenPolicyForm,
  editPolicyData,
  allUsers,
}: {
  openPolicyForm: boolean;
  setOpenPolicyForm: React.Dispatch<React.SetStateAction<boolean>>;
  editPolicyData: Record<string, string> | null;
  allUsers: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [btnloading, setBtnLoading] = useState(false);
  const [showRevisionDialog, setShowRevisionDialog] = useState(false);
  const [revisionData, setRevisionData] = useState<{
    summaryOfChanges: string;
    versionOption: "current" | "new";
    newVersion: string;
  }>({
    summaryOfChanges: "",
    versionOption: "current",
    newVersion: "",
  });

  const form = useForm<z.infer<typeof PolicyFormSchema>>({
    resolver: zodResolver(PolicyFormSchema),
    defaultValues: {
      POLICY_TITLE: editPolicyData ? editPolicyData.policyTitle : "",
      POLICY_OWNER: editPolicyData ? editPolicyData.policyOwner : "",
      PROCESS_INCLUDED: editPolicyData ? editPolicyData.processIncluded : "",
      DATE_CREATED: editPolicyData?.dateCreated
        ? new Date(editPolicyData.dateCreated)
        : undefined,
      LAST_REVIEWED: editPolicyData?.lastReviewed
        ? new Date(editPolicyData.lastReviewed)
        : undefined,
      NEXT_REVIEW: editPolicyData?.nextReview
        ? new Date(editPolicyData.nextReview)
        : undefined,
    },
  });

  // Reset form on edit data change
  useEffect(() => {
    form.reset({
      POLICY_TITLE: editPolicyData ? editPolicyData.policyTitle : "",
      POLICY_OWNER: editPolicyData ? editPolicyData.policyOwner : "",
      PROCESS_INCLUDED: editPolicyData ? editPolicyData.processIncluded : "",
      DATE_CREATED: editPolicyData?.dateCreated
        ? new Date(editPolicyData.dateCreated)
        : undefined,
      LAST_REVIEWED: editPolicyData?.lastReviewed
        ? new Date(editPolicyData.lastReviewed)
        : undefined,
      NEXT_REVIEW: editPolicyData?.nextReview
        ? new Date(editPolicyData.nextReview)
        : undefined,
    });
  }, [editPolicyData, form]);

  async function savePolicyFormInfo(data: z.infer<typeof PolicyFormSchema>) {
    setBtnLoading(true);

    const policySaveFormat = {
      policyTaskId: editPolicyData?.policyTaskId || crypto.randomUUID(),
      policyTitle: data.POLICY_TITLE,
      policyOwner: data.POLICY_OWNER,
      processIncluded: data.PROCESS_INCLUDED,
      dateCreated: data.DATE_CREATED,
      lastReviewed: data.LAST_REVIEWED,
      nextReview: data.NEXT_REVIEW,
    };

    if (editPolicyData) {
      setRevisionData({
        summaryOfChanges: "",
        versionOption: "current",
        newVersion: "",
      });
      setShowRevisionDialog(true);
      setBtnLoading(false);
      return;
    }

    try {
      const policyProcessId = await mapProcessName({
        processName: "GRC Policy Management",
      });
      await startProcessV2({
        processId: policyProcessId,
        data: policySaveFormat,
        processIdentifierFields: "policyTaskId",
      });
      form.reset();
      router.refresh();
      setOpenPolicyForm(false);
      toast.success("Policy Saved Successfully", { duration: 4000 });
    } catch (error: any) {
      toast.error("Failed to save policy", { description: error.message });
    } finally {
      setBtnLoading(false);
    }
  }

  async function handlePolicyUpdateWithRevision() {
    setBtnLoading(true);

    try {
      if (!editPolicyData) throw new Error("No policy data found");

      const formValues = form.getValues();

      const policySaveFormat = {
        policyTaskId: editPolicyData.policyTaskId,
        policyTitle: formValues.POLICY_TITLE,
        policyOwner: formValues.POLICY_OWNER,
        processIncluded: formValues.PROCESS_INCLUDED,
        dateCreated: formValues.DATE_CREATED,
        lastReviewed: formValues.LAST_REVIEWED,
        nextReview: formValues.NEXT_REVIEW,
        // revisions: [
        //   {
        //     date: new Date(),
        //     summaryOfChanges: revisionData.summaryOfChanges || "",
        //     version:
        //       revisionData.versionOption === "current"
        //         ? "current"
        //         : revisionData.newVersion || "1.0",
        //     author: "currentuserid", // Replace with real user ID
        //     approvedBy: "",
        //   },
        // ],
      };

      const PolicyInstances = await getMyInstancesV2({
        processName: "GRC Policy Management",
        predefinedFilters: { taskName: "Edit Policy Registry" },
        mongoWhereClause: `this.Data.policyTaskId == "${policySaveFormat.policyTaskId}"`,
      });

      const taskId = PolicyInstances[0]?.taskId;
      if (!taskId) throw new Error("No task ID found for this policy.");

      await invokeAction({
        taskId,
        data: policySaveFormat,
        transitionName: "update edit policy registry",
        processInstanceIdentifierField: "policyTaskId",
      });

      form.reset();
      router.refresh();
      setOpenPolicyForm(false);
      setShowRevisionDialog(false);
      toast.success("Policy Updated Successfully", { duration: 4000 });
    } catch (error: any) {
      console.error("Error updating policy:", error);
      toast.error("Failed to update policy", { description: error.message });
    } finally {
      setBtnLoading(false);
    }
  }

  return (
    <>
      {/* Main Policy Form Dialog */}
      <Dialog open={openPolicyForm} onOpenChange={setOpenPolicyForm}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className="max-w-[90%] max-h-full overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>GRC Policy Form</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-lg font-semibold mb-2">Control Block</h3>
                  <div className="space-y-3">
                    <FormInput
                      formControl={form.control}
                      name="POLICY_TITLE"
                      label="Policy Title*"
                      placeholder="Enter Policy Title"
                    />
                    <FormComboboxInput
                      formControl={form.control}
                      name="POLICY_OWNER"
                      items={allUsers}
                      label="Policy Owner*"
                      placeholder="Select Policy Owner"
                    />
                    <FormComboboxInput
                      formControl={form.control}
                      name="PROCESS_INCLUDED"
                      items={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                      ]}
                      label="Process Included*"
                      placeholder="Select Process Included"
                    />
                    <FormDateInput
                      formControl={form.control}
                      name="DATE_CREATED"
                      label="Date Created*"
                      placeholder="Select Date Created"
                      dateFormat={SAVE_DATE_FORMAT_GRC}
                    />
                    <FormDateInput
                      formControl={form.control}
                      name="LAST_REVIEWED"
                      label="Last Reviewed"
                      placeholder="Select Last Reviewed Date"
                      dateFormat={SAVE_DATE_FORMAT_GRC}
                    />
                    <FormDateInput
                      formControl={form.control}
                      name="NEXT_REVIEW"
                      label="Next Review"
                      placeholder="Select Next Review Date"
                      dateFormat={SAVE_DATE_FORMAT_GRC}
                    />
                    <div className="space-y-2">
                      <Label htmlFor="upload">Attach File (optional)</Label>
                      <Input id="upload" type="file" accept=".pdf,.doc,.docx" />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Form>
          <DialogFooter>
            <Button
              onClick={form.handleSubmit(savePolicyFormInfo)}
              disabled={btnloading}
            >
              {btnloading && (
                <Loader2Icon className="animate-spin h-5 w-5 mr-2" />
              )}
              {editPolicyData ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revision Dialog */}
      <Dialog open={showRevisionDialog} onOpenChange={setShowRevisionDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Revision Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Summary of Changes */}
            <div className="space-y-2">
              <Label htmlFor="summary">Summary of Changes</Label>
              <Textarea
                id="summary"
                placeholder="Describe what was changed"
                value={revisionData.summaryOfChanges}
                onChange={(e) =>
                  setRevisionData({
                    ...revisionData,
                    summaryOfChanges: e.target.value,
                  })
                }
                rows={4}
              />
            </div>

            {/* Version Option (Custom Toggle) */}
            <div className="space-y-2">
              <Label>Version Option</Label>
              <div className="flex space-x-2">
                <Button
                  variant={
                    revisionData.versionOption === "current"
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setRevisionData({
                      ...revisionData,
                      versionOption: "current",
                    })
                  }
                >
                  Keep Current Version
                </Button>
                <Button
                  variant={
                    revisionData.versionOption === "new" ? "default" : "outline"
                  }
                  onClick={() =>
                    setRevisionData({
                      ...revisionData,
                      versionOption: "new",
                    })
                  }
                >
                  New Version
                </Button>
              </div>

              {revisionData.versionOption === "new" && (
                <div className="mt-2">
                  <Input
                    id="newVersionInput"
                    placeholder="Enter new version (e.g., 2.0)"
                    value={revisionData.newVersion}
                    onChange={(e) =>
                      setRevisionData({
                        ...revisionData,
                        newVersion: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRevisionDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePolicyUpdateWithRevision}
              disabled={
                btnloading ||
                !revisionData.summaryOfChanges ||
                (revisionData.versionOption === "new" &&
                  !revisionData.newVersion)
              }
            >
              {btnloading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
