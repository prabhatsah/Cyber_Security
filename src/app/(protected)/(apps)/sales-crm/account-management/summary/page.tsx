import { WidgetProps } from "@/ikon/components/widgets/type";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
//import { Card } from "../../../ai-workforce/components/ui/Card";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Badge } from "@/shadcn/ui/badge";
import { getDateFormat } from "@/ikon/utils/actions/format";
import EChartSortedBarChart from "@/ikon/components/charts/sorted-bar-charts";
import EChartBarChart from "@/ikon/components/charts/bar-charts";
import { getFormattedAmountByUserPreference } from "../../utils/Formated-Amount/getFormattedAmountByUserPreference";
import { Calendar } from "lucide-react";



export default async function AccountSummary() {
  const activeDealsInstanceData = await getMyInstancesV2({
    processName: "Deal",
    predefinedFilters: { taskName: "View State" },
    mongoWhereClause: 'this.Data.dealStatus == "Won" && this.Data.isDebtRevenue == false',
    projections: ["Data.dealIdentifier", "Data.dealName", "Data.dealStatus", "Data.activeStaus", "Data.expectedRevenue", "Data.formattedActualRevenueIncludingVAT_contracted", "Data.isDebtRevenue", "Data.accountDetails", "Data.dealWonDate"],
  });
  const activeDealsData = activeDealsInstanceData.map((e: any) => e.data);
  console.log('activeDealsData', activeDealsData)
  const dealsIn2025 = activeDealsData.filter(deal => {
    const wonYear = new Date(deal.dealWonDate).getFullYear();
    console.log('wonYear', wonYear)
    return wonYear === 2024;
  });
  const totalTargetedRevenue = dealsIn2025.reduce((acc, deal) => acc + deal.expectedRevenue, 0);
  console.log('totalTargetedRevenue', totalTargetedRevenue)
  const totalExpectedRevenue = dealsIn2025.reduce((acc, deal) => acc + parseFloat(deal.formattedActualRevenueIncludingVAT_contracted), 0);
  console.log('totalExpectedRevenue', totalExpectedRevenue)
  const totalDirectRevenue = dealsIn2025.reduce((acc, deal) => acc +(deal.accountDetails.isChannelPartner ? parseFloat(deal.formattedActualRevenueIncludingVAT_contracted) : 0), 0);
  const totalIndirectRevenue = dealsIn2025.reduce((acc, deal) => acc +(!deal.accountDetails.isChannelPartner ? parseFloat(deal.formattedActualRevenueIncludingVAT_contracted) : 0), 0);

  const invoiceInstanceData = await getMyInstancesV2({
    processName: "Generate Invoice",
    predefinedFilters: { taskName: "View Invoice" },
    projections: ["Data.invoiceStatus", "Data.invoiceIdentifier", "Data.invoiceDate", "Data.revenue", "Data.PaidAmount"],
  });
  const invoiceData = invoiceInstanceData.map((e: any) => e.data);
  console.log('invoiceData', invoiceData)
  const invoicesIn2025 = invoiceData.filter(deal => {
    const invoiceYear = new Date(deal.invoiceDate).getFullYear();
    console.log('invoiceYear', invoiceYear)
    return invoiceYear === 2024;
  });
  console.log('invoicesIn2025', invoicesIn2025)
  const totalBookedRevenue = invoicesIn2025.reduce((acc, deal) => acc + deal.revenue, 0);
  console.log('totalBookedRevenue', totalBookedRevenue)
  const totalEarnedRevenue = invoicesIn2025.reduce((acc, deal) => acc + (deal.PaidAmount ? deal.PaidAmount : 0), 0);
  console.log('totalEarnedRevenue', totalEarnedRevenue)

  // Sort by expectedRevenue in descending order and take top 5
  const topDeals = dealsIn2025
    .sort((a, b) => b.expectedRevenue - a.expectedRevenue)
    .slice(0, 5);

  const accountWiseRevenue = dealsIn2025.reduce((acc: { [key: string]: { accountName: string; expectedRevenue: number } }, deal) => {
    const accountName = deal.accountDetails.accountName || "Unknown";
    const accountIdentifier = deal.accountDetails.accountIdentifier;

    if (!acc[accountIdentifier]) {
      acc[accountIdentifier] = { accountName, expectedRevenue: 0 };
    }

    acc[accountIdentifier].expectedRevenue += deal.expectedRevenue;
    return acc;
  }, {});

  // Convert object to array, sort by expectedRevenue, and get top 5
  const top5AccountsByRevenue = Object.values(accountWiseRevenue)
    .sort((a, b) => b.expectedRevenue - a.expectedRevenue)
    .slice(0, 5);

  console.log("Top 5 Accounts by Expected Revenue in 2025:", top5AccountsByRevenue);
  const chartData = Object.values(top5AccountsByRevenue).map(account => ({
    name: account.accountName,
    value: account.expectedRevenue
  }));
  console.log("chartData:", chartData);

  const barChart_configurationObj3: any = {
    categoryKey: 'name',
    valueKey: 'value',
    sortBy: 'value',
    showoverallTooltip: true,
    overallTooltip: "{b}: {c}",
    showLegend: false,
    showCursor: true,
    title: 'Top 5 Accounts By Expected Revenue',
    showScrollx: true,
    showScrolly: true,
  }
  //EChartSortedBarChart({ chartData, configurationObj: {} })
  // var dom = document.getElementById('chart-container');
  // var myChart = EChartSortedBarChart.init(dom, null, {
  //   renderer: 'canvas',
  //   useDirtyRect: false
  // });
  // var app = {};


  // var option;

  // option = {
  //   xAxis: {
  //     type: 'category',
  //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  //   },
  //   yAxis: {
  //     type: 'value'
  //   },
  //   series: [
  //     {
  //       data: [120, 200, 150, 80, 70, 110, 130],
  //       type: 'bar'
  //     }
  //   ]
  // };


  // const topDeals = activeDealsData
  //   .sort((a, b) => b.expectedRevenue - a.expectedRevenue)
  //   .slice(0, 5);

  console.log(topDeals);
  // const wonDealsInstanceData = await getMyInstancesV2({
  //   processName: "Deal",
  //   predefinedFilters: { taskName: "View State" },
  //   mongoWhereClause: 'this.Data.dealStatus == "Won"',
  //   projections: ["Data.dealIdentifier", "Data.dealName", "Data.dealStatus", "Data.activeStaus", "Data.formattedActualRevenueIncludingVAT_contracted", "Data.isDebtRevenue"],
  // });
  // const wonDealsData = wonDealsInstanceData.map((e: any) => e.data);
  // console.log('wonDealsData', wonDealsData)
  // var totalRevemue = 0;
  // for (var i = 0; i < wonDealsData.length; i++) {
  //   if (wonDealsData[i].isDebtRevenue == false) {
  //     totalRevemue += parseFloat(wonDealsData[i].formattedActualRevenueIncludingVAT_contracted);
  //   }
  // }
  // console.log('totalRevemue', totalRevemue)
  // const lostDealsInstanceData = await getMyInstancesV2({
  //   processName: "Deal",
  //   predefinedFilters: { taskName: "View State" },
  //   mongoWhereClause: 'this.Data.dealStatus == "Lost"',
  //   projections: ["Data.dealIdentifier", "Data.dealName", "Data.dealStatus", "Data.activeStaus"],
  // });
  // const lostDealsData = lostDealsInstanceData.map((e: any) => e.data);
  // console.log('lostDealsData', lostDealsData)

  // const accountInsData = await getMyInstancesV2({
  //   processName: "Account",
  //   predefinedFilters: { taskName: "View State" },
  //   projections: ["Data"],
  // });

  // const accountData = accountInsData.map((e: any) => e.data);
  // console.log('accountData', accountData)
  // var accountIdWiseAccountNameMap: { [key: string]: string } = {};
  // for (var i = 0; i < accountData.length; i++) {
  //   accountIdWiseAccountNameMap[accountData[i].accountIdentifier] = accountData[i].accountName;
  // }
  const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();

  // interface Deal {
  //   name: string;
  //   date: string;
  //   accountManager: string;
  //   revenue: string;
  // }

  // const topDeals: Deal[] = [
  //   {
  //     name: "G2G - PS",
  //     date: "01-Sep-2024",
  //     accountManager: "Farouk Said",
  //     revenue: "191,700.00",
  //   },
  //   {
  //     name: "BI & AI",
  //     date: "31-Jan-2025",
  //     accountManager: "Baishali Roy Chowdhury",
  //     revenue: "7,950.00",
  //   },
  // ];


  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="flex-grow overflow-y-auto pr-2">
        {/* <div className="flex flex-col md:flex-row gap-2">
          <div className="flex flex-1 flex-row justify-between p-2">
            <Card className="h-full py-2">
              <CardContent>
                <div className="flex items-center mb-2">
                  <span className="text-l mr-2">Total Targeted Revenue: </span>
                  <span className="font-bold">$ {getFormattedAmountByUserPreference(totalTargetedRevenue, 2)}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-l mr-2">Total Expected Revenue: </span>
                  <span className="font-bold text-l">$ {getFormattedAmountByUserPreference(totalExpectedRevenue, 2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-1 flex-row justify-between p-2">
            <Card className="h-full py-2">
              <CardContent>
                <div className="flex items-center mb-2">
                  <span className="text-l mr-2">Total Booked Revenue : </span>
                  <span className="font-bold">$ {getFormattedAmountByUserPreference(totalBookedRevenue, 2)}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-l mr-2">Total Earned Revenue : </span>
                  <span className="font-bold text-l">$ {getFormattedAmountByUserPreference(totalEarnedRevenue, 2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-1 flex-row justify-between  p-2">
            <Card className="h-full py-2">
              <CardContent>
                <div className="flex items-center mb-2">
                  <span className="text-l mr-2">Total PS Revenue : </span>
                  <span className="font-bold">$ {getFormattedAmountByUserPreference(totalBookedRevenue, 2)}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-l mr-2">Total UL Revenue : </span>
                  <span className="font-bold text-l">$ {getFormattedAmountByUserPreference(totalEarnedRevenue, 2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-1 flex-row justify-between p-2">
            <Card className="h-full py-2">
              <CardContent>
                <div className="flex items-center mb-2">
                  <span className="text-l mr-2">Total Direct Revenue : </span>
                  <span className="font-bold">$ {getFormattedAmountByUserPreference(totalBookedRevenue, 2)}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-l mr-2">Total Indirect Revenue : </span>
                  <span className="font-bold text-l">$ {getFormattedAmountByUserPreference(totalEarnedRevenue, 2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-1 flex-row justify-between p-2">
            <Card className="h-full w-full py-2">
              <CardContent className="">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Year</span>
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex items-end">
                  <span className="text-lg font-medium">2024</span>
                </div>
              </CardContent>
            </Card>
          </div>

        </div> */}
        <div className="flex flex-col md:flex-row gap-1 space-y-1 md:space-y-0">
          <div className="flex flex-1 flex-row justify-between p-1">
            <Card className="h-full w-full py-2">
              <CardContent className="p-2">
                <div className="flex items-center mb-2">
                  <span className="text-l mr-2">Total Targeted Revenue: </span>
                  <span className="font-bold">$ {getFormattedAmountByUserPreference(totalTargetedRevenue, 2)}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-l mr-2">Total Expected Revenue: </span>
                  <span className="font-bold text-l">$ {getFormattedAmountByUserPreference(totalExpectedRevenue, 2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-1 flex-row justify-between p-1">
            <Card className="h-full w-full py-2">
              <CardContent className="p-2">
                <div className="flex items-center mb-2">
                  <span className="text-l mr-2">Total Booked Revenue : </span>
                  <span className="font-bold">$ {getFormattedAmountByUserPreference(totalBookedRevenue, 2)}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-l mr-2">Total Earned Revenue : </span>
                  <span className="font-bold text-l">$ {getFormattedAmountByUserPreference(totalEarnedRevenue, 2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-1 flex-row justify-between p-1">
            <Card className="h-full w-full py-2">
              <CardContent className="p-2">
                <div className="flex items-center mb-2">
                  <span className="text-l mr-2">Total PS Revenue : </span>
                  <span className="font-bold">$ {getFormattedAmountByUserPreference(totalBookedRevenue, 2)}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-l mr-2">Total UL Revenue : </span>
                  <span className="font-bold text-l">$ {getFormattedAmountByUserPreference(totalEarnedRevenue, 2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-1 flex-row justify-between p-1">
            <Card className="h-full w-full py-2">
              <CardContent className="p-2">
                <div className="flex items-center mb-2">
                  <span className="text-l mr-2">Total Direct Revenue : </span>
                  <span className="font-bold">$ {getFormattedAmountByUserPreference(totalDirectRevenue, 2)}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-l mr-2">Total Indirect Revenue : </span>
                  <span className="font-bold text-l">$ {getFormattedAmountByUserPreference(totalIndirectRevenue, 2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-1 flex-row justify-between p-1">
            <Card className="h-full w-full py-2">
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-2">
                    <span>Year</span>
                    <span>2024</span>
                  </div>
                  <Calendar className="my-auto"/>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-12 m-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Account Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                details
              </CardContent>
            </Card>
          </div>
          <div className="col-span-6 m-2">

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Top 5 Deals By Expected Revenue</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {topDeals.map((deal, index) => (
                  <div key={index} className="border-b py-3 px-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{deal.dealName}</span>
                      <Badge className="bg-primary text-white rounded-full">
                        {getDateFormat(deal.dealWonDate)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span>
                        Account Manager: <strong>{userIdWiseUserDetailsMap[deal.accountDetails.accountManager]?.userName || "n/a"}</strong>
                      </span>
                      <span>
                        Actual Revenue: <strong>${deal.formattedActualRevenueIncludingVAT_contracted}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="col-span-6 m-2">
            <Card className="h-full">
              {/* <CardHeader>
                <CardTitle>Top 5 Accounts By Expected Revenue</CardTitle>
              </CardHeader> */}
              <CardContent>
                <EChartBarChart chartData={chartData} configurationObj={barChart_configurationObj3} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
