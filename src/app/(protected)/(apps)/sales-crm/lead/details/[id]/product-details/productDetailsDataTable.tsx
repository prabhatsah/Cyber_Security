'use client'
import { DataTable } from "@/ikon/components/data-table";
import { ProductDetailsData } from "../../../../components/type";
import { DTColumnsProps } from "@/ikon/components/data-table/type";

export default function ProductDetailsDataTable({ leadsProductData }: { leadsProductData: ProductDetailsData[] }) {
    const columnsProuductDetails: DTColumnsProps<ProductDetailsData>[] = [
        {
            accessorKey: "productType",
            header: () => (
                <div style={{ textAlign: 'center' }}>
                    Product Type
                </div>
            )
        }, {
            accessorKey: "productDescription",
            header: () => (
                <div style={{ textAlign: 'center' }}>
                    Product Description
                </div>
            )
        },
    ];

    const extraParams: any = {
        searching: true,
        filtering: true,
        grouping: true,
    };
    return (
        <DataTable columns={columnsProuductDetails} data={leadsProductData} extraParams={extraParams} />
    )
}

