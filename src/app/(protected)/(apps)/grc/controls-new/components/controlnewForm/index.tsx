"use client";
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
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Form } from "@/shadcn/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export const frameworkTypes = [
  { value: "standard", label: "Standard" },
  { value: "bestPractice", label: "Best Practices" },
  { value: "rulesAndRegulation", label: "Rules and Regulations" },
];

export default function ControlNewForm({
  open,
  setOpen,
  dataOfFrameworks,
  editControl,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataOfFrameworks: any;
  editControl: Record<string, string> | null;
}) {
  const router = useRouter();

  const [filteredFrameworkTypes, setFilteredFrameworkTypes] = useState<any[]>(
    []
  );

  const formSchema = z.object({
    framework: z.string().min(1, { message: "Framework is required" }),
    frameworkType: z.string().min(1, { message: "Framework Type is required" }),
    controlName: z.string().min(1, { message: "Control Name is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      framework: editControl ? editControl.framework :"",
      frameworkType: editControl ? editControl.frameworkType :"",
      controlName: editControl ? editControl.controlName :"",
    },
  });

  const selectedFramework = form.watch("framework");

  useEffect(() => {
    if (selectedFramework) {
      // Filter the framework types based on the selected framework
      if(editControl){
        let obj = {
          value: editControl?.frameworkType,
          label: editControl?.frameworkType,
        }
        setFilteredFrameworkTypes([obj])
      }else{
        const filtered = dataOfFrameworks
        .filter(
          (item) =>
            item.frameworkType === selectedFramework
        )
        .map((item) => ({
          value: item.frameworkTitle,
          label: item.frameworkTitle,
        }));
      setFilteredFrameworkTypes(filtered);

      // Reset the frameworkType field when the framework changes
      form.setValue("frameworkType", "");
      }
      
      
    }
  }, [selectedFramework, dataOfFrameworks, form]);

  async function saveControlInfo(data: z.infer<typeof formSchema>) {
      console.log(data);

      const controlData = {
        controlNo: editControl ? editControl.controlNo : Date.now().toString(),
        lastUpdatedOn: new Date().toISOString(),
        framework: data.framework,
        frameworkType: data.frameworkType,
        controlName: data.controlName
      }
      console.log(controlData);

      if (editControl) {
          const controlNo = editControl.controlNo;
          const controlInstances = await getMyInstancesV2({
              processName: "Control",
              predefinedFilters: { taskName: "edit control" },
              mongoWhereClause: `this.Data.controlNo == "${controlNo}"`,
          })
          console.log(controlInstances);
          const taskId = controlInstances[0].taskId;
          console.log(taskId);

          await invokeAction({
              taskId: taskId,
              data: controlData,
              transitionName: 'update edit control',
              processInstanceIdentifierField: 'controlNo'
          })
      }
      else {
          const incidentCreateProcessId = await mapProcessName({ processName: "Control" });
          console.log(incidentCreateProcessId);
          await startProcessV2({
              processId: incidentCreateProcessId,
              data: controlData,
              processIdentifierFields: "controlNo",
          })
      }

      setOpen(false);
      router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[60%]">
        <DialogHeader>
          <DialogTitle>Control Form</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Framework Dropdown */}
                <FormComboboxInput
                  items={frameworkTypes}
                  formControl={form.control}
                  name="framework"
                  placeholder="Choose Framework"
                  label="Framework"
                />

                {/* Framework Type Dropdown */}
                <FormComboboxInput
                  items={filteredFrameworkTypes}
                  formControl={form.control}
                  name="frameworkType"
                  placeholder="Choose Framework Type"
                  label="Framework Type"
               //   disabled={filteredFrameworkTypes.length === 0}
                />

                {/* Control Name Input */}
                <FormInput
                  formControl={form.control}
                  name="controlName"
                  label="Control Name"
                  placeholder="Enter Control Name"
                />
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={form.handleSubmit(saveControlInfo)}>
                {editControl ? "Update" : "Save"}
              </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
