'use client'
import { WidgetsFunctionProps } from "./type";
import Icon from "../icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shadcn/ui/tooltip";
import { Button } from "@/shadcn/ui/button";



export default function Widgets({ widgetData }: WidgetsFunctionProps) {
    return (
        <div className="flex flex-col md:flex-row gap-2">
            {
                widgetData.map((widget) => (
                    <div className="flex flex-1 flex-row justify-between border rounded-md p-2" key={widget.id}>
                        <div className="flex flex-col">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className="cursor-default select-text"> {/* Use normal cursor */}
                                        <p className="font-medium max-w-[240px] truncate">{widget.widgetText}</p>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{widget.widgetText}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <div>
                                {
                                    widget.onButtonClickfunc ?
                                        <Button className="px-0" variant={"link"} onClick={() => widget.onButtonClickfunc?.({ id: widget.id })}>
                                            {widget.widgetNumber}
                                        </Button> :
                                        <p className="inline-flex items-center justify-center px-0 py-2 text-sm font-medium border border-transparent rounded-md">
                                            {widget.widgetNumber}
                                        </p>
                                }

                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            {widget.iconName && <Icon name={widget.iconName} />}
                        </div>
                    </div>
                ))
            }

        </div>
    )
}