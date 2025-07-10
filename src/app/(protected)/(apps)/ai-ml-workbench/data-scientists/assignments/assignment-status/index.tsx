"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";

import moment from "moment";

interface Activity {
  name: string;
  status: "DONE" | "TO DO" | "ONGOING";
  dateOfCompletion: string | null;
}

export default function OpenStatusModal({
  open,
  setOpen,
  assignmentStatus,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  assignmentStatus: any;
}) {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!assignmentStatus) return;

    const extractDate = (key: keyof typeof assignmentStatus) => {
      const value = assignmentStatus[key];

      if (Array.isArray(value) && value.length > 0) {
        // Handle nested array cases like modelDeatils
        return value[0]?.modelDeatils?.[0]?.updatedOn || null;
      }

      return typeof value === "string" && value !== "N/A" ? value : null;
    };

    const formatDate = (date: string | null) => {
      return date
        ? moment(date, "DD-MM-YYYY HH:mm:ss").format("YYYY-MMM-DD")
        : null;
    };

    setActivities([
      {
        name: "Assignment Created",
        status: extractDate("createdOn") ? "DONE" : "TO DO",
        dateOfCompletion: formatDate(extractDate("createdOn")),
      },
      {
        name: "Assignment Assigned",
        status: extractDate("assignTime") ? "DONE" : "TO DO",
        dateOfCompletion: formatDate(extractDate("assignTime")),
      },
      {
        name: "Project Created",
        status: extractDate("projectCreatedDate") ? "DONE" : "TO DO",
        dateOfCompletion: formatDate(extractDate("projectCreatedDate")),
      },
      {
        name: "Model Building",
        status: extractDate("modelBuiltOn") ? "DONE" : "TO DO",
        dateOfCompletion: formatDate(extractDate("modelBuiltOn")),
      },
      {
        name: "Model Validation",
        status: extractDate("modelValidatedOn") ? "DONE" : "TO DO",
        dateOfCompletion: formatDate(extractDate("modelValidatedOn")),
      },
      {
        name: "Model Deployment",
        status: extractDate("modelDeploymentDate") ? "DONE" : "TO DO",
        dateOfCompletion: formatDate(extractDate("modelDeploymentDate")),
      },
      {
        name: "Assignment Delivered",
        status: extractDate("assignmentDeliveredOn") ? "DONE" : "TO DO",
        dateOfCompletion: formatDate(extractDate("assignmentDeliveredOn")),
      },
    ]);
  }, [assignmentStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE":
        return "bg-green-500 text-white";
      case "TO DO":
        return "bg-red-500 text-white";
      case "ONGOING":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assignment Status Details</DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date of Completion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell>{activity.name}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </span>
                    </TableCell>
                    <TableCell>{activity.dateOfCompletion || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
