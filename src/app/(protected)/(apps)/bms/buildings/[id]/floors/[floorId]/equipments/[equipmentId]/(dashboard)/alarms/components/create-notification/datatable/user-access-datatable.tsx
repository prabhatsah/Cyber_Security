"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { useAlarms } from "../../../context/alarmsContext"
import { UseFormReturn } from "react-hook-form";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import moment from "moment";
import { set } from "date-fns";
import { FormControl, FormField, FormItem } from "@/shadcn/ui/form";
import { Switch } from "@progress/kendo-react-inputs";
import { resolve } from "path";


export type DeletedCredHistoryTableDataType = {
    deletedBy: string,
    deletedOn: string,
    credentialName: string,
    credentialType: string,
    updatedOn: string,
    services: string,
    createdOn: string // Added createdOn property
}
export default function UserAccessDatatable({ form }: { form: UseFormReturn<any> }) {
    const [userData, setUserData] = useState<any[]>([]);
    const extraParams: DTExtraParamsProps = {
        grouping: false,
        pageSize: 10,
        pageSizeArray: [10, 15, 20, 25, 50, 100],
    };
    const columnSchema: DTColumnsProps<any>[] = [
        {
            accessorKey: "userName",
            header: "User Name",
            cell: ({ row }) => (
                <span>{row.original.text}</span>
            ),
        },
        {
            accessorKey: "userSelected",
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
    useEffect(() => {
        // API call to get deleted credential history
        getMyInstancesV2<DeletedCredHistoryTableDataType>({
            processName: 'Credential Delete History Process',
            predefinedFilters: { taskName: "View Delete Credential History" },
        }).then((instances) => {
            getUserIdWiseUserDetailsMap().then((res) => {
                let tempArr: any[] = [], tempObj: any = {};
                for (const item of Object.values(res)) {
                    tempObj['value'] = item.userId;
                    tempObj['text'] = item.userName;
                    tempArr.push(tempObj);
                    tempObj = {};
                }
                setUserData(tempArr);
            }).catch((error) => {
                console.log("Error in fetching user map", error)
            })

        }).catch((error) => {
            console.log("Error in fetching deleted credential history", error)
        })

    }, [])
    return (
        <>
            {userData.length > 0 && <DataTable data={userData} columns={columnSchema} extraParams={extraParams} />}
        </>
    )
}