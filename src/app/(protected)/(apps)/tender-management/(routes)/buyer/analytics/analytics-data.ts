import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import moment from "moment";
import { sectors } from "../../../_utils/common/sector";
import { Sector } from "../../../_utils/common/types";



export default async function getBuyerAnalyticsData() {
  let response = await getMyInstancesV2({
    processName: "RFP Draft",
    predefinedFilters: { taskName: "View" },
  });
  const rfpDraftData = Array.isArray(response)
    ? response.map((e: any) => e.data)
    : [];

  response = await getMyInstancesV2({
    processName: "Published Tenders",
    predefinedFilters: { taskName: "View" },
  });
  const rfpPublishedData = Array.isArray(response)
    ? response.map((e: any) => e.data)
    : [];

  response = await getMyInstancesV2({
    processName: "Tender Management",
    predefinedFilters: { taskName: "View Tender" },
  });
  const rfpTenderData = Array.isArray(response)
    ? response.map((e: any) => e.data)
    : [];

  console.log("draft",rfpDraftData);
  console.log("published",rfpPublishedData);
  console.log("tender",rfpTenderData);

  //tender volume over time
  const tenderVolumeOverTime: { value: number; name: string }[] = [
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

  rfpDraftData.forEach((element) => {
    /* volume over time */
    if (element.publishedTime === undefined) {
      return;
    }
    let date = moment(element.publishedTime).format("MMMM");
    let index = tenderVolumeOverTime.findIndex((x) => x.name === date);
    if (index !== -1) {
      tenderVolumeOverTime[index].value += 1;
    }
  });

  //Tender Status Distribution
  const tenderStatusDistribution: { value: number; name: string }[] = [
    { value: 0, name: "Negotiated" },
    { value: 0, name: "Contract Finalized" },
    { value: 0, name: "Awarded" },
  ];

  rfpTenderData.forEach((tender : any) => {
    if(tender.negotiationComplete) tenderStatusDistribution[0].value++
    if (tender.contractFinalizedFlag) tenderStatusDistribution[1].value++;
    if (tender.tenderAwardedFlag) tenderStatusDistribution[2].value++;

  })

  console.log("tender status distribution ", tenderStatusDistribution);


  //BID TO AWARD RATIO
  const bidToAwardRatio: { value: number; name: string }[] = [
    { value: 0, name: "Bids" },
    { value: 0, name: "Awards" },
  ];
  const totalBids = rfpTenderData.length;
  const awardedList = rfpTenderData.filter(
    (tender) => tender.contractFinalizedFlag === true
  );
  const totalAwards = awardedList.length;
  bidToAwardRatio[0].value = totalBids;
  bidToAwardRatio[1].value = totalAwards;



  //Tender value by category
  const tenderValueByCategory: { value: number; name: string }[] = sectors.map( i => {
    return { value: 0, name: i.sectorName };
  })

  rfpTenderData.forEach(tender => {
    const tenderId = tender.tenderId;
    const offers = tender.offers ? tender.offers : [];
    const acceptedOffer = offers.filter((offer : any) => offer.status === 'Accepted')
    if(acceptedOffer.length > 0){
        const value = acceptedOffer[0].amount;
        console.log('value',value)
        const published = rfpPublishedData.find(data => data.id === tenderId);
        if(published){
            const sector = published.industry;
            let index = tenderValueByCategory.findIndex(
              (x) => x.name === sector
            );
            if (index !== -1) {
              tenderValueByCategory[index].value += value;
            }
        }
    }
  })
  console.log("tenderValueByCategory", tenderValueByCategory);



  //REVENUE FROM TENDERS
  const revenueFromTenders: { value: number; name: string }[] = [
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
      const published = rfpPublishedData.find((data) => data.id === tenderId);
      if (published) {
        const month = moment(published.publishedTime).format("MMMM");
        let index = revenueFromTenders.findIndex((x) => x.name === month);
        if (index !== -1) {
          revenueFromTenders[index].value += value;
        }
      }
    }
  });
  console.log("revenueFromTenders", revenueFromTenders);

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
      type: "Line-Chart",
      data: tenderVolumeOverTime,
      configurationObj: lineChartConfiguration,
    },
    {
      id: "1",
      type: "Bar-Chart",
      data: tenderValueByCategory,
      configurationObj: barChartConfiguration,
    },
    {
      id: "3",
      configurationObj: piechart_configurationObj,
      type: "Pie-Chart",
      data: tenderStatusDistribution,
    },
    {
      id: "2",
      type: "Bar-Chart",
      data: bidToAwardRatio,
      configurationObj: barChartConfiguration,
    },
    {
      id: "0",
      type: "Line-Chart",
      data: revenueFromTenders,
      configurationObj: lineChartConfiguration,
    },
  ];
}
