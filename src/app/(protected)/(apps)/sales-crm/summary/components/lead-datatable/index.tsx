'use client'
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";

interface LeadDataTableProps {
    leadsData: any;
    columnSchema?: any;
}

export default function LeadDataTable({ leadsData, columnSchema }: LeadDataTableProps) {
    const columns: DTColumnsProps<any>[] = [
        {
            accessorKey: "categoryName",
            header: ({ column }) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Category</span>
                    </div>
                )
            },
            title: "Category",
            accessorFn: (row) => `${row.category}`
        },
        {
            accessorKey: "totalCount",
            header: ({ column }) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-end' }}>
                        <span>Count</span>
                    </div>
                )
            },
            title: "Count",
            accessorFn: (row) => `${row.count} `
        }
    ];

    // let filterData = getFilterData(documentData);
    const extraParams: any = {
        searching: false,
        filtering: false,
        grouping: false,
        pagination: false, // Disable pagination
        extraTools: []
    }
    return (
        <>
            <div className="mx-auto">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">Sales Performance</h2>
                <div className="max-h-[350px] overflow-auto p-3">
                    <DataTable columns={columns} data={leadsData} extraParams={extraParams} />
                </div>
            </div>

        </>
    );
}

