import { Card, Divider, DonutChart, ProgressCircle } from "@tremor/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableRoot,
} from "@/components/Table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/accordion";

import {
  RiBuildingFill,
  RiCalendarScheduleFill,
  RiCheckboxMultipleFill,
  RiFolderShield2Fill,
  RiMapPin2Fill,
  RiUserFill,
} from "@remixicon/react";

import { Badge } from "@/components/Badge";
import { Key } from "lucide-react";

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

const providerDetails = [
  {
    title: "Provider code",
    description: "gcp",
  },
  {
    title: "Project Id",
    description: "cordova-358e9",
  },
  {
    title: "Organization Id",
    description: "n/a",
  },
];

const dat1 = [
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

// const currencyFormatter = (number) => {
//   return "$" + Intl.NumberFormat("us").format(number).toString();
// };

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export default function Dashboard(data) {
  data = data.data;
  console.log(data);

  const providerData = {
    name: data.provider_name,
    code: data.provider_code,
    company: "Google",
    project_id: data.project_id,
    last_run: data.last_run.time,
  };
  const dbList = data.metadata.database;
  const serviceList = data.service_list;
  const services = data.services;

  const d = [
    {
      workspace: "sales_by_day_api",
      owner: "John Doe",
      status: "live",
      costs: "$3,509.00",
      region: "US-West 1",
      capacity: "99%",
      lastEdited: "23/09/2023 13:00",
    },
    {
      workspace: "marketing_campaign",
      owner: "Jane Smith",
      status: "live",
      costs: "$5,720.00",
      region: "US-East 2",
      capacity: "80%",
      lastEdited: "22/09/2023 10:45",
    },
    {
      workspace: "sales_campaign",
      owner: "Jane Smith",
      status: "live",
      costs: "$5,720.00",
      region: "US-East 2",
      capacity: "80%",
      lastEdited: "22/09/2023 10:45",
    },
    {
      workspace: "development_env",
      owner: "Mike Johnson",
      status: "live",
      costs: "$4,200.00",
      region: "EU-West 1",
      capacity: "60%",
      lastEdited: "21/09/2023 14:30",
    },
    {
      workspace: "new_workspace_1",
      owner: "Alice Brown",
      status: "live",
      costs: "$2,100.00",
      region: "US-West 2",
      capacity: "75%",
      lastEdited: "24/09/2023 09:15",
    },
    {
      workspace: "test_environment",
      owner: "David Clark",
      status: "inactive",
      costs: "$800.00",
      region: "EU-Central 1",
      capacity: "40%",
      lastEdited: "25/09/2023 16:20",
    },
  ];

  return (
    <section className="">
      <div className="">
        <Card key={providerData.name} className="">
          <div className="flex items-center justify-between space-x-4 sm:justify-start sm:space-x-2">
            <h4 className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {providerData.name}
            </h4>
            <span
              className={classNames(
                "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20",
                "inline-flex items-center whitespace-nowrap rounded px-1.5 py-0.5 text-tremor-label font-medium ring-1 ring-inset"
              )}
              aria-hidden={true}
            >
              {providerData.code}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center space-x-1.5">
              <RiBuildingFill
                className="size-5 text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                aria-hidden={true}
              />
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                {providerData.company}
              </p>
            </div>
            <div className="flex items-center space-x-1.5">
              <RiFolderShield2Fill
                className="size-5 text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                aria-hidden={true}
              />
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                {providerData.project_id}
              </p>
            </div>
            <div className="flex items-center space-x-1.5">
              <RiCalendarScheduleFill
                className="size-5 text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                aria-hidden={true}
              />
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                {providerData.last_run}
              </p>
            </div>
          </div>
          <Divider />
          <div className="mt-[-1vh]">
            <p className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong mb-2">
              Databases
            </p>
            <div className="flex flex-wrap justify-start gap-4">
              {Object.keys(dbList).map((dbName) => (
                <span
                  className="inline-flex items-center gap-x-1 rounded-md bg-gray-200/50 px-2 py-1 text-tremor-label font-semibold text-gray-700
                dark:bg-gray-500/30 dark:text-gray-300"
                >
                  {dbName}
                </span>
              ))}
            </div>
          </div>
          <Divider />
          <div className="mt-[-1vh]">
            <p className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong mb-2">
              Services
            </p>
            <div className="flex flex-wrap justify-start gap-4">
              {serviceList.map((serviceName) => (
                <span
                  className="inline-flex items-center gap-x-1 rounded-md bg-gray-200/50 px-2 py-1 text-tremor-label font-semibold text-gray-700
                dark:bg-gray-500/30 dark:text-gray-300"
                >
                  {serviceName}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="w-full mt-8">
        <h1 className="text-md font-semibold text-gray-900 dark:text-gray-50">
          Services Insight
        </h1>
        <div className="">
          <Accordion type="multiple">
            {Object.keys(services).map((serviceKey) => {
              const service = services[serviceKey];
              return (
                <AccordionItem key={serviceKey} value={`item-${serviceKey}`}>
                  <AccordionTrigger>
                    <span className="flex items-center gap-2 h-8">
                      <RiCheckboxMultipleFill className="size-4 text-blue-500" />
                      {serviceKey}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="">
                      {/* <TableRoot className="">
                        <TableHead className="">
                          <TableRow>
                            <TableHeaderCell>Dashboard Name</TableHeaderCell>
                            <TableHeaderCell>Description</TableHeaderCell>
                            <TableHeaderCell>Flagged Items</TableHeaderCell>
                            <TableHeaderCell>Level</TableHeaderCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(service.findings).map(
                            ([findingKey, finding]) => (
                              <TableRow key={findingKey}>
                                <TableCell>{finding.dashboard_name}</TableCell>
                                <TableCell>{finding.description}</TableCell>
                                <TableCell>{finding.flagged_items}</TableCell>
                                <TableCell
                                  className={classNames(
                                    finding.level === "danger"
                                      ? "text-red-600"
                                      : "text-yellow-600"
                                  )}
                                >
                                  {finding.level}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </TableRoot> */}

                      <Table className="">
                        <TableHead>
                          <TableRow className="border-b border-tremor-border dark:border-dark-tremor-border">
                            <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                              Dashboard Name
                            </TableHeaderCell>
                            <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                              Description
                            </TableHeaderCell>
                            <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                              Flagged Items
                            </TableHeaderCell>
                            <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                              Level
                            </TableHeaderCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(service.findings).map(
                            ([findingKey, finding]) => (
                              <TableRow>
                                <TableCell className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                  {finding.dashboard_name}
                                </TableCell>
                                <TableCell>{finding.description}</TableCell>
                                <TableCell>{finding.flagged_items}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      finding.level === "danger"
                                        ? "error"
                                        : finding.level === "warning"
                                          ? "warning"
                                          : "success"
                                    }
                                  >
                                    {finding.level}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
