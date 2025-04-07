"use client"

import { AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import * as prevScans from "./scanHistory";
//import { Card, Title, Text, Badge, Accordion } from "@tremor/react";
import { ExternalLink } from "lucide-react";
import { Card, Title, Text, Accordion, AccordionHeader, AccordionBody } from "@tremor/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";


interface Vulnerability {
    Image: string;
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
}

export function getTotalVulnerabilitiesForImages(historyData: any): Vulnerability[] | null {
    console.log(historyData);
    if (!historyData) return null;

    const historyImages = historyData[1]?.data;
    if (!historyImages) return null;

    const imageVulnerabilitiesMap: Record<string, Map<string, number>> = {};

    for (let key in historyImages) {
        const severity = new Map<string, number>([
            ["LOW", 0],
            ["MEDIUM", 0],
            ["HIGH", 0],
            ["CRITICAL", 0],
        ]);

        const obj = historyImages[key];

        if (obj?.Results?.[0]?.Vulnerabilities?.length) {
            for (const vul of obj.Results[0].Vulnerabilities) {
                const count = severity.get(vul.Severity) || 0;
                severity.set(vul.Severity, count + 1);
            }
        }
        console.log(key, obj?.data?.Metadata?.RepoTags[0])
        imageVulnerabilitiesMap[obj?.data?.Metadata?.RepoTags[0] || key] = severity;
    }

    const finalResult: Vulnerability[] = Object.entries(imageVulnerabilitiesMap).map(([image, severityMap]) => ({
        Image: image,
        LOW: severityMap.get("LOW") || 0,
        MEDIUM: severityMap.get("MEDIUM") || 0,
        HIGH: severityMap.get("HIGH") || 0,
        CRITICAL: severityMap.get("CRITICAL") || 0,
    }));
    return finalResult;
}

export function returnImageDetails() {
    return imageDetails;
}


let imageDetails: any = null;


export function ScannedImages({ data, onImageClick }: { data: any; onImageClick: (imageName: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full p-4">
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
                            className="overflow-hidden"
                        >
                            <AccordionBody className="space-y-6 mt-4">
                                {data.map((vul: any, index: number) => (
                                    <Card key={index} className="relative p-4 rounded-lg shadow-lg">
                                        <div className="absolute top-2 right-2 cursor-pointer">
                                            <ExternalLink
                                                className="w-4 h-4 text-gray-600 hover:text-gray-800 transition"
                                                onClick={() => onImageClick(vul.Image)}
                                            />
                                        </div>
                                        <Title>{vul.Image}</Title>

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

