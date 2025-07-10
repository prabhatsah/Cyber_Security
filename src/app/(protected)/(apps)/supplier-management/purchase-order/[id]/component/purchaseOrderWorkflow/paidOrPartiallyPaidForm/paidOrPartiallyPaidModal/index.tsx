"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Form } from "@/shadcn/ui/form";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormInput from "@/ikon/components/form-fields/input";
import { useEffect } from "react";

const paymentFormSchema = z.object({
  paymentStatus: z.enum(["Paid", "Partially Paid"]),
  paymentMode: z.string().min(1, "Payment mode is required"),
  amountPaid: z.string().min(1, "Amount is required"),
  accountNickname: z.string().min(1, "Account nickname is required"),
  paymentDate: z.string().min(1, "Payment date is required"),
  dueDate: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
}

export function PaymentForm({ isOpen, onClose, data }: PaymentFormProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentStatus: "Paid",
      paymentMode: "Online",
      amountPaid: "",
      accountNickname: "Keross AED",
      paymentDate: format(new Date(), "yyyy-MM-dd"),
      dueDate: "",
    },
  });

  const paymentStatus = useWatch({
    control: form.control,
    name: "paymentStatus",
  });

  useEffect(() => {
    if (paymentStatus === "Paid" && data) {
      const amount = data?.POWithoughtItem
        ? data?.finalAmountWithoughtItem
        : data?.finalAmount;

      form.setValue("amountPaid", amount?.toString());
    }
  }, [paymentStatus, data, form]);

  const onSubmit = async (data: PaymentFormValues) => {
    console.log("payment form data ", data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Payment Form</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormComboboxInput
              items={[
                { value: "Paid", label: "Paid" },
                { value: "Partially Paid", label: "Partially Paid" },
              ]}
              formControl={form.control}
              name="paymentStatus"
              placeholder="Select status"
              label="Payment Status *"
            />

            <FormComboboxInput
              items={[
                { value: "Online", label: "Online" },
                { value: "POD", label: "POD" },
                { value: "Checq", label: "Checq" },
              ]}
              formControl={form.control}
              name="paymentMode"
              placeholder="Select mode"
              label="Payment Mode *"
            />

            {paymentStatus === "Partially Paid" && (
              <FormInput
                formControl={form.control}
                name="dueDate"
                type="date"
                label="Due Date *"
              />
            )}

            <FormInput
              formControl={form.control}
              name="amountPaid"
              type="number"
              label="Amount Paid *"
              placeholder="Enter amount"
              readOnly={paymentStatus === "Paid"}
            />

           
            <FormComboboxInput
              items={[
                { value: "Keross AED", label: "Keross AED" },
                { value: "Keross R&D INR", label: "Keross R&D INR" },
                { value: "Keross R&D Axis", label: "Keross R&D Axis" },
                { value: "KEROSS USD", label: "KEROSS USD" },
              ]}
              formControl={form.control}
              name="accountNickname"
              placeholder="Select Account Nickname"
              label="Account Nickname *"
            />

            <FormInput
              formControl={form.control}
              name="paymentDate"
              type="date"
              label="Payment Date *"
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
