import { Command } from "cmdk";
import React, { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { Matcher } from "react-day-picker";

export interface FormFieldProps {
  formControl: any;
  label?: string | ReactNode;
  formItemClass?: string;
  formDescription?: string;
  extraFormComponent?: (value: string) => ReactNode;
}

export interface FormTimeInputProps {
  formControl: any;
  name: string;
  label?: string;
  placeholder?: string;
  formDescription?: string;
  timeFormat?: string;
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
  defaultValue?:string[];
}
export interface ComboboxItemProps {
  value: string;
  label?: string | undefined;
  extra?: any;
  disabled?: ((...args: any) => boolean) | boolean;
}
