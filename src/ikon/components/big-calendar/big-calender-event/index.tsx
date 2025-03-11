import { Eye, SquarePen } from "lucide-react";
import { BigCalendarEventProps, ExtraParamsEvent } from "../type";
import { Tooltip } from "@/ikon/components/tooltip";

// Custom event component
export default function BigCalenderEvent({ event, extraParamsEvent }: { event: BigCalendarEventProps, extraParamsEvent?: ExtraParamsEvent }) {
    return (
        <div className="custom-event flex flex-row justify-between">
            <span className="truncate">{event.title}</span>
            <span className="flex flex-row gap-1">
                {(extraParamsEvent?.isEditableAll || event.isEditable) &&
                    <Tooltip tooltipContent="Edit">
                        <button
                            className="event-edit-button"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering other event handlers
                                extraParamsEvent?.onEditEventClick?.(event);
                            }}
                        >
                            <SquarePen size={16} />
                        </button>
                    </Tooltip>
                }
                <Tooltip tooltipContent="View">
                    <button
                        className="event-view-button"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering other event handlers
                            extraParamsEvent?.onViewEventClick?.(event);
                        }}
                    >
                        <Eye size={16} />
                    </button>
                </Tooltip>


            </span>
        </div>
    );
}