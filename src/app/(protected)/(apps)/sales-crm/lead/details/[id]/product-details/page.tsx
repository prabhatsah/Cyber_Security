import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import ProductDetailsDataTable from "./productDetailsDataTable";

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {

    const leadIdentifier = params?.id || "";

    const leadsProductInstanceData = await getMyInstancesV2({
        processName: "Deal",
        predefinedFilters: { taskName: "View State" },
        mongoWhereClause: `this.Data.leadIdentifier == "${leadIdentifier}"`,
    });

    const leadsProductData = leadsProductInstanceData[0]?.data?.productDetails || [];

    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 5,
                    title: 'Product Details',
                    href: `/sales-crm/lead/details/${leadIdentifier}/product-details`,
                }}
            />
            <ProductDetailsDataTable leadsProductData={leadsProductData} />
        </>
    )
}