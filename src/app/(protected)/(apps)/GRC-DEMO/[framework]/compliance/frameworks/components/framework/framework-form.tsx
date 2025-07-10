"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { FrameworkFormStep1 } from "./framework-form-step1";
import { FrameworkFormStep2 } from "./framework-form-step2";
import { FrameworkFormStep3 } from "./framework-form-step3";
import { FrameworkFormPreview } from "./framework-form-preview";
import { FrameworkFormProgress } from "./framework-form-progress";
import { Button } from "@/shadcn/ui/button";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useToast } from "@/shadcn/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(3, { message: "Framework name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  owner: z.string().min(2, { message: "Owner name is required" }),
  version: z.string().min(1, { message: "Version is required" }),
  effectiveDate: z.date(),
  controls: z.array(
    z.object({
      name: z.string().min(3, { message: "Control name must be at least 3 characters" }),
      description: z.string().min(10, { message: "Description must be at least 10 characters" }),
      index: z.string().min(1, { message: "Index is required" }),
      type: z.enum(["control", "clause"]),
      objectives: z.array(
        z.object({
          name: z.string().min(3, { message: "Objective name must be at least 3 characters" }),
          description: z.string().min(10, { message: "Description must be at least 10 characters" }),
          index: z.string().min(1, { message: "Index is required" }),
        })
      ).min(1, { message: "At least one objective is required" }),
    })
  ).min(1, { message: "At least one control is required" }),
});

export type FrameworkFormValues = z.infer<typeof formSchema>;

export default function FrameworkForm() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FrameworkFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      owner: "",
      version: "",
      effectiveDate: undefined,
      controls: [{}],
    },
    mode: "onChange",
  });

  const onSubmit = (data: FrameworkFormValues) => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      console.log(data);
      toast({
        title: "Framework saved successfully",
        description: `${data.name} has been saved with ${data.controls.length} controls/clauses.`,
      });
      setIsSaving(false);
    }, 1500);
  };

  const nextStep = async () => {
    if (step === 1) {
      const isValid = await form.trigger(["name", "description", "owner", "version", "effectiveDate"]);
      if (isValid) setStep(2);
    } else if (step === 2) {
      const controls = form.getValues("controls");
      // const isValid = await form.trigger("controls");
      const isValid = await form.trigger(
        controls.flatMap((_, i) => [
          `controls.${i}.name`,
          `controls.${i}.type`,
          `controls.${i}.index`,
          `controls.${i}.description`,
        ]) as Parameters<typeof form.trigger>[0]
      );
      if (isValid && controls.length > 0) setStep(3);
    } else if (step === 3) {
      // const isValid = await form.trigger();
      const controls = form.getValues("controls");
      const objectiveFieldPaths = controls.flatMap((_, i) =>
        form.getValues(`controls.${i}.objectives`).map((_, j) => [
          `controls.${i}.objectives.${j}.name`,
          `controls.${i}.objectives.${j}.description`,
          `controls.${i}.objectives.${j}.index`,
        ])
      ).flat();

      const isValid = await form.trigger(objectiveFieldPaths as Parameters<typeof form.trigger>[0]);
      if (isValid) setStep(4);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const totalSteps = 4;

  return (
    <div className="h-full overflow-y-auto">
      <FrameworkFormProgress currentStep={step} totalSteps={totalSteps} />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {step === 1 && <FrameworkFormStep1 form={form} />}
        {step === 2 && <FrameworkFormStep2 form={form} />}
        {step === 3 && <FrameworkFormStep3 form={form} />}
        {step === 4 && <FrameworkFormPreview formValues={form.getValues()} />}

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>

          <div className="space-x-2">
            {step < totalSteps ? (
              <Button type="button" onClick={nextStep} className="gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="gap-2"
                disabled={isSaving}
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Framework"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}