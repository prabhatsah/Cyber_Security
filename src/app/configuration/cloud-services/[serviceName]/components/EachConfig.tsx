import { RiEdit2Line } from "@remixicon/react";
import { Card } from "@tremor/react";

export default function ConfigWidget({
  eachConfigDetails,
}: {
  eachConfigDetails: any;
}) {
  // const currentTime = new Date();
  // console.log("Current Time: " + currentTime.toISOString());
  return (
    <Card key={eachConfigDetails.name} className="group p-4 rounded-lg">
      <div className="flex items-center space-x-4">
        <span
          className={`${eachConfigDetails.textColor} ${eachConfigDetails.bgColor} flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-tremor-default font-medium"`}
          aria-hidden={true}
        >
          {eachConfigDetails.initial}
        </span>
        <div className="truncate">
          <p className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            <a href={eachConfigDetails.href} className="focus:outline-none">
              {/* Extend link to entire card */}
              <span className="absolute inset-0" aria-hidden={true} />
              {eachConfigDetails.name}
            </a>
          </p>
          <p className="truncate text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            {eachConfigDetails.email}
          </p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 divide-x divide-tremor-border border-t border-tremor-border dark:divide-dark-tremor-border dark:border-dark-tremor-border">
        {eachConfigDetails.details.map((item) => (
          <div key={item.type} className="truncate px-3 py-2">
            <p className="truncate text-tremor-label text-tremor-content dark:text-dark-tremor-content">
              {item.type}
            </p>
            <p className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {item.value}
            </p>
          </div>
        ))}
      </div>
      <span
        className="pointer-events-none absolute right-4 top-4 text-tremor-content-subtle group-hover:text-tremor-content dark:text-dark-tremor-content-subtle group-hover:dark:text-dark-tremor-content"
        aria-hidden={true}
      >
        <RiEdit2Line className="size-4" aria-hidden={true} />
      </span>
    </Card>
  );
}
