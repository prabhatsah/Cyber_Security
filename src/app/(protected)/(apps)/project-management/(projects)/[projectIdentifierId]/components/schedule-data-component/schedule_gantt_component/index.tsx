import * as React from 'react';

import {
  Gantt,
  GanttWeekView,
  GanttMonthView,
  GanttDayView,
  GanttYearView,
  filterBy,
  orderBy,
  mapTree,
  extendDataItem,
  GanttTextFilter,
  GanttDateFilter,
  GanttColumnResizeEvent,
  GanttColumnReorderEvent,
  GanttDataStateChangeEvent,
  GanttExpandChangeEvent
} from '@progress/kendo-react-gantt';

import { getter } from '@progress/kendo-react-common';
import { exampleTaskData, exampleDependencyData } from './demo-kendo-data'
import { duration } from 'moment';
import { addMonths, differenceInMonths, parseISO } from 'date-fns';

interface Task {
  id: number;
  taskName: string;
  taskStart: string;
  taskDuration: number;
  taskEnd: string;
  progress: number;
  parentId?: number | null;
  taskColour?: string;
  children?: Task[];
}

interface Dependency {
  id: number;
  predecessorId: number;
  successorId: number;
  type: number;
}

interface Group {
  id: number;
  groupName: string;
  schedules: Task[];
  groupStartDate: string;
  groupEndDate: string;
}

interface ScheduleData {
  task: Task[];
  dependency: Dependency[];
  group: Group[];
}

interface GanttChartProps {
  scheduleData: ScheduleData;
}

interface GanttDependency {
  id: number;
  fromId: number;
  toId: number;
  type: number;
}

const ganttStyle = {
  height: 'calc(100vh - 255px)',
  width: '100%',
};

const taskModelFields = {
  id: 'id',
  start: 'start',
  end: 'end',
  title: 'title',
  percentComplete: 'percentComplete',
  duration: 'duration',
  isRollup: 'isRollup',
  isExpanded: 'isExpanded',
  isInEdit: 'isInEdit',
  children: 'children'
};

const dependencyModelFields = {
  id: 'id',
  fromId: 'fromId',
  toId: 'toId',
  type: 'type'
};

const getTaskId = getter(taskModelFields.id);

const columns = [
  { field: taskModelFields.id, title: 'ID', width: 70 },
  { field: taskModelFields.title, title: 'Schedule', width: 200, expandable: true, filter: GanttTextFilter },
  { field: taskModelFields.start, title: 'Start Date', width: 120, format: '{0:MM/dd/yyyy}', filter: GanttDateFilter },
  { field: taskModelFields.end, title: 'End Date', width: 120, format: '{0:MM/dd/yyyy}', filter: GanttDateFilter },
  { field: taskModelFields.duration, title: 'Duration', width: 120 },
  { field: taskModelFields.percentComplete, title: 'Progress', width: 120 }
];

function getTaskEndData(taskStart: string, duration: number) {
  if (duration != undefined) {
    const dur = duration;
    const startDate = parseISO(taskStart);
    const wholeMonths = Math.floor(duration);
    const fractionalMonths = duration % 1;

    let taskEnd = addMonths(taskStart, wholeMonths);
    taskEnd = new Date(
      taskEnd.setDate(taskEnd.getDate() + fractionalMonths * 30)
    );
    return taskEnd;
  }
}

function getTaskDuration(taskStart: string, taskEnd: string) {
  if (taskStart && taskEnd) {
    const startDate = parseISO(taskStart);
    const endDate = parseISO(taskEnd);
    const duration = differenceInMonths(endDate, startDate);
    return duration;
  }
}

