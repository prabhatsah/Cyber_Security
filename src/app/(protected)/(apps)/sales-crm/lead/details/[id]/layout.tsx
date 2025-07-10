
import LeadDetailsComponent from "./components/lead-details-component";
import LeadWorkflowLayout from "./components/lead-workflow-component";
import TabComponentLeadDetails from "./components/tabComponent";
import EditLeadModalWrapper from "./components_edit_lead/lead_data_definition/EditLeadModalWrapper";

export default async function LeadLayout({ children, params }: { children: React.ReactNode, params: { id: string } }) {
    const leadIdentifier = params.id || "";
    console.log("identifier ", leadIdentifier);
    return (
        <div className="w-full h-full overflow-auto overflow-x-hidden" id="leadMainTemplateDiv">
            
            <div className="h-full flex flex-col lg:flex-row gap-3">
                <div className="w-full lg:w-1/4 h-full">
                    <div className="flex flex-col gap-3 h-full">
                        {await LeadDetailsComponent({ leadIdentifier: leadIdentifier })}
                        {await LeadWorkflowLayout({ leadIdentifier: leadIdentifier })}
                    </div>
                </div>
                <div className="w-full lg:w-3/4 h-full flex flex-col gap-3">
                    <div className="flex-1 flex flex-col overflow-hidden w-full h-full">
                        <TabComponentLeadDetails
                            leadIdentifier={leadIdentifier}
                        >
                            {children}
                        </TabComponentLeadDetails>
                    </div>
                </div>
            </div>
            <EditLeadModalWrapper leadIdentifier={leadIdentifier} />
        </div>
    )
}