import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shadcn/ui/tooltip"
import { ReactNode } from "react";

type tooltipProps = {
    children: ReactNode;
    tooltiTtext: string;
}

export function GetTooltip({children, tooltiTtext}: tooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltiTtext}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
