"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/shadcn/lib/utils";
import { toast } from "sonner";
import { v4 } from "uuid";

// Icons and UI Components
import { ChevronLeft, ChevronRight, Plus, Check, Trash } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import { Table, TableHeader, TableBody, TableHead, TableCell, TableRow } from "@/shadcn/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { useRouter } from "next/navigation";


// Zod Schemas & Types (No changes needed here)
const step1Schema = z.object({ policyTitle: z.string().min(1, "Policy Title is required."), policyOwner: z.string().min(1, "Policy Owner is required."), processesIncluded: z.string().optional(), dateCreated: z.string().optional(), lastReviewed: z.string().optional(), nextReview: z.string().optional(), });
const step2Schema = z.object({ policyObjectives: z.array(z.object({ value: z.string().min(1, "Objective cannot be empty.") })).min(1, "At least one objective is required."), policyScope: z.string().min(1, "Policy Scope is required."), guidingPrinciples: z.array(z.object({ subheading: z.string().min(1, "Subheading is required."), points: z.array(z.object({ value: z.string().min(1, "Point cannot be empty.") })).min(1, "At least one point is required."), })).min(1, "At least one guiding principle is required."), });
const step3Schema = z.object({ processesAndProcedures: z.array(z.object({ description: z.string().min(1, "Description is required."), responsible: z.string().min(1, "Responsible party is required."), input: z.string().min(1, "Input is required."), process: z.string().min(1, "Process steps are required."), output: z.string().min(1, "Output is required."), })).min(1, "At least one process is required."), systemOfRecordFields: z.string().min(1, "Systems of Record are required."), exceptions: z.string().min(1, "Exceptions details are required."), violationEnforcements: z.string().min(1, "Violation & Enforcement details are required."), });
const step4Schema = z.object({ risksAddressed: z.array(z.object({ description: z.string().min(1, "Risk Description is required."), impact: z.string().min(1, "Impact is required."), probability: z.string().min(1, "Probability is required."), strategy: z.string().min(1, "Strategy is required."), })).min(1, "At least one risk is required."), accessMatrix: z.array(z.object({ roleGroup: z.string().min(1, "Role/Group is required."), systemInfo: z.string().min(1, "System/Information is required."), accessLevel: z.string().min(1, "Access Level is required."), justification: z.string().min(1, "Justification is required."), })).min(1, "At least one access entry is required."), });

const fullFormSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema);
export type FullFormData = z.infer<typeof fullFormSchema>;

