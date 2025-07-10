"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Label } from "@/shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shadcn/ui/tabs";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  editRegistrationData,
  getSupplierRegistrationData,
  startRegistration,
} from "../../../_utils/register/supplier-register-form";
import { useRouter } from "next/navigation";
import { getCurrentUserId } from "@/ikon/utils/actions/auth";
import startBiding from "../../../_utils/supplier/bid-workflow-functions";

const supplierSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  registeredAddress: z.string().min(1, "Registered Address is required"),
  postalAddress: z.string().optional(),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  email: z.string().email("Invalid email address"),
  websiteURL: z.string().optional(),
  registrationNumber: z.string().optional(),
  vatNumber: z.string().optional(),
  contactName: z.string().optional(),
  contactPosition: z.string().optional(),
  contactPhoneNumber: z.string().optional(),
  contactEmail: z.string().optional(),
  industry: z.string().optional(),
  supplierType: z.string().optional(),
  keyProducts: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  certifications: z.string().optional(),
  insuranceCoverage: z.string().optional(),
  annualTurnover: z.string().optional(),
  creditRating: z.string().optional(),
  bankAccount: z.string().optional(),
  taxCompliant: z.enum(["Yes", "No"], { required_error: "Select an option" }),
  prevTenders: z.string().optional(),
  relevantProjects: z.string().optional(),
  references: z.string().optional(),
  legalStructure: z.string().optional(),
  regulations: z.string().optional(),
  conflicts: z.string().optional(),
  nda: z.string().optional(),
  criminal: z.string().optional(),
  qualityManagement: z.string().optional(),
  serviceGurantee: z.string().optional(),
  sla: z.string().optional(),
  bidAmount: z.string().optional(),
  proposedDelivery: z.string().optional(),
  proposedPaymentTerms: z.string().optional(),
  additionalInfo: z.string().optional(),
  profileFile: z.any().optional(),
  financialStatementFile: z.any().optional(),
  // certificationsFile : z.any().optional(),
  // referencesFile : z.any().optional(),
  supplierDeclaration: z.string().optional(),
  authorizedSignatoryName: z.string().optional(),
  signature: z.any().optional(),
  date: z.string().optional(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierId: string;
  tenderDetails: any;
}

const formWizardSteps = [
  "Supplier Info and Contacts",
  "Capabilities and Experience",
  "Finance and Legal",
  "QA and Bid Submission",
  "Additional Information",
  "Declaration",
];

