'use client'
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
//import ButtonWithTooltip from "@/ikon/components/buttonWithTooltip";
import { useState } from "react";
import { Plus } from "lucide-react";
import ResourceModal from "./add-resource/AddResourceModalForm";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";

interface ResourceData {
    staff: string;
    role: string;
    grade: string;
   // cost?: number | undefined;
    [key: string]: string | number; // Allows dynamic month columns
}

interface ColumnSchema {
    title: string;
    dataField: string;
    class: string;
}

export default function ResourceMainDataTable({ resourceData, columnSchema, productIdentifier }: { resourceData: ResourceData[], columnSchema: ColumnSchema[], productIdentifier: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const columnsProductDetails: DTColumnsProps<ResourceData>[] = [
        {
            accessorKey: "task",
            //cell: ({ row }) => <span>{row.original?.staff || "n/a"}</span>,
        },
        {
            accessorKey: "staff",
            header: () => (
                <div style={{ textAlign: 'center' }}>Staff</div>
            ),
            //cell: ({ row }) => <span>{row.original?.staff || "n/a"}</span>,
        },
        {
            accessorKey: "role",
            header: () => (
                <div style={{ textAlign: 'center' }}>Role</div>
            ),
            //cell: ({ row }) => <span>{row.original?.role || "n/a"}</span>,
        },
        {
            accessorKey: "grade",
            header: () => (
                <div style={{ textAlign: 'center' }}>Grade</div>
            ),
            //cell: ({ row }) => <span>{row.original?.grade || "n/a"}</span>,
        },
        ...columnSchema.map(col => ({
            accessorKey: col.dataField,
            header: () => (
                <div style={{ textAlign: 'center' }}>{col.title}</div>
            ),
            cell: ({ row }: { row: { original: ResourceData } }) => (
                <span className={col.class}>{row.original[col.dataField] ?? 0}</span>
            )
        }))
    ];

    const extraParams: any = {
        searching: true,
        filtering: true,
        grouping: true,
        defaultGroups: ["task"],
        extraTools: [<IconButtonWithTooltip tooltipContent="Add/Edit Resource" onClick={() => { setIsModalOpen(true) }} ><Plus/></IconButtonWithTooltip>],
    };

    return (
        <>
            <DataTable columns={columnsProductDetails} data={resourceData} extraParams={extraParams} />
            <ResourceModal isOpen={isModalOpen} onClose={handleCloseModal} productIdentifier={productIdentifier} resourceDataWithAllocation={resourceData} />
        </>
    );
}