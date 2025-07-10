"use client";
import { useEffect, useState } from "react";
import {
  BigCalendarEventProps,
  ExtraParamsEvent,
} from "@/ikon/components/big-calendar/type";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import BigCalendar from "@/ikon/components/big-calendar-grc";

const fetchMeetingData = async () => {
  try {
    const meetingInsData = await getMyInstancesV2({
      processName: "Schedule Meeting",
      predefinedFilters: { taskName: "View Meeting" },
      projections: ["Data.startDate"],
    });
    //return Array.isArray(meetingInsData) ? meetingInsData.map((e: any) => e.data) : [];

    if (!Array.isArray(meetingInsData)) return [];

    const allData = meetingInsData.map((e: any) => e.data);

    // Filter unique startDates
    const uniqueDatesMap = new Map();
    for (const item of allData) {
      const dateStr = item.startDate;
      if (!uniqueDatesMap.has(dateStr)) {
        uniqueDatesMap.set(dateStr, item);
      }
    }

    return Array.from(uniqueDatesMap.values());
  } catch (error) {
    console.error("Failed to fetch meeting data:", error);
    return [];
  }
};

const fetchAuditData = async () => {
  try {
    const auditInsData = await getMyInstancesV2({
      processName: "Audit",
      predefinedFilters: { taskName: "View Audit" },
      projections: ["Data.auditStart"],
    });
    //return Array.isArray(auditInsData) ? auditInsData.map((e: any) => e.data) : [];

    if (!Array.isArray(auditInsData)) return [];

    const allData = auditInsData.map((e: any) => e.data);

    // Filter unique startDates
    const uniqueDatesMap = new Map();
    for (const item of allData) {
      const dateStr = item.auditStart;
      if (!uniqueDatesMap.has(dateStr)) {
        uniqueDatesMap.set(dateStr, item);
      }
    }

    return Array.from(uniqueDatesMap.values());
  } catch (error) {
    console.error("Failed to fetch audit data:", error);
    return [];
  }
};

export default function MeetingCalendar({
  onDateClick,
}: {
  onDateClick?: (date: Date) => void;
}) {
  const [combinedEvents, setCombinedEvents] = useState<BigCalendarEventProps[]>(
    []
  );

  useEffect(() => {
    const loadData = async () => {
        const mData = await fetchMeetingData();
        const aData = await fetchAuditData();



        const meetingEvents = mData.map((m: any) => ({
          title: "Meeting",
          start: new Date(m.startDate),
          end: new Date(m.startDate),
          type: "meeting",
          allDay: false,
        }));

        const auditEvents = aData.map((a: any) => ({
          title: "Audit",
          start: new Date(a.auditStart),
          end: new Date(a.auditStart),
          type: "audit", // for styling
          allDay: false, // Example additional property
        }));

        setCombinedEvents([...meetingEvents, ...auditEvents]);
    };

    loadData();
  }, []);

  const extraParamsEvent: ExtraParamsEvent = {
    defaultView: "month",
  };

  console.log("combined data ====> ",combinedEvents)

  return (
    <BigCalendar
      events={combinedEvents}
      extraParamsEvent={extraParamsEvent}
      extraTools={[]}
      onDateClick={onDateClick}
    />
  );
}

// @/ikon/components/meeting-calendar/page.tsx (or wherever MeetingCalendar is defined)
// "use client";
// import { useEffect, useState } from "react";
// import { BigCalendarEventProps, ExtraParamsEvent } from "@/ikon/components/big-calendar/type";
// import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
// import BigCalendar from "@/ikon/components/big-calendar-grc"; // Ensure path is correct
// import { isSameDay } from "date-fns"; // Import date-fns helper

// // --- Fetch functions remain the same ---
// const fetchMeetingData = async () => {
//   try {
//     const meetingInsData = await getMyInstancesV2({
//       processName: "Schedule Meeting",
//       predefinedFilters: { taskName: "View Meeting" },
//       projections: ["Data.startDate"], // Only fetch necessary data
//     });
//     // Ensure data exists and has startDate
//     return Array.isArray(meetingInsData)
//       ? meetingInsData
//           .map((e: any) => e.data)
//           .filter((m: any) => m && m.startDate)
//       : [];
//   } catch (error) {
//     console.error("Failed to fetch meeting data:", error);
//     return [];
//   }
// };

// const fetchAuditData = async () => {
//   try {
//     const auditInsData = await getMyInstancesV2({
//       processName: "Audit",
//       predefinedFilters: { taskName: "View Audit" },
//       projections: ["Data.auditStart"], // Only fetch necessary data
//     });
//     // Ensure data exists and has auditStart
//     return Array.isArray(auditInsData)
//       ? auditInsData
//           .map((e: any) => e.data)
//           .filter((a: any) => a && a.auditStart)
//       : [];
//   } catch (error) {
//     console.error("Failed to fetch audit data:", error);
//     return [];
//   }
// };
// // --- End Fetch Functions ---

// export default function MeetingCalendar({
//   onDateClick,
// }: {
//   onDateClick?: (date: Date) => void;
// }) {
//   const [combinedEvents, setCombinedEvents] = useState<
//     BigCalendarEventProps[]
//   >([]);

//   useEffect(() => {
//     const loadData = async () => {
//       const [mData, aData] = await Promise.all([
//         fetchMeetingData(),
//         fetchAuditData(),
//       ]);

//       const meetingEvents = mData.map((m: any) => ({
//         // Adding a unique ID might be helpful if needed elsewhere, but not strictly necessary for this feature
//         id: `meeting_${m.instanceId || Math.random()}`, // Example ID
//         //title: "Meeting", // Keep title for accessibility or other views
//         start: new Date(m.startDate),
//         end: new Date(m.startDate), // Assuming meetings are single points in time for the calendar dots
//         type: "meeting",
//         allDay: true, // Treat as all-day for month view dot positioning
//       }));

//       const auditEvents = aData.map((a: any) => ({
//         id: `audit_${a.instanceId || Math.random()}`, // Example ID
//         //title: "Audit", // Keep title
//         start: new Date(a.auditStart),
//         end: new Date(a.auditStart), // Assuming audits are single points in time
//         type: "audit",
//         allDay: true, // Treat as all-day for month view dot positioning
//       }));

//       setCombinedEvents([...meetingEvents, ...auditEvents]);
//     };

//     loadData();
//   }, []);

//   // Pass combinedEvents to BigCalendar
//   const extraParamsEvent: ExtraParamsEvent = {
//     defaultView: "month",
//     // You can define colors here if needed for the legend, or define them purely in CSS
//     eventTypeDefs: {
//        meeting: { color: '#3b82f6', label: 'Meeting'}, // Example blue
//        audit: { color: '#10b981', label: 'Audit'}     // Example green
//     }
//   };

//   return (
//     <BigCalendar
//         events={combinedEvents} // Pass the events
//         extraParamsEvent={extraParamsEvent} // Pass params (includes eventTypeDefs now)
//         // Pass other props like extraTools if needed
//     />
//   );
// }
