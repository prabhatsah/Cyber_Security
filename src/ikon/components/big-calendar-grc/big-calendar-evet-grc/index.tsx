import { Eye, SquarePen } from "lucide-react";
import { Tooltip } from "@/ikon/components/tooltip";
import { BigCalendarEventProps, ExtraParamsEvent } from "../../big-calendar/type";

// Custom event component
export default function BigCalenderEvent({
  event,
  extraParamsEvent,
}: {
  event: BigCalendarEventProps & { type?: "meeting" | "audit" };
  extraParamsEvent?: ExtraParamsEvent;
}) {
  const dotColor =
    event.type === "meeting"
      ? "#007bff"
      : event.type === "audit"
      ? "#28a745"
      : "#6c757d";

  const eventTypeLabel =
    event.type === "meeting"
      ? "Meeting"
      : event.type === "audit"
      ? "Audit"
      : "";

  return (
    <div className="flex flex-row justify-between items-center gap-1">
      <div className="flex items-center gap-1 truncate">
        <Tooltip tooltipContent={eventTypeLabel}>
          <span
            className="inline-block"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: dotColor,
              flexShrink: 0,
            }}
          />
        </Tooltip>
        <span className="truncate text-[10px]">{event.title}</span>
      </div>
      <span className="flex flex-row gap-1">
        {(extraParamsEvent?.isEditableAll || event.isEditable) && (
          <Tooltip tooltipContent="Edit">
            <button
              className="event-edit-button"
              onClick={(e) => {
                e.stopPropagation();
                extraParamsEvent?.onEditEventClick?.(event);
              }}
            >
              <SquarePen size={16} />
            </button>
          </Tooltip>
        )}
        {(event?.isViewable || event.isEditable) && (
        <Tooltip tooltipContent="View">
          <button
            className="event-view-button"
            onClick={(e) => {
              e.stopPropagation();
              extraParamsEvent?.onViewEventClick?.(event);
            }}
          >
            <Eye size={16} />
          </button>
        </Tooltip>
        )}
      </span>
    </div>
  );
}
