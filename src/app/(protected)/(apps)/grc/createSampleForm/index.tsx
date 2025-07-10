'use client'
import FormInput from '@/ikon/components/form-fields/input';
import { cn } from '@/shadcn/lib/utils';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shadcn/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shadcn/ui/tooltip';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, CircleX } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import WeightageInDT from './components/weightageInDT';
import FormComboboxInput from '@/ikon/components/form-fields/combobox-input';

export const sampleFormData = [
    {
        framework: "standard",
        frameworkName: "ISO27001",
        index: "6",
        controlName: "People controls",
        controlObjectName: "Screening",
        controlObjectiveType: "Operational",
    },
    {
        framework: "standard",
        frameworkName: "ISO27001",
        index: "6",
        controlName: "People controls",
        controlObjectName: "Disciplinary process",
        controlObjectiveType: "Managerial",
    },
    {
        framework: "standard",
        frameworkName: "ISO27001",
        index: "8",
        controlName: "Technological controls",
        controlObjectName: "Privileged access rights",
        controlObjectiveType: "Technical",
    },
    {
        framework: "standard",
        frameworkName: "ISO27001",
        index: "8",
        controlName: "Technological controls",
        controlObjectName: "Information access restriction",
        controlObjectiveType: "Technical",
    },
    {
        framework: "standard",
        frameworkName: "ISO27001",
        index: "5",
        controlName: "Organizational controls",
        controlObjectName: "Segregation of duties",
        controlObjectiveType: "Managerial",
    }
]

const bestPracticeSchema = z.object({
    POLICY_NAME: z
        .string()
        .min(2, { message: 'Please Enter the Policy Name' })
        .trim(),
    CONTROL_NAMES: z
        .array(z.string(), {
            required_error: "Please Select atleast One Control Name",
            invalid_type_error: "Must be an array of strings"
        })
        .min(1, "At least one value is required"),

    OBJECTIVE_NAMES: z
        .array(z.string(), {
            required_error: "Please Select atleast One Objective Name",
            invalid_type_error: "Must be an array of strings"
        })
        .min(1, "At least one value is required"),
    CUSTOM_POLICY_CHECK: z
        .string()
        .min(2, { message: 'Please Select' })
        .trim(),

})

