import { Column, ColumnDef, Table } from "@tanstack/react-table";
import { ActionMenuProps } from "../action-menu/type";

export interface DataTableProps<TData, TValue> {
    data: TData[];
    columns: DTColumnsProps<TData, TValue>[];
    extraParams?: DTExtraParamsProps;
}


export type DTColumnsProps<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
    title?: string;
}

export interface DTExtraParamsProps {
    defaultGroups?: string[];
    grouping?: boolean;
    header?: boolean;
    footer?: boolean;
    defaultTools?: ("columnFilter" | "search" | "filter")[] | boolean;
    extraTools?: any;
    sorting?: boolean;
    paginationBar?: boolean;
    rowsPerPage?: boolean;
    pagination?: boolean;
    numberOfRows?: boolean;
    checkBoxColumn?: boolean;
    checkBoxColumnCallback?: (selectedRows: any[]) => void;
    actionMenu?: DTActionMenuProps;
    groupActionMenu?: DTActionMenuProps,
    pageSize?: number,
    pageIndex?: number,
    pageSizeArray?: number[]
}

export interface DTActionMenuProps {
    items: ActionMenuProps[];
    extraArguments?: any[]
}

export interface DataTableViewOptionsProps<TData> {
    table: Table<TData>
}
export interface DTToolBarProps<TData> {
    table: Table<TData>
    extraParams?: DTExtraParamsProps
}
export interface DataTableFilterProps<TData> {
    table: Table<TData>
}

export interface DataTableFacetedFilterProps<TData, TValue> {
    column: Column<TData, TValue>
}
export interface DataTablePaginationProps<TData> {
    table: Table<TData>,
    extraParams?: DTExtraParamsProps
}

export interface DragDropHeaderProp {
    id: string;
    title: string;
}
