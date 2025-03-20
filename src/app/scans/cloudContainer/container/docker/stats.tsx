"use client";

import { JSX } from "react";

interface VulnerabilitiesStatsProps {
  severityArray: { severity: string; count: number }[];
}

export const severityMetadata: Record<
  string,
  { name: string; color: string; iconColor: string; icon: JSX.Element }
> = {
  CRITICAL: {
    name: "Critical Vulnerabilities",
    color: "bg-red-100",
    iconColor: "text-red-600",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-octagon-alert h-6 w-6"
        aria-hidden="true"
      >
        <path d="M12 16h.01" />
        <path d="M12 8v4" />
        <path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z" />
      </svg>
    ),
  },
  HIGH: {
    name: "High Vulnerabilities",
    color: "bg-orange-100",
    iconColor: "text-orange-600",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-triangle-alert h-6 w-6"
        aria-hidden="true"
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  MEDIUM: {
    name: "Medium Vulnerabilities",
    color: "bg-yellow-100",
    iconColor: "text-yellow-600",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-circle-alert h-6 w-6"
        aria-hidden="true"
      >
        <circle cx={12} cy={12} r={10} />
        <line x1={12} x2={12} y1={8} y2={12} />
        <line x1={12} x2="12.01" y1={16} y2={16} />
      </svg>
    ),
  },
  LOW: {
    name: "Low Vulnerabilities",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-activity h-6 w-6"
        aria-hidden="true"
      >
        <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
      </svg>
    ),
  },
};

const VulnerabilitiesStats: React.FC<VulnerabilitiesStatsProps> = ({
  severityArray,
}) => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {severityArray.map(({ severity, count }) => {
        const metadata = severityMetadata[severity];

        if (!metadata) return null;

        return (
          <div
            key={severity}
            className="relative bg-white dark:bg-[#111827] pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow-lg dark:shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${metadata.color}`}>
                <div className={`${metadata.iconColor} dark`}>
                  {metadata.icon}
                </div>
              </div>
              <p className="ml-16 text-sm font-medium text-gray-700 dark:text-gray-500 truncate">
                {metadata.name}
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {count}
              </p>
            </dd>
          </div>
        );
      })}
    </div>
  );
};

export default VulnerabilitiesStats;
