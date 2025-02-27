import { Card, DonutChart } from "@tremor/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";
import {
  RiAddCircleFill,
  RiArrowLeftRightLine,
  RiCheckboxMultipleFill,
  RiGroupLine,
  RiMedalLine,
} from "@remixicon/react";
import { SecurityVendorsAnalysisDataTable } from "./components/SecurityVendorsAnalysisDatatable";
import {
  AnalysisResult,
  DataItem,
  HarvesterData,
  LastDnsRecords,
  PopularityRanks,
  PopularityRanksData,
  VendorDataTable,
  WidgetDataItem,
} from "./components/type";
import { format } from "date-fns";
import PopularityRanksDataTable from "./components/PopularityRanksDataTable";

const classNames = (...classes: string[]): string => {
  return classes.filter(Boolean).join(" ");
};

/// For Border Color
const colorMap: Record<string, string> = {
  malicious: "bg-red-900",
  suspicious: "bg-red-500",
  undetected: "bg-amber-500",
  harmless: "bg-green-800",
};

const data: DataItem[] = [
  {
    title: "How it works",
    description: "Learn how the platform works before getting started.",
  },
  {
    title: "Get started",
    description:
      "Learn how to install and configure this magic app into your project.",
  },
  {
    title: "Examples gallery",
    description:
      "Browse and take inspiration from our templates and demo apps.",
  },
];

