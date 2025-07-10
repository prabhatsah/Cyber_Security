"use client";
import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shadcn/ui/dialog";
import TabContainer from "@/ikon/components/tabs";
import { TabArray } from "@/ikon/components/tabs/type";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Textarea } from "@/shadcn/ui/textarea";
import { useForm } from "react-hook-form";
import { getProfileData } from "@/ikon/utils/actions/auth";
import OrganizationForm from "./OrganizationTabLeadForm";
import { startLeadData } from "../invoke_create_lead";
import { useRouter } from "next/navigation";
import { Button } from "@/shadcn/ui/button";
import MultiCombobox from "@/ikon/components/multi-combobox";
import { countryMap } from "../../../country_details";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadModalOld: React.FC<LeadModalProps> = ({ isOpen, onClose }) => {
  // const currentUserProfile = await getProfileData();

  // const currentUserId = currentUserProfile?.userId;
  // console.log("user Id ", currentUserId)
  interface UserDetails {
    userActive: boolean;
    userName: string;
  }

  // const userIdWiseUserDetailsMap = Object.fromEntries(
  //   Object.entries(userMap).filter(([_, userDetails]) => userDetails.userActive)
  // );

  // const salesManagerOptions = [
  //   { value: "", label: "Select Account Manager", isDisabled: true },
  //   ...(userMap[currentUserId]
  //     ? [{ value: currentUserId, label: userMap[currentUserId].userName }]
  //     : []),
  //   ...Object.entries(userIdWiseUserDetailsMap).map(([userId, userDetails]) => ({
  //     value: userId,
  //     label: userDetails.userName,
  //   })),
  // ];

  // let teamMemberOptions: any = []
  // Object.entries(userMap).forEach(([userId, userDetails]) => {
  //   if (userDetails.userActive) {
  //     teamMemberOptions.push({
  //       value: userDetails.userId,
  //       label: userDetails.userName,
  //     });
  //   }
  // });

  interface FormData {
    organisationName: string;
    email: string;
    orgContactNo: string;
    noOfEmployees: number;
    website: string;
    city: string;
    state: string;
    postalCode: string;
    landMark: string;
    firstName: string;
    lastName: string;
    middleName: string;
    phoneNum: string;
    mobNo: string;
    department: string;
    fax: string;
    address1: string;
    address2: string;
    pinCode: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  interface OptionType {
    value: string;
    label: string;
  }

  const [sector, setSector] = useState<OptionType | null>(null);
  const [source, setSource] = useState<OptionType | null>(null);
  const [countryContact, setCountryContact] = useState<OptionType | null>(null);
  const [countryLead, setCountryLead] = useState<OptionType | null>(null);
  const [accMngr, setAccMngr] = useState<OptionType | null>(null);
  const [teamMember, setTeamMember] = useState<OptionType | null>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleOnSubmit = async (data: any) => {
    console.log("Selected Sector:", sector);
    console.log("Selected Source:", source);

    // Generate leadIdentifier if not already provided
    if (!data.leadIdentifier) {
      data.leadIdentifier = generateUUID();
    }

    data.leadStatus = "Lead Created";

    const organisationDetails = {
      organisationName: data.organisationName,
      email: data.email || "",
      orgContactNo: data.orgContactNo || "",
      noOfEmployees: data.noOfEmployees || "",
      website: data.website || "",
      city: data.city || "",
      state: data.state || "",
      postalCode: data.postalCode || "",
      street: data.street || "",
      landmark: data.landMark || "",
      sector: sector?.value || "",
      source: source?.value || "",
      country: countryLead?.value || "",
    };

    // Check and assign the account manager
    if (data.accMngr === undefined) {
      data.accMngr = accMngr?.value;
    }

    // Ensure teamMember is an array, and if not, initialize it as an empty array
    if (!data.teamMember || !Array.isArray(data.teamMember)) {
      data.teamMember = [];
    }

    // Process team members and push their values into the teamMember array
    if (teamMember && Array.isArray(teamMember)) {
      for (let member of teamMember) {
        if (member && member.value !== undefined) {
          data.teamMember.push(member.value);
        }
      }
    }

    // Map team information
    const teamInformation = {
      salesManager: data.accMngr || "", // Ensure salesManager is assigned
      salesteam: data.teamMember || [], // Array of selected team members
    };

    // Combine everything into the final formData structure
    const formData = {
      leadIdentifier: data.leadIdentifier,
      leadStatus: data.leadStatus,
      organisationDetails,
      teamInformation,
      updatedOn: new Date().toISOString(), // Current timestamp
    };

    console.log("Final form data:", formData);
    await startLeadData(formData);

    onClose();
    startTransition(() => {
      router.refresh();
    });
  };

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const random = (Math.random() * 16) | 0;
      const value = char === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    });
  };

  const handleOnError = (errors: any) => {
    if (errors.organizationName) {
      alert(errors.organizationName.message);
    }
  };

  const tabArray: TabArray[] = [
    {
      tabName: "Lead Details",
      tabId: "tab-lead",
      default: true,
      tabContent: (
        <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto h-[85vh]">
          <div className="grid col-span-2 items-center gap-1.5">
            <Label htmlFor="organizationId">Organization Name *</Label>
            <Input
              type="text"
              id="organizationId"
              placeholder="Enter organization name"
              {...register("organisationName", {
                required: "Organization name is required",
                minLength: {
                  value: 1,
                  message: "Please Enter Organization Name",
                },
              })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="emailId">Email</Label>
            <Input
              type="email"
              id="emailId"
              placeholder="Enter Email"
              {...register("email")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="contactId">Contact Number</Label>
            <Input
              type="number"
              id="contactId"
              placeholder="Enter Contact Number"
              {...register("orgContactNo")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="employeeTotalId">Number of Employees</Label>
            <Input
              type="number"
              id="employeeTotalId"
              placeholder="Enter Number of Employees"
              {...register("noOfEmployees")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="websiteId">Website</Label>
            <Input
              type="text"
              id="websiteId"
              placeholder="Enter Website"
              {...register("website")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sectorId">Sector</Label>
            <MultiCombobox
              placeholder={"Choose Sector"}
              items={[
                { value: "finance", label: "Finance" },
                { value: "technology", label: "Technology" },
              ]}
              onValueChange={(selected: any) =>
                setSector(selected as OptionType)
              }
            ></MultiCombobox>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sourceId">Source</Label>
            <MultiCombobox
              placeholder="Choose Source"
              items={[
                { value: "online", label: "Online" },
                { value: "referral", label: "Referral" },
              ]}
              onValueChange={setSource}
            />
          </div>

          <div className="grid gap-1.5 col-span-2">
            <Label htmlFor="streetId">Street</Label>
            <Textarea placeholder="Enter Street Name" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cityId">City</Label>
            <Input
              type="text"
              id="cityId"
              placeholder="Enter City"
              {...register("city")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="stateId">State</Label>
            <Input
              type="text"
              id="stateId"
              placeholder="Enter State"
              {...register("state")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="zipId">ZIP/Postal Code</Label>
            <Input
              type="text"
              id="zipId"
              placeholder="Enter ZIP/Postal Code"
              {...register("postalCode")}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="landMarkId">Landmark</Label>
            <Input
              type="text"
              id="landMarkId"
              placeholder="Enter Landmark"
              {...register("landMark")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sourceId">Country</Label>
            <MultiCombobox
              placeholder="Choose Country"
              items={countryMap}
              onValueChange={setCountryLead}
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
            <Label htmlFor="firstNameId">First Name</Label>
            <Input
              type="text"
              id="firstNameId"
              placeholder="Enter First Name"
              {...register("firstName")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="middleNameId">Middle Name</Label>
            <Input
              type="text"
              id="middleNameId"
              placeholder="Enter Middle Name"
              {...register("middleName")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="lastNameId">Last Name</Label>
            <Input
              type="text"
              id="lastNameId"
              placeholder="Enter Last Name"
              {...register("lastName")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="emailId">Email</Label>
            <Input
              type="email"
              id="emailId"
              placeholder="Enter Email"
              {...register("email")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="numberId">Phone Number Name</Label>
            <Input
              type="number"
              id="numberId"
              placeholder="Enter Phone Number"
              {...register("phoneNum")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="mobileId">Mobile Number</Label>
            <Input
              type="number"
              id="mobileId"
              placeholder="Enter Mobile Number"
              {...register("mobNo")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="departmentId">Department</Label>
            <Input
              type="text"
              id="departmentId"
              placeholder="Enter Department"
              {...register("department")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="faxId">Fax</Label>
            <Input
              type="text"
              id="faxId"
              placeholder="Enter Fax"
              {...register("fax")}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="address1Id">Address 1</Label>
            <Textarea placeholder="Enter Address1" {...register("address1")} />
            {/* <Input type="text" id="address1Id" placeholder="Enter Address1" /> */}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="address2Id">Address 2</Label>
            <Textarea placeholder="Enter Address2" {...register("address2")} />
            {/* <Input type="text" id="address2Id" placeholder="Enter Address2" /> */}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cityId">City</Label>
            <Input
              type="text"
              id="cityId"
              placeholder="Enter City"
              {...register("city")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="stateId">State</Label>
            <Input
              type="text"
              id="stateId"
              placeholder="Enter State"
              {...register("state")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="pinCodeId">Pin Code</Label>
            <Input
              type="text"
              id="pinCodeId"
              placeholder="Enter Pin Code"
              {...register("pinCode")}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sourceId">Country</Label>
            <MultiCombobox
              placeholder="Choose Country"
              items={countryMap}
              onValueChange={setCountryContact}
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
              <Label htmlFor="accMngrId">Account Manager</Label>
              <MultiCombobox
                placeholder="Choose Account Manager"
                items={[
                  { value: "f3a1b2c3i456789d0e123456789abcdef", label: "Anushri Dutta" },
                  { value: "asdfg456c3i456789d0e11112367fgvkj", label: "Prity Karmakar" },
                ]}
                onValueChange={setAccMngr}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="teamMemberId">Sales Team Member</Label>
              <MultiCombobox
                placeholder="Choose Team Member"
                items={[
                  { value: "f3a1b2c3i456789d0e123456789abcdef", label: "Anushri Dutta" },
                  { value: "asdfg456c3i456789d0e11112367fgvkj", label: "Prity Karmakar" },
                ]}
                onValueChange={setTeamMember}
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
          <form>
            <TabContainer
              tabArray={tabArray}
              tabListClass="py-6 px-3"
              tabListButtonClass="text-md"
              tabListInnerClass="justify-between items-center"
            />
          </form>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit(handleOnSubmit, handleOnError)}
            variant="default"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadModalOld;
