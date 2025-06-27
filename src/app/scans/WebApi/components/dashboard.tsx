import { Card, DonutChart } from "@tremor/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";

import { RiAlertLine, RiLink } from "@remixicon/react";
import { Badge } from "@/components/Badge";
import { Site } from "../types/alertTypes";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const riskCodeVsDesc: Record<string, string> = {
  "0": "Info",
  "1": "Low",
  "2": "Medium",
  "3": "High",
  "4": "Critical",
};

function removePTags(htmlString: string) {
  return htmlString.replace(/<\/?p>/g, "");
}

function extractTextFromPTags(htmlString: string) {
  const matches = htmlString.match(/<p>(.*?)<\/p>/gs); // Use 's' flag to match multi-line content
  return matches ? matches.map((p) => p.replace(/<\/?p>/g, "")) : [];
}

const getBadgeVariant = (value: string) => {
  return value === "Critical" || value === "High"
    ? "error"
    : value === "Medium"
      ? "warning"
      : value === "Low"
        ? "success"
        : "default";
};

export default function Dashboard({ _data, zapAnalysis }: { _data: (Site & { scanned_at?: string }), zapAnalysis: any }) {
  const _severity = [
    {
      severity: "Critical",
      count: 0,
      borderColor: "bg-red-900",
    },
    {
      severity: "High",
      count: 0,
      borderColor: "bg-red-500",
    },
    {
      severity: "Medium",
      count: 0,
      borderColor: "bg-yellow-500",
    },
    {
      severity: "Low",
      count: 0,
      borderColor: "bg-green-800",
    },
    {
      severity: "Info",
      count: 0,
      borderColor: "bg-blue-600",
    },
  ];

  const _alertsCount = _data?.alerts?.length;
  console.log("vul Ai data: ", zapAnalysis);

  if (_alertsCount) {
    for (let i = 0; i < _alertsCount; i++) {
      for (let j = 0; j < _severity.length; j++) {
        if (
          _severity[j]["severity"] ===
          riskCodeVsDesc[_data.alerts[i]["riskcode"]]
        ) {
          _severity[j]["count"] += 1;
        }
      }
    }
  }

  console.log("----------- _severity");
  console.log(_severity);

  const labelClass = "text-sm text-gray-900 font-semibold w-32 flex-shrink-0 dark:text-gray-50";

  return (
    <div className="min-h-[90vh]">
      <section className="my-4">
        <div className="grid grid-cols-4 gap-5">
          <Card
            className="col-span-1 bg-tremor-background ring-tremor-ring shadow-tremor-card dark:ring-dark-tremor-ring dark:shadow-dark-tremor-card border-tremor-brand dark:border-dark-tremor-brand relative flex flex-col rounded-lg justify-between
           dark:bg-dark-bgPrimary hover:bg-tremor-background-muted hover:dark:bg-dark-tremor-background-muted"
          >
            <div className="flex flex-col items-center">
              <div className=" mt-2 grid grid-cols-8 gap-8 items-center">
                <div className="relative col-span-3">
                  <DonutChart
                    data={_severity}
                    category="count"
                    index="severity"
                    showTooltip={false}
                    showLabel={false}
                    className="h-24 hide-donut-center"
                    colors={[
                      "red-900",
                      "red-500",
                      "yellow-500",
                      "green-800",
                      "blue-600",
                    ]}
                  />
                  <div className="flex flex-wrap justify-center gap-4 mt-2">
                    <span
                      className="inline-flex items-center space-x-2.5 rounded-md
              bg-tremor-background py-1 pl-2.5 pr-1 ring-1 ring-inset ring-tremor-ring"
                    >
                      <span className="text-sm font-semibold text-gray-700">
                        Alerts
                      </span>
                      <span className="rounded-md text-sm bg-red-100 px-2  text-red-900 font-bold ">
                        {_alertsCount}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="col-span-5">
                  <p className="text-xs">Summary of Alerts</p>
                  <ul
                    role="list"
                    className="space-y-1 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2"
                  >
                    {_severity.map((item) => (
                      <li key={item.severity} className="flex space-x-3">
                        <span
                          className={classNames(
                            item.borderColor,
                            "w-1 shrink-0 rounded"
                          )}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {item.count}
                          </p>
                          <p className="mt-0.5 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {item.severity}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
          <Card
            className="col-span-3 bg-tremor-background ring-tremor-ring shadow-tremor-card dark:ring-dark-tremor-ring dark:shadow-dark-tremor-card border-tremor-brand dark:border-dark-tremor-brand relative  flex-col rounded-lg justify-between
           dark:bg-dark-bgPrimary hover:bg-tremor-background-muted hover:dark:bg-dark-tremor-background-mute"
          >
            <div className="flex gap-5">
              <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {_data["@name"]}
              </h3>
            </div>
            <p className=" text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
              {_data["@host"]}
            </p>
          </Card>
        </div>
        <div className="w-full mt-8">
          <h1 className="text-md font-semibold text-gray-900 dark:text-gray-50">
            Alert Details
          </h1>
          <Accordion type="multiple" className="mt-3 ">
            {_data.alerts?.map((dataItem) => (
              <AccordionItem value={dataItem.pluginid} key={dataItem.pluginid}>
                <AccordionTrigger>
                  <span className="flex items-center gap-2 h-8">
                    <RiAlertLine
                      className={`size-4 ${riskCodeVsDesc[dataItem.riskcode] === "Critical"
                        ? "text-red-900 dark:text-red-400"
                        : riskCodeVsDesc[dataItem.riskcode] === "High"
                          ? "text-red-900 dark:text-red-400"
                          : riskCodeVsDesc[dataItem.riskcode] === "Medium"
                            ? "text-yellow-900 dark:text-yellow-400"
                            : riskCodeVsDesc[dataItem.riskcode] === "Low"
                              ? "text-emerald-900 dark:text-emerald-400"
                              : "text-blue-900 dark:text-blue-400"
                        }`}
                    />
                    {dataItem.alert}
                    <Badge
                      variant={
                        riskCodeVsDesc[dataItem.riskcode] === "Critical" ||
                          riskCodeVsDesc[dataItem.riskcode] === "High"
                          ? "error"
                          : riskCodeVsDesc[dataItem.riskcode] === "Medium"
                            ? "warning"
                            : riskCodeVsDesc[dataItem.riskcode] === "Low"
                              ? "success"
                              : "default"
                      }
                    >
                      {riskCodeVsDesc[dataItem.riskcode]}
                    </Badge>
                    <Badge variant="neutral">{dataItem.count}</Badge>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  <div className="mt-2 dark:text-gray-400">
                    {/* Risk & Confidence */}
                    {[
                      {
                        label: "Risk:",
                        value: riskCodeVsDesc[dataItem.riskcode],
                      },
                      {
                        label: "Confidence:",
                        value: riskCodeVsDesc[dataItem.confidence],
                      },
                    ].map((item, index) => (
                      <p
                        key={index}
                        className="flex gap-2 mb-2
                      "
                      >
                        <span className={labelClass}>
                          {item.label}
                        </span>
                        <Badge variant={getBadgeVariant(item.value)}>
                          {item.value}
                        </Badge>
                      </p>
                    ))}

                    {/* Other Info */}
                    {[
                      { label: "Instances:", value: dataItem.count },
                      { label: "CWE Id:", value: dataItem.cweid },
                      { label: "WASC Id:", value: dataItem.wascid },
                      { label: "Plugin Id:", value: dataItem.pluginid },
                    ].map((item, index) => (
                      <p key={index} className="flex gap-2 mb-2">
                        <span className={labelClass}>
                          {item.label}
                        </span>
                        <span>{item.value}</span>
                      </p>
                    ))}

                    {/* Description & Solution */}
                    {[
                      {
                        label: "Description:",
                        value: removePTags(dataItem.desc),
                      },
                      {
                        label: "Solution:",
                        value: removePTags(dataItem.solution),
                      },
                    ].map((item, index) => (
                      <p key={index} className="flex gap-2 mb-2">
                        <span className={labelClass}>
                          {item.label}
                        </span>
                        <div className="flex-grow">{item.value}</div>
                      </p>
                    ))}

                    {/* Reference List */}
                    <div className="flex gap-2 mt-2">
                      <span className={labelClass}>
                        Reference:
                      </span>
                      <ul className="flex-grow list-disc pl-5">
                        {extractTextFromPTags(dataItem.reference).map(
                          (reference, index) => (
                            <li key={index} className="mb-1">
                              {reference}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Instances (Accordion) */}
                    {dataItem.instances.map((instance) => (
                      <AccordionItem value={instance.id} key={instance.id}>
                        <AccordionTrigger>
                          <span className="flex items-center gap-2 h-8">
                            <RiLink className="size-4 text-blue-500" />
                            {instance.uri}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6">
                          {[
                            { label: "Method:", value: instance.method },
                            { label: "Parameter:", value: instance.param },
                            { label: "Attack:", value: instance.attack },
                            { label: "Evidence:", value: instance.evidence },
                          ].map((item, index) => (
                            <p
                              key={index}
                              className="flex mt-1 dark:text-gray-400"
                            >
                              <span className={labelClass}>
                                {item.label}
                              </span>
                              <span>{item.value}</span>
                            </p>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}

            <AccordionItem value="FFUF">
              <AccordionTrigger>
                FFUF
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <p>Data: FFUF</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="SSLcheck">
              <AccordionTrigger>
                TLS/SSL Security Overview
              </AccordionTrigger>
              <AccordionContent className="px-6">
                {zapAnalysis.ssl &&
                  Object.entries(zapAnalysis.ssl).map(
                    ([sectionName, sectionBody]) => {
                      const body = sectionBody as Record<string, unknown>;
                      return (
                        <div key={sectionName} className="mb-6">
                          <h5 className="text-sm font-semibold mb-2">{sectionName}</h5>

                          <ul className="list-disc list-inside space-y-1">
                            {Object.entries(body).map(
                              ([key, val]: [string, unknown]) => (
                                <li key={key}>
                                  <span className="font-medium">{key}:</span>{" "}
                                  {Array.isArray(val) ? (
                                    <ul className="list-decimal list-inside ml-4 space-y-1">
                                      {val.map((item, idx) => (
                                        <li key={idx}>{String(item)}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <span>{String(val)}</span>
                                  )}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      );
                    }
                  )
                }

              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="Header Poisoning Insights">
              <AccordionTrigger>
                Header Manipulation Analysis
              </AccordionTrigger>
              <AccordionContent className="px-6">
                {zapAnalysis.headerPoisoning &&
                  Object.entries(zapAnalysis.headerPoisoning).map(
                    ([sectionName, sectionBody]) => {
                      const body = sectionBody as Record<string, unknown>;
                      return (
                        <div key={sectionName} className="mb-6">
                          {/* Section title */}
                          <h5 className="text-sm font-semibold mb-2">{sectionName}</h5>

                          {/* Section content */}
                          <ul className="list-disc list-inside space-y-1">
                            {Object.entries(body).map(
                              ([key, val]: [string, unknown]) => (
                                <li key={key}>
                                  <span className="font-medium">{key}:</span>{" "}
                                  {Array.isArray(val) ? (
                                    /* Nested list for arrays */
                                    <ul className="list-decimal list-inside ml-4 space-y-1">
                                      {val.map((item, idx) => (
                                        <li key={idx}>{String(item)}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    /* Plain string */
                                    <span>{String(val)}</span>
                                  )}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      );
                    }
                  )
                }
              </AccordionContent>
            </AccordionItem>

          </Accordion>


        </div>
      </section>
    </div>
  );
}

