"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Chart } from "../components/ui/chart";
import MeetingCalender from "../components/dashboard/meeting-calender";
import AuditFindingsByCategory from "./auditFindingByCategory";
import OpenFindingsByAge from "./openFindingByAge";
import ControlTestingResult from "./controlTestingResult";
import ShowMeetingDetails from "../components/dashboard/meeting-details";
import { useEffect, useState } from "react";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";
import { format } from "date-fns";

export const fetchMeetingData = async (date: string) => {
  try {
    const meetingInsData = await getMyInstancesV2({
      processName: "Schedule Meeting",
      predefinedFilters: { taskName: "View Meeting" },
      //mongoWhereClause: `this.Data.startDate == "${date}"`, //startDate :  "2025-04-27T18:30:00.000Z"
      mongoWhereClause: `this.Data.startDate == "${format(date,SAVE_DATE_FORMAT_GRC)}"`,
      projections: ["Data.meetingTitle","Data.startDate","Data.startTime","Data.meetingParticipants"],
    });
    const meetingData = Array.isArray(meetingInsData)
      ? meetingInsData.map((e: any) => e.data)
      : [];
    return meetingData;
  } catch (error) {
    console.error("Failed to fetch the process:", error);
    throw error;
  }
};

export const fetchAuditData = async (date: string) => {
  try {
    const auditInsData = await getMyInstancesV2({
      processName: "Audit",
      predefinedFilters: { taskName: "View Audit" },
      //mongoWhereClause: `this.Data.auditStart == "${format(date,SAVE_DATE_FORMAT_GRC)}"`, //startDate :  "2025-04-27T18:30:00.000Z"
      mongoWhereClause: `this.Data.auditStart == "${date}"`,
      projections: ["Data.auditName", "Data.auditStart", "Data.policyName", "Data.auditorTeam", "Data.auditeeTeam"],
    });
    const auditData = Array.isArray(auditInsData)
      ? auditInsData.map((e: any) => e.data)
      : [];
    return auditData;
  } catch (error) {
    console.error("Failed to fetch the process:", error);
    throw error;
  }
};

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [meetingData, setMeetingData] = useState<any[]>([]);
  const [auditData, setAuditData] = useState<any[]>([]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const formatDateForAudit = (date: Date) =>
    date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, " "); // "28 Apr 2025"

  useEffect(() => {
    if (selectedDate) {
      const isoDateString = selectedDate.toISOString();
      const auditDateString = formatDateForAudit(selectedDate);

      Promise.all([
        fetchMeetingData(isoDateString),
        fetchAuditData(auditDateString),
      ])
        .then(([meetings, audits]) => {
          setMeetingData(meetings);
          setAuditData(audits);
        })
        .catch(console.error);
    }
  }, [selectedDate]);

  return (
    <div className="h-[90vh] max-w-full overflow-y-auto flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[50vh]">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Audit Calender</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 h-[90%]">
            {/* <Chart height={100%}> */}
              <MeetingCalender onDateClick={handleDateClick} />
            {/* </Chart> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ShowMeetingDetails
              selectedDate={selectedDate}
              meetingData={meetingData}
              auditData={auditData}
            />
          </CardContent>
        </Card>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
        <Card>
          <CardHeader>
            <CardTitle>Audit Findings by Practice</CardTitle>
          </CardHeader>
          <CardContent>
            <AuditFindingsByCategory />
          </CardContent>
        </Card>
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <CardHeader>
            <CardTitle>Audit Findings by Practice</CardTitle>
          </CardHeader>
          <CardContent>
            <AuditFindingsByCategory />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Findings By Age</CardTitle>
          </CardHeader>
          <CardContent>
            <OpenFindingsByAge />
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Audit by quarter</CardTitle>
          </CardHeader>
          <CardContent>
            <ControlTestingResult />
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
