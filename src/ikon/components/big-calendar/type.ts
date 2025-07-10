import { ReactNode } from "react";
//import { Event } from "react-big-calendar";

export interface BigCalendarProps {
  events: BigCalendarEventProps[];
  extraParamsEvent?: ExtraParamsEvent;
  extraTools?: ReactNode[];
  onDateClick?: (date: Date) => void;
}

export interface ExtraParamsEvent {
  defaultView?: string;
  isEditableAll?: boolean;
  isViewable?: boolean;  
  onEditEventClick?: (event: BigCalendarEventProps) => void;
  onViewEventClick?: (event: BigCalendarEventProps) => void;
  height?: string;
  margin?: string;
}

export interface BigCalendarEventProps extends Event {
  isEditable?: boolean;
  isViewable?: boolean;
  onEventClick?: (event: any) => void;
}

export interface BigCalenderToolbarProps {
  onNavigate: (view: any) => void;
  onView: (view: any) => void;
  label: string;
  extraTools?: ReactNode[];
  view: "month" | "week" | "work_week" | "day" | "agenda";
  //extraParamsEvent?: ExtraParamsEvent;
}
