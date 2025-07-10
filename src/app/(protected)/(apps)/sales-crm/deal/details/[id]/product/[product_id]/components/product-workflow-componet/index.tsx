import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import ProductWorkflowComponent from "./ProductWorkflow";


export default async function ProductWorkflowLayout({ productIdentifier }: { productIdentifier: string }) {

   
    const productData = await getMyInstancesV2<any>({
        processName: "Product",
        predefinedFilters: { taskName: "View State" },
        mongoWhereClause: `this.Data.productIdentifier == "${productIdentifier}"`,
        projections: ["Data.productStatus","Data.productIdentifier","Data.productType"],
    });
    console.log("products", productData)
    
   const productType = productData[0].data.productType;
   const productStatus = productData[0].data.productStatus;

 
    return (
        <Card className="h-1/2">
            <CardHeader className="flex flex-row justify-between items-center border-b">
                <CardTitle>Product Workflow</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                 <ProductWorkflowComponent
                    productIdentifier={productIdentifier}
                    productStatus={productStatus}
                    productType={productType}
                />  
            </CardContent>
        </Card>
    )
}