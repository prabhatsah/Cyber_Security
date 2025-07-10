"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import { z } from "zod";



export const frameworkMetaDataSchema = z.object({
    name: z.string().min(2, 'Framework name must be at least 2 characters'),
    acronym: z.string().min(2, 'Acronym must be at least 2 characters'),
    type: z.string().min(1, 'Please select a framework type'),
    version: z.string().min(1, 'Version is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    regulatoryAuthority: z.string().min(2, 'Regulatory authority is required'),
    industry: z.string().min(1, 'Please select an industry'),
    status: z.string().min(1, 'Please select a status'),
    effectiveDate: z.date({
        required_error: 'Effective date is required',
    }),
    contactEmail: z.string().email('Please enter a valid email address'),
    responsibilityMatrixExists: z.boolean({
        required_error: "Responsibility Matrix is required",
        invalid_type_error: "Responsibility Matrix must be a boolean",
    }).default(false),
    soaExists: z.boolean({
        required_error: "SOA is required",
        invalid_type_error: "SOA must be a boolean",
    }).default(false)
});

const dynamicFieldConfigbaseSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.enum(['text', 'textarea', 'dropdown']),
    description: z.string().min(1, "Description is Required"),
    extraInfo: z
        .array(
            z.object({
                label: z.string().min(1, 'Label is required'),
                value: z.string().min(1, 'Value is required'),
            }),
        )
        .optional(),
})

export const dynamicFieldschema = dynamicFieldConfigbaseSchema.superRefine((data, ctx) => {
    if (data.type === 'dropdown') {
        if (!data.extraInfo || data.extraInfo.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'At least one dropdown option is required',
                path: ['extraInfo'],
            })
        } else {
            data.extraInfo.forEach((item, index) => {
                if (!item.label) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Label is required',
                        path: ['extraInfo', index, 'label'],
                    })
                }
                if (!item.value) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Value is required',
                        path: ['extraInfo', index, 'value'],
                    })
                }
            })
        }
    }
})

export type DynamicFieldConfigFormData = z.infer<typeof dynamicFieldschema>

export type DynamicFieldConfigFormDataWithId = DynamicFieldConfigFormData & { id: string };

type DynamicFrameworkContextProps = {
    frameworkMetaDeta: z.infer<typeof frameworkMetaDataSchema> | null;
    setFrameworkMetaData: React.Dispatch<React.SetStateAction<z.infer<typeof frameworkMetaDataSchema> | null>>;
    activeTab: number;
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
    frameworkFieldConfigData: DynamicFieldConfigFormDataWithId[];
    setFrameworkFieldConfigData: React.Dispatch<React.SetStateAction<DynamicFieldConfigFormDataWithId[]>>;
    frameworkStructureData: Record<string, string | boolean>[];
    setFrameworkStructureData: React.Dispatch<React.SetStateAction<Record<string, string | boolean>[]>>;
    frameworkEntries: Record<string, string | boolean | null>[];
    setFrameworkEntries: React.Dispatch<React.SetStateAction<Record<string, string | boolean | null>[]>>;
    fieldIdentifer: Record<string, string>;
    parentEntries: { value: string, label: string }[];
    setParentEntries: React.Dispatch<React.SetStateAction<{ value: string, label: string }[]>>;
    identifier: Record<string, string>;
    setIdentifier: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    selectedEntries: string[];
    setSelectedEntries: React.Dispatch<React.SetStateAction<string[]>>;
};
export const DynamicFrameworkContext = createContext<DynamicFrameworkContextProps | null>(null);

export default function DynamicFrameworkContextProvider({ children }: { children: React.ReactNode }) {
    const indexIdentifierId = useMemo(() => {
        return `FormField${crypto.randomUUID()}`;
    }, []);

    const titleIdentifierId = useMemo(() => {
        return `FormField${crypto.randomUUID()}`;
    }, []);
    const descriptionIdentiferId = useMemo(() => {
        return `FormField${crypto.randomUUID()}`;
    }, []);

    const [frameworkMetaDeta, setFrameworkMetaData] = useState<z.infer<typeof frameworkMetaDataSchema> | null>(null);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [frameworkFieldConfigData, setFrameworkFieldConfigData] = useState<DynamicFieldConfigFormDataWithId[]>(
        [
            {
                "name": "index",
                "type": "text",
                "description": "Enter Index",
                "extraInfo": [],
                "id": indexIdentifierId
            },
            {
                "name": "title",
                "type": "text",
                "description": "Enter title",
                "extraInfo": [],
                "id": titleIdentifierId
            },
            {
                "name": "description",
                "type": "textarea",
                "description": "Enter Index",
                "extraInfo": [],
                "id": descriptionIdentiferId
            }
        ]
    );
    const [frameworkStructureData, setFrameworkStructureData] = useState<Record<string, string | boolean>[]>([]);
    const [frameworkEntries, setFrameworkEntries] = useState<Record<string, string | boolean | null>[]>([]);
    const [parentEntries, setParentEntries] = useState<{ value: string, label: string }[]>([]);
    const fieldIdentifer = useMemo(() => {
        return {
            index: indexIdentifierId,
            title: titleIdentifierId,
            description: descriptionIdentiferId
        } as Record<string,string>
    }, [])
    const [identifier, setIdentifier] = useState(fieldIdentifer);
    const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
    return (
        <DynamicFrameworkContext.Provider
            value={{
                frameworkMetaDeta,
                setFrameworkMetaData,
                activeTab,
                setActiveTab,
                frameworkFieldConfigData,
                setFrameworkFieldConfigData,
                frameworkStructureData,
                setFrameworkStructureData,
                frameworkEntries,
                setFrameworkEntries,
                fieldIdentifer,
                parentEntries,
                setParentEntries,
                identifier,
                setIdentifier,
                selectedEntries,
                setSelectedEntries
            }}
        >
            {children}
        </DynamicFrameworkContext.Provider>
    );
}

export function DynamicFieldFrameworkContext() {
    const context = useContext(DynamicFrameworkContext);
    if (!context) {
        throw new Error("Not within Dynamic Field Framework Context Provider");
    }
    return context;
}
