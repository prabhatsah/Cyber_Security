"use client";
import { Button } from "@/shadcn/ui/button";
import { useState, useEffect, use } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { m } from "framer-motion";
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { on } from "events";


interface AddEpicModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectIdentifier: string;
  scheduleData: any[];
  epicData: {};
}

interface FormData {
  remarks: string;
  email: string;
  contactNumber: string;
  
}



const AddEpicModal: React.FC<AddEpicModalProps> = ({
  isOpen,
  onClose,
  projectIdentifier,
  scheduleData,
  epicData
}) => {
  const [scheduleIDArr, setScheduleIDArr] = useState<any>([]); // Store data
  //const [filteredScheduleData, setFilteredScheduleData] = useState<any>([]); // Store data


    console.log("scheduleData", scheduleData);
    console.log("epicData", epicData);
    const filteredData = scheduleData.filter(task => !epicData.hasOwnProperty(task.id));
    console.log("filteredData", filteredData);
  
 // const [taskData, setSTaskData] = useState<any>(scheduleData); // Store data
 
 
  // async function fetchData() {
  //   const pmSoftwareId = await getSoftwareIdByNameVersion("Project Management", "1.0");
  //   const response: any = await getMyInstancesV2({
  //     softwareId: pmSoftwareId,
  //     processName: "Product of Project",
  //     predefinedFilters: {taskName : "View State"},
  //     mongoWhereClause: `this.Data.projectIdentifier == "${projectIdentifier}"`,
  //     projections: ["Data.scheduleData"],
  //   });
  //   const scheduleData = response[0]?.data?.scheduleData?.task || [];
  //   console.log("scheduleData", scheduleData);
  //   setScheduleData(scheduleData);
  // }
  // useEffect(() => {
  //   // Fetch data when the modal opens
  //   if (isOpen) {
  //     fetchData();
  //   }
  // }, [isOpen]);

 
 async function handleOnSubmit(){
    console.log("Form Data Submitted:", scheduleIDArr);
    var epicData: Record<string, string> = {};
    for(var i=0; i<scheduleIDArr.length; i++){
      epicData[scheduleIDArr[i]] = scheduleData.find((task) => task.id === scheduleIDArr[i])?.taskName || "";
    }
    const epicInstanceData = await getMyInstancesV2({
      processName: "Epic",
      predefinedFilters: { taskName: "Edit State" },
      mongoWhereClause: `this.Data.projectIdentifier == "${projectIdentifier}"`,
    })
    if(epicInstanceData.length === 0){
      const processId = await mapProcessName({
        processName: "Epic"
      })
      const epicInstance = await startProcessV2({
        processId: processId,
        data: {
          projectIdentifier: projectIdentifier,
          epicData: epicData,
        },
        processIdentifierFields: "projectIdentifier",
      });
      console.log("Epic Instance Created:", epicInstance);
    }
    else{
      const taskId = epicInstanceData[0]?.taskId || "";
      await invokeAction({
        taskId: taskId,
        transitionName: "Update Edit",
        data: {
          projectIdentifier: projectIdentifier,
          epicData: epicData,
        },
        processInstanceIdentifierField: "projectIdentifier",
      })
    }
    onClose();
    // const taskId = epicInstanceData[0]?.taskId || "";
    // await invokeAction({
    //   taskId: taskId,
    //   transitionName: "Update Edit",
    //   data: epicData,
    //   processInstanceIdentifierField: "projectIdentifier",
    // })
 }

  // async function handleOnSubmit(
  //   data: z.infer<typeof POIFormSchema>
  // ): Promise<void> {
  //   debugger;
  //   console.log("Form Data Submitted:", data);
  //   onClose();
  // }
  const handleCheckboxChange = (id: string) => {
    if (scheduleIDArr.includes(id)) {
      setScheduleIDArr(scheduleIDArr.filter((item: string) => item !== id));
    } else {
      setScheduleIDArr([...scheduleIDArr, id]);
    }


  }


  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-5xl block" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Add Epic</DialogTitle>
        </DialogHeader>

       
        <div className="space-y-2 max-h-[80vh] overflow-auto mt-10">
            {filteredData && filteredData.map((task: { id: string; taskName: string }) => (
            <div key={task.id} className="flex items-center space-x-2">
              <Checkbox
              id={task.id}
              checked={scheduleIDArr.includes(task.id)}
              onCheckedChange={() => handleCheckboxChange(task.id)}
              />
              <label htmlFor={task.id} className="text-sm">
              {task.taskName}
              </label>
            </div>
            ))}
        </div>

    
            <DialogFooter className="col-span-2 flex justify-end mt-4">
              <Button type="submit" className="" onClick={handleOnSubmit}>
              Add
              </Button>
            </DialogFooter>
        
      </DialogContent>
    </Dialog>
  );
};

export default AddEpicModal;
