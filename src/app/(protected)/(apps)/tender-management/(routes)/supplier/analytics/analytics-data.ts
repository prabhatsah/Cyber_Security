import { getAccount } from "@/ikon/utils/actions/account";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import moment from "moment";
import { sectors } from "../../../_utils/common/sector";

const getSupplierAnalyticsData = async () => {
  const account = await getAccount();
  const accountId = account.ACCOUNT_ID;

  let response = await getMyInstancesV2({
    processName: "Tender Management",
    predefinedFilters: { taskName: "View Tender" },
    mongoWhereClause: `this.Data.accountId==='${accountId}'`,
  });
  const rfpTenderData = Array.isArray(response)
    ? response.map((e: any) => e.data)
    : [];

  response = await getMyInstancesV2({
    processName: "Tender Response",
    predefinedFilters: { taskName: "View" },
  });
  const rfpResponseData = Array.isArray(response)
    ? response.map((e: any) => e.data)
    : [];

  console.table(rfpTenderData);
  console.table(rfpResponseData);

  //BID SUCCESS RATE
  const bidSuccessRate: { value: number; name: string }[] = [
    { value: 0, name: "Submitted" },
    { value: 0, name: "Won" },
    { value: 0, name: "Lost" },
  ];
  const submittedBids = rfpTenderData.filter(
    (tender) => tender.accountId === accountId
  );
  const wonBids = submittedBids.filter(
    (tender) => tender.contractFinalizedFlag === true
  );
  const submitted = submittedBids.length;
  const won = wonBids.length;
  const lost = submitted - won;
  bidSuccessRate[0].value = submitted;
  bidSuccessRate[1].value = won;
  bidSuccessRate[2].value = lost;

  //BIDS OVER TIME
  const bidsOverTime: { value: number; name: string }[] = [
    { value: 0, name: "January" },
    { value: 0, name: "February" },
    { value: 0, name: "March" },
    { value: 0, name: "April" },
    { value: 0, name: "May" },
    { value: 0, name: "June" },
    { value: 0, name: "July" },
    { value: 0, name: "August" },
    { value: 0, name: "September" },
    { value: 0, name: "October" },
    { value: 0, name: "November" },
    { value: 0, name: "December" },
  ];
  rfpTenderData.forEach((element) => {
    /* volume over time */
    //    if (element.publishedTime === undefined) {
    // 	 return;
    //    }
    if (element.accountId === accountId) {
      let date = moment(element.bidCompletionTime).format("MMMM");
      let index = bidsOverTime.findIndex((x) => x.name === date);
      if (index !== -1) {
        bidsOverTime[index].value += 1;
      }
    }
  });

  //Revenue from Awarded Tenders
  const revenueFromAwardedTenders: { value: number; name: string }[] = [
    { value: 0, name: "January" },
    { value: 0, name: "February" },
    { value: 0, name: "March" },
    { value: 0, name: "April" },
    { value: 0, name: "May" },
    { value: 0, name: "June" },
    { value: 0, name: "July" },
    { value: 0, name: "August" },
    { value: 0, name: "September" },
    { value: 0, name: "October" },
    { value: 0, name: "November" },
    { value: 0, name: "December" },
  ];
  rfpTenderData.forEach((tender) => {
    const tenderId = tender.tenderId;
    const offers = tender.offers ? tender.offers : [];
    const acceptedOffer = offers.filter(
      (offer: any) => offer.status === "Accepted"
    );
    if (acceptedOffer.length > 0) {
      const value = acceptedOffer[0].amount;
      console.log("value", value);
      let date = moment(tender.bidCompletionTime).format("MMMM");
      let index = revenueFromAwardedTenders.findIndex((x) => x.name === date);
      if (index !== -1) {
        revenueFromAwardedTenders[index].value += value;
      }
    }
  });
  console.log("revenueFromTenders", revenueFromAwardedTenders);

  //CATEGORIES OF BIDS
  const categoriesOfBids: { value: number; name: string }[] = sectors.map(
    (i) => {
      return { value: 0, name: i.sectorName };
    }
  );

  rfpTenderData.forEach((tender) => {
    const tenderId = tender.tenderId;
    const published = rfpResponseData.find(
      (data) => data.tenderId === tenderId
    );
    if (published) {
      const sector = published.industry;
      let index = categoriesOfBids.findIndex((x) => x.name === sector);
      if (index !== -1) {
        categoriesOfBids[index].value += 1;
      }
    }
  });
  //console.log("tenderValueByCategory", tenderValueByCategory);

  //CONFIGS
  const lineChartConfiguration: any = {
    categoryKey: "name", // Data field for categories
    valueKey: "value", // Data field for values
    showLegend: false, // Show legend
    showCursor: false, // Show cursor interaction
    title: " ",
    showScrollx: false, // Enable x-axis scrolling
    showScrolly: false, // Enable y-axis scrolling
    colors: ["#EE6666"],
  };

  const barChartConfiguration = {
    categoryKey: "name", // Data field for categories
    valueKey: "value", // Data field for values
    showLegend: true, // Show legend
    showCursor: true, // Show cursor interaction
    title: " ",
    showScrollx: true, // Enable x-axis scrolling
    showScrolly: true, // Enable y-axis scrolling
    colors: ["#800000", "#91CC75", "#EE6666"],
  };

  const piechart_configurationObj: any = {
    title: "",
    // colorPalette: defaultColors_PieChart,
    showLegend: true,
    showCursor: true,
    showoverallTooltip: true,
    overallTooltip: "{b}: {c}",
    colors: ["#800000", "#91CC75", "#EE6666", "#FFB980", "#FF99C3"],
  };

  return [
    {
      id: "0",
      type: "Pie-Chart",
      data: bidSuccessRate,
      configurationObj: piechart_configurationObj,
    },
    {
      id: "1",
      type: "Line-Chart",
      data: bidsOverTime,
      configurationObj: lineChartConfiguration,
    },
    {
      id: "3",
      configurationObj: lineChartConfiguration,
      type: "Line-Chart",
      data: revenueFromAwardedTenders,
    },
    {
      id: "2",
      type: "Bar-Chart",
      data: categoriesOfBids,
      configurationObj: barChartConfiguration,
    },
    {
      id: "0",
      type: "Line-Chart",
      data: [],
      configurationObj: lineChartConfiguration,
    },
  ];
};

export default getSupplierAnalyticsData;
