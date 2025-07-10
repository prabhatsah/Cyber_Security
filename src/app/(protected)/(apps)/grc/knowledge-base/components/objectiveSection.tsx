"use client";

import React, { Fragment, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/shadcn/ui/form";
import { Button } from "@/shadcn/ui/button";
import { FloatingLabelInput } from "@/shadcn/ui/floating-label-input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/ui/select";
import { useKBContext } from "./knowledgeBaseContext";
import { FormData } from "./formData";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { LockKeyhole, LockKeyholeOpen, Trash2 } from "lucide-react";
import { Textarea } from "@/shadcn/ui/textarea";



const OBJECTIVE_TYPES = [
    { label: "Type A", value: "typeA" },
    { label: "Type B", value: "typeB" },
    { label: "Type C", value: "typeC" },
];

const OBJECTIVE_SOURCE_TYPE = [
    { label: 'Existing', value: 'existing' },
    { label: 'New', value: 'custom' },
]

const OBJECTIVE_NAME = [
    { label: "Objective 1", value: 'objective1' },
    { label: "Objective 2", value: 'objective2' },
    { label: "Objective 3", value: 'objective3' },
]

type ObjectiveSectionProps = {
    form: ReturnType<typeof useForm<FormData>>;
    policyIndex: number;
    controlIndex: number;
};



const ObjectiveSection = ({ form, policyIndex, controlIndex, }: ObjectiveSectionProps) => {

    const { control, watch, getValues, setValue } = form;
    const {
        fields: objectiveFields,
        append: appendObjective,
        remove: removeObjective,
    } = useFieldArray({
        control,
        name: `controls.${controlIndex}.objectives`,
    });

    const { lockedWeights, setLockedWeights, selectedControlsObj, objTypes, practiceArea } = useKBContext();

    const toggleLock = (controlIdx: number, objIdx: number) => {
        console.log(controlIdx, objIdx)
        setLockedWeights((prev) => ({
            ...prev,
            [controlIdx]: {
                ...prev[controlIdx],
                [objIdx]: !prev[controlIdx]?.[objIdx],
            },
        }));
    };

    return (
        <div className="ml-7 mt-2 space-y-4">
            {objectiveFields.map((field, objIndex) => {
                const source = watch(`controls.${controlIndex}.objectives.${objIndex}.objectiveSource`);
                const selectedControlName = watch(`controls.${controlIndex}.controlName`);
                // const objectivesUnderCurrentControls: Record<string, any> | null = selectedControlsObj && selectedControlsObj[selectedControlName];
                return (
                    <Fragment key={field.id}>

                        <div className="flex flex-row gap-3">
                            <div className="flex flex-col w-[95%] gap-3">
                                <div className="flex flex-row gap-3">
                                    <div className="flex-1">
                                        <FormField
                                            control={control}
                                            name={`controls.${controlIndex}.objectives.${objIndex}.objectiveSource`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={(selectedObjSrcType) => {
                                                                field.onChange(selectedObjSrcType);
                                                                setValue(`controls.${controlIndex}.objectives.${objIndex}.objectiveIndex`, '');
                                                                setValue(`controls.${controlIndex}.objectives.${objIndex}.objectiveType`, '');
                                                                setValue(`controls.${controlIndex}.objectives.${objIndex}.objectiveDescription`, '');
                                                                setValue(`controls.${controlIndex}.objectives.${objIndex}.objectivePracticeArea`, '');
                                                            }}
                                                            value={field.value}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Control Objective Type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {OBJECTIVE_SOURCE_TYPE.map((type) => (
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
                                            control={control}
                                            name={`controls.${controlIndex}.objectives.${objIndex}.objectiveIndex`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <FloatingLabelInput {...field} id="indexName" label="Control Objective Index" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex-1">

                                        {source === "existing" ? (
                                            <FormField
                                                control={control}
                                                name={`controls.${controlIndex}.objectives.${objIndex}.existingObjective`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Select
                                                                onValueChange={(selectedObjName) => {
                                                                    field.onChange(selectedObjName);

                                                                    let foundControlName = "";
                                                                    let foundObj: Record<string, string> | null = null;

                                                                    if (selectedControlsObj) {
                                                                        for (const [controlName, objectives] of Object.entries(selectedControlsObj)) {
                                                                            const match = objectives?.find(obj => obj.name === selectedObjName);
                                                                            if (match) {
                                                                                foundControlName = controlName;
                                                                                foundObj = match;
                                                                                break;
                                                                            }
                                                                        }
                                                                    }

                                                                    console.log("Control Name:", foundControlName);
                                                                    console.log("Full Objective:", foundObj);

                                                                    if (foundObj) {
                                                                        setValue(`controls.${controlIndex}.objectives.${objIndex}.objectiveIndex`, foundObj.controlObjId.toString() || '');
                                                                        setValue(`controls.${controlIndex}.objectives.${objIndex}.objectiveType`, foundObj.controlObjType || '');
                                                                        setValue(`controls.${controlIndex}.objectives.${objIndex}.objectiveDescription`, foundObj.description || '');
                                                                        setValue(`controls.${controlIndex}.objectives.${objIndex}.objectivePracticeArea`, foundObj.practiceAreas || '');

                                                                        // Now you can also use `foundControlName` if needed
                                                                        setValue(`controls.${controlIndex}.controlName`, foundControlName);
                                                                    }
                                                                }}
                                                                value={field.value}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select Control Objective" />
                                                                </SelectTrigger>
                                                                <SelectContent className="max-h-72 overflow-y-auto">
                                                                    {selectedControlsObj &&
                                                                        Object.entries(selectedControlsObj).map(([controlName, objectives]) => {
                                                                            return (
                                                                                <SelectGroup key={controlName}>
                                                                                    <SelectLabel>
                                                                                        <div className="text-base font-semibold mb-1">
                                                                                            {controlName}
                                                                                        </div>
                                                                                    </SelectLabel>
                                                                                    {objectives.map((obj, idx) => (
                                                                                        <SelectItem
                                                                                            key={`${controlName}-${idx}`}
                                                                                            value={obj.name}
                                                                                            // disabled={controlName === selectedControlName}
                                                                                        >
                                                                                            {obj.name}
                                                                                        </SelectItem>
                                                                                    ))}
                                                                                </SelectGroup>
                                                                            )
                                                                        })
                                                                    }
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        ) : (
                                            <FormField
                                                control={control}
                                                name={`controls.${controlIndex}.objectives.${objIndex}.objectiveName`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormControl>
                                                            <FloatingLabelInput {...field} label="Control Objective Name" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-row gap-3">

                                    <div className="flex-1">
                                        <FormField
                                            control={control}
                                            name={`controls.${controlIndex}.objectives.${objIndex}.objectiveWeight`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <FloatingLabelInput {...field} id="objectiveWeight" label="Control Objective Weight" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <FormField
                                            control={control}
                                            name={`controls.${controlIndex}.objectives.${objIndex}.objectiveType`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Procedural Type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {objTypes && objTypes.map((objType) => (
                                                                    <SelectItem key={objType} value={objType}>
                                                                        {objType}
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
                                            control={control}
                                            name={`controls.${controlIndex}.objectives.${objIndex}.objectivePracticeArea`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select Practice Area" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {practiceArea && practiceArea.map((practiceAreaType) => (
                                                                    <SelectItem key={practiceAreaType} value={practiceAreaType}>
                                                                        {practiceAreaType}
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
                                </div>
                                <div className="flex-1">
                                    <FormField
                                        control={form.control}
                                        name={`controls.${controlIndex}.objectives.${objIndex}.objectiveDescription`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Control Objective Description"
                                                        className="resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="w-[5%] flex flex-row justify-end gap-3">
                                <IconButtonWithTooltip
                                    tooltipContent={lockedWeights[controlIndex]?.[objIndex] ? "Unlock this Objective Weight" : "Lock this Objective Weight"}
                                    type="button"
                                    onClick={() => toggleLock(controlIndex, objIndex)}
                                >
                                    {lockedWeights[controlIndex]?.[objIndex] ? <LockKeyhole /> : <LockKeyholeOpen />}
                                </IconButtonWithTooltip>

                                <IconButtonWithTooltip
                                    tooltipContent="Delete this Objective"
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeObjective(objIndex)}
                                >
                                    <Trash2 />
                                </IconButtonWithTooltip>
                            </div>

                        </div>
                        <div className="border-t-4 border-spacing-3 " />
                    </Fragment>
                )
            })}

            <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() =>
                    appendObjective({
                        objectiveSource: "custom",
                        objectiveName: "",
                        objectiveWeight: "",
                        objectiveType: "",
                        objectiveIndex: "",
                        objectivePracticeArea: "",
                        existingObjective: "",
                        objectiveDescription: ""
                    })
                }
            >
                + Add Control Objective
            </Button>
        </div>
    );
};

export default ObjectiveSection;


// "use client";

// import React from "react";
// import { useForm, useFieldArray } from "react-hook-form";

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
// import { FormData } from "./formData";

// const OBJECTIVE_TYPES = [
//     { label: "Type A", value: "typeA" },
//     { label: "Type B", value: "typeB" },
//     { label: "Type C", value: "typeC" },
// ];

// const OBJECTIVE_SOURCE_TYPE = [
//     { label: 'Existing', value: 'existing' },
//     { label: 'Custom', value: 'custom' },
// ]

// const OBJECTIVE_NAME = [
//     { label: "Objective 1", value: 'objective1' },
//     { label: "Objective 2", value: 'objective2' },
//     { label: "Objective 3", value: 'objective3' },
// ]


// type ObjectiveSectionProps = {
//     form: ReturnType<typeof useForm<FormData>>;
//     policyIndex: number;
//     controlIndex: number;
// };



// const ObjectiveSection = ({ form, policyIndex, controlIndex, }: ObjectiveSectionProps) => {

//     const { control, watch, setValue, getValues } = form;
//     const {
//         fields: objectiveFields,
//         append: appendObjective,
//         remove: removeObjective,
//     } = useFieldArray({
//         control,
//         name: `policies.${policyIndex}.controls.${controlIndex}.objectives`,
//     });

//     const { lockedWeights, setLockedWeights, selectedControlsObj, objTypes, practiceArea } = useKBContext();

//     const toggleLock = (controlIdx: number, objIdx: number) => {
//         console.log(controlIdx, objIdx)
//         setLockedWeights((prev) => ({
//             ...prev,
//             [controlIdx]: {
//                 ...prev[controlIdx],
//                 [objIdx]: !prev[controlIdx]?.[objIdx],
//             },
//         }));
//     };

// return (
//     <div className="ml-7 mt-2 space-y-4">
//         {objectiveFields.map((field, objIndex) => {
//             const source = watch(`policies.${policyIndex}.controls.${controlIndex}.objectives.${objIndex}.objectiveSource`);
//             const selectedControlName = getValues(`policies.${policyIndex}.controls.${controlIndex}.controlName`);
//             const objectivesUnderCurrentControls: Record<string, any> | null = selectedControlsObj && selectedControlsObj[selectedControlName];
//             return (
//                 <div key={field.id} className="flex flex-col gap-3">
//                     <div className="flex flex-row gap-3">
//                         <div className="flex-1">
//                             <FormField
//                                 control={control}
//                                 name={`policies.${policyIndex}.controls.${controlIndex}.objectives.${objIndex}.objectiveSource`}
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormControl>
//                                             <Select onValueChange={field.onChange} value={field.value}>
//                                                 <SelectTrigger className="w-full">
//                                                     <SelectValue placeholder="Objective Type" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {OBJECTIVE_SOURCE_TYPE.map((type) => (
//                                                         <SelectItem key={type.value} value={type.value}>
//                                                             {type.label}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>

//                         <div className="flex-1">
//                             <FormField
//                                 control={control}
//                                 name={`policies.${policyIndex}.controls.${controlIndex}.objectives.${objIndex}.objectiveIndex`}
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormControl>
//                                             <FloatingLabelInput {...field} id="indexName" label="Objective Index" />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>

//                         <div className="flex-1">

//                             {source === "existing" ? (
//                                 <FormField
//                                     control={control}
//                                     name={`policies.${policyIndex}.controls.${controlIndex}.objectives.${objIndex}.existingObjective`}
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormControl>
//                                                 <Select
//                                                     onValueChange={(selectedObjName) => {
//                                                         field.onChange(selectedObjName);

//                                                         const objDetails: Record<string, string> | null = selectedControlsObj && selectedControlsObj[selectedControlName]?.filter((objType: Record<string, string>) => objType.name === selectedObjName)?.[0];
//                                                         console.log(objDetails);
//                                                         if (objDetails) {
//                                                             setValue(`policies.${policyIndex}.controls.${controlIndex}.objectives.${objIndex}.objectiveIndex`, objDetails?.controlObjId || '');
//                                                             setValue(`policies.${policyIndex}.controls.${controlIndex}.objectives.${objIndex}.objectiveType`, objDetails?.controlObjType || '');
//                                                             setValue(`policies.${policyIndex}.controls.${controlIndex}.objectives.${objIndex}.objectiveDescription`, objDetails?.description || '');
//                                                             setValue(`policies.${policyIndex}.controls.${controlIndex}.objectives.${objIndex}.objectivePracticeArea`, objDetails?.practiceAreas || '');
//                                                         }
//                                                     }}
//                                                     value={field.value}>
//                                                     <SelectTrigger className="w-full">
//                                                         <SelectValue placeholder="Objective Name" />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                         {objectivesUnderCurrentControls && objectivesUnderCurrentControls?.map((objectives: Record<string, string>) => (
//                                                             <SelectItem key={objectives.name} value={objectives.name}>
//                                                                 {objectives.name}
//                                                             </SelectItem>
//                                                         ))}
//                                                     </SelectContent>
//                                                 </Select>
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             ) : (
//                                 <FormField
//                                     control={control}
//                                     name={`policies.${policyIndex}.controls.${controlIndex}.objectives.${objIndex}.objectiveName`}
//                                     render={({ field }) => (
//                                         <FormItem className="flex-1">
//                                             <FormControl>
//                                                 <FloatingLabelInput {...field} label="Objective Name" />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             )}
//                         </div>

//                         <Button
//                             type="button"
//                             variant={lockedWeights[objIndex] ? "secondary" : "outline"}
//                             onClick={() => toggleLock(controlIndex, objIndex)}
//                         >
//                             {lockedWeights[controlIndex]?.[objIndex] ? "UnLock" : "Lock"}
//                         </Button>

//                         <Button
//                             type="button"
//                             variant="destructive"
//                             size="sm"
//                             onClick={() => removeObjective(objIndex)}
//                         >
//                             Delete
//                         </Button>
//                     </div>
//                     <div className="flex flex-row gap-3">

//                         <div className="flex-1">
//                             <FormField
//                                 control={control}
//                                 name={`policies.${policyIndex}.controls.${controlIndex}.objectives.${objIndex}.objectiveWeight`}
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormControl>
//                                             <FloatingLabelInput {...field} id="objectiveWeight" label="Objective Weight" />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>

//                         <div className="flex-1">
//                             <FormField
//                                 control={control}
//                                 name={`policies.${policyIndex}.controls.${controlIndex}.objectives.${objIndex}.objectiveType`}
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormControl>
//                                             <Select onValueChange={field.onChange} value={field.value}>
//                                                 <SelectTrigger className="w-full">
//                                                     <SelectValue placeholder="Objective Type" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {objTypes && objTypes.map((objType) => (
//                                                         <SelectItem key={objType} value={objType}>
//                                                             {objType}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>

//                         <div className="flex-1">
//                             <FormField
//                                 control={control}
//                                 name={`policies.${policyIndex}.controls.${controlIndex}.objectives.${objIndex}.objectivePracticeArea`}
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormControl>
//                                             <Select onValueChange={field.onChange} value={field.value}>
//                                                 <SelectTrigger className="w-full">
//                                                     <SelectValue placeholder="Select Practice ARea" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {practiceArea && practiceArea.map((practiceAreaType) => (
//                                                         <SelectItem key={practiceAreaType} value={practiceAreaType}>
//                                                             {practiceAreaType}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>
//                     </div>
//                     <div className="flex-1">
//                         <FormField
//                             control={control}
//                             name={`policies.${policyIndex}.controls.${controlIndex}.objectives.${objIndex}.objectiveDescription`}
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormControl>
//                                         <FloatingLabelInput {...field} id="objectiveDescription" label="Objective Description" />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                 </div>
//             )
//         })}

//         <Button
//             variant="ghost"
//             size="sm"
//             type="button"
//             onClick={() =>
//                 appendObjective({
//                     objectiveSource: "existing",
//                     objectiveName: "",
//                     objectiveWeight: "",
//                     objectiveType: "",
//                     objectiveIndex: "",
//                     objectivePracticeArea: ""
//                 })
//             }
//         >
//             + Add Objective
//         </Button>
//     </div>
// );
// };

// export default ObjectiveSection;