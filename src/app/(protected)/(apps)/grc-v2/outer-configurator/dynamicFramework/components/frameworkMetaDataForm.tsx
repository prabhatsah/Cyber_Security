import React, { useEffect } from 'react';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shadcn/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/ui/select";
import { Input } from "@/shadcn/ui/input";
import { Badge } from "@/shadcn/ui/badge";
import { Textarea } from "@/shadcn/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shadcn/ui/popover";
import { Calendar } from "@/shadcn/ui/calendar";
import { Button } from "@/shadcn/ui/button"
import { z } from 'zod';
import { Building, CalendarIcon, CheckCircle, Clock, FileText, Shield } from 'lucide-react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { cn } from '@/shadcn/lib/utils';
import { format } from 'date-fns';
import { DynamicFieldFrameworkContext, frameworkMetaDataSchema } from '../context/dynamicFieldFrameworkContext';
import { RadioGroup, RadioGroupItem } from '@/shadcn/ui/radio-group';
import { Label } from '@/shadcn/ui/label';

const frameworkTypes = [
    { value: 'security', label: 'Information Security', icon: Shield },
    { value: 'privacy', label: 'Data Privacy', icon: FileText },
    { value: 'financial', label: 'Financial Compliance', icon: Building },
    { value: 'operational', label: 'Operational Risk', icon: Clock },
    { value: 'quality', label: 'Quality Management', icon: CheckCircle },
];

const industries = [
    'Financial Services', 'Healthcare', 'Technology', 'Manufacturing', 'Retail',
    'Government', 'Education', 'Energy', 'Telecommunications', 'Transportation', 'All Industries',
];

const statusOptions = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'draft', label: 'Draft', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'deprecated', label: 'Deprecated', color: 'bg-red-100 text-red-800' },
    { value: 'pending', label: 'Pending Review', color: 'bg-blue-100 text-blue-800' },
];




export default function FrameworkMetaDataForm({
    form,
    onSubmit
}: {
    form: UseFormReturn<z.infer<typeof frameworkMetaDataSchema>>;
    onSubmit: SubmitHandler<z.infer<typeof frameworkMetaDataSchema>>
}) {
    const {frameworkMetaDeta} = DynamicFieldFrameworkContext()
    useEffect(() => {
        form.reset({
            name: frameworkMetaDeta?.name || '',
            acronym: frameworkMetaDeta?.acronym || '',
            type: frameworkMetaDeta?.type || '',
            version: frameworkMetaDeta?.version || '',
            description: frameworkMetaDeta?.description || '',
            regulatoryAuthority: frameworkMetaDeta?.regulatoryAuthority  || '',
            industry: frameworkMetaDeta?.industry || '',
            status: frameworkMetaDeta?.status || 'draft',
            effectiveDate: frameworkMetaDeta?.effectiveDate
                ? new Date(frameworkMetaDeta.effectiveDate) : new Date(),
            contactEmail: frameworkMetaDeta?.contactEmail || '',
            responsibilityMatrixExists: frameworkMetaDeta?.responsibilityMatrixExists || false,
            soaExists: frameworkMetaDeta?.soaExists ||  false
        });
    }, []);

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="border-l-4 border-blue-500 pl-4">
                        <h3 className="text-lg font-semibold my-4">
                            Framework Metadata
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Framework Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., ISO 27001:2022" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="acronym"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Acronym</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., ISO27001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Framework Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {frameworkTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    <div className="flex items-center gap-2">
                                                        <type.icon className="h-4 w-4" />
                                                        {type.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="version"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Version</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 2022, v4.0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {statusOptions.map((status) => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={cn("px-2 py-1 text-xs", status.color)}>
                                                            {status.label}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Provide a comprehensive description of the framework..."
                                        className="min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="regulatoryAuthority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Regulatory Authority</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., ISO, PCI Security Standards Council" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="industry"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Applicable Industry</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select industry" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {industries.map((industry) => (
                                                <SelectItem key={industry} value={industry.toLowerCase().replace(/\s+/g, '-')}>
                                                    {industry}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="effectiveDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-3">
                                    <FormLabel>Effective Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date("1900-01-01")}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="compliance@organization.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="responsibilityMatrixExists"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Responsibility Matrix Required ?</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={(value) => field.onChange(value === "true")}
                                            value={field.value === true ? "true" : "false"}
                                            className="flex flex-row gap-6 mt-2"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem id="treat-rm-yes" value="true" />
                                                <Label htmlFor="treat-rm-yes" className="font-normal">
                                                    Yes
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem id="treat-rm-no" value="false" />
                                                <Label htmlFor="treat-rm-no" className="font-normal">
                                                    No
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="soaExists"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SOA Applicable ?</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={(value) => field.onChange(value === "true")}
                                            value={field.value === true ? "true" : "false"}
                                            className="flex flex-row gap-6 mt-2"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem id="treat-soa-yes" value="true" />
                                                <Label htmlFor="treat-soa-yes" className="font-normal">
                                                    Yes
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem id="treat-soa-no" value="false" />
                                                <Label htmlFor="treat-soa-no" className="font-normal">
                                                    No
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                </form>
            </Form>
        </>
    )
}
