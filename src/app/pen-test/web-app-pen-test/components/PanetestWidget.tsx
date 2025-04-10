'use client';

import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Callout } from '@/components/Callout';
import {
    RiAddFill,
    RiBuildingFill,
    RiCalendarScheduleLine,
    RiCrosshairLine,
    RiInformationLine,
    RiMapPin2Fill,
    RiMoneyCnyBoxFill,
    RiSettings3Line,
    RiTimeLine,
    RiTimeZoneFill,
    RiTimeZoneLine,
    RiTruckLine,
    RiUserFill,
    RiUserLine,
} from '@remixicon/react';
import {
    Card,
    Divider,
    ProgressCircle,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@tremor/react';
import Link from 'next/link';


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const data = [
    {
        status: 'In progress',
        icon: RiTimeZoneFill,
        iconColor: 'text-blue-500',
        badgeColor: 'Low',
        orders: [
            {
                item: 'Ikon Dev Pentest',
                scope: 'Internal',
                testingType: 'White-box',
                startDate: '10-Apr-2025 15:30',
                endDate: '17-Apr-2025 15:30',
                timeZone: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
                fulfillmentActual: 8,
                fulfillmentTotal: 10,
                lastUpdated: '2min ago',
                createdBy: 'Siddharth Kumar',
            },
        ],
    },
];

const statusColor = {
    'In progress':
        'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20',
    Delivering:
        'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20',
    Delayed:
        'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/20',
};
const badgeColor = {
    'Low':
        'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/20',
    Delivering:
        'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20',
    Delayed:
        'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/20',
};

export default function PanetestWidget() {
    return (
        <>

            <div>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='mb-4 text-widgetHeader'>Configure Pentest</h2>
                    <Button>
                        <Link
                            href="/pen-test/web-app-pen-test/create-pentest">
                            <RiAddFill className="h-5 w-5 mr-2" /> Initiate Pentest
                        </Link>
                    </Button>
                </div>

                {data.map((category) => (
                    <div
                        key={category.status}
                        className="space-y-4"
                    >
                        {category.orders.map((order) => (
                            <Card key={order.item}>
                                <div className="flex items-center justify-between space-x-4 sm:justify-start sm:space-x-2">
                                    <h4 className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                        {order.item}
                                    </h4>
                                    <span
                                        className={classNames(
                                            statusColor[category.status],
                                            'inline-flex items-center whitespace-nowrap rounded px-1.5 py-0.5 text-tremor-label font-medium ring-1 ring-inset',
                                        )}
                                        aria-hidden={true}
                                    >
                                        {category.status}
                                    </span>
                                    <span
                                        className={classNames(
                                            badgeColor[category.badgeColor],
                                            'inline-flex items-center whitespace-nowrap rounded px-1.5 py-0.5 text-tremor-label font-medium ring-1 ring-inset',
                                        )}
                                        aria-hidden={true}
                                    >
                                        {category.badgeColor}
                                    </span>
                                </div>

                                <div className="mt-4 flex gap-4 justify-start w-full">

                                    <div className='w-1/3 flex flex-col gap-6 border border-gray-200 dark:border-gray-700 p-2 rounded-md'>
                                        <div className="flex gap-3">
                                            <RiCrosshairLine className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Scope</p>
                                                <p className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{order.scope}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <RiMoneyCnyBoxFill className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Testing Type</p>
                                                <p className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{order.testingType}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <RiUserLine className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Created By</p>
                                                <p className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{order.createdBy}</p>
                                            </div>
                                        </div>
                                    </div>


                                    <div className='w-1/2 flex flex-col gap-6 justify-between border border-gray-200 dark:border-gray-700 p-2 rounded-md'>
                                        <div className="flex gap-3">
                                            <RiCalendarScheduleLine className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Start Date</p>
                                                <p className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{order.startDate}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <RiCalendarScheduleLine className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">End Date</p>
                                                <p className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{order.endDate}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <RiTimeZoneLine className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Time Zone</p>
                                                <p className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{order.timeZone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="flex items-center space-x-1.5">
                                            <RiTimeZoneFill
                                            className="size-5 text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                                            aria-hidden={true}
                                        />
                                        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                            {order.timeZone}
                                        </p>
                                            <div className="border border-gray-200 dark:border-gray-700 p-2 rounded-md">
                                                <p className="truncate font-semibold">(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi</p>
                                                <p className="truncate">Start Date: <span className="truncate font-semibold">10-Apr-2025 15:30</span></p>
                                                <p className="truncate">End Date: <span className="truncate font-semibold">17-Apr-2025 15:30</span></p>
                                            </div>
                                        </div> */}


                                    <div>
                                        <Callout variant="default" title="Pen Test Description" icon={RiInformationLine}>
                                            A Web Application Penetration Test (Web App Pen Test) is a simulated cyber attack designed to identify and exploit vulnerabilities within a web application.
                                            The goal is to assess the application's security posture by simulating how an attacker might gain unauthorized access to the system and its data
                                        </Callout>
                                    </div>
                                </div>
                                <Divider />
                                <div className="block sm:flex sm:items-center sm:justify-between sm:space-x-2">
                                    <div className="flex items-center space-x-2">
                                        <ProgressCircle
                                            value={(3 / 6) * 100}
                                            radius={9}
                                            strokeWidth={3.5}
                                        />
                                        <p className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                            Current Status [ Planning ]
                                        </p>
                                    </div>
                                    <p className="mt-2 text-tremor-default text-tremor-content dark:text-dark-tremor-content sm:mt-0">
                                        Updated {order.lastUpdated}
                                    </p>
                                </div>
                            </Card>

                        ))}
                    </div>
                ))}
            </div>


        </>
    );
}