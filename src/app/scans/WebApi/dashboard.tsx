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

        <div className="my-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-50">
              Alerts
            </h3>
          </div>
          <TableRoot className="mt-8">
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableHeaderCell>Id</TableHeaderCell> */}
                  <TableHeaderCell>Alert</TableHeaderCell>
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
            Alert Detail
          </h1>
          <Accordion type="multiple" className="mt-3 ">
            {_data.site[0].alerts.map((dataItem) => (
              <AccordionItem value={dataItem.pluginid} key={dataItem.pluginid}>
                <AccordionTrigger>
                  <span className="flex items-center gap-2 h-8">
                    <RiAlertLine
                      className={`size-4 ${
                        ristCodeVsDesc[dataItem.riskcode] === "critical"
                          ? "text-red-800"
                          : ristCodeVsDesc[dataItem.riskcode] === "high"
                          ? "text-red-600"
                          : ristCodeVsDesc[dataItem.riskcode] === "medium"
                          ? "text-warning"
                          : ristCodeVsDesc[dataItem.riskcode] === "low"
                          ? "text-gray-400"
                          : "text-green-400"
                      }`}
                    />
                    {dataItem.alert}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pl-6">
                  <div dangerouslySetInnerHTML={{ __html: dataItem.desc }} />
                  {dataItem.instances.map((instance) => (
                    <AccordionItem value={instance.id} key={instance.id}>
                      <AccordionTrigger>
                        <span className="flex items-center gap-2 h-8">
                          <RiLink className="size-4 text-blue-500" />
                          {instance.uri}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pl-6">
                        <p>Method: {instance.method}</p>
                        <p>Paramer: {instance.param}</p>
                        <p>Attack: {instance.attack}</p>
                        <p>Evidence: {instance.evidence}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                  <p className="mt-2">Instances: {dataItem.count}</p>
                  <p className="mt-2">
                    Solution: {removePTags(dataItem.solution)}
                  </p>
                  <p className="mt-2">
                    <p>Reference:</p>
                    <ul>
                      {extractTextFromPTags(dataItem.reference).map(
                        (reference, index) => (
                          <li key={index}>{reference}</li>
                        )
                      )}
                    </ul>
                  </p>
                  <p className="mt-2">CWE Id: {dataItem["cweid"]}</p>
                  <p className="mt-2">WASC Id: {dataItem["wascid"]}</p>
                  <p className="mt-2">Plugin Id: {dataItem["pluginid"]}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
