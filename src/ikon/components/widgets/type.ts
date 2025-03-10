export interface WidgetProps {
  id: string,
  widgetText: string;
  widgetNumber: string;
  iconName?: string;
  onButtonClickfunc?: (...params: (string | (Record<string, string>))[]) => void;
};

export interface WidgetsFunctionProps {
  widgetData: WidgetProps[];
}