"use client";
import { useState } from "react";
///import ButtonWithTooltip from "@/ikon/components/buttonWithTooltip";
import { Circle, Plus, PlusCircle } from "lucide-react";

import ScheduleGanttShowComponent from "./schedule_show_gant_componenet";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";

import ComboboxInput from "@/ikon/components/combobox-input";
import ScheduleFormComponent from "./scheduleFormComponent";

interface ScheduleDataComponentProps {
  projectIdentifier: string;
}

function ScheduleDataComponent({
  projectIdentifier,
}: ScheduleDataComponentProps) {
  // const [isModalOpen, setModalOpen] = useState(false);

  const [open, setOpen] = useState<boolean>(false);

  const toggleModal = () => {
    setOpen((prev) => !prev);
  };

  const items = [
    {
      value: "0",
      label: "Baseline"
    },
    {
      value: "Forecasted",
      label: "Forecasted"
    }
  ];
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex justify-between items-center">
        <div className="">
          <ComboboxInput
            items={items}
            placeholder="Please Select Version .."
            defaultValue="Forecasted"
          // onSelect={(selectedMonth: any) => setSelDate(selectedMonth)}
          />
        </div>
        <IconButtonWithTooltip
          tooltipContent="Add Schedule"
          onClick={toggleModal}
        >
          <Plus />
        </IconButtonWithTooltip>
      </div>
      {/* <ScheduleFormComponent
        isOpen={isModalOpen}
        onClose={toggleModal}
        projectIdentifier={projectIdentifier}
      /> */}
      {
        open && 
        <ScheduleFormComponent open={open} setOpen={setOpen} projectIdentifier={projectIdentifier}/>
      }
      <ScheduleGanttShowComponent projectIdentifier={projectIdentifier} />
    </div>
  );
}

export default ScheduleDataComponent;
