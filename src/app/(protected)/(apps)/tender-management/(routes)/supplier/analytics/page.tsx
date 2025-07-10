import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
//import { analyticsChartData } from "./analytics-data";
import Chart from "@/ikon/components/charts/chart";
import getSupplierAnalyticsData from "./analytics-data";

export default async function Analytics() {
  // const currentChartData = analyticsChartData;
  const currentChartData = await getSupplierAnalyticsData();
  console.log(currentChartData);
  return (
    <>
      <div className="grid grid-cols-2 gap-4 h-full w-full overflow-auto">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Bid Success Rate</CardTitle>
            </CardHeader>
            <CardContent className="h-[35vh]">
              {/* <EChartBarChart chartData={[5, 20, 36, 10, 10, 20]}  /> */}
              <Chart
                type={currentChartData[0].type}
                chartData={currentChartData[0].data}
                configurationObj={currentChartData[0].configurationObj}
              />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Bids Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-[35vh]">
              <Chart
                type={currentChartData[1].type}
                chartData={currentChartData[1].data}
                configurationObj={currentChartData[1].configurationObj}
              />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Revenue from Awarded Tenders</CardTitle>
            </CardHeader>
            <CardContent className="h-[40vh]">
              <Chart
                type={currentChartData[2].type}
                chartData={currentChartData[2].data}
                configurationObj={currentChartData[2].configurationObj}
              />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Categories of Bids</CardTitle>
            </CardHeader>
            <CardContent className="">
              <Chart
                type={currentChartData[3].type}
                chartData={currentChartData[3].data}
                configurationObj={currentChartData[3].configurationObj}
              />
            </CardContent>
          </Card>
        </div>
        {/* <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue from Tenders</CardTitle>
            </CardHeader>
            <CardContent className="h-[23vh]">
              <Chart
                type={currentChartData[4].type}
                chartData={currentChartData[4].data}
                configurationObj={currentChartData[4].configurationObj}
              />
            </CardContent>
          </Card>
        </div> */}
      </div>
    </>
  );
}
