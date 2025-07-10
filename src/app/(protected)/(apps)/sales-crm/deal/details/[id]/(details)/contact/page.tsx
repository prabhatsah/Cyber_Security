import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import ContactsDataComponent from "../components/ContactsDataComponent";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export default async function DealContactTab({ params }: { params: { id: string }}) {
    const dealIdentifier = params?.id || "";
    console.log("dealIdentifier------------------------",dealIdentifier);

    const dealData = await getMyInstancesV2<any>({
        processName: "Deal",
        predefinedFilters: { taskName: "View State" },
        mongoWhereClause: `this.Data.dealIdentifier == "${dealIdentifier}"`,
        projections: ["Data.accountIdentifier","Data.leadIdentifier"],
    });
    var data = dealData[0].data;
    console.log("data------------------------",data);
    const accountId = data.accountIdentifier || "";
    const leadidentifier = data.leadIdentifier; 

    let mongoWhereClause = "";
    if(leadidentifier == ''){
        mongoWhereClause = `this.Data.dealIdentifier=="${dealIdentifier}" || this.Data.accountIdentifier == "${accountId}"`;
    }else{
        if(accountId != ""){
            mongoWhereClause = `this.Data.leadIdentifier=="${leadidentifier}" || this.Data.dealIdentifier=="${dealIdentifier}" || this.Data.accountIdentifier == "${accountId}" `;
        }else{
            mongoWhereClause = `this.Data.leadIdentifier=="${leadidentifier}" || this.Data.dealIdentifier=="${dealIdentifier}" `;
        }
    }
    
    const dealContactData = await getMyInstancesV2<any>({
        processName: "Contact",
        predefinedFilters: { taskName: "View Contact" },
        mongoWhereClause: mongoWhereClause,
    });
    
    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 5,
                    title: 'Contacts',
                    href: `/sales-crm/deal/details/${dealIdentifier}/contact`,
                }}
            />
           <ContactsDataComponent accountId={accountId} dealIdentifier={dealIdentifier} contactData={dealContactData} source='Deals'/>
           </>

    );
}