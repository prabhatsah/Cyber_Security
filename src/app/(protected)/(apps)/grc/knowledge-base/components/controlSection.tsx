"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shadcn/ui/button";
import { FloatingLabelInput } from "@/shadcn/ui/floating-label-input";
import { FormField, FormItem, FormControl, FormMessage } from "@/shadcn/ui/form";

import ObjectiveSection from "./objectiveSection";
import { DataTable } from "@/ikon/components/data-table";
import { FormData } from "./formData";
import { useKBContext } from "./knowledgeBaseContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Calculator, LockKeyhole, LockKeyholeOpen, Trash2, Weight } from "lucide-react";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";

type ControlSectionProps = {
    form: ReturnType<typeof useForm<FormData>>;
};

const CONTROL_SOURCE_TYPE = [
    { label: 'Existing', value: 'existing' },
    { label: 'New', value: 'custom' },
]

const ControlSection = ({ form }: ControlSectionProps) => {
    const { control, getValues, setValue, watch } = form;
    const { lockedWeights, lockedControlWeights, setLockedControlWeights, selectedControlsObj,addExistingControl } = useKBContext();
    const [openControls, setOpenControls] = useState<Record<number, boolean>>({});
    const toggleControl = (index: number) => {
        setOpenControls((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    console.log(selectedControlsObj);

    const {
        fields: controlFields,
        append,
        remove
    } = useFieldArray({
        control,
        name: "controls",
    });

    // const hasPrepopulated = useRef(false);

    // useEffect(() => {
    //     if (!addExistingControl || hasPrepopulated.current) return;
    //     addExistingControl.map((control) => append(control));
    //     hasPrepopulated.current = true;
    // }, []);



    const distributeControlWeights = () => {
        const controls = getValues(`controls`);
        const weights = controls.map((_: any, controlIdx: number) =>
            parseFloat(
                watch(`controls.${controlIdx}.controlWeight`) || "0"
            )
        );

        const lockedMap = lockedControlWeights[0] || {};
        const lockedIndexes = weights.map((_, idx) => (lockedMap[idx] ? idx : null)).filter((v) => v !== null) as number[];

        const totalLocked = lockedIndexes.reduce((acc, i) => acc + weights[i], 0);
        const remaining = 100 - totalLocked;
        const unlockedIndexes = weights.map((_, idx) => (!lockedMap[idx] ? idx : null)).filter((v) => v !== null) as number[];

        const share = parseFloat((remaining / unlockedIndexes.length).toFixed(2));
        let newWeights = [...weights];
        unlockedIndexes.forEach((idx) => {
            newWeights[idx] = share;
        });

        const roundingDiff = parseFloat((100 - newWeights.reduce((a, b) => a + b, 0)).toFixed(2));
        if (unlockedIndexes.length > 0) {
            const lastIdx = unlockedIndexes[unlockedIndexes.length - 1];
            newWeights[lastIdx] = parseFloat((newWeights[lastIdx] + roundingDiff).toFixed(2));
        }

        newWeights.forEach((val, idx) => {
            setValue(
                `controls.${idx}.controlWeight`,
                val.toString(), {
                shouldValidate: true,
                shouldDirty: true,
            });
        });
    };

    const distributeObjectiveWeights = (controlIdx: number) => {
        const objectives = getValues(`controls.${controlIdx}.objectives`);
        const weights = objectives.map((_: any, idx: number) =>
            parseFloat(watch(`controls.${controlIdx}.objectives.${idx}.objectiveWeight`) || "0")
        );

        const lockedMap = lockedWeights[controlIdx] || {};
        const lockedIndexes = weights.map((_, idx) => (lockedMap[idx] ? idx : null)).filter((v) => v !== null) as number[];
        const totalLocked = lockedIndexes.reduce((acc, i) => acc + weights[i], 0);
        const remaining = 100 - totalLocked;
        const unlockedIndexes = weights.map((_, idx) => (!lockedMap[idx] ? idx : null)).filter((v) => v !== null) as number[];

        const share = parseFloat((remaining / unlockedIndexes.length).toFixed(2));
        let newWeights = [...weights];
        unlockedIndexes.forEach((idx) => {
            newWeights[idx] = share;
        });

        const roundingDiff = parseFloat((100 - newWeights.reduce((a, b) => a + b, 0)).toFixed(2));
        if (unlockedIndexes.length > 0) {
            const lastIdx = unlockedIndexes[unlockedIndexes.length - 1];
            newWeights[lastIdx] = parseFloat((newWeights[lastIdx] + roundingDiff).toFixed(2));
        }

        newWeights.forEach((val, idx) => {
            setValue(`controls.${controlIdx}.objectives.${idx}.objectiveWeight`, val.toString(), {
                shouldValidate: true,
                shouldDirty: true,
            });
        });
    };

    const toggleControlLock = (controlIdx: number) => {
        setLockedControlWeights((prev) => ({
            ...prev,
            0: {
                ...prev[0],
                [controlIdx]: !prev[0]?.[controlIdx],
            },
        }));
    };

    const extraParams: DTExtraParamsProps = {
        grouping: false,
        defaultTools: ['search'],
        extraTools: [
            <Button
                key="add"
                type="button"
                onClick={() =>
                    append({
                        indexName: "",
                        controlName: "",
                        controlWeight: "",
                        controlSource: "custom",
                        customeControlName: "",
                        objectives: [
                            {
                                objectiveSource: "custom",
                                existingObjective: "",
                                objectiveName: "",
                                objectiveWeight: "",
                                objectiveType: "",
                                objectiveIndex: "",
                                objectivePracticeArea: "",
                                objectiveDescription: ""
                            },
                        ],
                    })
                }
            >
                + Add Control Policy 
            </Button>,
            <IconButtonWithTooltip type="button" tooltipContent="Calculate Policy Weight" onClick={() => distributeControlWeights()}
            >
                <Calculator />
            </IconButtonWithTooltip>


        ],
    }

    const columns: ColumnDef<FormData["controls"][number]>[] = [
        {
            id: "controlDetails",
            header: "Control Policy",
            cell: ({ row }) => {
                const index = row.index;
                const controlSource = watch(`controls.${index}.controlSource`);
                return (
                    <div className="space-y-2">
                        <div className="flex flex-row justify-between gap-3">
                            <Button type="button" onClick={() => toggleControl(index)} variant="outline" size="sm">
                                {openControls[index] ? "−" : "+"}
                            </Button>

                            <div className="flex-1">
                                <FormField
                                    control={control}
                                    name={`controls.${index}.controlSource`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Control Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {CONTROL_SOURCE_TYPE.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name={`controls.${index}.indexName`}
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormControl>
                                                <FloatingLabelInput {...field} label="Index" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex-1">

                                {controlSource === "existing" ? (

                                    <FormField
                                        control={control}
                                        name={`controls.${index}.controlName`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={(selectedControlName) => {
                                                            field.onChange(selectedControlName);

                                                            const controlDetails: Record<string, string> | null = selectedControlsObj && selectedControlsObj[selectedControlName]?.[0];
                                                            if (controlDetails) {
                                                                setValue(`controls.${index}.indexName`, controlDetails?.policyId.toString() || '');
                                                            }
                                                        }}
                                                        value={field.value}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Control Policy Name" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {selectedControlsObj && Object.keys(selectedControlsObj).map((controlName) => (
                                                                <SelectItem key={controlName} value={controlName}>
                                                                    {controlName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name={`controls.${index}.customeControlName`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <FloatingLabelInput {...field} label="Control Policy Name" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            <div className="flex-1">

                                <FormField
                                    control={form.control}
                                    name={`controls.${index}.controlWeight`}
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormControl>
                                                <FloatingLabelInput {...field} label="Control Policy  Weight" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>


                            {/* <Button type="button" onClick={() => distributeObjectiveWeights(index)} size="sm">
                                Assign Weights
                            </Button> */}
                            <IconButtonWithTooltip tooltipContent="Calculate Policy Objective Weight" type='button' onClick={() => distributeObjectiveWeights(index)}>
                                <Calculator />
                            </IconButtonWithTooltip>
                            <IconButtonWithTooltip tooltipContent={lockedControlWeights[0]?.[index] ? "Unlock this Control Weight" : "Lock this Control Weight"} type="button" onClick={() => toggleControlLock(index)} size="sm">
                                {lockedControlWeights[0]?.[index] ? <LockKeyhole /> : <LockKeyholeOpen />}
                            </IconButtonWithTooltip>
                            <IconButtonWithTooltip tooltipContent="Delete this Control" type="button" onClick={() => remove(index)} variant="destructive" size="sm">
                                <Trash2 />
                            </IconButtonWithTooltip >
                        </div>
                        {openControls[index] && (
                            <div className="ml-6 mt-2 space-y-4 border-l pl-4">
                                <ObjectiveSection form={form} policyIndex={0} controlIndex={index} />
                            </div>
                        )}
                    </div>
                );
            },
        },
    ];



    return (
        <div className="space-y-4">
            <DataTable
                data={controlFields}
                columns={columns}
                extraParams={extraParams}
            />
        </div>
    );
};

export default ControlSection;






// "use client";

// import React, { useState } from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { z } from "zod";
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
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/shadcn/ui/select";

// import { useKBContext } from "./knowledgeBaseContext";

// import ObjectiveSection from "./objectiveSection";
// import { FormData } from "./formData";


// type ControlProps = {
//     form: ReturnType<typeof useForm<FormData>>;
//     policyIndex: number;
//     openControls: Record<string, boolean>;
//     toggleControl: (userIndex: number, controlIndex: number) => void;
// };

// const CONTROL_SOURCE_TYPE = [
//     { label: 'Existing', value: 'existing' },
//     { label: 'Custom', value: 'custom' },
// ]


// const ControlSection = ({ form, policyIndex, openControls, toggleControl }: ControlProps) => {

//     const { control, getValues, setValue, watch } = form;

//     const { lockedWeights, lockedControlWeights, setLockedControlWeights, selectedControlsObj } = useKBContext();
//     console.log(selectedControlsObj)

//     const distributeObjectiveWeights = (controlIdx: number) => {
//         const objectives = getValues(`policies.${policyIndex}.controls.${controlIdx}.objectives`);
//         const weights = objectives.map((_: any, idx: number) =>
//             parseFloat(
//                 watch(`policies.${policyIndex}.controls.${controlIdx}.objectives.${idx}.objectiveWeight`) || "0"
//             )
//         );

//         const lockedMap = lockedWeights[controlIdx] || {};
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
//                 `policies.${policyIndex}.controls.${controlIdx}.objectives.${idx}.objectiveWeight`,
//                 val.toString()
//             );
//         });
//     };

//     const {
//         fields: controlFields,
//         append: appendControl,
//         remove: removeControl,
//     } = useFieldArray({
//         control,
//         name: `policies.${policyIndex}.controls`,
//     });

//     const toggleControLock = (policyIdx: number, controlIdx: number) => {
//         console.log(policyIdx, controlIdx)
//         setLockedControlWeights((prev) => ({
//             ...prev,
//             [policyIdx]: {
//                 ...prev[policyIdx],
//                 [controlIdx]: !prev[controlIdx]?.[controlIdx],
//             },
//         }));
//     };

//     return (
//         <div className="space-y-4">
//             {controlFields.map((field, controlIndex) => {
//                 const key = `${policyIndex}-${controlIndex}`;
//                 const controlSource = watch(`policies.${policyIndex}.controls.${controlIndex}.controlSource`);
//                 return (
//                     <div key={field.id}>
//                         <div className="flex justify-between gap-3">
//                             <Button variant="outline" size="sm" type="button" onClick={() => toggleControl(policyIndex, controlIndex)}>
//                                 {openControls[key] ? "−" : "+"}
//                             </Button>

//                             <div className="flex-1">
//                                 <FormField
//                                     control={control}
//                                     name={`policies.${policyIndex}.controls.${controlIndex}.controlSource`}
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormControl>
//                                                 <Select onValueChange={field.onChange} value={field.value}>
//                                                     <SelectTrigger className="w-full">
//                                                         <SelectValue placeholder="Control Type" />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                         {CONTROL_SOURCE_TYPE.map((type) => (
//                                                             <SelectItem key={type.value} value={type.value}>
//                                                                 {type.label}
//                                                             </SelectItem>
//                                                         ))}
//                                                     </SelectContent>
//                                                 </Select>
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             </div>

//                             <div className="flex-1">
//                                 <FormField
//                                     control={control}
//                                     name={`policies.${policyIndex}.controls.${controlIndex}.indexName`}
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormControl>
//                                                 <FloatingLabelInput {...field} id="indexName" label="Index" />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             </div>

//                             <div className="flex-1">

//                                 {controlSource === "existing" ? (

//                                     <FormField
//                                         control={control}
//                                         name={`policies.${policyIndex}.controls.${controlIndex}.controlName`}
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormControl>
//                                                     <Select
//                                                         onValueChange={(selectedControlName) => {
//                                                             field.onChange(selectedControlName);

//                                                             const controlDetails: Record<string, string> | null = selectedControlsObj && selectedControlsObj[selectedControlName]?.[0];
//                                                             if (controlDetails) {
//                                                                 setValue(`policies.${policyIndex}.controls.${controlIndex}.indexName`, controlDetails?.policyId || '');
//                                                             }
//                                                         }}
//                                                         value={field.value}>
//                                                         <SelectTrigger className="w-full">
//                                                             <SelectValue placeholder="Select Control Name" />
//                                                         </SelectTrigger>
//                                                         <SelectContent>
//                                                             {selectedControlsObj && Object.keys(selectedControlsObj).map((controlName) => (
//                                                                 <SelectItem key={controlName} value={controlName}>
//                                                                     {controlName}
//                                                                 </SelectItem>
//                                                             ))}
//                                                         </SelectContent>
//                                                     </Select>
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                 ) : (
//                                     <FormField
//                                         control={control}
//                                         name={`policies.${policyIndex}.controls.${controlIndex}.customeControlName`}
//                                         render={({ field }) => (
//                                             <FormItem className="flex-1">
//                                                 <FormControl>
//                                                     <FloatingLabelInput {...field} label="Control Name" />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                 )}
//                             </div>

//                             <div className="flex-1">
//                                 <FormField
//                                     control={control}
//                                     name={`policies.${policyIndex}.controls.${controlIndex}.controlWeight`}
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormControl>
//                                                 <FloatingLabelInput {...field} id="controlWeight" label="Control Weight" />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             </div>
//                             <Button
//                                 type="button"
//                                 variant={lockedControlWeights[policyIndex] ? "secondary" : "outline"}
//                                 onClick={() => toggleControLock(policyIndex, controlIndex)}
//                             >
//                                 {lockedControlWeights[policyIndex]?.[controlIndex] ? "UnLock" : "Lock"}
//                             </Button>

//                             <Button
//                                 type="button"
//                                 variant="default"
//                                 size="sm"
//                                 onClick={() => distributeObjectiveWeights(controlIndex)}
//                             >
//                                 Assign Weights
//                             </Button>
//                             <Button
//                                 type="button"
//                                 variant="destructive"
//                                 size="sm"
//                                 onClick={() => removeControl(controlIndex)}
//                             >
//                                 Delete
//                             </Button>
//                         </div>

//                         {openControls[key] && (
//                             <div className="ml-6 mt-2 space-y-4 border-l pl-4">
//                                 <ObjectiveSection
//                                     form={form}
//                                     policyIndex={policyIndex}
//                                     controlIndex={controlIndex}
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 );
//             })}
//             <Button
//                 type="button"
//                 size="sm"
//                 onClick={() =>
//                     appendControl({
//                         indexName: "",
//                         controlName: "",
//                         controlWeight: "",
//                         controlSource: "existing",
//                         objectives: [
//                             {
//                                 objectiveSource: "existing",
//                                 objectiveName: "",
//                                 objectiveWeight: "",
//                                 objectiveType: "",
//                                 objectiveIndex: "",
//                                 objectivePracticeArea: ""
//                             },
//                         ],
//                     })
//                 }
//             >
//                 + Add Controls
//             </Button>
//         </div>
//     );
// };

// export default ControlSection;