
import DealDetailsComponent from "./components/deal-details-component";
import DealWorkflowLayout from "./components/deal-workflow-component";
import TabComponentDealDetails from "./components/tabComponent";

//import EditLeadModalWrapper from "./components_edit_lead/lead_data_definition/EditLeadModalWrapper";

export default async function DealLayout({ children, params }: { children: React.ReactNode, params: { id: string } }) {
    const dealIdentifier = params.id || "";
    console.log("identifier ", dealIdentifier);
    return (
        <div className="w-full h-full overflow-auto overflow-x-hidden" id="dealMainTemplateDiv">
            
            <div className="h-full flex flex-col lg:flex-row gap-3">
                <div className="w-full lg:w-1/4 h-full">
                    <div className="flex flex-col gap-3 h-full">
                        {await DealDetailsComponent({ dealIdentifier: dealIdentifier })}
                         {await DealWorkflowLayout({ dealIdentifier: dealIdentifier })} 
                    </div>
                </div>
                <div className="w-full lg:w-3/4 h-full flex flex-col gap-3">
                    <div className="flex-1 flex flex-col overflow-hidden w-full h-full">
                        <TabComponentDealDetails
                            dealIdentifier={dealIdentifier}
                        >
                            {children}
                        </TabComponentDealDetails>
                    </div>
                </div>
            </div>
            {/* <EditLeadModalWrapper dealIdentifier={dealIdentifier} /> */}
        </div>
    )
}