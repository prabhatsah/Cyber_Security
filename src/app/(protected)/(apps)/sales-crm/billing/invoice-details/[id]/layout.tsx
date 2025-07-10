import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import InvoiceCalculation from "../../component/invoice-calculation";
import { getFormattedAmountByUserPreference } from "../../../utils/Formated-Amount/getFormattedAmountByUserPreference";
import { WidgetProps } from "@/ikon/components/widgets/type";
import Widgets from "@/ikon/components/widgets";
import InvoiceDetailsComponent from "./components/invoice-details-components";
import { DealProductDetailsData, ProductDetailsData } from "../../../components/type";
import { addMonths, format, parseISO } from "date-fns";
import AllOtherInvComponent from "./components/all-other-invoice-components";
import InvoiceWorkflowLayout from "./components/invoice-workflow-components";
import { getUsersByGroupName } from "@/ikon/utils/actions/users";

export default async function InvoiceLayout({ children, params }: { children: React.ReactNode, params: { id: string } }) {
    const invoiceIdentifier = params.id || "";
    console.log("identifier ", invoiceIdentifier);
    // const {gridData} = await InvoiceCalculation();
    // const thisInvoiceData = gridData.find((inv)=> inv.invoiceIdentifier === invoiceIdentifier)
    const invoiceInstanceData = await getMyInstancesV2({
        processName: "Generate Invoice",
        predefinedFilters: { "taskName": "View Invoice" },
        processVariableFilters: { "invoiceIdentifier": invoiceIdentifier },
        projections: ['Data.AEDNumber', 'Data.accountDetails', 'Data.accountId', 'Data.accountManagerEmail', 'Data.dealIdentifier', 'Data.defaultContact', 'Data.invoiceDate', 'Data.invoiceIdentifier', 'Data.invoiceNumber', 'Data.invoiceStatus', 'Data.mailCc', 'Data.mailTo', 'Data.pdfName', 'Data.productInitials', 'Data.remarks', 'Data.remarksForLostInv', 'Data.revenue', 'Data.subject', 'Data.type', "Data.BankName", "Data.BranchName", "Data.IBANCode", "Data.PaidAmount", "Data.PaymentDate", "Data.PaymentMode", "Data.AccountName"]
    })
    const invoiceDetails = invoiceInstanceData.map((e: any) => e.data)[0];
    const dealInstanceData = await getMyInstancesV2({
        processName: "Deal",
        predefinedFilters: { "taskName": "View State" },
        processVariableFilters: { "dealIdentifier": invoiceDetails.dealIdentifier },
        projections: ["Data.accountDetails", "Data.dealName", "Data.dealNo", "Data.dealIdentifier"]
    });
    const dealDetails = dealInstanceData.map((e: any) => e.data)[0];
    const paymentConfigInstanceData = await getMyInstancesV2({
        processName: "Payment Configuration",
        predefinedFilters: { "taskName": "View Configuration Details" },

    })
    const paymentConfigData = paymentConfigInstanceData.map((e: any) => e.data);
    
    var dealIdWisePaymentDetails: { [key: string]: any } = {}
    for (var i = 0; i < paymentConfigData.length; i++) {
        dealIdWisePaymentDetails[paymentConfigData[i].dealIdentifier] = paymentConfigData[i]
    }
    

    var invoiceDate = invoiceDetails.invoiceDate ? invoiceDetails.invoiceDate : "";
    var dealIdentifier = invoiceDetails.dealIdentifier ? invoiceDetails.dealIdentifier : "";
    var billingValue = dealIdWisePaymentDetails[dealIdentifier].billingValue ? dealIdWisePaymentDetails[dealIdentifier].billingValue : {};
    var actualRevenue = dealIdWisePaymentDetails[dealIdentifier].actualRevenueForInvoice ? dealIdWisePaymentDetails[dealIdentifier].actualRevenueForInvoice : 0;
    var billingPercent = billingValue && billingValue[invoiceDate] ? billingValue[invoiceDate] : 0;
    var invoicedAmount = billingPercent ? (billingPercent * actualRevenue) / 100 : 0;

    invoiceDetails.totalBillingAmount = actualRevenue;
    invoiceDetails.revenue = invoicedAmount;
    invoiceDetails.invoicedAmounts = invoicedAmount;
    let invoicedAmmount = invoiceDetails && invoiceDetails.revenue ?  invoiceDetails.revenue : 0 ;
    let invoicedAmountFormatted = getFormattedAmountByUserPreference(invoicedAmmount, 2);
    let paidAmount = invoiceDetails && invoiceDetails.PaidAmount ?  invoiceDetails.PaidAmount : 0 ;
    let discountedAmount = invoiceDetails && invoiceDetails.DiscountedAmount ?  invoiceDetails.DiscountedAmount : 0 ;
    let dueAmmount = invoicedAmmount - parseFloat(paidAmount) - parseFloat(discountedAmount);
    let totalBillingAmount = invoiceDetails && invoiceDetails.totalBillingAmount ? invoiceDetails.totalBillingAmount : 0 ;
    let totalBillingAmountFormatted = getFormattedAmountByUserPreference(totalBillingAmount, 2)
    let outstandingAmount = totalBillingAmount - invoicedAmmount;
    let outstandingAmountFormatted = getFormattedAmountByUserPreference(outstandingAmount, 2);
   
    invoicedAmmount = invoicedAmmount;
    paidAmount = getFormattedAmountByUserPreference(paidAmount, 2);
    let dueAmount = getFormattedAmountByUserPreference(dueAmmount, 2);
    discountedAmount = getFormattedAmountByUserPreference(discountedAmount, 2);
    var productIdentifierWiseDataObject: {[key: string]: any} = {}
    const productInstanceData : any = await getMyInstancesV2({
        processName : "Product",
        predefinedFilters : {taskName: "View State"},
        processVariableFilters : {"dealIdentifier" : dealIdentifier}
    })
    for(var i = 0 ; i < productInstanceData.length ; i++){
        productIdentifierWiseDataObject[productInstanceData[i].data.productIdentifier] = productInstanceData[i].data;
    }
    var finalQuotationObj = productIdentifierWiseDataObject && Object.keys(productIdentifierWiseDataObject).length != 0 ? JSON.parse(JSON.stringify(productIdentifierWiseDataObject)) : {} ;
	console.log(finalQuotationObj)
    var dateObj = {
        "startDate" : "",
        "endDate" : ""
    }
    const calculateTaskEndDate = (
        startDate: string,
        duration: number
      ): string => {
        const taskStart = parseISO(startDate);
        const wholeMonths = Math.floor(duration);
        const fractionalMonths = duration % 1;
      
        let taskEnd = addMonths(taskStart, wholeMonths);
        taskEnd = new Date(
          taskEnd.setDate(taskEnd.getDate() + fractionalMonths * 30)
        );
      
        return format(taskEnd, "yyyy-MM-dd");
      };
    for(var pId in finalQuotationObj){
        var quotation = finalQuotationObj[pId].quotation ? finalQuotationObj[pId].quotation : {};
        finalQuotationObj[pId]["actualRevenue"] = 0;
        var startDateForPS = [];
        var endDateForPS = [];
        var startDateForUL = [];
        var endDateForUL = [];
        for(var key in quotation){
            if(finalQuotationObj[pId].productType == "Professional Service"){
                for(var i = 0; i < finalQuotationObj[pId]["scheduleData"]["task"].length; i++){
                    var startDate = finalQuotationObj[pId]["scheduleData"]["task"][i].taskStart;
                    var duration = finalQuotationObj[pId]["scheduleData"]["task"][i].taskDuration;
                    var endDate = calculateTaskEndDate(startDate, duration);
                    startDateForPS.push(format(new Date(startDate), 'yyyy-MM-dd'));
                    endDateForPS.push(format(new Date(endDate), 'yyyy-MM-dd'));
                }
            }
            else if(finalQuotationObj[pId].productType == "Service Level Agreement"){
            }
            else{
                var dateObject = {}
                if(quotation[key].billingCycle == "Custom"){
                    dateObject = {
                        sdate : quotation[key].licenseStartDate,
                        edate : quotation[key].licenseEndDate
                    }
                }
                startDateForUL.push(quotation[key].licenseStartDate)
                endDateForUL.push(quotation[key].licenseEndDate)
            }
        }

        let allStartDate: string[] = [];
        let allEndDate: string[] = [];
        
        if (finalQuotationObj[pId].productType === "Professional Service") {
            allStartDate = startDateForPS;
            allEndDate = endDateForPS;
        } else {
            allStartDate = startDateForUL;
            allEndDate = endDateForUL;
        }
        var SortStartDate = allStartDate.sort((a, b) => {
            return new Date(a).getTime() - new Date(b).getTime();
        });
        
        var SortEndDate = allEndDate.sort((a, b) => {
            return new Date(b).getTime() - new Date(a).getTime(); // Sorting in descending order
        });


        var minStartDate = SortStartDate[0];
        var maxEndDate = SortEndDate[0]
        if(dateObj["startDate"] == ""){
            dateObj["startDate"] = minStartDate
        }
        else{
            if(minStartDate < dateObj["startDate"]){
                dateObj["startDate"] = minStartDate
            }
        }
        if(dateObj["endDate"] == ""){
            dateObj["endDate"] = maxEndDate
        }
        else{
            if(maxEndDate > dateObj["endDate"]){
                dateObj["endDate"] = maxEndDate
            }
        }
        // 				finalQuotationObj[pId]["contractedStartDate"] = moment(minStartDate).format("DD-MM-YYYY");
        // 				finalQuotationObj[pId]["contractedEndDate"] = moment(maxEndDate).format("DD-MM-YYYY");
    }
    console.log(dateObj)
    const users = await getUsersByGroupName("Account Manager")
    console.log("users - ", users)
    var userEmails: { label: string ; value: string ; }[] = [];
    for (var key in users.users) {
        userEmails.push({
            label: users.users[key].userEmail ?? '' ,
            value: users.users[key].userEmail ?? ''
        })
    }
    console.log("userEmails - ", userEmails)

    //const productDetails = productInstanceData.map((e: any) => e.data)

    const WidgetData: WidgetProps[] = [
        {
          id: "totalBillingAmount",
          widgetText: "Total Billing Amount",
          widgetNumber: "USD " + totalBillingAmountFormatted,
          iconName: "banknote" as const,
        },
        {
          id: "invoicedAmmount",
          widgetText: "Total Invoiced Amount",
          widgetNumber: "USD " + invoicedAmountFormatted,
          iconName: "banknote" as const,
        },
        {
          id: "outstandingAmount",
          widgetText: "Outstanding Amount",
          widgetNumber: "USD " + outstandingAmountFormatted,
          iconName: "banknote" as const,
        },
        {
            id: "discountedAmount",
            widgetText: "Discounted Amount",
            widgetNumber: "USD " + discountedAmount,
            iconName: "banknote" as const,
        },
        {
            id: "dueAmount",
            widgetText: "Due Amount",
            widgetNumber: "USD " + dueAmount,
            iconName: "banknote" as const,
        },
        {
            id: "paidAmount",
            widgetText: "Paid Amount",
            widgetNumber: "USD " + paidAmount,
            iconName: "banknote" as const,
        },
    
      ];


    return (
        <div className="w-full h-full overflow-auto overflow-x-hidden" id="invoiceMainTemplateDiv">
            <Widgets widgetData={WidgetData}/>
            <div className="h-full flex flex-col lg:flex-row gap-3 mt-2">
                <div className="w-full lg:w-1/4 h-full">
                    <div className="flex flex-col gap-3 h-full">
                        
                     {await InvoiceDetailsComponent({ invoiceIdentifier : invoiceIdentifier, dateObj: dateObj})}
                     {await InvoiceWorkflowLayout({ invoiceIdentifier: invoiceIdentifier, userEmails: userEmails })}  
                    </div>
                </div>
                <div className="w-full lg:w-3/4 h-full flex flex-col gap-3">
                    <div className="flex-1 flex flex-col overflow-hidden w-full h-full">
                        {/* <TabComponentLeadDetails
                            leadIdentifier={leadIdentifier}
                        >
                            {children}
                        </TabComponentLeadDetails> */}
                        {await AllOtherInvComponent({ invoiceIdentifier : invoiceIdentifier,  dealDetails: dealDetails, dealIdWisePaymentDetails: dealIdWisePaymentDetails})}
                    </div>
                </div>
            </div>
            {/* <EditLeadModalWrapper leadIdentifier={leadIdentifier} /> */}
        </div>
    )
}