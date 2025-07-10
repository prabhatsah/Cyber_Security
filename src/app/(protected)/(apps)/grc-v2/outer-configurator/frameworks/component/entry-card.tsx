"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { ChevronDown, ChevronUp, Edit, Trash } from "lucide-react";
import { cn } from "@/shadcn/lib/utils";
import { FrameworkEntry } from "../types/framework";
import { motion } from "framer-motion";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { Badge } from "@/shadcn/ui/badge";

interface EntryCardProps {
  entry: FrameworkEntry;
  level: number;
  selected: boolean;
  expanded: boolean;
  children?: React.ReactNode;
  onSelect: () => void;
  onExpand: () => void;
  onEdit: (entry: FrameworkEntry) => void;
  onDelete: (entryId: string) => void;
  viewselectedFramework?: any;
}

export function EntryCard({
  entry,
  level,
  selected,
  expanded,
  children,
  onSelect,
  onExpand,
  onEdit,
  onDelete,
  viewselectedFramework
}: EntryCardProps) {
  // Define border colors based on level
  const getBorderClass = () => {
    switch (level) {
      case 0:
        return "border-l-4 border-l-primary";
      case 1:
        return "border-l-4 border-l-secondary ml-4";
      case 2:
        return "border-l-4 border-l-accent ml-8";
      default:
        return `border-l-4 border-l-muted ml-${4 + level * 4}`;
    }
  };

  return (
    <div className="mb-4 transition-all duration-200">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: level * 0.1 }}
      >
        <Card
          className={cn(
            "transition-all duration-200 hover:shadow-md",
            getBorderClass(),
            selected && "ring-2 ring-primary ring-offset-2",
            entry.treatAsParent ? "bg-blue-950" : "bg-slate-700"
          )}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4 flex-1">
                {
                  !viewselectedFramework && 
                  <Checkbox
                    checked={selected}
                    onCheckedChange={() => onSelect()}
                    className="mt-1"
                  />
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded shrink-0">
                        {entry.index}
                      </span>
                      <span className="font-medium text-lg truncate">
                        {entry.title}
                      </span>
                      {
                        entry.treatAsParent &&
                        <Badge>
                          Parent
                        </Badge>
                      }
                    </div>
                  </div>
                  <CardDescription className="mt-1 text-sm text-foreground/50">
                    {/* {level === 0
                      ? "Top-level entry"
                      : `Level ${level} sub-entry`} */}
                    {entry.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {children && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-6"
                      onClick={(e) => {
                        e.preventDefault();
                        onExpand();
                      }}
                    >
                      {expanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </Button>
                  )}
                  {
                    !viewselectedFramework &&
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary"
                      onClick={() => onEdit(entry)}
                    >
                      <Edit size={16} />
                    </Button>
                  }
                  {
                    !viewselectedFramework &&
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(entry.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  }
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* <p className="text-sm">{entry.description}</p> */}
          </CardContent>
        </Card>
      </motion.div>
      {children && expanded && (
        <div className="mt-2 transition-all duration-300 ease-in-out pl-4">
          {children}
        </div>
      )}
    </div>
  );
}