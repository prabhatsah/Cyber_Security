import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type'
import React from 'react'
import { BauTableSchema } from '../page'
import { DataTable } from '@/ikon/components/data-table'

export default function BauDataTable({
    columnsBauTable,
    extraParamsBauTable,
    data
}: {
    columnsBauTable: DTColumnsProps<BauTableSchema>[],
    extraParamsBauTable: DTExtraParamsProps,
    data: BauTableSchema[]
}
) {
    return (
        <>
            <DataTable columns={columnsBauTable} data={data} extraParams={extraParamsBauTable} />
        </>
    )
}
