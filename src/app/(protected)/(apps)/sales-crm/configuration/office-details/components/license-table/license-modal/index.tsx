"use client";
import React, { useState, useEffect, useTransition } from "react";
import {Dialog,DialogContent,DialogFooter,DialogHeader,DialogTitle} from "@/shadcn/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 } from "uuid";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { useRouter } from "next/navigation";
import { LicenseSchema } from "../license-type-definition/licenseTypeSchema";
import FormInput from "@/ikon/components/form-fields/input";
import { Form } from "@/shadcn/ui/form";
import { TextButton } from "@/ikon/components/buttons";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { invokeLicense } from "../invoke-license";

interface LicenseInstanceData {
  licenseObj: {
    [key: string]: {
      LicenseType: string;
      LicenseCost: string;
    };
  };
}

interface EditLicenseProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId?: string | null | undefined;
}

const LicenseTypeModal: React.FC<EditLicenseProps> = ({ isOpen, onClose, selectedId }) => {
  const [licenseData, setLicenseData] = useState<LicenseInstanceData>({
    licenseObj: {},
  });
  const [taskId, setTaskId] = useState<string | null>(null);
  const router = useRouter();
  const [isPending, invokeTransition] = useTransition();

  const form = useForm<z.infer<typeof LicenseSchema>>({
    resolver: zodResolver(LicenseSchema),
    defaultValues: { LicenseType: "", LicenseCost: "" },
  });

  const fetchLicenseData = async () => {
    const softwareId = await getSoftwareIdByNameVersion("Base App", "1");
    const data = await getMyInstancesV2({
      softwareId: softwareId,
      processName: "License Type",
      predefinedFilters: { taskName: "View License" },
    });
    setTaskId(data[0]?.taskId || "");
    const licenseInstanceData = data && (data[0]?.data || { licenseObj: {} });
    setLicenseData(licenseInstanceData as LicenseInstanceData);

    if (selectedId && selectedId.trim() !== "") {
      form.reset({
        LicenseType:(licenseInstanceData as LicenseInstanceData).licenseObj?.[selectedId]?.LicenseType || "",
        LicenseCost:(licenseInstanceData as LicenseInstanceData).licenseObj?.[selectedId]?.LicenseCost || "",
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLicenseData();
    }
  }, [isOpen]);

  async function handleOnSubmit(data: z.infer<typeof LicenseSchema>) {
    if (licenseData) {
      const updatedLicenseObj = { ...licenseData.licenseObj };

      if (selectedId && selectedId.trim() !== "") {
        // Edit existing license
        updatedLicenseObj[selectedId] = {
          LicenseType: data.LicenseType,
          LicenseCost: data.LicenseCost,
        };
      } else {
        // Add new license
        const newId = v4();
        updatedLicenseObj[newId] = {
          LicenseType: data.LicenseType,
          LicenseCost: data.LicenseCost,
        };
      }

      const updatedLicenseData: LicenseInstanceData = {
        ...licenseData,
        licenseObj: updatedLicenseObj,
      };

      console.log("Updated License Data:", updatedLicenseData);
      await invokeLicense(updatedLicenseData, taskId);
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
          <DialogTitle>{selectedId ? "Edit License" : "Add License"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <FormInput formControl={form.control} name={"LicenseType"} placeholder="Enter License Type" label="License Type*"/>
              <FormInput formControl={form.control} name={"LicenseCost"} placeholder="Enter Cost/license/month"label="Cost/license/month*"/>
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

export default LicenseTypeModal;
