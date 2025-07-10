import React from "react";
import { CalendarIcon, Clock, Users, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Badge } from "@/shadcn/ui/badge";
import { cn } from "@/shadcn/lib/utils";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";

interface EventItem {
  title: string;
  time?: string;
  date?: string;
  type: "meeting" | "audit";
}

export default function ShowMeetingDetails({
  selectedDate,
  meetingData,
  auditData,
}: {
  selectedDate: Date | null;
  meetingData: any[];
  auditData: any[];
}) {
  if (!selectedDate) {
    return (
      <div className="h-[30vh] flex flex-col items-center justify-center text-muted-foreground space-y-4">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <p className="text-base text-center">
          Select a date to see the activities planned
        </p>
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  // Convert auditData and meetingData into unified event items
  const events: EventItem[] = [
    ...meetingData.map((meeting) => ({
      title: meeting.meetingTitle || "Untitled Meeting",
      time: meeting.startTime || "",
      date: meeting.startDate
        ? format(new Date(meeting.startDate), "dd MMM yyyy")
        : undefined,
      type: "meeting" as const,
    })),
    ...auditData.map((audit) => ({
      title: audit.auditName || "Untitled Audit",
      date: audit.auditStart || undefined,
      type: "audit" as const,
    })),
  ];

  // Sorting: audits first, then meetings by time
  const sortedEvents = [...events].sort((a, b) => {
    if (a.type === "audit" && b.type !== "audit") return -1;
    if (a.type !== "audit" && b.type === "audit") return 1;
    if (a.type === "meeting" && b.type === "meeting" && a.time && b.time) {
      return parseTime(a.time) - parseTime(b.time);
    }
    return 0;
  });

  function parseTime(timeString: string): number {
    const [time, period] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    else if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  return (
    <div className="space-y-6 h-full">
      <ScrollArea className="h-[400px] rounded-md border">
        <div className="p-4 space-y-3">
          {sortedEvents.length === 0 ?
            (
              <>
                <div className="h-[30vh] flex flex-col items-center justify-center text-muted-foreground space-y-4">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <div className="text-base text-center">
                    No events found for this date
                  </div>
                </div>
              </>
            ) : (
              sortedEvents.map((event, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Card
                    className={cn(
                      "border shadow-lg transition-all duration-300",
                      "hover:shadow-xl hover:scale-[1.01]",
                      "border-gray-200 dark:border-gray-700"
                    )}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-semibold">
                        <div className="flex items-center">
                          {event.type === "meeting" ? (
                            <>
                              <Users className="mr-2 h-5 w-5 text-blue-500" />
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800 border-blue-300"
                              >
                                Meeting
                              </Badge>
                            </>
                          ) : (
                            <>
                              <FileText className="mr-2 h-5 w-5 text-green-500" />
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800 border-green-300"
                              >
                                Audit
                              </Badge>
                            </>
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-bold">{event.title}</div>
                      <div className="flex items-center text-sm mt-2">
                        {event.date && (
                          <>
                            <CalendarIcon className="mr-1 h-4 w-4 text-blue-500" />{" "}
                            {event.date}
                          </>
                        )}
                        {event.time && (
                          <>
                            <Clock className="ml-4 mr-1 h-4 w-4 text-gray-500" />
                            {event.time}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
        </div>
      </ScrollArea>
    </div>
  );
}
