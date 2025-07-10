"use client";
// import React, { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shadcn/ui/dialog";
import { TabArray } from "@/ikon/components/tabs/type";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { countryMap } from "../../../country_details";
import Tabs from "@/ikon/components/tabs";
import { Form } from "@/shadcn/ui/form";
import FormInput from "@/ikon/components/form-fields/input";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";
import { startLeadData } from "../invoke_create_lead";
import { leadSchema } from "../create_lead_schema";
import { TextButton } from "@/ikon/components/buttons";
import { getAccountManagerDetails } from "../../../../components/account-manager";
import { useEffect, useState, useTransition } from "react";


interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const LeadModal: React.FC<LeadModalProps> =  ({ isOpen, onClose }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [accountManagerMap, setAccountManagerMap] = useState<any[]>([]); 

  useEffect(() => {
    const fetchAccountManagers = async () => {
      let managers:any = await getAccountManagerDetails();
      type ManagerDetails = {
        userId: string;
        userName: string;
        userActive: boolean;
    };

    const activeUsersPMGrp = Object.values(managers as Record<string, ManagerDetails>)
        .filter((managerDetails) => managerDetails.userActive)
        .map((activeManagerDetails) => ({
            value: activeManagerDetails.userId,
            label: activeManagerDetails.userName
        }));
      console.log("accountManagerMap ", activeUsersPMGrp);
      setAccountManagerMap(activeUsersPMGrp);
    };

    if (isOpen) {
      fetchAccountManagers();
    }
  }, [isOpen]);

 

  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      organisationDetails: {
        organisationName: "",
        email: "",
        orgContactNo: "",
        noOfEmployees: "",
        website: "",
        sector: "",
        source: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        landmark: "",
      },
      teamInformation: {
        salesManager: "",
        salesteam: [],
      },
      leadIdentifier: "",
      leadStatus: "",
      updatedOn: "",
    },
  });

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const random = (Math.random() * 16) | 0;
      const value = char === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    });
  };

  const handleOnSubmit = async (data: z.infer<typeof leadSchema>) => {
    console.log("Form Data:", data);

    data.leadIdentifier = generateUUID();
    data.leadStatus = "Lead Created";
    data.updatedOn = new Date().toISOString();

    console.log("Final Data Structure:", data);
    await startLeadData(data);

    onClose();
    startTransition(() => {
      router.refresh();
    });
  };

  const tabArray: TabArray[] = [
    {
      tabName: "Lead Details",
      tabId: "tab-lead",
      default: true,
      tabContent: (
        <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto h-[85vh]">
          <div className="grid col-span-2 items-center gap-1.5">
            <FormInput
              formControl={form.control}
              name={"organisationDetails.organisationName"}
              placeholder="Enter organization name"
              label="Organization Name *"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={"organisationDetails.email"}
              placeholder="Enter Email"
              label="Email"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={"organisationDetails.orgContactNo"}
              placeholder="Enter Contact Number"
              label="Contact Number"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={"organisationDetails.noOfEmployees"}
              placeholder="Enter Number of Employees"
              label="Number of Employees"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={"organisationDetails.website"}
              placeholder="Enter Website"
              label="Website"
            />
          </div>
          <div className="grid gap-1.5">
            <FormComboboxInput
              items={[
                { value: "finance", label: "Finance" },
                { value: "technology", label: "Technology" },
              ]}
              formControl={form.control}
              name={"organisationDetails.sector"}
              placeholder={"Choose Sector"}
              label="Sector"
            />
          </div>
          <div className="grid gap-1.5">
            <FormComboboxInput
              items={[
                { value: "online", label: "Online" },
                { value: "referral", label: "Referral" },
              ]}
              formControl={form.control}
              name={"organisationDetails.source"}
              placeholder={"Choose Source"}
              label="Source"
            />
          </div>

          <div className="grid gap-1.5 col-span-2">
            <FormTextarea
              formControl={form.control}
              name={"organisationDetails.street"}
              placeholder={"Enter Street Name"}
              label="Street"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={"organisationDetails.city"}
              placeholder={"Enter City"}
              label="City"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={"organisationDetails.state"}
              placeholder={"Enter State"}
              label="State"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={"organisationDetails.postalCode"}
              placeholder={"Enter ZIP/Postal Code"}
              label="ZIP/Postal Code"
            />
          </div>

          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={"organisationDetails.landmark"}
              placeholder={"Enter Landmark"}
              label="Landmark"
            />
          </div>
          <div className="grid gap-1.5">
            <FormComboboxInput
              items={countryMap}
              formControl={form.control}
              name={"organisationDetails.country"}
              placeholder={"Choose Country"}
              label="Country"
            />
          </div>
        </div>
      ),
    },
    {
      tabName: "Contact Details",
      tabId: "tab-contact",
      default: false,
      tabContent: (
        <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto h-[85vh]">
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={""}
              placeholder={"Enter First Name"}
              label="First Name"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={""}
              placeholder={"Enter Middle Name"}
              label="Middle Name"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={""}
              placeholder={"Enter Last Name"}
              label="Last Name"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={""}
              placeholder={"Enter Email"}
              label="Email"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={""}
              placeholder={"Enter Phone Number"}
              label="Phone Number"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={""}
              placeholder={"Enter Mobile Number"}
              label="Mobile Number"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={""}
              placeholder={"Enter Department"}
              label="Department"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={""}
              placeholder={"Enter Fax"}
              label="Fax"
            />
          </div>

          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={""}
              placeholder={"Enter Address 1"}
              label="Address 1"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={""}
              placeholder="Enter Address 2"
              label="Address 2"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={""}
              placeholder="Enter City"
              label="City"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={""}
              placeholder="Enter State"
              label="State"
            />
          </div>
          <div className="grid gap-1.5">
            <FormInput
              formControl={form.control}
              name={""}
              placeholder="Enter Pin Code"
              label="Pin Code"
            />
          </div>
          <div className="grid gap-1.5">
            <FormComboboxInput
              items={countryMap}
              formControl={form.control}
              name={"organisationDetails.country"}
              placeholder={"Choose Country"}
              label="Country"
            />
          </div>
        </div>
      ),
    },
    {
      tabName: "Team Details",
      tabId: "tab-team",
      default: false,
      tabContent: (
        <>
          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto h-[85vh]">
            <div className="grid gap-1.5">
              <FormComboboxInput
                placeholder="Choose Account Manager"
                items={accountManagerMap}
                formControl={form.control}
                name={"teamInformation.salesManager"}
                label="Account Manager"
              />
            </div>

            <div className="grid gap-1.5">
              <FormMultiComboboxInput
                items={accountManagerMap}
                formControl={form.control}
                name={"teamInformation.salesteam"}
                label="Sales Team Member"
                placeholder="Choose Team Member"
              />
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Add Lead</DialogTitle>
        </DialogHeader>
        <div className="">
          <Form {...form}>
            <form>
              <Tabs
                tabArray={tabArray}
                tabListClass="py-6 px-3"
                tabListButtonClass="text-md"
                tabListInnerClass="justify-between items-center"
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          {/* <Button onClick={form.handleSubmit(handleOnSubmit)}>Submit</Button> */}
          <TextButton onClick={form.handleSubmit(handleOnSubmit)} >Submit</TextButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadModal;
