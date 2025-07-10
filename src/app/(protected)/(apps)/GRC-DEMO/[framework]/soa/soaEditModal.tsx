import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/shadcn/ui/form";
import FormInput from "@/ikon/components/form-fields/input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { Button } from "@/shadcn/ui/button";
import { v4 } from "uuid";
import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";

export const SoaControlFormSchema = z.object({
  frameworkName: z.string().optional(),
  controlName: z.string().optional(),
  objectiveIndex: z.any().optional(),
  objectiveName: z.string().optional(),
  objectiveDescription: z.string().optional(),
  applicable: z.string().optional(),
  justification: z.string().min(5, "Description must be at least 5 characters"),
});

export default function SoaEditForm({
  open,
  setOpen,
  editRiskData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editRiskData: Record<string, any> | null;
}) {
  const form = useForm<z.infer<typeof SoaControlFormSchema>>({
    resolver: zodResolver(SoaControlFormSchema),
    defaultValues: {
      frameworkName: editRiskData?.frameworkName || "",
      controlName: editRiskData?.controlName || "",
      objectiveIndex: editRiskData?.objectiveIndex || "",
      objectiveName: editRiskData?.objectiveName || "",
      objectiveDescription: editRiskData?.objectiveDescription || "",
      applicable: editRiskData?.applicable || "Yes",
      justification: editRiskData?.justification || "",
    },
  });

  useEffect(() => {
    form.reset({
      frameworkName: editRiskData?.frameworkName || "",
      controlName: editRiskData?.controlName || "",
      objectiveIndex: editRiskData?.objectiveIndex || "",
      objectiveName: editRiskData?.objectiveName || "",
      objectiveDescription: editRiskData?.objectiveDescription || "",
      applicable: editRiskData?.applicable || "Yes",
      justification: editRiskData?.justification || "",
    });
  }, [editRiskData, form]);

  const router = useRouter();

  async function handleSoaSubmission(
    data: z.infer<typeof SoaControlFormSchema>
  ) {
    const updateData = {
      id: editRiskData?.id || v4(), // Preserve existing ID or generate new
      applicable: data.applicable,
      justification: data.justification,
      // Include original values for all other fields from editRiskData
      ...(editRiskData && {
        frameworkName: editRiskData.frameworkName,
        controlName: editRiskData.controlName,
        objectiveIndex: editRiskData.objectiveIndex,
      }),
    };

    console.log("Submitting SOA data:", updateData);

    try {
      // Check for existing instance using current form data, not editRiskData
      const riskLibInstances = await getMyInstancesV2({
        processName: "SOA",
        predefinedFilters: { taskName: "edit soa task" },
        mongoWhereClause: `this.Data.objectiveIndex == "${data.objectiveIndex}" && this.Data.controlName == "${data.controlName}"`,
      });

      if (riskLibInstances?.length > 0) {
        const taskId = riskLibInstances[0]?.taskId;
        console.log("Updating existing SOA with taskId:", taskId);

        await invokeAction({
          taskId: taskId,
          data: updateData,
          transitionName: "update edit soa",
          processInstanceIdentifierField: "", // Added proper identifier
        });

        toast.success("SOA Updated Successfully!", { duration: 3000 });
      } else {
        const processId = await mapProcessName({ processName: "SOA" });
        await startProcessV2({
          processId,
          data: updateData,
          processIdentifierFields: "", // Added proper identifier
        });

        toast.success("New SOA Added Successfully!", { duration: 3000 });
      }
    } catch (error) {
      console.error("Error in SOA operation:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to process SOA. Please try again.",
        { duration: 3000 }
      );
    } finally {
      form.reset();
      router.refresh();
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[50%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{"Edit SOA Control"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form>
              <div className="grid grid-cols-1 gap-3">
                <FormInput
                  formControl={form.control}
                  name="frameworkName"
                  label="Framework"
                  placeholder="e.g., ISO 27001"
                  disabled={true}
                />

                <FormInput
                  formControl={form.control}
                  name="controlName"
                  label="Control Name"
                  placeholder="Enter control name"
                  disabled={true}
                />

                <FormInput
                  formControl={form.control}
                  name="objectiveIndex"
                  label="Objective Index"
                  placeholder="e.g., 5.1"
                  disabled={true}
                />

                <FormInput
                  formControl={form.control}
                  name="objectiveName"
                  label="Objective Name"
                  placeholder="Enter objective name"
                  disabled={true}
                />

                <FormTextarea
                  formControl={form.control}
                  name="objectiveDescription"
                  label="Objective Description"
                  placeholder="Enter detailed description"
                  rows={4}
                  disabled={true}
                />

                <FormComboboxInput
                  items={[
                    { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" },
                    { value: "Partial", label: "Partial" },
                  ]}
                  formControl={form.control}
                  name="applicable"
                  label="Applicable to Organization"
                />

                <FormTextarea
                  formControl={form.control}
                  name="justification"
                  label="Justification"
                  placeholder="Enter justification for inclusion/exclusion"
                  rows={3}
                />
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(handleSoaSubmission)}
            className="mt-3"
          >
            {editRiskData ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
