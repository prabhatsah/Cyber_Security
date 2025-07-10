'use client'
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";
import { getMyInstancesV2, getParameterizedDataForTaskId } from "@/ikon/utils/api/processRuntimeService";
import { useEffect, useState } from "react";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { getBaseSoftwareId } from "@/ikon/utils/actions/software";

interface WorkingDaysProcessProps {
    [year: string]: {
        [month: string]: {
            year: string;
            month: string;
            workingDays: number;
        };
    };
}

interface WorkingDaysTableProps {
    year: string;
    month: string;
    workingDays: number;
}

function WorkingDaysTable() {
    const [workingDaysTableData, setWorkingDaysTableData] = useState<WorkingDaysTableProps[]>([]);
    const fetchWorkingDaysTableData = async () => {
        const baseSoftwareId = await getBaseSoftwareId();
        try {
            const workingDaysTableInstance = await getMyInstancesV2({ softwareId: baseSoftwareId, processName: "API Connections", predefinedFilters: { taskName: "View Connection" }, mongoWhereClause: `this.Data.connectorId == "1727782203994"`, })
            const workingDaysTaskId = workingDaysTableInstance[0].taskId;
            const workingDaysProcessData = await getParameterizedDataForTaskId({ taskId: workingDaysTaskId, parameters: null });
            const workingDaysTableData = (workingDaysProcessData as { workingDaysDetails: WorkingDaysProcessProps })?.workingDaysDetails;
            const workingDaysMappedData = Object.entries(workingDaysTableData).flatMap(([year, monthsObj]) => {
                const months = monthsObj as Record<string, { year: string; month: string; workingDays: number }>;
                return Object.values(months);
            });
            console.log("workingDaysTableData", workingDaysTableData);
            setWorkingDaysTableData(workingDaysMappedData);
        } catch (error) {
            console.error("Error fetching workingDays data:", error);
        }
    };
    const columns: ColumnDef<WorkingDaysTableProps>[] = [
        {
            accessorKey: "year",
            header: () => (
                <div style={{ textAlign: 'center' }}>
                    Year
                </div>
            ),
            cell: ({ row }) => <span>{row.original?.year || "n/a"}</span>,
        },
        {
            accessorKey: "month",
            header: () => (
                <div style={{ textAlign: 'center' }}>
                    Month
                </div>
            ),
            cell: ({ row }) => <span>{row.original?.month || "n/a"}</span>,
        },
        {
            accessorKey: "workingDays",
            header: () => (
                <div style={{ textAlign: 'center' }}>
                    Working Days
                </div>
            ),
            cell: ({ row }) => <span>{row.original?.workingDays || "n/a"}</span>,
        },
    ];

    useEffect(() => {
        fetchWorkingDaysTableData();
    }, []);

    const extraParams: DTExtraParamsProps = {
        defaultGroups: ['year'],
        grouping: true,
        numberOfRows: true,
        pageSize: 150,
    };
    return (
        <DataTable columns={columns} data={workingDaysTableData} extraParams={extraParams} />
    )
}

export default WorkingDaysTable;