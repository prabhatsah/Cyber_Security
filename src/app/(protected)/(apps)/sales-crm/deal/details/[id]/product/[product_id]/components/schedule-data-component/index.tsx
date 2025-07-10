"use client";
import { useState } from "react";
///import ButtonWithTooltip from "@/ikon/components/buttonWithTooltip";
import { Circle, Plus, PlusCircle } from "lucide-react";
//import ScheduleFormComponent from "./schedule_form_component/schedule_form_definition";
import ScheduleGanttShowComponent from "./schedule_show_gant_componenet";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import ScheduleFormComponent from "./schedule_form_component/schedule_form_definition";

interface ScheduleDataComponentProps {
  productIdentifier: string;
}

function ScheduleDataComponent({
  productIdentifier,
}: ScheduleDataComponentProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };
  return (
    <>
      <div className="flex justify-end">
        <IconButtonWithTooltip
          tooltipContent="Add Schedule"
          onClick={toggleModal}
        >
          <Plus />
        </IconButtonWithTooltip>
      </div>
      <ScheduleFormComponent
        isOpen={isModalOpen}
        onClose={toggleModal}
        productIdentifier={productIdentifier}
      />
      <ScheduleGanttShowComponent productIdentifier={productIdentifier} />
    </>
  );
}

export default ScheduleDataComponent;
