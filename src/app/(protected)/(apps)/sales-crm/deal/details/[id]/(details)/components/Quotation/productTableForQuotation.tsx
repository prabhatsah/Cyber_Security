'use client'
import React, {useEffect,useImperativeHandle,useState,forwardRef} from "react";
import { calculateFxRate } from "@/app/(protected)/(apps)/sales-crm/utils/Fx-Rate/calculateFxRate";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { DataTable } from "@/ikon/components/data-table";
import { getTotalBillingAmountForPS } from "@/app/(protected)/(apps)/sales-crm/utils/TotalBillingAmountForPS/getTotalBillingAmountForPS";
import { getTotalBillingAmountForUserLicense } from "@/app/(protected)/(apps)/sales-crm/utils/TotalBillingAmountForUserLicense/getTotalBillingAmountForUserLicense";
import { Input } from "@/shadcn/ui/input";

export interface QuotationData {
    productType: string;
    projectManager: string;
    actualRevenue: number;
    discountPercent: number;
    discountedAmount: number;
    finalBillingAmount: number;
    finalBillingAmountUSD: number;
    productIdentifier: string;
}

export interface QuotationProductDataTableProps {
    // New data structure: array of objects
    productIdentifierWiseDataObj: any[];
    currency: string;
}

export interface QuotationProductDataTableRef {
    getQuotationDetails: () => QuotationData[];
    getTotalBillingAmount: () => number;
}

const QuotationProductDataTable = forwardRef<QuotationProductDataTableRef,QuotationProductDataTableProps>(({ productIdentifierWiseDataObj, currency }, ref) => {
    const [quotationDetails, setQuotationDetails] = useState<QuotationData[]>([]);
    const [fxRates, setFxRates] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchFxRate = async () => {
            if (!fxRates[currency]) {
                const rate = await calculateFxRate(currency, "USD");
                setFxRates((prevRates) => ({ ...prevRates, [currency]: rate }));
            }
        };
        fetchFxRate();
    }, [currency, fxRates]);

    useEffect(() => {
        const fxRate = fxRates[currency] || 1;
        // Convert the passed array of products (new data structure)
        const formattedData = productIdentifierWiseDataObj.map((product: any) => {
            let baseRevenue = product.quotationAmount || 0;
            let computedRevenue = baseRevenue;
            if (product.quotation) {
                Object.values(product.quotation).forEach((item: any) => {
                    if (product.productType === "Professional Service") {
                        computedRevenue += getTotalBillingAmountForPS(
                            item.scr,
                            item.expenses,
                            item.otherCosts,
                            item.totalFTE
                        );
                    } else if (product.productType === "User License") {
                        computedRevenue += getTotalBillingAmountForUserLicense(
                            item.costPerLicensePerMonth,
                            item.billingCycle,
                            item.noOfLicense,
                            { sdate: item.licenseStartDate, edate: item.licenseEndDate }
                        );
                    } else if (product.productType === "Service Level Agreement") {
                        computedRevenue += item.slaRevenue || 0;
                    } else {
                        computedRevenue += item.billingAmount || 0;
                    }
                });
            }
            const computedRevenueUSD = computedRevenue * fxRate;
            return {
                productType: product.productType,
                projectManager: product.projectManager,
                actualRevenue: computedRevenue,
                discountPercent: product.discountPercent || 0,
                discountedAmount: 0,
                finalBillingAmount: computedRevenue,
                finalBillingAmountUSD: computedRevenueUSD,
                productIdentifier: product.productIdentifier,
            };
        });
        setQuotationDetails(formattedData);
    }, [productIdentifierWiseDataObj, fxRates, currency]);

    const handleDiscountChange = (id: string, value: number) => {
        if (value < 0 || value > 100) {
            alert("Please enter a valid Discount (%) between 0 and 100");
            return;
        }
        setQuotationDetails((prev) =>
            prev.map((item) => {
                if (item.productIdentifier === id) {
                    const discount = (item.actualRevenue * value) / 100;
                    const finalBilling = item.actualRevenue - discount;
                    const finalBillingUSD = finalBilling * (fxRates[currency] || 1);
                    return {
                        ...item,
                        discountPercent: value,
                        discountedAmount: discount,
                        finalBillingAmount: finalBilling,
                        finalBillingAmountUSD: finalBillingUSD,
                    };
                }
                return item;
            })
        );
    };

    const columnsQuotationDetails: DTColumnsProps<QuotationData>[] = [
        {
            accessorKey: "productType",
            header: () => <div style={{ textAlign: "center" }}>Product Name</div>,
        },
        {
            accessorKey: "projectManager",
            header: () => <div style={{ textAlign: "center" }}>Project Manager</div>,
        },
        {
            accessorKey: "actualRevenue",
            header: () => (
                <div style={{ textAlign: "center" }}>
                    Actual Revenue ({currency})
                </div>
            ),
            footer: () => (
                <div style={{ textAlign: "center" }}>
                    {quotationDetails
                        .reduce((acc, curr) => acc + curr.actualRevenue, 0)
                        .toFixed(2)}
                </div>
            ),
        },
        {
            accessorKey: "discountPercent",
            header: () => <div style={{ textAlign: "center" }}>Discount (%)</div>,
            cell: ({ row }) => (
                <Input
                    type="number"
                    min="0"
                    max="100"
                    value={row.original.discountPercent}
                    onChange={(e) =>
                        handleDiscountChange(
                            row.original.productIdentifier,
                            Number(e.target.value)
                        )
                    }
                />
            ),
        },
        {
            accessorKey: "discountedAmount",
            header: () => (
                <div style={{ textAlign: "center" }}>
                    Discounted Amount ({currency})
                </div>
            ),
            //   footer: () => (
            //     <div style={{ textAlign: "center" }}>
            //       {quotationDetails
            //         .reduce((acc, curr) => acc + curr.discountedAmount, 0)
            //         .toFixed(2)}
            //     </div>
            //   ),
        },
    ];

    if (currency !== "USD") {
        columnsQuotationDetails.push({
            accessorKey: "finalBillingAmount",
            header: () => (
                <div style={{ textAlign: "center" }}>
                    Billing Amount ({currency})
                </div>
            ),
        });
    }

    columnsQuotationDetails.push({
        accessorKey: "finalBillingAmountUSD",
        header: () => (
            <div style={{ textAlign: "center" }}>Billing Amount (USD)</div>
        ),
    });

    const extraParams: DTExtraParamsProps = {
        defaultTools: false,
        paginationBar: false,
        footer: true,
    };

    // Expose functions to the parent via ref.
    useImperativeHandle(ref, () => ({
        getQuotationDetails: () => quotationDetails,
        getTotalBillingAmount: () =>
            quotationDetails.reduce(
                (acc, curr) => acc + curr.finalBillingAmountUSD,
                0
            ),
    }));

    return (
        <DataTable columns={columnsQuotationDetails} data={quotationDetails} extraParams={extraParams}/>
    );
});

QuotationProductDataTable.displayName = "QuotationProductDataTable";
export default QuotationProductDataTable;
