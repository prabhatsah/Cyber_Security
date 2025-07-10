
// import DealDetailsComponent from "./components/deal-details-component";
// import DealWorkflowLayout from "./components/deal-workflow-component";
// import TabComponentDealDetails from "./components/tabComponent";

import ProductDetailsComponent from "./components/product-details-component";
import ProductWorkflowLayout from "./components/product-workflow-componet";
import TabComponentProductDetails from "./components/tabComponent";

//import EditLeadModalWrapper from "./components_edit_lead/lead_data_definition/EditLeadModalWrapper";

export default async function ProductLayout({ children, params }: { children: React.ReactNode, params: { product_id: string ,id: string} }) {
    const productIdentifier = params.product_id || "";
    const dealIdentifier = params.id || "";
    console.log("identifier ", productIdentifier);
    console.log("dealIdentifier ", dealIdentifier);
    return (
        <div className="w-full h-full overflow-auto overflow-x-hidden" id="productMainTemplateDiv">
            
            <div className="h-full flex flex-col lg:flex-row gap-3">
                <div className="w-full lg:w-1/4 h-full">
                    <div className="flex flex-col gap-3 h-full">
                         {await ProductDetailsComponent({ productIdentifier: productIdentifier })}
                          {await ProductWorkflowLayout({ productIdentifier: productIdentifier })}   
                    </div>
                </div>
                <div className="w-full lg:w-3/4 h-full flex flex-col gap-3">
                    <div className="flex-1 flex flex-col overflow-hidden w-full h-full">
                        <TabComponentProductDetails
                            productIdentifier={productIdentifier}
                            dealIdentifier={dealIdentifier} 
                        >
                            {children}
                        </TabComponentProductDetails> 
                    </div>
                </div>
            </div>
            {/* <EditLeadModalWrapper dealIdentifier={dealIdentifier} /> */}
        </div>
    )
}