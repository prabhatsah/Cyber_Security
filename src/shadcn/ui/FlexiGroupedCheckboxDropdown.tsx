"use client";

import * as React from "react";
import { GroupedCheckboxDropdown, OptionGroup } from "./grouped-checkbox-dropdown";

interface RawOption {
  id: string;
  label: string;
  description?: string;
}

interface RawGroup {
  id?: string;
  label?: string;
  options: RawOption[];
}

interface FlexibleGroupedCheckboxDropdownProps {
  groups: RawGroup[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  addNewItemLabel?: string;
  onAddNewItem?: () => void;
  multiSelect?: boolean;
  disabled?: boolean;
}

export function FlexibleGroupedCheckboxDropdown({
  groups,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  addNewItemLabel,
  onAddNewItem,
  multiSelect,
  disabled,
}: FlexibleGroupedCheckboxDropdownProps) {
  // Normalize missing group id/label
  const normalizedGroups: OptionGroup[] = groups.map((group, index) => ({
    id: group.id || `group-${index}`,
    label: group.label || '', // || `Group ${index + 1}`,
    options: group.options,
  }));

  return (
    <GroupedCheckboxDropdown
      groups={normalizedGroups}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      addNewItemLabel={addNewItemLabel}
      onAddNewItem={onAddNewItem}
      multiSelect={multiSelect}
      disabled={disabled}
    />
  );
}
