"use client"

import { AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import * as prevScans from "./scanHistory";
//import { Card, Title, Text, Badge, Accordion } from "@tremor/react";
import { ExternalLink } from "lucide-react";
import { Card, Title, Text, Accordion, AccordionHeader, AccordionBody } from "@tremor/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import moment from 'moment';

interface Vulnerability {
    Image: string;
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
}

export function getTotalVulnerabilitiesForImages(historyData: any): Vulnerability[] | null {
    if (!historyData) return null;

    const imageVulnerabilitiesMap: Record<string, { severity: Map<string, number>, lastScannedAt: string, imageName: string }> = {};

    for (let i = 0; i < historyData.length; i++) {
        const eachImageData = historyData[i].data;
        for (let key in eachImageData) {
            const obj = eachImageData[key];
            if (!obj?.Metadata?.RepoTags?.[0]) continue;

            const imageName = obj.Metadata.RepoTags[0];
            const severity = new Map<string, number>([
                ["LOW", 0],
                ["MEDIUM", 0],
                ["HIGH", 0],
                ["CRITICAL", 0],
            ]);

            if (obj?.Results?.[0]?.Vulnerabilities?.length) {
                for (const vul of obj.Results[0].Vulnerabilities) {
                    const count = severity.get(vul.Severity) || 0;
                    severity.set(vul.Severity, count + 1);
                }
            }
            const imageKey = key
            imageVulnerabilitiesMap[imageKey] = {
                severity,
                lastScannedAt: moment(Number(key)).format('hh:mm A - MMMM DD, YYYY'),
                imageName
            };
        }
    }

    const finalResult: Vulnerability[] = Object.entries(imageVulnerabilitiesMap).map(([image, data]) => ({
        Image: data.imageName,
        LOW: data.severity.get("LOW") || 0,
        MEDIUM: data.severity.get("MEDIUM") || 0,
        HIGH: data.severity.get("HIGH") || 0,
        CRITICAL: data.severity.get("CRITICAL") || 0,
        lastScannedAt: data.lastScannedAt,
        imageKey: image
    }));

    return finalResult;
}

export function returnImageDetails() {
    return imageDetails;
}


let imageDetails: any = null;


export function ScannedImages({ data, onImageClick }: { data: any; onImageClick: (imageKey: string, imageName: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="w-full p-2 mb-3">
            <Accordion className="rounded-lg">
                <AccordionHeader onClick={() => setIsOpen((prev) => !prev)}>
                    <span className="font-semibold text-lg">Images</span>
                </AccordionHeader>

                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-y-auto max-h-96"
                        >
                            <AccordionBody className="space-y-6 mt-4">
                                {data.map((vul: any, index: number) => (
                                    <Card key={index} className="relative p-4 rounded-lg shadow-lg">
                                        <div className="relative flex items-center justify-between pr-8">
                                            <Title>{vul.Image}</Title>
                                            <Title className="ml-4 me-3 text-sm text-gray-400">Scanned at:   {vul.lastScannedAt}</Title>
                                            <div className="absolute top-0 right-0 cursor-pointer">
                                                <ExternalLink
                                                    className="w-4 h-4 text-gray-500 hover:text-gray-300 transition"
                                                    onClick={() => onImageClick(vul.imageKey, vul.Image)}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center gap-6 mt-4">
                                            {/* LOW */}
                                            <div className="flex items-center gap-2">
                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
                                                </svg>
                                                <Text className="!text-green-600">{vul.LOW}</Text>
                                            </div>

                                            {/* MEDIUM */}
                                            <div className="flex items-center gap-2">
                                                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <circle cx={12} cy={12} r={10} />
                                                    <line x1={12} x2={12} y1={8} y2={12} />
                                                    <line x1={12} x2="12.01" y1={16} y2={16} />
                                                </svg>
                                                <Text className="!text-yellow-500">{vul.MEDIUM}</Text>
                                            </div>

                                            {/* HIGH */}
                                            <div className="flex items-center gap-2">
                                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                                                    <path d="M12 9v4" />
                                                    <path d="M12 17h.01" />
                                                </svg>
                                                <Text className="!text-orange-600">{vul.HIGH}</Text>
                                            </div>

                                            {/* CRITICAL */}
                                            <div className="flex items-center gap-2">
                                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <path d="M12 16h.01" />
                                                    <path d="M12 8v4" />
                                                    <path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z" />
                                                </svg>
                                                <Text className="text-red-600">{vul.CRITICAL}</Text>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </AccordionBody>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Accordion>
        </div>
    );
}

