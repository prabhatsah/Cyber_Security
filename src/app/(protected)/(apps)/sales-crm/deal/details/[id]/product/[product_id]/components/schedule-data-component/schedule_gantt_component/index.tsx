import { Gantt, Task, ViewMode } from "gantt-task-react";
import { memo, use, useEffect, useMemo, useState } from "react";
import { getStartEndDateForProject, initTasks } from "./helper";
import { ViewSwitcher } from "./ViewSwitcher";

function GanttChartComponent({ scheduleData }: { scheduleData: any[] }) {
  const [view, setView] = useState<ViewMode>(ViewMode.Week);
  //const [tasks, setTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>(initTasks(scheduleData));
  const [isChecked, setIsChecked] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Week);
  let columnWidth = 60;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }
  console.log("Schedule data in main...", scheduleData);
  useEffect(() => {
    if (scheduleData && scheduleData.length > 0) {
      const initializedTasks = initTasks(scheduleData);
      setTasks(initializedTasks);
    } else {
      console.error("scheduleData is not an array!");
    }
  }, [scheduleData]);

  // const tasks = useMemo(() =>{
  //     if (scheduleData && scheduleData.length > 0) {
  //     const initializedTasks = initTasks(scheduleData);
  //     return initializedTasks;
  //   } else {
  //     return []
  //   }
  // },[scheduleData])
  const handleTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
    let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project =
        newTasks[newTasks.findIndex((t) => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map((t) =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    setTasks(newTasks);
  };

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter((t) => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On progress change Id:" + task.id);
  };

  const handleDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };
 
  

  return (
    <div>
      <ViewSwitcher
        viewMode={viewMode}
        isChecked={isChecked}
        onViewListChange={setIsChecked}
        onViewModeChange={(viewMode: ViewMode) => setView(viewMode)}
      />

      <Gantt
        tasks={tasks}
        viewMode={view}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        ganttHeight={300}
        columnWidth={columnWidth}
      />
    </div>
  );
}
//export default GanttChartComponent;
export default memo(GanttChartComponent);
