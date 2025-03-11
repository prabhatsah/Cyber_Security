import { Command } from "cmdk";
import { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { Matcher } from "react-day-picker";

export interface FormFieldProps {
  formControl: any;
  label?: string;
  formItemClass?: string;
  formDescription?: string;
  extraFormComponent?: (value: string) => ReactNode;
}

export interface FormInputProps
  extends FormFieldProps,
    InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export interface FormTextareaProps
  extends FormFieldProps,
    TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
}

export interface FormDateInputProps extends FormFieldProps {
  name: string;
  placeholder?: string;
  dateFormat?: string;
  calendarDateDisabled?: Matcher;
}

export interface FormComboboxInputProps extends FormFieldProps {
  name: string;
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
