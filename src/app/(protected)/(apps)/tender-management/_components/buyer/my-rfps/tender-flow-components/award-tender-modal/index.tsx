import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Label } from "@/shadcn/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shadcn/ui/select";
import { getBidById } from "@/app/(protected)/(apps)/tender-management/_utils/buyer/my-rfps/rfp-details-page/get-bid-list";
import { toast } from "sonner";
import { editAwardData } from "@/app/(protected)/(apps)/tender-management/_utils/buyer/my-rfps/edit-award-data";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getFullAccountTree } from "@/ikon/utils/api/accountService";

// Zod Schema (All fields optional for partial save)
const schema = z.object({
  supplierName: z.string().optional(),
  contractRefId: z.string().optional(),
  awardDate: z.string().optional(),
  totalContractValue: z.string().optional(),
  keyDeliverables: z.string().optional(),
  performanceBond: z.string().optional(),
  approvalNotes: z.string().optional(),
  attachments: z.any().optional(),
  status: z.enum(["Awarded", "Canceled"]).optional(),
});

type FormDataSchema = z.infer<typeof schema>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  bidId: string | null;
}

export default function AwardTenderModal({
  isOpen,
  onClose,
  bidId,
}: ModalProps) {
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      supplierName: "Pre-filled Supplier", // Example pre-filled value
      contractRefId: "",
      awardDate: "",
      totalContractValue: "",
      keyDeliverables: "",
      performanceBond: "",
      approvalNotes: "",
      attachments: null,
      status: "Awarded",
    },
  });

  // Watch all form values
  const formData = watch();

  // Check if all fields are filled
  const isComplete = Object.values(formData).every(
    (value) => value !== "" && value !== undefined
  );

  const handleSave = handleSubmit(async (data) => {
    console.log("Saved Data:", { ...data, tenderAwardedFlag: isComplete });

    try {
      await editAwardData(bidId, {
        ...data,
        tenderAwardedFlag: isComplete,
      });
      toast.success("Details saved");
    } catch (error) {
      toast.error("Failed to edit data");
    }
  });

  useEffect(
    () => {
      const fetchData = async () => {
        if (bidId && isOpen) {
          //setIsLoading(true);
          try {
            const formData: any = await getBidById(bidId);

            console.log("Form Data:", formData);
            const acceptedOffer = formData.offers.filter((item: any) => {
              if (item.status == "Accepted") {
                return item;
              }
            });
            const accountList = await getFullAccountTree();
            console.log("---------------------------------->", accountList);
            //console.log(userGroupDetails);

            const data = accountList.children.filter(
              (account: any) => account.ACCOUNT_ID === formData.accountId
            );
            const accountName = data[0].ACCOUNT_NAME;

            console.log("Accepted Offer:", acceptedOffer);
            // Populate form fields with fetched data
            setValue("totalContractValue", acceptedOffer[0].amount);
            setValue("supplierName", accountName);
            // Populate form fields with fetched data
            Object.entries(formData).forEach(([key, value]) =>
              setValue(key as keyof FormDataSchema, value)
            );
          } catch (error) {
            console.error("Error fetching draft data:", error);
          } finally {
            //setIsLoading(false);
          }
        } else {
          // Reset form when dialog opens without a draft ID
          reset();
        }
      };

      fetchData();
    },
    [
      /*draftId, isOpen, setValue, reset*/
    ]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Awarded Tender</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4">
          {/* First Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Supplier Name</Label>
              <Input {...register("supplierName")} />
            </div>
            <div>
              <Label>Final Contract Reference ID</Label>
              <Input {...register("contractRefId")} />
            </div>
            <div>
              <Label>Award Date</Label>
              <Input type="date" {...register("awardDate")} />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Total Contract Value</Label>
              <Input {...register("totalContractValue")} />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                onValueChange={(value) => setValue("status", value)}
                defaultValue="Awarded"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Awarded">Awarded</SelectItem>
                  <SelectItem value="Canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Text Areas */}
          <div>
            <Label>Key Deliverables</Label>
            <Textarea {...register("keyDeliverables")} />
          </div>

          <div>
            <Label>Performance Bond (If Any)</Label>
            <Textarea {...register("performanceBond")} />
          </div>

          <div>
            <Label>Approval Notes</Label>
            <Textarea {...register("approvalNotes")} />
          </div>

          {/* File Upload */}
          <div>
            <Label>Attachments (Final Signed Contract)</Label>
            <Input type="file" {...register("attachments")} />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
