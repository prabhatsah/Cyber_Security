import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { Button } from "@/shadcn/ui/button";
import { DialogFooter, DialogHeader } from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { addMonths, differenceInDays, differenceInMonths, format, isEqual, parseISO, subMonths } from "date-fns";
import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import GanttChartComponent from "../../schedule_gantt_component";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   addMonths,
//   differenceInDays,
//   differenceInMonths,
//   format,
//   isEqual,
//   parseISO,
//   subMonths,
// } from "date-fns";
// import { useDialog } from "@/components/ikon-components/alert-dialog/dialog-context";
// import { ScheduleSchema } from "../schedule_form_data";
// import { getMyInstancesV2 } from "@/lib/api/processRuntimeService";
// import { invokeProductData } from "../invoke_schedule";



interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  productIdentifier: string;
}

const ScheduleFormComponent: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  productIdentifier,
}) => {
  const [taskName, setTaskName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(0);
  const [predecessor, setPredecessor] = useState("");
  const [lag, setLag] = useState(0);
  const [dependencyType, setDependencyType] = useState("");
  const [color, setColor] = useState("#84d5f7");
  const [description, setDescription] = useState("");
  const { openDialog } = useDialog();
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any>(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching deal instances...");
        const productInsData = await getMyInstancesV2({
          processName: "Product",
          predefinedFilters: { taskName: "View State" },
          mongoWhereClause: `this.Data.productIdentifier == "${productIdentifier}"`,
          projections: ["Data"],
        });
        console.log("products fetched all data :", productInsData);
        var data = productInsData;
        
        // if (data[0]?.scheduleData?.task) {
        //   const formattedTasks = data[0].scheduleData.task.map((task) => ({
        //     id: Date.now(),
        //     taskName: task.taskName,
        //     startDate: task.taskStart,
        //     endDate: task.taskStart, // Assuming end date is same as start date (no duration given)
        //     duration: task.taskDuration,
        //   }));
        //   setScheduleData(formattedTasks);
        // }
        setProductData(data);
        
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [productIdentifier]);

  const calculateTaskEndDate = (
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

  const calculateTaskStartDate = (
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

  const calculateTaskDuration = (
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

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    const updatedEndDate = calculateTaskEndDate(value, duration);
    setEndDate(updatedEndDate);
  };

  const handleEndDateChange = (value: string) => {
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

  const handleDurationChange = (value: number) => {
    setDuration(value);
    const updatedEndDate = calculateTaskEndDate(startDate, value);
    setEndDate(updatedEndDate);
  };

  const handleAdd = () => {
    if (isEqual(parseISO(startDate), parseISO(endDate))) {
      openDialog({
        title: "You can't add a milestone from here.",
        description: "",
        confirmText: "Okay",
        cancelText: "",
        onConfirm: () => console.log("Ok action executed"),
        onCancel: () => console.log("Cancel action executed"),
      });
      return;
    }

    const taskData = {
      taskName,
      startDate,
      endDate,
      duration,
      predecessor,
      lag,
      dependencyType,
      color,
      description,
    };

    const validationResult = ScheduleSchema.safeParse(taskData);

    if (!validationResult.success) {
      alert(validationResult.error.errors.map((err) => err.message).join("\n"));
      return;
    }

    console.log("Task Data Saved:", validationResult.data);
    setScheduleData((prev) => [
      ...prev,
      {
        id: Date.now(),
        taskName: validationResult.data.taskName,
        startDate: validationResult.data.startDate,
        endDate: validationResult.data.endDate,
        duration: validationResult.data.duration,
      },
    ]);

    openDialog({
      title: "Task added successfully!!!",
      description: "",
      confirmText: "Okay",
      cancelText: "",
      onConfirm: () => console.log("Ok action executed"),
      onCancel: () => console.log("Cancel action executed"),
    });

    setTaskName("");
    setStartDate("");
    setEndDate("");
    setDuration(0);
  };

  const handleAddMilestone = () => {
    if (!isEqual(parseISO(startDate), parseISO(endDate))) {
      openDialog({
        title: "You can only add milestone from here.",
        description: "",
        confirmText: "Okay",
        cancelText: "",
        onConfirm: () => console.log("Ok action executed"),
        onCancel: () => console.log("Cancel action executed"),
      });
      return;
    }

    const taskData = {
      taskName,
      startDate,
      endDate,
      duration,
      predecessor,
      lag,
      dependencyType,
      color,
      description,
    };

    const validationResult = ScheduleSchema.safeParse(taskData);

    if (!validationResult.success) {
      alert(validationResult.error.errors.map((err) => err.message).join("\n"));
      return;
    }

    console.log("Task Data Saved:", validationResult.data);

    setScheduleData((prev) => [
      ...prev,
      {
        id: Date.now(),
        taskName: validationResult.data.taskName,
        startDate: validationResult.data.startDate,
        endDate: validationResult.data.endDate,
        duration: validationResult.data.duration,
      },
    ]);

    openDialog({
      title: "Milestone Task added successfully!!!",
      description: "",
      confirmText: "Okay",
      cancelText: "",
      onConfirm: () => console.log("Ok action executed"),
      onCancel: () => console.log("Cancel action executed"),
    });

    setTaskName("");
    setStartDate("");
    setEndDate("");
    setDuration(0);
  };

  const handleScheduleForm = async () => {
    const updatedProductData = {
      ...productData[0].data,
      scheduleData: {
        task: scheduleData.map((task) => ({
          id: task.id,
          taskName: task.taskName,
          taskDuration: task.duration,
          taskPredecessor: null,
          dependencyType: -1,
          taskColour: "#84d5f7",
          delayDuration: 0,
          taskDescription: "",
          taskStart: task.startDate,
          taskEnd: task.endDate,
          milestoneTask: false,
        })),
        dependency: [],
        group: {},
      },
    };

    console.log("Updated Product Data with Schedule:", updatedProductData);
    await invokeProductData(updatedProductData,productIdentifier)
    onClose();
    setScheduleData([])
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[96%] max-h-[96%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Schedule</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="w-1/4">
              <label htmlFor="taskName" className="text-sm">
                Schedule Name
              </label>
              <Input
                id="taskName"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Schedule Name"
              />
            </div>
            <div className="w-1/4">
              <label htmlFor="taskStartDate" className="text-sm">
                Task Start Date
              </label>
              <Input
                id="taskStartDate"
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
              />
            </div>
            <div className="w-1/4">
              <label htmlFor="taskEndDate" className="text-sm">
                Task End Date
              </label>
              <Input
                id="taskEndDate"
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
              />
            </div>
            <div className="w-1/4">
              <label htmlFor="taskDuration" className="text-sm">
                Duration (M)
              </label>
              <Input
                id="taskDuration"
                type="number"
                value={duration}
                onChange={(e) =>
                  handleDurationChange(parseFloat(e.target.value))
                }
                step="0.01"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/4">
              <label htmlFor="taskPredecessor" className="text-sm">
                Predecessor
              </label>
              <Select>
                <SelectTrigger id="taskPredecessor" className="w-full">
                  <SelectValue placeholder="Select Predecessor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Anushri">Anushri</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-1/4">
              <label htmlFor="delayDuration" className="text-sm">
                Lag (M)
              </label>
              <Input
                id="delayDuration"
                type="number"
                min="0"
                step="0.01"
                placeholder="Lag"
                className="form-control w-full"
              />
            </div>

            <div className="w-1/4">
              <label htmlFor="dependencyType" className="text-sm">
                Dependency Type
              </label>
              <Select>
                <SelectTrigger id="dependencyType" className="w-full">
                  <SelectValue placeholder="Select Dependency Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">No Dependency Type</SelectItem>
                  <SelectItem value="0">Finish - Finish</SelectItem>
                  <SelectItem value="1">Finish - Start</SelectItem>
                  <SelectItem value="3">Start - Start</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-1/4">
              <label htmlFor="taskColour" className="text-sm">
                Color
              </label>
              <Input
                id="taskColour"
                type="color"
                className="form-control w-full"
                defaultValue="#84d5f7"
              />
            </div>
          </div>

          <div className="w-full">
            <label htmlFor="taskDescription" className="text-sm">
              Description
            </label>
            <Textarea
              id="taskDescription"
              placeholder="Enter Description ..."
              className="form-control w-full"
              rows={8}
            />
          </div>
        </div>
        <div className="flex justify-end items-center gap-2 mb-2">
          <Button variant="outline" onClick={handleAdd}>
            Add
          </Button>
          <Button variant="outline" onClick={handleAddMilestone}>
            Add Milestone
          </Button>
          <Button variant="outline">Clear</Button>
        </div>
        {scheduleData.length > 0 ? (
          <div className="flex flex-col w-full overflow-hidden">
            <GanttChartComponent scheduleData={scheduleData} />
          </div>
        ) : (
          <div className="flex justify-center items-center border h-[30vh] text-gray-500">
            No tasks to show
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline">Create Task Group</Button>
          <Button variant="outline" onClick={handleScheduleForm}>
            Save
          </Button>
        </DialogFooter>
      
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleFormComponent;