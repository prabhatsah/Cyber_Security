"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shadcn/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";

export interface FrameworkEntry {
  id: string;
  index: string;
  title: string;
  description: string;
  parentId: string | null;
  treatAsParent: boolean;
}

export interface TreeNode extends FrameworkEntry {
  level: number;
}

export interface ParentEntry extends FrameworkEntry {
    childrenArray: string[];
}

export interface ProcessedFrameworkData {
  flatTree: TreeNode[];
  itemMap: Record<string, { parentId: string | null; childrenIds: string[] }>;
}

interface FrameworkItemDropdownProps {
  processedData: ProcessedFrameworkData;
  value: string[];
  onChange: (newSelection: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
}

export function FrameworkItemDropdown({
  processedData,
  value,
  onChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  className,
}: FrameworkItemDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const { flatTree, itemMap } = processedData;

  const selectionState = React.useMemo(() => {
    const state = new Map<string, "checked" | "indeterminate">();
    const selectedSet = new Set(value);

    [...flatTree].reverse().forEach((item) => {
      const nodeInfo = itemMap[item.id];
      if (
        !nodeInfo ||
        !item.treatAsParent ||
        nodeInfo.childrenIds.length === 0
      ) {
        if (selectedSet.has(item.id)) {
          state.set(item.id, "checked");
        }
      } else {
        const childStates = nodeInfo.childrenIds.map((childId) =>
          state.get(childId)
        );
        const checkedCount = childStates.filter((s) => s === "checked").length;
        const indeterminateCount = childStates.filter(
          (s) => s === "indeterminate"
        ).length;

        if (checkedCount === nodeInfo.childrenIds.length) {
          state.set(item.id, "checked");
        } else if (checkedCount > 0 || indeterminateCount > 0) {
          state.set(item.id, "indeterminate");
        }
      }
    });

    return state;
  }, [value, flatTree, itemMap]);

  const handleSelect = (item: TreeNode) => {
    const newSelectedIds = new Set(value);
    const currentState = selectionState.get(item.id);
    const shouldBeChecked = !(
      currentState === "checked" || currentState === "indeterminate"
    );

    const descendants = new Set<string>();
    const queue: string[] = [...(itemMap[item.id]?.childrenIds || [])];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      descendants.add(currentId);
      const children = itemMap[currentId]?.childrenIds || [];
      children.forEach((childId) => queue.push(childId));
    }

    if (shouldBeChecked) {
      newSelectedIds.add(item.id);
      descendants.forEach((id) => newSelectedIds.add(id));
    } else {
      newSelectedIds.delete(item.id);
      descendants.forEach((id) => newSelectedIds.delete(id));
    }

    let parentId = itemMap[item.id]?.parentId;
    while (parentId) {
      const parentInfo = itemMap[parentId];
      if (parentInfo && parentInfo.childrenIds.length > 0) {
        const areAllChildrenSelected = parentInfo.childrenIds.every((childId) =>
          newSelectedIds.has(childId)
        );
        if (areAllChildrenSelected) {
          newSelectedIds.add(parentId);
        } else {
          newSelectedIds.delete(parentId);
        }
      }
      parentId = parentInfo?.parentId;
    }

    onChange(Array.from(newSelectedIds));
  };

  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return flatTree.slice(); // Always return a new array in original order

    const lowercasedQuery = searchQuery.toLowerCase();
    const matchedIds = new Set<string>();

    // Step 1: collect directly matched items
    flatTree.forEach((item) => {
      const matches =
        item.title.toLowerCase().includes(lowercasedQuery) ||
        item.description.toLowerCase().includes(lowercasedQuery) ||
        item.index.toLowerCase().includes(lowercasedQuery);

      if (matches) {
        matchedIds.add(item.id);
      }
    });

    // Step 2: collect ancestors and descendants
    const expandedIds = new Set(matchedIds);

    const addAncestors = (id: string) => {
      let current = id;
      while (current) {
        const parentId = itemMap[current]?.parentId;
        if (parentId && !expandedIds.has(parentId)) {
          expandedIds.add(parentId);
          current = parentId;
        } else {
          break;
        }
      }
    };

    const addDescendants = (id: string) => {
      const children = itemMap[id]?.childrenIds || [];
      for (const childId of children) {
        if (!expandedIds.has(childId)) {
          expandedIds.add(childId);
          addDescendants(childId);
        }
      }
    };

    matchedIds.forEach((id) => {
      addAncestors(id);
      addDescendants(id);
    });

    // Step 3: Return nodes in the original flatTree order, but only those in expandedIds
    return flatTree.filter((node) => expandedIds.has(node.id));
  }, [searchQuery, flatTree, itemMap]);

  const getSelectedLabel = () => {
    const leafNodeIds = value.filter((id) => {
      const nodeInfo = itemMap[id];
      return !nodeInfo || nodeInfo.childrenIds.length === 0;
    });

    if (leafNodeIds.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }

    if (leafNodeIds.length === 1) {
      const item = flatTree.find((i) => i.id === leafNodeIds[0]);
      return item ? item.index : placeholder;
    }

    return `${leafNodeIds.length} items selected`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between transition-all duration-150 ease-in-out border hover:border-primary hover:shadow-sm hover:bg-muted/40 cursor-pointer",
            className
          )}
        >
          <span className="truncate">{getSelectedLabel()}</span>
          <ChevronsUpDown
            className={cn(
              "ml-2 h-4 w-4 shrink-0 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 max-h-[400px] overflow-y-auto">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="transition-all duration-200 ease-in-out">
            <CommandEmpty>No results found.</CommandEmpty>

            {filteredItems.map((item) => (
              <CommandItem
                key={item.id}
                value={`${item.index} ${item.title} ${item.description}`}
                onSelect={() => handleSelect(item)}
                className="flex items-start cursor-pointer gap-2"
                style={{ paddingLeft: `${item.level * 1.5 + 0.75}rem` }}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-primary border rounded"
                  checked={selectionState.get(item.id) === "checked"}
                  ref={(el) => {
                    if (el) {
                      el.indeterminate =
                        selectionState.get(item.id) === "indeterminate";
                    }
                  }}
                  readOnly
                />
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {item.index}
                    </span>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
