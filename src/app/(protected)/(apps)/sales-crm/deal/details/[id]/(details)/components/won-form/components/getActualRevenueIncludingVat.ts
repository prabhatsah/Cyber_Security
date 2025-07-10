import { differenceInMonths, format, parseISO } from "date-fns";
import { getProductProcessData, SubscribedSoftwareNameMaps } from "./getDealData";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { randomUUID } from "crypto";


export async function getFTEDataForQuotationForPS(resourceData) {
    let roleWiseFTEObj = {};
    let totalFTE = 0;
    if (resourceData.length != 0) {
        for (let i = 0; i < resourceData.length; i++) {
            let roleName = resourceData[i].role;
            let allocation = resourceData[i].allocation ? resourceData[i].allocation : {};
            for (let month in allocation) {
                if (roleWiseFTEObj[roleName] != undefined) {
                    var previousData = roleWiseFTEObj[roleName];
                    roleWiseFTEObj[roleName] = previousData + allocation[month];
                } else {
                    roleWiseFTEObj[roleName] = {};
                    roleWiseFTEObj[roleName] = allocation[month];
                }
                totalFTE += allocation[month];
            }

        }
    }
    return {
        "roleWiseFTEObj": roleWiseFTEObj,
        "totalFTE": totalFTE
    }
}

export async function getFXRateMap() {

    const SubscribedSoftwareInfo = await SubscribedSoftwareNameMaps()

    const salesCrmInfo = SubscribedSoftwareInfo.filter((appData: any) => {
        return appData.SOFTWARE_NAME === 'Sales CRM'
    })

    const processInstances = await getMyInstancesV2({
        processName: "Fx Rate",
        predefinedFilters: { "taskName": "View State" },
        softwareId: salesCrmInfo[0]?.SOFTWARE_ID
    })
    const fxRateIdMap = processInstances[0] ? (processInstances[0].data ? (processInstances[0].data.fxRates ? processInstances[0].data.fxRates : {}) : {}) : {}
    // let selectTypeWiseDataObj = {};
    // const d = new Date();
    // let year = d.getFullYear();
    // for(var key in fxRateIdMap[year]){
    //     selectTypeWiseDataObj["currency"][fxRateIdMap[year][key]["currency"]] = fxRateIdMap[year][key]["currency"]
    // }
    return fxRateIdMap;

}

export async function calculateFxRate(selectedCurrency, baseCurrency, fxrateMap) {
    var tempFxRateObj = await getFXRateMap();
    tempFxRateObj = JSON.parse(JSON.stringify(tempFxRateObj));
    var currencyWiseFxRate = {};

    if (!fxrateMap) {
        for (var year in tempFxRateObj) {
            for (var id in tempFxRateObj[year]) {
                var currency = tempFxRateObj[year][id].currency ? tempFxRateObj[year][id].currency : "";
                var selectedYear = tempFxRateObj[year][id].year ? tempFxRateObj[year][id].year : "";
                if (currencyWiseFxRate[selectedYear] == undefined) {
                    currencyWiseFxRate[selectedYear] = {};
                }
                if (currencyWiseFxRate[selectedYear][currency] == undefined) {
                    currencyWiseFxRate[selectedYear][currency] = tempFxRateObj[year][id].fxRate ? tempFxRateObj[year][id].fxRate : 0;
                }
            }
        }
        year = format(new Date(), 'yyyy');;

        if (baseCurrency == "" || baseCurrency == undefined || selectedCurrency == "" || selectedCurrency == undefined) {
            var calculatedFXRate = 1;
        }
        else {
            var baseCurrencyFxRate = currencyWiseFxRate[year] ? currencyWiseFxRate[year][baseCurrency] ? currencyWiseFxRate[year][baseCurrency] : 0 : 0;
            var selectedFxRate = currencyWiseFxRate[year] ? currencyWiseFxRate[year][selectedCurrency] ? currencyWiseFxRate[year][selectedCurrency] : 0 : 0;
            var calculatedFXRate = baseCurrencyFxRate == 0 ? 0 : selectedFxRate / baseCurrencyFxRate;
        }
    } else {

        for (var id in fxrateMap) {
            var currency = fxrateMap[id].currency ? fxrateMap[id].currency : "";
            if (currencyWiseFxRate[currency] == undefined) {
                currencyWiseFxRate[currency] = fxrateMap[id].fxRate ? fxrateMap[id].fxRate : 0;
            }
        }

        if (baseCurrency == "" || baseCurrency == undefined || selectedCurrency == "" || selectedCurrency == undefined) {
            var calculatedFXRate = 1;
        }
        else {
            var baseCurrencyFxRate = currencyWiseFxRate[baseCurrency] ? currencyWiseFxRate[baseCurrency] : 0;
            var selectedFxRate = currencyWiseFxRate[selectedCurrency] ? currencyWiseFxRate[selectedCurrency] : 0;
            var calculatedFXRate = baseCurrencyFxRate == 0 ? 0 : selectedFxRate / baseCurrencyFxRate;
        }
    }

    return calculatedFXRate;
}

