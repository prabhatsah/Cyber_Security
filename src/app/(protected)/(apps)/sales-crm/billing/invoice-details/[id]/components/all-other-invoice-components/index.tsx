import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import AllInvoiceDataTable from "./all-other-invoice-datatable";
import { DealData, InvoiceData } from "@/app/(protected)/(apps)/sales-crm/components/type";
import { addMonths, format, parseISO, subDays } from "date-fns";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";


export default async function AllOtherInvComponent({invoiceIdentifier, dealDetails, dealIdWisePaymentDetails}:{invoiceIdentifier : string, dealDetails: DealData, dealIdWisePaymentDetails: { [key: string]: any }}) {

    const allInvoicesInstanceData : any[]= await getMyInstancesV2({
        processName: "Generate Invoice",
        predefinedFilters: {"taskName" : "View Invoice"},
        processVariableFilters: { "dealIdentifier": dealDetails.dealIdentifier },
        projections: ['Data.AEDNumber','Data.accountDetails','Data.accountId','Data.accountManagerEmail','Data.dealIdentifier','Data.defaultContact','Data.invoiceDate','Data.invoiceIdentifier','Data.invoiceNumber','Data.invoiceStatus','Data.mailCc','Data.mailTo','Data.pdfName','Data.productInitials','Data.remarks','Data.remarksForLostInv','Data.revenue','Data.subject','Data.type',"Data.BankName","Data.BranchName","Data.IBANCode","Data.PaidAmount","Data.PaymentDate","Data.PaymentMode","Data.AccountName"]
    })
    var allInvoiceDetails: {[key: string]: any}= {}
    for(var i=0 ; i<allInvoicesInstanceData.length ; i++){
        allInvoiceDetails[allInvoicesInstanceData[i].data.invoiceIdentifier] =  allInvoicesInstanceData[i].data;
    }
    console.log("dealIdWisePaymentDetails - ",dealIdWisePaymentDetails)
    //Added for all Invoice
    for(var invoiceId in allInvoiceDetails){
        var invoiceDate = allInvoiceDetails[invoiceId].invoiceDate ? allInvoiceDetails[invoiceId].invoiceDate : "" ;
        var dealIdentifier = allInvoiceDetails[invoiceId].dealIdentifier ? allInvoiceDetails[invoiceId].dealIdentifier : "" ;
        var billingValue = dealIdWisePaymentDetails[dealIdentifier].billingValue ? dealIdWisePaymentDetails[dealIdentifier].billingValue  : {};
        var actualRevenue = dealIdWisePaymentDetails[dealIdentifier].actualRevenueForInvoice ? dealIdWisePaymentDetails[dealIdentifier].actualRevenueForInvoice  : 0;
        var billingPercent = billingValue && billingValue[invoiceDate] ?  billingValue[invoiceDate] : 0 ;
        var invoicedAmount = billingPercent ?  (billingPercent * actualRevenue) / 100 : 0;
        allInvoiceDetails[invoiceId].revenue = invoicedAmount ;
        allInvoiceDetails[invoiceId].invoicedAmounts = invoicedAmount ;
    }
    console.log("allInvoiceDetails - ",allInvoiceDetails)
   // const allInvoiceData = Object.values(allInvoiceDetails)
   let otherInvoiceDetails: any[] = []		
   const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
   for (const invoiceIdentifier in allInvoiceDetails) {
    var thisDealData = {
        dealIdentifier: "",
        deal: "",
        accountName: "",
        accountManager: "",
        invoiceIdentifier: "",
        invoiceDates: "",
        receiptDates: "",
        invoicedAmounts: 0,
        timeStamps: "",
        invoiceStatus: "",
        productsType: "",
        invoiceNumber: ""
    };

    thisDealData.dealIdentifier = dealDetails.dealIdentifier || "";
    thisDealData.deal = dealDetails.dealName || ""; // Fix: Provide a default value

    thisDealData.accountName = dealDetails.accountDetails?.accountName || "n/a";
    thisDealData.accountManager = userIdWiseUserDetailsMap[dealDetails.accountDetails?.accountName || "n/a"]?.userName || "n/a";

    let invoiceDate = parseISO(allInvoiceDetails[invoiceIdentifier].invoiceDate);
    let paymentTerms = dealIdWisePaymentDetails[thisDealData.dealIdentifier]?.payment_Terms || 0;
    let receiptDateNotFormatted = addMonths(invoiceDate, paymentTerms);
    let receiptDate = subDays(receiptDateNotFormatted, 1);

    thisDealData.invoiceIdentifier = invoiceIdentifier;
    thisDealData.invoiceDates = allInvoiceDetails[invoiceIdentifier].invoiceDate;
    thisDealData.receiptDates = format(receiptDate, 'yyyy-MM-dd');
    thisDealData.invoicedAmounts = allInvoiceDetails[invoiceIdentifier].revenue || 0;
    thisDealData.timeStamps = format(invoiceDate, 'ddMMyyyy');

    thisDealData.invoiceStatus = allInvoiceDetails[invoiceIdentifier].invoiceStatus;
    thisDealData.productsType = allInvoiceDetails[invoiceIdentifier].productInitials;

    if (dealDetails.accountDetails) {
        thisDealData.invoiceNumber = 
            invoiceIdentifier.substr(0, 2) + "-" + 
            dealDetails.accountDetails.accountCode + "-" + 
            thisDealData.timeStamps + "-" + 
            allInvoiceDetails[invoiceIdentifier].productInitials;
    } else {
        thisDealData.invoiceNumber = 
            invoiceIdentifier.substr(0, 2) + "-" + 
            thisDealData.timeStamps + "-" + 
            allInvoiceDetails[invoiceIdentifier].productInitials;
    }

    otherInvoiceDetails.push(thisDealData);
}
console.log("otherInvoiceDetails" ,otherInvoiceDetails)
    
    return(
        <Card className="h-1 flex flex-col">
            <CardHeader className="flex flex-row justify-between items-center border-b">
               <CardTitle>All Invoices for {otherInvoiceDetails[0].dealName}</CardTitle> 
            </CardHeader>
            
            <CardContent>
                <AllInvoiceDataTable invoiceData={otherInvoiceDetails} />
            </CardContent>
        </Card>
    )
}