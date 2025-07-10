import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { DOWNLOAD_URL } from "@/ikon/utils/config/urls";
import { calculateFxRate } from "../../../utils/Fx-Rate/calculateFxRate";
import { addMonths, format, isAfter, isBefore, isEqual, parse, parseISO, subDays } from "date-fns";
import { getTotalBillingAmountForUserLicense } from "../../../utils/TotalBillingAmountForUserLicense/getTotalBillingAmountForUserLicense";
//import { calculateTaskEndDate } from "@/app/(protected)/(apps)/project-management/(projects)/[projectIdentifierId]/components/schedule-data-component/schedule_form_component/schedule_form_definition/ScheduleFormFunctionality";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { getFormattedAmountByUserPreference } from "../../../utils/Formated-Amount/getFormattedAmountByUserPreference";
import { getTotalBillingAmountForPS } from "../../../utils/TotalBillingAmountForPS/getTotalBillingAmountForPS";
import { getDiscountedAmountForDeal } from "../../../utils/DiscountedAmountForDeal/getDiscountedAmountForDeal";
import { getRevisedAmountForDeal } from "../../../utils/RevisedAmountForDeal/getRevisedAmountForDeal";
import { getFinalBillingAmountIncludingVATRate } from "../../../utils/FinalBillingAmountIncludingVATRate/getFinalBillingAmountIncludingVATRate";
import { calculateTaskEndDate } from "@/ikon/utils/actions/taskCalc";

