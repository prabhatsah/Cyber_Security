import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { Button } from "@/shadcn/ui/button";

import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { Plus } from "lucide-react";
import PricingComponent from "../components/pricing-component";
import { v4 } from "uuid";
import { id } from "date-fns/locale";


export default async function ProductPricingTab({ params }: { params: { product_id: string }}) {
    const productIdentifier = params?.product_id || "";
    
     const pricingInstanceData = await getMyInstancesV2<any>({
         processName: "Product",
         predefinedFilters: { taskName: "View State" },
         mongoWhereClause: `this.Data.productIdentifier == "${productIdentifier}"`,
         projections: ["Data.quotation","Data.resourceDataWithAllocation","Data.expenseDetails"],
     });
    console.log("pricingInstanceData",pricingInstanceData)
    const pricingData = pricingInstanceData[0].data.quotation ? pricingInstanceData[0].data.quotation : {};
    const resourceDataWithAllocation = pricingInstanceData[0].data.resourceDataWithAllocation ? pricingInstanceData[0].data.resourceDataWithAllocation : [];
    const expenseDetails = pricingInstanceData[0].data.expenseDetails ? pricingInstanceData[0].data.expenseDetails : {};
    var roleMap: { [key: string]: string } = {};
    for(let key in pricingData){
        roleMap[pricingData[key].role] = key;
    }
    for(let i = 0 ; i < resourceDataWithAllocation.length ; i++){
        var totalFTE = 0;
        for(let key in resourceDataWithAllocation[i].allocation){
            totalFTE += resourceDataWithAllocation[i].allocation[key];
        }
        if(roleMap[resourceDataWithAllocation[i].role]){
            pricingData[roleMap[resourceDataWithAllocation[i].role]]["totalFTE"] = totalFTE;
            pricingData[roleMap[resourceDataWithAllocation[i].role]]["billingAmount"] = (totalFTE * pricingData[roleMap[resourceDataWithAllocation[i].role]]["scr"]) + pricingData[roleMap[resourceDataWithAllocation[i].role]]["expenses"] + pricingData[roleMap[resourceDataWithAllocation[i].role]]["otherCosts"];
        }
        else{
            const roleId =  v4();
            pricingData[roleId] = {
                role: resourceDataWithAllocation[i].role,
                id: roleId,
                totalFTE: totalFTE,
                scr: 0,
                expenses: 0,
                otherCosts: 0,
                billingAmount: 0
            }
            roleMap[resourceDataWithAllocation[i].role] = roleId;
        }
    }
    var totalExpenses = 0
    for(let key in expenseDetails){
        totalExpenses += expenseDetails[key].cost * expenseDetails[key].quantity;
    }
    var totalFTESum = 0;
    for(let key in pricingData){
        totalFTESum += pricingData[key]["totalFTE"];
    }
    console.log("pricingData 1",pricingData)
    for(let key in pricingData){
        pricingData[key]["expenses"] = totalExpenses * (pricingData[key]["totalFTE"]/totalFTESum);
        pricingData[key]["billingAmount"] = (pricingData[key]["totalFTE"] * pricingData[key]["scr"]) + pricingData[key]["expenses"] + pricingData[key]["otherCosts"];
    }
    console.log("pricingData",pricingData)
    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 5,
                    title: 'Pricing',
                    href: `/pricing`,
                }}
            />
         <PricingComponent pricingData={pricingData} productIdentifier={productIdentifier}/>
           </>

    );
}