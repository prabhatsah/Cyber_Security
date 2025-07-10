import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import ResourceComponent from "../components/resource-component";
import { getUserIdWiseUserDetailsMap, getUserRoles } from "@/ikon/utils/actions/users";

export default async function ProductResourceTab({params,}: {params: { projectIdentifierId: string };}) {
  const projectIdentifier = params?.projectIdentifierId || "";
  const resourceInstanceData = await getMyInstancesV2<any>({
    processName: "Product of Project",
    predefinedFilters: { taskName: "View State" },
    mongoWhereClause: `this.Data.projectIdentifier == "${projectIdentifier}"`,
    projections: ["Data.resourceDataWithAllocation"],
  });
  const resourceData = resourceInstanceData[0].data.resourceDataWithAllocation;

  const userDetailsMap = await getUserIdWiseUserDetailsMap();
  const rolesMap = await getUserRoles();

  const userMaps = {
    "userDetailsMap": userDetailsMap,
    "rolesMap": rolesMap,
  }

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 5,
          title: "Resource",
          href: `/resource`,
        }}
      />
      <ResourceComponent resourceData={resourceData} projectIdentifier={projectIdentifier} userMaps={userMaps}/>
    </>
  );
}
