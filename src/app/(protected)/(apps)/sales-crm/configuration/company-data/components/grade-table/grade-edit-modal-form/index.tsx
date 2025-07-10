"use client";
import React, { useState, useEffect, useTransition } from "react";
import { Button } from "@/shadcn/ui/button";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { Input } from "@/shadcn/ui/input";
import { GradeSchema } from "../edit-grade-form-component/editGradeFormSchema";
import { editGradeSubmit } from "../invoke-grade-details";
import { useRouter } from "next/navigation";

interface EditGradeProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId?: string | null;
}

const EditGradeModal: React.FC<EditGradeProps> = ({
  isOpen,
  onClose,
  selectedId,
}) => {
  const [gradeData, setGradeData] = useState<any>(null);
  const [grade, setGrade] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof GradeSchema>>({
    resolver: zodResolver(GradeSchema),
    defaultValues: {
      grade: "",
    },
  });

  // Fetch Grade Information
  const fetchGradeData = async (selectedId: string) => {
    const data = await getMyInstancesV2({
      processName: "Grade",
      predefinedFilters: { taskName: "Edit State" },
      projections: ["Data"],
    });
    setTaskId(data[0]?.taskId || "");
    const gradeData = data && (data[0]?.data?.gradeDetails || {});

    setGradeData(gradeData);
    console.log("Grade Data 1...", gradeData);
    let grade = gradeData?.[selectedId]?.grade;

    if (grade?.startsWith("G ")) {
      grade = grade.replace("G ", "");
    }
    console.log("Grade Data 2...", grade);
    setGrade(grade);

    if (gradeData) {
      form.reset({
        grade: grade || "",
      });
    }
  };

  useEffect(() => {
    if (selectedId && selectedId.trim() !== "") {
      fetchGradeData(selectedId);
    }
  }, [selectedId]);

  async function handleOnSubmit(data: z.infer<typeof GradeSchema>) {
    if (selectedId && selectedId.trim() !== "") {
      gradeData[selectedId] = {
        id: selectedId,
        grade: `G ${data.grade}`,
      };
      await editGradeSubmit(gradeData, taskId);
    }
    onClose();
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Grade</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="grade"
                      placeholder="Enter Grade"
                      className={
                        form.formState.errors.grade ? "border-red-500" : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end mt-4">
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGradeModal;