export async function getTotalExpenseDataForPS(expenseData, dealCurrency, fxRateMap) {
    var totalExpense = 0;
    for (var id in expenseData) {
        var cost = expenseData[id].cost ? expenseData[id].cost : 0;
        var quantity = expenseData[id].quantity ? expenseData[id].quantity : 0;
        var currency = expenseData[id].currency ? expenseData[id].currency : "";
        var calculatedFxRate = await calculateFxRate(currency, dealCurrency, fxRateMap);
        var totalCost = cost * quantity * calculatedFxRate;
        totalExpense += totalCost;
    }
    return totalExpense;
}


export async function getExpenseDataForEachRoleForPS(resourceData, expenseData, dealCurrency, fxRateMap) {
    var objForRole = await getFTEDataForQuotationForPS(resourceData);
    var roleWiseFTEObj = objForRole.roleWiseFTEObj ? objForRole.roleWiseFTEObj : {};
    var totalFTERole = objForRole.totalFTE ? objForRole.totalFTE : {};
    var totalExpense = await getTotalExpenseDataForPS(expenseData, dealCurrency, fxRateMap);
    var roleWiseExpenseObj = {};
    for (var key in roleWiseFTEObj) {
        var expense = totalFTERole != 0 ? (roleWiseFTEObj[key] / totalFTERole) * totalExpense : 0;
        roleWiseExpenseObj[key] = expense;
    }
    return roleWiseExpenseObj;
}

export async function getExpenseAndFTEDataObjForPS(resourceData, expenseData, dealCurrency, fxRateMap) {
    var objForRole = await getFTEDataForQuotationForPS(resourceData);
    var roleWiseFTEObj = objForRole.roleWiseFTEObj ? objForRole.roleWiseFTEObj : {};
    var roleWiseExpenseObj = await getExpenseDataForEachRoleForPS(resourceData, expenseData, dealCurrency, fxRateMap);
    var roleWiseFTEAndExpenseObj = {};
    for (var key in roleWiseFTEObj) {
        if (roleWiseFTEAndExpenseObj[key] == undefined) {
            roleWiseFTEAndExpenseObj[key] = {};
            roleWiseFTEAndExpenseObj[key]["totalFTE"] = roleWiseFTEObj[key] ? roleWiseFTEObj[key] : 0;
            roleWiseFTEAndExpenseObj[key]["expense"] = roleWiseExpenseObj[key] ? roleWiseExpenseObj[key] : 0;
            roleWiseFTEAndExpenseObj[key]["role"] = key ? key : "";
        }
    }
    return roleWiseFTEAndExpenseObj;
}

export async function getTotalBillingAmountForPS(scr, expenses, otherCosts, totalFTE) {
    return (((scr ? scr : 0) * (totalFTE ? totalFTE : 0)) + (expenses ? expenses : 0) + (otherCosts ? otherCosts : 0));
}

