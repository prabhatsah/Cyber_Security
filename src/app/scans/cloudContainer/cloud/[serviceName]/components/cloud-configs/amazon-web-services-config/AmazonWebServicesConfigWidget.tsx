"use client";

import { AmazonWebServicesConfiguration } from "@/app/configuration/components/type";
import { RiCalendarScheduleLine, RiPlayLargeFill } from "@remixicon/react";
import { Card } from "@tremor/react";
import { format } from "date-fns";
import { redirect } from "next/navigation";

export default function AmazonWebServicesConfigWidget({
    eachConfigDetails,
}: {
    eachConfigDetails: AmazonWebServicesConfiguration;
}) {
    const configNameWords = eachConfigDetails.configurationName
        .trim()
        .split(/\s+/);
    let configNameInitial = "";
    if (configNameWords.length === 1) {
        configNameInitial = configNameWords[0][0].toUpperCase();
    } else {
        const firstInitial = configNameWords[0][0].toUpperCase();
        const lastInitial =
            configNameWords[configNameWords.length - 1][0].toUpperCase();
        configNameInitial = firstInitial + lastInitial;
    }

    function startScan() {
        redirect(`/scans/cloudContainer/cloud/amazon-web-services/${eachConfigDetails.configId}`);
    }

    return (
        <>
            <Card key={eachConfigDetails.configId} className="group p-4 rounded-lg">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <span
                            className="text-blue-800 dark:text-blue-500 bg-blue-100 dark:bg-blue-500/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-tremor-default font-medium"
                            aria-hidden={true}
                        >
                            {configNameInitial}
                        </span>
                        <div className="truncate">
                            <p className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {eachConfigDetails.configurationName}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <button title="Schedule Scan" className="border-r border-dark-bgTertiary pr-3 text-blue-700 dark:text-blue-700 hover:text-blue-800 hover:dark:text-blue-600 cursor-pointer">
                            <RiCalendarScheduleLine className="size-5" aria-hidden={true} />
                        </button>
                        <button onClick={() => startScan()} title="Run Scan" className="pl-3 text-blue-700 dark:text-blue-700 hover:text-blue-800 hover:dark:text-blue-600 cursor-pointer">
                            <RiPlayLargeFill className="size-5" aria-hidden={true} />
                        </button>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 divide-x divide-tremor-border border-t border-tremor-border dark:divide-dark-tremor-border dark:border-dark-tremor-border">
                    <div className="truncate px-3 py-2">
                        <p className="truncate text-tremor-label text-tremor-content dark:text-dark-tremor-content">
                            Created By
                        </p>
                        <p className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {eachConfigDetails.createdBy.userName}
                        </p>
                    </div>

                    <div className="truncate px-3 py-2">
                        <p className="truncate text-tremor-label text-tremor-content dark:text-dark-tremor-content">
                            Created On
                        </p>
                        <p className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {format(eachConfigDetails.createdOn, "dd-MMM-yyyy HH:mm")}
                        </p>
                    </div>
                </div>
            </Card>
        </>
    );
}
