import { RiBuildingFill, RiMapPin2Fill, RiUserFill } from "@remixicon/react";
import { Card, Divider, ProgressCircle } from "@tremor/react";

function classNames(...classes) {
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
    scanData: {
        pentestid: string;
        scan_id: string;
        status: string;
        target: string;
        tool: string;
        start_time: string;
    }
}) {

    return (
        <>
            <Card key={scanData.scan_id}>
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
                            {scanData.scan_id}
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
                        Started 1 min ago {scanData.start_time}
                    </p>
                </div>
            </Card>
        </>
    )
}