"use client";
import React, { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { useRouter } from "next/navigation";
import FormInput from "@/ikon/components/form-fields/input";
import { Form } from "@/shadcn/ui/form";
import { TextButton } from "@/ikon/components/buttons";
import { WorkingDaysSchema } from "../working-days-definition/workingDaysSchema";
import MonthTable from "./monthTableForModal";
import { invokeWorkingDays } from "../invoke-working-days";

interface EditBankProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId?: string | null | undefined;
}

const WorkingDaysModal: React.FC<EditBankProps> = ({
  isOpen,
  onClose,
  selectedId,
}) => {
  const [existingData, setExistingData] = useState<Record<string, any>>({});
  const router = useRouter();
  const [isPending, invokeTransition] = useTransition();
  const [taskId, setTaskId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof WorkingDaysSchema>>({
    resolver: zodResolver(WorkingDaysSchema),
    defaultValues: { year: "" },
  });

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    const Insdata = await getMyInstancesV2<any>({
      processName: "Working Days",
      predefinedFilters: { taskName: "View State" },
    });
    const data = Insdata[0]?.data?.workingDaysDetails || {};
    setExistingData(data);
    setTaskId(data[0]?.taskId || null);
    if (selectedId && data[selectedId]) {
      form.setValue("year", selectedId);
    }
  };

  const handleYearChange = (year: string) => {
    if (existingData[year]) {
      alert("Year already exists! Please choose a different year.");
      form.setValue("year", "");
    }
  };

  const [workingDaysDetails, setWorkingDaysDetails] = useState<
    Record<string, any>
  >({});

  const handleOnSubmit = async (data: z.infer<typeof WorkingDaysSchema>) => {
    if (existingData[data.year]) {
      alert("Year already exists! Cannot add duplicate year.");
      return;
    }

    const updatedData = {
      ...existingData,
      [data.year]: workingDaysDetails,
    };

    console.log("Saving Data:", updatedData);
    //await invokeWorkingDays(updatedData, taskId);
    setExistingData(updatedData);
    onClose();
    invokeTransition(() => {
      router.refresh();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-5xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Working Days</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)} className="flex flex-col gap-3 h-full overflow-hidden">
            <div className="grow flex flex-col gap-3 overflow-auto">
              <FormInput
                formControl={form.control}
                name={"year"}
                placeholder="Enter Year"
                label="Year*"
                onBlur={(e) => handleYearChange(e.target.value)}
              />
              <MonthTable
                year={form.watch("year")}
                workingDaysDetails={workingDaysDetails}
                onUpdate={setWorkingDaysDetails}
              />
            </div>
            <DialogFooter className="flex justify-end mt-4">
              <TextButton type="submit">Submit</TextButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkingDaysModal;
