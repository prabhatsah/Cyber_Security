'use client';

import { Card, Divider, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react';
import { RiBuildingFill, RiMapPin2Fill, RiUserFill, RiTimeLine, RiAlarmWarningFill } from '@remixicon/react';
import { Button } from '@/components/Button';
import SubDomainWizget from './components/subDomain';
import OpenPortDiscoverWizget from './components/openPortDiscover';
import TechnologiesIdentifiedWizget from './components/technologiesIdentified';
import VulnerabilitiesWizget from './components/vulnerabilitiesFound';
import { HarvesterData } from '@/app/scans/OSINT/components/type';
import CriticalSubdomainWizget from './components/criticalSubdomain';


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

export default function ReconnaissanceConfigFormData({ componentData }: { componentData: any }) {
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
                                    <Card key={reconnaissanceComponent.penTestName} className="bg-gray-50 p-4 hover:bg-gray-100 transition-colors duration-200 mb-4">
                                        <div className="space-y-6">
                                            <div className="flex   items-center gap-4">
                                                <div>
                                                    <SubDomainWizget />
                                                </div>
                                                <div>
                                                    <OpenPortDiscoverWizget />
                                                </div>
                                                <div>
                                                    <TechnologiesIdentifiedWizget />
                                                </div>
                                                <Button>
                                                    <span>
                                                        {reconnaissanceComponent.buttonName}
                                                    </span>
                                                </Button>
                                            </div>
                                            <Divider />
                                            <div>
                                                {/* Ensure widgetData is safely passed to VulnerabilitiesWizget */}
                                                <VulnerabilitiesWizget widgetData={reconnaissanceComponent.widgetData ?? {}} />
                                            </div>
                                            <Divider />
                                            <div>
                                                <CriticalSubdomainWizget />
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
