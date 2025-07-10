"use client"

import { useEffect } from "react"
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { useAlarms } from "../../../context/alarmsContext"
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem } from "@/shadcn/ui/form";
import { Switch } from "@progress/kendo-react-inputs";

export default function RecipientGroupDatatable({ form }: { form: UseFormReturn<any> }) {

    const { setCreateQuery } = useAlarms()

    let alertRecipientArray = [
        {
            // value: 'clientEditor_' + undefined,
            value: 'clientEditor_',
            text: "Editor"
        },
        {
            // value: 'clientViewer_' + undefined,
            value: 'clientViewer_',
            text: "Viewer"
        }
    ]
    const extraParams: DTExtraParamsProps = {
        grouping: false,
        pageSize: 10,
        pageSizeArray: [10, 15, 20, 25, 50, 100],
    };
    const columnSchema: DTColumnsProps<any>[] = [
        {
            accessorKey: "recipientGroup",
            header: "Recipient Group",
            cell: ({ row }) => (
                <span>{row.original.text}</span>
            ),
        },
        {
            accessorKey: "recipientSelected",
            header: 'Selected',
            cell: ({ row }) => (
                <FormField
                    control={form.control}
                    name={`${row.original.value}`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    //   onCheckedChange={field.onChange}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            ),
        },
    ];
    return (
        <>
            <DataTable data={alertRecipientArray} columns={columnSchema} extraParams={extraParams} />
        </>
    )
}