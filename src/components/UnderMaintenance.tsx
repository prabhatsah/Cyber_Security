import { Hourglass } from "lucide-react";

export default function UnderMaintenance() {
  return (
    <section className="h-full w-full flex flex-col items-center justify-center gap-2 mt-[-10vh]">
      <Hourglass className="size-24 mb-10 animate-pulse-slow duration-1200" />
      <p
        className="text-3xl text-tremor-default font-medium text-tremor-content-strong 
      dark:text-widget-dark-mainHeader"
      >
        We'll be available soon.
      </p>
      <p className="text-sm text-gray-700 dark:text-gray-400">
        We are busy updating the other modules for you and will be available
        soon.
      </p>
    </section>
  );
}
