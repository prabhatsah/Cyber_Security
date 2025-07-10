// 'use client';

import { RiAddFill } from "@remixicon/react";
import { Tab, TabGroup, TabList } from "@tremor/react";

export default function Dashboard() {
  return (
    <>
      <h3 className="text-tremor-title font-bold text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Dashboard
      </h3>
      <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
        View and analyze stats about your scans
      </p>
      <div className="relative">
        <ul
          role="list"
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <li className="h-44 rounded-tremor-default bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle" />
          <li className="h-44 rounded-tremor-default bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle" />
          <li className="hidden h-44 rounded-tremor-default bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle sm:block" />
          <li className="hidden h-44 rounded-tremor-default bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle sm:block" />
          <li className="hidden h-44 rounded-tremor-default bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle sm:block" />
          <li className="hidden h-44 rounded-tremor-default bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle sm:block" />
        </ul>
        {/* Change dark:from-gray-950 in parent below according to your dark mode background */}
        <div className="absolute inset-x-0 bottom-0 flex h-32 flex-col items-center justify-center bg-gradient-to-t from-white to-transparent dark:from-gray-950">
          <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            No scanning data found
          </p>
          <p className="mt-2 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            Configure your service and start scanning
          </p>
        </div>
      </div>
    </>
  );
}
