import { parseISO, subDays, addYears, parse, format, isBefore, addMonths, isAfter, isEqual, add } from "date-fns";
import { getMyInstancesV2, invokeAction, startProcessV2, mapProcessName, invokeTaskScript } from "@/ikon/utils/api/processRuntimeService";
import { Ref } from './type';
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getProfileData } from "@/ikon/utils/actions/auth";

export let ref: Ref = {
    leadDetails: {},
    quarterlyRevenueYearMap: {},
    revenueProductIdMap: {},
    revenueServiceTypeMap: {},
    dealDataProcIdMap: {},
    wonDealsDataProcIdMap: {},
    lostDealsDataProcIdMap: {},
    dealInstanceDataAccountIdMap: {},
    activeDealsDataProcIdMap: {},
    actualRevenueDealIdMap: {},
    expectedRevenueDealIdMap: {},
    quarterWiseRevenueColumnchartData: [],
    allLeads: [],                                     //array of objects to store all leads in a particular year
    chartRootQuarter: "",
    chartRootExpected: "",
    chartRootSuspended: "",
    chartRootDealOutcome: "",
    allDeals: [],                                    //array of objects to store all deals in a particular year
    allLeadsData: [],
    allDealData: [],
    allAccountDetails: [],
    expectedVsActualChartData: [],
    monthlyRevenueYearMap: {},
    totalRevenue: 0,									//stores the total booked Revenue of a year
    totalExpectedRevenue: 0,                          //stores the total expected Revenue of a year
    totalEarnedRevenue: 0,
    totalProductWiseRevenue: 0,
    currExpectedVsActualRevenueCount: 5,
    widgetObj: [],
    // currentDate: moment(),
    currentDate: new Date(),
    defaultDatetimeFormat: "YYYY-MM-DDTHH:mm:ss.SSSZZ",
    // begin: moment().format("YYYY-MM-01"),
    // end: moment().format("YYYY-MM-") + moment().daysInMonth(),
    wonDeals: [],
    lostDeals: [],
    productProcessInstances: [],
    productsWithNoQuotationData: {},
    dealDetailsTop: [],
    WidgetDatas: []
}
const getFXRateMap = async function () {
    var processName = "Fx Rate";
    var projections = ["Data"];
    var predefinedFilters = { "taskName": "View State" };
    const processInstances: any = await getMyInstancesV2({
        softwareId: await getSoftwareIdByNameVersion("Sales CRM", "1.0"),
        accountId: await getActiveAccountId(),
        processName,
        projections,
        predefinedFilters,
    });
    if (processInstances && processInstances.length > 0) {
        ref.fxRateIdMap = processInstances[0] ? (processInstances[0].data ? (processInstances[0].data.fxRates ? processInstances[0].data.fxRates : {}) : {}) : {};
    }
    // console.dir(ref.fxRateIdMap);
}
export const getRef = function () {
    return ref;
}
export const summaryPageEntryPoint = async function () {
    await getFXRateMap();
    await entryPointDropDown();
}

const entryPointDropDown = async function () {
    ref.allLeads = [];
    ref.allDealData = [];
    ref.allLeadsData = [];
    ref.totalActualRevenue = 0;
    ref.totalExpectedNewRevenue = 0;
    ref.year = 2024;
    ref.revExp = "";
    ref.revBook = "";
    ref.revEarn = "";

    await getDataForLead();


    // filterApplyOnSalesPerformance()
}

//getDataForLead takes all leads in a particular year
const getDataForLead = async function () {

    var processName = "Leads Pipeline";
    var projections = ["Data"];
    var predefinedFilters = { taskName: "View State" };
    var processVariableFilters = { leadIdentifier: ref.leadIdentifier };
    const allLeadsArgument: any = await getMyInstancesV2({
        softwareId: await getSoftwareIdByNameVersion("Sales CRM", "1.0"),
        accountId: await getActiveAccountId(),
        processName,
        projections,
        predefinedFilters,
    });
    ref.allLeadsData = [];
    // var allLeadsArgument = arguments[0];
    for (var i = 0; i < allLeadsArgument.length; i++) {
        var updatedYear = new Date(allLeadsArgument[i].data.updatedOn).getFullYear();
        if (updatedYear == ref.year) {
            ref.allLeadsData.push(allLeadsArgument[i].data);
        }
    }
    // console.log(ref.allLeadsData);
    if (ref.allLeadsData.length != 0) {
        getDormantLeads();
    }
    await getDataForDeal(allLeadsArgument);
    //ref.popupOpenLead();
}

const getDormantLeads = function () {
    var chartData = [];
    for (var i = 0; i < ref.allLeadsData.length; i++) {
        if (ref.allLeadsData[i].dealDetails == undefined && ref.allLeadsData[i].activeStatus != "Lead Lost") {
            var leadsLastDate: any = new Date(ref.allLeadsData[i].updatedOn);
            var currentDate: any = new Date();
            var difference = Math.abs(currentDate - leadsLastDate);
            var differenceOfDays = Math.floor(difference / (1000 * 60 * 60 * 24));
            var tempObj: any = {};
            if (differenceOfDays <= 15 && differenceOfDays > 0) {
                tempObj.leadIdentifier = ref.allLeadsData[i].leadIdentifier;
                tempObj.name = ref.allLeadsData[i].organisationDetails.organisationName;
                tempObj.dormantDays = differenceOfDays;
                chartData.push(tempObj);
            }
        }
    }
}

//getDataForDeals takes all deals in a particular year
const getDataForDeal = async function (allLeadsArgument: any) {
    var processName = "Deal";
    var projections = ["Data"];
    var predefinedFilters = { taskName: "View State" };
    //var processVariableFilters = { leadIdentifier: ref.leadIdentifier };
    const dealInstances = await getMyInstancesV2({
        softwareId: await getSoftwareIdByNameVersion("Sales CRM", "1.0"),
        accountId: await getActiveAccountId(),
        processName,
        projections,
        predefinedFilters: predefinedFilters,
    });
    ref.allDealData = [];
    var dealInstancesData: any = []; //array to store all deals, will be used to make the map that will link product and the corresponding deals
    var openDeals = [];
    var wrongDeals = [];
    var rightDeals = [];
    for (var i = 0; i < dealInstances.length; i++) {
        //ref.allDealData.push(arguments[0][i].data);
        dealInstancesData.push(dealInstances[i].data);
    }
    for (var i = 0; i < dealInstancesData.length; i++) {
        var statusOfDeal = getDealStatus(dealInstancesData[i]);
        if (statusOfDeal == "Open") {
            if (dealInstancesData[i].dealStartDate == undefined) {
                wrongDeals.push(dealInstancesData[i])
            }
            openDeals.push(dealInstancesData[i])
        }
    }
    for (var i = 0; i < dealInstancesData.length; i++) {
        var startOfDeal = dealInstancesData[i].dealStartDate;
        var leadIdOfDeal = dealInstancesData[i].leadIdentifier;
        var yearOfDeal = new Date(startOfDeal).getFullYear();
        var statusOfDeal = getDealStatus(dealInstancesData[i]);
        if (leadIdOfDeal == undefined) {
            dealInstancesData[i].sector = "Other"
        }
        else {
            for (var j = 0; j < allLeadsArgument.length; j++) {
                if (leadIdOfDeal == allLeadsArgument[j].data.leadIdentifier) {
                    var sector = allLeadsArgument[j].data.organisationDetails.sector;
                    if (sector == "" || sector == "Other")
                        dealInstancesData[i].sector = "Other";
                    else
                        dealInstancesData[i].sector = sector;
                }
            }
        }
        if (statusOfDeal == "Won") {
            if ((new Date(dealInstancesData[i].dealWonDate).getFullYear()) == ref.year) {
                ref.allDealData.push(dealInstancesData[i]);
            }
        }
        else if (dealInstancesData[i].dealStartDate != undefined && yearOfDeal == ref.year) {
            ref.allDealData.push(dealInstancesData[i]);
            if (statusOfDeal == "Open")
                rightDeals.push(dealInstancesData[i]);
        }
    }
    for (var i = 0; i < ref.allDealData.length; i++) {
        if (ref.allDealData[i].currency != "USD") {
            var fxRatemap = ref.allDealData[i].fxRateForDeal ? ref.allDealData[i].fxRateForDeal : undefined;
            var FXrate = calculateFxRate(ref.allDealData[i].currency, "USD", fxRatemap);
            var expectedRev = ref.allDealData[i].expectedRevenue
            var valueInUSD = expectedRev * FXrate;
            ref.allDealData[i].expectedRevenue = valueInUSD
        }
    }
    // console.log(ref.allDealData);
    // console.log(rightDeals.length);
    var processName2 = "Account";
    var projections2 = ["Data"];
    var predefinedFilters2 = { taskName: "View State" };
    const accountInstances = await getMyInstancesV2({
        softwareId: await getSoftwareIdByNameVersion("Base App", "1.0"),
        accountId: await getActiveAccountId(),
        processName: processName2,
        projections: projections2,
        predefinedFilters: predefinedFilters2,
    });
    var accountInstancesData = [];
    for (var i = 0; i < accountInstances.length; i++) {
        accountInstancesData.push(accountInstances[i].data);
    }

    // console.log(accountInstancesData);
    ref.allAccountDetails = accountInstancesData;
    //ref.makeDealPipelineMap(dealInstancesData,productInstancesData);
    if (ref.allDealData.length > 0) {
        countForSalesPerformance();
        makeSectorWiseData();
        fetchDealsOutcomesData();
        renderHeatmapChart();
        await salesConversionRatio();
        await getRevenueforDeals();
        var productDetails = [];
        for (var i = 0; i < ref.allDealData.length; i++) {
            var eachData = ref.allDealData[i];
            let j: string
            for (j in eachData.productDetails) {
                var productData = eachData.productDetails[j]
                productDetails.push(productData);
            }
        }
        // +++++++++++ Products by Product Name +++++++++++++
        fetchDealsByTypeOfDeals(productDetails);
        // +++++++++++ Dormant Deals +++++++++++++
        // getSuspendedDealData();
    }
    else {
        // var template = Handlebars.compile(ref.hbFragmentsMap['No Data Available Template']);
        // var content = template({
        //     "data": "sales",
        // });
        // $("#sectorWiseDiv").html(content)
        // $("#leadSummaryDiv").html(content)
        // $("#dealsOutcomesChartDiv").html(content)
        // $("#dealsWonChartDiv").html(content)
        // $("#successRatioDiv").html(content)
        // $("#dealsByDealsTypeChartDiv").html(content);
        // $("#expectedVsActualListColumnchart").html(content)
        // $("#quarterWiseRevenueColumnchartDiv").html(content)
        // $("#directVsIndirectSalesChartDiv").html(content)
        // $("#suspendedDealsChartDiv").html(content)
        // $("#top10DealsTableContainerDiv").html(content)
        // $("#sectorWiseRevenueDiv").html(content)
        // $("#salesLeaderBoardChartDiv").html(content)
        // ref.loadWidgets();
    }
    //ref.renderDealSummarySection();
}

