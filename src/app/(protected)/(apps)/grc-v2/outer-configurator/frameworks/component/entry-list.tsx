"use client";

import { FrameworkEntry } from "../types/framework";
import { EntryCard } from "./entry-card";
import { motion } from "framer-motion";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { useState } from "react";
import { ChevronDown, ChevronUp, Edit, LayoutList, Table2, Trash } from "lucide-react";
import { cn } from "@/shadcn/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";

interface EntryListProps {
  entries: FrameworkEntry[];
  selectedEntries: string[];
  parentsDropdownEntry: FrameworkEntry[];
  onSelectEntry: (id: string) => void;
  onMoveEntries: (parentId: string | null) => void;
  onEdit: (entry: FrameworkEntry) => void;
  onDelete: (entryId: string) => void;
  viewselectedFramework?: any;
}

type ViewMode = "accordion" | "table";

export function EntryList({
  entries,
  selectedEntries,
  parentsDropdownEntry,
  onSelectEntry,
  onMoveEntries,
  onEdit,
  onDelete,
  viewselectedFramework
}: EntryListProps) {
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set(entries.map(e => e.id)));
  const [viewMode, setViewMode] = useState<ViewMode>("accordion");
  const [allExpanded, setAllExpanded] = useState(false);
  console.log(viewMode);

  // Function to get all descendant IDs of entries
  const getAllDescendantIds = (entryIds: string[]): string[] => {
    const descendants = entryIds.flatMap(id => {
      const children = parentsDropdownEntry.filter(entry => entry.parentId === id);
      const childIds = children.map(child => child.id);
      return [...childIds, ...getAllDescendantIds(childIds)];
    });
    return descendants;
  };

  // Get valid parent entries (excluding selected entries and their descendants)
  const getValidParentEntries = () => {
    const descendantIds = getAllDescendantIds(selectedEntries);
    const invalidIds = [...selectedEntries, ...descendantIds];
    return parentsDropdownEntry.filter(entry => !invalidIds.includes(entry.id));
  };

  // Function to expand or collapse all entries
  // const toggleAllEntries = (expand: boolean) => {
  //   if (expand) {
  //     setExpandedEntries(new Set(entries.map(e => e.id)));
  //   } else {
  //     setExpandedEntries(new Set());
  //   }
  // };
  const toggleAllEntries = () => {
    const shouldExpand = !allExpanded;
    setAllExpanded(shouldExpand);
    setExpandedEntries(shouldExpand ? new Set(entries.map(e => e.id)) : new Set());
  };

  // Function to toggle a single entry's expanded state
  const toggleEntry = (entryId: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId);
    } else {
      newExpanded.add(entryId);
    }
    setExpandedEntries(newExpanded);
  };

  // Function to get entry level and parent chain
  const getEntryInfo = (entry: FrameworkEntry) => {
    let level = 0;
    let currentEntry = entry;
    const parentChain: FrameworkEntry[] = [];

    while (currentEntry.parentId) {
      const parent = entries.find(e => e.id === currentEntry.parentId);
      if (parent) {
        level++;
        parentChain.unshift(parent);
        currentEntry = parent;
      } else {
        break;
      }
    }

    return { level, parentChain };
  };

  const visited = new Set<string>();
  // Function to build a hierarchical tree from flat entries array
  const buildEntryTree = (
    entries: FrameworkEntry[],
    parentId: string | null = null,
    level = 0
  ) => {
    const filteredEntries = entries.filter(
      (entry) => entry.parentId === parentId
    );

    if (filteredEntries.length === 0) {
      return null;
    }

    return (
      <>
        {filteredEntries.map((entry) => {
          if (visited.has(entry.id)) {
            // console.warn('Duplicate entry skipped:', entry.id);
            return null;
          }
          visited.add(entry.id);
          const childEntries = buildEntryTree(entries, entry.id, level + 1);

          return (
            <EntryCard
              key={entry.id}
              entry={entry}
              level={level}
              selected={selectedEntries.includes(entry.id)}
              expanded={expandedEntries.has(entry.id)}
              onExpand={() => toggleEntry(entry.id)}
              onSelect={() => onSelectEntry(entry.id)}
              onEdit={onEdit}
              onDelete={onDelete}
              viewselectedFramework={viewselectedFramework}
            >
              {childEntries}
            </EntryCard>
          );
        })}
      </>
    );
  };

  // Function to check if an entry has children
  const hasChildren = (entryId: string) => {
    return entries.some(entry => entry.parentId === entryId);
  };

  // Function to get all visible entries for table view
  const getVisibleEntries = () => {
    const result: FrameworkEntry[] = [];
    const visited = new Set<string>();

    const addEntry = (entry: FrameworkEntry, level: number) => {
      if (visited.has(entry.id)) return;
      visited.add(entry.id);
      result.push(entry);
      if (expandedEntries.has(entry.id)) {
        entries
          .filter(e => e.parentId === entry.id)
          .forEach(child => addEntry(child, level + 1));
      }
    };

    entries
      .filter(entry => !entry.parentId)
      .forEach(entry => addEntry(entry, 0));

    return result;
  };

  // Function to render table view
  const renderTableView = () => {
    const visibleEntries = getVisibleEntries();
    console.log(visibleEntries);
    return (
      <div className="rounded-md border">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              {
                !viewselectedFramework &&
                <TableHead className="w-1/12"></TableHead>
              }
              <TableHead className="w-1/12 text-left">Index</TableHead>
              <TableHead className="w-1/4 text-left">Title</TableHead>
              {/* <TableHead className="w-1/4 text-left">Parent</TableHead> */}
              <TableHead className="w-1/4 text-left">Description</TableHead>
              <TableHead className="w-1/4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleEntries.map((entry) => {
              const { level, parentChain } = getEntryInfo(entry);
              const parentInfo = parentChain.length > 0
                ? `${parentChain[parentChain.length - 1].title} (${parentChain[parentChain.length - 1].index})`
                : "None";
              const hasChildEntries = hasChildren(entry.id);
              const isExpanded = expandedEntries.has(entry.id);

              return (
                <TableRow
                  key={entry.id}
                  className={cn(
                    "transition-colors",
                    level > 0 && "bg-muted/30"
                  )}
                >
                  {
                    !viewselectedFramework &&
                    <TableCell className="w-1/12">
                      <Checkbox
                        checked={selectedEntries.includes(entry.id)}
                        onCheckedChange={() => onSelectEntry(entry.id)}
                      />
                    </TableCell>
                  }
                  <TableCell className="w-1/6 text-left">
                    {/* <div className="flex items-center justify-center gap-2"> */}
                    {/* {level > 0 && (
                        <span className={`text-muted-foreground ${level === 0 ? '' : `pl-[${level * 32}px]`}`}>
                          {'└─'.repeat(level)}
                          {''.repeat(level)} 
                        </span>
                      )}
                      <span>{entry.index}</span> */}
                    <span
                      style={{ paddingLeft: `${level * 16}px` }}
                      className="!text-muted-foreground"
                    >
                    </span>
                    <span>{entry.index}</span>

                    {/* </div> */}
                  </TableCell>
                  <TableCell className="w-1/6 font-medium text-left truncate" title={entry.title}>
                    <span
                      style={{ paddingLeft: `${level * 16}px` }}
                      className="!text-muted-foreground"
                    >
                    </span>
                    {entry.title}
                  </TableCell>
                  {/* <TableCell className="w-1/6 text-muted-foreground text-sm">
                    <span
                      style={{ paddingLeft: `${level * 16}px` }}
                      className="!text-muted-foreground"
                    >
                    </span>
                    {parentInfo}
                  </TableCell> */}
                  <TableCell className="w-1/6 truncate" title={entry.description}>
                    <span
                      style={{ paddingLeft: `${level * 16}px` }}
                      className="!text-muted-foreground"
                    >
                    </span>
                    {entry.description}
                  </TableCell>
                  <TableCell className="w-1/6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {hasChildEntries && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleEntry(entry.id)}
                        >
                          <span className="sr-only">
                            {isExpanded ? "Collapse" : "Expand"}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}

                      {/* Remove when view */}
                      {
                        !viewselectedFramework &&
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-primary h-8 w-8 p-0"
                          onClick={() => onEdit(entry)}
                        >
                          <span className="sr-only">Edit</span>
                          <Edit className="h-4 w-4" />
                        </Button>
                      }

                      {/* Remove when view */}
                      {
                        !viewselectedFramework &&
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                          onClick={() => onDelete(entry.id)}
                        >
                          <span className="sr-only">Delete</span>
                          <Trash className="h-4 w-4" />
                        </Button>
                      }
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          {selectedEntries.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {selectedEntries.length} {selectedEntries.length === 1 ? 'entry' : 'entries'} selected
            </p>
          )}
          <div className="flex items-center gap-2">
            <IconButtonWithTooltip
              variant="outline"
              size="sm"
              onClick={() => setViewMode("accordion")}
              className={cn(
                "flex items-center gap-1",
                viewMode === "accordion" && "bg-primary text-primary-foreground"
              )}
              tooltipContent={'Accordian'}
            >
              <LayoutList className="h-4 w-4" />
              {/* Accordion */}
            </IconButtonWithTooltip>
            <IconButtonWithTooltip
              variant="outline"
              size="sm"
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-1",
                viewMode === "table" && "bg-primary text-primary-foreground"
              )}
              tooltipContent={'Table'}
            >
              <Table2 className="h-4 w-4" />
              {/* Table */}
            </IconButtonWithTooltip>
          </div>
          {/* <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleAllEntries(true)}
              className="flex items-center gap-1"
            >
              <ChevronDown className="h-4 w-4" />
              Expand All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleAllEntries(false)}
              className="flex items-center gap-1"
            >
              <ChevronUp className="h-4 w-4" />
              Collapse All
            </Button>
          </div> */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllEntries}
              className="flex items-center gap-1"
            >
              {allExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Collapse All
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Expand All
                </>
              )}
            </Button>
          </div>
        </div>
        {selectedEntries.length > 0 && (
          <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                Move Entries
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Move Entries</DialogTitle>
                <DialogDescription>
                  Select a new parent for the selected entries
                </DialogDescription>
              </DialogHeader>
              <Select
                onValueChange={(value) => {
                  onMoveEntries(value === "no-parent" ? null : value);
                  setIsMoveDialogOpen(false);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select new parent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-parent">No Parent</SelectItem>
                  {getValidParentEntries().map((entry) => (
                    <SelectItem key={entry.id} value={entry.id}>
                      {entry.index} - {entry.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="h-[50vh] overflow-y-auto">
        {entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 border rounded-lg bg-muted/10"
          >
            <p className="text-muted-foreground">
              No framework entries yet. Add your first entry to get started.
            </p>
          </motion.div>
        ) : viewMode === "accordion" ? (
          buildEntryTree(entries)
        ) : (
          renderTableView()
        )}
      </div>

    </div>
  );
}