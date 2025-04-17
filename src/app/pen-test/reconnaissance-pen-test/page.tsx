'use client';

import { Card, Divider, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react';
import { RiBuildingFill, RiMapPin2Fill, RiUserFill, RiTimeLine, RiAlarmWarningFill, RiCheckLine } from '@remixicon/react';
import { Button } from '@/components/Button';

const reconnaissanceFormData = [
    {
        reconnaissanceStatus: 'Active',
        reconnaissanceComponent: [
            {
                webAppName: 'My Web App',
                penTestName: 'PenTest 1',
                penTestDescription: 'A description of PenTest 1.',
                scope: 'Internal',
                typeOfTesting: 'Black Box',
                startDate: '2025-04-01',
                endDate: '2025-04-10',
                timeZone: 'GMT',
                priority: 'High',
                securityLevel: 'Medium',
                buttonName: 'Initiate Active Reconnassiance',
            },
        ],

    },
    {
        reconnaissanceStatus: 'Passive',
        reconnaissanceComponent: [
            {
                webAppName: 'My Web App',
                penTestName: 'PenTest 1',
                penTestDescription: 'A description of PenTest 1.',
                scope: 'Internal',
                typeOfTesting: 'Black Box',
                startDate: '2025-04-01',
                endDate: '2025-04-10',
                timeZone: 'GMT',
                priority: 'High',
                securityLevel: 'Medium',
                buttonName: 'Initiate Passive Reconnassiance',
            },
        ],
    },
];

export default function ReconnaissanceConfigFormData() {
    return (
        <>
            <Card className="bg-tremor-background-muted p-0 dark:bg-dark-tremor-background-muted">
                <TabGroup>
                    <TabList className="bg-tremor-background-muted px-6 dark:bg-dark-tremor-background-muted mb-2">
                        {reconnaissanceFormData.map((category, index) => (
                            <Tab
                                key={category.reconnaissanceStatus}
                                className="pb-2.5 font-medium hover:border-gray-300 flex items-center space-x-2"
                            >
                                <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    {category.reconnaissanceStatus}
                                </span>
                            </Tab>
                        ))}
                    </TabList>

                    <TabPanels>
                        {reconnaissanceFormData.map((category) => (
                            <TabPanel
                                key={category.reconnaissanceStatus}
                                className="p-4"
                            >
                                {category.reconnaissanceComponent.map((reconnaissanceComponent) => (
                                    <Card key={reconnaissanceComponent.penTestName} className="bg-gray-50 p-6 hover:bg-gray-100 transition-colors duration-200 mb-4">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-xl font-semibold text-widget-mainHeader">
                                                        {reconnaissanceComponent.penTestName}
                                                    </h4>
                                                    <p className="text-widget-mainDesc max-w-3xl">
                                                        {reconnaissanceComponent.penTestDescription}
                                                    </p>
                                                </div>
                                                <Button>
                                                    <span>
                                                        {reconnaissanceComponent.buttonName}
                                                    </span>
                                                </Button>
                                            </div>
                                            <Divider />
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <div className="flex items-center space-x-3">
                                                    <RiBuildingFill
                                                        className="size-5 text-blue-600"
                                                        aria-hidden={true}
                                                    />
                                                    <div>
                                                        <p className="text-sm text-widget-mainHeader">Web App Name</p>
                                                        <p className="text-widget-mainDesc font-medium">{reconnaissanceComponent.webAppName}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <RiMapPin2Fill
                                                        className="size-5 text-green-600"
                                                        aria-hidden={true}
                                                    />
                                                    <div>
                                                        <p className="text-sm text-widget-mainHeader">Scope</p>
                                                        <p className="text-widget-mainDesc font-medium">{reconnaissanceComponent.scope}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <RiUserFill
                                                        className="size-5 text-purple-600"
                                                        aria-hidden={true}
                                                    />
                                                    <div>
                                                        <p className="text-sm text-widget-mainHeader">Testing Type</p>
                                                        <p className="text-widget-mainDesc font-medium">{reconnaissanceComponent.typeOfTesting}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <RiTimeLine
                                                        className="size-5 text-orange-600"
                                                        aria-hidden={true}
                                                    />
                                                    <div>
                                                        <p className="text-sm text-widget-mainHeader">Duration</p>
                                                        <p className="text-widget-mainDesc font-medium">
                                                            {reconnaissanceComponent.startDate} - {reconnaissanceComponent.endDate}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <RiAlarmWarningFill
                                                        className="size-5 text-yellow-600"
                                                        aria-hidden={true}
                                                    />
                                                    <div>
                                                        <p className="text-sm text-widget-mainHeader">Time Zone</p>
                                                        <p className="text-widget-mainDesc font-medium">{reconnaissanceComponent.timeZone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </TabPanel>
                        ))}
                    </TabPanels>
                </TabGroup>
            </Card>
        </>
    );
}
