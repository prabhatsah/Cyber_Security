'use client';

import {
  RiArrowRightUpLine,
  RiBuildingLine,
  RiMapPin2Line,
  RiSettings3Line,
  RiTimeLine,
  RiTruckLine,
  RiUserLine,
} from "@remixicon/react";
import {
  Card,
  ProgressCircle,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";

import { GoDotFill } from "react-icons/go";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const data = [
  {
    item: "http://malware.wicar.org/",
    company: "wicar.org",
    location: "Paris, France",
    contact: "Lena Stone",
    status: "malicious",
    fulfillmentActual: 8,
    fulfillmentTotal: 10,
    lastUpdated: "2min ago",
  },
  {
    item: "https://juice-shop.herokuapp.com/",
    company: "Bitclick Holding",
    location: "Zurich, Switzerland",
    contact: "Matthias Ruedi",
    status: "malicious",
    fulfillmentActual: 3,
    fulfillmentTotal: 4,
    lastUpdated: "5min ago",
  },
  {
    item: "https://www.hackthebox.com",
    company: "Cornerstone LLC",
    location: "Frankfurt, Germany",
    contact: "David Mueller",
    status: "clean",
    fulfillmentActual: 2,
    fulfillmentTotal: 4,
    lastUpdated: "10d ago",
  },
];

const statusColor = {
  malicious: "bg-red-50 text-red-700 ring-red-600/20 ",
  clean:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
  Delayed:
    "bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/20",
};

export default function PastScans() {
  return (
    <>
      <div className="py-6">
        <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Past Scans
        </h3>
        <p
          className="text-tremor-default dark:text-gray-400 text-gray-700
        "
        >
          Briefly analyze past scans
        </p>
      </div>

      {data.map((order) => (
        <Card
          key={order.item}
          className="p-2 mb-5
        bg-tremor-background ring-tremor-ring shadow-tremor-card dark:ring-dark-tremor-ring dark:shadow-dark-tremor-card border-tremor-brand dark:border-dark-tremor-brand relative  flex-col rounded-lg justify-between
           dark:bg-dark-bgPrimary hover:bg-tremor-background-muted hover:dark:bg-dark-tremor-background-mute"
        >
          <div className="rounded-sm border border-tremor-border bg-tremor-background-muted p-4 dark:border-dark-tremor-border dark:bg-dark-tremor-background-muted">
            <div className="flex items-center justify-between space-x-4 sm:justify-start sm:space-x-2">
              <h4 className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {order.item}
              </h4>
              <span
                className={classNames(
                  statusColor[order.status],
                  "inline-flex items-center whitespace-nowrap rounded px-1.5 py-0.5 text-tremor-label font-medium ring-1 ring-inset"
                )}
                aria-hidden={true}
              >
                {order.status}
              </span>
              <span
                className="cursor-pointer absolute right-4 top-4 "
                aria-hidden={true}
              >
                <RiArrowRightUpLine className="size-4" aria-hidden={true} />
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
              <div className="flex items-center space-x-1.5">
                <RiBuildingLine
                  className="size-5 text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                  aria-hidden={true}
                />
                <p className="text-tremor-default text-tremor-content dark:text-gray-50">
                  {order.company}
                </p>
              </div>
              <div className="flex items-center space-x-1.5">
                <RiMapPin2Line
                  className="size-5 text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                  aria-hidden={true}
                />
                <p className="text-tremor-default text-tremor-content dark:text-gray-50">
                  {order.location}
                </p>
              </div>
              <div className="flex items-center space-x-1.5">
                <RiUserLine
                  className="size-5 text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                  aria-hidden={true}
                />
                <p className="text-tremor-default text-tremor-content dark:text-gray-50">
                  {order.contact}
                </p>
              </div>
            </div>
          </div>
          <div className="px-2 pb-2 pt-4">
            <div className="block sm:flex sm:items-end sm:justify-between">
              <div className="flex items-center space-x-2">
                <ProgressCircle
                  className="stroke-error"
                  color="#fff"
                  value={
                    (order.fulfillmentActual / order.fulfillmentTotal) * 100
                  }
                  radius={9}
                  strokeWidth={3.5}
                />

                <p className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  Alerts ({order.fulfillmentActual}/{order.fulfillmentTotal})
                </p>
              </div>
              <p className="mt-2 text-tremor-default text-tremor-content dark:text-gray-50 sm:mt-0">
                Scanned <strong>{order.lastUpdated}</strong>
              </p>
            </div>
          </div>
        </Card>
      ))}
    </>
  );
}
