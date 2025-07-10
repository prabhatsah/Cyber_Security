import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
//import DropdownMenuWithEditLead from "../../components_edit_lead/lead_data_definition/DropdownMenuWithEditLead";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
//import { getUserName } from "@/ikon/utils/actions/users/userUtils";
//import DropdownMenuWithEditDeal from "../../component_edit_deal/deal_form_definition/DropdownMenuWithEditDeal";

export default async function ProductDetailsComponent({ productIdentifier }: { productIdentifier: string }): Promise<ReactNode> {
    const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
    const productData = await getMyInstancesV2<any>({
        processName: "Product",
        predefinedFilters: { taskName: "View State" },
        mongoWhereClause: `this.Data.productIdentifier == "${productIdentifier}"`,
        projections : ["Data.productIdentifier","Data.productType","Data.productDescription","Data.projectManager","Data.quotation","Data.productDescription","Data.quotationAmount","Data.updatedOn"]
    });

    console.log("productIdWiseProductData", productData);
    const productIdWiseProductData  = productData[0].data;

    return (
        <Card className="h-1/2 flex flex-col">
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 4,
                    title: productIdWiseProductData.productType || "n/a",
                    href: `/product/${productIdentifier}`,
                }}
            />
            <CardHeader className="flex flex-row justify-between items-center border-b">
                <CardTitle>Product Details</CardTitle>

                 {/* <DropdownMenuWithEditDeal dealIdentifier={dealIdentifier} />  */}
            </CardHeader>
            <CardContent className="grid gap-2 p-0 overflow-hidden">
                <div className="flex flex-col flex-grow overflow-auto">
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Project Manager :{" "}
                        {productIdWiseProductData.projectManager || "n/a"}
                    </span>
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Product Type : {productIdWiseProductData.productType || "n/a"}
                    </span>
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Product Description :{" "}
                        {productIdWiseProductData.productDescription ||
                            "n/a"}
                    </span>
                     <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Updated on : {productIdWiseProductData.updatedOn || "n/a"}
                    </span> 
                  
                   
                </div>
            </CardContent>
        </Card>
    )
}