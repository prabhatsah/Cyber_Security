'use client';

import { Card } from '@tremor/react';
import { Globe, Server, Code, ExternalLink } from 'lucide-react';
import { Label } from "@radix-ui/react-label";
const subdomainData = [
    {
        id: '1',
        name: 'api.example.com',
        ports: [80],
        technologies: ['Node.js', 'Express', 'MongoDB'],
    },
    {
        id: '2',
        name: 'admin.example.com',
        ports: [443],
        technologies: ['React', 'Redux', 'Nginx'],
    },
    {
        id: '3',
        name: 'shop.example.com',
        ports: [8080],
        technologies: ['PHP', 'MySQL', 'Apache'],
    },
    {
        id: '4',
        name: 'mail.example.com',
        ports: [2500],
        technologies: ['Postfix', 'Dovecot'],
    },
    {
        id: '5',
        name: 'cdn.example.com',
        ports: [8088],
        technologies: ['Cloudflare', 'Varnish'],
    },
];

export default function CriticalSubdomainWizget() {
    return (
        <div className="col-span-1 space-y-2">
            <Label className=" font-bold text-widget-title text-widgetHeader">Top 5 Critical </Label>
            <Card className=" rounded-md  overflow-hidden">
                <div className="border-b grid grid-cols-3 py-3">
                    <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-blue-600" />
                        <h3 className="font-medium  text-widget-mainHeader">Sub Domain</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Server className="h-4 w-4 text-purple-600" />
                        <h3 className="font-medium  text-widget-mainHeader">Ports</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Code className="h-4 w-4 text-green-600" />
                        <h3 className="font-medium  text-widget-mainHeader">Technologies</h3>
                    </div>
                </div>

                <div className="divide-y">
                    {subdomainData.map((subdomain) => (
                        <div key={subdomain.id} className="group p-4transition-colors duration-200">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="overflow-hidden p-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium  truncate">{subdomain.name}</h4>
                                    </div>
                                </div>

                                <div className='flex'>
                                    <div className="flex flex-wrap items-center gap-1">
                                        {subdomain.ports.map((port) => (
                                            <span
                                                key={`${subdomain.id}-${port}`}
                                                className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 rounded-md"
                                            >
                                                {port}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className='flex items-center'>
                                    <div className="flex flex-wrap gap-1">
                                        {subdomain.technologies.map((tech) => (
                                            <span
                                                key={`${subdomain.id}-${tech}`}
                                                className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-md"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}