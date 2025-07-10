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
import { RoleSchema } from "../edit-role-form-component/editRoleFormSchema";
import { editRoleSubmit } from "../invoke_role_details";
import { useRouter } from "next/navigation";

interface EditTeamDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId?: string | null | undefined;
}

const EditRoleModal: React.FC<EditTeamDetailsProps> = ({
  isOpen,
  onClose,
  selectedId,
}) => {
  const [roleData, setRoleData] = useState<any>(null);
  const [roleTitle, setRoleTitle] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof RoleSchema>>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      roleTitle: "",
    },
  });

  const fetchRoleData = async (selectedId: string) => {
    const data = await getMyInstancesV2({
      processName: "HRMS - Roles",
      predefinedFilters: { taskName: "Edit" },
      projections: ["Data"],
    });
    setTaskId(data[0]?.taskId || "");
    const roleData = data && (data[0]?.data || {});
    setRoleData(roleData);
    setRoleTitle(roleData?.[selectedId]?.roleTitle || "");

    if (roleData) {
      form.reset({
        roleTitle: roleData?.[selectedId]?.roleTitle || "",
      });
    }
  };

  useEffect(() => {
    if (selectedId && selectedId.trim() !== "") {
      fetchRoleData(selectedId);
    }
  }, [selectedId]);

  async function handleOnSubmit(data: z.infer<typeof RoleSchema>) {
    if (selectedId && selectedId.trim() !== "") {
      roleData[selectedId] = {
        roleTitle: data.roleTitle,
      };
      await editRoleSubmit(roleData, taskId);
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
          <DialogTitle>Edit Organization</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="roleTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="roleTitle"
                      placeholder="Enter Role Title"
                      className={
                        form.formState.errors.roleTitle ? "border-red-500" : ""
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

export default EditRoleModal;
