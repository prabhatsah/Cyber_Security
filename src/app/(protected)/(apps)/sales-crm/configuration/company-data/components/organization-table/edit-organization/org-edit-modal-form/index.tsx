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

import { ediOrgSubmit } from "../invoke_org_details";
import { OrgDetailsSchema } from "../edit-org-form-component/editOrgFormSchema";
import { Input } from "@/shadcn/ui/input";
import { useRouter } from "next/navigation";

interface EditTeamDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId?: string | null | undefined;
}

const EditOrgDetailsModal: React.FC<EditTeamDetailsProps> = ({
  isOpen,
  onClose,
  selectedId,
}) => {
  const [orgData, setOrgData] = useState<any>(null);
  const [name, setname] = useState<string | null>(null);
  const [orgRegion, setOrgRegion] = useState<string | null>(null);
  const [orgWorkigHours, setOrgWorkigHours] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof OrgDetailsSchema>>({
    resolver: zodResolver(OrgDetailsSchema),
    defaultValues: {
      name: "",
      region: "",
      workingHours: "",
    },
  });

  // Fetch Organization Information
  const fetchOrgData = async (selectedId: string) => {
    const data = await getMyInstancesV2({
      processName: "HRMS - Organization",
      predefinedFilters: { taskName: "Edit" },
      projections: ["Data"],
    });
    setTaskId(data[0]?.taskId || "");
    const orgData = data && (data[0]?.data || {});
    setOrgData(orgData);
    setname(orgData?.[selectedId]?.name || "");
    setOrgRegion(orgData?.[selectedId]?.region || "");
    setOrgWorkigHours(orgData?.[selectedId]?.workingHours || "");

    if (orgData) {
      form.reset({
        name: orgData?.[selectedId]?.name || "",
        region: orgData?.[selectedId]?.region || "",
        workingHours: orgData?.[selectedId]?.workingHours || "",
      });
    }
  };

  useEffect(() => {
    if (selectedId && selectedId.trim() !== "") {
      fetchOrgData(selectedId);
    }
  }, [selectedId]);

  async function handleOnSubmit(data: z.infer<typeof OrgDetailsSchema>) {
    if (selectedId && selectedId.trim() !== "") {
      orgData[selectedId] = {
        name: data.name,
        region: data.region,
        workingHours: data.workingHours,
      };
      await ediOrgSubmit(orgData, taskId);
    } 

    onClose();
    startTransition(() => {
      router.refresh();
    });
  }

  const manualOptions = [
    { value: "Anushri Dutta", label: "Anushri Dutta" },
    { value: "Prity Karmakar", label: "Prity Karmakar" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Organization</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organozation Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      placeholder="Enter Organization Name"
                      className={
                        form.formState.errors.name ? "border-red-500" : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Region</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="region"
                      placeholder="Enter Region"
                      className={
                        form.formState.errors.region ? "border-red-500" : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workingHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>working Hours</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="workingHours"
                      placeholder="Enter Working hours"
                      className={
                        form.formState.errors.workingHours
                          ? "border-red-500"
                          : ""
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

export default EditOrgDetailsModal;
