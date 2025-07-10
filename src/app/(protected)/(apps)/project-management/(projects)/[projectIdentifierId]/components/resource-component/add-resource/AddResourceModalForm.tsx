"use client";

import * as React from 'react';
import { Form } from "@/shadcn/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shadcn/ui/dialog";
import { useForm } from "react-hook-form";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent } from "@/shadcn/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/shadcn/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/shadcn/ui/select";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { ChevronDown, ChevronRight, Info } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/shadcn/ui/tooltip";
import { Separator } from "@/shadcn/ui/separator";
import ResourceTable from '@/ikon/components/resource';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectIdentifier: string;
  resourceDataWithAllocation: any[];
  userMaps: UserMaps;
}

interface UserMaps {
  userDetailsMap: {
    [key: string]: {
      name: string;
    };
  };
  rolesMap: {
    [key: string]: {
      roleId: string;
      roleName: string;
    };
  };
}

interface GroupedResource {
  taskId: number;
  taskName: string;
  resources: any[];
}

const getMonthsRange = (resourceData: any[]) => {
  if (resourceData.length === 0) return [];

  let allMonths = new Set<string>();

  resourceData.forEach((resource) => {
    Object.keys(resource.detailedAllocation || {}).forEach((month) => allMonths.add(month));
  });

  const sortedMonths = Array.from(allMonths)
    .map((monthYear) => {
      const [month, year] = monthYear.split('_');
      return {
        monthYear,
        date: new Date(`${month} 1, ${year}`)
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(({ monthYear }) => monthYear);

  return sortedMonths;
};

const groupResourcesByTask = (resources: any[]): GroupedResource[] => {
  const groupedMap = resources.reduce((acc, resource) => {
    const taskId = resource.taskId;
    if (!acc.has(taskId)) {
      acc.set(taskId, {
        taskId,
        taskName: resource.taskName,
        resources: []
      });
    }
    acc.get(taskId).resources.push(resource);
    return acc;
  }, new Map<number, GroupedResource>());

  return Array.from(groupedMap.values());
};

const ResourceModal: React.FC<ResourceModalProps> = ({
  isOpen,
  onClose,
  projectIdentifier,
  resourceDataWithAllocation,
  userMaps,
}) => {
  const [expandedTasks, setExpandedTasks] = React.useState<Set<number>>(new Set());
  const form = useForm({
    defaultValues: {
      resources: resourceDataWithAllocation
    }
  });

  const monthsRange = getMonthsRange(resourceDataWithAllocation);
  const groupedResources = groupResourcesByTask(resourceDataWithAllocation);

  const handleSave = (data: any) => {
    console.log('Saving data:', data);
  };

  const toggleTask = (taskId: number) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} modal>
      <DialogContent className="max-w-[90vw] h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            Resource Allocation
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage resource allocation for {projectIdentifier}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTitle>
          <DialogDescription>
            Allocate resources to tasks and manage their time distribution
          </DialogDescription>
          <Separator className="mt-4" />
        </DialogHeader>

        <ScrollArea className="px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
              <ResourceTable
                resourceDataWithAllocation={resourceDataWithAllocation}
                userMaps={userMaps}
                monthsRange={monthsRange}
              />
            </form>
          </Form>
        </ScrollArea>

        <div className="p-6 flex justify-end gap-2 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={form.handleSubmit(handleSave)}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceModal;