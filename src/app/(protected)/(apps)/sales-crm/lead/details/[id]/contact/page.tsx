import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import LeadDataQuery from "../components/LeadDataQuery";
import ContactsDataComponent from "../components/ContactsDataComponent";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export default async function LeadContactTab({ params }: { params: { id: string }}) {
    const leadIdentifier = params?.id || "";
    
    const leadsContactData = await getMyInstancesV2({
        processName: "Contact",
        predefinedFilters: { taskName: "View Contact" },
        mongoWhereClause: `this.Data.leadIdentifier == "${leadIdentifier}"`,
    });
    
    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 5,
                    title: 'Contacts',
                    href: `/sales-crm/lead/details/${leadIdentifier}/contact`,
                }}
            />
           <ContactsDataComponent accountId={null} leadIdentifier={leadIdentifier} contactData={leadsContactData} source='Leads'/>
           </>

    );
}