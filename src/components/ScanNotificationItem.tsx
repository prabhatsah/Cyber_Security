import { Card, Divider, ProgressCircle } from "@tremor/react";
import { ScanNotificationDataModified } from "./type";
import { CircleCheckBig, Crosshair } from "lucide-react";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}

const statusColor = {
    'in progress': 'bg-yellow-50 text-yellow-900 ring-yellow-600/30 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20',
    'completed': 'bg-emerald-50 text-emerald-900 ring-emerald-600/30 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20',
    'error': 'bg-red-50 text-red-900 ring-red-600/20 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20',
    'default': 'bg-blue-50 text-blue-900 ring-blue-500/30 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30',
}
const toolNameMap = {
    "theHarvester": "Public Information",
    "zapSpider": "Web and API Security",
    "zapActiveScan": "Web and API Security",
    "virusTotal": "OSINT and Threat Intelligence"
}

export default function ScanNotificationItem({ scanData }: {
    scanData: ScanNotificationDataModified;
}) {

    const startOrEndTime = scanData.endTime.trim().length > 0 ? new Date(scanData.endTime) : new Date(scanData.startTime);
    const presentTime = new Date();
    const diffMs = presentTime.getTime() - startOrEndTime.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let dataTimeStr = scanData.endTime.trim().length > 0 ? "Completed " : "Started ";

    if (seconds < 60) {
        dataTimeStr += `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    } else if (minutes < 60) {
        dataTimeStr += `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
        dataTimeStr += `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
        dataTimeStr += `${days} day${days !== 1 ? "s" : ""} ago`;
    }


    return (
        <>
            <Card key={scanData.scanId}>
                <div className="flex items-center justify-between space-x-4 sm:justify-start sm:space-x-2">
                    <h4 className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        Vulnerability Scanning
                        {/* {scanData.target} */}
                    </h4>
                    <span
                        className={classNames(
                            statusColor[scanData.status as keyof typeof statusColor],
                            'inline-flex items-center whitespace-nowrap rounded px-1.5 py-0.5 text-tremor-label font-medium ring-1 ring-inset',
                        )}
                        aria-hidden={true}
                    >
                        {scanData.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <div className="flex items-center space-x-1.5">
                        <Crosshair
                            className="size-5 text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                            aria-hidden={true}
                        />
                        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            {scanData.target}
                        </p>
                    </div>
                    {/* <div className="flex items-center space-x-1.5">
                        <RiMapPin2Fill
                            className="size-5 text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                            aria-hidden={true}
                        />
                        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            {scanData.scanId}
                        </p>
                    </div> */}
                    {/* <div className="flex items-center space-x-1.5">
                        <RiUserFill
                            className="size-5 text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                            aria-hidden={true}
                        />
                        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            {scanData.pentestid}
                        </p>
                    </div> */}
                </div>
                <Divider />
                <div className="flex sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-2">
                        {scanData.status === "in progress" ?
                            <ProgressCircle
                                value={33
                                    // (order.fulfillmentActual / order.fulfillmentTotal) *
                                    // 100
                                }
                                radius={9}
                                strokeWidth={3.5}
                            /> :
                            <CircleCheckBig
                                className="size-5 text-emerald-900 dark:text-emerald-400"
                                aria-hidden={true}
                            />
                        }
                        <p className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {toolNameMap[scanData.tool as keyof typeof toolNameMap]}
                            {/* ({order.fulfillmentActual}/{order.fulfillmentTotal}) */}
                        </p>
                    </div>
                    <p className="mt-2 text-tremor-default text-tremor-content dark:text-dark-tremor-content sm:mt-0">
                        {/* Started 1 min ago {scanData.startTime} */}
                        {dataTimeStr}
                    </p>
                </div>
            </Card>
        </>
    )
}