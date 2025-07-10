"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shadcn/lib/utils";
import './carousel.css';
import { TextButton } from "@/ikon/components/buttons";
import { Tooltip } from "@/ikon/components/tooltip";

export default function SoftwareShowcase({ softwareList }: any) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [indicatorStartIndex, setIndicatorStartIndex] = useState(0);
    const VISIBLE_INDICATORS = 6;
    const totalItems = softwareList.length;

    // Dynamically update visible indices
    const visibleIndices = useMemo(() => {
        return Array.from({ length: VISIBLE_INDICATORS }, (_, i) => (indicatorStartIndex + i) % totalItems);
    }, [indicatorStartIndex, totalItems]);

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
        if (currentIndex === 0) {
            setIndicatorStartIndex((totalItems - VISIBLE_INDICATORS) % totalItems);
        } else if ((currentIndex - indicatorStartIndex + totalItems) % totalItems === 0) {
            setIndicatorStartIndex((prev) => (prev - 1 + totalItems) % totalItems);
        }
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % totalItems);
        if (currentIndex === totalItems - 1) {
            setIndicatorStartIndex(0);
        } else if ((currentIndex - indicatorStartIndex + 1) % VISIBLE_INDICATORS === 0) {
            setIndicatorStartIndex((prev) => (prev + 1) % totalItems);
        }
    };

    const getIndicatorPosition = (index: number) => {
        const startAngle = -150;
        const angleRange = 120;
        const angle = startAngle + (index * angleRange / (VISIBLE_INDICATORS - 1));
        const angleRad = angle * (Math.PI / 180);

        const radius = 15;
        const x = radius * Math.cos(angleRad);
        const y = radius * Math.sin(angleRad);
        return { x, y };
    };

    return (
        <div className="min-h-screen from-gray-900 to-indigo-900 flex items-center justify-center px-4">
            <div className="max-w-4xl w-full relative">
                <button onClick={handlePrevious} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 text-white/80 hover:text-white transition-colors" aria-label="Previous software">
                    <ChevronLeft className="w-8 h-8 text-foreground" />
                </button>

                <button onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-white/80 hover:text-white transition-colors" aria-label="Next software">
                    <ChevronRight className="w-8 h-8 text-foreground" />
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-[30rem] h-[30rem]">
                            <div className="absolute inset-0 rounded-full border-2 border-circle-app-carousel" />

                            {visibleIndices.map((softwareIndex, displayIndex) => {
                                const position = getIndicatorPosition(displayIndex);
                                return (
                                    <button
                                        key={softwareIndex}
                                        onClick={() => setCurrentIndex(softwareIndex)}
                                        className={cn(
                                            "absolute rounded-full transition-all duration-300",
                                            softwareIndex === currentIndex
                                                ? "bg-active-software w-8 h-8 scale-200"
                                                : "bg-indicator-software hover:bg-indigo-500 w-5 h-5"
                                        )}
                                        style={{
                                            transform: `translate(${position.x}rem, ${position.y}rem) translate(-50%, -50%)`,
                                            left: "50%",
                                            top: "50%",
                                        }}
                                        aria-label={`Go to ${softwareList[softwareIndex].SOFTWARE_NAME}`}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="relative z-10 text-center flex flex-col items-center justify-center h-[32rem]">
                        <div className="w-[30rem] px-8 flex flex-col gap-10 items-center justify-center">
                            <p className="text-xl font-semibold transition-all duration-300">
                                {softwareList[currentIndex].SOFTWARE_NAME}
                            </p>
                            <TextButton className="" variant={'default'}>
                                Subscribe
                            </TextButton>
                            {/* <Tooltip tooltipContent={<div className='desc-tooltip w-1/4 mx-auto'>{softwareList[currentIndex].SOFTWARE_DESCRIPTION}</div>}>
                                
                            </Tooltip> */}
                            <p className="leading-relaxed line-clamp-4 overflow-hidden">
                                {softwareList[currentIndex].SOFTWARE_DESCRIPTION}
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



