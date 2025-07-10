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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { TeamDetailsSchema } from "../edit_team_form_component/editTeamFormSchema";
import { ediTeamSubmit } from "../invoke_team_details";
import { useRouter } from "next/navigation";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";
import { TextButton } from "@/ikon/components/buttons";
import { getAccountManagerDetails } from "@/app/(protected)/(apps)/sales-crm/components/account-manager";

interface EditTeamDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  leadIdentifier?: string;
}

interface OptionType {
  value: string;
  label: string;
}
const manualOptions = [
  { value: "Anushri Dutta", label: "Anushri Dutta" },
  { value: "Prity Karmakar", label: "Prity Karmakar" },
];

const EditTeamDetailsModal: React.FC<EditTeamDetailsProps> = ({
  isOpen,
  onClose,
  leadIdentifier,
}) => {
  const [teamData, setTeamData] = useState<any>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [salesTeam, setSalesTeam] = useState<OptionType[]>([]);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [accountManagerMap, setAccountManagerMap] = useState<any[]>([]);

  useEffect(() => {
    const fetchAccountManagers = async () => {
      let managers: any = await getAccountManagerDetails();
      type ManagerDetails = {
        userId: string;
        userName: string;
        userActive: boolean;
      };

      const activeUsersPMGrp = Object.values(
        managers as Record<string, ManagerDetails>
      )
        .filter((managerDetails) => managerDetails.userActive)
        .map((activeManagerDetails) => ({
          value: activeManagerDetails.userId,
          label: activeManagerDetails.userName,
        }));
      console.log("accountManagerMap ", activeUsersPMGrp);
      setAccountManagerMap(activeUsersPMGrp);
    };

    if (isOpen) {
      fetchAccountManagers();
    }
  }, [isOpen]);
  const form = useForm<z.infer<typeof TeamDetailsSchema>>({
    resolver: zodResolver(TeamDetailsSchema),
    defaultValues: {
      salesManager: "",
      salesTeam: [],
    },
  });

  const fetchTeamData = async () => {
    const data = await getMyInstancesV2({
      processName: "Leads Pipeline",
      predefinedFilters: { taskName: "Team" },
      mongoWhereClause: `this.Data.leadIdentifier == "${leadIdentifier}"`,
      projections: ["Data"],
    });
    setTaskId(data[0]?.taskId || "");
    const teamInfo = data && (data[0]?.data?.teamInformation || {});
    setTeamData(teamInfo);

    form.reset({
      salesManager: teamInfo.salesManager || "",
      salesTeam: teamInfo.salesteam || [],
    });
  };

  useEffect(() => {
    if (leadIdentifier) {
      fetchTeamData();
    }
  }, [leadIdentifier]);

  async function handleOnSubmit(data: z.infer<typeof TeamDetailsSchema>) {
    const teamInformation = {
      salesManager: data.salesManager,
      salesteam: data.salesTeam || [],
    };
    console.log("Final Submitted Team Information:", teamInformation);
    ediTeamSubmit(teamInformation, taskId);

    onClose();
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="grid gap-4"
          >
            <div className="grid gap-1.5">
              <FormComboboxInput
                items={accountManagerMap}
                formControl={form.control}
                name={"salesManager"}
                label="Sales Team Manager"
                placeholder={"Choose Sales Manager"}
              />
            </div>
            <div className="grid gap-1.5">
              <FormMultiComboboxInput
                items={accountManagerMap}
                formControl={form.control}
                name={"salesTeam"}
                label="Sales Team Member"
                placeholder="Choose Team Member"
              />
            </div>

            <DialogFooter className="flex justify-end mt-4">
              {/* <Button type="submit" variant="default">
                Submit
              </Button> */}
              <TextButton type="submit">Submit</TextButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeamDetailsModal;
