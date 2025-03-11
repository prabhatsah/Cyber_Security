export interface ComboBoxInputProps {
  placeholder?: string;
  items: ComboboxItemProps[];
  onSelect?: (value: string | string[]) => void;
  disabled?: ((...args: any) => boolean) | boolean;
}

export interface ComboboxItemProps {
  value: string;
  label?: string | undefined;
  extra?: any;
  disabled?: ((...args: any) => boolean) | boolean;
}
