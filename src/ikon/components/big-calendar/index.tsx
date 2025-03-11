'use client';
import { format, getDay, parse, startOfWeek } from "date-fns";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import "./index.css";
import { BigCalendarProps } from "./type";
import BigCalenderToolbar from "./big-calender-toolbar";
import BigCalenderEvent from "./big-calender-event";

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


export default function BigCalendar({ events, extraParamsEvent, extraTools }: BigCalendarProps) {
    const [view, setView] = useState(
        extraParamsEvent?.defaultView === "day" ? Views.DAY :
            extraParamsEvent?.defaultView === "week" ? Views.WEEK :
                extraParamsEvent?.defaultView === "month" ? Views.MONTH :
                    extraParamsEvent?.defaultView === "work week" ? Views.WORK_WEEK :
                        extraParamsEvent?.defaultView === "agenda" ? Views.AGENDA : Views.MONTH
    );
    const [date, setDate] = useState(new Date());


    return (
        <Calendar
            localizer={localizer}
            events={events || []}
            startAccessor="start"
            endAccessor="end"
            views={[Views.DAY, Views.WEEK, Views.MONTH]}
            view={view}
            onView={(view) => setView(view)}
            date={date}
            onNavigate={(date) => setDate(date)}
            components={{
                event: (props) => <BigCalenderEvent event={props.event} extraParamsEvent={extraParamsEvent} />,
                toolbar: (props) => <BigCalenderToolbar {...props} extraTools={extraTools} view={view} />,
            }}
            style={{
                height: extraParamsEvent?.height || "100%",
                margin: extraParamsEvent?.margin || "0px",
            }}
        />
    );
}

