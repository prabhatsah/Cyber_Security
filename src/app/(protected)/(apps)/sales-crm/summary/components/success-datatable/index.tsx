'use client'
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";

interface successRatioTableProps {
    leadsData: any;
    columnSchema?: any;
}

export default function SuccessRatioTable({ leadsData, columnSchema }: successRatioTableProps) {
    const columns: DTColumnsProps<any>[] = [
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Category</span>
                    </div>
                )
            },
            title: "",
            accessorFn: (row) => `${row.status}`
        },
        {
            accessorKey: "Q1Self",
            header: ({ column }) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-end' }}>
                        <span>Q1 - Self</span>
                    </div>
                )
            },
            title: "Q1 - Self",
            accessorFn: (row) => `${row.q1User} `
        },
        {
            accessorKey: "Q1Company",
            header: ({ column }) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-end' }}>
                        <span>Q1 - Company</span>
                    </div>
                )
            },
            title: "Q1 - Company",
            accessorFn: (row) => `${row.q1Company} `
        },
        {
            accessorKey: "Q2Self",
            header: ({ column }) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-end' }}>
                        <span>Q2 - Self</span>
                    </div>
                )
            },
            title: "Q2 - Self",
            accessorFn: (row) => `${row.q2User} `
        },
        {
            accessorKey: "Q2Company",
            header: ({ column }) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-end' }}>
                        <span>Q2 - Company</span>
                    </div>
                )
            },
            title: "Q2 - Company",
            accessorFn: (row) => `${row.q2Company} `
        },
        {
            accessorKey: "Q3Self",
            header: ({ column }) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-end' }}>
                        <span>Q3 - Self</span>
                    </div>
                )
            },
            title: "Q3 - Self",
            accessorFn: (row) => `${row.q3User} `
        },
        {
            accessorKey: "Q3Company",
            header: ({ column }) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-end' }}>
                        <span>Q3 - Company</span>
                    </div>
                )
            },
            title: "Q3 - Company",
            accessorFn: (row) => `${row.q3Company} `
        },
        {
            accessorKey: "Q4Self",
            header: ({ column }) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-end' }}>
                        <span>Q3 - Company</span>
                    </div>
                )
            },
            title: "Q4 - Self",
            accessorFn: (row) => `${row.q4User} `
        },
        {
            accessorKey: "Q4Company",
            header: ({ column }) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-end' }}>
                        <span>Q4 - Company</span>
                    </div>
                )
            },
            title: "Q4 - Company",
            accessorFn: (row) => `${row.q4Company} `
        },
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
            <DataTable columns={columns} data={leadsData} extraParams={extraParams} />
        </>
    );
}

