import React, { useEffect, useState } from "react";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import FormInput from "@/ikon/components/form-fields/input";
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Form } from "@/shadcn/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

export const frameworkTypes = [
  { value: "standard", label: "Standard" },
  { value: "bestPractice", label: "Best Practices" },
  { value: "rulesAndRegulation", label: "Rules and Regulations" },
];

export default function ControlNewForm({ open, setOpen, dataOfFrameworks, editControlObj }: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataOfFrameworks: any;
  editControlObj: Record<string, any> | null;
}) {
  const router = useRouter();

  const [filteredFrameworkTypes, setFilteredFrameworkTypes] = useState<any[]>([]);
  const [filteredControlNames, setFilteredControlNames] = useState<any[]>([]);

  const formSchema = z.object({
    framework: z.string().min(1, { message: "Framework is required" }),
    frameworkType: z.string().min(1, { message: "Framework Type is required" }),
    controlName: z.string().min(1, { message: "Control Name is required" }),
    controlObjectives: z.array(
      z.object({
        name: z.string().min(1, { message: "Objective Name is required" }),
        description: z.string().min(1, { message: "Objective Description is required" }),
      })
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      framework: editControlObj?.framework || "",
      frameworkType: editControlObj?.frameworkType || "",
      controlName: editControlObj?.controlName || "",
      controlObjectives: editControlObj?.controlObjectives || [],
    },
  });

  const { control, watch, handleSubmit, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "controlObjectives",
  });

  const selectedFramework = watch("framework");
  const selectedFrameworkType = watch("frameworkType");

  useEffect(() => {
    if (selectedFramework) {
      if (editControlObj) {
        setFilteredFrameworkTypes([
          { value: editControlObj.frameworkType, label: editControlObj.frameworkType },
        ]);
      } else {
        const filtered = Array.from(
          new Map(
            dataOfFrameworks
              .filter((item: any) => item.framework === selectedFramework)
              .map((item: any) => [
                item.frameworkType,
                { value: item.frameworkType, label: item.frameworkType },
              ])
          ).values()
        );
        setFilteredFrameworkTypes(filtered);
        setValue("frameworkType", "");
      }

      setValue("controlName", "");
      setFilteredControlNames([]);
    }
  }, [selectedFramework, dataOfFrameworks, editControlObj, setValue]);

  

  useEffect(() => {
    if (!selectedFrameworkType) return;
  
    if (editControlObj) {
      // When editing, use the existing control name
      setFilteredControlNames([
        { value: editControlObj.controlName, label: editControlObj.controlName },
      ]);
      setValue("controlName", editControlObj.controlName); // <-- this line ensures controlName is set
    } else {
      const filtered = dataOfFrameworks
        .filter(
          (item: any) =>
            item.frameworkType.toLowerCase() === selectedFrameworkType.toLowerCase() &&
            item.framework.toLowerCase() === selectedFramework.toLowerCase()
        )
        .map((item: any) => ({
          value: item.controlName,
          label: item.controlName,
        }));
      setFilteredControlNames(filtered);
  
      // Only set the first option if not editing
      if (filtered.length > 0) {
        setValue("controlName", filtered[0].value);
      } else {
        setValue("controlName", "");
      }
    }
  }, [selectedFrameworkType, selectedFramework, dataOfFrameworks, editControlObj, setValue]);
  

  const addControlObjective = () => {
    append({ name: "", description: "" });
  };

  const removeControlObjective = (index: number) => {
    remove(index);
  };
  //   console.log("Form Data:", data);

  //   if (editControlObj) {
  //     const controlNo = editControlObj.controlNo;
  //     const controlObjInstances = await getMyInstancesV2({
  //       processName: "Control Objectives",
  //       predefinedFilters: { taskName: "edit control objective" },
  //       mongoWhereClause: `this.Data.controlNo == "${controlNo}"`,
  //     });

  //     const taskId = controlObjInstances[0]?.taskId;

  //     await invokeAction({
  //       taskId,
  //       data,
  //       transitionName: "update edit controlObj",
  //       processInstanceIdentifierField: "controlNo",
  //     });
  //   } else {
  //     const controlObjectiveProcessId = await mapProcessName({
  //       processName: "Control Objectives",
  //     });
  //     await startProcessV2({
  //       processId: controlObjectiveProcessId,
  //       data,
  //       processIdentifierFields: "",
  //     });
  //   }

  //   setOpen(false);
  //   router.refresh();
  // };

  const saveControlInfo = async (data: z.infer<typeof formSchema>) => {
    // Find matching controlNo
    const matchedItem = dataOfFrameworks.find(
      (item: any) =>
        item.framework === data.framework &&
        item.frameworkType === data.frameworkType &&
        item.controlName === data.controlName
    );
  
    // Add controlNo to data if matched
    const finalData = {
      ...data,
      controlNo: matchedItem?.controlNo || "", // fallback to empty string if not found
    };
  
    console.log("Form Data:", finalData);
  
    if (editControlObj) {
      const controlNo = editControlObj.controlNo;
      const controlObjInstances = await getMyInstancesV2({
        processName: "Control Objectives",
        predefinedFilters: { taskName: "edit control objective" },
        mongoWhereClause: `this.Data.controlNo == "${controlNo}"`,
      });
  
      const taskId = controlObjInstances[0]?.taskId;
  
      await invokeAction({
        taskId,
        data: finalData,
        transitionName: "update edit controlObj",
        processInstanceIdentifierField: "controlNo",
      });
    } else {
      const controlObjectiveProcessId = await mapProcessName({
        processName: "Control Objectives",
      });
      await startProcessV2({
        processId: controlObjectiveProcessId,
        data: finalData,
        processIdentifierFields: "",
      });
    }
  
    setOpen(false);
    router.refresh();
  };
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
                <FormComboboxInput
                  items={frameworkTypes}
                  formControl={control}
                  name="framework"
                  placeholder="Choose Framework"
                  label="Framework"
                />

                <FormComboboxInput
                  items={filteredFrameworkTypes}
                  formControl={control}
                  name="frameworkType"
                  placeholder="Choose Framework Type"
                  label="Framework Type"
                  disabled={filteredFrameworkTypes.length === 0}
                />

                <FormComboboxInput
                  items={filteredControlNames}
                  formControl={control}
                  name="controlName"
                  placeholder="Choose Control Name"
                  label="Control Name"
                  disabled={filteredControlNames.length === 0}
                />
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-4">Control Objectives</h3>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 gap-4 items-start mb-4"
                  >
                    <div className="col-span-5">
                      <FormInput
                        formControl={control}
                        name={`controlObjectives.${index}.name`}
                        placeholder="Objective Name"
                        label={`Objective ${index + 1} Name`}
                        className="align-top"
                      />
                    </div>

                    <div className="col-span-6">
                      <FormTextarea
                        formControl={control}
                        name={`controlObjectives.${index}.description`}
                        placeholder="Objective Description"
                        label={`Objective ${index + 1} Description`}
                        className="align-top"
                      />
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeControlObjective(index)}
                        className="mt-6"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addControlObjective}
                  className="mt-3"
                >
                  Add Objective
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit(saveControlInfo)}>
            {editControlObj ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