const getDealStatus = function (dealDemoObject: any) {   //accepts an object returns a generalised status
    if (dealDemoObject.dealStatus == "Won" && dealDemoObject.dealWonDate != undefined)
        return "Won";
    if (dealDemoObject.activeStatus == "Deal Lost" || dealDemoObject.dealStatus == "Lost") {
        return "Lost"
    }
    if (dealDemoObject.activeStatus == "Suspended" || dealDemoObject.dealStatus == "Suspended") {
        return "Suspended"
    }
    if (dealDemoObject.activeStatus == "Open" || dealDemoObject.activeStatus == undefined) {
        if (dealDemoObject.dealStatus != "Won") {
            return "Open";
        }
    }
}

const calculateFxRate = function (selectedCurrency: any, baseCurrency: any, fxrateMap?: any) {
    var tempFxRateObj = ref.fxRateIdMap ? JSON.parse(JSON.stringify(ref.fxRateIdMap)) : {};
    var currencyWiseFxRate: any = {};

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
        // year = moment().format("YYYY");
        year = new Date().getFullYear().toString();

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

//countForSalesPerformance counts the sales performance of a year and shows it in the table



const countForSalesPerformance = function () {
    //counting the deals
    var dealStatus = {
        "Open": 0,
        "Won": 0,
        "Lost": 0,
    }
    // console.log(ref.allDealData);
    // console.log("deals length+++++++++>" + ref.allDealData.length);
    for (var i = 0; i < ref.allDealData.length; i++) {
        var statusOfDeal = getDealStatus(ref.allDealData[i]);
        if (statusOfDeal == "Won")
            dealStatus.Won++;
        if (statusOfDeal == "Open")
            dealStatus.Open++;
        if (statusOfDeal == "Lost" || statusOfDeal == "Suspended")
            dealStatus.Lost++;
    }
    //counting the leads
    var leadStatus = { "Open": 0 }
    for (var i = 0; i < ref.allLeadsData.length; i++) {
        if (ref.allLeadsData[i].dealDetails == undefined && ref.allLeadsData[i].activeStatus != "Lead Lost")
            leadStatus.Open++;
    }
    //ref.salesPerformanceTable(dealStatus,leadStatus);
    let allDetailsOfTable = [
        {
            category: "New Leads",
            count: leadStatus.Open,

        }, {
            category: "New Deals",
            count: dealStatus.Open,
        }, 
        // {
        //     category: "Won Deals",
        //     count: dealStatus.Won
        // }, {
        //     category: "Lost Deals",
        //     count: dealStatus.Lost
        // }, {
        //     category: "Account",
        //     count: ref.allAccountDetails.length
        // }
    ];

    let columnConfigArray = [
        {
            title: "Category",
            dataField: "category",
            class: ""
        }, {
            title: "Count",
            dataField: "count",
            // createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
            //     $(cell).html(`<span onclick ="ModuleLandingPage1720590812942.loadBreakup('${rowIndex}','${rowData}')"><a href="#" class="link-primary pe-auto link-underline-opacity-100-hover">${cellData}</a></span>`);
            // },
            class: "text-end"
        }];
    var columnSchemaOfSalesPerformanceTable: any = columnSchema(columnConfigArray);
    ref.columnSchemaOfSalesPerformanceTable = columnSchemaOfSalesPerformanceTable;
    ref.allDetailsOfTable = allDetailsOfTable;
}


export const countForWidget = () => {
    var dealStatus = {
        "Open": 0,
        "Won": 0,
        "Lost": 0,
    }
    // console.log(ref.allDealData);
    // console.log("deals length+++++++++>" + ref.allDealData.length);
    for (var i = 0; i < ref.allDealData.length; i++) {
        var statusOfDeal = getDealStatus(ref.allDealData[i]);
        if (statusOfDeal == "Won")
            dealStatus.Won++;
        if (statusOfDeal == "Open")
            dealStatus.Open++;
        if (statusOfDeal == "Lost" || statusOfDeal == "Suspended")
            dealStatus.Lost++;
    }
    let allDetailsOfTable = [
        {
            category: "Won Deals",
            count: dealStatus.Won
        }, {
            category: "Lost Deals",
            count: dealStatus.Lost
        }, {
            category: "Account",
            count: ref.allAccountDetails.length
        }]

        ref.WidgetDatas = allDetailsOfTable;
        return allDetailsOfTable;
}

export const loadWidget = function () {
    countForWidget();
    const wonDealsRecord = ref.WidgetDatas.filter((allDetailOfTable: Record<string, string | number>) => allDetailOfTable.category === "Won Deals");
    const wonDealsCount = wonDealsRecord.length ? wonDealsRecord[0]?.count : 0;

    const lostDealsRecord = ref.WidgetDatas.filter((allDetailOfTable: Record<string, string | number>) => allDetailOfTable.category === "Lost Deals");
    const lostDealsCount = lostDealsRecord.length ? lostDealsRecord[0]?.count : 0;

    const accountRecord = ref.WidgetDatas.filter((allDetailOfTable: Record<string, string | number>) => allDetailOfTable.category === "Account");
    const accountCount = accountRecord.length ? accountRecord[0]?.count : 0;

    ref.widgetObj = [{
        "widgetText": "Expected Revenue",
        "widgetNumber": "0",
        "iconName": "dollar-sign",
        "id": "expectedRevenueCtr"
    }, {
        "widgetText": "Actual Revenue",
        "widgetNumber": "0",
        "iconName": "dollar-sign",
        "id": "bookedRevenueCtr"
    }, {
        "widgetText": "Earned Revenue",
        "widgetNumber": "0",
        "iconName": "dollar-sign",
        "id": "earnedRevenueCtr"
    }, {
        "widgetText": "Open Deals",
        "widgetNumber": "0",
        "iconName": "sticky-note",
        "id": "totalActiveDealCount"
    }, {
        "widgetText": "Open Leads",
        "widgetNumber": "0",
        "iconName": "mail-open",
        "id": "openLeadsCtr"
    }, {
        "widgetText": "Year",
        "widgetNumber": `2024`,
        "iconName": "calendar",
        "id": "currentYear"
    },
    {
        "widgetText": "Won Deals",
        "widgetNumber": wonDealsCount,
        "iconName": "calendar",
        "id": "wonDeal"
    },
    {
        "widgetText": "Lost Deals",
        "widgetNumber": lostDealsCount,
        "iconName": "calendar",
        "id": "lostDeal"
    },
    {
        "widgetText": "Account",
        "widgetNumber": accountCount,
        "iconName": "calendar",
        "id": "account"
    }
    ]
    return ref.widgetObj;
}

//makeSectorWiseData makes the data that is used for dividing the deals into sector of industry. If its a direct deal it is shown in Other sector
const makeSectorWiseData = function () {
    var sectorWiseData = [
        { "sector": "Telecommunications", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Retail", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Advertising", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Manufacturing", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Automotive", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Construction and Engineering", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Transportation", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Transport", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Software", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Infrastructure", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Food", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Financial Services", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Oil and Gas", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Consultancy Services", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Accounting", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Technology", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Engineering", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Food and Beverage", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Aviation", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Insurance", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
        { "sector": "Other", "count": 0, "openCount": 0, "wonCount": 0, "lostCount": 0, "suspendedCount": 0 },
    ];
    var chartData = [];
    for (var i = 0; i < ref.allDealData.length; i++) {
        var currentDeal = ref.allDealData[i];
        var sector = currentDeal.sector;
        for (var k = 0; k < sectorWiseData.length; k++) {
            if (sector == sectorWiseData[k].sector) {
                sectorWiseData[k].count++;
                var statusOfDeal = getDealStatus(currentDeal);
                if (statusOfDeal == "Won") {
                    sectorWiseData[k].wonCount++;
                }
                else if (statusOfDeal == "Open") {
                    sectorWiseData[k].openCount++;
                }
                else if (statusOfDeal == "Suspended") {
                    sectorWiseData[k].suspendedCount++;
                }
                else {
                    sectorWiseData[k].lostCount++;
                }
                break;
            }
        }
    }
    for (var i = 0; i < sectorWiseData.length; i++) {
        if (sectorWiseData[i].count != 0) {
            var tempObj: any = {};
            tempObj.sector = sectorWiseData[i].sector;
            tempObj.count = sectorWiseData[i].count;
            tempObj.wonCount = sectorWiseData[i].wonCount;
            tempObj.openCount = sectorWiseData[i].openCount;
            tempObj.lostCount = sectorWiseData[i].lostCount;
            tempObj.suspendedCount = sectorWiseData[i].suspendedCount;
            chartData.push(tempObj);
        }
    }
    ref.sectorWiseData = chartData;
    // renderSectorWiseDeals(chartData);
}

const renderHeatmapChart = function () {
    var chartData = [];
    //var yearOfHeatMap=$('input[name="timeWiseDataFilter"]:checked').val();
    var monthOfDealArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dealPosition = ["Won", "Lost", "Suspended", "Open"];
    for (var i = 0; i < monthOfDealArray.length; i++) {
        for (var j = 0; j < dealPosition.length; j++) {
            var tempObj: any = {}
            tempObj.month = monthOfDealArray[i];
            tempObj.dealStatus = dealPosition[j];
            if (dealPosition[j] == "Open")
                tempObj.colorMap = { fill: "#5D90F9" };
            else if (dealPosition[j] == "Suspended")
                tempObj.colorMap = { fill: "#D58AF8" };
            else if (dealPosition[j] == "Won")
                tempObj.colorMap = { fill: "#47C99D" };
            else
                tempObj.colorMap = { fill: "#FE7A7C" };
            tempObj.index = monthOfDealArray[i] + dealPosition[j];
            tempObj.count = 0;
            //tempObj.year=yearOfHeatMap;
            chartData.push(tempObj);
        }
    }
    for (var i = 0; i < ref.allDealData.length; i++) {
        var dealStartDate = ref.allDealData[i].dealStartDate;
        var dealWonDate = ref.allDealData[i].dealWonDate;
        var statusOfDeal = getDealStatus(ref.allDealData[i]);
        var startedMonth = new Date(dealStartDate).getMonth();
        var dealWonMonth = new Date(dealWonDate).getMonth();
        var dealWonYear = new Date(dealWonDate).getFullYear();
        var currentStatus = "";
        var statusToBePushed = "";
        var indexOfDeal = "";
        //var activeStatus=ref.allDealDetails[i].activeStatus;
        //var dStatus=ref.allDealDetails[i].dealStatus;
        if (statusOfDeal == "Won" && dealWonYear == ref.year) {
            indexOfDeal = monthOfDealArray[dealWonMonth] + statusOfDeal;
        }
        else {
            indexOfDeal = monthOfDealArray[startedMonth] + statusOfDeal;
        }
        for (var j = 0; j < chartData.length; j++) {
            if (indexOfDeal == chartData[j].index) {
                chartData[j].count++;
                break;
            }
        }
    }
    const monthIndex: { [key: string]: number } = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11
    };
    const dealStatus: { [key: string]: number } = {
        Open: 0,
        Suspended: 1,
        Lost: 2,
        Won: 3,
    }
    let chartData2: number[][] = [];
    for (let i = 0; i < chartData.length; i++) {
        let tempArr = [];
        tempArr.push(dealStatus[chartData[i].dealStatus]);
        tempArr.push(monthIndex[chartData[i].month]);
        tempArr.push(chartData[i].count);
        chartData2.push(tempArr);
    }
    // console.log(chartData2);
    let HeatMapData = chartData2.map(function (item) {
        return [item[1], item[0], item[2] || 0];
    });
    ref.HeatMapData = HeatMapData;
    // console.log(HeatMapData);
}

const fetchDealsOutcomesData = function () {

    // $("#dealsOutcomesChartDiv").html("");
    let dealStatus = {
        "Open": 0,
        "Won": 0,
        "Lost": 0,
        "Suspended": 0
    }
    for (var i = 0; i < ref.allDealData.length; i++) {
        var statusOfDeal = getDealStatus(ref.allDealData[i]);
        if (statusOfDeal == "Won")
            dealStatus.Won++;
        if (statusOfDeal == "Open")
            dealStatus.Open++;
        if (statusOfDeal == "Lost")
            dealStatus.Lost++;
        if (statusOfDeal == "Suspended")
            dealStatus.Suspended++;
    }

    var chartData = [];
    if (dealStatus["Open"] != 0) {
        chartData.push({ "name": "Open", "color": "#5D90F9", "value": dealStatus["Open"] ? dealStatus["Open"] : 0 })
    }
    if (dealStatus["Won"] != 0) {
        chartData.push({ "name": "Won", "color": "#47C99D", "value": dealStatus["Won"] ? dealStatus["Won"] : 0 })
    }
    if (dealStatus["Lost"] != 0) {
        chartData.push({ "name": "Lost", "color": "#FE7A7C", "value": dealStatus["Lost"] ? dealStatus["Lost"] : 0 })
    }
    if (dealStatus["Suspended"] != 0) {
        chartData.push({ "name": "Suspended", "color": "#D58AF8", "value": dealStatus["Suspended"] ? dealStatus["Suspended"] : 0 })
    }

    let confgurationObj = {
        valueKey: "value",
        categoryKey: "key",
        showLegend: true,
        innerRadius: 40,
        version: 4
    }
    ref.PieChartData = chartData;
    // console.log(ref.PieChartData);
}

//salesConversionRatio computes the comparative table of deals - Deals Conversion Success Ratio
const salesConversionRatio = async function () {
    const profileData = await getProfileData();
    const userId = profileData.USER_ID
    var quarterWiseCount: any = {
        "Q1": { quarterIndex: "Q1", companyOpen: 0, companyLost: 0, companyWon: 0, companySuspended: 0, userOpen: 0, userWon: 0, userLost: 0, userSuspended: 0 },
        "Q2": { quarterIndex: "Q2", companyOpen: 0, companyLost: 0, companyWon: 0, companySuspended: 0, userOpen: 0, userWon: 0, userLost: 0, userSuspended: 0 },
        "Q3": { quarterIndex: "Q3", companyOpen: 0, companyLost: 0, companyWon: 0, companySuspended: 0, userOpen: 0, userWon: 0, userLost: 0, userSuspended: 0 },
        "Q4": { quarterIndex: "Q4", companyOpen: 0, companyLost: 0, companyWon: 0, companySuspended: 0, userOpen: 0, userWon: 0, userLost: 0, userSuspended: 0 },
        "Year": { quarterIndex: "Summary of " + ref.year + "", companyOpen: 0, companyLost: 0, companyWon: 0, companySuspended: 0, userOpen: 0, userWon: 0, userLost: 0, userSuspended: 0 }
    };
    var countDeals = {
        "Open": 0,
        "Won": 0,
        "Suspended": 0,
        "Lost": 0,
        "All": 0
    };
    var openDealsArray = [];
    var lostDealsArray = [];
    var wonDealsArray = [];
    var suspendDealsArray = [];
    var currentUser = userId;
    for (var i = 0; i < ref.allDealData.length; i++) {

        var statusOfDeal = getDealStatus(ref.allDealData[i]);

        if (ref.allDealData[i].accountDetails != undefined || ref.allDealData[i].leadIdentifier != undefined) {
            if (ref.allDealData[i].accountDetails != undefined)
                var dealAccountManager = ref.allDealData[i].accountDetails.accountManager;
            var leadManager = "";
            var leadIdentifier = ref.allDealData[i].leadIdentifier;
            for (var j = 0; j < ref.allLeadsData.length; j++) {
                if (leadIdentifier == ref.allLeadsData[j].leadIdentifier) {
                    leadManager = ref.allLeadsData[j].teamInformation.salesManager;
                    break;
                }
            }
            if (statusOfDeal == "Open") {
                var quarter = getDealQuarter(ref.allDealData[i].dealStartDate);
                quarterWiseCount[quarter].companyOpen++;
                quarterWiseCount["Year"].companyOpen++;
                if (currentUser == dealAccountManager || currentUser == leadManager) {
                    quarterWiseCount[quarter].userOpen++;
                    quarterWiseCount["Year"].userOpen++;
                }
                countDeals.Open++;
                openDealsArray.push(ref.allDealData[i]);

            }
            else if (statusOfDeal == "Won") {
                var quarter = getDealQuarter(ref.allDealData[i].dealWonDate);
                quarterWiseCount[quarter].companyWon++;
                quarterWiseCount["Year"].companyWon++;
                if (currentUser == dealAccountManager || currentUser == leadManager) {
                    quarterWiseCount[quarter].userWon++;
                    quarterWiseCount["Year"].userWon++;
                }
                countDeals.Won++;
                wonDealsArray.push(ref.allDealData[i]);
            }
            else if (statusOfDeal == "Suspended") {
                var quarter = getDealQuarter(ref.allDealData[i].updatedOn);
                quarterWiseCount[quarter].companySuspended++;
                quarterWiseCount["Year"].companySuspended++;
                if (currentUser == dealAccountManager || currentUser == leadManager) {
                    quarterWiseCount[quarter].userSuspended++;
                    quarterWiseCount["Year"].userSuspended++;
                }
                countDeals.Suspended++;
                suspendDealsArray.push(ref.allDealData[i]);
            }
            else {
                var quarter = getDealQuarter(ref.allDealData[i].updatedOn);
                quarterWiseCount[quarter].companyLost++;
                quarterWiseCount["Year"].companyLost++;
                if (currentUser == dealAccountManager || currentUser == leadManager) {
                    quarterWiseCount[quarter].userLost++;
                    quarterWiseCount["Year"].userLost++;
                }
                countDeals.Lost++;
                lostDealsArray.push(ref.allDealData[i]);
            }
            countDeals.All++;
        }
    }
    //calculating user deal percentage
    for (var quarter in quarterWiseCount) {
        var openDealsInQuarter = quarterWiseCount[quarter].companyOpen;
        var wonDealsInQuarter = quarterWiseCount[quarter].companyWon;
        var lostDealsInQuarter = quarterWiseCount[quarter].companyLost;
        var suspendedDealsInQuarter = quarterWiseCount[quarter].companySuspended;
        var percentOpenUser = ((quarterWiseCount[quarter].userOpen / openDealsInQuarter) * 100).toFixed(2);
        var percentLostUser = ((quarterWiseCount[quarter].userLost / lostDealsInQuarter) * 100).toFixed(2);
        var percentWonUser = ((quarterWiseCount[quarter].userWon / wonDealsInQuarter) * 100).toFixed(2);
        var percentSuspendedUser = ((quarterWiseCount[quarter].userSuspended / suspendedDealsInQuarter) * 100).toFixed(2);
        if (isNaN(Number(percentOpenUser))) {
            quarterWiseCount[quarter].userOpen = "0.00";
        }
        else {
            quarterWiseCount[quarter].userOpen = percentOpenUser;
        }
        if (isNaN(Number(percentWonUser))) {
            quarterWiseCount[quarter].userWon = "0.00";
        }
        else {
            quarterWiseCount[quarter].userWon = percentWonUser;
        }
        if (isNaN(Number(percentLostUser))) {
            quarterWiseCount[quarter].userLost = "0.00";
        }
        else {
            quarterWiseCount[quarter].userLost = percentLostUser;
        }
        if (isNaN(Number(percentSuspendedUser))) {
            quarterWiseCount[quarter].userSuspended = "0.00";
        }
        else {
            quarterWiseCount[quarter].userSuspended = percentSuspendedUser;
        }
    }
    for (var quarter in quarterWiseCount) {
        var dealsInAQuarter = quarterWiseCount[quarter].companyOpen + quarterWiseCount[quarter].companyWon + quarterWiseCount[quarter].companyLost + quarterWiseCount[quarter].companySuspended;
        if (dealsInAQuarter != 0) {
            quarterWiseCount[quarter].companyOpen = ((quarterWiseCount[quarter].companyOpen / dealsInAQuarter) * 100).toFixed(2);
            quarterWiseCount[quarter].companyWon = ((quarterWiseCount[quarter].companyWon / dealsInAQuarter) * 100).toFixed(2);
            quarterWiseCount[quarter].companyLost = ((quarterWiseCount[quarter].companyLost / dealsInAQuarter) * 100).toFixed(2);
            quarterWiseCount[quarter].companySuspended = ((quarterWiseCount[quarter].companySuspended / dealsInAQuarter) * 100).toFixed(2);
        }
        else {
            quarterWiseCount[quarter].companyOpen = "0.00";
            quarterWiseCount[quarter].companyWon = "0.00";
            quarterWiseCount[quarter].companyLost = "0.00";
            quarterWiseCount[quarter].companySuspended = "0.00";
        }
    }

    // console.log(quarterWiseCount);
    renderSuccessTable(quarterWiseCount)
}

//getDealQuarter accepts a date and returns the quarter for it
const getDealQuarter = function (datePassed: any) {  //accepts a date returns the quarter which it lies in,
    var monthOfDate = new Date(datePassed).getMonth();
    if (monthOfDate >= 0 && monthOfDate <= 2)
        return "Q1";
    else if (monthOfDate >= 3 && monthOfDate <= 5)
        return "Q2";
    else if (monthOfDate >= 6 && monthOfDate <= 8)
        return "Q3";
    else
        return "Q4";
}

const renderSuccessTable = function (quarterWiseCount: any) {
    var dealStatusArr = ['Won', 'Lost', 'Open', 'Suspended'];
    var dealStatusGroupObject: any = {}
    for (var each of dealStatusArr) {
        dealStatusGroupObject[each] = { status: each, q1User: '', q2User: '', q3User: '', q4User: '', q1Company: '', q2Company: '', q3Company: '', q4Company: '' };
    }
    var quarters = ["Q1", "Q2", "Q3", "Q4"];
    for (var i = 0; i < quarters.length; i++) {
        var quarterKey = quarters[i];
        var quarterValue = quarterWiseCount[quarterKey];

        dealStatusGroupObject["Won"]["q" + (i + 1) + "User"] = quarterValue.userWon + "%";
        dealStatusGroupObject["Won"]["q" + (i + 1) + "Company"] = quarterValue.companyWon + "%";
        dealStatusGroupObject["Lost"]["q" + (i + 1) + "User"] = quarterValue.userLost + "%";
        dealStatusGroupObject["Lost"]["q" + (i + 1) + "Company"] = quarterValue.companyLost + "%";
        dealStatusGroupObject["Open"]["q" + (i + 1) + "User"] = quarterValue.userOpen + "%";
        dealStatusGroupObject["Open"]["q" + (i + 1) + "Company"] = quarterValue.companyOpen + "%";
        dealStatusGroupObject["Suspended"]["q" + (i + 1) + "User"] = quarterValue.userSuspended + "%";
        dealStatusGroupObject["Suspended"]["q" + (i + 1) + "Company"] = quarterValue.companySuspended + "%";
    }
    var allDetailsOfQuarter: any = Object.values(dealStatusGroupObject);
    var columnConfigArray = [];
    for (var each in allDetailsOfQuarter[0]) {
        let tempObj: any = {};
        if (each == "status") {
            tempObj["title"] = '';
            tempObj["dataField"] = each;
            tempObj["class"] = '';
            tempObj["quarterIndex"] = "q0";
        }
        else {
            let dataField = each;
            let tempDataField = each;
            let titleOfCol = tempDataField.charAt(0).toUpperCase() + tempDataField.charAt(1) + " - " + (tempDataField.substring(2) == "User" ? "Self" : tempDataField.substring(2));
            tempObj["title"] = titleOfCol;
            tempObj["dataField"] = dataField;
            tempObj["class"] = 'text-end';
            tempObj["quarterIndex"] = tempDataField.substring(0, 2);
        }
        columnConfigArray.push(tempObj);
    }
    var order = ["q0", "q1", "q2", "q3", "q4"];
    columnConfigArray.sort(function (a, b) {
        return order.indexOf(a.quarterIndex) - order.indexOf(b.quarterIndex);
    });
    var columnSchemaOfSuccessTable: any = columnSchema(columnConfigArray);
    ref.columnSchemaOfSuccessTable = columnSchemaOfSuccessTable;
    ref.DataOfSuccessTable = allDetailsOfQuarter;
    // console.log(ref.DataOfSuccessTable);
    // ref.createLeadDataTable(allDetailsOfQuarter, columnSchema, "successRatioTable");
}

const columnSchema = function (columnConfigArray: any) {
    var columnDetailsSchema = [];
    for (var each of columnConfigArray) {
        columnDetailsSchema.push({
            title: each.title,
            data: each.dataField,
            orderable: false,
            createdCell: each.createdCell ? each.createdCell : '',
            visible: true,
            className: each.class,
            defaultContent: "n/a",
            type: 'string',
            cellType: 'td',
            responsivePriority: 2,
            draggableHeader: false,
            searchable: false,
        })
    }
    return columnDetailsSchema;
}


//getRevenueforDeals is the main function. It controls the permissions and also calculates revenue
const getRevenueforDeals = async function () {
    // ref.wonDeals = [];
    ref.lostDeals = [];
    ref.revenueDetailsDealIdMap = {};
    ref.lineChartForDealsWon = {};
    ref.allDealInstances = ref.allDealData;
    var dealDetails = ref.allDealData;
    var productDetails = new Array();
    var lengthOfDeals = dealDetails.length;
    var wonCount = 0;
    ref.totalEarnedRevenue = 0;
    var leadsLength = ref.allLeadsData.length;
    var dealsLength = ref.allDealData.length;
    if (lengthOfDeals != 0) {
        ref.dealCountDateMap = {};
        for (var i = 0; i < lengthOfDeals; i++) {
            var eachData = dealDetails[i];
            for (var j in eachData.productDetails) {
                var productData = eachData.productDetails[j]
                productDetails.push(productData);
            }
        }
        ref.allDealData = dealDetails;
        var processName2 = "Product";
        var projections2 = ["Data"];
        var predefinedFilters2 = { taskName: "View State" };
        const productInstances: any = await getMyInstancesV2({
            softwareId: await getSoftwareIdByNameVersion("Sales CRM", "1.0"),
            accountId: await getActiveAccountId(),
            processName: processName2,
            projections: projections2,
            predefinedFilters: predefinedFilters2,
        });
        ref.wonDeals = [];
        ref.productProcessInstances = productInstances;
        ref.overallDiscountDealIdMap = {};
        ref.productDiscountProductIdMap = {};
        for (var i = 0; i < dealDetails.length; i++) {
            var thisData = dealDetails[i];
            ref.overallDiscountDealIdMap[thisData.dealIdentifier] = thisData.discountPercent ? thisData.discountPercent : 0;
            ref.revenueDetailsDealIdMap[thisData.dealIdentifier] = {
                revenue: 0,
                productList: []
            };
            var productDetails: any[] = thisData.productDetails;
            for (var productId in productDetails) {
                var thisProductDetails = productDetails[productId];
                ref.productDiscountProductIdMap[productId] = thisProductDetails.discountPercent ? thisProductDetails.discountPercent : 0;
                ref.revenueDetailsDealIdMap[thisData.dealIdentifier].productList.push(thisProductDetails.productType);
            }
        }
        ref.productProcessInstances = productInstances;
        ref.productsArrayProductTypeMap = {};
        ref.dealDataProductTypeMap = {};
        ref.productsWithNoQuotationData = {};
        ref.productTypeProductTypeMap = {};
        ref.productDataProcIdMap = {};
        for (var i = 0; i < ref.productProcessInstances.length; i++) {
            var thisProductProcessInstance = ref.productProcessInstances[i];
            var thisData = thisProductProcessInstance.data;
            var productId: string = thisData.productIdentifier;
            ref.productDataProcIdMap[productId] = thisData;
        }
        for (var i = 0; i < lengthOfDeals; i++) {
            var thisDeal = dealDetails[i];
            var statusOfDeal = getDealStatus(thisDeal);
            var currency = thisDeal.currency;
            if (currency != "USD") {
                var fxRatemap = thisDeal.fxRateForDeal ? thisDeal.fxRateForDeal : undefined;
                var fxRate = calculateFxRate(currency, "USD", fxRatemap);
            }
            else {
                var fxRate = calculateFxRate(currency, "USD");
            }
            var vatPercent = thisDeal.vatPercent ? thisDeal.vatPercent : 0;
            var revenue = 0;
            if (statusOfDeal == "Won") {
                wonCount++;
                var productDetails: any[] = thisDeal.productDetails;
                var productsCount = Object.keys(productDetails).length;
                var productsWithQuotationCount = 0;
                for (const productId in productDetails) {
                    const productData = ref.productDataProcIdMap[productId];
                    const quotationIdMap = productData?.quotation;
                    let productRevenue = 0;
                    const productType = productData?.productType;
                    let productHasQuotationData = true;
                    if ((productType == "User License" || productType == "Professional Service" || productType == "Service Level Agreement") && (!quotationIdMap || Object.keys(quotationIdMap).length == 0)) {
                        productHasQuotationData = false;
                    }
                    //const productType = productData.productType;
                    if (productType == "User License") {
                        for (const quotationId in quotationIdMap) {
                            const thisQuotation = quotationIdMap[quotationId];
                            const costPerLicensePerMonth = thisQuotation.costPerLicensePerMonth;
                            const costPerLicensePerMonthWithFxRate = costPerLicensePerMonth * fxRate;
                            const noOfLicense = thisQuotation.noOfLicense;
                            const totalCostOfOneMonthDiscounted = getRevisedAmountForDeal(
                                ref.productDiscountProductIdMap[productData.productIdentifier] ? ref.productDiscountProductIdMap[productData.productIdentifier] : 0,
                                noOfLicense * costPerLicensePerMonthWithFxRate
                            );
                            const totalCostOfOneMonthDiscountedOverall = getRevisedAmountForDeal(
                                ref.overallDiscountDealIdMap[productData.dealIdentifier] ? ref.overallDiscountDealIdMap[productData.dealIdentifier] : 0,
                                totalCostOfOneMonthDiscounted
                            );
                            const totalCostOfOneMonthDiscountedOverallWithVat = getFinalBillingAmountIncludingVATRate(vatPercent, totalCostOfOneMonthDiscountedOverall);



                            // const licenseStartDate = moment(thisQuotation.licenseStartDate, "YYYY-MM-DD");
                            // let licenseEndDate = moment(thisQuotation.licenseEndDate, "YYYY-MM-DD");

                            const licenseStartDate = parse(thisQuotation.licenseStartDate, "yyyy-MM-dd", new Date());
                            let licenseEndDate = parse(thisQuotation.licenseEndDate, "yyyy-MM-dd", new Date());
                            // console.log(licenseStartDate);
                            // console.log(licenseEndDate);

                            if (thisQuotation.billingCycle != "Custom") {
                                const calculatedDate = calculateEndDateForUserLicense(thisQuotation.licenseStartDate, thisQuotation.billingCycle);
                                // licenseEndDate = moment(calculatedDate, "YYYY-MM-DD");
                                licenseEndDate = parse(calculatedDate, "yyyy-MM-dd", new Date());
                            }
                            // const licenseEndDate = moment(thisQuotation.licenseEndDate, "YYYY-MM-DD");

                            // const licenseStartDayOnly = Number(licenseStartDate.format("DD"));
                            // const licenseEndDayOnly = Number(licenseEndDate.format("DD"));

                            // if (thisQuotation.billingCycle == "Custom" && licenseEndDayOnly > licenseStartDayOnly) {
                            //     licenseEndDate.add(1, "months");
                            // }
                            // for (let j = licenseStartDate.clone(); j.isBefore(licenseEndDate); j.add(1, "months")) {
                            for (let j = licenseStartDate; isBefore(j, licenseEndDate); j = addMonths(j, 1)) {
                                // const thisYear = j.format("yyyy");
                                // const thisMonth = j.format("MM");
                                // console.log(j);
                                const thisYear = format(j, "yyyy");
                                const thisMonth = format(j, "MM");


                                if (!ref.monthlyRevenueYearMap[thisYear]) {
                                    ref.monthlyRevenueYearMap[thisYear] = {};
                                }
                                if (!ref.monthlyRevenueYearMap[thisYear][thisMonth]) {
                                    ref.monthlyRevenueYearMap[thisYear][thisMonth] = {
                                        revenue: 0,
                                        deals: {}
                                    };
                                }
                                ref.monthlyRevenueYearMap[thisYear][thisMonth].revenue += totalCostOfOneMonthDiscountedOverallWithVat;
                                if (!ref.monthlyRevenueYearMap[thisYear][thisMonth].deals[thisData.dealIdentifier]) {
                                    ref.monthlyRevenueYearMap[thisYear][thisMonth].deals[thisData.dealIdentifier] = {
                                        dealName: thisData.dealName,
                                        products: {},
                                        revenue: 0
                                    };
                                }
                                ref.monthlyRevenueYearMap[thisYear][thisMonth].deals[thisData.dealIdentifier].products[productId] = totalCostOfOneMonthDiscountedOverallWithVat;
                                ref.monthlyRevenueYearMap[thisYear][thisMonth].deals[thisData.dealIdentifier].revenue += totalCostOfOneMonthDiscountedOverallWithVat;
                                if (!ref.quarterlyRevenueYearMap[thisYear]) {
                                    ref.quarterlyRevenueYearMap[thisYear] = {};
                                }
                                const thisQuarter = getQuarterFromDate(thisMonth);
                                if (!ref.quarterlyRevenueYearMap[thisYear][thisQuarter]) {
                                    ref.quarterlyRevenueYearMap[thisYear][thisQuarter] = {
                                        revenue: 0,
                                        deals: {}
                                    };
                                }
                                ref.quarterlyRevenueYearMap[thisYear][thisQuarter].revenue += totalCostOfOneMonthDiscountedOverallWithVat;
                                if (!ref.quarterlyRevenueYearMap[thisYear][thisQuarter].deals[thisData.dealIdentifier]) {
                                    ref.quarterlyRevenueYearMap[thisYear][thisQuarter].deals[thisData.dealIdentifier] = {};
                                }
                                ref.quarterlyRevenueYearMap[thisYear][thisQuarter].deals[thisData.dealIdentifier][productId] = true;
                                productRevenue += totalCostOfOneMonthDiscountedOverallWithVat;
                            }
                        }
                    }
                    else if (productType == "Professional Service") {
                        const thisTaskList = productData.scheduleData ? productData.scheduleData.task : null;
                        if (thisTaskList && thisTaskList.length > 0) {
                            let startDate = parse(thisTaskList[0].taskStart, "yyyy-MM-dd", new Date());
                            let endDate = thisTaskList[0].taskEnd ? parse(thisTaskList[0].taskEnd, "yyyy-MM-dd", new Date()) : new Date();
                            // let startDate = moment(thisTaskList[0].taskStart);
                            // let endDate = moment(thisTaskList[0].taskEnd);
                            // console.log("startDate:" +startDate);
                            // console.log("endDate: " +endDate);
                            // console.log("startDate2:" +startDate2);
                            // console.log("endDate2: " +endDate2);
                            for (let j = 0; j < thisTaskList.length; ++j) {
                                const thisTask = thisTaskList[j];
                                // const thisStartDate = moment(thisTaskList[j].taskStart);
                                // const thisEndDate = moment(thisTaskList[j].taskEnd);
                                const thisStartDate = parse(thisTaskList[0].taskStart, "yyyy-MM-dd", new Date());
                                const thisEndDate = thisTaskList[0].taskEnd ? parse(thisTaskList[0].taskEnd, "yyyy-MM-dd", new Date()) : new Date();
                                // if (thisStartDate.isSameOrBefore(startDate)) {
                                //     startDate = thisStartDate.clone();
                                // }
                                // if (thisEndDate.isSameOrAfter(endDate)) {
                                //     endDate = thisEndDate.clone();
                                // }
                                if (isBefore(thisStartDate, startDate) || isEqual(thisStartDate, startDate)) {
                                    startDate = thisStartDate;
                                }
                                if (isAfter(thisEndDate, endDate) || isEqual(thisEndDate, endDate)) {
                                    endDate = thisEndDate;
                                }
                            }
                            for (const quotationId in quotationIdMap) {
                                const thisQuotation = quotationIdMap[quotationId];
                                const revenueByExpenses = getTotalBillingAmountForPS(thisQuotation.scr, thisQuotation.expenses, thisQuotation.otherCosts, thisQuotation.totalFTE);
                                const revenueByExpensesWithFxRate = revenueByExpenses * fxRate;
                                const totalCostOfOneMonthDiscounted = getRevisedAmountForDeal(
                                    ref.productDiscountProductIdMap[productData.productIdentifier] ? ref.productDiscountProductIdMap[productData.productIdentifier] : 0,
                                    revenueByExpensesWithFxRate
                                );
                                const totalCostOfOneMonthDiscountedOverall = getRevisedAmountForDeal(
                                    ref.overallDiscountDealIdMap[productData.dealIdentifier] ? ref.overallDiscountDealIdMap[productData.dealIdentifier] : 0,
                                    totalCostOfOneMonthDiscounted
                                );
                                const totalCostOfOneMonthDiscountedOverallWithVat = getFinalBillingAmountIncludingVATRate(vatPercent, totalCostOfOneMonthDiscountedOverall);
                                // for (let j = startDate.add(1, "months").clone(); j.isSameOrBefore(endDate); j.add(1, "months")) {
                                for (let j = add(startDate, { months: 1 }); isBefore(j, startDate) || isEqual(j, startDate); j = addMonths(j, 1)) {
                                    // const thisYear = j.format("YYYY");
                                    // const thisMonth = j.format("MM");
                                    const thisYear = format(j, "YYYY");
                                    const thisMonth = format(j, "MM");
                                    if (!ref.monthlyRevenueYearMap[thisYear]) {
                                        ref.monthlyRevenueYearMap[thisYear] = {};
                                    }
                                    if (!ref.monthlyRevenueYearMap[thisYear][thisMonth]) {
                                        ref.monthlyRevenueYearMap[thisYear][thisMonth] = {
                                            revenue: 0,
                                            deals: {}
                                        };
                                    }
                                    ref.monthlyRevenueYearMap[thisYear][thisMonth].revenue += totalCostOfOneMonthDiscountedOverallWithVat;
                                    if (!ref.monthlyRevenueYearMap[thisYear][thisMonth].deals[thisData.dealIdentifier]) {
                                        ref.monthlyRevenueYearMap[thisYear][thisMonth].deals[thisData.dealIdentifier] = {
                                            dealName: thisData.dealName,
                                            products: {},
                                            revenue: 0
                                        };
                                    }
                                    ref.monthlyRevenueYearMap[thisYear][thisMonth].deals[thisData.dealIdentifier].products[productId] = totalCostOfOneMonthDiscountedOverallWithVat;
                                    ref.monthlyRevenueYearMap[thisYear][thisMonth].deals[thisData.dealIdentifier].revenue += totalCostOfOneMonthDiscountedOverallWithVat;
                                    if (!ref.quarterlyRevenueYearMap[thisYear]) {
                                        ref.quarterlyRevenueYearMap[thisYear] = {};
                                    }
                                    const thisQuarter = getQuarterFromDate(thisMonth);
                                    if (!ref.quarterlyRevenueYearMap[thisYear][thisQuarter]) {
                                        ref.quarterlyRevenueYearMap[thisYear][thisQuarter] = {
                                            revenue: 0,
                                            deals: {}
                                        };
                                    }
                                    ref.quarterlyRevenueYearMap[thisYear][thisQuarter].revenue += totalCostOfOneMonthDiscountedOverallWithVat;
                                    if (!ref.quarterlyRevenueYearMap[thisYear][thisQuarter].deals[thisData.dealIdentifier]) {
                                        ref.quarterlyRevenueYearMap[thisYear][thisQuarter].deals[thisData.dealIdentifier] = {};
                                    }
                                    ref.quarterlyRevenueYearMap[thisYear][thisQuarter].deals[thisData.dealIdentifier][productId] = true;
                                    //		revenue += totalCostOfOneMonthDiscountedOverall;											
                                }
                                productRevenue += totalCostOfOneMonthDiscountedOverallWithVat
                            }
                        }
                        else {
                            ref.productsWithNoQuotationData = true;
                        }
                    }
                    else if (productType == "Service Level Agreement") {
                        for (var quotationId in quotationIdMap) {
                            var thisQuotation = quotationIdMap[quotationId];
                            var billingAmount = thisQuotation.slaRevenue ? thisQuotation.slaRevenue : 0
                            var totalCost = billingAmount * fxRate;
                            var totalCostDiscounted = getRevisedAmountForDeal(
                                ref.productDiscountProductIdMap[productId] ? ref.productDiscountProductIdMap[productId] : 0,
                                totalCost
                            );
                            var totalCostDiscountedOverall = getRevisedAmountForDeal(
                                ref.overallDiscountDealIdMap[productData.dealIdentifier] ? ref.overallDiscountDealIdMap[productData.dealIdentifier] : 0,
                                totalCostDiscounted
                            );
                            var totalCostDiscountedOverallWithVat = getFinalBillingAmountIncludingVATRate(vatPercent, totalCostDiscountedOverall);
                            productRevenue += totalCostDiscountedOverallWithVat;
                        }
                    }
                    else {
                        //  									productHasQuotationData = false;  // This line may not be required when other product types are available
                        //  									productRevenue = 0;
                        // For dynamic products
                        var quotationAmt = productData["quotationAmount"];
                        var totalCost = quotationAmt * fxRate;
                        var totalCostDiscounted = getRevisedAmountForDeal(
                            ref.productDiscountProductIdMap[productId] ? ref.productDiscountProductIdMap[productId] : 0,
                            totalCost
                        );
                        var totalCostDiscountedOverall = getRevisedAmountForDeal(
                            ref.overallDiscountDealIdMap[productData.dealIdentifier] ? ref.overallDiscountDealIdMap[productData.dealIdentifier] : 0,
                            totalCostDiscounted
                        );
                        var totalCostDiscountedOverallWithVat = getFinalBillingAmountIncludingVATRate(vatPercent, totalCostDiscountedOverall);
                        productRevenue += totalCostDiscountedOverallWithVat;
                    }
                    if (!productHasQuotationData) {
                        continue;
                    }
                    ++productsWithQuotationCount;
                    // 									if (!ref.productsArrayProductTypeMap[productType]) {
                    // 										ref.productsArrayProductTypeMap[productType] = {};
                    // 									}
                    if (!ref.dealDataProductTypeMap[productType]) {
                        ref.dealDataProductTypeMap[productType] = {};
                    }
                    if (!ref.dealDataProductTypeMap[productType][thisData.dealIdentifier]) {
                        ref.dealDataProductTypeMap[productType][thisData.dealIdentifier] = {
                            dealName: thisData.dealName,
                            revenue: 0,
                            products: {}
                        }
                    }
                    if (thisDeal.isDebtRevenue != undefined || thisDeal.isDebtRevenue != "") {
                        if (thisDeal.isDebtRevenue == true) {
                            productRevenue = -productRevenue;
                        }
                    }
                    if (thisDeal.isZeroChecked != undefined || thisDeal.isZeroChecked != "") {
                        if (thisDeal.isZeroChecked == true) {
                            productRevenue = 0;
                        }
                    }
                    ref.dealDataProductTypeMap[productType][thisData.dealIdentifier].revenue += productRevenue;
                    ref.dealDataProductTypeMap[productType][thisData.dealIdentifier].products[productId] = productRevenue;
                    // 									ref.productsArrayProductTypeMap[productType].push({
                    // 										productId: productId,
                    // 										productType: productDetails.productName,
                    // 										revenue: productRevenue
                    // 									});

                    //ref.revenueProductIdMap[thisData.productIdentifier] = revenue;
                    if (!ref.revenueServiceTypeMap[productType]) {
                        ref.revenueServiceTypeMap[productType] = { revenue: 0, deals: {} };
                    }
                    ref.revenueServiceTypeMap[productType].revenue += productRevenue;
                    if (!ref.revenueServiceTypeMap[productType].deals[thisData.dealIdentifier]) {
                        ref.revenueServiceTypeMap[productType].deals[thisData.dealIdentifier] = {};
                    }
                    ref.revenueServiceTypeMap[productType].deals[thisData.dealIdentifier][productId] = productRevenue;
                    ref.totalProductWiseRevenue += productRevenue;
                    revenue += productRevenue;
                }
                if (productsWithQuotationCount == productsCount) {
                    ref.actualRevenueDealIdMap[thisData.dealIdentifier] = revenue;
                    ref.expectedRevenueDealIdMap[thisData.dealIdentifier] = thisData.expectedRevenue;
                    ref.totalExpectedRevenue += thisData.expectedRevenue;
                }
            }
            else {
                continue;
            }
            thisDeal.revenue = revenue;
            // console.log(thisDeal.dealName + " " + thisDeal.revenue);
            if (statusOfDeal == "Won")
                ref.wonDeals.push(thisDeal);
        }

        for (var i = 0; i < ref.wonDeals.length; i++) {
            ref.totalActualRevenue = ref.totalActualRevenue + ref.wonDeals[i].revenue;
        }
        for (var i = 0; i < dealDetails.length; i++) {
            var statusOfDeal = getDealStatus(dealDetails[i]);
            if (statusOfDeal != "Won" && dealDetails[i].isDebtRevenue == false && statusOfDeal != "Lost" && statusOfDeal != "Suspended") {
                // 							if(dealDetails[i].currency != "USD"){
                // 								var FXrate = Globals.GlobalAPI.PreLoader1654244259362.calculateFxRate(dealDetails[i].currency ,"USD");
                // 								var expectedRev = dealDetails[i].expectedRevenue
                // 								var valueInUSD =  expectedRev * FXrate;
                // 								ref.totalExpectedNewRevenue+=valueInUSD;
                // 							}
                // 							else{
                ref.totalExpectedNewRevenue += dealDetails[i].expectedRevenue;
                // 							}
            }
        }

        if (wonCount > 0) {
            getDealTable();
            // ==========> salesLeaderBoardChartDiv
            // ref.renderSalesLeaderboard();
            // ==========> expectedVsActualListColumnchart
            showExpectedVsActualRevenueColumnChart();
            // ===========> quarterWiseRevenueColumnchartDiv
            loadAndShowQuarterWiseRevenueColumnchart();
            // ===========> sectorWiseRevenueDiv
            makeSectorWiseRevenue();
            // ===========> nothing
            // ref.getDataForInvoicePayments();
            // ref.directOrIndirectSales();
        }
        else {
            // var template = Handlebars.compile(ref.hbFragmentsMap['No Data Available Template']);
            // var content = template({
            //     "data": "sales",
            // });
            // $("#expectedVsActualListColumnchart").html(content)
            // $("#quarterWiseRevenueColumnchartDiv").html(content)
            // $("#directVsIndirectSalesChartDiv").html(content)
            // $("#suspendedDealsChartDiv").html(content)
            // $("#top10DealsTableContainerDiv").html(content)
            // $("#sectorWiseRevenueDiv").html(content)
            // $("#salesLeaderBoardChartDiv").html(content)
            // 						$("#sectorWiseRevenueDiv").addClass("d-none");
            // 						$("#sectorWiseRevenueNotAvailable").removeClass("d-none");
            // 						ref.showtopDealsFailed();
            // 						ref.showSalesLeaderBoardFailed();
            // 						ref.showExpectedVSActualRevFailed();
            // 						ref.showQuaterWiseRevFailed();
        }
        // var projectionsInvoice = ['Data.AEDNumber', 'Data.accountDetails', 'Data.accountId', 'Data.accountManagerEmail', 'Data.dealIdentifier', 'Data.defaultContact', 'Data.invoiceDate', 'Data.invoiceIdentifier', 'Data.invoiceNumber', 'Data.invoiceStatus', 'Data.mailCc', 'Data.mailTo', 'Data.pdfName', 'Data.productInitials', 'Data.remarks', 'Data.remarksForLostInv', 'Data.revenue', 'Data.subject', 'Data.type'];
        // IkonService.getMyInstancesV2(
        //     "Generate Invoice", globalAccountId, { taskName: "View Invoice" }, null, null, null, projectionsInvoice, false,
        //     function () {
        //         ref.allinvoiceData = [];
        //         var paidInvoiceArray = [];
        //         for (var i in arguments[0]) {
        //             var dealId = arguments[0][i].data.dealIdentifier;
        //             if (ref.dealPointYear(dealId) == 1) {
        //                 ref.allinvoiceData.push(arguments[0][i].data);
        //             }
        //         }
        //         //console.log(ref.allinvoiceData);
        //         for (var x in ref.allinvoiceData) {
        //             if (ref.allinvoiceData[x].invoiceStatus == "paid" || ref.allinvoiceData[x].invoiceStatus == "partiallyPaid") {
        //                 ref.totalEarnedRevenue = ref.totalEarnedRevenue + ref.allinvoiceData[x].revenue;
        //                 paidInvoiceArray.push(ref.allinvoiceData[x]);
        //             }
        //         }
        //         console.log(paidInvoiceArray);
        //         console.log(ref.totalEarnedRevenue);
        //         var formattedEarnedRevenue = "$ " + pl.getFormattedAmount(ref.totalEarnedRevenue);
        //         $("#IDforEarnedRevenue").text(formattedEarnedRevenue);
        //         console.log($("#IDforEarnedRevenue").text());
        //         console.log("Total Revenue for year=" + ref.totalActualRevenue);

        //         var formattedActualRevenue = "$ " + pl.getFormattedAmount(ref.totalActualRevenue);
        //         ref.revBook = formattedActualRevenue;

        //         var formattedExpectedRevenue = "$ " + pl.getFormattedAmount(ref.totalExpectedNewRevenue);
        //         ref.revExp = formattedExpectedRevenue;
        //         ref.revEarn = formattedEarnedRevenue;

        //         $("#IDforactualRevenue").text(formattedActualRevenue);
        //         $("#IDforexpectedRevenue").text(formattedExpectedRevenue);
        //         ref.loadWidgets();
        //         //ref.menuWidthChange();
        //         ref.paidInvArray = paidInvoiceArray;

        //         //ref.popupExpectedRevenue();
        //         //ref.popupActualRevenue();
        //         //ref.popupEarnedRevenue(paidInvoiceArray);
        //         $("#sectorWiseDiv").removeClass("d-none");
        //         $("#sectorsNotAvailable").addClass("d-none");
        //         ref.makeSectorWiseData();
        //     }, function () { });
        // }
        //     function () {
        //         console.log("Problem in getMyInstances of Product while calculating revenue");
        //     }
        // );
    }
    else {
        // 			$("#sectorWiseDiv").addClass("d-none");
        // 			$("#sectorsNotAvailable").removeClass("d-none");
        // 			$("#sectorWiseRevenueDiv").addClass("d-none");
        // 			$("#sectorWiseRevenueNotAvailable").removeClass("d-none");
        // 			ref.showHeatmapFailed();
        // 			ref.showDealsbyTypeFailed();
        // 			ref.showDealOutcomesFailed();
        // 			ref.showSalesLeaderBoardFailed();
        // 			ref.showtopDealsFailed();
        // 			ref.showExpectedVSActualRevFailed();
        // 			ref.showQuaterWiseRevFailed();
    }
}
const getTotalBillingAmountForPS = function (scr: any, expenses: any, otherCosts: any, totalFTE: any) {
    return (((scr ? scr : 0) * (totalFTE ? totalFTE : 0)) + (expenses ? expenses : 0) + (otherCosts ? otherCosts : 0));
}

const getRevisedAmountForDeal = function (discountPercent: any, actualRevenue: any) {
    var eachDiscountedAmount = actualRevenue * (discountPercent / 100);
    var eachFinalBillingAmount = actualRevenue - eachDiscountedAmount;
    return eachFinalBillingAmount;
}

const getFinalBillingAmountIncludingVATRate = function (vatPercent: any, amount: any) {
    var vatTaxAmount = amount * (vatPercent / 100);
    var finalBillingAmountIncludingVAT = amount + vatTaxAmount;
    return finalBillingAmountIncludingVAT;
}

const getQuarterFromDate = function (month: any) {
    // const currYear = moment().format("YYYY");
    // const currZone = moment().format("ZZ");
    // const monthMoment = moment(`${currYear}-${month}`, "YYYY-MM");
    // if (monthMoment.isSameOrAfter(moment(`${currYear}-01-01T00:00:000${currZone}`, ref.defaultDatetimeFormat)) &&
    //     monthMoment.isBefore(moment(`${currYear}-04-01T00:00:000${currZone}`, ref.defaultDatetimeFormat))) {
    //     return "q1";
    // } else if (monthMoment.isSameOrAfter(moment(`${currYear}-04-01T00:00:000${currZone}`, ref.defaultDatetimeFormat)) &&
    //     monthMoment.isBefore(moment(`${currYear}-07-01T00:00:000${currZone}`, ref.defaultDatetimeFormat))) {
    //     return "q2";
    // } else if (monthMoment.isSameOrAfter(moment(`${currYear}-07-01T00:00:000${currZone}`, ref.defaultDatetimeFormat)) &&
    //     monthMoment.isBefore(moment(`${currYear}-10-01T00:00:000${currZone}`, ref.defaultDatetimeFormat))) {
    //     return "q3";
    // } else {
    //     return "q4";
    // }
    const currYear = format(new Date(), "yyyy");
    const monthDate = parse(`${currYear}-${month}`, "yyyy-MM", new Date());

    const q1Start = parse(`${currYear}-01-01`, "yyyy-MM-dd", new Date());
    const q2Start = parse(`${currYear}-04-01`, "yyyy-MM-dd", new Date());
    const q3Start = parse(`${currYear}-07-01`, "yyyy-MM-dd", new Date());
    const q4Start = parse(`${currYear}-10-01`, "yyyy-MM-dd", new Date());

    if ((isEqual(monthDate, q1Start) || isAfter(monthDate, q1Start)) && isBefore(monthDate, q2Start)) {
        return "q1";
    } else if ((isEqual(monthDate, q2Start) || isAfter(monthDate, q2Start)) && isBefore(monthDate, q3Start)) {
        return "q2";
    } else if ((isEqual(monthDate, q3Start) || isAfter(monthDate, q3Start)) && isBefore(monthDate, q4Start)) {
        return "q3";
    } else {
        return "q4";
    }
}

const calculateEndDateForUserLicense = function (licenseStartDate: any, billingCycle: any) {
    // var licenseEndDate = "";
    // if (billingCycle == "Monthly") {
    //     licenseEndDate = moment(licenseStartDate).add(1, 'months').subtract(1, 'days').format("YYYY-MM-DD")
    // } else if (billingCycle == "Yearly") {
    //     licenseEndDate = moment(licenseStartDate).add(1, 'years').subtract(1, 'days').format("YYYY-MM-DD");
    // } else if (billingCycle == "Quartely") {
    //     licenseEndDate = moment(licenseStartDate).add(3, 'months').subtract(1, 'days').format("YYYY-MM-DD");
    // }
    // return licenseEndDate;
    let licenseEndDate: Date;

    const parsedStartDate = parseISO(licenseStartDate); // Convert string to Date object

    if (billingCycle === "Monthly") {
        licenseEndDate = subDays(addMonths(parsedStartDate, 1), 1);
    } else if (billingCycle === "Yearly") {
        licenseEndDate = subDays(addYears(parsedStartDate, 1), 1);
    } else if (billingCycle === "Quartely") {
        licenseEndDate = subDays(addMonths(parsedStartDate, 3), 1);
    } else {
        return licenseStartDate; // Return original date if billing cycle is not recognized
    }

    return format(licenseEndDate, "yyyy-MM-dd"); // Format the final date as "YYYY-MM-DD"
}

const getDealTable = function () {
    var dealDetailsWon = ref.wonDeals;
    // console.log(dealDetailsWon);
    console.log("=========?" + dealDetailsWon.length);
    dealDetailsWon.sort(function (a, b) {
        return Number(b.revenue) - Number(a.revenue);
    })
    var dealDetailsTop = dealDetailsWon.slice(0, 10);
    // console.log(dealDetailsTop);
    ref.dealDetailsTop = dealDetailsTop;
}

//	fetchDealsByTypeOfDeals gets the count of product for every deal created and feeds that data to renderDealsByTypeOfDeals to plot the relevant chart
const fetchDealsByTypeOfDeals = function (productDetails: any) {
    let productTypeCounts: any = {};
    var chartData = [];
    for (var i = 0; i < productDetails.length; i++) {
        var productType = productDetails[i].productType;
        if (productTypeCounts[productType] == undefined) {
            productTypeCounts[productType] = 0;
        }
        productTypeCounts[productType]++
    }
    for (var key in productTypeCounts) {
        if (key != "Platform Maintenance") {
            chartData.push({
                "typeOfProduct": key,
                "productsCount": productTypeCounts[key]
            });
        }
    }
    // console.log(productTypeCounts);
    // console.log(chartData);
    ref.productByProductNameData = chartData;
}

//========== D E A L S  E N D ==========//
// showExpectedVsActualRevenueColumnChart plots a chart to show the expected vs actual revenue chart
const showExpectedVsActualRevenueColumnChart = function () {
    ref.expectedVsActualChartData = [];
    for (let i = 0; i < ref.wonDeals.length; ++i) {
        var thisDealData = ref.wonDeals[i];
        var accountDetails = thisDealData.accountDetails;
        if (!thisDealData.accountDetails || Object.keys(thisDealData.accountDetails).length == 0) {
            continue;
        }
        var dealId = thisDealData.dealIdentifier;
        var actualRevenue = thisDealData.revenue;
        var expectedRevenue = thisDealData.expectedRevenue;
        if (!actualRevenue || !expectedRevenue) {
            continue;
        }
        ref.expectedVsActualChartData.push({
            dealName: thisDealData.dealName,
            expectedRevenue: expectedRevenue,
            actualRevenue: actualRevenue,
        });
    }
}

//loadAndShowQuarterWiseRevenueColumnchart computes the quarter wise revenue. It uses ref.wonDeals array for the same
const loadAndShowQuarterWiseRevenueColumnchart = function () {
    var chartData = [];
    for (var i = 0; i < 4; i++) {
        var tempObj: any = {};
        tempObj.quarter = "Q" + (i + 1);
        tempObj.sumOfRevenue = 0;
        chartData.push(tempObj);
    }
    for (var i = 0; i < ref.wonDeals.length; i++) {
        var dealWonDate = ref.wonDeals[i].dealWonDate;
        var dealWonMonth = new Date(dealWonDate).getMonth();
        var dealWonYear = new Date(dealWonDate).getFullYear();
        var revenueOfDeal = ref.wonDeals[i].revenue;
        var quarterOfDeal = getDealQuarter(dealWonDate);
        for (var j = 0; j < chartData.length; j++) {
            if (quarterOfDeal == chartData[j].quarter && dealWonYear == ref.year) {
                chartData[j].sumOfRevenue = chartData[j].sumOfRevenue + revenueOfDeal;
            }
        }
    }
    ref.quarterWiseRevenueColumnchartData2 = chartData;
}

//makeSectorWiseRevenue calculates revenue for each sector of industry and feeds that data to renderSectorWiseRevenue to plot the chart
const makeSectorWiseRevenue = function () {
    var wonDealSector = [];
    var sectorRevenueChartData = [];
    var sectorWiseRevenueData = [
        { "sector": "Telecommunications", "sumOfActualRevenue": 0 },
        { "sector": "Retail", "sumOfActualRevenue": 0 },
        { "sector": "Advertising", "sumOfActualRevenue": 0 },
        { "sector": "Manufacturing", "sumOfActualRevenue": 0 },
        { "sector": "Automotive", "sumOfActualRevenue": 0 },
        { "sector": "Construction and Engineering", "sumOfActualRevenue": 0 },
        { "sector": "Transportation", "sumOfActualRevenue": 0 },
        { "sector": "Transport", "sumOfActualRevenue": 0 },
        { "sector": "Software", "sumOfActualRevenue": 0 },
        { "sector": "Infrastructure", "sumOfActualRevenue": 0 },
        { "sector": "Food", "sumOfActualRevenue": 0 },
        { "sector": "Financial Services", "sumOfActualRevenue": 0 },
        { "sector": "Oil and Gas", "sumOfActualRevenue": 0 },
        { "sector": "Consultancy Services", "sumOfActualRevenue": 0 },
        { "sector": "Accounting", "sumOfActualRevenue": 0 },
        { "sector": "Technology", "sumOfActualRevenue": 0 },
        { "sector": "Engineering", "sumOfActualRevenue": 0 },
        { "sector": "Food and Beverage", "sumOfActualRevenue": 0 },
        { "sector": "Aviation", "sumOfActualRevenue": 0 },
        { "sector": "Insurance", "sumOfActualRevenue": 0 },
        { "sector": "Other", "sumOfActualRevenue": 0 }
    ];
    for (var i = 0; i < ref.wonDeals.length; i++) {
        var currentDeal = ref.wonDeals[i];
        wonDealSector.push(currentDeal);
    }
    // console.log(wonDealSector);
    for (var i = 0; i < wonDealSector.length; i++) {
        var thisDeal = wonDealSector[i];
        for (var j = 0; j < sectorWiseRevenueData.length; j++) {
            if (thisDeal.sector == sectorWiseRevenueData[j].sector) {
                sectorWiseRevenueData[j].sumOfActualRevenue = sectorWiseRevenueData[j].sumOfActualRevenue + thisDeal.revenue;
            }
        }
    }
    for (var i = 0; i < sectorWiseRevenueData.length; i++) {
        if (sectorWiseRevenueData[i].sumOfActualRevenue != 0) {
            sectorRevenueChartData.push(sectorWiseRevenueData[i]);
        }
    }
    ref.sectorRevenueChartData = sectorRevenueChartData;
}