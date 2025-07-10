"use client";
import React, { useState, useEffect, useTransition } from "react";
import { Form } from "@/shadcn/ui/form";
import {Dialog,DialogContent,DialogFooter,DialogHeader,DialogTitle} from "@/shadcn/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { useRouter } from "next/navigation";
import { OfficeDetailsSchema } from "../office-details-definition/officeDetailsSchema";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import FormInput from "@/ikon/components/form-fields/input";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { countryMap } from "@/app/(protected)/(apps)/sales-crm/deal/country_details";
import { TextButton } from "@/ikon/components/buttons";
import { invokeOfficeDetails } from "../invoke-office-detils";

interface EditOfficeDetailsProps {
  isOpen: boolean;
  onClose: () => void;
}

// interface AttachedSignature {
//   resourceId: string;
//   inputControl: string;
//   resourceName: string;
//   resourceSize: number;
//   resourceType: string;
// }

interface OfficeDetailsData {
  addressInfo: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    landmark: string;
    taxinfo: string;
    taxnumber: string;
    //attachedSig?: AttachedSignature;
  };
}

const OfficeDetailsModal: React.FC<EditOfficeDetailsProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [officeDetailsData, setOfficeDetails] = useState<OfficeDetailsData | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof OfficeDetailsSchema>>({
    resolver: zodResolver(OfficeDetailsSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      landmark: "",
      taxinfo: "",
      taxnumber: "",
      //attachedSig: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchOfficeDetails();
    }
  }, [isOpen]);

  const fetchOfficeDetails = async () => {
    try {
      const data = await getMyInstancesV2<any>({
        processName: "Address Information",
        predefinedFilters: { taskName: "View Address Info" },
      });

      if (data.length > 0) {
        setTaskId(data[0]?.taskId || null);
        const officeData = data[0]?.data?.addressInfo || {};
        setOfficeDetails({ addressInfo: officeData });

        form.reset({
          street: officeData.street || "",
          city: officeData.city || "",
          state: officeData.state || "",
          postalCode: officeData.postalCode || "",
          country: officeData.country || "",
          landmark: officeData.landmark || "",
          taxinfo: officeData.taxinfo || "",
          taxnumber: officeData.taxnumber || "",
          //attachedSig: officeData.attachedSig || undefined,
        });
      } else {
        setOfficeDetails(null);
        form.reset({
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          landmark: "",
          taxinfo: "",
          taxnumber: "",
          //attachedSig: undefined,
        });
      }
    } catch (error) {
      console.error("Error fetching office details:", error);
    }
  };

  const handleOnSubmit = async (data: z.infer<typeof OfficeDetailsSchema>) => {
    const updatedOfficeDetails: OfficeDetailsData = {
      addressInfo: {
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        landmark: data.landmark,
        taxinfo: data.taxinfo,
        taxnumber: data.taxnumber,
        //attachedSig: officeDetailsData?.addressInfo.attachedSig || undefined,
      },
    };

    console.log("Updated Office Details:", updatedOfficeDetails);
    await invokeOfficeDetails(updatedOfficeDetails, taskId);

    onClose();
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Office Details</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <h3>Office Address Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <FormTextarea
                formControl={form.control}
                name="street"
                placeholder="Enter Street"
                label="Street*"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormInput formControl={form.control} name="city" placeholder="Enter City" label="City*" />
              <FormInput formControl={form.control} name="state" placeholder="Enter State/Province" label="State/Province" />
              <FormInput formControl={form.control} name="postalCode" placeholder="Enter Zip/Postal Code" label="Zip/Postal Code*" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormComboboxInput
                items={countryMap}
                formControl={form.control}
                name="country"
                placeholder="Choose Country"
                label="Country*"
              />
              <FormInput formControl={form.control} name="landmark" placeholder="Enter Landmark" label="Landmark*" />
            </div>

            <h3 className="mt-2">Tax Information</h3>
            <div className="grid grid-cols-2 gap-4">
            <FormComboboxInput items={[{ label: "TRN", value: "TRN" }, { label: "GST", value: "GST" }]} formControl={form.control} name={"taxinfo"} placeholder={"Choose Tax Information"} label="Tax Information"/>
              {form.watch("taxinfo") === "TRN" && (
                <FormInput formControl={form.control} name="taxnumber" placeholder="Enter Temporary Reference Number (TRN)" label="Temporary Reference Number (TRN)" />
              )}
              {form.watch("taxinfo") === "GST" && (
                <FormInput formControl={form.control} name="taxnumber" placeholder="Enter Goods & Services Tax (GST)" label="Goods & Services Tax (GST)" />
              )}
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

export default OfficeDetailsModal;
