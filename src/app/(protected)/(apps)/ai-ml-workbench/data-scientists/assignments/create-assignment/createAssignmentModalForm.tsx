"use client";
import React, { useEffect, useState } from "react";

import moment from "moment";
import {
  PlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  Trash2Icon,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { error } from "console";
import getAssignmentProfileData from "./getAssignmentProfileData";
import { startAssignmentData } from "../start-assignment";
import { useForm } from "react-hook-form";
import { TabArray } from "@/ikon/components/tabs/type";
import { Label } from "@/shadcn/ui/label";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import Tabs from "@/ikon/components/tabs";

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment?: any;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  assignment,
}) => {
  const [profileData, setProfileData] = useState<any>(null);
  useEffect(() => {
    async function fetchData() {
      const data = await getAssignmentProfileData();
      setProfileData(data);
    }
    fetchData();
  }, [isOpen]);

  type Goal = {
    goalId: string;
    goalName: string;
    goalDescription: string;
    isCollapsed: boolean;
  };

  const [goals, setGoals] = useState<Goal[]>([]);
  const addNewGoal = () => {
    const newGoal: Goal = {
      goalId: crypto.randomUUID(),
      goalName: "",
      goalDescription: "",
      isCollapsed: false,
    };
    setGoals([...goals, newGoal]);
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.goalId !== id));
  };

  const toggleGoalCollapse = (id: string) => {
    setGoals(
      goals.map((goal) =>
        goal.goalId === id ? { ...goal, isCollapsed: !goal.isCollapsed } : goal
      )
    );
  };

  const updateGoal = (
    id: string,
    field: "goalName" | "goalDescription",
    value: string
  ) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.goalId === id ? { ...goal, [field]: value } : goal
      )
    );
  };

  interface FormData {
    assignmentName: string;
    assignmentDescription: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const tabArray: TabArray[] = [
    {
      tabName: "Basic Assignment Details",
      tabId: "tab-assignment",
      default: true,
      tabContent: (
        <div className="gap-4 max-h-[70vh] overflow-y-auto h-auto p-2">
          <div className="">
            <Label
              htmlFor="assignmentName"
              className="font-semibold text-gray-700"
            >
              Assignment Name *
            </Label>
            <Input
              type="text"
              id="assignmentName"
              placeholder="Enter assignment name"
              className="w-full focus-visible:ring-blue-500"
              {...register("assignmentName", {
                required: "Assignment name is required",
                minLength: {
                  value: 1,
                  message: "Please Enter Assignment Name",
                },
              })}
            />
          </div>

          <div className="">
            <Label
              htmlFor="assignmentDescription"
              className="font-semibold text-gray-700"
            >
              Description
            </Label>
            <Textarea
              id="assignmentDescription"
              placeholder="Enter description"
              className="w-full h-32 focus-visible:ring-blue-500"
              {...register("assignmentDescription")}
            />
          </div>
        </div>
      ),
    },
    {
      tabName: "Goals",
      tabId: "tab-goal",
      default: false,
      tabContent: (
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto h-auto p-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Goals</h3>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={addNewGoal}
              className="gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Goal
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {goals.map((goal, index) => (
              <div key={goal.goalId} className="rounded-lg border">
                <div className="flex justify-between items-center p-2 bg-primary text-primary-foreground rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{`Goal ${index + 1}`}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      className="text-primary-foreground hover:bg-white/10 h-8 w-8"
                      onClick={() => toggleGoalCollapse(goal.goalId)}
                    >
                      {goal.isCollapsed ? (
                        <ChevronDownIcon className="h-4 w-4" />
                      ) : (
                        <ChevronUpIcon className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      className="text-primary-foreground hover:bg-white/10 h-8 w-8"
                      onClick={() => deleteGoal(goal.goalId)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {!goal.isCollapsed && (
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`goalName-${goal.goalId}`}>
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`goalName-${goal.goalId}`}
                        placeholder="Enter goal name"
                        value={goal.goalName}
                        onChange={(e) =>
                          updateGoal(goal.goalId, "goalName", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`goalDescription-${goal.goalId}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`goalDescription-${goal.goalId}`}
                        placeholder="Enter goal description"
                        value={goal.goalDescription}
                        onChange={(e) =>
                          updateGoal(
                            goal.goalId,
                            "goalDescription",
                            e.target.value
                          )
                        }
                        rows={4}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {goals.length === 0 && (
              <div className="text-center py-8 border rounded-lg text-muted-foreground">
                <p>No goals added yet</p>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      tabName: "Dataset Details",
      tabId: "tab-dataset",
      default: false,
      tabContent: (
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto h-auto p-2">
          <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <div className="w-full overflow-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Dataset Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Last Modified
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {/* Example row - replace with dynamic data */}
                  <tr className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      Sample Dataset 1
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      CSV
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      2.5 MB
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      2024-03-15
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
  ];
  useEffect(() => {
    if (isOpen && assignment) {
      // Pre-fill the form with the assignment data
      reset({
        assignmentName: assignment.assignmentName,
        assignmentDescription: assignment.assignmentDescription,
      });
      // Assuming goals are part of the assignment data
      setGoals(assignment.goals || []);
    } else {
      reset({ assignmentName: "", assignmentDescription: "" });
      setGoals([]);
    }
  }, [isOpen, assignment, reset]);
  const router = useRouter();
  let activityLogsData = [
    {
      action: "creation",
      actionString: "Assignment created",
      dateOfAction: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZZ"),
      userId: profileData?.USER_ID,
      userName: profileData?.USER_NAME,
    },
  ];
  const handleOnSubmit = async (data: FormData) => {
    // Include goals data in submission
    console.log("here is formdata-------:", FormData);
    console.log("profile data here", profileData);
    const fullData = {
      ...data,
      goals: goals.map((goal) => ({
        goalName: goal.goalName,
        goalDescription: goal.goalDescription,
        goalId: goal.goalId,
      })),
      assignmentId: new Date().getTime().toString(),
      createdBy: profileData?.USER_ID,
      createdOn: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZZ"),
      datasetArray: [],
      status: "assignmentCreated",
      pastStateList: ["Created"],
      activityLogsData: activityLogsData,
    };

    console.log("here is formdata after updating:", fullData);

    try {
      await startAssignmentData(fullData);
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };
  const handleOnError = (errors: any) => {
    console.log("errors.message ----- ", errors.message);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {assignment ? "Edit Assignment" : "Add Assignment"}
          </DialogTitle>
        </DialogHeader>
        <div className="">
          <form>
            <Tabs
              tabArray={tabArray}
              tabListClass="py-6 px-3"
              tabListButtonClass="text-md"
              tabListInnerClass="justify-between items-center"
            />
          </form>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            variant="default"
            onClick={handleSubmit(handleOnSubmit, handleOnError)}
          >
            {assignment ? "" : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentModal;