export default async function ViewInvoiceCalc({ invoiceIdentifier }: { invoiceIdentifier: string }) {

    const invoiceInstanceData = await getMyInstancesV2({
        processName: "Generate Invoice",
        predefinedFilters: { "taskName": "View Invoice" },
        processVariableFilters: { "invoiceIdentifier": invoiceIdentifier },
        projections: ['Data.AEDNumber', 'Data.accountDetails', 'Data.accountId', 'Data.accountManagerEmail', 'Data.dealIdentifier', 'Data.defaultContact', 'Data.invoiceDate', 'Data.invoiceIdentifier', 'Data.invoiceNumber', 'Data.invoiceStatus', 'Data.mailCc', 'Data.mailTo', 'Data.pdfName', 'Data.productInitials', 'Data.remarks', 'Data.remarksForLostInv', 'Data.revenue', 'Data.subject', 'Data.type', "Data.BankName", "Data.BranchName", "Data.IBANCode", "Data.PaidAmount", "Data.PaymentDate", "Data.PaymentMode", "Data.AccountName"]
    })
    const invoiceDetails = invoiceInstanceData.map((e: any) => e.data)[0];

    const addressInstanceData: any = await getMyInstancesV2({
        processName: "Address Information",
        predefinedFilters: { taskName: "Edit Address Info" }
    })
    console.log("addressInstanceData", addressInstanceData)
    //const AddressInfo = addressInstanceData.map((e: any) => e.data)[0].addressInfo;
    var AddressInfo = addressInstanceData[0].data.addressInfo
    const dealInstanceData = await getMyInstancesV2({
        processName: "Deal",
        predefinedFilters: { "taskName": "View State" },
        processVariableFilters: { "dealIdentifier": invoiceDetails.dealIdentifier },
        projections: ["Data.accountDetails", "Data.dealName", "Data.dealNo", "Data.dealIdentifier"]
    });
    const dealData = dealInstanceData.map((e: any) => e.data)[0];
    if (invoiceDetails["accountDetails"]) {
        var accountName = (invoiceDetails && invoiceDetails.accountDetails && invoiceDetails.accountDetails.accountName) ? invoiceDetails.accountDetails.accountName : "n/a";
        var accountManager = (invoiceDetails && invoiceDetails.accountDetails && invoiceDetails.accountDetails.accountManager) ? invoiceDetails.accountDetails.accountManager : "n/a";
        var accountCode = (invoiceDetails && invoiceDetails.accountDetails && invoiceDetails.accountDetails.accountCode) ? invoiceDetails.accountDetails.accountCode : "n/a";
    }
    else {
        var accountName = (dealData && dealData.accountDetails && dealData.accountDetails.accountName) ? dealData.accountDetails.accountName : "n/a";
        var accountManager = (dealData && dealData.accountDetails && dealData.accountDetails.accountManager) ? dealData.accountDetails.accountManager : "n/a";
        var accountCode = (dealData && dealData.accountDetails && dealData.accountDetails.accountCode) ? dealData.accountDetails.accountCode : "n/a";
    }
    var productIdentifierWiseDataObject: { [key: string]: any } = {}
    const productInstanceData: any = await getMyInstancesV2({
        processName: "Product",
        predefinedFilters: { taskName: "View State" },
        processVariableFilters: { "dealIdentifier": dealData.dealIdentifier }
    })
    for (var i = 0; i < productInstanceData.length; i++) {
        productIdentifierWiseDataObject[productInstanceData[i].data.productIdentifier] = productInstanceData[i].data;
        if (productInstanceData[i].data.productStatus != "Proceed from Quotation to Closed State") {
            var allProductSubmittedStatus = false;
        }
    }
    var leadidentifier = dealData && dealData.leadIdentifier ? dealData.leadIdentifier : ''
    var dealIdentifier = dealData && dealData.dealIdentifier ? dealData.dealIdentifier : ''
    var accountId = dealData && dealData.accountDetails && dealData.accountDetails.accountIdentifier ? dealData.accountDetails.accountIdentifier : '';
    var accountName = dealData && dealData.accountDetails && dealData.accountDetails.accountName ? dealData.accountDetails.accountName : '';
    if (leadidentifier == '') {
        var mongoWhereClause = `this.Data.dealIdentifier=="${dealIdentifier}" || this.Data.accountIdentifier == "${accountId}"`;
    } else {
        if (accountId != "") {
            var mongoWhereClause = `this.Data.dealIdentifier=="${dealIdentifier}" || this.Data.leadIdentifier=="${leadidentifier}" || this.Data.accountIdentifier == "${accountId}" `;
        } else {
            var mongoWhereClause = `this.Data.dealIdentifier=="${dealIdentifier}" || this.Data.leadIdentifier=="${leadidentifier}" `;
        }
    }
    const contactInstanceData: any = await getMyInstancesV2({
        processName: "Contact",
        predefinedFilters: { taskName: "View Contact" },
        mongoWhereClause: mongoWhereClause
    })
    var allContactsDataeachDeal = []
    var defaultArray = [];
    var tempArray = []
    var isDefaultCount = 0;
    var isAccountDefault = false;
    for (var i = 0; i < contactInstanceData.length; i++) {
        if (contactInstanceData[i].data.source == 'Account') {
            if (contactInstanceData[i].data.isDefault) {
                isAccountDefault = true;
                allContactsDataeachDeal.push(contactInstanceData[i]);
            }
        } else {
            if (contactInstanceData[i].data.isDefault)
                isDefaultCount++;
        }

    }

    for (var i = 0; i < contactInstanceData.length; i++) {
        if (isDefaultCount > 1 && isAccountDefault == false) {
            if (contactInstanceData[i].data.isDefault) {
                // 						if(contactInstanceData[i].data.leadIdentifier == ""){
                if (contactInstanceData[i].data.dealIdentifier == dealIdentifier) {
                    defaultArray.push(contactInstanceData[i]);
                }
                else {
                    contactInstanceData[i].data.isDefault = false;
                    tempArray.push(contactInstanceData[i]);
                }

            } else {
                tempArray.push(contactInstanceData[i]);
            }
        }
        else if (isAccountDefault == false) {
            if (contactInstanceData[i].data.isDefault) {
                defaultArray.push(contactInstanceData[i]);
            } else {
                tempArray.push(contactInstanceData[i]);
            }
        }

    }
    if (defaultArray.length > 0 || tempArray.length > 0) {
        allContactsDataeachDeal = [...defaultArray, ...tempArray];
    }
    const bankInstanceData: any = await getMyInstancesV2({
        processName: "Banking Details",
        predefinedFilters: { taskName: "Edit Bank Details" }
    })
    if (bankInstanceData[0].data != undefined && bankInstanceData[0].data.bankDetails != undefined) {
        var bankData = bankInstanceData[0].data.bankDetails;
        for (var key in bankData) {
            if (invoiceDetails.selected_BankAccount == bankData[key].AED_Number) {
                var defaultBankDetails = bankData[key];
            }
            else if (bankData[key].Default_Bank == true) {
                var defaultBankDetails = bankData[key];
            }
        }
    }
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
    var accountIDWiseAccountName: { [key: string]: any } = {};
    const accountInstanceData: any[] = await getMyInstancesV2({
        processName: "Account",
        predefinedFilters: { "taskName": "View State" },

    })
    for (var i = 0; i < accountInstanceData.length; i++) {
        accountIDWiseAccountName[accountInstanceData[i].data.accountIdentifier] = accountInstanceData[i].data;
    }
    if (accountIDWiseAccountName[dealData.accountDetails.accountIdentifier].wasFromChannelPartner == true) {
        var channelPartnerAccount = accountIDWiseAccountName[dealData.accountDetails.accountIdentifier].channelPartnerAccount;
        var channelPartnerName = accountIDWiseAccountName[channelPartnerAccount] ? accountIDWiseAccountName[channelPartnerAccount].accountName : "";
    }
    const thisAccountInstanceData: any[] = await getMyInstancesV2({
        processName: "Account",
        predefinedFilters: { "taskName": "View State" },
        processVariableFilters: { "accountIdentifier": dealData.accountDetails.accountIdentifier }
    })
    var clientAccountTaxInfo: { taxInfo?: any; taxNo?: any } = {}
    for (var i = 0; i < thisAccountInstanceData.length; i++) {
        clientAccountTaxInfo.taxInfo = thisAccountInstanceData[0].data.taxinfo;
        clientAccountTaxInfo.taxNo = thisAccountInstanceData[0].data.taxnumber;
    }
    var fxRate: number = 1
    if (dealData.currency != "USD") {
        var currencyNotinUSD = dealData.currency;
        //var fxRatemap = dealData.fxRateForDeal ? dealData.fxRateForDeal : undefined;
        fxRate = await calculateFxRate("USD", dealData.currency);
    }

    const invoiceGeneratedDate = format(parseISO(invoiceDetails.invoiceDate), "dd-MMM-yyyy");
    const invoiceDateforInvoiceNo = format(parseISO(invoiceDetails.invoiceDate), "ddMMyyyy");
    var startDateMoment = new Date(9999, 11, 31, 23, 59, 59);
    var endDateMoment = new Date(1, 0, 1, 0, 0, 0);
    var userLicenseIntital: string = ""
    var professionalServiceIntital: string = ""

    for (var productId in productIdentifierWiseDataObject) {
        var productObject = productIdentifierWiseDataObject[productId];
       // console.log("productObject.productType", productObject.productType)
        if (productObject.productType == "User License") {
          //  console.log("productObject", productObject)
            var productQuotation = productObject.quotation ? productObject.quotation : {};
            for (var quotationId in productQuotation) {
                var quotationObject = productQuotation[quotationId];
                const quotationStartDate = parseISO(quotationObject.licenseStartDate);
                const quotationEndDate = parseISO(quotationObject.licenseEndDate);
                if (isBefore(quotationStartDate, startDateMoment) || isEqual(quotationStartDate, startDateMoment)) {
                    startDateMoment = quotationStartDate;
                }

                if (isAfter(quotationEndDate, endDateMoment) || isEqual(quotationEndDate, endDateMoment)) {
                    endDateMoment = quotationEndDate;
                }
                userLicenseIntital = "UL";
            }
        }
        else if (productObject.productType == "Professional Service") {   //["89a22a1c-8826-4892-85aa-c7fd6c6cde2c"].scheduleData.task[0].taskStart
            var quotationScheduleObj = productObject.scheduleData ? productObject.scheduleData : {};
            var tasks = quotationScheduleObj.task ? quotationScheduleObj.task : [];
            for (var taskObject of tasks) {
                console.log("taskObject", taskObject)
                const tasksStartDate = parseISO(taskObject.taskStart);
                const tasksEndDate = parseISO(calculateTaskEndDate(taskObject.taskStart, taskObject.taskDuration));

                if (isBefore(tasksStartDate, startDateMoment) || isEqual(tasksStartDate, startDateMoment)) {
                    startDateMoment = tasksStartDate;
                }

                if (isAfter(tasksEndDate, endDateMoment) || isEqual(tasksEndDate, endDateMoment)) {
                    endDateMoment = tasksEndDate;
                }
                professionalServiceIntital = "PS";
            }
        }
    }



    for (var key in bankData) {
        if (dealIdWisePaymentDetails[dealIdentifier].selected_BankAccount == bankData[key].AED_Number) {
            defaultBankDetails = bankData[key]
        }
    }
    const startDate = format(parseISO(invoiceDetails.invoiceDate), "dd-MMM-yyyy");

    const endDateNotFormatted = addMonths(
        parseISO(invoiceDetails.invoiceDate),
        dealIdWisePaymentDetails[invoiceDetails.dealIdentifier].payment_Terms
    );

    const endDate = format(subDays(endDateNotFormatted, 1), "dd-MMM-yyyy");
    var staffIdWiseMap: { [key: string]: any } = {};
    var totalPSBillingAmount = 0;
    var totoalULBillingAmount = 0;
    var totalCostPerLicense = 0;
    var totoalNoOfLicense = 0;
    var totalPSBillingAmountInUSD = 0;
    var ULtableData: { [key: string]: any } = {}
    var isSLA: boolean | undefined = undefined;
    var isPS = false;
    var isUL = false;
    isSLA = false;
    var isPSULSLA = false
    var slaInitial: string = ""
    console.log("productIdentifierWiseDataObject", productIdentifierWiseDataObject)
    for (var key in productIdentifierWiseDataObject) {
        if (productIdentifierWiseDataObject[key].productType == "Professional Service") {
            isPS = true;
            //staffId wise map
            var taskIdWiseSchedule: { [key: string]: any } = {};
            var roleWiseQuotationData: { [key: string]: any } = {};
            for (var k = 0; k < productIdentifierWiseDataObject[key].scheduleData.task.length; k++) {
                taskIdWiseSchedule[productIdentifierWiseDataObject[key].scheduleData.task[k].id] = productIdentifierWiseDataObject[key].scheduleData.task[k];
            }
            for (var qId in productIdentifierWiseDataObject[key].quotation) {
                roleWiseQuotationData[productIdentifierWiseDataObject[key].quotation[qId].role] = productIdentifierWiseDataObject[key].quotation[qId];
            }
            for (var l = 0; l < productIdentifierWiseDataObject[key].resourceDataWithAllocation.length; l++) {
                if (!staffIdWiseMap[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].resourceId]) {
                    staffIdWiseMap[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].resourceId] = {
                        "Role": productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].role,
                        "TaskId": productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].taskId,
                        "EmployeeName": productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].employeeName
                    }
                }
                //var billingAmount = roleWiseQuotationData[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].role].billingAmount;
                //var FTE = roleWiseQuotationData[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].role].totalFTE
                var FTE = 0; for (let i in productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].allocation) { FTE += productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].allocation[i] }
                //var FTE = productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].allocation
                var SCR = roleWiseQuotationData[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].role].scr;
                var billingAmount = FTE * SCR
                staffIdWiseMap[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].resourceId]["billingAmount"] = (staffIdWiseMap[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].resourceId]["billingAmount"] ?
                    staffIdWiseMap[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].resourceId]["billingAmount"] : 0) + billingAmount;
                //staffIdWiseMap[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].resourceId]["billingAmount"] = billingAmount;
                totalPSBillingAmount += billingAmount;
                staffIdWiseMap[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].resourceId]["FTE"] = (staffIdWiseMap[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].resourceId]["FTE"] ?
                    staffIdWiseMap[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].resourceId]["FTE"] : 0) + FTE;
                staffIdWiseMap[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].resourceId]["SCR"] = SCR;
                var Duration = taskIdWiseSchedule[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].taskId].taskDuration
                var taskStart = taskIdWiseSchedule[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].taskId].taskStart
                staffIdWiseMap[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].resourceId]["Duration"] = Duration;
                staffIdWiseMap[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].resourceId]["taskStart"] = taskStart;
                var PStableData = productIdentifierWiseDataObject[key].resourceDataWithAllocation;
                var PSDescription = productIdentifierWiseDataObject[key].productDescription;
                if (dealData.currency != "USD") {
                    var fxRatemap = dealData.fxRateForDeal ? dealData.fxRateForDeal : undefined;
                    var calculatedFxRate: number = await calculateFxRate(dealData.currency, "USD");
                    var billingAmountInUSD = billingAmount * calculatedFxRate;
                    staffIdWiseMap[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].resourceId]["billingAmountInUSD"] = (staffIdWiseMap[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].resourceId]["billingAmountInUSD"] ?
                        staffIdWiseMap[productIdentifierWiseDataObject[key].resourceDataWithAllocation[l].resourceId]["billingAmountInUSD"] : 0) + billingAmountInUSD;
                    totalPSBillingAmountInUSD += billingAmountInUSD
                }
            }
        }
        else if (productIdentifierWiseDataObject[key].productType == "User License" || Object.keys(ULtableData).length) {
            isUL = true;
            var temp_ULtableData = productIdentifierWiseDataObject[key].quotation;
            console.log("temp_ULtableData", temp_ULtableData)
            var dateObject: { sdate: string | Date; edate: string | Date } = { sdate: "", edate: "" }
            for (var key in temp_ULtableData) {
                if (temp_ULtableData[key].billingCycle == "Custom") {
                    dateObject = {
                        sdate: temp_ULtableData[key].licenseStartDate,
                        edate: temp_ULtableData[key].licenseEndDate
                    }
                }
                var eachProductRevenue = (getTotalBillingAmountForUserLicense(temp_ULtableData[key].costPerLicensePerMonth, temp_ULtableData[key].billingCycle, temp_ULtableData[key].noOfLicense, dateObject));
                ULtableData[key] = temp_ULtableData[key]
                ULtableData[key].eachProductRevenue = eachProductRevenue;
                totoalULBillingAmount += eachProductRevenue;
                totalCostPerLicense += temp_ULtableData[key].costPerLicensePerMonth;
                totoalNoOfLicense += temp_ULtableData[key].noOfLicense;
            }
        }
        else if (productIdentifierWiseDataObject[key].productType == 'Service Level Agreement' && isSLA == undefined) {
            isSLA = true;
            slaInitial = "SLA"
        }
        if (isPS == true && isUL == true && isSLA == true) {
            isPSULSLA = true;
            isPS = false
            isUL = false;
            isSLA = false
        }
    }
    console.log("ULtableData", ULtableData)
    let currentInvoiceDetails = {
        "accountManager": accountManager,
        "accountName": accountName,
        "invoiceDate": invoiceGeneratedDate,
        "dueDate": endDate
    }
    var nameArray = currentInvoiceDetails["accountManager"].split(" ")
    var initialOfAccountManager = ""
    console.log(productIdentifierWiseDataObject)
    var finalQuotationObj = productIdentifierWiseDataObject && Object.keys(productIdentifierWiseDataObject).length != 0 ? JSON.parse(JSON.stringify(productIdentifierWiseDataObject)) : {};
    console.log(finalQuotationObj)
    var dateObj = {
        "startDate": "",
        "endDate": ""
    }

    for (var pId in finalQuotationObj) {
        var quotation = finalQuotationObj[pId].quotation ? finalQuotationObj[pId].quotation : {};
        finalQuotationObj[pId]["actualRevenue"] = 0;
        var startDateForPS = [];
        var endDateForPS = [];
        var startDateForUL = [];
        var endDateForUL = [];
        for (var key in quotation) {
            if (finalQuotationObj[pId].productType == "Professional Service") {
                for (var i = 0; i < finalQuotationObj[pId]["scheduleData"]["task"].length; i++) {
                    console.log("finalQuotationObj[pId][scheduleData][task][i]", finalQuotationObj[pId]["scheduleData"]["task"][i])
                    var taskStartDate = finalQuotationObj[pId]["scheduleData"]["task"][i].taskStart;
                    var duration = finalQuotationObj[pId]["scheduleData"]["task"][i].taskDuration;
                    console.log("taskStartDate", taskStartDate)
                    console.log("duration", duration)
                    var taskEndDate = calculateTaskEndDate(taskStartDate, duration);
                    startDateForPS.push(format(taskStartDate, "yyyy-MM-dd"));
                    endDateForPS.push(format(taskEndDate, "yyyy-MM-dd"));
                }
            }
            else if (finalQuotationObj[pId].productType == "Service Level Agreement") {
            }
            else {
                var dateObject: { sdate: string | Date; edate: string | Date } = { sdate: "", edate: "" }
                if (quotation[key].billingCycle == "Custom") {
                    dateObject = {
                        sdate: quotation[key].licenseStartDate,
                        edate: quotation[key].licenseEndDate
                    }
                }
                startDateForUL.push(quotation[key].licenseStartDate)
                endDateForUL.push(quotation[key].licenseEndDate)
            }
        }

        if (finalQuotationObj[pId].productType == "Professional Service") {
            var allStartDate: string[] = startDateForPS;
            var allEndDate: string[] = endDateForPS;
        }
        else {
            var allStartDate: string[] = startDateForUL;
            var allEndDate: string[] = endDateForUL;
        }
        var SortStartDate = allStartDate.sort(function (a, b) {
            const date1 = new Date(a)
            const date2 = new Date(b)

            return date1.getTime() - date2.getTime();
        })

        var SortEndDate = allEndDate.sort(function (a, b) {
            const date1 = new Date(a)
            const date2 = new Date(b)

            return date2.getTime() - date1.getTime();
        })


        var minStartDate = SortStartDate[0];
        var maxEndDate = SortEndDate[0]
        if (dateObj["startDate"] == "") {
            dateObj["startDate"] = minStartDate
        }
        else {
            if (minStartDate < dateObj["startDate"]) {
                dateObj["startDate"] = minStartDate
            }
        }
        if (dateObj["endDate"] == "") {
            dateObj["endDate"] = maxEndDate
        }
        else {
            if (maxEndDate > dateObj["endDate"]) {
                dateObj["endDate"] = maxEndDate
            }
        }

        console.log(dateObj)
    }
    for (var j = 0; j < nameArray.length; j++) {
        initialOfAccountManager = initialOfAccountManager + nameArray[j].charAt(0)
    }
    console.log("currentInvoiceDetails -",currentInvoiceDetails)
    let invDetails = {
        "invoiceIdentifier": invoiceIdentifier,
        "accountName": currentInvoiceDetails["accountName"],
        "accountManager": currentInvoiceDetails["accountManager"],
        "invoiceDate" : currentInvoiceDetails["invoiceDate"],
        "dueDate" : currentInvoiceDetails["dueDate"],
        // "invoiceDate": format(
        //     parse(currentInvoiceDetails["invoiceDate"], "dd/MM/yyyy", new Date()),
        //     "dd-MMM-yyyy"
        // ),
        // "dueDate": format(
        //     parse(currentInvoiceDetails["dueDate"], "dd/MM/yyyy", new Date()),
        //     "dd-MMM-yyyy"
        // ),
        "invoiceStatus": invoiceDetails.invoiceStatus,
        "product_startDate": format(new Date(dateObj["startDate"]), "dd-MMM-yyyy"),
        "product_endDate": format(new Date(dateObj["endDate"]), "dd-MMM-yyyy"),
        "initialOfAccountManager": initialOfAccountManager
    };

    if (invoiceDetails.accountDetails && invoiceDetails.accountDetails.address) {
        var clientContact: any = invoiceDetails.accountDetails;
        var addressClient = invoiceDetails.accountDetails.address
    }
    else if (allContactsDataeachDeal[0]) {
        var clientContact: any = allContactsDataeachDeal[0].data
        var addressClient = clientContact.address1
    }
    else {
        var clientContact: any = {}
    }
    console.log("staffIdWiseMap")
    console.log(staffIdWiseMap)
    console.log("ULtableData")
    console.log(ULtableData)
    if (PSDescription) {
        if (PSDescription.includes("<p>")) {
            var modifiedPSDescription = PSDescription.split("<p>")[1].split("</p>")[0]
        }
        else {
            var modifiedPSDescription = PSDescription
        }
    }

    var newNum = invoiceDetails["invoiceIdentifier"].substr(0, 2);
    const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
    
    var viewInvoiceContent = {
        "moduleLandingPageRef": "InvoiceModuleLandingPage1677756632886",
        "accountManager": userIdWiseUserDetailsMap[accountManager].userName,
        "accountManagerEmail": userIdWiseUserDetailsMap[accountManager].userEmail,
        //		"clientContact" : allContactsDataeachDeal[0]? allContactsDataeachDeal[0].data : {},
        "clientContact": clientContact,
        "contact_first_name": allContactsDataeachDeal[0].data.firstName,
        "contact_last_name": allContactsDataeachDeal[0].data.lastName,
        "addressClient": addressClient,
        "bankingInfo": invoiceDetails.AEDNumber ? invoiceDetails : defaultBankDetails,
        // "dealRevenue" : actualRevenueIncludingVAT,
        "accountName": accountName,
        "productData": productIdentifierWiseDataObject,
        "invoiceGenerated": invoiceGeneratedDate,
        "licenseStartDate": startDate,
        "licenseEndDate": endDate,
        //"logoUrl" : Globals.kerossLogo,
        "addressInfo": AddressInfo,
        //  "header" : Globals.header_1nvoiceImg,
        //  "footer" : Globals.footer_1InvoiceImg,
        //  "invoiceBackground" : Globals.invoiceBg,
        //  "clientLogo" : clientLogo,
        //    "invoiceBackgroundFooter" :  Globals.quotationFooterTemplate,
        //    "signature" : digiSign,
        "commentsSection": dealData.quotationComment ? dealData.quotationComment : "n/a",
        "currency": dealData.currency,
        //    "blankPng" : Globals.blankPng,
        "psInitial": professionalServiceIntital,
        "slaInitial": slaInitial,
        "ulInitial": userLicenseIntital,
        "invoiceDateforInvoiceNo": invoiceDateforInvoiceNo,
        "accountCode": accountCode,
        "clientAccountTaxDetails": clientAccountTaxInfo,
        "billingAmount": invoiceDetails.totalBillingAmount,
        // "DueAmount" : dueAmount,
        //   "outstandingAmount" : getFormattedAmountByUserPreference(outstandingAmount, 2),
        //   "invoicedAmount" : invoicedAmmount,
        "isPS": isPS ? isPS : undefined,
        "isUL": isUL ? isUL : undefined,
        "isPSULSLA": isPSULSLA ? isPSULSLA : undefined,
        "ULtableData": ULtableData,
        "PStableData": staffIdWiseMap,
        "totalPSBillingAmount": totalPSBillingAmount,
        "totoalULBillingAmount": totoalULBillingAmount,
        "totalCostPerLicense": totalCostPerLicense,
        "totoalNoOfLicense": totoalNoOfLicense,
        "totalPSBillingAmountInUSD": totalPSBillingAmountInUSD,
        "PSDescription": modifiedPSDescription,
        "currencyNotinUSD": currencyNotinUSD,
        "channelPartnerName": channelPartnerName,
        "fxRate": fxRate,
        "invoiceIdentifier": invoiceIdentifier,
        "productInitials": invoiceDetails["productInitials"],
        "newNum": newNum
    };

    finalQuotationObj = productIdentifierWiseDataObject && Object.keys(productIdentifierWiseDataObject).length != 0 ? JSON.parse(JSON.stringify(productIdentifierWiseDataObject)) : {};
    var totalActualRevenue = 0;

    for (var pId in finalQuotationObj) {
        var quotation = finalQuotationObj[pId].quotation ? finalQuotationObj[pId].quotation : {};
        finalQuotationObj[pId]["actualRevenue"] = 0;
        var startDateForPS = [];
        var endDateForPS = [];
        var startDateForUL = [];
        var endDateForUL = [];
        var startDateDP: string[] = []
        var endDateDP: string[] = []
        for (var key in quotation) {
            if (finalQuotationObj[pId].productType == "Professional Service") {
                let actualRevenue: any = getTotalBillingAmountForPS(quotation[key].scr, quotation[key].expenses, quotation[key].otherCosts, quotation[key].totalFTE);
                finalQuotationObj[pId]["actualRevenue"] += (actualRevenue ? actualRevenue : 0);
                for (var i = 0; i < finalQuotationObj[pId]["scheduleData"]["task"].length; i++) {
                    var taskStartDate = finalQuotationObj[pId]["scheduleData"]["task"][i].taskStart;
                    var duration = finalQuotationObj[pId]["scheduleData"]["task"][i].taskDuration;
                    var taskEndDate = calculateTaskEndDate(taskStartDate, duration);
                    startDateForPS.push(format(taskStartDate, "yyyy-MM-dd"));
                    endDateForPS.push(format(taskEndDate, "yyyy-MM-dd"));
                }
            }
            else if (finalQuotationObj[pId].productType == "Service Level Agreement") {
            }
            else {
                var dateObject: { sdate: string | Date; edate: string | Date } = { sdate: "", edate: "" }
                if (quotation[key].billingCycle == "Custom") {
                    dateObject = {
                        sdate: quotation[key].licenseStartDate,
                        edate: quotation[key].licenseEndDate
                    }
                }
                var actualRevenue: any = getTotalBillingAmountForUserLicense(quotation[key].costPerLicensePerMonth, quotation[key].billingCycle, quotation[key].noOfLicense, dateObject);
                finalQuotationObj[pId]["actualRevenue"] += (actualRevenue ? actualRevenue : 0);
                startDateForUL.push(quotation[key].licenseStartDate)
                endDateForUL.push(quotation[key].licenseEndDate)
            }
        }
        if (finalQuotationObj[pId].productType != "Professional Service" && finalQuotationObj[pId].productType != "Service Level Agreement" && finalQuotationObj[pId].productType != "User License") {
            startDateDP.push(finalQuotationObj[pId].dynamicProductData.productStartDate.split("-").reverse().join("-"))
            endDateDP.push(finalQuotationObj[pId].dynamicProductData.productEndDate.split("-").reverse().join("-"))
        }
        totalActualRevenue += (finalQuotationObj[pId]["actualRevenue"] ? finalQuotationObj[pId]["actualRevenue"] : 0);
        let allStartDate: string[] = [];
        let allEndDate: string[] = [];
        if (finalQuotationObj[pId].productType == "Professional Service") {
            allStartDate = startDateForPS;
            allEndDate = endDateForPS;
        }
        else if (finalQuotationObj[pId].productType == "User License") {
            allStartDate = startDateForUL;
            allEndDate = endDateForUL;
        }
        else if (finalQuotationObj[pId].productType == "Service Level Agreement") {
        }
        else {
            allStartDate = startDateDP;
            allEndDate = endDateDP;
        }
        var SortStartDate = allStartDate.sort(function (a, b) {
            const date1 = new Date(a)
            const date2 = new Date(b)

            return date1.getTime() - date2.getTime();
        })

        var SortEndDate = allEndDate.sort(function (a, b) {
            const date1 = new Date(a)
            const date2 = new Date(b)

            return date2.getTime() - date1.getTime();
        })


        var minStartDate = SortStartDate[0];
        var maxEndDate = SortEndDate[0]
        finalQuotationObj[pId]["contractedStartDate"] = format(new Date(minStartDate), "dd-MMM-yyyy");
        finalQuotationObj[pId]["contractedEndDate"] = format(new Date(maxEndDate), "dd-MMM-yyyy");

    }
    var fxRate = 1
    if (dealData.currency != "USD") {
        //var fxRatemap = dealData.fxRateForDeal ? dealData.fxRateForDeal : undefined;
        fxRate = await calculateFxRate(dealData.currency, "USD");
    } else {
        fxRate = await calculateFxRate(dealData.currency, "USD");
    }
   
    var totalRevisedBillingAmount = 0;
    var eachDiscountPercentforInvoice: any = {}
    var eachFinalBillingAmountforInvoice: any = {}
    var eachFinalBillingAmountforInvoiceClientCurrency: any = {}
    for (var pId in finalQuotationObj) {
        if (finalQuotationObj[pId].productType == "Service Level Agreement") {
            var quotaitionOfSla = Object.values(finalQuotationObj[pId].quotation)[0];
            var eachActualRevenue = (quotaitionOfSla as { slaRevenue: number }).slaRevenue;
            var eachProductDiscountPercent = dealData.productDetails ? (dealData.productDetails[pId] ? (dealData.productDetails[pId].discountPercent ? dealData.productDetails[pId].discountPercent : 0) : 0) : 0;
            var eachDiscountedAmount = getDiscountedAmountForDeal(eachProductDiscountPercent, eachActualRevenue);
            var eachFinalBillingAmount = getRevisedAmountForDeal(eachProductDiscountPercent, eachActualRevenue);
            totalRevisedBillingAmount += (eachFinalBillingAmount ? eachFinalBillingAmount : 0);

            //$("#eachDiscountPercentforInvoice_"+pId).html(populateFormattedPercentageField(eachProductDiscountPercent));
            eachDiscountPercentforInvoice[pId] = eachProductDiscountPercent;
            //$("#eachDiscountedAmountforInvoice_"+pId+"_"+invoiceIdentifier).html('<span style="color:'+getNegativeColorOfAmount(eachDiscountedAmount)+'">'+getFormattedAmountByUserPreference(eachDiscountedAmount, 2)+`(${populateFormattedPercentageField(eachProductDiscountPercent)}%)`+'</span>');
            if (dealData.currency != "USD") {

                var calculatedFxRate = await calculateFxRate(dealData.currency, "USD");
            } else {
                var calculatedFxRate = await calculateFxRate(dealData.currency, "USD");
            }
            eachFinalBillingAmountforInvoice[pId] = eachFinalBillingAmount;

            var eachFinalBillingAmountinCURR = eachFinalBillingAmount * calculatedFxRate;
            eachFinalBillingAmountforInvoiceClientCurrency[pId] = eachFinalBillingAmountinCURR;
            //$("#eachFinalBillingAmountforInvoiceClientCurrency_"+pId+"_"+invoiceIdentifier).html(getFormattedAmountByUserPreference(eachFinalBillingAmountinCURR, 2));
            //$("#eachFinalBillingAmountforInvoice_"+pId+"_"+invoiceIdentifier).html(getFormattedAmountByUserPreference(eachFinalBillingAmount, 2));

            finalQuotationObj[pId]["eachDiscountPercent"] = eachProductDiscountPercent;
            finalQuotationObj[pId]["eachDiscountedAmount"] = eachDiscountedAmount;
            finalQuotationObj[pId]["eachFinalBillingAmount"] = eachFinalBillingAmount;

        } else {
            var eachProductDiscountPercent = dealData.productDetails ? (dealData.productDetails[pId] ? (dealData.productDetails[pId].discountPercent ? dealData.productDetails[pId].discountPercent : 0) : 0) : 0;
            var eachActualRevenue: number = finalQuotationObj[pId]["actualRevenue"] ? finalQuotationObj[pId]["actualRevenue"] : 0;
            var eachDiscountedAmount = getDiscountedAmountForDeal(eachProductDiscountPercent, eachActualRevenue);
            var eachFinalBillingAmount = getRevisedAmountForDeal(eachProductDiscountPercent, eachActualRevenue);
            totalRevisedBillingAmount += (eachFinalBillingAmount ? eachFinalBillingAmount : 0);
            eachDiscountPercentforInvoice[pId] = eachProductDiscountPercent;

            //$("#eachDiscountPercentforInvoice_"+pId).html(populateFormattedPercentageField(eachProductDiscountPercent));
            //$("#eachDiscountedAmountforInvoice_"+pId+"_"+invoiceIdentifier).html('<span style="color:'+getNegativeColorOfAmount(eachDiscountedAmount)+'">'+getFormattedAmountByUserPreference(eachDiscountedAmount, 2)+`(${populateFormattedPercentageField(eachProductDiscountPercent)}%)`+'</span>');
            if (dealData.currency != "USD") {

                var calculatedFxRate = await calculateFxRate(dealData.currency, "USD");
            } else {
                var calculatedFxRate = await calculateFxRate(dealData.currency, "USD");
            }
            eachFinalBillingAmountforInvoice[pId] = eachFinalBillingAmount;

            var eachFinalBillingAmountinCURR = eachFinalBillingAmount * calculatedFxRate;
            eachFinalBillingAmountforInvoiceClientCurrency[pId] = eachFinalBillingAmountinCURR;
            //$("#eachFinalBillingAmountforInvoiceClientCurrency_"+pId+"_"+invoiceIdentifier).html(getFormattedAmountByUserPreference(eachFinalBillingAmountinCURR, 2));
            //$("#eachFinalBillingAmountforInvoice_"+pId+"_"+invoiceIdentifier).html(getFormattedAmountByUserPreference(eachFinalBillingAmount, 2));

            finalQuotationObj[pId]["eachDiscountPercent"] = eachProductDiscountPercent;
            finalQuotationObj[pId]["eachDiscountedAmount"] = eachDiscountedAmount;
            finalQuotationObj[pId]["eachFinalBillingAmount"] = eachFinalBillingAmount;
        }
    }
    var totalDiscountedBillingAmountforInvoice = getFormattedAmountByUserPreference(totalRevisedBillingAmount, 2)
    var totalRevisedBillingAmountInUSD = 0;
    if (dealData.currency != "USD") {
        //var fxRatemap = dealData.fxRateForDeal ? dealData.fxRateForDeal : undefined;
        var calculatedFxRate = await calculateFxRate(dealData.currency, "USD")
        totalRevisedBillingAmountInUSD = totalRevisedBillingAmount * calculatedFxRate;
    }
    const totalDiscountedBillingAmountforInvoiceinUSD = getFormattedAmountByUserPreference(totalRevisedBillingAmountInUSD, 2)
    var discount = dealData.discountPercent ? dealData.discountPercent : 0;
    discount = getFormattedAmountByUserPreference(discount, 2);
    //$("#discountPercentageForDealforInvoice"+invoiceIdentifier).html(' ('+populateFormattedPercentageField(discount)+'%)');
    var discountedBillingAmount = getDiscountedAmountForDeal(discount, totalRevisedBillingAmount);
    var finalBillingAmount = getRevisedAmountForDeal(discount, totalRevisedBillingAmount);
    if (dealData.currency != "USD") {

        var calculatedFxRate = await calculateFxRate(dealData.currency, "USD")
        //	var  discountedBillingAmountforInvoiceInUSD = discountedBillingAmount * calculatedFxRate ;
        discountedBillingAmount = discountedBillingAmount * calculatedFxRate;
        var finalBillingAmountforInvoiceInUSD: number = finalBillingAmount * calculatedFxRate;
        //$("#discountedBillingAmountforInvoiceInUSD"+invoiceIdentifier).html('<span style="color:'+getNegativeColorOfAmount(discountedBillingAmountforInvoiceInUSD)+'">'+getFormattedAmountByUserPreference(discountedBillingAmountforInvoiceInUSD, 2)+'</span>');

    }
    else {
        //$("#discountedBillingAmountforInvoice"+invoiceIdentifier).html('<span style="color:'+getNegativeColorOfAmount(discountedBillingAmount)+'">'+getFormattedAmountByUserPreference(discountedBillingAmount, 2)+'</span>');
    }
    //$("#discountedBillingAmountforInvoice" + invoiceIdentifier).html('<span style="color:' + getNegativeColorOfAmount(discountedBillingAmount) + '">' + getFormattedAmountByUserPreference(discountedBillingAmount, 2) + '</span>');
    var finalBillingAmountforInvoice = getFormattedAmountByUserPreference(finalBillingAmount, 2);
    var finalBillingAmountforInvoiceInUSD = 0;
    if (dealData.currency != "USD") {
        var calculatedFxRate = await calculateFxRate(dealData.currency, "USD")
        finalBillingAmountforInvoiceInUSD = finalBillingAmount * calculatedFxRate;
    }
    var finalBillingAmountforInvoiceInUSDFormatted = getFormattedAmountByUserPreference(finalBillingAmountforInvoiceInUSD, 2);
    //$("#finalBillingAmountforInvoice" + invoiceIdentifier).html(getFormattedAmountByUserPreference(finalBillingAmount, 2));
    //$("#finalBillingAmountforInvoiceInUSD").html(getFormattedAmountByUserPreference(finalBillingAmountforInvoiceInUSD, 2));

    var vatPercent = dealData.vatPercent ? dealData.vatPercent : 0;
    vatPercent = getFormattedAmountByUserPreference(vatPercent, 2);
   // $("#vatPercentageForDealforInvoice" + invoiceIdentifier).html(' (' + populateFormattedPercentageField(vatPercent) + '%)');
    var finalBillingAmountIncludingVAT = getFinalBillingAmountIncludingVATRate(vatPercent, finalBillingAmount);
    var finalBillingAmountIncludingVATforInvoice = getFormattedAmountByUserPreference(finalBillingAmountIncludingVAT, 2);
    //$("#finalBillingAmountIncludingVATforInvoice" + invoiceIdentifier).html(getFormattedAmountByUserPreference(finalBillingAmountIncludingVAT, 2));
    if (dealData.currency != "USD") {
        //var fxRatemap = dealData.fxRateForDeal ? dealData.fxRateForDeal : undefined;
        var fxRateForCalculation = calculateFxRate(dealData.currency, "USD");
        var valueInProjectCurrency = Number(fxRateForCalculation) * finalBillingAmountIncludingVAT;
    }
    var valueInProjectCurrency = 0;
    if (dealData.currency != "USD") {
        var fxRateForCalculation = calculateFxRate(dealData.currency, "USD");
        valueInProjectCurrency = Number(fxRateForCalculation) * finalBillingAmountIncludingVAT;
    }
    var finalBillingAmountIncludingVATforInvoiceCurr = getFormattedAmountByUserPreference(valueInProjectCurrency, 2);
    //$("#finalBillingAmountIncludingVATforInvoiceCurr" + invoiceIdentifier).html(getFormattedAmountByUserPreference(valueInProjectCurrency, 2));
   // var vatAmount = amountAfterVat(vatPercent, finalBillingAmount);
    var vatAmount =  finalBillingAmount * (vatPercent /100) 
    if (dealData.currency != "USD") {
        var calculatedFxRate = await calculateFxRate(dealData.currency, "USD")
        var vatAmountInUSD = vatAmount * calculatedFxRate;
    }
    var formattedVatAmount = getFormattedAmountByUserPreference(vatAmount, 2);
    var vatAmountInUSD = 0;
    if (dealData.currency != "USD") {
        var calculatedFxRate = await calculateFxRate(dealData.currency, "USD")
        vatAmountInUSD = vatAmount * calculatedFxRate;
    }
    var formattedVatAmountInUSD = getFormattedAmountByUserPreference(vatAmountInUSD, 2);
    let quotationDetailsDealTableInvoice = {
        "productData": finalQuotationObj,
        "totalActualRevenueClientCurrency": totalActualRevenue * fxRate,
        "totalActualRevenue": totalActualRevenue,
        "isClientCurrencyNotSameAsUSD": dealData.currency != "USD",
        "currency": dealData.currency,
        "invoiceId": invoiceIdentifier,
        "eachDiscountPercentforInvoice": eachDiscountPercentforInvoice,
        "eachFinalBillingAmountforInvoice": eachFinalBillingAmountforInvoice,
        "eachFinalBillingAmountforInvoiceClientCurrency": eachFinalBillingAmountforInvoiceClientCurrency,
        "totalDiscountedBillingAmountforInvoice": totalDiscountedBillingAmountforInvoice,
        "totalDiscountedBillingAmountforInvoiceinUSD": totalDiscountedBillingAmountforInvoiceinUSD,
        "discountPercentageForDealforInvoice": discount,
        "finalBillingAmountforInvoice": finalBillingAmountforInvoice,
        "finalBillingAmountforInvoiceInUSD": finalBillingAmountforInvoiceInUSDFormatted,
        "vatAmount": formattedVatAmount,
        "vatAmountInUSD": formattedVatAmountInUSD,
        "finalBillingAmountIncludingVATforInvoice": finalBillingAmountIncludingVATforInvoice,
        "finalBillingAmountIncludingVATforInvoiceCurr": finalBillingAmountIncludingVATforInvoiceCurr,
        
    };
    return {
        "viewInvoiceContent": viewInvoiceContent,
        "quotationDetailsDealTableInvoice": quotationDetailsDealTableInvoice
    }
    //$("#vatAmount" + invoiceIdentifier).html(getFormattedAmountByUserPreference(vatAmount, 2));
    //$("#vatAmountInUSD" + invoiceIdentifier).html(getFormattedAmountByUserPreference(vatAmountInUSD, 2));
}