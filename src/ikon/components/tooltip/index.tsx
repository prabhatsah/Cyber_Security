import { Tooltip as TooltipComp, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shadcn/ui/tooltip";

export function Tooltip({ tooltipContent, children }: { tooltipContent: string | React.ReactNode, children: React.ReactNode }) {
    return (
        <TooltipProvider>
            <TooltipComp>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    {tooltipContent}
                </TooltipContent>
            </TooltipComp>
        </TooltipProvider>
    );
}