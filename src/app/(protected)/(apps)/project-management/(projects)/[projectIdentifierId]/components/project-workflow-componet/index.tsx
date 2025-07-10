import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import ProjectWorkflowComponent from "./ProjectWorkflow";

export default async function ProjectWorkflowLayout({ projectIdentifier }: { projectIdentifier: string }) {

    const productData = await getMyInstancesV2<any>({
        processName: "Product of Project",
        predefinedFilters: { taskName: "View State" },
        mongoWhereClause: `this.Data.projectIdentifier == "${projectIdentifier}"`,
        projections: ["Data.productStatus","Data.productIdentifier","Data.projectIdentifier"],
    });
    console.log("products", productData)
  
   const productStatus = productData[0].data.productStatus;
   const productIdentifier = productData[0].data.productIdentifier;

    return (
        <Card className="">
            <CardHeader className="flex flex-row justify-between items-center border-b">
                <CardTitle>Project Workflow</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                 <ProjectWorkflowComponent
                    productIdentifier={productIdentifier}
                    productStatus={productStatus}
                />  
            </CardContent>
        </Card>
    )
}