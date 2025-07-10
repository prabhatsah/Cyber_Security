import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { InvoiceData } from "../../../components/type";
import { addMonths, format, parseISO, subDays } from "date-fns";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";

export default async function InvoiceCalculation() {
    const accountInstanceData = await getMyInstancesV2({
        processName: "Account",
        predefinedFilters: { taskName: "View Account" }
      });
      const accountData = accountInstanceData.map((e: any) => e.data);
      const accountIdWiseAccountMap: { [key: string]: any } = {};
      for (var i = 0; i < accountData.length; i++) {
        accountIdWiseAccountMap[accountData[i].accountIdentifier] = accountData[i];
      }
      const contactInstanceData = await getMyInstancesV2({
        processName: "Contact",
        predefinedFilters: { taskName: "View Contact" }
      });
      const contactData = contactInstanceData.map((e: any) => e.data);
      var allContactsData: { [key: string]: any } = {};
      var accountIdWiseContactDetails: { [key: string]: any[] } = {};
      for (var i = 0; i < contactData.length; i++) {
        let accId = contactData[i].accountIdentifier ? contactData[i].accountIdentifier : "";
        let isAccountDefault = false;
        if (!accountIdWiseContactDetails[accId]) {
          accountIdWiseContactDetails[accId] = [];
        }
        if (contactData[i].source === "Account") {
          if (contactData[i].isDefault) {
            accountIdWiseContactDetails[accId].push(contactData[i]);
            isAccountDefault = true;
          }
        }
        else {
          if (!isAccountDefault) {
            accountIdWiseContactDetails[accId].push(contactData[i]);
          }
        }
        allContactsData[contactData[i].contactIdentifier] = contactData[i];
      }
      console.log('accountIdWiseContactDetails', accountIdWiseContactDetails)
      const invoiceInstanceData = await getMyInstancesV2({
        processName: "Generate Invoice",
        predefinedFilters: { taskName: "View Invoice" },
        projections: ['Data.AEDNumber', 'Data.accountDetails', 'Data.accountId', 'Data.accountManagerEmail', 'Data.dealIdentifier', 'Data.defaultContact', 'Data.invoiceDate', 'Data.invoiceIdentifier', 'Data.invoiceNumber', 'Data.invoiceStatus', 'Data.mailCc', 'Data.mailTo', 'Data.pdfName', 'Data.productInitials', 'Data.remarks', 'Data.remarksForLostInv', 'Data.revenue', 'Data.subject', 'Data.type'],
      });
      const invoiceData_ = invoiceInstanceData.map((e: any) => e.data);
      console.log('invoiceData_', invoiceData_)
    
    
      let invoiceData: InvoiceData[] = [];
      for (var k in invoiceData_) {
        var KerossDefaultContact = invoiceData_[k] && invoiceData_[k].defaultContact == "240fd8d8-f1cc-479f-bef6-4e32ddc81df2" ? true : false;
        if (KerossDefaultContact) {
          continue;
        } else {
          invoiceData.push(invoiceData_[k]);
        }
      }
      console.log('invoiceData', invoiceData)
      var dealIdfromInvoice: { [key: string]: string } = {};
      var invoiceDateDealIdwise: { [key: string]: string } = {};
      var dealSpecificContact: { [key: string]: any } = {};
      var invoiceStatus: { [key: string]: string } = {};
      var dealIdentifierWiseInvoiceId: { [key: string]: any } = {};
      var invoiceDetails: { [key: string]: any } = {};
      let invoiceStatusPaidorUnpaid: { [key: string]: number } = { paid: 0, unpaid: 0 };
    
      for (let i = 0; i < invoiceData.length; i++) {
        dealIdfromInvoice[invoiceData[i].invoiceIdentifier] = invoiceData[i].dealIdentifier;
        invoiceDateDealIdwise[invoiceData[i].invoiceIdentifier] = invoiceData[i].invoiceDate;
        dealSpecificContact[invoiceData[i].dealIdentifier] = allContactsData[invoiceData[i].defaultContact];
        invoiceStatus[invoiceData[i].dealIdentifier] = invoiceData[i].invoiceStatus;
        dealIdentifierWiseInvoiceId[invoiceData[i].dealIdentifier] = {
          "invoiceIdentifier": invoiceData[i].invoiceIdentifier,
          "paymentTerm" : invoiceData[i].PaymentTerm,
          "invoiceDate": invoiceData[i].invoiceDate,
          "productInitials": invoiceData[i].productInitials
        }
        invoiceDetails[invoiceData[i].invoiceIdentifier] = invoiceData[i];
        if ((invoiceData[i].invoiceStatus == "paid" || invoiceData[i].invoiceStatus == "Paid")) {
          invoiceStatusPaidorUnpaid["paid"];
          //$("#noOfPaidInvoice").text(invoiceStatusPaidorUnpaid["paid"])
        }
        if ((invoiceData[i].invoiceStatus == "unpaid" || invoiceData[i].invoiceStatus == "Unpaid")) {
          ++invoiceStatusPaidorUnpaid["unpaid"]
          //$("#nofOfPendingInvoice").text(invoiceStatusPaidorUnpaid["unpaid"])
        }
    
      }
    
      const paymentConfigInstanceData = await getMyInstancesV2({
        processName: "Payment Configuration",
        predefinedFilters: { taskName: "View Configuration Details" }
      });
      var dealIdWisePaymentDetails: { [key: string]: any } = {};
      const paymentConfigData = paymentConfigInstanceData.map((e: any) => e.data);
      console.log('paymentConfigData', paymentConfigData)
      for (var i = 0; i < paymentConfigData.length; i++) {
        dealIdWisePaymentDetails[paymentConfigData[i].dealIdentifier] = paymentConfigData[i];
      }
      console.log('dealIdWisePaymentDetails', dealIdWisePaymentDetails)
      for (var invoiceId in invoiceDetails) {
        var invoiceDate = invoiceDetails[invoiceId].invoiceDate ? invoiceDetails[invoiceId].invoiceDate : "";
        var dealIdentifier = invoiceDetails[invoiceId].dealIdentifier ? invoiceDetails[invoiceId].dealIdentifier : "";
        var billingValue = dealIdWisePaymentDetails[dealIdentifier].billingValue ? dealIdWisePaymentDetails[dealIdentifier].billingValue : {};
        var actualRevenue = dealIdWisePaymentDetails[dealIdentifier].actualRevenueForInvoice ? dealIdWisePaymentDetails[dealIdentifier].actualRevenueForInvoice : 0;
        var billingPercent = billingValue && billingValue[invoiceDate] ? billingValue[invoiceDate] : 0;
        var invoicedAmount = billingPercent ? (billingPercent * actualRevenue) / 100 : 0;
        invoiceDetails[invoiceId].revenue = invoicedAmount;
        invoiceDetails[invoiceId].invoicedAmounts = invoicedAmount;
      }
      const dealInstanceData = await getMyInstancesV2({
        processName: "Deal",
        predefinedFilters: { taskName: "View State" },
      });
      const dealsData = dealInstanceData.map((e: any) => e.data);
      console.log('dealsData', dealsData)
      const dealIdWiseDealData: { [key: string]: any } = {};
      for (let i = 0; i < dealsData.length; i++) {
        dealIdWiseDealData[dealsData[i].dealIdentifier] = dealsData[i];
      }
      var dealIdWiseDealNameMap: { [key: string]: string } = {};
      for (var i = 0; i < dealsData.length; i++) {
        dealIdWiseDealNameMap[dealsData[i].dealIdentifier] = dealsData[i].dealName;
      }
      var allDealsData: any[] = [];
      for (var invoiceIdentifier in invoiceDetails) {
        var thisDealData = { ...dealIdWiseDealData[invoiceDetails[invoiceIdentifier].dealIdentifier] };
        // var receiptDatenotFormatted = moment(invoiceDetails[invoiceIdentifier].invoiceDate).add(dealIdWisePaymentDetails[invoiceDetails[invoiceIdentifier].dealIdentifier].payment_Terms,'months')
        // var receiptDate = receiptDatenotFormatted.subtract(1, "days");
        // receiptDate = receiptDate.format("YYYY-MM-DD");
        const invoiceDate = parseISO(invoiceDetails[invoiceIdentifier].invoiceDate);
        const paymentTerms = dealIdWisePaymentDetails[invoiceDetails[invoiceIdentifier].dealIdentifier].payment_Terms;
    
        let receiptDateNotFormatted = addMonths(invoiceDate, paymentTerms);
       
        let receiptDate = subDays(receiptDateNotFormatted, 1);
        
        let formattedReceiptDate = format(receiptDate, 'yyyy-MM-dd');
        
        thisDealData.accountDetails.accountName = (thisDealData && thisDealData.accountDetails && thisDealData.accountDetails.accountIdentifier) ? (accountIdWiseAccountMap[thisDealData.accountDetails.accountIdentifier]?.accountName ?? "n/a") : (thisDealData.accountDetails && thisDealData.accountDetails.accountName) ? thisDealData.accountDetails.accountName : "n/a";
        thisDealData.invoiceIdentifier = invoiceIdentifier
        thisDealData.invoiceDates = invoiceDetails[invoiceIdentifier].invoiceDate;
        thisDealData.invoicedAmounts = invoiceDetails[invoiceIdentifier].invoicedAmounts;
        thisDealData.receiptDates = formattedReceiptDate;
        thisDealData.timeStamps = format(parseISO(invoiceDetails[invoiceIdentifier].invoiceDate), 'ddMMyyyy');
        thisDealData.invoiceStatus01 = invoiceDetails[invoiceIdentifier].invoiceStatus
        allDealsData.push(thisDealData);
      }
      for(let i = 0; i < allDealsData.length; i++){
        let dealProductTypeArr = [];
        for(var key in allDealsData[i].productDetails){
    
          let currentType = allDealsData[i].productDetails[key].productType;
          dealProductTypeArr.push(currentType);
        }
        var dealProductTypeSet = new Set(dealProductTypeArr);
        var productsType = [...dealProductTypeSet]
    
        allDealsData[i].productsType = productsType;
    
    
        for(var j in dealSpecificContact)
        {
          if(allDealsData[i].dealIdentifier == j){
            allDealsData[i].contactForDeal = dealSpecificContact[j]
          }
          if(allDealsData[i].dealIdentifier == j){
            allDealsData[i].invoiceStatus = invoiceStatus[j]	
          }
    
        }
        var invoiceDate = dealIdentifierWiseInvoiceId[allDealsData[i].dealIdentifier] ? dealIdentifierWiseInvoiceId[allDealsData[i].dealIdentifier].invoiceDate : "" ;
        var paymentTerm = dealIdentifierWiseInvoiceId[allDealsData[i].dealIdentifier] ? dealIdentifierWiseInvoiceId[allDealsData[i].dealIdentifier].paymentTerm : 0; 
    //    const receiptDate = format(addMonths(parseISO(invoiceDate), paymentTerm), 'yyyy-MM-dd');
    
      }
      const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
      var gridData = [];
      var invoiceIdWiseDueDate : { [key: string]: any } = {};
      for(var i=0; i <allDealsData.length ; i++){
        var obj: InvoiceData = {
          dealIdentifier: "",
          defaultContact: "",
          invoiceDate: "",
          invoiceIdentifier: "",
          invoiceStatus: "",
          revenue: "",
          invoiceNumber: "",
          accountName: "",
          accountId: "",
          accountManager: "",
          accountManagerEmail: "",
          client: "",
          deal: "",
          invoicedAmounts: "",
          invoiceDates: "",
          receiptDates: "",
          invoiceStatus01: "",
          productsType: [],
          contactForDeal: {},
          PaymentTerm: "",
          productInitials: "",
    
          // Add other properties from InvoiceData type as needed
        };
        if(invoiceDetails[allDealsData[i]["invoiceIdentifier"]]["accountDetails"]){
          if(invoiceDetails[allDealsData[i]["invoiceIdentifier"]]["accountDetails"]["accountCode"]){
            obj["invoiceNumber"] = allDealsData[i]["invoiceIdentifier"].substr(0,2) + "-" + invoiceDetails[allDealsData[i]["invoiceIdentifier"]]["accountDetails"]["accountCode"] + "-" + allDealsData[i]["timeStamps"] + "-" + invoiceDetails[allDealsData[i]["invoiceIdentifier"]].productInitials;
    
          }
          else{
            obj["invoiceNumber"] = allDealsData[i]["invoiceIdentifier"].substr(0,2) + "-" + allDealsData[i]["timeStamps"] + "-" + invoiceDetails[allDealsData[i]["invoiceIdentifier"]].productInitials
          }
          obj["accountName"] = invoiceDetails[allDealsData[i]["invoiceIdentifier"]]["accountDetails"]["accountName"];
          obj["accountId"] = invoiceDetails[allDealsData[i]["invoiceIdentifier"]]["accountDetails"]["accountIdentifier"];
          obj["accountManager"] = userIdWiseUserDetailsMap[invoiceDetails[allDealsData[i]["invoiceIdentifier"]]["accountDetails"].accountManager] ? userIdWiseUserDetailsMap[invoiceDetails[allDealsData[i]["invoiceIdentifier"]]["accountDetails"].accountManager].userName : "n/a" 
    
        }
        else{
          if(allDealsData[i]["accountDetails"]["accountCode"]){
            obj["invoiceNumber"] = allDealsData[i]["invoiceIdentifier"].substr(0,2) + "-" + allDealsData[i]["accountDetails"]["accountCode"] + "-" + allDealsData[i]["timeStamps"] + "-" + invoiceDetails[allDealsData[i]["invoiceIdentifier"]].productInitials
          }
          else{
            obj["invoiceNumber"] = allDealsData[i]["invoiceIdentifier"].substr(0,2) + "-" + allDealsData[i]["timeStamps"] + "-" + invoiceDetails[allDealsData[i]["invoiceIdentifier"]].productInitials
          }
          obj["accountName"] = allDealsData[i]["accountDetails"]["accountName"];
          obj["accountId"] = allDealsData[i]["accountDetails"]["accountIdentifier"];
          obj["accountManager"] = userIdWiseUserDetailsMap[allDealsData[i]["accountDetails"]["accountManager"]].userName ? userIdWiseUserDetailsMap[allDealsData[i]["accountDetails"]["accountManager"]].userName : "n/a" 
        }
        obj["client"] = (allDealsData[i]["contactForDeal"] ? allDealsData[i]["contactForDeal"]["firstName"] : "") + " " + (allDealsData[i]["contactForDeal"] ? allDealsData[i]["contactForDeal"]["lastName"] : 
                                                                       (accountIdWiseContactDetails[obj["accountId"]] ? (accountIdWiseContactDetails[obj["accountId"]][0]["firstName"] + ' ' + accountIdWiseContactDetails[obj["accountId"]][0]["lastName"] ) : ""));
        if(allDealsData[i]["dealNo"]){
          obj["deal"] = allDealsData[i]["dealName"] +"[" + allDealsData[i]["dealNo"] + "]"
        }
        else{
          obj["deal"] = allDealsData[i]["dealName"]
        }
        obj["invoicedAmounts"] = allDealsData[i]["invoicedAmounts"]
        const formatDate = (dateString: string | null): string => {
          return !dateString || dateString.toLowerCase() === "n/a" ? "" : format(parseISO(dateString), "dd-MMM-yyyy");
        };
        
        obj["invoiceDates"] = formatDate(allDealsData[i]["invoiceDates"]);
      //  console.log('allDealsData[i]["receiptDates"]', allDealsData[i]["receiptDates"])
        obj["receiptDates"] = formatDate(allDealsData[i]["receiptDates"]);
       // obj["invoiceDates"] = allDealsData[i]["invoiceDates"] == "" || allDealsData[i]["invoiceDates"] == "n/a" ? null : moment(new Date(allDealsData[i]["invoiceDates"])).format("DD-MMM-YYYY");  
       // obj["receiptDates"] = allDealsData[i]["receiptDates"] == "" || allDealsData[i]["receiptDates"] == "n/a" ? null : moment(new Date(allDealsData[i]["receiptDates"])).format("DD-MMM-YYYY");  
        obj["invoiceStatus"] = allDealsData[i]["invoiceStatus01"]
        obj["dealIdentifier"] = allDealsData[i]["dealIdentifier"];
        obj["invoiceIdentifier"] = allDealsData[i]["invoiceIdentifier"];
        //invoiceIdWiseDueDate[allDealsData[i]["invoiceIdentifier"]] = formatDate(allDealsData[i]["receiptDates"]);
        //invoiceIdWiseDueDate[allDealsData[i]["invoiceIdentifier"]] = allDealsData[i]["receiptDates"] == "" || allDealsData[i]["receiptDates"] == "n/a" ? null : moment(new Date(allDealsData[i]["receiptDates"])).format("DD-MMM-YYYY");  
        if(obj["accountName"] != "Keross Holding"){
          gridData.push(obj)
        }
      }
      return {gridData, allDealsData, dealIdWisePaymentDetails};
}