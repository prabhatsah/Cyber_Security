"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shadcn/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shadcn/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { Label } from "@/shadcn/ui/label";
import { AlertTriangle, Bell, Check, Filter, Info, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import type {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import { getAlertNotificationData, getDataForCreateNotification, getFilterData } from "../action";
import { format, set } from "date-fns";
import { Tooltip } from "@/shadcn/ui/tooltip";
import { useAlarms } from "../context/alarmsContext";
import {
  deactivateNotification,
  deleteNotification,
  isMuted,
} from "./notification-dropdown-function";
import DeviceStatusChart from "./notification-history";
import { transformAlertData } from "./transformData";
import AlarmHistoryCard from "./Alarm-History-Card";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/shadcn/ui/tooltip";
import { getLatestNotificationData } from "../../../../../../../../../get-data/notification-data";


interface AlarmNotification {
  data: any;
}

const getTemplateForLastEvaluatedOn = (lastEvaluatedOn: any) => {
  return lastEvaluatedOn
    ? format(new Date(lastEvaluatedOn), "dd-MMM-yyyy HH:mm:ss")
    : "N/A";
};
const getFormattedDate = (date: any) => {
  const parsed = new Date(date);
  if (!date || isNaN(parsed.getTime())) {
    return "N/A";
  }
  return format(parsed, "yyyy-MM-dd HH:mm:ss");
};
export default function AciveAlarms() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [rowToDelete, setRowToDelete] = useState<any>(null);
  const [alarmNotificationData, setAlarmNotificationData] = useState<
    AlarmNotification[]
  >([]);
  const { setCreateAlert, setEditAlertData, setConditionInfo, setExpressionInfo, setViewMode } = useAlarms();
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyData, setHistoryData] = useState<any>(null);

  const [muteDialogOpen, setMuteDialogOpen] = useState(false);
  const [muteRow, setMuteRow] = useState<any>(null);

  // Snooze range
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleDeactivateClick = (row: any) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };

  const [deactivating, setDeactivating] = useState(false);

  const handleDialogConfirm = async () => {
    setDeactivating(true); // Disable button
    console.log(await getLatestNotificationData(selectedRow.data.id, { timePeriod: 1000 * 60 * 60 * 24 * 7, startDate: "", endDate: "" }));
    try {
      await deactivateNotification(
        selectedRow.data.id,
        selectedRow.data.isNotificationDisabled || false
      );
      setDialogOpen(false);
      await fetchAlarmsNotifications();
    } finally {
      setDeactivating(false); // Re-enable button
    }
  };

  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteNotification(rowToDelete.data.id);
      setDeleteDialogOpen(false);
      await fetchAlarmsNotifications();
    } finally {
      setDeleting(false);
    }
  };

  const formatToInputDate = (date: Date): string => {
    return date.toISOString().slice(0, 10); // returns 'YYYY-MM-DD'
  };
  const handleMuteClick = (row: any) => {
    setMuteRow(row);
    console.log("Mute/Unmute Notification", row);
    const { isMute, muteStartDate, muteEndDate } = row.data;

    if (isMute && muteStartDate && muteEndDate) {
      const start = new Date(muteStartDate);
      const end = new Date(muteEndDate);

      // Format for input type="date"
      setStartDate(formatToInputDate(start));
      setEndDate(formatToInputDate(end));

      // Set time fields (HH:mm)
      setStartTime(start.toTimeString().slice(0, 5));
      setEndTime(end.toTimeString().slice(0, 5));
    } else {
      // Clear the previous state if not muted
      setStartDate(undefined);
      setEndDate(undefined);
      setStartTime(undefined);
      setEndTime(undefined);
    }

    setMuteDialogOpen(true);
  };

  const [muting, setMuting] = useState(false);

  const handleMuteUpdate = async () => {
    setMuting(true);
    try {
      const totalStartData = new Date(`${startDate} ${startTime}`);
      const totalEndData = new Date(`${endDate} ${endTime}`);

      await isMuted(
        muteRow.data.id,
        totalStartData.toISOString(),
        totalEndData.toISOString()
      );
      setMuteDialogOpen(false);
      await fetchAlarmsNotifications();
    } finally {
      setMuting(false);
    }
  };

  const extraParams: DTExtraParamsProps = {
    actionMenu: {
      items: [
        {
          label: "View",
          onClick: async (row) => {
            setCreateAlert(true);          // Open the modal
            let dataForCreateNotification = await getDataForCreateNotification(row.data.id);
            let filteredData = getFilterData(dataForCreateNotification);
            setEditAlertData(filteredData); // Pass the current row data to the modal
            let expressions = Object.values(dataForCreateNotification.data_Exp)
            let conditions = Object.values(dataForCreateNotification.condition_Gen)
            setConditionInfo(conditions);
            setExpressionInfo(expressions);
            setViewMode(true);
            // console.log("dataForCreateNotification", dataForCreateNotification);
          }
        },
        {
          label: "Edit",
          onClick: async (row) => {
            setCreateAlert(true);          // Open the modal
            let dataForCreateNotification = await getDataForCreateNotification(row.data.id);
            let filteredData = getFilterData(dataForCreateNotification);
            setEditAlertData(filteredData); // Pass the current row data to the modal
            let expressions = Object.values(dataForCreateNotification.data_Exp)
            let conditions = Object.values(dataForCreateNotification.condition_Gen)
            setConditionInfo(conditions);
            setExpressionInfo(expressions);
            // console.log("dataForCreateNotification", dataForCreateNotification);
          }
        },
        {
          label: "View Notification History",
          visibility: (row) => {
            const lastStateChangeTime = row.data.lastStateChangeTime.length > 0;
            return lastStateChangeTime;
          },
          onClick: (row) => {
            setHistoryData(row);
            setHistoryDialogOpen(true);
          }
        },
        {
          label: "Mute Notification",
          onClick: (row) => {
            handleMuteClick(row);
          },
        },
        {
          label: (row) => {
            const isDisabled = row.data.isNotificationDisabled;
            return isDisabled ? "Activate Notification" : "Deactivate Notification";
          },
          onClick: async (row) => {
            handleDeactivateClick(row);
            // await fetchAlarms()
          },
        },
        {
          label: "Delete Notification",
          onClick: (row) => handleDeleteClick(row),
        },
      ],
    },
    extraTools: [
      // eslint-disable-next-line react/jsx-key
      <Tooltip tooltipContent="Add Notification">
        <Button
          variant="outline"
          className="p-2 gap-1"
          onClick={() => {
            setCreateAlert(true);
          }}
        >
          <Plus />
        </Button>
      </Tooltip>,
    ],
    grouping: true,
    pageSize: 10,
    pageSizeArray: [10, 15, 20, 25, 50, 100],
  };

  const columnSchema: DTColumnsProps<any>[] = [
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => {
        const state = row.original.data.state;
        const color =
          state === "critical"
            ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200"
            : state === "warning"
              ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-200"
              : "bg-green-100 text-blue-600 dark:bg-green-900 dark:text-green-200";
        const icon =
          state === "critical" || state === "warning" ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <Info className="h-4 w-4" />
          );
        return (
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${color}`}
          >
            {icon}
          </div>
        );
      },
    },
    {
      accessorKey: "notification_name",
      header: "Notification Name",
      cell: ({ row }) => <span>{row.original.data.notification_name}</span>,
    },
    {
      accessorKey: "status",
      header: "Notification Status",
      cell: ({ row }) => (
        <span>
          {row.original.data.isNotificationDisabled ? "Inactive" : "Active"}
        </span>
      ),
    },
    {
      accessorKey: "mute",
      header: "Mute Status",
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-default underline decoration-dotted">
                {row.original.data.isMute ? "Muted" : "Unmuted"}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.original.data.isMute ? `${format(new Date(row.original.data.muteStartDate), "dd-MMM-yyyy HH:mm:ss")}
            to ${format(new Date(row.original.data.muteEndDate), "dd-MMM-yyyy HH:mm:ss")}` : "Notification is not muted."}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <span>{row.original.data.description}</span>,
    },
    {
      accessorKey: "last_evaluated_on",
      header: "Last Evaluated On",
      cell: ({ row }) => {
        const dateStr = row.original.data.lastEvaluatedOn;
        const isValid = dateStr && !isNaN(new Date(dateStr).getTime());

        return (
          <span>
            {isValid
              ? format(new Date(dateStr), "yyyy-MM-dd HH:mm:ss")
              : "N/A"}
          </span>
        );
      }
    },
    {
      accessorKey: "last_state_change_on",
      header: "Last State Change On",
      cell: ({ row }) => {
        const times = row.original.data?.lastStateChangeTime;
        const latestTime = times?.[times.length - 1]?.transitionTime;
        return <span>{getTemplateForLastEvaluatedOn(latestTime)}</span>;
      },
    },
  ];
  //console.log("historyData", historyData);
  const notificationHistoryData = transformAlertData(
    historyData ? [historyData] : []
  );
  //console.log("notificationHistoryData", notificationHistoryData);
  const fetchAlarmsNotifications = async () => {
    setLoading(true);
    try {
      const notificationData = await getAlertNotificationData();
      console.log("notificationData", notificationData);
      setAlarmNotificationData(notificationData);
    } catch (err) {
      console.error("Error fetching alarms", err);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchAlarmsNotifications();
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Active Alarms</CardTitle>
          <CardDescription>
            View and manage current system alarms
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <DataTable
              data={alarmNotificationData}
              columns={columnSchema}
              extraParams={extraParams}
            />
          )}
        </CardContent>
      </Card>

      {/* Alert Stats + Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Alarm Statistics</CardTitle>
            <CardDescription>Summary of current alarm status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Active Alarms</span>
                <span>{alarmNotificationData.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Critical Alarms</span>
                <span className="text-red-500">
                  {
                    alarmNotificationData.filter(
                      (a) => a.data.state === "critical"
                    ).length
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Warning Alarms</span>
                <span className="text-amber-500">
                  {
                    alarmNotificationData.filter(
                      (a) => a.data.state === "warning"
                    ).length
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Info Notifications</span>
                <span className="text-green-500">
                  {
                    alarmNotificationData.filter(
                      (a) => a.data.state === "normal"
                    ).length
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common alarm management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-20 flex flex-col gap-1">
                <Check className="h-5 w-5" />
                <span>Acknowledge All</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-1">
                <Bell className="h-5 w-5" />
                <span>Silence Alarms</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-1">
                <Filter className="h-5 w-5" />
                <span>Reset Filters</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-1">
                <AlertTriangle className="h-5 w-5" />
                <span>Run Diagnostics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deactivation Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedRow?.data
                ? selectedRow.data.isNotificationDisabled
                  ? "Activate Notification"
                  : "Deactivate Notification"
                : null}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedRow?.data
                ? selectedRow.data.isNotificationDisabled
                  ? "Are you sure you want to activate this notification?"
                  : "Are you sure you want to deactivate this notification?"
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={handleDialogConfirm} disabled={deactivating}>
              {deactivating ? "Processing..." : "Confirm"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this notification?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={handleDeleteConfirm} disabled={deleting}>
              {deleting ? "Processing..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={muteDialogOpen} onOpenChange={setMuteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mute Details</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="start-date">Start Date</Label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                className="w-full border rounded p-2 bg-white text-black dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end-date">End Date</Label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                className="w-full border rounded p-2 bg-white text-black dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="start-time">Start Time</Label>
              <input
                id="start-time"
                type="time"
                value={startTime}
                className="w-full border rounded p-2 bg-white text-black dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end-time">End Time</Label>
              <input
                id="end-time"
                type="time"
                value={endTime}
                className="w-full border rounded p-2 bg-white text-black dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMuteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMuteUpdate} disabled={muting}>
              {muting ? "Processing..." : "Mute"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="w-[80%] max-w-none">
          <DialogHeader>
            <DialogTitle>Notification History</DialogTitle>
            <DialogDescription>
              View past events for this notification.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <DeviceStatusChart data={notificationHistoryData} />
            <hr className="text-lg font-semibold mb-4" />
            {Array.isArray(historyData?.data?.lastStateChangeTime) &&
              historyData.data.lastStateChangeTime.length > 0 && (
                <div className="flex gap-4 flex-wrap">
                  {historyData.data.lastStateChangeTime.map((entry, idx) => (
                    <AlarmHistoryCard key={idx} data={entry} />
                  ))}
                </div>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
