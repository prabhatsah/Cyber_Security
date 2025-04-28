'use client';

import { RiArrowRightUpLine, RiGlobalLine } from '@remixicon/react';
import { Card, Divider } from '@tremor/react';

const subDomainData = [
    {
        subDomainName: 'Sub Domain Discovered',
        initials: '2',
        href: '#',
    },
];

export default function SubDomainWizget() {
    return (
        <>
            <div className=" grid grid-cols-1 gap-6">
                {subDomainData.map((member) => (
                    <Card key={member.subDomainName} className="group flex items-center space-x-4">
                        <div className=" items-center">
                            <div className="truncate">
                                <p className="truncate text-xl font-medium text-widget-mainHeader ">
                                    <a href={member.href} className="focus:outline-none">
                                        {/* Extend link to entire card */}
                                        <span className="absolute inset-0 " aria-hidden={true} />
                                        {member.subDomainName}
                                    </a>
                                </p>
                            </div>
                            <span className='text-widget-mainDesc font-medium'>
                                {member.initials}
                            </span>
                        </div>
                        <span>
                            <RiGlobalLine
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