export async function recalculateDataForPSQuotation(PSData, resourceData, expenseData, dealCurrency, fxRateMap) {
    var roleWiseFTEAndExpenseObj = await getExpenseAndFTEDataObjForPS(resourceData, expenseData, dealCurrency, fxRateMap);
    var newRoleNameArray = new Array();
    var finalPSDataObj = {};
    if (Object.keys(PSData).length != 0) {
        for (var roleName in roleWiseFTEAndExpenseObj) {
            var newRoleName = roleName;
            var tempRoleNameFlag = false;
            for (var key in PSData) {
                var previousRoleName = PSData[key].role ? PSData[key].role : "";
                if (previousRoleName == newRoleName) {
                    tempRoleNameFlag = true;
                    break;
                }
            }
            if (tempRoleNameFlag == false) {
                newRoleNameArray.push(newRoleName);

            }
        }
        if (newRoleNameArray.length == 0) {
            for (var key in PSData) {
                finalPSDataObj[key] = new Object();
                finalPSDataObj[key] = {
                    "id": key,
                    "role": PSData[key].role,
                    "totalFTE": roleWiseFTEAndExpenseObj[PSData[key].role] && roleWiseFTEAndExpenseObj[PSData[key].role].totalFTE ? roleWiseFTEAndExpenseObj[PSData[key].role].totalFTE : 0,
                    "scr": PSData[key].scr ? PSData[key].scr : 0,
                    "expenses": roleWiseFTEAndExpenseObj[PSData[key].role] && roleWiseFTEAndExpenseObj[PSData[key].role].expense ? roleWiseFTEAndExpenseObj[PSData[key].role].expense : 0,
                    "otherCosts": PSData[key].otherCosts ? PSData[key].otherCosts : 0,
                    "billingAmount": getTotalBillingAmountForPS(PSData[key].scr, roleWiseFTEAndExpenseObj[PSData[key].role].expense, PSData[key].otherCosts, roleWiseFTEAndExpenseObj[PSData[key].role].totalFTE),
                }

            }
        } else {
            for (var roleName in roleWiseFTEAndExpenseObj) {

                if (newRoleNameArray.includes(roleName)) {
                    var id = randomUUID();
                    finalPSDataObj[id] = {
                        "id": id,
                        "role": roleName,
                        "totalFTE": roleWiseFTEAndExpenseObj[roleName].totalFTE ? roleWiseFTEAndExpenseObj[roleName].totalFTE : 0,
                        "scr": 0,
                        "expenses": roleWiseFTEAndExpenseObj[roleName].expense ? roleWiseFTEAndExpenseObj[roleName].expense : 0,
                        "otherCosts": 0,
                        "billingAmount": roleWiseFTEAndExpenseObj[roleName].expense ? roleWiseFTEAndExpenseObj[roleName].expense : 0,
                    }
                } else {
                    for (var key in PSData) {
                        var previousRoleName = PSData[key].role ? PSData[key].role : "";
                        if (previousRoleName == roleName) {
                            finalPSDataObj[key] = new Object();
                            finalPSDataObj[key] = {
                                "id": key,
                                "role": PSData[key].role,
                                "totalFTE": roleWiseFTEAndExpenseObj[PSData[key].role] && roleWiseFTEAndExpenseObj[PSData[key].role].totalFTE ? roleWiseFTEAndExpenseObj[PSData[key].role].totalFTE : 0,
                                "scr": PSData[key].scr ? PSData[key].scr : 0,
                                "expenses": roleWiseFTEAndExpenseObj[PSData[key].role] && roleWiseFTEAndExpenseObj[PSData[key].role].expense ? roleWiseFTEAndExpenseObj[PSData[key].role].expense : 0,
                                "otherCosts": PSData[key].otherCosts ? PSData[key].otherCosts : 0,
                                "billingAmount": getTotalBillingAmountForPS(PSData[key].scr, roleWiseFTEAndExpenseObj[PSData[key].role].expense, PSData[key].otherCosts, roleWiseFTEAndExpenseObj[PSData[key].role].totalFTE),
                            }
                            break;
                        }
                    }
                }

            }
        }
    }
    return finalPSDataObj;

}