function convertScheduleDataToKendo(scheduleData: ScheduleData) {
  console.log("scheduleData ---->", scheduleData);
  const groupData = scheduleData.group ? scheduleData.group : [];
  const kendoTasks: any[] = [];
  if (Object.values(groupData).length > 0) {
    Object.values(groupData).forEach(group => {
      const tempChildren: any[] = [];
      scheduleData.task.forEach(task => {
        if (task.parentId === group.id) {
          tempChildren.push({
            id: task.id,
            title: task.taskName,
            orderId: task.id,
            parentId: task.parentId ?? null,
            start: new Date(task.taskStart),
            end: getTaskEndData(task.taskStart, task.taskDuration),
            duration: task.taskDuration ? task.taskDuration : getTaskDuration(task.taskStart, task.taskEnd),
            percentComplete: task.progress,
            isExpanded: true,
            taskColour: task?.taskColour || "",
            children: []
          });
        }
      });
      kendoTasks.push({
        id: group.id,
        title: group.groupName,
        orderId: group.id,
        parentId: null,
        start: new Date(group.groupStartDate),
        end: new Date(group.groupEndDate),
        duration: getTaskDuration(group.groupStartDate, group.groupEndDate),
        percentComplete: 0,
        isExpanded: true,
        taskColour: null,
        children: tempChildren
      })
    });
  } else {
    scheduleData.task.forEach(task => {
      const convertedTask = {
        id: task.id,
        title: task.taskName,
        orderId: task.id,
        parentId: task.parentId ?? null,
        start: new Date(task.taskStart),
        end: getTaskEndData(task.taskStart, task.taskDuration),
        duration: task.taskDuration ? task.taskDuration : getTaskDuration(task.taskStart, task.taskEnd),
        percentComplete: task.progress,
        isExpanded: true,
        taskColour: task?.taskColour || "",
        children: []
      };
      kendoTasks.push(convertedTask);
    });
  }

  // Convert dependencies to Kendo format
  const kendoDependencies = scheduleData.dependency.map(dep => ({
    id: dep.id,
    fromId: dep.predecessorId,
    toId: dep.successorId,
    type: dep.type
  }));

  return {
    tasks: kendoTasks,
    dependencies: kendoDependencies
  };
}

const GanttChartComponent: React.FC<GanttChartProps> = ({ scheduleData }) => {

  const kendoGanttData = convertScheduleDataToKendo(scheduleData);
  console.log("kendoGanttData ---->", kendoGanttData);

  const [taskData] = React.useState(kendoGanttData.tasks);
  const [dependencyData] = React.useState(kendoGanttData.dependencies);

  const [expandedState, setExpandedState] = React.useState([7, 11, 12, 13]);
  const [columnsState, setColumnsState] = React.useState<Array<any>>(columns);

  const onColumnResize = React.useCallback(
    (event: GanttColumnResizeEvent) => event.end && setColumnsState(event.columns),
    [setColumnsState]
  );

  const onColumnReorder = React.useCallback(
    (event: GanttColumnReorderEvent) => setColumnsState(event.columns),
    [setColumnsState]
  );

  const customTaskRender = (props: any) => {
    const { task } = props;
    const customClass = task.taskColour ? `bg-${task.taskColour}` : 'bg-primary';

    return (
      <div {...props.innerRef} className={`custom-task ${customClass}`}>
        {task.title}
      </div>
    );
  };

  const [dataState, setDataState] = React.useState<any>({
    sort: [{ field: 'orderId', dir: 'asc' }],
    filter: []
  });

  const onDataStateChange = React.useCallback(
    (event: GanttDataStateChangeEvent) =>
      setDataState({ sort: event.dataState.sort, filter: event.dataState.filter }),
    [setDataState]
  );

  const onExpandChange = React.useCallback(
    (event: GanttExpandChangeEvent) => {
      const id = getTaskId(event.dataItem);
      const newExpandedState = event.value
        ? expandedState.filter((currentId) => currentId !== id)
        : [...expandedState, id];

      setExpandedState(newExpandedState);
    },
    [expandedState, setExpandedState]
  );

  const processedData = React.useMemo(() => {
    const filteredData = filterBy(taskData, dataState.filter, taskModelFields.children);
    const sortedData = orderBy(filteredData, dataState.sort, taskModelFields.children);

    return mapTree(sortedData, taskModelFields.children, (task) =>
      extendDataItem(task, taskModelFields.children, {
        [taskModelFields.isExpanded]: expandedState.includes(getTaskId(task))
      })
    );
  }, [taskData, dataState, expandedState]);

  return (
    <Gantt
      style={ganttStyle}
      taskData={processedData}
      taskModelFields={taskModelFields}
      dependencyData={dependencyData}
      dependencyModelFields={dependencyModelFields}
      columns={columnsState}
      resizable={true}
      reorderable={true}
      sortable={true}
      sort={dataState.sort}
      filter={dataState.filter}
      navigatable={true}
      onColumnResize={onColumnResize}
      onColumnReorder={onColumnReorder}
      onExpandChange={onExpandChange}
      onDataStateChange={onDataStateChange}
    >
      <GanttWeekView />
      <GanttDayView />
      <GanttMonthView />
      <GanttYearView />
    </Gantt>
  );
};

export default GanttChartComponent;

