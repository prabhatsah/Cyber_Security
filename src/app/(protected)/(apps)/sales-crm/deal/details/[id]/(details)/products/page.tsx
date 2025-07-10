import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { differenceInMonths } from "date-fns";
import ProductsDataTable from "./productsDataTable";

export default async function DealProductTab({ params }: { params: { id: string } }) {
    let dealIdentifier = params?.id || "";
    
    const productInstanceData = await getMyInstancesV2<any>({
        processName: "Product",
        predefinedFilters: { taskName: "View State" },
        mongoWhereClause: `this.Data.dealIdentifier == "${dealIdentifier}"`,
        projections : ["Data.productIdentifier","Data.productType","Data.productDescription","Data.projectManager","Data.quotation","Data.productDescription","Data.quotationAmount"]
    })
    console.log("Product daat deal identifier ",dealIdentifier)
    console.log("Product daat ",productInstanceData)
    var productData = []
    for(let i=0;i<productInstanceData.length;i++){
        const productType = productInstanceData[i].data.productType
        productData.push(productInstanceData[i].data)
        if(productType!= "Professional Service" && productType != "User License" && productType != "Service Level Agrrement"){
           
            productData[i].actualRevenue = productData[i].quotationAmount
        }
        else{
            if(Object.keys(productInstanceData[i].data.quotation).length === 0){
                productData[i].actualRevenue = 0
            }
            for(let key in productInstanceData[i].data.quotation){
                if(productType === "Professional Service"){
                    const revenue = (((productInstanceData[i].data.quotation[key].scr ? productInstanceData[i].data.quotation[key].scr  : 0) * (productInstanceData[i].data.quotation[key].totalFTE ? productInstanceData[i].data.quotation[key].totalFTE : 0)) + (productInstanceData[i].data.quotation[key].expenses ? productInstanceData[i].data.quotation[key].expenses : 0) + (productInstanceData[i].data.quotation[key].otherCosts ? productInstanceData[i].data.quotation[key].otherCosts : 0)) 
                    productData[i].actualRevenue =  productData[i].actualRevenue ? productData[i].actualRevenue + revenue : revenue
                }
                else if(productType === "User License"){
                        var noOfPeriods = 0 ;
                        if(productInstanceData[i].data.quotation[key].billingCycle == "Monthly"){
                        noOfPeriods = 1 ;
                        }else if(productInstanceData[i].data.quotation[key].billingCycle == "Yearly"){
                        noOfPeriods = 12;
                        }else if(productInstanceData[i].data.quotation[key].billingCycle == "Quartely"){
                        noOfPeriods = 3;
                        }else{
                            const licenseStartDate = new Date(productInstanceData[i].data.quotation[key].licenseStartDate);
                            const licenseEndDate = new Date(productInstanceData[i].data.quotation[key].licenseEndDate);

                            noOfPeriods = Math.ceil(differenceInMonths(licenseEndDate, licenseStartDate));
                        }
                        const revenue = productInstanceData[i].data.quotation[key].noOfLicense * productInstanceData[i].data.quotation[key].costPerLicensePerMonth * noOfPeriods ;
                    // const revenue = (productInstanceData[i].data.quotation[key].unitPrice ? productInstanceData[i].data.quotation[key].unitPrice : 0) * (productInstanceData[i].data.quotation[key].quantity ? productInstanceData[i].data.quotation[key].quantity : 0)
                        productData[i].actualRevenue =  productData[i].actualRevenue ? productData[i].actualRevenue + revenue : revenue
                }
                else{
                    const revenue = productInstanceData[i].data.quotation[key].slaRevenue ? productInstanceData[i].data.quotation[key].slaRevenue : 0 ;
                    productData[i].actualRevenue =  productData[i].actualRevenue ? productData[i].actualRevenue + revenue : revenue
                }
            }
        }
    }
    console.log("productData",productData)
    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 5,
                    title: 'Products',
                    href: `/sales-crm/deal/details/${dealIdentifier}/products`,
                }}
            />
           <ProductsDataTable dealsProductData={productData} dealIdentifier={dealIdentifier}/>
        </>
    
    );
}