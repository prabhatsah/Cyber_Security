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
} from "@remixicon/react";
import { SecurityVendorsAnalysisDataTable } from "./components/SecurityVendorsAnalysisDatatable";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { fetchVendorsAnalysisData } from "./components/data-collection";
import { useEffect, useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

/// For Border Color
const colorMap = {
  malicious: "bg-red-900",
  suspicious: "bg-red-500",
  undetected: "bg-warning-500",
  harmless: "bg-green-800",
};

const data = [
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

const currencyFormatter = (number) => {
  return "$" + Intl.NumberFormat("us").format(number).toString();
};

export default function Widgets({ widgetData }) {
  // const [vendorsAnalysisData, setVendorsAnalysisData] = useState(null);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const getData = async () => {
  //     const result = await fetchVendorsAnalysisData();
  //     if (result.error) {
  //       setError(result.error);
  //     } else {
  //       setVendorsAnalysisData(result);
  //     }
  //   };

  //   getData();
  // }, []);

  // if (error) {
  //   return <p className="text-red-500">Error: {error}</p>;
  // }

  // let widgetData = [];
  // if (vendorsAnalysisData) {
  //   widgetData = Object.entries(stats)
  //     .filter(([key]) => key !== "timeout") // Exclude "timeout"
  //     .map(([key, value]) => ({
  //       name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
  //       amount: value,
  //       borderColor: colorMap[key] || "bg-gray-500", // Default color if not mapped
  //     }));
  // }

  return (
    <>
      <section className="">
        <div className="grid grid-cols-4 gap-5">
          <Card className="col-span-1 rounded-md ">
            <div className="flex flex-col items-center">
              <div className=" mt-2 grid grid-cols-8 gap-8 items-center">
                <div className="relative col-span-3">
                  <DonutChart
                    data={data1}
                    category="amount"
                    index="name"
                    showTooltip={false}
                    className="h-24 hide-donut-center"
                    colors={["red-900", "red-500", "yellow-500", "green-800"]}
                  />
                  <div className="flex flex-wrap justify-center gap-4 mt-2">
                    <span
                      className="inline-flex items-center space-x-2.5 rounded-md
              bg-tremor-background py-1 pl-2.5 pr-1 ring-1 ring-inset ring-tremor-ring"
                    >
                      <span className="text-sm font-semibold text-gray-700">
                        Reputation
                      </span>
                      <span className="rounded-md text-sm bg-red-100 px-2  text-red-900 font-bold ">
                        -56
                      </span>
                    </span>
                  </div>
                </div>
                <div className="col-span-5">
                  <p className="text-xs">Security Vendors Flag</p>
                  <ul
                    role="list"
                    className="space-y-1 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2"
                  >
                    {data1.map((item) => (
                      <li key={item.name} className="flex space-x-3">
                        <span
                          className={classNames(
                            item.borderColor,
                            "w-1 shrink-0 rounded"
                          )}
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
          <Card className="col-span-3 rounded-md ">
            <div className="flex gap-5">
              <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                http://malware.wicar.org/
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
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
              </div>
            </div>
            <p className=" text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
              malware.wicar.org
            </p>
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
          <Accordion type="multiple" className="mt-3 ">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <span className="flex items-center gap-2 h-8">
                  <RiCheckboxMultipleFill className="size-4 text-blue-500" />
                  Security vendors' analysis
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <SecurityVendorsAnalysisDataTable />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <span className="flex items-center gap-2 h-8">
                  <RiArrowLeftRightLine className="size-4 text-blue-500" />
                  Change Flights
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ol className="flex flex-col gap-2">
                  <li>
                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                      Step 1:
                    </span>{" "}
                    Within your booking details, select "Change Flights."
                  </li>
                  <li>
                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                      Step 2:
                    </span>{" "}
                    Follow the prompts to select new flight options and confirm
                    the changes.
                  </li>
                  <li>
                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                      Step 3:
                    </span>{" "}
                    Review your new flight details and any fare differences.
                  </li>
                  <li>
                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                      Step 4:
                    </span>{" "}
                    Complete the change and receive your updated itinerary via
                    email.
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <span className="flex items-center gap-2 h-8">
                  <RiAddCircleFill className="size-4 text-blue-500" />
                  Add Special Requests
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Look for the "Special Requests" option within your booking to
                  specify any meal preferences, seating arrangements, or
                  assistance services you may require during your flight.
                </p>
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
    </>
  );
}
