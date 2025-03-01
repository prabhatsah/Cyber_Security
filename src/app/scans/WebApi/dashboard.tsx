import { Card, DonutChart } from "@tremor/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";

import { RiAlertLine, RiCheckboxMultipleFill, RiLink } from "@remixicon/react";

import { Badge } from "@/components/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table";
import { data, severity, tableData, alertsCount } from "./data";

console.log(severity);

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ristCodeVsDesc = {
  0: "info",
  1: "low",
  2: "medium",
  3: "high",
  4: "critical",
};

function removePTags(htmlString) {
  return htmlString.replace(/<\/?p>/g, "");
}

function extractTextFromPTags(htmlString) {
  const matches = htmlString.match(/<p>(.*?)<\/p>/gs); // Use 's' flag to match multi-line content
  return matches ? matches.map((p) => p.replace(/<\/?p>/g, "")) : [];
}

export default function Dashboard({ _data }) {
  const _severity = [
    {
      severity: "critical",
      count: 0,
      borderColor: "bg-red-900",
    },
    {
      severity: "high",
      count: 0,
      borderColor: "bg-red-500",
    },
    {
      severity: "medium",
      count: 0,
      borderColor: "bg-yellow-500",
    },
    {
      severity: "low",
      count: 0,
      borderColor: "bg-green-800",
    },
    {
      severity: "info",
      count: 0,
      borderColor: "bg-blue-600",
    },
  ];

  const _alertsCount = _data.site[0].alerts.length;

  for (let i = 0; i < _data.site[0].alerts.length; i++) {
    for (let j = 0; j < _severity.length; j++) {
      if (
        _severity[j]["severity"] ===
        ristCodeVsDesc[_data.site[0].alerts[i]["riskcode"]]
      ) {
        _severity[j]["count"] += 1;
      }
    }
  }

  console.log("----------- _severity");
  console.log(_severity);

  return (
    <div className="min-h-[90vh]">
      <section className="my-4">
        <div className="grid grid-cols-4 gap-5">
          <Card className="col-span-1 rounded-md ">
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
                          <p className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {item.count}
                          </p>
                          <p className="mt-0.5 whitespace-nowrap text-sm text-tremor-content dark:text-dark-tremor-content">
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
          <Card className="col-span-3 rounded-md ">
            <div className="flex gap-5">
              <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {_data.site[0]["@name"]}
              </h3>
            </div>
            <p className=" text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
              {_data.site[0]["@host"]}
            </p>
          </Card>
        </div>
        <div className="w-full mt-8">
          <h1 className="text-md font-semibold text-gray-900 dark:text-gray-50">
            Alerts
          </h1>
          <TableRoot className="mt-3">
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableHeaderCell>Id</TableHeaderCell> */}
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Risk Level</TableHeaderCell>
                  <TableHeaderCell>Instances</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_data.site[0].alerts.map((item) => (
                  <TableRow key={item.pluginid}>
                    {/* <TableCell>{item.pluginid}</TableCell> */}
                    <TableCell>{item.alert}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ristCodeVsDesc[item.riskcode] === "critical" ||
                          ristCodeVsDesc[item.riskcode] === "high"
                            ? "error"
                            : ristCodeVsDesc[item.riskcode] === "medium"
                            ? "warning"
                            : ristCodeVsDesc[item.riskcode] === "low"
                            ? "success"
                            : "default"
                        }
                      >
                        {ristCodeVsDesc[item.riskcode]}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableRoot>
        </div>

        <div className="w-full mt-8">
          <h1 className="text-md font-semibold text-gray-900 dark:text-gray-50">
            Alert Details
          </h1>
          <Accordion type="multiple" className="mt-3 ">
            {_data.site[0].alerts.map((dataItem) => (
              <AccordionItem value={dataItem.pluginid} key={dataItem.pluginid}>
                <AccordionTrigger>
                  <span className="flex items-center gap-2 h-8">
                    <RiAlertLine
                      className={`size-4 ${
                        ristCodeVsDesc[dataItem.riskcode] === "critical"
                          ? "text-red-900"
                          : ristCodeVsDesc[dataItem.riskcode] === "high"
                          ? "text-red-900"
                          : ristCodeVsDesc[dataItem.riskcode] === "medium"
                          ? "text-yellow-900"
                          : ristCodeVsDesc[dataItem.riskcode] === "low"
                          ? "text-emerald-900"
                          : "text-blue-900"
                      }`}
                    />
                    {dataItem.alert}
                    <Badge
                      variant={
                        ristCodeVsDesc[dataItem.riskcode] === "critical" ||
                        ristCodeVsDesc[dataItem.riskcode] === "high"
                          ? "error"
                          : ristCodeVsDesc[dataItem.riskcode] === "medium"
                          ? "warning"
                          : ristCodeVsDesc[dataItem.riskcode] === "low"
                          ? "success"
                          : "default"
                      }
                    >
                      {ristCodeVsDesc[dataItem.riskcode]}
                    </Badge>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pl-6">
                  <p>{removePTags(dataItem.desc)}</p>

                  {dataItem.instances.map((instance) => (
                    <AccordionItem value={instance.id} key={instance.id}>
                      <AccordionTrigger>
                        <span className="flex items-center gap-2 h-8">
                          <RiLink className="size-4 text-blue-500" />
                          {instance.uri}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pl-6">
                        <p>
                          <span className="text-sm text-gray-900 font-semibold">
                            Method:
                          </span>{" "}
                          {instance.method}
                        </p>
                        <p className="mt-1">
                          <span className="text-sm text-gray-900 font-semibold">
                            Parameter:
                          </span>{" "}
                          {instance.param}
                        </p>
                        <p className="mt-1">
                          <span className="text-sm text-gray-900 font-semibold">
                            Attack:
                          </span>{" "}
                          {instance.attack}
                        </p>
                        <p className="mt-1">
                          <span className="text-sm text-gray-900 font-semibold">
                            Evidence:
                          </span>{" "}
                          {instance.evidence}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                  <p className="mt-2">
                    <span className="text-sm text-gray-900 font-semibold">
                      Instances:
                    </span>{" "}
                    {dataItem.count}
                  </p>
                  <p className="mt-2">
                    <span className="text-sm text-gray-900 font-semibold">
                      Solution:
                    </span>{" "}
                    {removePTags(dataItem.solution)}
                  </p>
                  <p className="flex mt-2">
                    <p className="text-sm text-gray-900 font-semibold">
                      Reference:
                    </p>
                    <ul className="ml-1">
                      {extractTextFromPTags(dataItem.reference).map(
                        (reference, index) => (
                          <li key={index} className="mb-1">
                            {reference}
                          </li>
                        )
                      )}
                    </ul>
                  </p>
                  <p className="mt-2">
                    <span className="text-sm text-gray-900 font-semibold">
                      CWE Id:
                    </span>{" "}
                    {dataItem["cweid"]}
                  </p>
                  <p className="mt-2">
                    <span className="text-sm text-gray-900 font-semibold">
                      WASC Id:
                    </span>{" "}
                    {dataItem["wascid"]}
                  </p>
                  <p className="mt-2">
                    <span className="text-sm text-gray-900 font-semibold">
                      Plugin Id:
                    </span>{" "}
                    {dataItem["pluginid"]}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
