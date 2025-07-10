import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
//import LeadWorkflowComponent from "./LeadWorkflow";
import { DealData } from "@/app/(protected)/(apps)/sales-crm/components/type";
import DealWorkflowComponent from "./DealWorkflow";

export default async function DealWorkflowLayout({ dealIdentifier }: { dealIdentifier: string }) {

    const dealData = await getMyInstancesV2<DealData>({
        processName: "Deal",
        predefinedFilters: { taskName: "View State" },
        mongoWhereClause: `this.Data.dealIdentifier == "${dealIdentifier}"`,
        projections: ["Data.dealStatus"],
    });
    const productData = await getMyInstancesV2<any>({
        processName: "Product",
        predefinedFilters: { taskName: "View State" },
        mongoWhereClause: `this.Data.dealIdentifier == "${dealIdentifier}"`,
        projections: ["Data.productStatus"],
    });
    console.log("products", productData)
    var allProductsCompleteFlag = true;
    for(let i = 0 ; i < productData.length ; i++){
        if(productData[i].data.prooductStatus != "Proceed from Quotation to Closed State"){
            allProductsCompleteFlag = false;
            break;
        }
    }

  //  const productStatus = productData[0].data.productStatus || "Product Created"

    const dealStatus = dealData[0].data.dealStatus || "Deal Created";
    return (
        <Card className="h-1/2">
            <CardHeader className="flex flex-row justify-between items-center border-b">
                <CardTitle>Deal Workflow</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <DealWorkflowComponent
                    dealIdentifier={dealIdentifier}
                    dealStatus={dealStatus}
                    allProductsCompleteFlag={allProductsCompleteFlag}
                /> 
            </CardContent>
        </Card>
    )
}