const steps = [
  { id: 1, title: "Policy Overview", fields: Object.keys(step1Schema.shape) },
  { id: 2, title: "Objectives & Scope", fields: Object.keys(step2Schema.shape) },
  { id: 3, title: "Operational Details", fields: Object.keys(step3Schema.shape) },
  { id: 4, title: "Appendices", fields: Object.keys(step4Schema.shape) },
];
const Stepper = ({ currentStep }: { currentStep: number }) => (<div className="flex items-center gap-4"> {steps.map((step, index) => (<React.Fragment key={step.id}> <div className="flex flex-col items-center"> <div className={cn("flex h-8 w-8 items-center justify-center rounded-full border-2", currentStep > step.id ? "border-primary bg-primary text-primary-foreground" : "", currentStep === step.id ? "border-primary" : "")}> {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id} </div> <p className={cn("text-sm mt-2 text-center", currentStep === step.id ? "font-semibold" : "text-muted-foreground")}> {step.title} </p> </div> {index < steps.length - 1 && <div className="flex-1 border-t-2"></div>} </React.Fragment>))} </div>);
type FormStepProps = { form: UseFormReturn<FullFormData>; };
const Step1 = ({ form }: FormStepProps) => { return (<div className="space-y-6"> <FormField name="policyTitle" control={form.control} render={({ field }) => (<FormItem><FormLabel>Policy Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} /> <FormField name="policyOwner" control={form.control} render={({ field }) => (<FormItem><FormLabel>Policy Owner</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} /> <FormField name="processesIncluded" control={form.control} render={({ field }) => (<FormItem><FormLabel>Processes Included</FormLabel><FormControl><Textarea {...field} placeholder="e.g., Data Handling, Expense Reporting" /></FormControl><FormMessage /></FormItem>)} /> <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <FormField name="dateCreated" control={form.control} render={({ field }) => (<FormItem><FormLabel>Date Created</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} /> <FormField name="lastReviewed" control={form.control} render={({ field }) => (<FormItem><FormLabel>Last Reviewed</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} /> <FormField name="nextReview" control={form.control} render={({ field }) => (<FormItem><FormLabel>Next Review</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} /> </div> </div>); };
const Step2 = ({ form }: FormStepProps) => { const { fields: objectiveFields, append: appendObjective, remove: removeObjective } = useFieldArray({ control: form.control, name: "policyObjectives" }); const { fields: principleFields, append: appendPrinciple, remove: removePrinciple } = useFieldArray({ control: form.control, name: "guidingPrinciples" }); return (<div className="space-y-8"> <Card> <CardHeader><CardTitle>Policy Objectives</CardTitle></CardHeader> <CardContent className="space-y-4"> {objectiveFields.map((field, index) => (<div key={field.id} className="flex items-start gap-2"> <FormField name={`policyObjectives.${index}.value`} control={form.control} render={({ field }) => (<FormItem className="flex-1"><FormControl><Input {...field} placeholder={`Objective ${index + 1}`} /></FormControl><FormMessage /></FormItem>)} /> <Button type="button" variant="outline" size="icon" onClick={() => removeObjective(index)}><Trash className="h-4 w-4" /></Button> </div>))} <Button type="button" variant="secondary" size="sm" onClick={() => appendObjective({ value: "" })}><Plus className="mr-2 h-4 w-4" /> Add Objective</Button> </CardContent> </Card> <FormField name="policyScope" control={form.control} render={({ field }) => (<FormItem><FormLabel>Policy Scope</FormLabel><FormControl><Textarea {...field} rows={5} placeholder="Describe who and what this policy applies to..." /></FormControl><FormMessage /></FormItem>)} /> <Card> <CardHeader><CardTitle>Guiding Principles</CardTitle></CardHeader> <CardContent className="space-y-4"> {principleFields.map((field, principleIndex) => (<Card key={field.id} className="p-4 bg-muted/40"> <div className="flex justify-between items-start"> <FormField name={`guidingPrinciples.${principleIndex}.subheading`} control={form.control} render={({ field }) => (<FormItem className="flex-1"><FormLabel>Principle Subheading</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} /> <Button type="button" variant="outline" size="sm" className="ml-4" onClick={() => removePrinciple(principleIndex)}>Remove</Button> </div> <PrinciplePointsForm form={form} principleIndex={principleIndex} /> </Card>))} <Button type="button" variant="outline" className="w-full" onClick={() => appendPrinciple({ subheading: "", points: [{ value: "" }] })}><Plus className="mr-2 h-4 w-4" /> Add Guiding Principle</Button> </CardContent> </Card> </div>); };
const PrinciplePointsForm = ({ form, principleIndex }: { form: UseFormReturn<FullFormData>, principleIndex: number }) => { const { fields, append, remove } = useFieldArray({ control: form.control, name: `guidingPrinciples.${principleIndex}.points` }); return (<div className="space-y-3 mt-4 pl-4 border-l-2"> <FormLabel className="text-sm">Points</FormLabel> {fields.map((field, pointIndex) => (<div key={field.id} className="flex items-start gap-2"> <FormField name={`guidingPrinciples.${principleIndex}.points.${pointIndex}.value`} control={form.control} render={({ field }) => (<FormItem className="flex-1"><FormControl><Input {...field} placeholder={`Point ${pointIndex + 1}`} /></FormControl><FormMessage /></FormItem>)} /> <Button type="button" variant="outline" size="icon" onClick={() => remove(pointIndex)}><Trash className="h-4 w-4" /></Button> </div>))} <Button type="button" variant="secondary" size="sm" onClick={() => append({ value: "" })}><Plus className="mr-2 h-4 w-4" /> Add Point</Button> </div>); }
const Step3 = ({ form }: FormStepProps) => { const { fields, append, remove } = useFieldArray({ control: form.control, name: "processesAndProcedures" }); return (<div className="space-y-8"> <Card> <CardHeader><CardTitle>Processes and Procedures</CardTitle></CardHeader> <CardContent className="space-y-4"> {fields.map((field, index) => (<Card key={field.id} className="p-4 bg-muted/40"> <div className="flex justify-between items-center mb-4"> <h4 className="font-semibold">Process #{index + 1}</h4> <Button type="button" variant="outline" size="sm" onClick={() => remove(index)}>Remove Process</Button> </div> <div className="space-y-4"> <FormField name={`processesAndProcedures.${index}.description`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} /> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <FormField name={`processesAndProcedures.${index}.responsible`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Responsible</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} /> <FormField name={`processesAndProcedures.${index}.input`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Input</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} /> </div> <FormField name={`processesAndProcedures.${index}.process`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Process Steps</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} /> <FormField name={`processesAndProcedures.${index}.output`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Output</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} /> </div> </Card>))} <Button type="button" variant="outline" className="w-full" onClick={() => append({ description: "", responsible: "", input: "", process: "", output: "" })}> <Plus className="mr-2 h-4 w-4" /> Add New Process </Button> </CardContent> </Card> <FormField name="systemOfRecordFields" control={form.control} render={({ field }) => (<FormItem><FormLabel>Systems of Record</FormLabel><FormControl><Textarea {...field} placeholder="e.g., - HRIS: Employee data..." /></FormControl><FormMessage /></FormItem>)} /> <FormField name="exceptions" control={form.control} render={({ field }) => (<FormItem><FormLabel>Exceptions</FormLabel><FormControl><Textarea {...field} placeholder="Criteria, request process, approval authority..." /></FormControl><FormMessage /></FormItem>)} /> <FormField name="violationEnforcements" control={form.control} render={({ field }) => (<FormItem><FormLabel>Violation & Enforcements</FormLabel><FormControl><Textarea {...field} placeholder="Examples, reporting process, disciplinary actions..." /></FormControl><FormMessage /></FormItem>)} /> </div>); };
// const Step4 = ({ form }: FormStepProps) => { const { fields: riskFields, append: appendRisk, remove: removeRisk } = useFieldArray({ control: form.control, name: "risksAddressed" }); const { fields: accessFields, append: appendAccess, remove: removeAccess } = useFieldArray({ control: form.control, name: "accessMatrix" }); return (<div className="space-y-8"> <Card> <CardHeader><CardTitle>Appendix A - Risks Addressed</CardTitle></CardHeader> <CardContent className="overflow-x-auto"> <Table> <TableHeader> <TableRow> <TableHead className="w-[30%]">Description</TableHead> <TableHead>Impact</TableHead> <TableHead>Probability</TableHead> <TableHead className="w-[30%]">Strategy</TableHead> <TableHead>Actions</TableHead> </TableRow> </TableHeader> <TableBody> {riskFields.map((field, index) => (<TableRow key={field.id}> <TableCell><FormField control={form.control} name={`risksAddressed.${index}.description`} render={({ field }) => <Input {...field} />} /></TableCell> <TableCell><FormField control={form.control} name={`risksAddressed.${index}.impact`} render={({ field }) => <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent></Select>} /></TableCell> <TableCell><FormField control={form.control} name={`risksAddressed.${index}.probability`} render={({ field }) => <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent></Select>} /></TableCell> <TableCell><FormField control={form.control} name={`risksAddressed.${index}.strategy`} render={({ field }) => <Input {...field} />} /></TableCell> <TableCell><Button type="button" variant="outline" size="icon" onClick={() => removeRisk(index)}><Trash className="h-4 w-4" /></Button></TableCell> </TableRow>))} </TableBody> </Table> <Button type="button" variant="outline" className="mt-4 w-full" onClick={() => appendRisk({ description: "", impact: "Medium", probability: "Medium", strategy: "" })}> <Plus className="mr-2 h-4 w-4" /> Add Risk </Button> </CardContent> </Card> <Card> <CardHeader><CardTitle>Appendix B - Access Matrix</CardTitle></CardHeader> <CardContent className="overflow-x-auto"> <Table> <TableHeader> <TableRow> <TableHead>Role/Group</TableHead> <TableHead>System/Info</TableHead> <TableHead>Access Level</TableHead> <TableHead className="w-[35%]">Justification</TableHead> <TableHead>Actions</TableHead> </TableRow> </TableHeader> <TableBody> {accessFields.map((field, index) => (<TableRow key={field.id}> <TableCell><FormField control={form.control} name={`accessMatrix.${index}.roleGroup`} render={({ field }) => <Input {...field} />} /></TableCell> <TableCell><FormField control={form.control} name={`accessMatrix.${index}.systemInfo`} render={({ field }) => <Input {...field} />} /></TableCell> <TableCell><FormField control={form.control} name={`accessMatrix.${index}.accessLevel`} render={({ field }) => <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Read-Only">Read-Only</SelectItem><SelectItem value="Read/Write">Read/Write</SelectItem><SelectItem value="Admin">Admin</SelectItem><SelectItem value="Restricted">Restricted</SelectItem></SelectContent></Select>} /></TableCell> <TableCell><FormField control={form.control} name={`accessMatrix.${index}.justification`} render={({ field }) => <Input {...field} />} /></TableCell> <TableCell><Button type="button" variant="outline" size="icon" onClick={() => removeAccess(index)}><Trash className="h-4 w-4" /></Button></TableCell> </TableRow>))} </TableBody> </Table> <Button type="button" variant="outline" className="mt-4 w-full" onClick={() => appendAccess({ roleGroup: "", systemInfo: "", accessLevel: "Read-Only", justification: "" })}> <Plus className="mr-2 h-4 w-4" /> Add Access Row </Button> </CardContent> </Card> </div>); };
const Step4 = ({ form }: FormStepProps) => {
  const { fields: riskFields, append: appendRisk, remove: removeRisk } = useFieldArray({
    control: form.control,
    name: "risksAddressed",
  });
  const { fields: accessFields, append: appendAccess, remove: removeAccess } = useFieldArray({
    control: form.control,
    name: "accessMatrix",
  });

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader><CardTitle>Appendix A - Risks Addressed</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Description</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead className="w-[30%]">Strategy</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            {/* Ensure no whitespace exists between TableBody and the map */}
            <TableBody>{
              riskFields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell><FormField control={form.control} name={`risksAddressed.${index}.description`} render={({ field }) => <Input {...field} />} /></TableCell>
                  <TableCell><FormField control={form.control} name={`risksAddressed.${index}.impact`} render={({ field }) => <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent></Select>} /></TableCell>
                  <TableCell><FormField control={form.control} name={`risksAddressed.${index}.probability`} render={({ field }) => <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent></Select>} /></TableCell>
                  <TableCell><FormField control={form.control} name={`risksAddressed.${index}.strategy`} render={({ field }) => <Input {...field} />} /></TableCell>
                  <TableCell><Button type="button" variant="outline" size="icon" onClick={() => removeRisk(index)}><Trash className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))
            }</TableBody>
          </Table>
          <Button type="button" variant="outline" className="mt-4 w-full" onClick={() => appendRisk({ description: "", impact: "Medium", probability: "Medium", strategy: "" })}>
            <Plus className="mr-2 h-4 w-4" /> Add Risk
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Appendix B - Access Matrix</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role/Group</TableHead>
                <TableHead>System/Info</TableHead>
                <TableHead>Access Level</TableHead>
                <TableHead className="w-[35%]">Justification</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            {/* Ensure no whitespace exists between TableBody and the map */}
            <TableBody>{
              accessFields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell><FormField control={form.control} name={`accessMatrix.${index}.roleGroup`} render={({ field }) => <Input {...field} />} /></TableCell>
                  <TableCell><FormField control={form.control} name={`accessMatrix.${index}.systemInfo`} render={({ field }) => <Input {...field} />} /></TableCell>
                  <TableCell><FormField control={form.control} name={`accessMatrix.${index}.accessLevel`} render={({ field }) => <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Read-Only">Read-Only</SelectItem><SelectItem value="Read/Write">Read/Write</SelectItem><SelectItem value="Admin">Admin</SelectItem><SelectItem value="Restricted">Restricted</SelectItem></SelectContent></Select>} /></TableCell>
                  <TableCell><FormField control={form.control} name={`accessMatrix.${index}.justification`} render={({ field }) => <Input {...field} />} /></TableCell>
                  <TableCell><Button type="button" variant="outline" size="icon" onClick={() => removeAccess(index)}><Trash className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))
            }</TableBody>
          </Table>
          <Button type="button" variant="outline" className="mt-4 w-full" onClick={() => appendAccess({ roleGroup: "", systemInfo: "", accessLevel: "Read-Only", justification: "" })}>
            <Plus className="mr-2 h-4 w-4" /> Add Access Row
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Default values for a new, empty form
const defaultFormValues: FullFormData = {
  policyTitle: "",
  policyOwner: "",
  processesIncluded: "",
  dateCreated: "",
  lastReviewed: "",
  nextReview: "",
  policyObjectives: [{ value: "" }],
  policyScope: "",
  guidingPrinciples: [{ subheading: "", points: [{ value: "" }] }],
  processesAndProcedures: [{ description: "", responsible: "", input: "", process: "", output: "" }],
  systemOfRecordFields: "",
  exceptions: "",
  violationEnforcements: "",
  risksAddressed: [{ description: "", impact: "Medium", probability: "Medium", strategy: "" }],
  accessMatrix: [{ roleGroup: "", systemInfo: "", accessLevel: "Read-Only", justification: "" }],
};

export default function PolicyForm({
  onFormSubmit,
  editPolicyData,
}: {
  onFormSubmit: (data: FullFormData) => void;
  editPolicyData: FullFormData | null;
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<FullFormData>({
    resolver: zodResolver(fullFormSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (editPolicyData) {
      const dataToSet = { ...defaultFormValues, ...editPolicyData };
      if (!dataToSet.policyObjectives?.length) dataToSet.policyObjectives = defaultFormValues.policyObjectives;
      if (!dataToSet.guidingPrinciples?.length) dataToSet.guidingPrinciples = defaultFormValues.guidingPrinciples;
      if (!dataToSet.processesAndProcedures?.length) dataToSet.processesAndProcedures = defaultFormValues.processesAndProcedures;
      if (!dataToSet.risksAddressed?.length) dataToSet.risksAddressed = defaultFormValues.risksAddressed;
      if (!dataToSet.accessMatrix?.length) dataToSet.accessMatrix = defaultFormValues.accessMatrix;
      form.reset(dataToSet);
    } else {
      form.reset(defaultFormValues);
    }
  }, [editPolicyData, form]);

  const { trigger, handleSubmit } = form;

  const handleNext = async () => {
    const fieldsToValidate = steps[currentStep - 1].fields;
    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });

    if (isValid && currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const onSubmit = async (data: FullFormData) => {
    if (editPolicyData) {
      const policyId = (editPolicyData as any).policyId;
      if (!policyId) {
        toast.error("Cannot update policy: Missing Policy ID.", { duration: 3000 });
        return;
      }

      try {
        const finalData = { ...data, policyId };
        const policyInstances = await getMyInstancesV2({
          processName: "Add Policy",
          predefinedFilters: { taskName: "Edit Policy" },
          mongoWhereClause: `this.Data.policyId == "${policyId}"`,
        });

        if (!policyInstances || policyInstances.length === 0) {
          toast.error("Could not find the policy instance to update.", { duration: 3000 });
          return;
        }

        const taskId = policyInstances[0]?.taskId;
        await invokeAction({
          taskId: taskId,
          data: finalData,
          transitionName: 'Update Edit Policy',
          processInstanceIdentifierField: 'policyId'
        });

        toast.success("Policy successfully updated!", { duration: 3000 });
        onFormSubmit(finalData);

      } catch (error) {
        console.error("Error updating policy:", error);
        toast.error("Failed to update policy.", { duration: 3000 });
      }

    } else {
      const finalData = { ...data, policyId: v4() };
      try {
        const policyProcessId = await mapProcessName({ processName: "Add Policy" });
        await startProcessV2({
          processId: policyProcessId,
          data: finalData,
          processIdentifierFields: "policyId"
        });

        toast.success("Policy successfully added!", { duration: 3000 });
        onFormSubmit(finalData);

      } catch (error) {
        console.error("Error in starting process:", error);
        toast.error("Failed to create policy.", { duration: 3000 });
      }
    }
    router.refresh();
  };

  const CurrentStepComponent = [Step1, Step2, Step3, Step4][currentStep - 1];

  return (

    <div className="w-full h-full flex flex-col">
      <div>
        <Stepper currentStep={currentStep} />
      </div>

      <div className="flex-1 overflow-y-auto mt-8 pr-4">
        <Form {...form}>
          {/*
          ✨ FIX: The key change is removing the onSubmit from the <form> tag.
          We will trigger the submit manually only on the final button click.
        */}
          <form id="policy-form" className="space-y-8">
            <CurrentStepComponent form={form} />
          </form>
        </Form>
      </div>

      <div className="pt-4 border-t mt-4">
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={handlePrev} disabled={currentStep === 1}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          {/* ✨ FIX: The logic for the final button is now more explicit. */}
          {currentStep < steps.length ? (
            <Button type="button" onClick={handleNext}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)} // Manually trigger submit with validation
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Saving..." : (editPolicyData ? "Update Policy" : "Save Policy")}
            </Button>
          )}
        </div>
      </div>
    </div>

  );
}