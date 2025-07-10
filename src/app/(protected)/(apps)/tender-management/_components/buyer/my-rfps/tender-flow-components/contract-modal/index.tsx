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
import { toast } from "sonner";
import { editContractData } from "@/app/(protected)/(apps)/tender-management/_utils/buyer/my-rfps/edit-contract-data";
import { getBidById } from "@/app/(protected)/(apps)/tender-management/_utils/buyer/my-rfps/rfp-details-page/get-bid-list";

// Zod Schema (All fields optional for partial save)
const schema = z.object({
  finalAgreedPrice: z.string().optional(),
  finalDeliveryDate: z.string().optional(),
  finalPaymentTerms: z.string().optional(),
  contractStartDate: z.string().optional(),
  contractEndDate: z.string().optional(),
  penaltyClauses: z.string().optional(),
  warranties: z.string().optional(),
  additionalNotes: z.string().optional(),
  attachments: z.any().optional(),
  approvalStatus: z.enum(["Pending", "Approved", "Rejected"]).optional(),
});
type FormDataSchema = z.infer<typeof schema>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  bidId: string | null;
}
export default function ContractModal({ isOpen, onClose, bidId }: ModalProps) {
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      finalAgreedPrice: "",
      finalDeliveryDate: "",
      finalPaymentTerms: "",
      contractStartDate: "",
      contractEndDate: "",
      penaltyClauses: "",
      warranties: "",
      additionalNotes: "",
      attachments: null,
      approvalStatus: "Pending",
    },
  });

  // Watch all form values
  const formData = watch();

  // Check if all fields are filled
  const isComplete = Object.values(formData).every(
    (value) => value !== "" && value !== undefined
  );

  const handleSave = handleSubmit(async (data) => {
    console.log("Saved Data:", { ...data, contractFinalizedFlag: isComplete });
    try {
      await editContractData(bidId, {
        ...data,
        contractFinalizedFlag: isComplete,
      });
      toast.success("Details saved")
      onClose();
    } catch (error) {
      toast.error('Failed to edit data')
    }
  });

  useEffect(
    () => {
      const fetchData = async () => {
        if (bidId && isOpen) {
          //setIsLoading(true);
          try {
            const formData: any = await getBidById(bidId);

            console.log("Fetched Data:", formData);

            const acceptedOffer = formData.offers.filter((item: any) => {
              if (item.status == "Accepted") {
                return item;
              }
            });
            console.log("Accepted Offer:", acceptedOffer);
            // Populate form fields with fetched data
            setValue("finalAgreedPrice", acceptedOffer[0].amount);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contract Finalization</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4">
          {/* First Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Final Agreed Price</Label>
              <Input {...register("finalAgreedPrice")} />
            </div>
            <div>
              <Label>Final Delivery Date</Label>
              <Input type="date" {...register("finalDeliveryDate")} />
            </div>
            <div>
              <Label>Final Payment Terms</Label>
              <Input {...register("finalPaymentTerms")} />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Contract Start Date</Label>
              <Input type="date" {...register("contractStartDate")} />
            </div>
            <div>
              <Label>Contract End Date</Label>
              <Input type="date" {...register("contractEndDate")} />
            </div>
            <div>
              <Label>Approval Status</Label>
              <Select
                onValueChange={(value) => setValue("approvalStatus", value)}
                defaultValue="Pending"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Text Areas */}
          <div>
            <Label>Penalty Clauses</Label>
            <Textarea {...register("penaltyClauses")} />
          </div>

          <div>
            <Label>Warranties & Guarantees</Label>
            <Textarea {...register("warranties")} />
          </div>

          <div>
            <Label>Additional Notes</Label>
            <Textarea {...register("additionalNotes")} />
          </div>

          {/* File Upload */}
          <div>
            <Label>Attachments (Final Contract Document)</Label>
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
