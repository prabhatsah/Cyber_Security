import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";
import {
  RiCheckboxMultipleFill,
  RiFileCopy2Line,
  RiMedalLine,
} from "@remixicon/react";
import { SecurityVendorsAnalysisDataTable } from "./components/SecurityVendorsAnalysisDatatable";
import {
  AnalysisResult,
  HarvesterData,
  PopularityRanks,
  PopularityRanksData,
  VendorDataTable,
} from "./components/type";
import { format } from "date-fns";
import PopularityRanksDataTable from "./components/PopularityRanksDataTable";
import WhoIs from "./components/WhoIs";
import InfoWidget from "./components/InfoWidget";
import ChartWidget from "./components/ChartWidget";

const classNames = (...classes: string[]): string => {
  return classes.filter(Boolean).join(" ");
};

export default function Widgets({
  widgetData,
  queryUrl,
}: {
  widgetData: HarvesterData;
  queryUrl: string;
}) {
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
    widgetData.attributes.last_https_certificate?.extensions
      .subject_alternative_name ?? [];

  return (
    <section>
      <div className="grid grid-cols-4 gap-5 mt-3">
        <ChartWidget widgetData={widgetData} />

        <InfoWidget queryUrl={queryUrl} widgetData={widgetData} />
      </div>

      <div className="w-full mt-8 ">
        <WhoIs whoisText={widgetData.attributes.whois ?? ""} />
      </div>

      <div className="w-full mt-8">
        <h2 className=" font-semibold text-widgetHeader">
          More insights
        </h2>
        <Accordion type="multiple" className="">
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
                <RiFileCopy2Line className="size-4 text-blue-500" />
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
        </Accordion>
      </div>
    </section>
  );
}
