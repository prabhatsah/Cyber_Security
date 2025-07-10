"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shadcn/ui/dialog";
//import { TextButton } from "@/shadcn/ui/button";
import { useForm } from "react-hook-form";
import * as React from 'react';
import { Spreadsheet } from '@progress/kendo-react-spreadsheet';
// @ts-expect-error
import { sheets } from './shared-sp-sheets.ts';
import { TextButton } from "@/ikon/components/buttons";
//import Spreadsheet from "react-spreadsheet";

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  productIdentifier: string;
  resourceDataWithAllocation: any;
}

const ResourceModal: React.FC<ResourceModalProps> = ({
  isOpen,
  onClose,
  productIdentifier,
  resourceDataWithAllocation,
}) => {
  const form = useForm();

  const columnLabels = ["Task Name", "Staff", "Grade", "Role", "Total FTE"];
  const resourceData: { value: string; readonly?: boolean }[][] = [];
  for (let i = 0; i < resourceDataWithAllocation.length; i++) {
    resourceData.push([
      { value: resourceDataWithAllocation[i].taskName },
      { value: resourceDataWithAllocation[i].employeeName },
      { value: resourceDataWithAllocation[i].gradeId },
      { value: resourceDataWithAllocation[i].role },
      { value: "0", readonly: true },
    ]);
    for (let key in resourceDataWithAllocation[i].allocation) {
      //  resourceData[i].push({value : resourceDataWithAllocation[i].allocation[key]});
      if (columnLabels.indexOf(key) === -1) {
        columnLabels.push(key);
      }
    }
  }
  for (let i = 0; i < resourceData.length; i++) {
    for (let j = 5; j < columnLabels.length; j++) {
      resourceData[i].push({
        value: resourceDataWithAllocation[i].allocation[columnLabels[j]]
          ? resourceDataWithAllocation[i].allocation[columnLabels[j]]
          : 0,
      });
    }
  }
  // const rowLabels = ["Item 1", "Item 2"];

  //   const resourceData: { value: string }[][] = [[{ value: "Task Name" }, { value: "Staff" }, { value: "Grade"}, { value: "Role"}, { value : "Total FTE"}]];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-max" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Resource</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {})}
            className="grid grid-cols-1 gap-3"
          >
            {/* <Spreadsheet className="max-w-max" data={data} /> */}
            {/* <Spreadsheet data={resourceData} columnLabels={columnLabels} /> */}
          </form>
        </Form>   
            
                <DialogFooter>
                    <TextButton>Save</TextButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ResourceModal;
