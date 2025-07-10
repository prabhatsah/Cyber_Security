import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import ResourceComponent from "../components/resource-component";

export default async function ProductResourceTab({params,}: {params: { product_id: string };}) {
  const productIdentifier = params?.product_id || "";
  
  const resourceInstanceData = await getMyInstancesV2<any>({
    processName: "Product",
    predefinedFilters: { taskName: "View State" },
    mongoWhereClause: `this.Data.productIdentifier == "${productIdentifier}"`,
    projections: ["Data.resourceDataWithAllocation"],
  });
  console.log('resourceInstanceData ------- ',resourceInstanceData)
  const resourceData = resourceInstanceData[0].data.resourceDataWithAllocation;
  console.log("resourceData --------- ",resourceData)

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 5,
          title: "Resource",
          href: `/resource`,
        }}
      />
      <ResourceComponent resourceData={resourceData || []} productIdentifier={productIdentifier}/>
    </>
  );
}
