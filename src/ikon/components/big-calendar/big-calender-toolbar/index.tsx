import { Views } from "react-big-calendar";
import { Fragment, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/shadcn/ui/toggle-group";
import { BigCalenderToolbarProps } from "../type";

// Custom toolbar component
export default function BigCalenderToolbar({ onNavigate, onView, label, extraTools, view }: BigCalenderToolbarProps) {
    const [calViewsValue, setValue] = useState(view === Views.DAY ? "DAY" : view === Views.WEEK ? "WEEK" : "MONTH");
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                <ToggleGroup type="single" variant='outline' onValueChange={(value: string) => {
                    switch (value) {
                        case "PREV":
                            onNavigate("PREV");
                            break;
                        case "NEXT":
                            onNavigate("NEXT");
                            break;
                        case "TODAY":
                            onNavigate("TODAY");
                            break;
                        default:
                            break;
                    }
                }}>
                    <ToggleGroupItem className="rounded-e-none" value="PREV">
                        <ChevronLeft size={16} />
                    </ToggleGroupItem>
                    <ToggleGroupItem className='rounded-none border-x-0' value="NEXT">
                        <ChevronRight size={16} />
                    </ToggleGroupItem>
                    <ToggleGroupItem className='rounded-s-none' value="TODAY">
                        Today
                    </ToggleGroupItem>
                </ToggleGroup>
                <span className="rbc-toolbar-label">
                    {label}
                </span>
                <div className="flex flex-row gap-2">

                    {
                        extraTools?.map((tool, index: number) =>
                            <Fragment key={index}>
                                {tool}
                            </Fragment>
                        )
                    }

                    <ToggleGroup type="single" variant='outline' value={calViewsValue} onValueChange={(value: string) => {
                        setValue(value);
                        switch (value) {
                            case "DAY":
                                onView(Views.DAY);
                                break;
                            case "WEEK":
                                onView(Views.WEEK);
                                break;
                            case "MONTH":
                                onView(Views.MONTH);
                                break;
                            default:
                                break;
                        }
                    }}>
                        <ToggleGroupItem className="rounded-e-none" value="DAY">
                            Day
                        </ToggleGroupItem>
                        <ToggleGroupItem className='rounded-none border-x-0' value="WEEK">
                            Week
                        </ToggleGroupItem>
                        <ToggleGroupItem className='rounded-s-none' value="MONTH">
                            Month
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </div>
        </>
    );
}
