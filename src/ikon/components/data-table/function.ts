export const getDataTableColumnTitle = (column: any) => {
    return column?.columnDef?.title ||
        (column?.columnDef?.header && typeof column.columnDef.header == 'string' && column?.columnDef?.header) ||
        column.id
}