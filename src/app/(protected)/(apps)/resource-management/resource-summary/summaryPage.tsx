import { fetchProductOfProjectDetails, renderResourceAllocationView, fetchHeadcountDetails } from "../QueryForResource.tsx";
import moment from "moment";

interface ChartData {
    month: string;
    monthDateObj: Date;
    prospectFte: number;
    projectFte: number;
    totalFte: number;
    availableHeadCount: number;
    availableHeadCountNormalized?: number;
}

interface ResourceRecord {
    projectOrProspect: 'Prospect' | 'Project';
    [key: string]: any;
}

export async function calculateResourceForecastChartDataFromQueryData(queryData: Record<string, number>): Promise<ChartData[]> {
    try {
        const renderResourceAllocation = await renderResourceAllocationView();
        const { monthKeysList } = renderResourceAllocation;
        const headCount = await fetchHeadcountDetails();
        const headcountsMap: Record<string, number> = headCount;

        const chartData: ChartData[] = [];

        for (const eachMonthKey of monthKeysList) {
            const monthMoment = moment(eachMonthKey, "MMM_YYYY");
            if (!monthMoment.isValid()) continue;

            const prospectFte = queryData[`${eachMonthKey}_baseline`] ?? 0;
            const projectFte = queryData[`${eachMonthKey}_forecast`] ?? 0;
            const availableHeadCount = headcountsMap[eachMonthKey] ?? 0;

            // Skip if both values are 0 and no headcount
            if (prospectFte === 0 && projectFte === 0 && availableHeadCount === 0) continue;

            chartData.push({
                month: monthMoment.format("MMM, YYYY"),
                monthDateObj: monthMoment.toDate(),
                prospectFte,
                projectFte,
                totalFte: prospectFte + projectFte,
                availableHeadCount
            });
        }

        if (chartData.length === 0) return [];

        const maxTotalFte = Math.max(...chartData.map(x => x.totalFte), 0);
        const maxAvailableHeadCount = Math.max(...chartData.map(x => x.availableHeadCount), 0);

        const findTens = (num: number): number => num === 0 ? 0 : Math.ceil(num / 10);
        const normalizeDivider_t = findTens(maxTotalFte) * 10;
        const maxAvailableHeadCountTens = findTens(maxAvailableHeadCount) * 10;
        const normalizeDivider = (normalizeDivider_t === 0 || normalizeDivider_t === maxAvailableHeadCountTens) ? 1 : normalizeDivider_t;

        return chartData.map(elem => ({
            ...elem,
            availableHeadCountNormalized: elem.availableHeadCount / normalizeDivider
        }));
    } catch (error) {
        console.error("Error in calculateResourceForecastChartDataFromQueryData:", error);
        return [];
    }
}

export async function createSqlQueryForResourceForecastChart(): Promise<Record<string, (resource: ResourceRecord) => number>> {
    try {
        const renderResourceAllocation = await renderResourceAllocationView();
        const { monthKeysList } = renderResourceAllocation;

        return monthKeysList.reduce((acc, monthKey) => {
            acc[`${monthKey}_baseline`] = (resource: ResourceRecord) => 
                resource.projectOrProspect === 'Prospect' ? Number(resource[`${monthKey}_fte`] || 0) : 0;
            acc[`${monthKey}_forecast`] = (resource: ResourceRecord) => 
                resource.projectOrProspect === 'Project' ? Number(resource[`${monthKey}_fte`] || 0) : 0;
            return acc;
        }, {} as Record<string, (resource: ResourceRecord) => number>);
    } catch (error) {
        console.error("Error in createSqlQueryForResourceForecastChart:", error);
        return {};
    }
}