export default function Widgets({ widgetData }: HarvesterData) {
  const last_analysis_stats: AnalysisResult | Object =
    widgetData.attributes.last_analysis_stats ?? {};

  const chartData: WidgetDataItem[] = Object.entries(last_analysis_stats)
    .filter(([key]) => key !== "timeout") // Exclude "timeout"
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
      amount: value,
      borderColor: colorMap[key] || "bg-gray-500", // Default color if not mapped
    }));

  const reputation = widgetData.attributes.reputation ?? "0";

  const last_dns_records: LastDnsRecords[] =
    widgetData.attributes.last_dns_records ?? [];
  const selectedUrlIPRecords: LastDnsRecords = last_dns_records.filter(
    (eachRecord: LastDnsRecords) => {
      if (eachRecord.type === "A") {
        return eachRecord;
      }
    }
  )[0];

  const last_analysis_results: Record<string, AnalysisResult> =
    widgetData.attributes.last_analysis_results ?? {};

  const vendorsAnalysisDataTableData: VendorDataTable[] = Object.entries(
    last_analysis_results
  ).map(([key, value]) => ({
    vendorName: key,
    flag: value.result,
  }));

  const groupedData = vendorsAnalysisDataTableData.reduce((acc, item) => {
    const flagCategory =
      item.flag === "malicious" || item.flag === "malware"
        ? "threat"
        : item.flag;
    acc[flagCategory] = acc[flagCategory] || [];
    acc[flagCategory].push(item);
    return acc;
  }, {} as Record<string, VendorDataTable[]>);

  // Function to split an array into two halves
  const splitArray = (arr: VendorDataTable[]) => {
    const mid = Math.ceil(arr.length / 2);
    return [arr.slice(0, mid), arr.slice(mid)];
  };

  // Split each category
  const [threat1, threat2] = splitArray(groupedData.threat || []);
  const [clean1, clean2] = splitArray(groupedData.clean || []);
  const [unrated1, unrated2] = splitArray(groupedData.unrated || []);

  // Combine to ensure equal distribution
  const firstHalf = [...threat1, ...clean1, ...unrated1];
  const secondHalf = [...threat2, ...clean2, ...unrated2];

  const popularity_ranks: Record<string, PopularityRanks> =
    widgetData.attributes.popularity_ranks ?? {};

  const popularityRanksDataTableData: PopularityRanksData[] = Object.entries(
    popularity_ranks
  ).map(([key, value]) => ({
    rankingService: key,
    rank: value.rank,
    timestamp: format(value.timestamp * 1000, "yyyy-MMM-dd HH:mm"),
  }));

  const subject_alternative_names: Array<string> =
    widgetData.attributes.last_https_certificate.extensions
      .subject_alternative_name ?? [];

  return (
    <section>
      <div className="grid grid-cols-4 gap-5">
        <Card className="col-span-1 rounded-md">
          <div className="flex flex-col items-center">
            <div className="mt-2 grid grid-cols-8 gap-8 items-center">
              <div className="relative col-span-3">
                <DonutChart
                  data={chartData}
                  category="amount"
                  index="name"
                  showTooltip={false}
                  className="h-24 hide-donut-center"
                  colors={["red-900", "red-500", "yellow-500", "green-800"]}
                />
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  <span className="inline-flex items-center space-x-2.5 rounded-md bg-tremor-background py-1 pl-2.5 pr-1 ring-1 ring-inset ring-tremor-ring">
                    <span className="text-sm font-semibold text-gray-700">
                      Reputation
                    </span>
                    <span className="rounded-md text-sm bg-red-100 px-2 text-red-900 font-bold">
                      {reputation}
                    </span>
                  </span>
                </div>
              </div>
              <div className="col-span-5">
                <p className="text-xs">Security Vendors Flag</p>
                <ul className="space-y-1 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {chartData.map((item) => (
                    <li key={item.name} className="flex space-x-3">
                      <span
                        className={`${item.borderColor} w-1 shrink-0 rounded`}
                      />
                      <div>
                        <p className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                          {item.amount}
                        </p>
                        <p className="mt-0.5 whitespace-nowrap text-sm text-tremor-content dark:text-dark-tremor-content">
                          {item.name}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
        <Card className="col-span-3 rounded-md">
          <div className="flex justify-between">
            <div className="flex gap-5">
              <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                http://malware.wicar.org/
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {["onlineshopping", "shopping", "online shopping"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-x-1 rounded-md bg-gray-200/50 px-2 text-xs text-gray-700 dark:bg-gray-500/30 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
            <span className="inline-flex items-center gap-x-1 rounded-md font-semibold bg-success text-stone-100 px-2 text-xs dark:bg-gray-500/30 dark:text-gray-300">
              {selectedUrlIPRecords.value}
            </span>
          </div>
          <div className="flex gap-5">
            <p className="text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
              malware.wicar.org
            </p>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-start justify-between border-l-2 border-blue-100 py-1 pl-4 dark:border-blue-400/10"
              >
                <div>
                  <p className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {item.title}
                  </p>
                  <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="w-full mt-8">
        <h1 className="text-md font-semibold text-gray-900 dark:text-gray-50">
          More insights
        </h1>
        <Accordion type="multiple" className="mt-3">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <span className="flex items-center gap-2 h-8">
                <RiCheckboxMultipleFill className="size-4 text-blue-500" />{" "}
                Security vendors' analysis
              </span>
            </AccordionTrigger>
            <AccordionContent className="max-h-80 overflow-auto">
              <div className="grid grid-cols-2 gap-3">
                <SecurityVendorsAnalysisDataTable
                  vendorsAnalysisDataTableData={firstHalf}
                />
                <SecurityVendorsAnalysisDataTable
                  vendorsAnalysisDataTableData={secondHalf}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              <span className="flex items-center gap-2 h-8">
                <RiMedalLine className="size-4 text-blue-500" />
                Popularity Ranks
              </span>
            </AccordionTrigger>
            <AccordionContent className="max-h-80 overflow-auto">
              <PopularityRanksDataTable
                popularityRanksDataTableData={popularityRanksDataTableData}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              <span className="flex items-center gap-2 h-8">
                <RiGroupLine className="size-4 text-blue-500" />
                Alternative Names
              </span>
            </AccordionTrigger>
            <AccordionContent className="max-h-80 overflow-auto">
              <div className="flex flex-wrap justify-start gap-4">
                {subject_alternative_names.map((eachAlternativeName) => (
                  <span
                    className="inline-flex items-center gap-x-1 rounded-md bg-gray-200/50 px-2 py-1 text-tremor-label font-semibold text-gray-700
                dark:bg-gray-500/30 dark:text-gray-300"
                  >
                    {eachAlternativeName}
                  </span>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              <span className="flex items-center gap-2 h-8">
                <RiCheckboxMultipleFill className="size-4 text-blue-500" />
                Check-In Online
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ol className="flex flex-col gap-2">
                <li>
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Step 1:
                  </span>{" "}
                  Starting 48 hours before your flight, access the "Check-In"
                  option.
                </li>
                <li>
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Step 2:
                  </span>{" "}
                  Confirm your details and select your seats to complete the
                  online check-in process.
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
