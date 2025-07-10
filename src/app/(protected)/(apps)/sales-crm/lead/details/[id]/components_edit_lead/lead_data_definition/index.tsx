"use client";
import { Button } from "@/shadcn/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

import { editLeadSubmit } from "../invoke_lead";
import { LeadFormSchema } from "../edit_lead_form_component/editLeadFormSchema";
import { countryMap } from "../../../../country_details";
import { useRouter } from "next/navigation";
import FormInput from "@/ikon/components/form-fields/input";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { TextButton } from "@/ikon/components/buttons";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadIdentifier?: string;
}

interface FormData {
  organizationName: string;
  email: string;
  orgContactNo: string;
  noOfEmployees: number;
  website: string;
  city: string;
  state: string;
  postalCode: string;
  street: string;
  sector: string;
  source: string;
  country: string;
}

interface OptionType {
  value: string;
  label: string;
}

const EditLeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  leadIdentifier,
}) => {
  const [leadData, setLeadData] = useState<any>(null); // Store lead data
  const [taskId, setTaskId] = useState<OptionType | null>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
 
  const form = useForm<z.infer<typeof LeadFormSchema>>({
    resolver: zodResolver(LeadFormSchema),
    defaultValues: {
      organisationName: "",
      email: "",
      orgContactNo: "0",
      noOfEmployees: "",
      website: "",
      city: "",
      state: "",
      postalCode: "",
      street: "",
      sector: "",
      source: "",
      country: "",
    },
  });

  const fetchData = async () => {
    const data = await getMyInstancesV2({
      processName: "Leads Pipeline",
      predefinedFilters: { taskName: "Edit State" },
      mongoWhereClause: `this.Data.leadIdentifier == "${leadIdentifier}"`,
      projections: ["Data.organisationDetails"],
    });
    setLeadData(data[0]?.data?.organisationDetails || {});
    setTaskId(data[0]?.taskId);
  };

  useEffect(() => {
    if (leadIdentifier) {
      fetchData();
    }
  }, [leadIdentifier]);
  useEffect(() => {
    if (leadData) {
      form.reset({ ...leadData });
      // setSector({ value: leadData.sector, label: leadData.sector });
      // setSource({ value: leadData.source, label: leadData.source });
      // setCountry({value: leadData.country,label: leadData.country,});
    }
  }, [leadData]);

  async function handleOnSubmit(
    data: z.infer<typeof LeadFormSchema>
  ): Promise<void> {
    console.log("Form Data Submitted:", data);
    console.log("Form Data Task id:", taskId);
    editLeadSubmit(data, taskId);
    onClose();
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open: any) => open || onClose()} modal>
      <DialogContent
        className="max-w-5xl"
        onClick={(e: { stopPropagation: () => any }) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="grid gap-4"
          >
            <div className="grid col-span-2">
              <FormInput
                formControl={form.control}
                name={"organisationName"}
                placeholder="Enter organization name"
                label="Organization Name *"
              />
            </div>
            <div className="grid gap-1.5">
              <FormInput
                formControl={form.control}
                name={"email"}
                placeholder="Enter Email"
                label="Email"
              />
            </div>
            <div className="grid gap-1.5">
              <FormInput
                formControl={form.control}
                name={"orgContactNo"}
                placeholder="Enter Contact Number"
                label="Contact Number"
              />
            </div>
            <div className="grid gap-1.5">
              <FormInput
                formControl={form.control}
                name={"noOfEmployees"}
                placeholder="Enter Number of Employees"
                label="Number of Employees"
              />
            </div>
            <div className="grid gap-1.5">
              <FormComboboxInput
                items={[
                  {
                    value: "finance",
                    label: "Finance",
                  },
                  {
                    value: "technology",
                    label: "Technology",
                  },
                ]}
                formControl={form.control}
                name={"sector"}
                label="Sector"
                placeholder={"Choose sector"}
              />
            </div>
            <div className="grid gap-1.5">
              <FormComboboxInput
                items={[
                  {
                    value: "Online",
                    label: "Online",
                  },
                  {
                    value: "Referral",
                    label: "Referral",
                  },
                ]}
                formControl={form.control}
                name={"source"}
                label="Source"
                placeholder={"Choose source"}
              />
            </div>
            <div className="grid gap-1.5">
              <FormInput
                formControl={form.control}
                name={"website"}
                placeholder="Enter Website"
                label="Website"
              />
            </div>
            <h1>Address Information</h1>
            <div className="grid col-span-2 items-center">
              <FormInput
                formControl={form.control}
                name={"street"}
                placeholder="Enter Street"
                label="Street"
              />
            </div>
            <div className="grid gap-1.5">
              <FormInput
                formControl={form.control}
                name={"city"}
                placeholder="Enter City"
                label="City"
              />
            </div>
            <div className="grid gap-1.5">
              <FormInput
                formControl={form.control}
                name={"state"}
                placeholder="Enter State"
                label="State"
              />
            </div>
            <div className="grid gap-1.5">
              <FormInput
                formControl={form.control}
                name={"postalCode"}
                placeholder="Enter Pin Code"
                label="Pin Code"
              />
            </div>
            <div className="grid gap-1.5">
              <FormComboboxInput
                items={countryMap}
                formControl={form.control}
                name={"country"}
                label="Country"
                placeholder={"Choose Country"}
              />
            </div>
            <DialogFooter className="col-span-2 flex justify-end mt-4">
              {/* <Button type="submit" className="" variant="default">
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

export default EditLeadModal;
