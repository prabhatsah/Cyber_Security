"use client";
import { Button } from "@/shadcn/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

import { Label } from "@/shadcn/ui/label";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { format } from "date-fns";
import { editDealSchema } from "../edit_deal_schema";
import { EditDealType } from "../edit_deal_data_type";
//import router, { useRouter } from "next/router";
import { editDealSubmit } from "../invoke_deal";
import FormInput from "@/ikon/components/form-fields/input";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import FormDateInput from "@/ikon/components/form-fields/date-input";
import { TextButton } from "@/ikon/components/buttons";

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealIdentifier?: string;
}

const EditDealModal: React.FC<DealModalProps> = ({
  isOpen,
  onClose,
  dealIdentifier,
}) => {
  console.log("enter CreateDealModalForm");
  const [isRevenue, setIsRevenue] = useState(false);
  const [dealNo, setDealNo] = useState("");
  const [dealData, setDealData] = useState<any>(null);
  const [taskId, setTaskId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  // const router = useRouter();
  //   const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (dealIdentifier) {
      (async () => {
        const dealData = await getMyInstancesV2<EditDealType[]>({
          processName: "Deal",
          predefinedFilters: { taskName: "Edit State" },
          mongoWhereClause: `this.Data.dealIdentifier == "${dealIdentifier}"`,
        });
        console.log("Deal data ", dealData);
        setDealData(dealData[0]?.data || {});
        setTaskId(dealData[0]?.taskId);
        setIsRevenue(dealData[0]?.data?.isDebtRevenue || false);
      })();
    }
  }, [dealIdentifier]);

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    form.setValue("dealStatus", value, { shouldValidate: true });

    if (value === "Suspended" || value === "Lost") {
      const today = new Date().toISOString().split("T")[0];
      const field = value === "Suspended" ? "suspendDate" : "lostDate";
      form.setValue("inActiveStatusDate", today, { shouldValidate: true });
    }
  };

  const handleRevenueChange = () => {
    setIsRevenue(!isRevenue);
  };

  useEffect(() => {
    if (dealData) {
      form.reset({ ...dealData });
    }
  }, [dealData]);

  const form = useForm<z.infer<typeof editDealSchema>>({
    resolver: zodResolver(editDealSchema),
    defaultValues: {
      dealNo: "",
      dealName: "",
      currency: "",
      expectedRevenue: "",
      dealStartDate: new Date(),
      isDebtRevenue: false,
      dealIdentifier: "",
      leadIdentifier: "",
      createdBy: "",
      updatedOn: "",
      contactDetails: {},
      dealStatus: "",
      remarkForDealLostOrSuspended: "",
      inActiveStatusDate: "",
      activeStatus: "",
    },
  });

  const handleOnSubmit = async (data: z.infer<typeof editDealSchema>) => {
    console.log("Form Data Submitted: ", data);

    data.activeStatus = data.dealStatus;

    const formattedDate = format(data.dealStartDate, "yyyy-MM-dd");
    console.log(formattedDate);

    const updatedDealData = {
      ...dealData,
      ...data,
      dealStartDate: formattedDate,
    };

    console.log("Fonal Data submit ", updatedDealData);

    await editDealSubmit(updatedDealData, taskId);

    onClose();

    // startTransition(() => {
    //   router.reload();
    // });
  };

  const onError = (errors: any) => {
    console.error("Form Submission Errors: ", errors);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Edit Deal</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit, onError)}
              id="deal-form"
            >
              <div className="grid grid-cols-3 gap-4 ">
                <div className="grid gap-1.5 mt-2">
                  <FormInput
                    formControl={form.control}
                    name={"dealNo"}
                    label="Deal No *"
                  />
                </div>

                <div className="grid gap-1.5 mt-2">
                  <FormInput
                    formControl={form.control}
                    name={"dealName"}
                    label="Deal Name *"
                    placeholder="Enter Deal Name"
                  />
                </div>

                <div className="grid gap-1.5 mt-2">
                  <FormComboboxInput
                    items={[
                      {
                        value: "USD",
                        label: "USD",
                      },
                      {
                        value: "GBP",
                        label: "GBP",
                      },
                      {
                        value: "INR",
                        label: "INR",
                      },
                      {
                        value: "QAR",
                        label: "QAR",
                      },
                      {
                        value: "SAR",
                        label: "SAR",
                      },
                      {
                        value: "AED",
                        label: "AED",
                      },
                    ]}
                    formControl={form.control}
                    name={"currency"}
                    label="Currency *"
                    placeholder={"Choose Currency"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 ">
                <div className="grid gap-1.5 mt-2">
                  <FormInput
                    formControl={form.control}
                    name={"expectedRevenue"}
                    label="Expected Revenue *"
                    placeholder="Enter Expected Revenue"
                  />
                </div>

                <div className="grid gap-1.5 mt-2">
                  <FormDateInput
                    name={"dealStartDate"}
                    formControl={form.control}
                    label="Expected Closing Date *"
                  />
                </div>

                <div className="grid gap-1.5">
                  <div className="flex items-center">
                    <Checkbox
                      id="revenue"
                      checked={isRevenue}
                      onCheckedChange={handleRevenueChange}
                    />
                    <label
                      htmlFor="revenue"
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Revenue in Debt
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 ">
                <div className="grid gap-1.5 mt-2">
                  <FormComboboxInput
                    items={[
                      {
                        value: "Open",
                        label: "Open",
                      },
                      {
                        value: "Suspended",
                        label: "Suspended",
                      },
                      {
                        value: "Lost",
                        label: "Lost",
                      },
                    ]}
                    formControl={form.control}
                    name={"dealStatus"}
                    label="Deal Status *"
                    placeholder={"Select Deal Status"}
                    onSelect={handleStatusChange}
                  />
                </div>

                {(selectedStatus === "Suspended" ||
                  selectedStatus === "Lost") && (
                  <div className="grid gap-1.5 mt-4">
                    <div className="">
                      <Label htmlFor="inActiveStatusDate">
                        {selectedStatus === "Suspended"
                          ? "Suspend Date"
                          : "Lost Date"}{" "}
                        <b className="text-danger">&nbsp;*</b>
                      </Label>
                      <FormField
                        control={form.control}
                        name="inActiveStatusDate"
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              type="date"
                              id="inActiveStatusDate"
                              {...field}
                              className={
                                form.formState.errors.inActiveStatusDate
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              {(selectedStatus === "Suspended" ||
                selectedStatus === "Lost") && (
                <div className="grid grid-cols-1 gap-4">
                  <FormTextarea
                    formControl={form.control}
                    name={"remarkForDealLostOrSuspended"}
                    placeholder={"Enter remarks here"}
                    label="Remarks"
                  />
                </div>
              )}
            </form>
          </Form>
        </div>
        <DialogFooter>
          {/* <Button type="submit" form="deal-form">
            Save
          </Button> */}
          <TextButton type="submit">Save</TextButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDealModal;