export default function OpenProfileReview({
  isOpen,
  onClose,
  supplierId,
  tenderDetails,
}: ModalProps) {
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      companyName: "",
      registeredAddress: "",
      postalAddress: "",
      phoneNumber: "",
      email: "",
      websiteURL: "",
      registrationNumber: "",
      vatNumber: "",
      contactName: "",
      contactPosition: "",
      contactPhoneNumber: "",
      contactEmail: "",
      industry: "",
      supplierType: "",
      keyProducts: "",
      yearsOfExperience: undefined, // Since it's a number
      certifications: "",
      insuranceCoverage: "",
      annualTurnover: "",
      creditRating: "",
      bankAccount: "",
      taxCompliant: undefined, // Since it's an enum, leave it undefined initially
      prevTenders: "",
      relevantProjects: "",
      references: "",
      legalStructure: "",
      regulations: "",
      conflicts: "",
      nda: "",
      criminal: "",
      qualityManagement: "",
      serviceGurantee: "",
      sla: "",
      bidAmount: "",
      proposedDelivery: "",
      proposedPaymentTerms: "",
      additionalInfo: "",
      profileFile: null, // File inputs should be null initially
      financialStatementFile: null,
      supplierDeclaration: "",
      authorizedSignatoryName: "",
      signature: null,
      date: undefined, // Since it's a date
    },
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState(0);
  const totalSteps = formWizardSteps.length;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGenerateUUID = () => {
    const newUUID = uuidv4();
    console.log("Generated UUID:", newUUID);
    return newUUID;
  };

  useEffect(
    () => {
      const fetchDraftData = async () => {
        if (supplierId && isOpen) {
          //setIsLoading(true);
          try {
            const formData: any = await getSupplierRegistrationData(supplierId);

            // Populate form fields with fetched data
            Object.entries(formData).forEach(([key, value]) =>
              form.setValue(key as keyof SupplierFormData, value)
            );
          } catch (error) {
            console.error("Error fetching draft data:", error);
          } finally {
            //setIsLoading(false);
          }
        } else {
          // Reset form when dialog opens without a draft ID
          form.reset();
        }
      };

      fetchDraftData();
    },
    [
      /*draftId, isOpen, setValue, reset*/
    ]
  );

  const onSubmit = async (data: SupplierFormData) => {
    console.log("Supplier Data:", data);
    try {
      //   if (supplierId) {
      //     console.log("update existing data");
      //     const payload = { ...data, supplierId: supplierId };
      //     await editRegistrationData(supplierId, payload);
      //     toast.success("Details Saved.");
      //   } else {
      //     console.log("create new data");
      //     const uuid = handleGenerateUUID();
      //     const currUser = await getCurrentUserId();
      //     const payload = {
      //       ...data,
      //       supplierId: uuid,
      //       createdBy: currUser,
      //       status: "Pending",
      //     };
      //     await startRegistration(payload);
      //     toast.success("Details Saved.");
      //   }
      console.log("in on submit");
      const stepTracker = {
        "Bid Initialization": "COMPLETED",
        "Template Selection": "IN PROGRESS",
        Draft: "PENDING",
        Approve: "PENDING",
        "Bid Completion": "PENDING",
      };
      const uid = handleGenerateUUID();
      const bidData = {
        ...tenderDetails,
        bidSteptracker: stepTracker,
        bidId: uid,
        supplierId: supplierId,
      };
      console.log(data);
      await startBiding({ tenderData: bidData });
      console.log("Instance started");
      toast.success("Bid Initiated");
    } catch (error) {
      console.error("Error submitting supplier data:", error);
      toast.error("An error occurred. Please try again.");
    }
    onClose();
    startTransition(() => {
      router.refresh();
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-6">
        <DialogHeader>
          <DialogTitle>Profile Review</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue={formWizardSteps[step]}
          className="w-full h-full flex flex-col"
        >
          <TabsList>
            {formWizardSteps.map((currStep, index) => (
              <TabsTrigger
                key={currStep}
                value={currStep}
                onClick={() => setStep(index)}
              >
                {currStep}
              </TabsTrigger>
            ))}
          </TabsList>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-1 flex flex-col space-y-4"
            >
              <div className="flex-1 overflow-y-hidden">
                <TabsContent
                  value="Supplier Info and Contacts"
                  className="h-full p-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        {...form.register("companyName")}
                      />
                      {form.formState.errors.companyName && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.companyName.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="registeredAddress">
                        Registered Address
                      </Label>
                      <Input
                        id="registeredAddress"
                        {...form.register("registeredAddress")}
                      />
                      {form.formState.errors.registeredAddress && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.registeredAddress.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="postalAddress">
                        Postal Address (if different)
                      </Label>
                      <Input
                        id="postalAddress"
                        {...form.register("postalAddress")}
                      />
                      {form.formState.errors.postalAddress && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.postalAddress.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        {...form.register("phoneNumber")}
                      />
                      {form.formState.errors.phoneNumber && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.phoneNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" {...form.register("email")} />
                      {form.formState.errors.email && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="websiteURL">Website URL</Label>
                      <Input id="websiteURL" {...form.register("websiteURL")} />
                      {form.formState.errors.websiteURL && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.websiteURL.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="registrationNumber">
                        Company Registration Number
                      </Label>
                      <Input
                        id="registrationNumber"
                        {...form.register("registrationNumber")}
                      />
                      {form.formState.errors.registrationNumber && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.registrationNumber.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="vatNumber">
                        VAT Number (if applicable)
                      </Label>
                      <Input id="vatNumber" {...form.register("vatNumber")} />
                      {form.formState.errors.vatNumber && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.vatNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="contactName">Full Name</Label>
                      <Input
                        id="contactName"
                        {...form.register("contactName")}
                      />
                      {form.formState.errors.contactName && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.contactName.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="contactPosition">Position/Title</Label>
                      <Input
                        id="contactPosition"
                        {...form.register("contactPosition")}
                      />
                      {form.formState.errors.contactPosition && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.contactPosition.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="contactPhoneNumber">Phone Number</Label>
                      <Input
                        id="contactPhoneNumber"
                        {...form.register("contactPhoneNumber")}
                      />
                      {form.formState.errors.contactPhoneNumber && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.contactPhoneNumber.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="contactEmail">Email Address</Label>
                      <Input
                        id="contactEmail"
                        {...form.register("contactEmail")}
                      />
                      {form.formState.errors.contactEmail && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.contactEmail.message}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="Capabilities and Experience"
                  className="h-full p-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="industry">Business Sector/Industry</Label>
                      <Input id="industry" {...form.register("industry")} />
                      {form.formState.errors.industry && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.industry.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="supplierType">Supplier Type</Label>
                      <Select
                        onValueChange={(value) =>
                          form.setValue("supplierType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Supplier Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Manufacturer">
                            Manufacturer
                          </SelectItem>
                          <SelectItem value="Distributor">
                            Distributor
                          </SelectItem>
                          <SelectItem value="Service Provider">
                            Service Provider
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.supplierType && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.supplierType.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="keyProducts">
                        Key Products/Services Offered
                      </Label>
                      <Textarea
                        id="keyProducts"
                        {...form.register("keyProducts")}
                      />
                      {form.formState.errors.keyProducts && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.keyProducts.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="yearsOfExperience">
                          Years of Experience
                        </Label>
                        <Input
                          type="number"
                          id="yearsOfExperience"
                          {...form.register("yearsOfExperience", {
                            valueAsNumber: true,
                          })}
                        />
                        {form.formState.errors.yearsOfExperience && (
                          <p className="text-red-500 text-sm">
                            {form.formState.errors.yearsOfExperience.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="certifications">
                        Certifications and Accreditations
                      </Label>
                      <Textarea
                        id="certifications"
                        {...form.register("certifications")}
                      />
                      {form.formState.errors.certifications && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.certifications.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="insuranceCoverage">
                        Insurance Coverage
                      </Label>
                      <Textarea
                        id="insuranceCoverage"
                        {...form.register("insuranceCoverage")}
                      />
                      {form.formState.errors.insuranceCoverage && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.insuranceCoverage.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="prevTenders">
                        Previous Tender Participation
                      </Label>
                      <Textarea
                        id="prevTenders"
                        {...form.register("prevTenders")}
                      />
                      {form.formState.errors.prevTenders && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.prevTenders.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="relevantProjects">
                        Relevant Projects Completed
                      </Label>
                      <Textarea
                        id="relevantProjects"
                        {...form.register("relevantProjects")}
                      />
                      {form.formState.errors.relevantProjects && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.relevantProjects.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="references">
                        References/Testimonials
                      </Label>
                      <Textarea
                        id="references"
                        {...form.register("references")}
                      />
                      {form.formState.errors.references && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.references.message}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="Finance and Legal" className="h-full p-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="annualTurnover">Annual Turnover</Label>
                        <Input
                          id="annualTurnover"
                          {...form.register("annualTurnover")}
                        />
                        {form.formState.errors.annualTurnover && (
                          <p className="text-red-500 text-sm">
                            {form.formState.errors.annualTurnover.message}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="creditRating">
                          Credit Rating/Bank Details
                        </Label>
                        <Input
                          id="creditRating"
                          {...form.register("creditRating")}
                        />
                        {form.formState.errors.creditRating && (
                          <p className="text-red-500 text-sm">
                            {form.formState.errors.creditRating.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="bankAccount">
                          Bank Account Information
                        </Label>
                        <Input
                          id="bankAccount"
                          {...form.register("bankAccount")}
                        />
                        {form.formState.errors.bankAccount && (
                          <p className="text-red-500 text-sm">
                            {form.formState.errors.bankAccount.message}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="taxCompliant">
                          Tax Compliance Status
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            form.setValue("taxCompliant", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                        {form.formState.errors.taxCompliant && (
                          <p className="text-red-500 text-sm">
                            {form.formState.errors.taxCompliant.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="legalStructure">Legal Structure</Label>
                      <Select
                        onValueChange={(value) =>
                          form.setValue("legalStructure", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Legal Structure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sole Proprietorship">
                            Sole Proprietorship
                          </SelectItem>
                          <SelectItem value="Limited Liability Company">
                            Limited Liability Company
                          </SelectItem>
                          <SelectItem value="Corporation">
                            Corporation
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.legalStructure && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.legalStructure.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="regulations"
                          {...form.register("regulations")}
                        />
                        <Label htmlFor="regulations">
                          Compliance with Local Laws and Regulations
                        </Label>
                      </div>
                      {form.formState.errors.regulations && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.regulations.message}
                        </p>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="conflicts"
                          {...form.register("conflicts")}
                        />
                        <Label htmlFor="conflicts">
                          Conflicts of Interest Declaration
                        </Label>
                      </div>
                      {form.formState.errors.conflicts && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.conflicts.message}
                        </p>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox id="nda" {...form.register("nda")} />
                        <Label htmlFor="nda">
                          Non-Disclosure Agreement (NDA)
                        </Label>
                      </div>
                      {form.formState.errors.nda && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.nda.message}
                        </p>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="criminal"
                          {...form.register("criminal")}
                        />
                        <Label htmlFor="criminal">
                          Criminal Record Declaration
                        </Label>
                      </div>
                      {form.formState.errors.criminal && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.criminal.message}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="QA and Bid Submission"
                  className="h-full p-4"
                >
                  <div className="grid gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="qualityManagement">
                        Quality Management System
                      </Label>
                      <Textarea
                        id="qualityManagement"
                        {...form.register("qualityManagement")}
                      />
                      {form.formState.errors.qualityManagement && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.qualityManagement.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="serviceGuarantee">
                        Product/Service Guarantees
                      </Label>
                      <Textarea
                        id="serviceGuarantee"
                        {...form.register("serviceGuarantee")}
                      />
                      {form.formState.errors.serviceGuarantee && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.serviceGuarantee.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="sla">Service Level Agreement (SLA)</Label>
                      <Input type="file" id="sla" {...form.register("sla")} />
                      {form.formState.errors.sla && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.sla.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="bidAmount">
                          Bid Amount/Price Proposal
                        </Label>
                        <Input id="bidAmount" {...form.register("bidAmount")} />
                        {form.formState.errors.bidAmount && (
                          <p className="text-red-500 text-sm">
                            {form.formState.errors.bidAmount.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="proposedDelivery">
                        Proposed Delivery Schedule
                      </Label>
                      <Textarea
                        id="proposedDelivery"
                        {...form.register("proposedDelivery")}
                      />
                      {form.formState.errors.proposedDelivery && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.proposedDelivery.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="proposedPaymentTerms">
                        Proposed Payment Terms
                      </Label>
                      <Textarea
                        id="proposedPaymentTerms"
                        {...form.register("proposedPaymentTerms")}
                      />
                      {form.formState.errors.proposedPaymentTerms && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.proposedPaymentTerms.message}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="Additional Information"
                  className="h-full p-4"
                >
                  <div className="grid gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="additionalInfo">
                        Any Other Relevant Information
                      </Label>
                      <Textarea
                        id="additionalInfo"
                        {...form.register("additionalInfo")}
                      />
                      {form.formState.errors.additionalInfo && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.additionalInfo.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="profileFile">Company Profile</Label>
                        <Input
                          type="file"
                          id="profileFile"
                          {...form.register("profileFile")}
                        />
                        {form.formState.errors.profileFile && (
                          <p className="text-red-500 text-sm">
                            {form.formState.errors.profileFile.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="financialStatementFile">
                          Financial Statements
                        </Label>
                        <Input
                          type="file"
                          id="financialStatementFile"
                          {...form.register("financialStatementFile")}
                        />
                        {form.formState.errors.financialStatementFile && (
                          <p className="text-red-500 text-sm">
                            {form.formState.errors.financialStatementFile?.message?.toString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="certificationsFile">
                          Certifications/Accreditations
                        </Label>
                        <Input
                          type="file"
                          id="certificationsFile"
                          {...form.register("certificationsFile")}
                        />
                        {form.formState.errors.certificationsFile && (
                          <p className="text-red-500 text-sm">
                            {form.formState.errors.certificationsFile.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="referencesFile">
                          References/Testimonials
                        </Label>
                        <Input
                          type="file"
                          id="referencesFile"
                          {...form.register("referencesFile")}
                        />
                        {form.formState.errors.referencesFile && (
                          <p className="text-red-500 text-sm">
                            {form.formState.errors.referencesFile.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="Declaration" className="h-full">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center space-x-2 space-y-4">
                        <Checkbox
                          id="supplierDeclaration"
                          {...form.register("supplierDeclaration")}
                          className="mt-4"
                        />
                        <Label htmlFor="supplierDeclaration">
                          I declare that all information provided is accurate
                          and complete.
                        </Label>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="authorizedSignatoryName">
                            Authorized Signatory Name
                          </Label>
                          <Input
                            id="authorizedSignatoryName"
                            {...form.register("authorizedSignatoryName")}
                          />
                          {form.formState.errors.authorizedSignatoryName && (
                            <p className="text-red-500 text-sm">
                              {
                                form.formState.errors.authorizedSignatoryName
                                  .message
                              }
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            type="date"
                            id="date"
                            {...form.register("date")}
                          />
                          {form.formState.errors.date && (
                            <p className="text-red-500 text-sm">
                              {form.formState.errors.date.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="signature">Signature</Label>
                        <Input
                          type="file"
                          id="signature"
                          {...form.register("signature")}
                        />
                        {form.formState.errors.signature && (
                          <p className="text-red-500 text-sm">
                            {form.formState.errors.signature.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                >
                  Back
                </Button>
                <div>
                  <Button type="submit" className="mx-2">
                    Start Bidding
                  </Button>
                  <Button>Save</Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
