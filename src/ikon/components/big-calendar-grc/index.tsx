"use client";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import "./index.css";
import BigCalenderEvent from "./big-calendar-evet-grc";
import BigCalenderToolbar from "./big-calendar-toolbar-grc";
import { BigCalendarProps } from "../big-calendar/type";

// Localization settings
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function BigCalendar({
  events,
  extraParamsEvent,
  extraTools,
  onDateClick,
}: BigCalendarProps & { onDateClick?: (date: Date) => void }) {
  const [view, setView] = useState(
    extraParamsEvent?.defaultView === "day"
      ? Views.DAY
      : extraParamsEvent?.defaultView === "week"
      ? Views.WEEK
      : extraParamsEvent?.defaultView === "month"
      ? Views.MONTH
      : extraParamsEvent?.defaultView === "work week"
      ? Views.WORK_WEEK
      : extraParamsEvent?.defaultView === "agenda"
      ? Views.AGENDA
      : Views.MONTH
  );
  const [date, setDate] = useState(new Date());

  return (
    <Calendar
      localizer={localizer}
      events={events || []}
      startAccessor="start"
      endAccessor="end"
      selectable // 👈 Add this to enable selecting dates
      onSelectSlot={(slotInfo) => {
        if (onDateClick && slotInfo.start) {
          onDateClick(slotInfo.start); // 👈 call parent click handler
        }
      }}
      views={[Views.DAY, Views.WEEK, Views.MONTH]}
      view={view}
      onView={(view) => setView(view)}
      date={date}
      onNavigate={(date) => setDate(date)}
      components={{
        event: (props) => (
          <BigCalenderEvent
            event={props.event}
            extraParamsEvent={extraParamsEvent}
          />
        ),
        toolbar: (props) => (
          <BigCalenderToolbar {...props} extraTools={extraTools} view={view} />
        ),
      }}
      style={{
        height: extraParamsEvent?.height || "100%",
        margin: extraParamsEvent?.margin || "0px",
      }}
    />
  );
}

// "use client";
// import { format, getDay, parse, startOfWeek, isSameDay } from "date-fns"; // Import isSameDay
// import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { useState, useMemo } from "react"; // Import useMemo
// import "./index.css"; // Make sure your custom CSS is imported
// import BigCalenderEvent from "./big-calendar-evet-grc";
// import BigCalenderToolbar from "./big-calendar-toolbar-grc";
// import { BigCalendarEventProps, BigCalendarProps, ExtraParamsEvent } from "../big-calendar/type";

// // Localization settings (keep as is)
// const locales = {
//   "en-US": require("date-fns/locale/en-US"),
// };
// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// // Custom Date Cell Wrapper Component
// const CustomDateCellWrapper = ({
//   children,
//   value, // The date of the cell
//   allEvents, // Pass all events to the wrapper
//   eventTypeDefs // Pass type definitions for colors
// }: {
//   children: React.ReactNode;
//   value: Date;
//   allEvents: BigCalendarEventProps[];
//   eventTypeDefs?: ExtraParamsEvent['eventTypeDefs'];
// }) => {
//   // Find unique event types for the current date cell
//   const eventTypesOnDate = useMemo(() => {
//     const types = new Set<string>();
//     allEvents.forEach((event) => {
//         // Check if the event's start date matches the cell's date
//         // Adjust logic if events can span multiple days and you want dots on all days
//         if (event.start && isSameDay(event.start, value)) {
//             if (event.type) {
//                 types.add(event.type);
//             }
//         }
//     });
//     return Array.from(types);
//   }, [allEvents, value]); // Recalculate only if events or date change

//   return (
//     <div className="rbc-day-bg-content"> {/* Added a wrapper div */}
//       {children} {/* Render the default cell content (like the date number) */}
//       {eventTypesOnDate.length > 0 && (
//         <div className="date-cell-dots-container">
//           {eventTypesOnDate.map((type) => {
//              // Use color from eventTypeDefs if available, otherwise fallback or CSS class
//              const color = eventTypeDefs?.[type]?.color;
//              const style = color ? { backgroundColor: color } : {};
//             return (
//               <span
//                 key={type}
//                 className={`event-dot event-dot-${type}`} // Add type-specific class
//                 style={style} // Apply dynamic color if needed
//                 title={eventTypeDefs?.[type]?.label || type} // Add tooltip
//               ></span>
//             )
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default function BigCalendar({
//   events,
//   extraParamsEvent,
//   extraTools,
// }: BigCalendarProps) {
//   const [view, setView] = useState(
//     extraParamsEvent?.defaultView === "day" ? Views.DAY :
//     extraParamsEvent?.defaultView === "week" ? Views.WEEK :
//     extraParamsEvent?.defaultView === "month" ? Views.MONTH :
//     extraParamsEvent?.defaultView === "work week" ? Views.WORK_WEEK :
//     extraParamsEvent?.defaultView === "agenda" ? Views.AGENDA : Views.MONTH
//   );
//   const [date, setDate] = useState(new Date());

//   // Memoize components to prevent unnecessary re-renders
//    const components = useMemo(() => ({
//         // Keep original event component for other views (Day, Week)
//         event: (props: any) => <BigCalenderEvent event={props.event} extraParamsEvent={extraParamsEvent} />,
//         toolbar: (props: any) => <BigCalenderToolbar {...props} extraTools={extraTools} view={view} extraParamsEvent={extraParamsEvent} />, // Pass extraParamsEvent for legend
//          month: { // Customize Month view components
//             // Use CustomDateCellWrapper for rendering dots in month cells
//             dateCellWrapper: (props: any) => (
//                 <CustomDateCellWrapper
//                     {...props}
//                     allEvents={events || []} // Pass all events
//                     eventTypeDefs={extraParamsEvent?.eventTypeDefs} // Pass type defs
//                 />
//             ),
//             // Optionally hide default event rendering in Month view via component (alternative to CSS)
//             // event: () => null, // Hides default event boxes completely in Month view
//         },
//         // You might want custom components for day/week headers etc. too
//     }), [events, extraParamsEvent, extraTools, view]); // Dependencies for memoization

//   return (
//     <Calendar
//       localizer={localizer}
//       events={events || []}
//       startAccessor="start"
//       endAccessor="end"
//       views={[Views.DAY, Views.WEEK, Views.MONTH]} // Keep available views
//       view={view} // Controlled view
//       onView={setView} // Handler to change view
//       date={date} // Controlled date
//       onNavigate={setDate} // Handler to change date
//       components={components} // Use memoized custom components
//       style={{
//         height: extraParamsEvent?.height || "100%",
//         margin: extraParamsEvent?.margin || "0px",
//       }}
//       // Add messages prop to customize or hide the "+x more" link if needed
//       messages={{
//           showMore: (count: number) => `+${count}`, // Keep default text or customize
//           // Or to hide it completely (though dots might be enough):
//           // showMore: () => null,
//       }}
//     />
//   );
// }