export async function queryDataAndShowResourceForecastChart(
    filterWhere?: Record<string, any>
): Promise<ChartData[]> {
    try {
        const productOfProjectData = await fetchProductOfProjectDetails();
        const { allResourcesAllocationTable } = productOfProjectData;
        const filterQuery = await createSqlQueryForResourceForecastChart();

        const queryResult = allResourcesAllocationTable.reduce((acc, resource) => {
            // Apply filter if provided
            if (filterWhere && !Object.entries(filterWhere).every(([key, value]) => 
                resource[key] === value)) {
                return acc;
            }

            // Aggregate data
            Object.entries(filterQuery).forEach(([key, fn]) => {
                acc[key] = (acc[key] || 0) + fn(resource);
            });

            return acc;
        }, {} as Record<string, number>);

        return await calculateResourceForecastChartDataFromQueryData(queryResult);
    } catch (error) {
        console.error("Error in queryDataAndShowResourceForecastChart:", error);
        return [];
    }
}

interface ChartConfig {
    data: ChartData[];
    categoryKey: string;
    series: Array<{
        valueField: string;
        seriesName: string;
        seriesType: 'column' | 'line';
        stack?: string;
        tooltip?: string;
        bullet?: { shape: string };
    }>;
    showLegend: boolean;
    showCursor: boolean;
    zoom: {
        start: Date;
        end: Date;
    };
    yAxes: Array<{
        type: string;
        name: string;
        renderer: { grid: { visible: boolean } };
    }>;
    xAxis: {
        type: string;
        dataKey: string;
        renderer: { labels: { rotation: number } };
    };
    tooltip: {
        shared: boolean;
        formatter?: (params: any) => any;
    };
}

export async function showResourceForecastChart(
    chartData: ChartData[],
    setChartConfig: (config: ChartConfig) => void
): Promise<void> {
    try {
        if (!chartData.length) return;

        const currDateMoment = moment().startOf("month");
        let startDateObj = currDateMoment.toDate();
        let endDateObj = moment(startDateObj).add(12, "months").toDate();

        const times = chartData.map(each => each.monthDateObj.getTime());
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);

        if (startDateObj.getTime() < minTime) startDateObj = new Date(minTime);
        if (endDateObj.getTime() > maxTime) endDateObj = moment(maxTime).add(1, "months").toDate();

        const chartConfig: ChartConfig = {
            data: chartData,
            categoryKey: "month",
            series: [
                {
                    valueField: "prospectFte",
                    seriesName: "Prospect FTE",
                    seriesType: "column",
                    stack: "total",
                    tooltip: "[bold]Prospect FTE:[/] {prospectFte}"
                },
                {
                    valueField: "projectFte",
                    seriesName: "Project FTE",
                    seriesType: "column",
                    stack: "total",
                    tooltip: "[bold]Project FTE:[/] {projectFte}"
                },
                {
                    valueField: "availableHeadCountNormalized",
                    seriesName: "Head Count",
                    seriesType: "line",
                    tooltip: "[bold]Head Count:[/] {availableHeadCount}",
                    bullet: { shape: "circle" }
                }
            ],
            showLegend: true,
            showCursor: true,
            zoom: {
                start: startDateObj,
                end: endDateObj
            },
            yAxes: [
                {
                    type: "value",
                    name: "FTE",
                    renderer: { grid: { visible: true } }
                }
            ],
            xAxis: {
                type: "category",
                dataKey: "month",
                renderer: { labels: { rotation: -45 } }
            },
            tooltip: {
                shared: true,
                formatter: (params: any) => {
                    // Find the data point for this tooltip
                    const dataItem = chartData.find(item => 
                        item.month === params[0].axisValue
                    );
                    if (!dataItem) return params;

                    // Custom tooltip content
                    return `
                        <div>
                            <strong>Month:</strong> ${dataItem.month}<br/>
                            <strong>Prospect FTE:</strong> ${dataItem.prospectFte}<br/>
                            <strong>Project FTE:</strong> ${dataItem.projectFte}<br/>
                            <strong>Total FTE:</strong> ${dataItem.totalFte}<br/>
                            <strong>Head Count:</strong> ${dataItem.availableHeadCount}
                        </div>
                    `;
                }
            }
        };

        setChartConfig(chartConfig);
    } catch (error) {
        console.error("Error in showResourceForecastChart:", error);
    }
}