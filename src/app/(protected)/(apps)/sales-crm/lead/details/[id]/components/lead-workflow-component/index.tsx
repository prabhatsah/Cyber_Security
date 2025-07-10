import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import LeadWorkflowComponent from "./LeadWorkflow";
import { LeadData } from "@/app/(protected)/(apps)/sales-crm/components/type";

export default async function LeadWorkflowLayout({ leadIdentifier }: { leadIdentifier: string }) {

    const leadsData = await getMyInstancesV2<LeadData>({
        processName: "Leads Pipeline",
        predefinedFilters: { taskName: "View State" },
        mongoWhereClause: `this.Data.leadIdentifier == "${leadIdentifier}"`,
        projections: ["Data.leadStatus"],
    });

    const leadStatus = leadsData[0].data.leadStatus;
    return (
        <Card className="h-1/2">
            <CardHeader className="flex flex-row justify-between items-center border-b">
                <CardTitle>Lead Workflow</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <LeadWorkflowComponent
                    leadIdentifier={leadIdentifier}
                    leadStatus={leadStatus}
                />
            </CardContent>
        </Card>
    )
}