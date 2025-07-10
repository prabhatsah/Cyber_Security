import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import React, { SetStateAction, useEffect, useState } from "react";
import ActionMeetingForm from "./actionMeetingForm";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import {
  CheckCircle,
  AlertTriangle,
  Loader2,
  XCircle,
  User,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  SparklesIcon,
} from "lucide-react";
import { cn } from "@/shadcn/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Calendar as CalendarUI } from "@/shadcn/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { format } from "date-fns";
import {
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { useParams, useRouter } from "next/navigation";
import {
  SAVE_DATE_FORMAT_GRC,
  SAVE_DATE_TIME_FORMAT_GRC,
} from "@/ikon/utils/config/const";
import AlertDialogFn from "./alertDialogFn";
import { v4 } from "uuid";
import { HoverBorderGradient } from "@/shadcn/ui/hover-border-gradient";
import { ActionSuggestionModal } from "./actionSuggestAImodal";

interface FormValues {
  actions: {
    description: string;
    assignedTo: string;
    dueDate: Date | undefined;
    timeEntries: { date: Date; hours: number }[];
  }[];
  observations: string[];
  recommendations: string[];
  controlPolicy: string;
  controlObjective: string;
  // owner: string;
}

interface AddActionsMettingProps {
  openActionForm: boolean;
  setOpenActionForm: React.Dispatch<SetStateAction<boolean>>;
  userIdNameMap: { value: string; label: string }[];
  selectedRowData: Record<string, any> | null;
  frameworkId: string;
}

export default function AddActionsMetting({
  openActionForm,
  setOpenActionForm,
  userIdNameMap,
  selectedRowData,
  frameworkId,
}: AddActionsMettingProps) {
  const router = useRouter();
  console.log(userIdNameMap);
  console.log(selectedRowData);
  console.log(frameworkId);
  const [actions, setActions] = useState<
    {
      status: String;
      description: string;
      assignedTo: string;
      dueDate: Date | undefined;
      timeEntries: { date: Date; hours: number }[];
    }[]
  >([]);
  const [openAlertBox, setOpenAlertBox] = useState<boolean>(false);
  const [openAIModal, setOpenAIModal] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  // const [initialValues, setInitialValues] = useState<FormValues>({
  //   observations: [],
  //   recommendations: [],
  //   controlPolicy: "",
  //   controlObjective: "",
  //   actions: [],
  //   // owner: "",
  // });
  const [newActionInput, setNewActionInput] = useState("");
  const [date, setDate] = useState<Date>();
  const [expandedActionIndex, setExpandedActionIndex] = useState<number | null>(
    null
  );
  const [findingOwner, setFindingOwner] = useState<string>(
    selectedRowData?.owner
  );

  // useEffect(() => {
  //   // In a real application, you would fetch these from an API.
  //   const fetchedValues = {
  //     observations:
  //       selectedRowData?.observationDetails && selectedRowData.observationDetails.length > 0
  //         ? selectedRowData.observationDetails.map(
  //           (observation: { observation: string }, index: number) =>
  //             `Observation ${index + 1}:${" " + observation?.observation}`
  //         )
  //         : ["No Observation Found"],
  //     recommendations:
  //       selectedRowData?.observationDetails &&
  //         selectedRowData.observationDetails.length > 0
  //         ? selectedRowData.observationDetails.map(
  //           (recommendation: { recommendation: string }, index: number) =>
  //             `Recommendation ${index + 1}:${" " + recommendation?.recommendation}`
  //         )
  //         : ["No Recommendation Found"],
  //     // owner: selectedRowData?.owner || "",
  //     controlPolicy:
  //       selectedRowData?.controlId &&
  //       `${selectedRowData?.controlId}: ${" " + selectedRowData?.controlName}`,
  //     controlObjective:
  //       selectedRowData?.controlObjId &&
  //       `${selectedRowData?.controlObjId}: ${" " + selectedRowData?.controlObjName
  //       }`,
  //     actions: [],
  //   };
  //   setInitialValues(fetchedValues);
  // }, []);
  const handleAddAction = (newAction: string) => {
    if (newAction.trim()) {
      setActions((prevActions) => [
        ...prevActions,
        {
          status: "",
          description: newAction.trim(),
          assignedTo: "",
          dueDate: undefined,
          timeEntries: [],
        },
      ]);
      setNewActionInput("");
      setExpandedActionIndex(actions.length);
    }
  };

  const handleRemoveAction = (index: number) => {
    setActions((prevActions) => prevActions.filter((_, i) => i !== index));
    if (expandedActionIndex === index) {
      setExpandedActionIndex(null); // Collapse if the expanded action is removed
    }
  };

  const handleActionChange = (
    index: number,
    field: keyof {
      status: string;
      description: string;
      assignedTo: string;
      observation: string;
      dueDate: Date | undefined;
      timeEntries: { date: Date; hours: number }[];
    },
    value: any
  ) => {
    const updatedActions = [...actions];
    updatedActions[index] = { ...updatedActions[index], [field]: value };
    setActions(updatedActions);
  };

  const handleAddTimeEntry = (actionIndex: number) => {
    const updatedActions = [...actions];
    updatedActions[actionIndex].timeEntries = [
      ...updatedActions[actionIndex].timeEntries,
      { date: new Date(), hours: 0 },
    ];
    setActions(updatedActions);
  };

  const handleTimeEntryChange = (
    actionIndex: number,
    timeEntryIndex: number,
    field: keyof { date: Date; hours: number },
    value: any
  ) => {
    const updatedActions = [...actions];
    updatedActions[actionIndex].timeEntries[timeEntryIndex] = {
      ...updatedActions[actionIndex].timeEntries[timeEntryIndex],
      [field]: value,
    };
    setActions(updatedActions);
  };

  const handleRemoveTimeEntry = (
    actionIndex: number,
    timeEntryIndex: number
  ) => {
    const updatedActions = [...actions];
    updatedActions[actionIndex].timeEntries = updatedActions[
      actionIndex
    ].timeEntries.filter((_, i) => i !== timeEntryIndex);
    setActions(updatedActions);
  };

  // const handleSubmit = async () => {
  //   if (actions.length <= 0) {
  //     setOpenAlertBox(true);
  //     setAlertMessage("Please Atleast add one Action Field");
  //     return;
  //   }
  //   if (newActionInput.length !== 0) {
  //     setOpenAlertBox(true);
  //     setAlertMessage("Please add Your Action Field");
  //     return;
  //   }
  //   if (actions.some(a => !a.description.trim() || !a.assignedTo || !a.dueDate)) {
  //     setOpenAlertBox(true);
  //     setAlertMessage("Please fill in all required fields for each action.");
  //     return;
  //   }

  //   const saveDataFormat = {
  //     ...selectedRowData,
  //     actionsId: crypto.randomUUID(),
  //     actions: actions.map((action) => ({
  //       ...action,
  //       status: "In Progress",
  //     })),
  //   };
  //   console.log(saveDataFormat);
  //   const processId = await mapProcessName({
  //     processName: "Meeting Findings Actions",
  //   });
  //   await startProcessV2({
  //     processId: processId,
  //     data: saveDataFormat,
  //     processIdentifierFields: "",
  //   });
  //   router.refresh();
  //   setOpenActionForm(false);
  // };

  const handleSubmit = async () => {
    if (actions.length <= 0) {
      setOpenAlertBox(true);
      setAlertMessage("Please Atleast add one Action Field");
      return;
    }
    if (newActionInput.length !== 0) {
      setOpenAlertBox(true);
      setAlertMessage("Please add Your Action Field");
      return;
    }
    if (
      actions.some((a) => !a.description.trim() || !a.assignedTo || !a.dueDate)
    ) {
      setOpenAlertBox(true);
      setAlertMessage("Please fill in all required fields for each action.");
      return;
    }
    const saveDataFormat = actions.map((action) => ({
      actionsId: v4(),
      ...action,
      actionStatus: "In Progress",
      ...selectedRowData,
      frameworkId: frameworkId,
    }));

    console.log(saveDataFormat);

    const processId = await mapProcessName({
      processName: "Meeting Findings Actions",
    });
    for (const saveData of saveDataFormat) {
      await startProcessV2({
        processId: processId,
        data: saveData,
        processIdentifierFields: "",
      });
    }
    router.refresh();
    setOpenActionForm(false);
  };

  return (
    <>
      <Dialog open={openActionForm} onOpenChange={setOpenActionForm}>
        <DialogContent className="!max-w-none !w-screen !h-screen p-6 flex flex-col">
          <DialogHeader>
            <DialogTitle>Control Objective Closure Form</DialogTitle>
          </DialogHeader>
          <div className="h-full overflow-y-auto">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Control Policy
                  </label>
                  <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                    {selectedRowData?.controlName}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Control Objective
                  </label>
                  <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                    {selectedRowData?.controlObjective}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Observations
                  </label>
                  <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                    {selectedRowData?.observation}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Recommendations
                  </label>
                  <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                    {selectedRowData?.recommendation}
                  </div>
                </div>

                {/* {initialValues.controlPolicy && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Control Policy
                    </label>
                    <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                      {initialValues.controlPolicy}
                    </div>
                  </div>
                )} */}

                {/* {initialValues.controlObjective && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Control Objective
                    </label>
                    <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                      {initialValues.controlObjective}
                    </div>
                  </div>
                )}

                {initialValues?.observations && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Observations
                    </label>
                    <ul className="list-disc list-inside p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                      {initialValues?.observations.map((observation, index) => (
                        <li key={index}>{observation}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {initialValues?.recommendations && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Recommendations
                    </label>
                    <ul className="list-disc list-inside p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                      {initialValues?.recommendations.map(
                        (recommendation, index) => (
                          <li key={index}>{recommendation}</li>
                        )
                      )}
                    </ul>
                  </div>
                )} */}

                <div className="space-y-4">
                  {/* <div className="flex flex-row justify-between"> */}
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-sm font-medium text-gray-300">
                      Actions to be Taken{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <HoverBorderGradient
                      duration={1.2}
                      clockwise
                      className="flex items-center"
                    >
                      <button
                        type="button"
                        title="Rephrase the sentence"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation(); // Prevent event bubbling
                          setOpenAIModal(true);
                        }}
                        className="cursor-pointer flex items-center gap-1 text-sm text-white rgb(96 74 177); rounded-full px-3 py-1 focus:outline-none"
                      >
                        <SparklesIcon className="w-4 h-4 text-yellow-500" />
                        <span className="text-white">AI</span>
                      </button>
                    </HoverBorderGradient>
                  </div>

                  {/* <Button
                      variant="outline"
                      onClick={() => handleAddAction(newActionInput)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 border-blue-500/30"
                      disabled={!newActionInput.trim()}
                    >
                      Add
                    </Button> */}
                  {/* </div> */}
                  <div className="flex flex-col-reverse gap-3 pr-2">
                    {actions.map((action, index) => (
                      <div
                        key={index}
                        className="space-y-4 mb-4 p-4 rounded-md bg-gray-800 border border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
                            {expandedActionIndex === index ? (
                              <Textarea
                                value={action.description}
                                onChange={(e) =>
                                  handleActionChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                placeholder="Describe the action..."
                                className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400
                                                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500  min-h-[60px] resize-none flex-1"
                                required
                              />
                            ) : (
                              <div className="text-gray-300 p-2 rounded-md flex-1 break-words">
                                {action.description}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                                  {findingOwner.length > 0 && (
                                    <span className="text-gray-400 text-sm">
                                      Owner:{" "}
                                      {userIdNameMap.find(
                                        (u) => u.value === findingOwner
                                      )?.label || "N/A"}
                                    </span>
                                  )}
                                  {action.assignedTo ? (
                                    <span className="text-gray-400 text-sm">
                                      Assigned To:{" "}
                                      {userIdNameMap.find(
                                        (u) => u.value === action.assignedTo
                                      )?.label || "N/A"}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 text-sm">
                                      Assigned To:{" " + "N/A"}
                                      {/* {userIdNameMap.find(
                                          (u) => u.value === action.assignedTo
                                        )?.label || "N/A"} */}
                                    </span>
                                  )}
                                  {action.dueDate ? (
                                    <span className="text-gray-400 text-sm">
                                      Due Date:{" "}
                                      {format(
                                        action.dueDate,
                                        SAVE_DATE_FORMAT_GRC
                                      )}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 text-sm">
                                      Due Date:{" " + "N/A"}
                                      {/* {format(
                                        action.dueDate,
                                        SAVE_DATE_FORMAT_GRC
                                      )} */}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setExpandedActionIndex((prevIndex) =>
                                  prevIndex === index ? null : index
                                )
                              }
                              className="text-gray-400 hover:text-gray-300"
                            >
                              {expandedActionIndex === index ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                              <span className="sr-only">
                                {expandedActionIndex === index
                                  ? "Collapse action"
                                  : "Expand action"}
                              </span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveAction(index)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <XCircle className="w-4 h-4" />
                              <span className="sr-only">Remove action</span>
                            </Button>
                          </div>
                        </div>
                        <AnimatePresence>
                          {expandedActionIndex === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-4"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-300">
                                    Owner
                                  </label>
                                  <Select value={findingOwner}>
                                    <SelectTrigger
                                      className="bg-gray-700 border-gray-600 text-gray-300"
                                      disabled
                                    >
                                      <SelectValue placeholder="Select user" />
                                      <User className="w-4 h-4 ml-auto text-gray-400" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                      {userIdNameMap.map((user) => (
                                        <SelectItem
                                          key={user.value}
                                          value={user.value}
                                          className="hover:bg-gray-700/50 text-gray-200"
                                        >
                                          {user.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-300">
                                    Assigned To
                                  </label>
                                  <Select
                                    value={action.assignedTo}
                                    onValueChange={(value) =>
                                      handleActionChange(
                                        index,
                                        "assignedTo",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-300">
                                      <SelectValue placeholder="Select user" />
                                      <User className="w-4 h-4 ml-auto text-gray-400" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                      {userIdNameMap.map((user) => (
                                        <SelectItem
                                          key={user.value}
                                          value={user.value}
                                          className="hover:bg-gray-700/50 text-gray-200"
                                        >
                                          {user.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-300">
                                    Due Date
                                  </label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full bg-gray-700 border-gray-600 text-gray-300 justify-start text-left font-normal",
                                          !date && "text-muted-foreground"
                                        )}
                                      >
                                        {action.dueDate ? (
                                          format(
                                            action.dueDate,
                                            SAVE_DATE_FORMAT_GRC
                                          )
                                        ) : (
                                          <span className="text-gray-400">
                                            Pick a date
                                          </span>
                                        )}
                                        <Calendar className="w-4 h-4 ml-auto opacity-50" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0 bg-gray-800 border-gray-700"
                                      align="start"
                                    >
                                      <CalendarUI
                                        mode="single"
                                        selected={action.dueDate}
                                        onSelect={(date) =>
                                          handleActionChange(
                                            index,
                                            "dueDate",
                                            date
                                          )
                                        }
                                        className="rounded-md border border-gray-700 text-gray-200"
                                        style={{ backgroundColor: "#374151" }}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                  Time Spent
                                </label>
                                {action.timeEntries.map(
                                  (timeEntry, timeEntryIndex) => (
                                    <div
                                      key={timeEntryIndex}
                                      className="flex items-center gap-2 mb-2"
                                    >
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "bg-gray-700 border-gray-600 text-gray-300 justify-start text-left font-normal flex-1",
                                              !timeEntry.date &&
                                                "text-muted-foreground"
                                            )}
                                          >
                                            {timeEntry.date ? (
                                              format(
                                                timeEntry.date,
                                                SAVE_DATE_FORMAT_GRC
                                              )
                                            ) : (
                                              <span className="text-gray-400">
                                                Pick a date
                                              </span>
                                            )}
                                            <Calendar className="w-4 h-4 ml-auto opacity-50" />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                          className="w-auto p-0 bg-gray-800 border-gray-700"
                                          align="start"
                                        >
                                          <CalendarUI
                                            mode="single"
                                            selected={timeEntry.date}
                                            onSelect={(date) =>
                                              handleTimeEntryChange(
                                                index,
                                                timeEntryIndex,
                                                "date",
                                                date
                                              )
                                            }
                                            className="rounded-md border border-gray-700 text-gray-200"
                                            style={{
                                              backgroundColor: "#374151",
                                            }}
                                          />
                                        </PopoverContent>
                                      </Popover>
                                      <Input
                                        type="number"
                                        value={timeEntry.hours}
                                        onChange={(e) =>
                                          handleTimeEntryChange(
                                            index,
                                            timeEntryIndex,
                                            "hours",
                                            Number(e.target.value)
                                          )
                                        }
                                        placeholder="Hours"
                                        className="bg-gray-700 border-gray-600 text-gray-300 placeholder:text-gray-400 w-24
                                                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="0"
                                        required
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleRemoveTimeEntry(
                                            index,
                                            timeEntryIndex
                                          )
                                        }
                                        className="text-red-400 hover:text-red-300"
                                      >
                                        <XCircle className="w-4 h-4" />
                                        <span className="sr-only">
                                          Remove time entry
                                        </span>
                                      </Button>
                                    </div>
                                  )
                                )}
                                <Button
                                  variant="outline"
                                  onClick={() => handleAddTimeEntry(index)}
                                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 border-blue-500/30"
                                >
                                  Add Time Entry
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input
                        value={newActionInput}
                        onChange={(e) => setNewActionInput(e.target.value)}
                        placeholder="Add a new action..."
                        className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400
                                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={() => handleAddAction(newActionInput)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 border-blue-500/30"
                        disabled={!newActionInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialogFn
        openAlertBox={openAlertBox}
        setOpenAlertBox={setOpenAlertBox}
        message={alertMessage}
      />
      <ActionSuggestionModal
        open={openAIModal}
        setOpen={setOpenAIModal}
        controlPolicy={selectedRowData?.controlName || ""}
        controlObjective={selectedRowData?.controlObjective || ""}
        observation={selectedRowData?.observation || ""}
        recommendation={selectedRowData?.recommendation || ""}
        onSelectSuggestion={(suggestions) => {
          suggestions.forEach((suggestion) => handleAddAction(suggestion));
          setOpenAIModal(false);
        }}
      />
    </>
  );
}
