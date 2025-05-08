import { RiBuildingFill, RiMapPin2Fill, RiUserFill } from "@remixicon/react";
import { Card, Divider, ProgressCircle } from "@tremor/react";
import { ScanNotificationDataModified } from "./type";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}

const statusColor = {
    'In progress':
        'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20',
    Delivering:
        'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20',
    Delayed:
        'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/20',
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
                        {scanData.target}
                    </h4>
                    <span
                        className={classNames(
                            statusColor['In progress'],
                            'inline-flex items-center whitespace-nowrap rounded px-1.5 py-0.5 text-tremor-label font-medium ring-1 ring-inset',
                        )}
                        aria-hidden={true}
                    > In progress
                        {/* {scanData.status} */}
                    </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <div className="flex items-center space-x-1.5">
                        <RiBuildingFill
                            className="size-5 text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                            aria-hidden={true}
                        />
                        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            {scanData.tool}
                        </p>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <RiMapPin2Fill
                            className="size-5 text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                            aria-hidden={true}
                        />
                        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            {scanData.scanId}
                        </p>
                    </div>
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
                <div className="block sm:flex sm:items-center sm:justify-between sm:space-x-2">
                    <div className="flex items-center space-x-2">
                        <ProgressCircle
                            value={33
                                // (order.fulfillmentActual / order.fulfillmentTotal) *
                                // 100
                            }
                            radius={9}
                            strokeWidth={3.5}
                        />
                        <p className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Fulfillment controls
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