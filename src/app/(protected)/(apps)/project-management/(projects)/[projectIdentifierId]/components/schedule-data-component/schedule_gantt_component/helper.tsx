import { Task } from "gantt-task-react";

export const initTasks = (scheduleData: any[]) => {
  const currentDate = new Date();
  const fourMonthsLater = new Date(currentDate);
  fourMonthsLater.setMonth(currentDate.getMonth() + 4);
  console.log("scheduleData:", scheduleData);

  //const [tasks, setTasks] = useState<Task[]>([]);
  console.log("Schedule data 23...", scheduleData);

  if (!scheduleData || scheduleData.length == 0) {
    console.error("scheduleData is not an array!");

    return [];
  } else {
    console.log("Schedule data...", scheduleData);
    const tasks = scheduleData.map((item: any) => ({
      name: item.taskName,
      start: new Date(item.startDate),
      end: new Date(item.endDate),
      progress: 0,
      type: item.type || "defaultType",
      id: item.id || Date.now().toString(),
    }));
    return tasks;
  }
};


export const getStartEndDateForProject = (tasks: Task[], projectId: string) => {
  const projectTasks = tasks.filter((t) => t.project === projectId);
  if (projectTasks.length === 0) {
    return [new Date(), new Date()];
  }

  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (const task of projectTasks) {
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }

  return [start, end];
};