export default function CreateSampleForm() {


    const [selectedObjectiveNameState, setSelectedObjectiveNameState] = useState<Record<string, string>[] | null>(null)
    const controlNameGroups = Object.groupBy(sampleFormData, ({ controlName }) => controlName);

    console.log(controlNameGroups);

    const controlNames = Object.keys(controlNameGroups).map((controlName) => {
        return (
            {
                value: controlName,
                label: controlName
            }
        )
    })

    console.log(controlNames);

    const form = useForm<z.infer<typeof bestPracticeSchema>>({
        resolver: zodResolver(bestPracticeSchema),
        defaultValues: {
            POLICY_NAME: '',
            CONTROL_NAMES: [],
            OBJECTIVE_NAMES: [],
        }
    })

    async function onSubmit(data: z.infer<typeof bestPracticeSchema>) {
        console.log(data)
    }

    const selectedControlNames = form.watch("CONTROL_NAMES");
    console.log(selectedControlNames)

    const selectedObjectiveNames = form.watch("OBJECTIVE_NAMES");

    const customPolicyAdd = form.watch("CUSTOM_POLICY_CHECK");

    const filteredObjectives = useMemo(() => {
        const grouped: Record<string, { value: string; label: string }[]> = {};
        sampleFormData
            .filter((item) => selectedControlNames.includes(item.controlName))
            .forEach((item) => {
                if (!grouped[item.controlName]) {
                    grouped[item.controlName] = [];
                }
                grouped[item.controlName].push({
                    value: item.controlObjectName,
                    label: item.controlObjectName,
                });
            });

        return grouped;
    }, [selectedControlNames]);


    console.log(filteredObjectives)

    useEffect(() => {
        const validObjective = sampleFormData.filter(item => selectedObjectiveNames.includes(item.controlObjectName))
        setSelectedObjectiveNameState(validObjective)
    }, [selectedObjectiveNames])

    useEffect(() => {

        const validObjective = sampleFormData.filter(item => selectedControlNames.includes(item.controlName))
        const validObjectiveNames = validObjective.map(item => item.controlObjectName);
        const filteredObjectives = selectedObjectiveNames.filter(obj =>
            validObjectiveNames.includes(obj)
        );

        if (filteredObjectives.length !== selectedObjectiveNames.length) {
            form.setValue("OBJECTIVE_NAMES", filteredObjectives);
            form.trigger("OBJECTIVE_NAMES");
        }
    }, [selectedControlNames, sampleFormData]);

    console.log(selectedObjectiveNameState)

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className='flex flex-col gap-3 mb-3'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-3'>
                            <FormInput formControl={form.control} name={"POLICY_NAME"} label={"Policy Name"} placeholder={"Enter Policy Names"} />
                            <FormField
                                control={form.control}
                                name="CONTROL_NAMES"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Control Name</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            `w-full justify-between`,
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <div className="w-full flex flex-wrap gap-3">
                                                            {field.value?.length > 0 ? (
                                                                <>
                                                                    {field.value.slice(0, 2).map((value) => {
                                                                        const label = controlNames?.find(
                                                                            (controlName: Record<string, string>) => controlName.value === value
                                                                        )?.label;
                                                                        return label ? (
                                                                            <Badge key={value} className="flex flex-row gap-1">
                                                                                {label}
                                                                                <span
                                                                                    className="cursor-pointer"
                                                                                    onClick={() => {
                                                                                        const currentValues = field.value || [];
                                                                                        form.setValue(
                                                                                            "CONTROL_NAMES",
                                                                                            currentValues.filter((val) => val !== value)
                                                                                        );
                                                                                        form.trigger("CONTROL_NAMES");
                                                                                    }}
                                                                                >
                                                                                    <CircleX />
                                                                                </span>
                                                                            </Badge>
                                                                        ) : null;
                                                                    })}

                                                                    {field.value.length > 2 && (
                                                                        <TooltipProvider>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Badge className="cursor-pointer">+{field.value.length - 2}</Badge>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent side="top" className="bg-black text-white rounded-md px-3 py-1 text-sm z-50">
                                                                                    {field.value
                                                                                        .slice(2)
                                                                                        .map((value) => {
                                                                                            const label = controlNames?.find(
                                                                                                (controlName: Record<string, string>) => controlName.value === value
                                                                                            )?.label;
                                                                                            return label;
                                                                                        })
                                                                                        .join(", ")}
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                "Select Control Names"
                                                            )}
                                                        </div>
                                                        <ChevronsUpDown className="opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search Users"
                                                        className="h-9"
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>No User found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {controlNames && controlNames.map((controlName: Record<string, string>) => (
                                                                <CommandItem
                                                                    value={controlName.label}
                                                                    key={controlName.value}
                                                                    onSelect={() => {
                                                                        const currentValues = field.value || [];
                                                                        console.log(currentValues)
                                                                        if (currentValues.includes(controlName.value)) {
                                                                            form.setValue(
                                                                                "CONTROL_NAMES",
                                                                                currentValues.filter((val) => val !== controlName.value)
                                                                            );
                                                                        } else {
                                                                            form.setValue("CONTROL_NAMES", [
                                                                                ...currentValues,
                                                                                controlName.value,
                                                                            ]);
                                                                        }
                                                                        form.trigger("CONTROL_NAMES");
                                                                    }}
                                                                >
                                                                    {controlName.label}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            field.value?.includes(controlName.value)
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="OBJECTIVE_NAMES"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Objective Name</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant="outline" role="combobox" className="w-full justify-between">
                                                        <div className="w-full flex flex-wrap gap-3">
                                                            {field.value?.length > 0 ? (
                                                                <>
                                                                    {field.value.slice(0, 2).map((value) => (
                                                                        <Badge key={value} className="flex flex-row gap-1 items-center">
                                                                            {value}
                                                                            <span
                                                                                className="cursor-pointer"
                                                                                onClick={() => {
                                                                                    form.setValue(
                                                                                        "OBJECTIVE_NAMES",
                                                                                        field.value.filter((val) => val !== value)
                                                                                    );
                                                                                    form.trigger("OBJECTIVE_NAMES");
                                                                                }}
                                                                            >
                                                                                <CircleX className="h-4 w-4" />
                                                                            </span>
                                                                        </Badge>
                                                                    ))}

                                                                    {field.value.length > 2 && (
                                                                        <TooltipProvider>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Badge className="cursor-pointer">+{field.value.length - 2}</Badge>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent side="top" className="z-50 bg-black text-white rounded-md px-3 py-1 text-sm">
                                                                                    {field.value.slice(2).join(", ")}
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                "Select Objective Names"
                                                            )}
                                                        </div>
                                                        <ChevronsUpDown className="opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search Objective" className="h-9" />
                                                    <CommandList>
                                                        {Object.entries(filteredObjectives).map(([groupLabel, items]) => (
                                                            <CommandGroup key={groupLabel}>
                                                                <div className="text-base font-semibold mb-1">{groupLabel}</div>
                                                                {items.map((item) => (
                                                                    <CommandItem
                                                                        key={item.value}
                                                                        value={item.label}
                                                                        onSelect={() => {
                                                                            const currentValues = field.value || [];
                                                                            if (currentValues.includes(item.value)) {
                                                                                form.setValue(
                                                                                    "OBJECTIVE_NAMES",
                                                                                    currentValues.filter((val) => val !== item.value)
                                                                                );
                                                                            } else {
                                                                                form.setValue("OBJECTIVE_NAMES", [
                                                                                    ...currentValues,
                                                                                    item.value,
                                                                                ]);
                                                                            }
                                                                            form.trigger("OBJECTIVE_NAMES");
                                                                        }}
                                                                    >
                                                                        {item.label}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                field.value?.includes(item.value)
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        ))}
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </form>
            </Form>
            {
                selectedObjectiveNameState && <WeightageInDT filterData={selectedObjectiveNameState} />
            }

        </>
    )
}

