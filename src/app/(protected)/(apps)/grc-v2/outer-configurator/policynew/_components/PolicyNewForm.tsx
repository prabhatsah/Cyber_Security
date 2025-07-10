import { Input } from "@/app/(protected)/(apps)/ai-workforce/components/ui/Input";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormDateInput from "@/ikon/components/form-fields/date-input";
import FormInput from "@/ikon/components/form-fields/input";
import { getCurrentUserId } from "@/ikon/utils/actions/auth";
import { singleUAResourceUpload } from "@/ikon/utils/api/file-upload";
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
import { Textarea } from "@/shadcn/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { File, FileIcon, Loader2, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
//hardcoded approver user IDs for demonstration purposes
const APPROVAL_USERS = [
  "8f4707b7-5a53-416c-b127-7c7caacd538c",
  "95254903-82c5-42da-bb0f-0f834de3cebf",
  "user3",
]; // Replace with actual user IDs
const POLICY_STATUS = {
  DRAFT: "DRAFT",
  SEND_FOR_REVIEW: "SEND FOR REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};
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
  POLICY_STATUS: z.string().optional(),
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
  const [saveLoading, setSaveLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [showRevisionDialog, setShowRevisionDialog] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [existingAttachment, setExistingAttachment] = useState<any>(null);
  const [isApprover, setIsApprover] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [fileChanged, setFileChanged] = useState(false);
  const [revisionData, setRevisionData] = useState<{
    summaryOfChanges: string;
    versionOption: "current" | "new";
    newVersion: string;
  }>({
    summaryOfChanges: "",
    versionOption: "current",
    newVersion: "",
  });

  useEffect(() => {
    let isMounted = true; // Track if component is mounted

    const fetchAndCheckUser = async () => {
      try {
        const userId = await getCurrentUserId();
        if (!isMounted) return; // Don't update if unmounted

        setCurrentUser(userId);
        setIsApprover(APPROVAL_USERS.includes(userId));
      } catch (error) {
        console.error("Error handling user data:", error);
        if (isMounted) {
          // Optionally set error state here
        }
      }
    };

    fetchAndCheckUser();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, []);

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
    setFile(null);
    setFileName("");
    setExistingAttachment(editPolicyData?.attachment || null);
    setFileChanged(false);
  }, [editPolicyData, form]);

  // async function savePolicyFormInfo(data: z.infer<typeof PolicyFormSchema>) {
  //   setBtnLoading(true);

  //   const policySaveFormat = {
  //     policyTaskId: editPolicyData?.policyTaskId || crypto.randomUUID(),
  //     policyTitle: data.POLICY_TITLE,
  //     policyOwner: data.POLICY_OWNER,
  //     processIncluded: data.PROCESS_INCLUDED,
  //     dateCreated: data.DATE_CREATED,
  //     lastReviewed: data.LAST_REVIEWED,
  //     nextReview: data.NEXT_REVIEW,
  //     attachment: file
  //       ? {
  //           name: file.name,
  //           size: file.size,
  //           type: file.type,
  //           lastModified: file.lastModified,
  //         }
  //       : existingAttachment || null,
  //     revisions: editPolicyData?.revisions || [],
  //   };

  //   if (editPolicyData) {
  //     setRevisionData({
  //       summaryOfChanges: "",
  //       versionOption: "current",
  //       newVersion: "",
  //     });
  //     setShowRevisionDialog(true);
  //     setBtnLoading(false);
  //     return;
  //   }

  //   try {
  //     const policyProcessId = await mapProcessName({
  //       processName: "GRC Policy Management",
  //     });
  //     await startProcessV2({
  //       processId: policyProcessId,
  //       data: policySaveFormat,
  //       processIdentifierFields: "policyTaskId",
  //     });
  //     form.reset();
  //     setFile(null);
  //     setFileName("");
  //     setExistingAttachment(null);
  //     router.refresh();
  //     setOpenPolicyForm(false);
  //     toast.success("Policy Saved Successfully", { duration: 4000 });
  //   } catch (error: any) {
  //     toast.error("Failed to save policy", { description: error.message });
  //   } finally {
  //     setBtnLoading(false);
  //   }
  // }
  // Add this helper function at the top of your component
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  async function uploadFileToPublic(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      process.env.NEXT_BASE_PATH_URL + "/api/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) throw new Error("Upload failed");

    const result = await response.json();
    return result.url;
  }
  async function savePolicyFormInfo(data: z.infer<typeof PolicyFormSchema>) {
    setSaveLoading(true);

    try {
      let attachment = null;
      if (fileChanged && file) {
        const fileInfo = await singleUAResourceUpload(file, "S2GRC");
        console.log("fileInfo new---", fileInfo);
        attachment = {
          url: fileInfo.resourceName,
        };
      } else if (existingAttachment) {
        attachment = existingAttachment;
      }

      const policySaveFormat = {
        policyTaskId: editPolicyData?.policyTaskId || crypto.randomUUID(),
        policyTitle: data.POLICY_TITLE,
        policyOwner: data.POLICY_OWNER,
        processIncluded: data.PROCESS_INCLUDED,
        dateCreated: data.DATE_CREATED,
        lastReviewed: data.LAST_REVIEWED,
        nextReview: data.NEXT_REVIEW,
        attachment,
        revisions: editPolicyData?.revisions || [],
        policyStatus: "SEND FOR REVIEW",
      };

      if (editPolicyData) {
        // if (isApprover || editPolicyData.policyStatus === POLICY_STATUS.DRAFT) {
        //   setRevisionData({
        //     summaryOfChanges: "",
        //     versionOption: "current",
        //     newVersion: "",
        //   });
        //   setShowRevisionDialog(true);
        //   setBtnLoading(false);
        //   return;
        // } else {
        //
        // }
        setRevisionData({
          summaryOfChanges: "",
          versionOption: "current",
          newVersion: "",
        });
        setShowRevisionDialog(true);
        setBtnLoading(false);
        return;
      }

      const policyProcessId = await mapProcessName({
        processName: "GRC Policy Management",
      });
      await startProcessV2({
        processId: policyProcessId,
        data: policySaveFormat,
        processIdentifierFields: "policyTaskId",
      });

      form.reset();
      setFile(null);
      setFileName("");
      setExistingAttachment(null);
      router.refresh();
      setOpenPolicyForm(false);
      toast.success("Policy Saved Successfully", { duration: 4000 });
    } catch (error: any) {
      toast.error("Failed to save policy", { description: error.message });
    } finally {
      setSaveLoading(false);
    }
  }
  async function handleApproval(action: "approve" | "reject") {
    if (action === "approve") {
      setApproveLoading(true);
    } else {
      setRejectLoading(true);
    }

    try {
      if (!editPolicyData) throw new Error("No policy data found");

      // Get the current form values
      const formValues = form.getValues();

      // Prepare the attachment
      let attachment = null;
      if (fileChanged && file) {
        const fileInfo = await singleUAResourceUpload(file, "S2GRC");
        attachment = {
          url: fileInfo.resourceName,
        };
      } else if (existingAttachment) {
        attachment = existingAttachment;
      }

      // Determine new status
      const newStatus =
        action === "approve" ? POLICY_STATUS.APPROVED : POLICY_STATUS.REJECTED;

      // Prepare the full payload with both form changes and status update
      const policySaveFormat = {
        policyTaskId: editPolicyData.policyTaskId,
        policyTitle: formValues.POLICY_TITLE,
        policyOwner: formValues.POLICY_OWNER,
        processIncluded: formValues.PROCESS_INCLUDED,
        dateCreated: formValues.DATE_CREATED,
        lastReviewed: formValues.LAST_REVIEWED,
        nextReview: formValues.NEXT_REVIEW,
        attachment,
        revisions: editPolicyData.revisions || [],
        policyStatus: newStatus,
        // Include any other fields from editPolicyData that need to be preserved
        // ...editPolicyData
      };

      // Add revision if needed (you can modify this based on your requirements)

      const newRevision = {
        date: Date.now().toString(),
        summaryOfChanges: `Policy ${newStatus}`,
        version: policySaveFormat.currentVersion || "1.0",
        author: currentUser,
        approvedBy: currentUser,
      };
      policySaveFormat.revisions = [
        ...(policySaveFormat.revisions || []),
        newRevision,
      ];

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
      setFile(null);
      setFileName("");
      setExistingAttachment(null);
      router.refresh();
      setOpenPolicyForm(false);
      toast.success(`Policy ${newStatus} Successfully`, { duration: 4000 });
    } catch (error: any) {
      console.error("Error updating policy:", error);
      toast.error(`Failed to ${action} policy`, { description: error.message });
    } finally {
      if (action === "approve") {
        setApproveLoading(false);
      } else {
        setRejectLoading(false);
      }
    }
  }
  async function handlePolicyUpdateWithRevision() {
    setBtnLoading(true);

    try {
      if (!editPolicyData) throw new Error("No policy data found");
      const currUserId = await getCurrentUserId();

      let attachment = null;
      if (fileChanged && file) {
        const fileInfo = await singleUAResourceUpload(file, "S2GRC");
        attachment = {
          url: fileInfo.resourceName,
        };
      } else if (existingAttachment) {
        attachment = existingAttachment;
      }
      const versionToUse =
        revisionData.versionOption === "current"
          ? editPolicyData.currentVersion || "1.0"
          : revisionData.newVersion || "1.0";
      const formValues = form.getValues();
      const newRevision = {
        date: Date.now().toString(),
        summaryOfChanges:
          revisionData.summaryOfChanges || "No description provided",
        version: versionToUse,
        author: currUserId,
        approvedBy: "",
      };
      const existingRevisions = Array.isArray(editPolicyData.revisions)
        ? editPolicyData.revisions
        : [];
      const policySaveFormat = {
        policyTaskId: editPolicyData.policyTaskId,
        policyTitle: formValues.POLICY_TITLE,
        policyOwner: formValues.POLICY_OWNER,
        processIncluded: formValues.PROCESS_INCLUDED,
        dateCreated: formValues.DATE_CREATED,
        lastReviewed: formValues.LAST_REVIEWED,
        nextReview: formValues.NEXT_REVIEW,
        attachment,
        revisions: [...existingRevisions, newRevision],
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
      setFile(null);
      setFileName("");
      setExistingAttachment(null);
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
            <DialogTitle>Policy Form</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Row 1: 2 inputs side by side */}
                <FormInput
                  formControl={form.control}
                  name="POLICY_TITLE"
                  label={
                    <>
                      Policy Title{" "}
                      <span className="text-red-500 font-semibold"> *</span>
                    </>
                  }
                  placeholder="Enter Policy Title"
                />

                <FormComboboxInput
                  formControl={form.control}
                  name="POLICY_OWNER"
                  items={allUsers}
                  label={
                    <>
                      Policy Owner{" "}
                      <span className="text-red-500 font-semibold"> *</span>
                    </>
                  }
                  placeholder="Select Policy Owner"
                />

                {/* Row 2: 2 inputs side by side */}
                <FormComboboxInput
                  formControl={form.control}
                  name="PROCESS_INCLUDED"
                  items={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ]}
                  label={
                    <>
                      Process Included{" "}
                      <span className="text-red-500 font-semibold"> *</span>
                    </>
                  }
                  placeholder="Select Process Included"
                />

                <FormDateInput
                  formControl={form.control}
                  name="DATE_CREATED"
                  label={
                    <>
                      Date Created{" "}
                      <span className="text-red-500 font-semibold"> *</span>
                    </>
                  }
                  placeholder="Select Date Created"
                  dateFormat={SAVE_DATE_FORMAT_GRC}
                />

                {/* Row 3: 2 inputs side by side */}
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

                {/* Row 4: 1 full-width */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="upload">Upload File (Optional)</Label>

                  <label
                    htmlFor="upload"
                    className="w-2/4 h-20 flex items-center flex-col justify-center p-7 border border-dashed rounded-xl cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-2 p-2 m-2">
                      <FileIcon className="h-5 w-5 text-gray-400" />
                      <div className="text-sm text-center">
                        <p className="font-medium text-gray-500">
                          {file
                            ? fileName
                            : existingAttachment
                            ? existingAttachment.url
                            : "Click to upload"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          DOC or DOCX (Max 5MB)
                        </p>
                      </div>
                    </div>
                  </label>

                  <Input
                    id="upload"
                    className="hidden"
                    type="file"
                    accept=".doc,.docx"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      console.log("selectedfile--", selectedFile);
                      if (selectedFile) {
                        setFile(selectedFile);
                        setFileName(selectedFile.name);
                        setExistingAttachment(null);
                        setFileChanged(true);
                      }
                    }}
                  />
                  {fileName && (
                    <div className="text-sm text-muted-foreground">
                      Selected: {fileName}
                    </div>
                  )}

                  {!fileName && existingAttachment && (
                    <div className="text-sm text-muted-foreground">
                      Current file:{" "}
                      {file
                        ? fileName
                        : existingAttachment
                        ? existingAttachment.url
                        : "Click to upload or drag and drop"}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 text-red-500"
                        onClick={() => {
                          setExistingAttachment(null);
                          // If you want to allow removing the existing file without replacing it
                          // you might need to add a flag like `removeExisting: true` to your save data
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Form>
          <DialogFooter>
            {editPolicyData && isApprover ? (
              <>
                {console.log("isApprover", isApprover)}
                <Button
                  variant="outline"
                  onClick={form.handleSubmit(savePolicyFormInfo)}
                  disabled={saveLoading || approveLoading || rejectLoading}
                >
                  {saveLoading && (
                    <Loader2Icon className="animate-spin h-5 w-5 mr-2" />
                  )}
                  Save Changes
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleApproval("reject")}
                  disabled={rejectLoading || saveLoading || approveLoading}
                >
                  {rejectLoading && (
                    <Loader2Icon className="animate-spin h-5 w-5 mr-2" />
                  )}
                  Reject
                </Button>
                <Button
                  onClick={() => handleApproval("approve")}
                  disabled={approveLoading || saveLoading || rejectLoading}
                >
                  {approveLoading && (
                    <Loader2Icon className="animate-spin h-5 w-5 mr-2" />
                  )}
                  Approve & Save
                </Button>
              </>
            ) : (
              <Button
                onClick={form.handleSubmit(savePolicyFormInfo)}
                disabled={saveLoading}
              >
                {saveLoading && (
                  <Loader2Icon className="animate-spin h-5 w-5 mr-2" />
                )}
                {editPolicyData ? "Update" : "Save"}
              </Button>
            )}
          </DialogFooter>
          {/* <DialogFooter>
           
            {editPolicyData && isApprover ? (
              <>
                <Button
                  variant="outline"
                  onClick={form.handleSubmit(savePolicyFormInfo)}
                  disabled={btnloading}
                >
                  {btnloading && (
                    <Loader2Icon className="animate-spin h-5 w-5 mr-2" />
                  )}
                  Save Changes
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleApproval("reject")}
                  disabled={btnloading}
                >
                  {btnloading && (
                    <Loader2Icon className="animate-spin h-5 w-5 mr-2" />
                  )}
                  Reject
                </Button>
                <Button
                  onClick={() => handleApproval("approve")}
                  disabled={btnloading}
                >
                  {btnloading && (
                    <Loader2Icon className="animate-spin h-5 w-5 mr-2" />
                  )}
                  Approve & Save
                </Button>
              </>
            ) : (
              <Button
                onClick={form.handleSubmit(savePolicyFormInfo)}
                disabled={btnloading}
              >
                {btnloading && (
                  <Loader2Icon className="animate-spin h-5 w-5 mr-2" />
                )}
                {editPolicyData ? "Update" : "Save"}
              </Button>
            )}
          </DialogFooter> */}
          {/* <DialogFooter>
            <Button
              onClick={form.handleSubmit(savePolicyFormInfo)}
              disabled={btnloading}
            >
              {btnloading && (
                <Loader2Icon className="animate-spin h-5 w-5 mr-2" />
              )}
              {editPolicyData ? "Update" : "Save"}
            </Button>
          </DialogFooter> */}
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
