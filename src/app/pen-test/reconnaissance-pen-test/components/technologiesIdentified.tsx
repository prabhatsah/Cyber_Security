'use client';

import { RiArrowRightUpLine, RiGlobalLine, RiLightbulbFill } from '@remixicon/react';
import { Card, Divider } from '@tremor/react';

const technologiesIdentifiedData = [
    {
        technologiesIdentifiedName: 'Technologies Identified',
        initials: 'Cms,Web',
        href: '#',
    },
];

export default function TechnologiesIdentifiedWizget() {
    return (
        <>
            <div className=" grid grid-cols-1 gap-6">
                {technologiesIdentifiedData.map((member) => (
                    <Card key={member.technologiesIdentifiedName} className="group flex items-center space-x-4">
                        <div className=" items-center">
                            <div className="truncate">
                                <p className="truncate text-xl font-medium text-widget-mainHeader ">
                                    <a href={member.href} className="focus:outline-none">
                                        {/* Extend link to entire card */}
                                        <span className="absolute inset-0 " aria-hidden={true} />
                                        {member.technologiesIdentifiedName}
                                    </a>
                                </p>
                            </div>
                            <span className='text-widget-mainDesc font-medium'>
                                {member.initials}
                            </span>
                        </div>
                        <span>
                            <RiLightbulbFill
                                className={`size-8 `}
                                aria-hidden={true}
                            />
                        </span>
                    </Card>
                ))}
            </div>
        </>
    );
}