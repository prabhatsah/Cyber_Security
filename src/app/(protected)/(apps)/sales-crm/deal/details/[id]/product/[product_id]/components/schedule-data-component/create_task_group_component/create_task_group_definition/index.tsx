import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/shadcn/ui/select";
import { Trash2, Edit } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import form from "@/app/(protected)/examples/form/page";
import MultiSelectDropdown from "@/ikon/component/select2-Checkbox";
import { Input } from "@/shadcn/ui/input";

const TaskGroupModal = ({ onClose,scheduleData }: { onClose: () => void , scheduleData:any}) => {
  const [taskGroupName, setTaskGroupName] = useState<string>("");
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");
  const [taskGroups, setTaskGroups] = useState<
    { groupName: string; schedule: string }[]
  >([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddUpdate = () => {
    if (editingIndex !== null) {
      const updatedTaskGroups = [...taskGroups];
      updatedTaskGroups[editingIndex] = {
        groupName: taskGroupName,
        schedule: selectedSchedule,
      };
      setTaskGroups(updatedTaskGroups);
      setEditingIndex(null);
    } else {
      setTaskGroups([
        ...taskGroups,
        { groupName: taskGroupName, schedule: selectedSchedule },
      ]);
    }

    setTaskGroupName("");
    setSelectedSchedule("");
  };

  const handleEdit = (index: number) => {
    const taskGroup = taskGroups[index];
    setTaskGroupName(taskGroup.groupName);
    setSelectedSchedule(taskGroup.schedule);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedTaskGroups = taskGroups.filter((_, i) => i !== index);
    setTaskGroups(updatedTaskGroups);
  };

  const handleClear = () => {
    setTaskGroupName("");
    setSelectedSchedule("");
    setEditingIndex(null);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[40%]">
        <DialogHeader>
          <h2 className="">Create Task Group</h2>
          <p className="">
            Task group can be created here and tasks can be grouped.
          </p>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="taskName" className="text-sm">
                Schedule Name
              </label>
              <Input
                type="text"
                placeholder="Create new Task Group"
                value={taskGroupName}
                onChange={(e) => setTaskGroupName(e.target.value)}
                className=""
              />
              
            </div>
            <div className="w-1/2">
            <FormField
                control={form.control}
                name="scheduleData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee Team Member(s)*</FormLabel>
                    <FormControl>
                      <MultiSelectDropdown
                        options={scheduleData.map((schedule:any) => ({
                          key: schedule.label || schedule.value,
                          value: schedule.value,
                        }))}
                        showSearch={true}
                        onChange={(selectedValues) => {
                          field.onChange(selectedValues);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="default" onClick={handleAddUpdate}>
              {editingIndex !== null ? "Update" : "Add"}
            </Button>
            <Button variant="destructive" onClick={handleClear}>
              Clear
            </Button>
          </div>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="">
                <th className="border p-2">Task Group</th>
                <th className="border p-2">Schedule</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {taskGroups.map((taskGroup, index) => (
                <tr key={index}>
                  <td className="border p-2">{taskGroup.groupName}</td>
                  <td className="border p-2">{taskGroup.schedule}</td>
                  <td className="flex justify-center space-x-2">
                    <button onClick={() => handleEdit(index)} className="">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(index)} className="">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="ml-auto">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskGroupModal;