export async function getRevenueForDPWithoutDiscount(productObj) {
    var quotationStageAmount = productObj["quotationAmount"] ? parseFloat(productObj["quotationAmount"]) : 0;
    return quotationStageAmount;
}

export async function getTotalBillingAmountForUserLicense(costPerLicensePerMonth, billingCycle, noOfLicense, dateObject) {
    let noOfPeriods = 0;

    if (billingCycle === "Monthly") {
        noOfPeriods = 1;
    } else if (billingCycle === "Yearly") {
        noOfPeriods = 12;
    } else if (billingCycle === "Quartely") {
        noOfPeriods = 3;
    } else {
        if (dateObject) {
            const startDate = parseISO(dateObject.sdate);
            const endDate = parseISO(dateObject.edate);
            noOfPeriods = Math.ceil(differenceInMonths(endDate, startDate));
        }
    }

    return noOfLicense * costPerLicensePerMonth * noOfPeriods;
}

export async function getRevisedAmountForDeal(discountPercent, actualRevenue) {
    var eachDiscountedAmount = actualRevenue * (discountPercent / 100);
    var eachFinalBillingAmount = actualRevenue - eachDiscountedAmount;
    return eachFinalBillingAmount;

}

export async function getFinalBillingAmountIncludingVATRate(vatPercent,amount){
    var vatTaxAmount = amount * (vatPercent /100) ;
    var finalBillingAmountIncludingVAT = amount + vatTaxAmount;
    return finalBillingAmountIncludingVAT ;
}

export async function getFormattedAmountByUserPreference(amount, decimalPlaces = 0) {
    if (amount === '-' || amount === undefined || amount === null) return 0;
    if (amount === 0) return amount.toFixed(decimalPlaces);
    
    decimalPlaces = isNaN(decimalPlaces) ? 0 : parseInt(decimalPlaces);
    
    const numericAmount = parseFloat(amount).toFixed(decimalPlaces);
    const formattedAmount = new Intl.NumberFormat('en-US').format(numericAmount);
    
    return parseFloat(amount) < 0 
        ? `(${formattedAmount})` 
        : formattedAmount;
}



