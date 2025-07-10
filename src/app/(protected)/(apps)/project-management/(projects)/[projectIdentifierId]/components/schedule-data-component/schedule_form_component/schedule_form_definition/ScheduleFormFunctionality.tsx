
'use client'
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import {
  addMonths,
  differenceInDays,
  differenceInMonths,
  format,
  parseISO,
  subMonths,
} from "date-fns";
import { useState } from "react";

const [taskName, setTaskName] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [duration, setDuration] = useState(0);
const { openDialog } = useDialog();

export const calculateTaskEndDate = (
  startDate: string,
  duration: number
): string => {
  const taskStart = parseISO(startDate);
  const wholeMonths = Math.floor(duration);
  const fractionalMonths = duration % 1;

  let taskEnd = addMonths(taskStart, wholeMonths);
  taskEnd = new Date(
    taskEnd.setDate(taskEnd.getDate() + fractionalMonths * 30)
  );

  return format(taskEnd, "yyyy-MM-dd");
};

export const calculateTaskStartDate = (
  endDate: string,
  duration: number
): string => {
  const taskEnd = parseISO(endDate);
  const wholeMonths = Math.floor(duration);
  const fractionalMonths = duration % 1;

  let taskStart = subMonths(taskEnd, wholeMonths);
  taskStart = new Date(
    taskStart.setDate(taskStart.getDate() - fractionalMonths * 30)
  );

  return format(taskStart, "yyyy-MM-dd");
};

export const calculateTaskDuration = (
  startDate: string,
  endDate: string
): number => {
  if (startDate === endDate) return 0;

  let taskStart = parseISO(startDate);
  let taskEnd = parseISO(endDate);
  let duration = 0;

  if (
    taskStart.getMonth() === taskEnd.getMonth() &&
    taskStart.getFullYear() === taskEnd.getFullYear()
  ) {
    duration =
      (differenceInDays(taskEnd, taskStart) + 1) /
      new Date(taskEnd.getFullYear(), taskEnd.getMonth() + 1, 0).getDate();
  } else if (taskStart < taskEnd) {
    duration =
      differenceInMonths(taskEnd, taskStart) +
      (differenceInDays(taskEnd, taskStart) % 30) / 30;
  }

  duration = parseFloat(duration.toFixed(2));

  let providedEndDate = parseISO(endDate);
  let calculatedEndDate = parseISO(calculateTaskEndDate(startDate, duration));

  while (
    providedEndDate.toISOString().split("T")[0] !==
    calculatedEndDate.toISOString().split("T")[0]
  ) {
    if (providedEndDate < calculatedEndDate) {
      duration -= 0.01;
    } else {
      duration += 0.01;
    }
    calculatedEndDate = parseISO(calculateTaskEndDate(startDate, duration));
  }

  return parseFloat(duration.toFixed(2));
};

export const handleStartDateChange = (value: string) => {
  setStartDate(value);
  const updatedEndDate = calculateTaskEndDate(value, duration);
  setEndDate(updatedEndDate);
};

export const handleEndDateChange = (value: string) => {
  setEndDate(value);
  const updatedDuration = calculateTaskDuration(startDate, value);
  if (updatedDuration < 0) {
    openDialog({
      title:
        "Please select valid End date!!! Task Duration cannot be negative.",
      description: "",
      confirmText: "Okay",
      cancelText: "",
      onConfirm: () => console.log("Ok action executed"),
      onCancel: () => console.log("Cancel action executed"),
    });
  }
  setDuration(updatedDuration);
};

export const handleDurationChange = (value: number) => {
  setDuration(value);
  const updatedEndDate = calculateTaskEndDate(startDate, value);
  setEndDate(updatedEndDate);
};