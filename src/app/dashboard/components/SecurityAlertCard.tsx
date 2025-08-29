'use client';

import { PenTestWithoutScanModified } from '@/app/pen-test/web-app-pen-test/components/type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@tremor/react';

import { Globe, Shield, Box, Glasses, Code, ChevronDown, ChevronUp, GlobeLock, CloudCog, FolderCog, Network, TabletSmartphone } from 'lucide-react';
import { parse, formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface SecurityAlertCardProps {
    pentestData: PenTestWithoutScanModified[];
}

interface AccordionSection {
    id: string;
    title: string;
    icon: React.ReactNode;
    testTypes: string[];
}

const SecurityAlertCard: React.FC<SecurityAlertCardProps> = ({ pentestData }) => {
    console.log(pentestData);

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        webApp: true,
        cloudSecurity: true,
        api: true,
        network: true,
        mobile: true,
    });

    const accordionSections: AccordionSection[] = [
        {
            id: 'webApp',
            title: 'Web Application Penetration Testing',
            icon: <GlobeLock className="h-5 w-5" />,
            testTypes: ['web application', 'webapp', 'web app']
        },
        {
            id: 'cloudSecurity',
            title: 'Cloud Security Penetration Testing',
            icon: <CloudCog className="h-5 w-5" />,
            testTypes: ['cloud', 'cloud security']
        },
        {
            id: 'api',
            title: 'API Penetration Testing',
            icon: <FolderCog className="h-5 w-5" />,
            testTypes: ['api', 'rest api', 'api security']
        },
        {
            id: 'network',
            title: 'Network Penetration Testing',
            icon: <Network className="h-5 w-5" />,
            testTypes: ['network', 'infrastructure']
        },
        {
            id: 'mobile',
            title: 'Mobile Application Penetration Testing',
            icon: <TabletSmartphone className="h-5 w-5" />,
            testTypes: ['mobile', 'mobile app', 'ios', 'android']
        }
    ];

    const getSeverityColor = (severity: string) => {
        const colors = {
            low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
            medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
            high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
            critical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
        };
        return colors[severity as keyof typeof colors] || colors.low;
    };

    const getMethodologyIcon = (methodology: string) => {
        switch (methodology.toLowerCase()) {
            case 'black box':
                return <Box className="h-4 w-4" />;
            case 'white box':
                return <Code className="h-4 w-4" />;
            case 'grey box':
                return <Glasses className="h-4 w-4" />;
            default:
                return <Box className="h-4 w-4" />;
        }
    };

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const categorizeData = (sectionId: string) => {
        const section = accordionSections.find(s => s.id === sectionId);
        if (!section) return [];

        return pentestData.filter(item =>
            section.testTypes.some(type =>
                item.basicDetails.testingType?.toLowerCase().includes(type.toLowerCase()) ||
                item.basicDetails.target?.toLowerCase().includes(type.toLowerCase())
            )
        );
    };

    const renderPentestItems = (items: PenTestWithoutScanModified[]) => {
        if (items.length === 0) {
            return (
                <div className="text-center py-6 text-muted-foreground">
                    No active tests found for this category.
                </div>
            );
        }

        return items.map((item, idx) => {
            const pentest = item.basicDetails;
            return (
                <div
                    key={item.pentestId ?? idx}
                    className="border last:border-0  px-6 py-4"
                >
                    <div className="space-y-3">
                        {/* Website and Severity */}
                        <div className="flex items-center justify-between">
                            <div className='flex gap-4'>
                                <h4 className="font-medium">{pentest.target}</h4>
                                <span
                                    className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getSeverityColor(
                                        pentest.priorityLevel.toLowerCase()
                                    )}`}
                                >
                                    {pentest.priorityLevel}
                                </span>
                            </div>
                            {/* Created Date */}
                            <div className="text-xs ">
                                Created{' '}
                                {formatDistanceToNow(
                                    parse(pentest.createdOn, 'yyyy-MMM-dd HH:mm:ss', new Date()),
                                    { addSuffix: true }
                                )}
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            {/* Type (External/Internal) */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {pentest.scope === "External" ? (
                                    <>
                                        <Globe className="h-4 w-4" />
                                        <span>External Assessment</span>
                                    </>
                                ) : (
                                    <>
                                        <Shield className="h-4 w-4" />
                                        <span>Internal Assessment</span>
                                    </>
                                )}
                            </div>

                            {/* Methodology */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {getMethodologyIcon(pentest.testingType)}
                                <span className="capitalize">{pentest.testingType} Testing</span>
                            </div>
                        </div>
                        {/* Progress */}
                        <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="">Progress</span>
                                <span className="font-medium">{pentest.progress}%</span>
                            </div>
                            <ProgressBar value={pentest.progress} className="h-2" />
                        </div>


                    </div>
                </div>
            );
        });
    };

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold">Active Penetration Tests</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pt-0">
                <div className="space-y-1">
                    {accordionSections.map((section) => {
                        const sectionData = categorizeData(section.id);
                        const isOpen = openSections[section.id];

                        return (
                            <div key={section.id} className="border-b last:border-0">
                                {/* Accordion Header */}
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="w-full px-6 py-4 flex items-center justify-between  transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        {section.icon}
                                        <span className="font-medium text-sm">{section.title}</span>
                                        <span className="text-xs  bg-muted px-2 py-1 rounded-full">
                                            {sectionData.length}
                                        </span>
                                    </div>
                                    {isOpen ? (
                                        <ChevronUp className="h-4 w-4  transition-transform" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4  transition-transform" />
                                    )}
                                </button>

                                {/* Accordion Content */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="bg-muted/20">
                                        {renderPentestItems(sectionData)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default SecurityAlertCard;