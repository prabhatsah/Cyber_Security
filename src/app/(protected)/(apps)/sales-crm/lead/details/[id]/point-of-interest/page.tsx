import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import POIDataTable from "./poiDataTable";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export default async function POIPage({ params }: { params: { id: string } }) {
    const leadIdentifier = params?.id || "";
    const leadsData = await getMyInstancesV2({
        processName: "Leads Pipeline",
        predefinedFilters: { taskName: "View State" },
        mongoWhereClause: `this.Data.leadIdentifier == "${leadIdentifier}"`,
        projections: ["Data.commentsLog"],
    });

    const poiData = leadsData[0]?.data.commentsLog || [];
    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 5,
                    title: 'Point of Interest',
                    href: `/sales-crm/lead/details/${leadIdentifier}/point-of-interest`,
                }}
            />
            <POIDataTable poiData={poiData} />
        </>

    )
}