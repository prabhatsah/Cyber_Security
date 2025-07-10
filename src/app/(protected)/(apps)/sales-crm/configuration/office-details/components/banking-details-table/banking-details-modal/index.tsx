"use client";
import React, { useState, useEffect, useTransition } from "react";
import {Dialog,DialogContent,DialogFooter,DialogHeader,DialogTitle} from "@/shadcn/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 } from "uuid";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { useRouter } from "next/navigation";
import FormInput from "@/ikon/components/form-fields/input";
import { Form } from "@/shadcn/ui/form";
import { TextButton } from "@/ikon/components/buttons";
import { BankingDetailsSchema } from "../banking-details-definition/bankingDetailsSchema";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { Label } from "@/shadcn/ui/label";

interface BankInstanceData {
    bankDetails: {
    [key: string]: {
        Bank_Name: string;
        Branch_Name: string;
        Account_Name: string;
        AED_Number: string;
        IBAN_Code: string;
        Account_Nickname: string;
        //Default_Bank: boolean;
    };
  };
}

interface EditBankProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId?: string | null | undefined;
}

const BankingDetailsModal: React.FC<EditBankProps> = ({ isOpen, onClose, selectedId }) => {
  const [bankDetails, setBankDetails] = useState<BankInstanceData>({
    bankDetails: {},
  });
  const [taskId, setTaskId] = useState<string | null>(null);
  const router = useRouter();
  const [isPending, invokeTransition] = useTransition();

  const form = useForm<z.infer<typeof BankingDetailsSchema>>({
    resolver: zodResolver(BankingDetailsSchema),
    defaultValues: { Bank_Name: "", Branch_Name: "", AED_Number: "", Account_Name: "", IBAN_Code: "", Account_Nickname: "",} //Default_Bank: false },
  });

  const fetchBankData = async () => {
    const data = await getMyInstancesV2({
      processName: "Banking Details",
      predefinedFilters: { taskName: "View Bank Details" },
    });
    console.log("Fetched Data:", data);
    setTaskId(data[0]?.taskId || "");
    const BankInstanceData = data && (data[0]?.data || { bankDetails: {} });
    setBankDetails(BankInstanceData as BankInstanceData);

    if (selectedId && selectedId.trim() !== "") {
      form.reset({
        Bank_Name:(BankInstanceData as BankInstanceData).bankDetails?.[selectedId]?.Bank_Name || "",
        Branch_Name:(BankInstanceData as BankInstanceData).bankDetails?.[selectedId]?.Branch_Name || "",
        AED_Number:(BankInstanceData as BankInstanceData).bankDetails?.[selectedId]?.AED_Number || "",
        Account_Name:(BankInstanceData as BankInstanceData).bankDetails?.[selectedId]?.Account_Name || "",
        IBAN_Code:(BankInstanceData as BankInstanceData).bankDetails?.[selectedId]?.IBAN_Code || "",
        Account_Nickname:(BankInstanceData as BankInstanceData).bankDetails?.[selectedId]?.Account_Nickname || "",
        //Default_Bank:(BankInstanceData as BankInstanceData).bankDetails?.[selectedId]?.Default_Bank || false,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
        fetchBankData();
    }
  }, [isOpen]);

  async function handleOnSubmit(data: z.infer<typeof BankingDetailsSchema>) {
    if (bankDetails) {
      const updatedBankDataObj = { ...bankDetails.bankDetails };

      if (selectedId && selectedId.trim() !== "") {
        // Edit existing license
        updatedBankDataObj[selectedId] = {
            Bank_Name: data.Bank_Name,
            Branch_Name: data.Branch_Name,
            Account_Name: data.Account_Name,
            AED_Number: data.AED_Number,
            IBAN_Code: data.IBAN_Code,
            Account_Nickname: data.Account_Nickname,
            //Default_Bank: data.Default_Bank,
        };
      } else {
        // Add new license
        const newId = v4();
        updatedBankDataObj[newId] = {
            Bank_Name: data.Bank_Name,
            Branch_Name: data.Branch_Name,
            Account_Name: data.Account_Name,
            AED_Number: data.AED_Number,
            IBAN_Code: data.IBAN_Code,
            Account_Nickname: data.Account_Nickname,
            //Default_Bank: data.Default_Bank,
        };
      }

      const updatedBankData: BankInstanceData = {
        ...bankDetails,
        bankDetails: updatedBankDataObj,
      };

      console.log("Updated Bank Data:", updatedBankData);
      await invokeBankDetails(updatedLicenseData, taskId);
    }
    onClose();
    invokeTransition(() => {
      router.refresh();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{selectedId ? "Edit Bank Details" : "Add Bank Details"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <div className="grid grid-cols-3 gap-4">
              <FormInput formControl={form.control} name={"Bank_Name"} placeholder="Enter Bank Name" label="Bank Name*"/>
              <FormInput formControl={form.control} name={"Branch_Name"} placeholder="Enter Branch Name"label="Branch Name*"/>
              <FormInput formControl={form.control} name={"AED_Number"} placeholder="Enter Account Number"label="Account Number*"/>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <FormInput formControl={form.control} name={"Account_Name"} placeholder="Enter Account Name" label="Account Name*"/>
              <FormInput formControl={form.control} name={"IBAN_Code"} placeholder="Enter IBAN Code"label="IBAN Code*"/>
              <FormInput formControl={form.control} name={"Account_Nickname"} placeholder="Enter Account Nickname"label="A/C Nickname*"/>
              <div className="flex items-center space-x-2 mt-8">
                <Checkbox name="Default_Bank"/>
                <Label htmlFor="default">Default</Label>
             </div>
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

export default BankingDetailsModal;
