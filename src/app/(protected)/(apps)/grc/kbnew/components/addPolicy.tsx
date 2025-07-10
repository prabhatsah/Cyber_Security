"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shadcn/ui/button";
import { FloatingLabelInput } from "@/shadcn/ui/floating-label-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import ControlSection from "./controlSection";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { FormData, schema } from "./formData";
import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { useRouter } from "next/navigation";
import { Label } from "@/shadcn/ui/label";
import { Input } from "@/shadcn/ui/input";
import { useKBContext } from "./knowledgeBaseContext";

const AddPolicyTable = ({ open, setOpen }: { open: boolean; setOpen: (val: boolean) => void }) => {

    const router = useRouter();

    const {setExistingPolicyForm,addExistingControl} = useKBContext()

    console.log(addExistingControl);
    
    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { policyName: "", controls: addExistingControl??[] },
        mode: "onSubmit",
    });

    const { control, handleSubmit } = form;

   

    const {
        fields: controlFields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "controls",
    });

    

    const handleSubmitData = async (data: FormData) => {
        console.log("Submitted values:", data);

        const saveFormatData = {
            policyName: data.policyName,
            frameworkId: '324678d9-d361-4f8d-bdac-a52a80557cfc',
            framework: 'bestPractice',
            controls: data.controls.map(control => ({
                controlName: control.controlName || control.customeControlName,
                // controlSource: control.controlSource,
                controlWeight: parseFloat(control.controlWeight),
                policyId: parseFloat(control.indexName),
                controlObjectives: control.objectives.map(obj => ({
                    name: obj.objectiveName || obj.existingObjective,
                    description: obj.objectiveDescription,
                    controlObjId: parseFloat(obj.objectiveIndex),
                    practiceAreas: obj.objectivePracticeArea,
                    // objectiveSource: obj.objectiveSource,
                    controlObjType: obj.objectiveType,
                    controlObjweight: parseFloat(obj.objectiveWeight)
                }))
            }))
        };

        console.log(saveFormatData);

        const processId = await mapProcessName({ processName: "Control Objectives", });
        await startProcessV2({
            processId,
            data: saveFormatData,
            processIdentifierFields: "",
        });

        setOpen(false);
        setExistingPolicyForm(false)
        router.refresh();

    };
    console.log(form.formState.errors);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="!max-w-none !w-screen !h-screen p-6 flex flex-col">
                <DialogHeader>
                    <DialogTitle>Framework Creation</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(handleSubmitData)} className="flex flex-col flex-1 overflow-hidden">
                        <div className="my-4 mx-0.5">
                            <FormField
                                control={control}
                                name="policyName"
                                render={({ field }) => (
                                    <FormItem>
                                         <FormLabel>Framework</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Framework" {...field} />
                                            {/* <FloatingLabelInput {...field} id="policyName" label="Framework" /> */}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex-1 overflow-auto">
                            <ControlSection
                                form={form}
                                // openControls={openControls}
                                // toggleControl={toggleControl}
                            />
                        </div>

                        <div className="mt-4 ml-auto flex items-center gap-4">
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddPolicyTable;



// "use client";

// import React, { useState } from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { ColumnDef } from "@tanstack/react-table";

// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormMessage,
// } from "@/shadcn/ui/form";
// import { Button } from "@/shadcn/ui/button";
// import { FloatingLabelInput } from "@/shadcn/ui/floating-label-input";

// import { useKBContext } from "./knowledgeBaseContext";
// import ControlSection from "./controlSection";

// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn//ui/dialog";
// import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
// import { DataTable } from "@/ikon/components/data-table";
// import { FormData, schema } from "./formData";

// const AddPolicyTable = ({ open, setOpen }: any) => {
//     const form = useForm<FormData>({
//         resolver: zodResolver(schema),
//         defaultValues: { policies: [] },
//         mode: "onSubmit",
//     });

//     const { lockedControlWeights } = useKBContext();

//     const { control, handleSubmit, setValue, getValues, watch } = form;
//     const { fields: userFields, prepend, remove } = useFieldArray({
//         control,
//         name: "policies",
//     });

//     const [openUsers, setOpenUsers] = useState<Record<number, boolean>>({});
//     const [openControls, setOpenControls] = useState<Record<string, boolean>>({});

//     const addRow = () => {
//         prepend({ policyName: "", controls: [] });
//     };

//     const toggleUser = (index: number) => {
//         setOpenUsers((prev) => ({ ...prev, [index]: !prev[index] }));
//     };

//     const toggleControl = (userIndex: number, controlIndex: number) => {
//         const key = `${userIndex}-${controlIndex}`;
//         setOpenControls((prev) => ({ ...prev, [key]: !prev[key] }));
//     };

//     const distributeObjectiveWeights = (policyIndex: number) => {
//         const controls = getValues(`policies.${policyIndex}.controls`);
//         const weights = controls.map((_: any, controlIdx: number) =>
//             parseFloat(
//                 watch(`policies.${policyIndex}.controls.${controlIdx}.controlWeight`) || "0"
//             )
//         );

//         const lockedMap = lockedControlWeights[policyIndex] || {};
//         const lockedIndexes = weights.map((_, idx) => (lockedMap[idx] ? idx : null)).filter((v) => v !== null) as number[];

//         const totalLocked = lockedIndexes.reduce((acc, i) => acc + weights[i], 0);
//         const remaining = 100 - totalLocked;
//         const unlockedIndexes = weights.map((_, idx) => (!lockedMap[idx] ? idx : null)).filter((v) => v !== null) as number[];

//         const share = parseFloat((remaining / unlockedIndexes.length).toFixed(2));
//         let newWeights = [...weights];
//         unlockedIndexes.forEach((idx) => {
//             newWeights[idx] = share;
//         });

//         const roundingDiff = parseFloat((100 - newWeights.reduce((a, b) => a + b, 0)).toFixed(2));
//         if (unlockedIndexes.length > 0) {
//             const lastIdx = unlockedIndexes[unlockedIndexes.length - 1];
//             newWeights[lastIdx] = parseFloat((newWeights[lastIdx] + roundingDiff).toFixed(2));
//         }

//         newWeights.forEach((val, idx) => {
//             setValue(
//                 `policies.${policyIndex}.controls.${idx}.controlWeight`,
//                 val.toString()
//             );
//         });
//     };

//     const columns: ColumnDef<FormData["policies"][number]>[] = [
//         {
//             accessorKey: "policyName",
//             header: "Policy Name",
//             cell: ({ row }) => {
//                 const index = row.index;
//                 return (
//                     <div>
//                         <div className="flex items-center gap-2">
//                             <Button variant="outline" size="sm" type="button" onClick={() => toggleUser(index)}>
//                                 {openUsers[index] ? "−" : "+"}
//                             </Button>

//                             <FormField
//                                 control={control}
//                                 name={`policies.${index}.policyName`}
//                                 render={({ field }) => (
//                                     <FormItem className="w-full">
//                                         <FormControl>
//                                             <FloatingLabelInput {...field} id="policyName" label="Policy Name" />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <Button
//                                 type="button"
//                                 variant="default"
//                                 size="sm"
//                                 onClick={() => distributeObjectiveWeights(index)}
//                             >
//                                 Assign Weights
//                             </Button>

//                             <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
//                                 Delete
//                             </Button>
//                         </div>

//                         {openUsers[index] && (
//                             <div className="ml-6 mt-2 space-y-4 border-l pl-4">
//                                 <ControlSection
//                                     form={form}
//                                     policyIndex={index}
//                                     openControls={openControls}
//                                     toggleControl={toggleControl}
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 );
//             },
//         },
//     ];

//     const extraParams: DTExtraParamsProps = {
//         extraTools: [
//             <Button key="add" type="button" onClick={addRow} className="mb-4">
//                 Add Policy
//             </Button>,
//         ],
//     };

//     const handleSubmitData = (data: FormData) => {
//         console.log("Submitted values:", data);
//     };

//     return (
//         <>
//             <Dialog open={open} onOpenChange={setOpen}>
//                 <DialogContent
//                     className="!max-w-none !w-screen !h-screen p-6 flex flex-col"
//                 >
//                     <DialogHeader>
//                         <DialogTitle>Policy Form</DialogTitle>
//                     </DialogHeader>

//                     <Form {...form}>
//                         <form
//                             onSubmit={handleSubmit(handleSubmitData)}
//                             className="flex flex-col flex-1 overflow-hidden"
//                         >
//                             <div className="flex-1 overflow-auto">
//                                 <DataTable data={userFields} columns={columns} extraParams={extraParams} />
//                             </div>
//                             <div className="mt-4 ml-auto">
//                                 <Button type="submit">Submit</Button>
//                             </div>
//                         </form>
//                     </Form>
//                 </DialogContent>
//             </Dialog>

//         </>
//     );
// };

// export default AddPolicyTable;