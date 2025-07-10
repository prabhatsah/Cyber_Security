import { loadWidget, getRef, summaryPageEntryPoint } from './actions/index'
import LeadWidget from "./components/lead-widget/";
import LeadDataTable from "./components/lead-datatable/";
import SuccessRatioTable from "./components/success-datatable/";
import { Card, CardHeader } from '@/shadcn/ui/card';
import MultiBarChart from "@/ikon/components/charts/multi-bar-chart";
import HeatMapChart from "@/ikon/components/charts/heat-map-chart";
import DonoutChart from '@/ikon/components/charts/donout-chart';
import EChartBarChart from '@/ikon/components/charts/bar-charts';
import ColumnLineChart from '@/ikon/components/charts/column-line-chart';
import DealsList from './components/deals-list';
import SectorwiseRevenuePieChart from './components/sectorwiseRevenuePieChart';
import SalesLeaderBoard from './components/sales-leader-board';
export default async function SummaryPage() {
    await summaryPageEntryPoint();
    const WidgetData = loadWidget();
    const ref = getRef();
    // Configuration Object
    const months: string[] = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dealStatuses: string[] = [
        'Open', 'Suspended', 'Lost', 'Won'
    ];
    const heatMapChart_configurationObj: any = {
        title: "Deal Heatmap",
        hours: months,
        days: dealStatuses,
        showLegend: false,
        showCursor: true,
        showScrollx: false,
        showScrolly: false,
        zoomToIndex: true,
        zoomStartIndex: "0",
        zoomEndIndex: "100",
        showoverallTooltip: true,
        seriesCreationArrayofObj: [
            {
                seriesType: "heatmap",
                seriesName: "Punch Card",
            }
        ],
    };
    const MultiBarChart_configurationObj: any = {
        title: "Sector Wise Deals",
        showLegend: true,
        showCursor: true,
        showScrollx: false,
        showScrolly: false,
        zoomToIndex: true,
        zoomStartIndex: "0",
        zoomEndIndex: "100",
        showoverallTooltip: true,
        seriesCreationArrayofObj: [
            { seriesType: 'bar', seriesColor: '#675f73' },
            { seriesType: 'bar', seriesColor: '#6a5e7d' },
            { seriesType: 'bar', seriesColor: '#9283a9' },
            { seriesType: 'bar', seriesColor: '#b5a1d3' },
            { seriesType: 'bar', seriesColor: '#ccbbe7' }
        ],
        dimensions: ['sector', 'count', 'wonCount', 'openCount', 'lostCount', 'suspendedCount'],
    };
    const donoutchart_configurationObj: any = {
        title: 'Deals Conversion Ratio',
        showLegend: true,
        showCursor: true,
        showoverallTooltip: true,
        overallTooltip: "{b}: {c}",
    };
    const barChart_configurationObj: any = {
        categoryKey: 'typeOfProduct',
        valueKey: 'productsCount',
        showoverallTooltip: true,
        overallTooltip: "{b}: {c}",
        showLegend: false,
        showCursor: true,
        title: 'Products by Product Name',
        showScrollx: true,
        showScrolly: true,
    }
    const barChart_configurationObj2: any = {
        categoryKey: 'quarter',
        valueKey: 'sumOfRevenue',
        showoverallTooltip: true,
        overallTooltip: "{b}: {c}",
        showLegend: false,
        showCursor: true,
        title: 'Quater-Wise Revenue',
        showScrollx: true,
        showScrolly: true,
    }
    const barChart_configurationObj3: any = {
        categoryKey: 'sector',
        valueKey: 'sumOfActualRevenue',
        showoverallTooltip: true,
        overallTooltip: "{b}: {c}",
        showLegend: false,
        showCursor: true,
        title: 'Sector Wise Revenue',
        showScrollx: true,
        showScrolly: true,
    }

    // Configuration Object
    const columnLineChart_configurationObj: any = {
        version: 1,
        title: "Expected vs Actual Revenue",
        categoryKey: "dealName",
        showLegend: true,
        showCursor: true,
        showScrollx: false,
        showScrolly: false,
        zoomToIndex: true,
        zoomStartIndex: "0",
        zoomEndIndex: "100",
        showoverallTooltip: true,
        overallTooltip: "{b}: {c}",
        seriesCreationArrayofObj: [
            {
                seriesType: "column",
                seriesName: "expectedRevenue",
                showSeriesTooltip: true,
            },
            {
                seriesType: "line",
                seriesName: "actualRevenue",
                showSeriesTooltip: true,
            },
        ],
        yAxisParams: [
            {
                type: 'value',
            },
        ],
    };
    console.log("ref.sectorWiseData", ref.sectorWiseData)
    console.log(ref.HeatMapData)
    return (
        <>
            <div className="w-full h-full flex flex-col gap-3">
                <LeadWidget widgetData={WidgetData} />
                <div className='flex-grow overflow-y-auto pr-2'>
                    <div className="grid grid-cols-6 gap-3 w-full">
                        <div className="col-span-2 w-full h-[400px]">
                            <Card className="w-full mt-3 p-4">
                                <EChartBarChart chartData={ref.quarterWiseRevenueColumnchartData2} configurationObj={barChart_configurationObj2} />
                            </Card>
                        </div>
                        <div className="col-span-4 col-start-3 h-[400px]">
                            <Card className="w-full mt-3 p-4">
                                <ColumnLineChart chartData={ref.expectedVsActualChartData} configurationObj={columnLineChart_configurationObj} />
                            </Card>
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-3 mt-6">
                        <div className="col-span-3">
                            <Card className='p-4 h-full'>
                                <LeadDataTable leadsData={ref.allDetailsOfTable} columnSchema={ref.columnSchemaOfSalesPerformanceTable} />
                            </Card>
                        </div>
                        <div className="col-span-3 col-start-4">
                            <DealsList dealDetailsTop={ref.dealDetailsTop} />
                        </div>
                    </div>
                    <Card className="w-full mt-3 p-4 h-[400px]">
                        <MultiBarChart chartData={ref.sectorWiseData} chartConfiguration={MultiBarChart_configurationObj} />
                    </Card>
                    <div className="grid grid-cols-6 gap-3 w-full">
                        <div className="col-span-3 w-full h-[400px]">
                            <Card className="w-full mt-3 p-4">
                                <SectorwiseRevenuePieChart sectorWiseRevenueData={ref.sectorRevenueChartData} />
                            </Card>
                        </div>
                        <div className="col-span-3 w-full h-[400px]">
                            <Card className="w-full mt-3 p-4">
                                <SalesLeaderBoard />
                            </Card>
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-3 w-full mt-3">
                        <div className="col-span-3 w-full h-[400px]">
                            <Card className="w-full mt-3 p-4">
                                <DonoutChart chartData={ref.PieChartData} configurationObj={donoutchart_configurationObj} />
                            </Card>
                        </div>
                        <div className="col-span-3 col-start-4 h-[400px]">
                            <Card className="w-full mt-3 p-4">
                                <HeatMapChart chartData={ref.HeatMapData} configurationObj={heatMapChart_configurationObj} />
                            </Card>
                        </div>
                    </div>
                    <Card className='p-4 mt-6 h-[400px]'>
                        <SuccessRatioTable leadsData={ref.DataOfSuccessTable} columnSchema={ref.columnSchemaOfSuccessTable} />
                    </Card>
                    <Card className="w-full mt-3 p-4 h-[400px]">
                        <EChartBarChart chartData={ref.productByProductNameData} configurationObj={barChart_configurationObj} />
                    </Card>

                </div>
            </div>
        </>
    );
}
