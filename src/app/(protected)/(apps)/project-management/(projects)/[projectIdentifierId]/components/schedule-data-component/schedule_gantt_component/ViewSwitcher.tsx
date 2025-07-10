import React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
import { Button } from "@/shadcn/ui/button";

type ViewSwitcherProps = {
  isChecked: boolean;
  viewMode: ViewMode;
  onViewListChange: (isChecked: boolean) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
};

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  onViewModeChange,
  onViewListChange,
  isChecked,
  viewMode,
}) => {
  return (
    <div className="flex justify-end items-center gap-4 mb-2">
      <div>
        <Button
          variant={"outline"}
          onClick={() => onViewModeChange(ViewMode.Week)}
        >
          Week
        </Button>
        <Button
          variant={"outline"}
          onClick={() => onViewModeChange(ViewMode.Month)}
        >
          Month
        </Button>
      </div>

      <div className="ml-4 flex items-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            defaultChecked={isChecked}
            onClick={() => onViewListChange(!isChecked)}
            className="sr-only peer"
          />
          <span className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:rounded-full after:h-5 after:w-5 transition-all duration-200 ease-in-out" />
        </label>
        <span className="ml-2 text-sm mr-2">Show Task List</span>
      </div>
    </div>
  );
};
