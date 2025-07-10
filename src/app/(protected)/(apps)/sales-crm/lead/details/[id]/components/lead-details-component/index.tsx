import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import DropdownMenuWithEditLead from "../../components_edit_lead/lead_data_definition/DropdownMenuWithEditLead";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { LeadData } from "@/app/(protected)/(apps)/sales-crm/components/type";

export default async function LeadDetailsComponent({ leadIdentifier }: { leadIdentifier: string }): Promise<ReactNode> {

    const leadsData = await getMyInstancesV2<LeadData>({
        processName: "Leads Pipeline",
        predefinedFilters: { taskName: "View State" },
        mongoWhereClause: `this.Data.leadIdentifier == "${leadIdentifier}"`,
        projections: ["Data.organisationDetails", "Data.salesManager", "Data.leadStatus", "Data.leadType"],
    });

    console.log("leadIdWiseLeadData", leadsData);
    const leadIdWiseLeadData = leadsData[0].data;

    return (

        <Card className="h-1/2 flex flex-col">
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 4,
                    title: leadIdWiseLeadData.organisationDetails.organisationName,
                    href: `/sales-crm/lead/details/${leadIdentifier}`,
                }}
            />
            <CardHeader className="flex flex-row justify-between items-center border-b">
                <CardTitle>Lead Details</CardTitle>

                <DropdownMenuWithEditLead leadIdentifier={leadIdentifier} />
            </CardHeader>
            <CardContent className="grid gap-2 p-0 overflow-hidden">
                <div className="flex flex-col flex-grow overflow-auto">
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Lead Name :{" "}
                        {leadIdWiseLeadData.organisationDetails.organisationName}
                    </span>
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Sales Manager : {leadIdWiseLeadData?.salesManager || "n/a"}
                    </span>
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Number of Employees :{" "}
                        {leadIdWiseLeadData.organisationDetails.noOfEmployees ||
                            "n/a"}
                    </span>
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Status : {leadIdWiseLeadData.leadStatus || "n/a"}
                    </span>
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Sector :{" "}
                        {leadIdWiseLeadData.organisationDetails.sector || "n/a"}
                    </span>
                    {/* <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Lead Type : {leadIdWiseLeadData.leadType || "n/a"}
                    </span> */}
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Contact Number :{" "}
                        {leadIdWiseLeadData.organisationDetails.orgContactNo ||
                            "n/a"}
                    </span>
                    <span className="flex gap-2 align-middle py-2 px-3">
                        Email :{" "}
                        {leadIdWiseLeadData.organisationDetails.email || "n/a"}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}