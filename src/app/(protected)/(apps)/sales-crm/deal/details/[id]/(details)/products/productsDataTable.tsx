'use client'
import { DataTable } from "@/ikon/components/data-table";
import { DealProductDetailsData, ProductDetailsData } from "../../../../../components/type";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import AddProductButtonWithModal from "../components/add-product";
import { Button } from "@/shadcn/ui/button";
import Link from "next/link";
import { SquarePenIcon } from "lucide-react";
import EditProductModal from "./edit-product/EditProductModal";
import { useState } from "react";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
//import { getUserName } from "@/ikon/utils/actions/users/userUtils";

const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();

export default function ProductsDataTable({ dealsProductData, dealIdentifier }: { dealsProductData: DealProductDetailsData[], dealIdentifier: string }) {

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedProductIdentifier, setSelectedProductIdentifier] = useState<string | null>(null);

    const openEditModal = (productIdentifier: string) => {
        setSelectedProductIdentifier(productIdentifier);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedProductIdentifier(null);
    };

    const columnsProuductDetails: DTColumnsProps<DealProductDetailsData>[] = [
        {
            accessorKey: "productType",
            header: () => (
                <div style={{ textAlign: 'center' }}>
                    Product Type
                </div>
            ),
            cell: ({ row }) => <Link href={`product/${row.original?.productIdentifier}/schedule`}>{row.original?.productType}</Link>
        }, {
            accessorKey: "productDescription",
            header: () => (
                <div style={{ textAlign: 'center' }}>
                    Product Description
                </div>
            ),
            cell: ({ row }) => <span>{row.original?.productDescription || "n/a"}</span>,
        },
        // {
        //     accessorKey: "projectManager",
        //     header: () => (
        //         <div style={{ textAlign: 'center' }}>
        //             Project Manager
        //         </div>
        //     ),
        //     cell: ({ row }) => {
        //     return <span>{getUserName(userIdWiseUserDetailsMap[row.original?.projectManager])}</span>;
        //     }
        // },
        {
            accessorKey: "actualRevenue",
            header: () => (
                <div style={{ textAlign: 'center' }}>
                    Billing Amount (USD)
                </div>
            ),
            cell: ({ row }) => <span>{row.original?.actualRevenue.toFixed(2) || "n/a"}</span>,
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(row.original?.productIdentifier)}
                >
                    <SquarePenIcon />
                </Button>
            ),
        },
    ];
    console.log("Deal identifier data table  ", dealIdentifier);
    const extraParams: any = {
        searching: true,
        filtering: true,
        grouping: true,
        extraTools: [<AddProductButtonWithModal dealIdentifier={dealIdentifier} />],
    };
    return (
        <>
            <DataTable columns={columnsProuductDetails} data={dealsProductData} extraParams={extraParams} />
            {isEditModalOpen && selectedProductIdentifier && (
                <EditProductModal isOpen={isEditModalOpen} onClose={closeEditModal} productIdentifier={selectedProductIdentifier}/>
            )}
        </>
    )
}

