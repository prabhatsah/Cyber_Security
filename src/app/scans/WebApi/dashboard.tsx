import { Card, DonutChart } from "@tremor/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";

import { RiCheckboxMultipleFill } from "@remixicon/react";

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
import Layout from "@/components/Layout";
import { data, severity, tableData, alertsCount } from "./data";

console.log(severity);

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// const data = [
//   {
//     title: "How it works",
//     description: "Learn how the platform works before getting started.",
//   },
//   {
//     title: "Get started",
//     description:
//       "Learn how to install and configure this magic app into your project.",
//   },
//   {
//     title: "Examples gallery",
//     description:
//       "Browse and take inspiration from our templates and demo apps.",
//   },
// ];

const data1 = [
  {
    name: "Malicious",
    amount: 12,
    borderColor: "bg-red-900",
  },
  {
    name: "Suspicious",
    amount: 0,
    borderColor: "bg-red-500",
  },
  {
    name: "Undetected",
    amount: 30,
    borderColor: "bg-yellow-500",
  },
  {
    name: "Harmless",
    amount: 52,
    borderColor: "bg-green-800",
  },
];

const currencyFormatter = (number: number) => {
  return "$" + Intl.NumberFormat("us").format(number).toString();
};

export default function Dashboard() {
  return (
    <Layout>
      <div className="min-h-[90vh] ">
        <p className="font-bold text-gray-600">Web and Api Security</p>
        <section className="my-4">
          <div className="grid grid-cols-4 gap-5">
            <Card className="col-span-1 rounded-md ">
              <div className="flex flex-col items-center">
                <div className=" mt-2 grid grid-cols-8 gap-8 items-center">
                  <div className="relative col-span-3">
                    {/* <style jsx>{`
                .hide-donut-center text {
                  display: none !important;
                }
              `}</style> */}
                    <DonutChart
                      data={severity}
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
                          {alertsCount}
                        </span>
                      </span>
                    </div>
                    {/* <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xl font-semibold text-gray-700">6/96</p>
              </div> */}
                  </div>
                  <div className="col-span-5">
                    <p className="text-xs">Summary of Alerts</p>
                    <ul
                      role="list"
                      className="space-y-1 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2"
                    >
                      {severity.map((item) => (
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
                  http://testphp.vulnweb.com
                </h3>
                {/* <div className="flex flex-wrap justify-center gap-4">
                  <span
                    className="inline-flex items-center gap-x-1 rounded-md bg-gray-200/50 px-2
            text-xs  text-gray-700 dark:bg-gray-500/30 dark:text-gray-300"
                  >
                    onlineshopping
                  </span>
                  <span
                    className="inline-flex items-center gap-x-1 rounded-md bg-gray-200/50 px-2
            text-xs  text-gray-700 dark:bg-gray-500/30 dark:text-gray-300"
                  >
                    shopping
                  </span>
                  <span
                    className="inline-flex items-center gap-x-1 rounded-md bg-gray-200/50 px-2
            text-xs  text-gray-700 dark:bg-gray-500/30 dark:text-gray-300"
                  >
                    online shopping
                  </span>
                </div> */}
              </div>
              <p className=" text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                testphp.vulnweb.com
              </p>
              {/* <div className="mt-3 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
              </div> */}
            </Card>
          </div>

          <div className="my-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                Alerts
              </h3>
              <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                For each step: result (Pass/Fail) - risk (of highest alert(s)
                for the step, if any).
              </p>
            </div>
            <TableRoot className="mt-8">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Id</TableHeaderCell>
                    <TableHeaderCell>Title</TableHeaderCell>
                    <TableHeaderCell>Risk Level</TableHeaderCell>
                    <TableHeaderCell>Instances</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data[0].scan_findings.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.severity === "critical" ||
                            item.severity === "high"
                              ? "error"
                              : item.severity === "medium"
                              ? "warning"
                              : item.severity === "low"
                              ? "success"
                              : "default"
                          }
                        >
                          {item.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{0}</TableCell>
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
              {data[0].scan_findings.map((dataItem) => (
                <AccordionItem value={dataItem.id} key={dataItem.id}>
                  <AccordionTrigger>
                    <span className="flex items-center gap-2 h-8">
                      <RiCheckboxMultipleFill className="size-4 text-blue-500" />
                      {dataItem.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div
                      dangerouslySetInnerHTML={{ __html: dataItem.description }}
                    />
                    {dataItem.instances.map((instance) => (
                      <AccordionItem value={instance.id} key={instance.id}>
                        <AccordionTrigger>
                          <span className="flex items-center gap-2 h-8">
                            <RiCheckboxMultipleFill className="size-4 text-blue-500" />
                            {instance.URL}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p>Method: {instance.Method}</p>
                          <p>Paramer: {instance.Parameter}</p>
                          <p>Attack: {instance.Attack}</p>
                          <p>Evidence: {instance.Evidence}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                    <p>Instances: {dataItem.count}</p>
                    <div
                      dangerouslySetInnerHTML={{ __html: dataItem.remediation }}
                    />
                    <p>Reference: {dataItem.reference}</p>
                    <p>CWE Id: {dataItem["CWE Id"]}</p>
                    <p>WASC Id: {dataItem["WASC Id"]}</p>
                    <p>Plugin Id: {dataItem["Plugin Id"]}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </div>
    </Layout>
  );
}