export async function formattedActualRevenueIncludingVAT(dealData: any) {

    const productIdentifierWiseDataObj = await getProductProcessData(dealData?.dealIdentifier);
    const productIdentifierWiseData = productIdentifierWiseDataObj[0]?.data;

    // if (productIdentifierWiseData?.productType == "Professional Service") {
    //     var PSData = productIdentifierWiseData?.quotation || {};
    //     var resourceDataWithAllocation = productIdentifierWiseData?.resourceDataWithAllocation || [];
    //     var expenseDetails = productIdentifierWiseData?.expenseDetails || {};
    //     if (dealData?.dealStatus == 'Submit Quotation for Client Review' || dealData?.dealStatus == 'Won' || dealData?.dealStatus == "Lost") {
    //         var fxRatemap = dealData?.fxRateForDeal;
    //         var finalPSDataObj = await recalculateDataForPSQuotation(PSData, resourceDataWithAllocation, expenseDetails, dealData?.currency, fxRatemap);
    //     }
    //     else {
    //         var finalPSDataObj = await recalculateDataForPSQuotation(PSData, resourceDataWithAllocation, expenseDetails, dealData?.currency, {});
    //     }
    //     productIdentifierWiseDataObj.quotation = finalPSDataObj;
    // }

    // return productIdentifierWiseDataObj;

    var finalProductbj = productIdentifierWiseData && Object.keys(productIdentifierWiseData).length != 0 ? JSON.parse(JSON.stringify(productIdentifierWiseData)) : {}
    // return finalProductbj;

    var totalActualRevenue = 0;
    var totalActualRevenueInUSD = 0;
    for (var pId in finalProductbj) {
        var productType = finalProductbj[pId].productType;
        var quotation = finalProductbj[pId].quotation ? finalProductbj[pId].quotation : {};
        var discountPercent = finalProductbj[pId].discountPercent ? finalProductbj[pId].discountPercent : 0;
        if (typeof finalProductbj[pId] !== 'object' || finalProductbj[pId] === null) {
            finalProductbj[pId] = {}; // Initialize as an object
        }
        finalProductbj[pId]["actualRevenue"] = 0;
        finalProductbj[pId]["actualRevenueInUSD"] = 0;
        var totalProductRevenue = 0;

        if (productType != "Professional Service" && productType != "User License" && productType != "Service Level Agrrement") {
            var eachDPRevenue = await getRevenueForDPWithoutDiscount(finalProductbj[pId]);
            totalProductRevenue += (eachDPRevenue ? eachDPRevenue : 0);
        }
        else {
            for (var key in quotation) {
                if (finalProductbj[pId].productType == "Professional Service") {
                    var eachProductRevenue = await getTotalBillingAmountForPS(quotation[key].scr, quotation[key].expenses, quotation[key].otherCosts, quotation[key].totalFTE);
                } else if (finalProductbj[pId].productType == "User License") {
                    var dateObject = {}
                    if (quotation[key].billingCycle == "Custom") {
                        dateObject = {
                            sdate: quotation[key].licenseStartDate,
                            edate: quotation[key].licenseEndDate
                        }
                    }
                    var eachProductRevenue = (await getTotalBillingAmountForUserLicense(quotation[key].costPerLicensePerMonth, quotation[key].billingCycle, quotation[key].noOfLicense, dateObject));

                } else {
                    var eachProductRevenue = quotation[key].slaRevenue ? quotation[key].slaRevenue : 0;
                }
                totalProductRevenue += (eachProductRevenue ? eachProductRevenue : 0);
            }
        }
        var actualRevenue = await getRevisedAmountForDeal(discountPercent, totalProductRevenue);
        finalProductbj[pId]["actualRevenue"] += (actualRevenue ? actualRevenue : 0);
        totalActualRevenue += (actualRevenue ? actualRevenue : 0);

        //For Adding Fx Rate
        if (dealData?.dealStatus == 'Submit Quotation for Client Review' || ref.dealData.dealStatus == 'Won' || ref.dealData.dealStatus == "Lost") {
            var fxRatemap = dealData?.fxRateForDeal;
            var calculatedFxRate = await calculateFxRate(dealData?.currency, "USD", fxRatemap)
        }
        else {
            var calculatedFxRate = await calculateFxRate(dealData?.currency, "USD", {})
        }
        var actualRevenueInUSD = actualRevenue * calculatedFxRate;
        finalProductbj[pId]["actualRevenueInUSD"] += (actualRevenueInUSD ? actualRevenueInUSD : 0);
        totalActualRevenueInUSD += (actualRevenueInUSD ? actualRevenueInUSD : 0);
    }

    var discountPercent = dealData?.discountPercent|| 0;
    var vatPercent = dealData?.vatPercent || 0;
    var actualRevenue = await getRevisedAmountForDeal(discountPercent, totalActualRevenue);

    //Adding FX
    if (dealData?.dealStatus == 'Submit Quotation for Client Review' || dealData?.dealStatus == 'Won' || dealData?.dealStatus == "Lost") {
        var fxRatemap = dealData?.fxRateForDeal;
        var calculatedFxRate = await calculateFxRate(dealData?.currency, "USD", fxRatemap)
    }
    else {
        var calculatedFxRate = await calculateFxRate(dealData?.currency, "USD",{})
    }
    var actualRevenueInUSD = actualRevenue * calculatedFxRate;

    var actualRevenueIncludingVAT = await getFinalBillingAmountIncludingVATRate(vatPercent, actualRevenueInUSD);
    let formattedActualRevenueIncludingVAT = await getFormattedAmountByUserPreference(actualRevenueIncludingVAT, 2);

    return formattedActualRevenueIncludingVAT;
}