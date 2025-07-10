"use client";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Textarea } from "@/shadcn/ui/textarea";
import { useForm, SubmitHandler, Form, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  editRfpData,
  startRfpDraft,
} from "../../../../_utils/buyer/my-rfps/invoke-create-draft";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { RfpDraft } from "../../../../_utils/common/types";
import { getProjectDetailsData } from "../../../../_utils/common/get-particular-project-details-data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shadcn/ui/tabs";
import { sectors } from "../../../../_utils/common/sector";
const tenderSchema = z.object({
  // Basic Tender Information
  title: z.string().min(1, "Tender Subject is required"),
  referenceNumber: z.string().min(1, "Tender Reference Number is required"),
  description: z.string().min(1, "Project Description is required"),
  tenderType: z
    .enum(["open", "limited", "direct"])
    .refine((val) => val !== undefined, {
      message: "Tender Type is required",
    }),
  procurementCategory: z
    .enum(["goods", "services", "works"])
    .refine((val) => val !== undefined, {
      message: "Procurement Category is required",
    }),
  budget: z.number().min(0, "Estimated Budget/Value must be a positive number"),
  industry: z.string().min(1, "Industry is required"),
  currency: z.string().min(1, "Currency is required"),
  publicationDate: z.string().min(1, "Publication Date is required"),
  submissionDeadline: z.string().min(1, "Submission Deadline is required"),
  validityPeriod: z
    .number()
    .min(1, "Tender Validity Period must be at least 1 day"),
  projectDuration: z.string().min(1, "Expected Project Duration is required"),

  // Procuring Entity Information
  organizationName: z.string().min(1, "Organization Name is required"),
  department: z.string().optional(),
  contactPerson: z.string().min(1, "Contact Person is required"),
  contactEmail: z.string().email("Invalid email format"),
  contactPhone: z.string().min(1, "Contact Phone Number is required"),
  address: z.string().min(1, "Address is required"),

  // Eligibility Criteria
  minTurnover: z
    .number()
    .min(0, "Minimum Annual Turnover must be a positive number"),
  experienceYears: z
    .number()
    .min(0, "Years of Experience Required must be a positive number"),
  similarProjects: z.string().optional(),
  requiredCertifications: z.string().optional(),
  legalRequirements: z.string().optional(),
  financialStanding: z.string().optional(),
  technicalCapability: z.string().optional(),

  // Technical Specifications
  scopeOfWork: z.string().min(1, "Detailed Scope of Work is required"),
  technicalRequirements: z.string().optional(),
  qualityStandards: z.string().optional(),
  deliveryTimeline: z.string().optional(),
  acceptanceCriteria: z.string().optional(),
  performanceMetrics: z.string().optional(),
  requiredDeliverables: z.string().optional(),

  // Evaluation Criteria
  technicalWeight: z
    .number()
    .min(0)
    .max(100, "Technical Evaluation Weight must be between 0-100"),
  financialWeight: z
    .number()
    .min(0)
    .max(100, "Financial Evaluation Weight must be between 0-100"),
  qualificationThreshold: z
    .number()
    .min(0)
    .max(100, "Technical Qualification Threshold must be between 0-100"),
  evaluationMethodology: z.string().optional(),
  scoringSystem: z.string().optional(),

  // Bid Security
  bidSecurityAmount: z
    .number()
    .min(0, "Bid Security Amount must be a positive number"),
  bidSecurityForm: z
    .enum(["bank_guarantee", "cash_deposit"])
    .refine((val) => val !== undefined, {
      message: "Bid Security Form is required",
    }),
  bidSecurityValidity: z
    .number()
    .min(1, "Validity Period of Bid Security must be at least 1 day"),

  // Submission Requirements
  submissionMethod: z
    .enum(["electronic", "physical", "both"])
    .refine((val) => val !== undefined, {
      message: "Submission Method is required",
    }),
  copiesRequired: z
    .number()
    .min(1, "Required Number of Copies must be at least 1"),
  formatRequirements: z.string().optional(),
  supportingDocuments: z.string().optional(),
  preQualificationDocs: z.string().optional(),

  // Schedule of Events
  preBidMeeting: z.string().optional(),
  siteVisit: z.string().optional(),
  queryDeadline: z.string().optional(),
  responseToQueries: z.string().optional(),
 
  techBidOpening: z.string().optional(),
  
  financeBidOpening: z.string().optional(),
  

  // Terms and Conditions
  paymentTerms: z.string().optional(),
  warrantyRequirements: z.string().optional(),
  insuranceRequirements: z.string().optional(),
  subContractingRules: z.string().optional(),
  contractAmendment: z.string().optional(),
  disputeResolution: z.string().optional(),
  forceMajeure: z.string().optional(),
  terminationConditions: z.string().optional(),

  // Attachments
  biddingDocs: z.any().optional(),
  techSpecsDocs: z.any().optional(),
  draftContract: z.any().optional(),
  billQuantities: z.any().optional(),
  specialInstructions: z.any().optional(),
});

const steps = [
  { title: "Basic Details", key: "basic" }, // Includes Basic Information & Procuring Entity Details
  { title: "Eligibility & Requirements", key: "eligibility" }, // Includes Eligibility Criteria & Submission Requirements
  { title: "Technical & Evaluation", key: "technical" }, // Includes Technical Specifications & Evaluation Criteria
  { title: "Security & Schedule", key: "security_schedule" }, // Includes Bid Security & Schedule of Events
  { title: "Terms & Attachments", key: "terms" }, // Includes Terms and Conditions & Attachments
];

type CreateDraftFormData = z.infer<typeof tenderSchema>;

interface DraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  draftId?: string;
}

const CreateDraftModalForm: React.FC<DraftModalProps> = ({
  isOpen,
  onClose,
  draftId,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("basic");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateDraftFormData>({
    resolver: zodResolver(tenderSchema),
  });

  const industryOptions = sectors.map((option: any) => option.sectorName);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    () => {
      reset();
      const fetchDraftData = async () => {
        
        if (draftId && isOpen) {
          setIsLoading(true);
          try {
            const formData: RfpDraft = await getProjectDetailsData(draftId);

            // Populate form fields with fetched data
            Object.entries(formData).forEach(([key, value]) => {
              //setValue(key as keyof CreateDraftFormData, value)
              if (typeof value === "object" && value?.resourceName) {
                // Creating a File object placeholder with the file metadata
                const file = new File([""], value.resourceName, {
                  type: value.resourceType || "application/octet-stream",
                });

                setValue(key as keyof CreateDraftFormData, [file]); // Setting value for file input
              } else {
                // Normal field handling
                setValue(key as keyof CreateDraftFormData, value);
              }
            });
          } catch (error) {
            console.error("Error fetching draft data:", error);
          } finally {
            setIsLoading(false);
          }
        } else {
          // Reset form when dialog opens without a draft ID
          reset();
        }
      };

      fetchDraftData();
    },
    [
      /*draftId, isOpen, setValue, reset*/
    ]
  );

  const onSubmit: SubmitHandler<CreateDraftFormData> = async (data) => {
    try {
      console.log("Form Data:", data);
      if (draftId) {
        console.log("updating draft");
        const payload = { ...data, id: draftId };
        const res = await editRfpData(draftId, payload);
        console.log("edited");
      } else {
        console.log("creating draft");
        console.log("Form Data:", data);
        const uuid = handleGenerateUUID();
        const payload = { ...data, id: uuid };
        const response = await startRfpDraft(payload);
        console.log("started");
      }
    } catch (error) {
      console.log("error");
      toast.error("Failed to perform action");
    }
    onClose(); // Close the dialog on successful submission
    startTransition(() => {
      router.refresh();
    });
  };

  const handleGenerateUUID = () => {
    const newUUID = uuidv4();
    console.log("Generated UUID:", newUUID);
    return newUUID;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="overflow-y-auto max-w-none p-6"
        onInteractOutside={(e) => e.preventDefault()}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>{draftId ? "Edit Tender" : "Create Tender"}</DialogTitle>
        </DialogHeader>
        <FormProvider
          {...{
            ...useForm<CreateDraftFormData>({
              resolver: zodResolver(tenderSchema),
            }),
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Tabs Navigation */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-5 sticky top-0 bg-black z-10">
                <TabsTrigger value="basic">Basic Details</TabsTrigger>
                <TabsTrigger value="eligibility">
                  Eligibility & Requirements
                </TabsTrigger>
                <TabsTrigger value="technical">
                  Technical & Evaluation
                </TabsTrigger>
                <TabsTrigger value="security_schedule">
                  Security & Schedule
                </TabsTrigger>
                <TabsTrigger value="terms">Terms & Attachments</TabsTrigger>
              </TabsList>

              <div className="w-full h-[78vh] mt-4 space-y-6 overflow-y-auto">
                {/* Basic Information Tab */}
                <TabsContent value="basic">
                  <div className="space-y-8">
                    {/* Basic Tender Information */}
                    <div>
                      <h2 className="text-xl font-semibold">
                        Basic Tender Information
                      </h2>
                      <div className="grid grid-cols-3 gap-6 mt-4">
                        {/* Tender Title */}
                        <div className="space-y-2">
                          <Label htmlFor="title">Tender Subject</Label>
                          <Input
                            id="title"
                            placeholder="Enter tender title"
                            {...register("title")}
                          />
                          {errors.title && (
                            <p className="text-red-500 text-sm">
                              {errors.title.message}
                            </p>
                          )}
                        </div>
                        {/* Tender Industry */}
                        <div className="space-y-2">
                          <Label htmlFor="reference">Industry</Label>
                          <Select
                            value={watch("industry")}
                            onValueChange={(value) =>
                              setValue("industry", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {sectors.map((option: any) => (
                                <SelectItem
                                  key={option.sectorId}
                                  value={option.sectorName}
                                >
                                  {option.sectorName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.industry && (
                            <p className="text-red-500 text-sm">
                              {errors.industry.message}
                            </p>
                          )}
                        </div>

                        {/* Tender Reference Number */}
                        <div className="space-y-2">
                          <Label htmlFor="reference">
                            Tender Reference Number
                          </Label>
                          <Input
                            id="reference"
                            placeholder="Enter reference number"
                            {...register("referenceNumber")}
                          />
                          {errors.referenceNumber && (
                            <p className="text-red-500 text-sm">
                              {errors.referenceNumber.message}
                            </p>
                          )}
                        </div>

                        {/* Estimated Budget */}
                        <div className="space-y-2">
                          <Label htmlFor="budget">Estimated Budget/Value</Label>
                          <Input
                            id="budget"
                            type="number"
                            placeholder="Enter budget"
                            {...register("budget", { valueAsNumber: true })}
                          />
                          {errors.budget && (
                            <p className="text-red-500 text-sm">
                              {errors.budget.message}
                            </p>
                          )}
                        </div>

                        {/* Tender Type */}
                        <div className="space-y-2">
                          <Label>Tender Type</Label>
                          <Select
                            value={watch("tenderType")}
                            onValueChange={(value) =>
                              setValue(
                                "tenderType",
                                value as "open" | "limited" | "direct"
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="limited">Limited</SelectItem>
                              <SelectItem value="direct">Direct</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.tenderType && (
                            <p className="text-red-500 text-sm">
                              {errors.tenderType.message}
                            </p>
                          )}
                        </div>

                        {/* Procurement Category */}
                        <div className="space-y-2">
                          <Label>Procurement Category</Label>
                          <Select
                            value={watch("procurementCategory")}
                            onValueChange={(value) =>
                              setValue(
                                "procurementCategory",
                                value as "goods" | "services" | "works"
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="goods">Goods</SelectItem>
                              <SelectItem value="services">Services</SelectItem>
                              <SelectItem value="works">Works</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.procurementCategory && (
                            <p className="text-red-500 text-sm">
                              {errors.procurementCategory.message}
                            </p>
                          )}
                        </div>

                        {/* Currency */}
                        <div className="space-y-2">
                          <Label>Currency</Label>
                          <Select
                            value={watch("currency")}
                            onValueChange={(value) =>
                              setValue(
                                "currency",
                                value as "usd" | "eur" | "gbp" | "inr"
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="usd">USD</SelectItem>
                              <SelectItem value="eur">EUR</SelectItem>
                              <SelectItem value="gbp">GBP</SelectItem>
                              <SelectItem value="inr">INR</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.currency && (
                            <p className="text-red-500 text-sm">
                              {errors.currency.message}
                            </p>
                          )}
                        </div>

                        {/* Publication Date */}
                        <div className="space-y-2">
                          <Label htmlFor="publicationDate">
                            Publication Date
                          </Label>
                          <Input
                            id="publicationDate"
                            type="date"
                            {...register("publicationDate")}
                          />
                          {errors.publicationDate && (
                            <p className="text-red-500 text-sm">
                              {errors.publicationDate.message}
                            </p>
                          )}
                        </div>

                        {/* Submission Deadline */}
                        <div className="space-y-2">
                          <Label htmlFor="deadline">Submission Deadline</Label>
                          <Input
                            id="deadline"
                            type="datetime-local"
                            {...register("submissionDeadline")}
                          />
                          {errors.submissionDeadline && (
                            <p className="text-red-500 text-sm">
                              {errors.submissionDeadline.message}
                            </p>
                          )}
                        </div>

                        {/* Tender Validity Period */}
                        <div className="space-y-2">
                          <Label htmlFor="validity">
                            Tender Validity Period (Days)
                          </Label>
                          <Input
                            id="validity"
                            type="number"
                            placeholder="Enter validity in days"
                            {...register("validityPeriod", {
                              valueAsNumber: true,
                            })}
                          />
                          {errors.validityPeriod && (
                            <p className="text-red-500 text-sm">
                              {errors.validityPeriod.message}
                            </p>
                          )}
                        </div>

                        {/* Expected Project Duration */}
                        <div className="space-y-2">
                          <Label htmlFor="duration">
                            Expected Project Duration
                          </Label>
                          <Input
                            id="duration"
                            placeholder="Enter duration (e.g., 6 months)"
                            {...register("projectDuration")}
                          />
                          {errors.projectDuration && (
                            <p className="text-red-500 text-sm">
                              {errors.projectDuration.message}
                            </p>
                          )}
                        </div>

                        {/* Project Description (Full Width) */}
                        <div className="space-y-2 col-span-3">
                          <Label htmlFor="description">
                            Project Description
                          </Label>
                          <Textarea
                            id="description"
                            placeholder="Enter project details"
                            className="h-24"
                            {...register("description")}
                          />
                          {errors.description && (
                            <p className="text-red-500 text-sm">
                              {errors.description.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Organization Information */}
                    <div>
                      <h2 className="text-xl font-semibold">
                        Organization Information
                      </h2>
                      <div className="grid grid-cols-3 gap-6 mt-4">
                        {/* Organization Name */}
                        <div className="space-y-2">
                          <Label htmlFor="organization">
                            Organization Name
                          </Label>
                          <Input
                            id="organization"
                            placeholder="Enter organization name"
                            {...register("organizationName")}
                          />
                          {errors.organizationName && (
                            <p className="text-red-500 text-sm">
                              {errors.organizationName.message}
                            </p>
                          )}
                        </div>

                        {/* Department/Division */}
                        <div className="space-y-2">
                          <Label htmlFor="department">
                            Department/Division
                          </Label>
                          <Input
                            id="department"
                            placeholder="Enter department/division"
                            {...register("department")}
                          />
                          {errors.department && (
                            <p className="text-red-500 text-sm">
                              {errors.department.message}
                            </p>
                          )}
                        </div>

                        {/* Contact Person */}
                        <div className="space-y-2">
                          <Label htmlFor="contactPerson">Contact Person</Label>
                          <Input
                            id="contactPerson"
                            placeholder="Enter contact person's name"
                            {...register("contactPerson")}
                          />
                          {errors.contactPerson && (
                            <p className="text-red-500 text-sm">
                              {errors.contactPerson.message}
                            </p>
                          )}
                        </div>

                        {/* Contact Email */}
                        <div className="space-y-2">
                          <Label htmlFor="contactEmail">Contact Email</Label>
                          <Input
                            id="contactEmail"
                            type="email"
                            placeholder="Enter email address"
                            {...register("contactEmail")}
                          />
                          {errors.contactEmail && (
                            <p className="text-red-500 text-sm">
                              {errors.contactEmail.message}
                            </p>
                          )}
                        </div>

                        {/* Contact Phone Number */}
                        <div className="space-y-2">
                          <Label htmlFor="contactPhone">
                            Contact Phone Number
                          </Label>
                          <Input
                            id="contactPhone"
                            type="tel"
                            placeholder="Enter phone number"
                            {...register("contactPhone")}
                          />
                          {errors.contactPhone && (
                            <p className="text-red-500 text-sm">
                              {errors.contactPhone.message}
                            </p>
                          )}
                        </div>

                        {/* Address (Full Width) */}
                        <div className="space-y-2 col-span-3">
                          <Label htmlFor="address">Address</Label>
                          <Textarea
                            id="address"
                            placeholder="Enter full address"
                            className="h-24"
                            {...register("address")}
                          />
                          {errors.address && (
                            <p className="text-red-500 text-sm">
                              {errors.address.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                {/* Eligibility Criteria Tab */}
                <TabsContent value="eligibility">
                  <div className="space-y-8">
                    {/* Eligibility Requirements Section */}
                    <div>
                      <h2 className="text-xl font-semibold">
                        Eligibility Requirements
                      </h2>
                      <div className="grid grid-cols-3 gap-6 mt-4">
                        {/* Minimum Annual Turnover */}
                        <div className="space-y-2">
                          <Label htmlFor="turnover">
                            Minimum Annual Turnover
                          </Label>
                          <Input
                            id="turnover"
                            placeholder="Enter required turnover"
                            type="number"
                            {...register("minTurnover", {
                              valueAsNumber: true,
                            })}
                          />
                          {errors.minTurnover && (
                            <p className="text-red-500 text-sm">
                              {errors.minTurnover.message}
                            </p>
                          )}
                        </div>

                        {/* Years of Experience */}
                        <div className="space-y-2">
                          <Label htmlFor="experience">
                            Years of Experience Required
                          </Label>
                          <Input
                            id="experience"
                            type="number"
                            placeholder="Enter years"
                            {...register("experienceYears", {
                              valueAsNumber: true,
                            })}
                          />
                          {errors.experienceYears && (
                            <p className="text-red-500 text-sm">
                              {errors.experienceYears.message}
                            </p>
                          )}
                        </div>

                        {/* Previous Similar Projects */}
                        <div className="space-y-2 col-span-3">
                          <Label htmlFor="previousProjects">
                            Previous Similar Projects
                          </Label>
                          <Textarea
                            id="previousProjects"
                            placeholder="List previous projects"
                            className="h-24"
                            {...register("similarProjects")}
                          />
                          {errors.similarProjects && (
                            <p className="text-red-500 text-sm">
                              {errors.similarProjects.message}
                            </p>
                          )}
                        </div>

                        {/* Required Certifications/Licenses */}
                        <div className="space-y-2 col-span-3">
                          <Label htmlFor="certifications">
                            Required Certifications/Licenses
                          </Label>
                          <Textarea
                            id="certifications"
                            placeholder="List required certifications/licenses"
                            className="h-24"
                            {...register("requiredCertifications")}
                          />
                          {errors.requiredCertifications && (
                            <p className="text-red-500 text-sm">
                              {errors.requiredCertifications.message}
                            </p>
                          )}
                        </div>

                        {/* Legal Requirements */}
                        <div className="space-y-2 col-span-3">
                          <Label htmlFor="legal">Legal Requirements</Label>
                          <Textarea
                            id="legal"
                            placeholder="List legal requirements"
                            className="h-24"
                            {...register("legalRequirements")}
                          />
                          {errors.legalRequirements && (
                            <p className="text-red-500 text-sm">
                              {errors.legalRequirements.message}
                            </p>
                          )}
                        </div>

                        {/* Financial Standing Requirements */}
                        <div className="space-y-2">
                          <Label htmlFor="financialStanding">
                            Financial Standing Requirements
                          </Label>
                          <Input
                            id="financialStanding"
                            placeholder="Enter financial requirements"
                            {...register("financialStanding")}
                          />
                          {errors.financialStanding && (
                            <p className="text-red-500 text-sm">
                              {errors.financialStanding.message}
                            </p>
                          )}
                        </div>

                        {/* Technical Capability Requirements */}
                        <div className="space-y-2">
                          <Label htmlFor="technicalCapability">
                            Technical Capability Requirements
                          </Label>
                          <Input
                            id="technicalCapability"
                            placeholder="Enter technical requirements"
                            {...register("technicalCapability")}
                          />
                          {errors.technicalCapability && (
                            <p className="text-red-500 text-sm">
                              {errors.technicalCapability.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

              {/* Technical Specifications Tab */}
              <TabsContent value="technical">
                <div className="space-y-8">
                  {/* Technical Specifications Section */}
                  <div>
                    <h2 className="text-xl font-semibold">
                      Technical Specifications
                    </h2>
                    <div className="grid grid-cols-3 gap-6 mt-4">
                      {/* Detailed Scope of Work */}
                      <div className="space-y-2 col-span-3">
                        <Label htmlFor="scope">Detailed Scope of Work</Label>
                        <Textarea
                          id="scope"
                          placeholder="Describe scope of work"
                          className="h-24"
                          {...register("scopeOfWork")}
                        />
                        {errors.scopeOfWork && (
                          <p className="text-red-500 text-sm">
                            {errors.scopeOfWork.message}
                          </p>
                        )}
                      </div>

                        {/* Technical Requirements */}
                        <div className="space-y-2 col-span-3">
                          <Label htmlFor="requirements">
                            Technical Requirements
                          </Label>
                          <Textarea
                            id="requirements"
                            placeholder="Enter technical requirements"
                            className="h-24"
                            {...register("technicalRequirements")}
                          />
                          {errors.technicalRequirements && (
                            <p className="text-red-500 text-sm">
                              {errors.technicalRequirements.message}
                            </p>
                          )}
                        </div>

                        {/* Quality Standards */}
                        <div className="space-y-2">
                          <Label htmlFor="quality">Quality Standards</Label>
                          <Input
                            id="quality"
                            placeholder="Enter quality expectations"
                            {...register("qualityStandards")}
                          />
                          {errors.qualityStandards && (
                            <p className="text-red-500 text-sm">
                              {errors.qualityStandards.message}
                            </p>
                          )}
                        </div>

                        {/* Delivery Timeline */}
                        <div className="space-y-2">
                          <Label htmlFor="timeline">Delivery Timeline</Label>
                          <Input
                            id="timeline"
                            placeholder="Enter estimated timeline"
                            {...register("deliveryTimeline")}
                          />
                          {errors.deliveryTimeline && (
                            <p className="text-red-500 text-sm">
                              {errors.deliveryTimeline.message}
                            </p>
                          )}
                        </div>

                        {/* Acceptance Criteria */}
                        <div className="space-y-2 col-span-3">
                          <Label htmlFor="acceptance">
                            Acceptance Criteria
                          </Label>
                          <Textarea
                            id="acceptance"
                            placeholder="Define acceptance criteria"
                            className="h-24"
                            {...register("acceptanceCriteria")}
                          />
                          {errors.acceptanceCriteria && (
                            <p className="text-red-500 text-sm">
                              {errors.acceptanceCriteria.message}
                            </p>
                          )}
                        </div>

                        {/* Performance Metrics */}
                        <div className="space-y-2">
                          <Label htmlFor="performance">
                            Performance Metrics
                          </Label>
                          <Input
                            id="performance"
                            placeholder="Enter performance criteria"
                            {...register("performanceMetrics")}
                          />
                          {errors.performanceMetrics && (
                            <p className="text-red-500 text-sm">
                              {errors.performanceMetrics.message}
                            </p>
                          )}
                        </div>

                        {/* Required Deliverables */}
                        <div className="space-y-2 col-span-3">
                          <Label htmlFor="deliverables">
                            Required Deliverables
                          </Label>
                          <Textarea
                            id="deliverables"
                            placeholder="List expected deliverables"
                            className="h-24"
                            {...register("requiredDeliverables")}
                          />
                          {errors.requiredDeliverables && (
                            <p className="text-red-500 text-sm">
                              {errors.requiredDeliverables.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Evaluation Criteria Section */}
                    <div>
                      <h2 className="text-xl font-semibold">
                        Evaluation Criteria
                      </h2>
                      <div className="grid grid-cols-3 gap-6 mt-4">
                        {/* Technical Evaluation Weight */}
                        <div className="space-y-2">
                          <Label htmlFor="techWeight">
                            Technical Evaluation Weight (%)
                          </Label>
                          <Input
                            id="techWeight"
                            type="number"
                            placeholder="Enter percentage"
                            {...register("technicalWeight", {
                              valueAsNumber: true,
                            })}
                          />
                          {errors.technicalWeight && (
                            <p className="text-red-500 text-sm">
                              {errors.technicalWeight.message}
                            </p>
                          )}
                        </div>

                        {/* Financial Evaluation Weight */}
                        <div className="space-y-2">
                          <Label htmlFor="financeWeight">
                            Financial Evaluation Weight (%)
                          </Label>
                          <Input
                            id="financeWeight"
                            type="number"
                            placeholder="Enter percentage"
                            {...register("financialWeight", {
                              valueAsNumber: true,
                            })}
                          />
                          {errors.financialWeight && (
                            <p className="text-red-500 text-sm">
                              {errors.financialWeight.message}
                            </p>
                          )}
                        </div>

                        {/* Technical Qualification Threshold */}
                        <div className="space-y-2">
                          <Label htmlFor="qualificationThreshold">
                            Technical Qualification Threshold
                          </Label>
                          <Input
                            id="qualificationThreshold"
                            type="number"
                            placeholder="Enter threshold score"
                            {...register("qualificationThreshold", {
                              valueAsNumber: true,
                            })}
                          />
                          {errors.qualificationThreshold && (
                            <p className="text-red-500 text-sm">
                              {errors.qualificationThreshold.message}
                            </p>
                          )}
                        </div>

                        {/* Evaluation Methodology */}
                        <div className="space-y-2">
                          <Label>Evaluation Methodology</Label>
                          <Select
                            value={watch("evaluationMethodology")}
                            onValueChange={(value) =>
                              setValue(
                                "evaluationMethodology",
                                value as
                                  | "quality_cost"
                                  | "least_cost"
                                  | "fixed_budget"
                                  | "quality_based"
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select methodology" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="quality_cost">
                                Quality & Cost-Based
                              </SelectItem>
                              <SelectItem value="least_cost">
                                Least Cost
                              </SelectItem>
                              <SelectItem value="fixed_budget">
                                Fixed Budget
                              </SelectItem>
                              <SelectItem value="quality_based">
                                Quality-Based
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.evaluationMethodology && (
                            <p className="text-red-500 text-sm">
                              {errors.evaluationMethodology.message}
                            </p>
                          )}
                        </div>

                        {/* Scoring System */}
                        <div className="space-y-2 col-span-3">
                          <Label htmlFor="scoringSystem">Scoring System</Label>
                          <Textarea
                            id="scoringSystem"
                            placeholder="Describe the scoring system"
                            className="h-24"
                            {...register("scoringSystem")}
                          />
                          {errors.scoringSystem && (
                            <p className="text-red-500 text-sm">
                              {errors.scoringSystem.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Security & Schedule Tab */}
                <TabsContent value="security_schedule">
                  <div className="space-y-8">
                    {/* Bid Security Section */}
                    <div>
                      <h2 className="text-xl font-semibold">Bid Security</h2>
                      <div className="grid grid-cols-3 gap-6 mt-4">
                        {/* Bid Security Amount */}
                        <div className="space-y-2">
                          <Label htmlFor="bidSecurityAmount">
                            Bid Security Amount
                          </Label>
                          <Input
                            id="bidSecurityAmount"
                            type="number"
                            placeholder="Enter security amount"
                            {...register("bidSecurityAmount", {
                              valueAsNumber: true,
                            })}
                          />
                          {errors.bidSecurityAmount && (
                            <p className="text-red-500 text-sm">
                              {errors.bidSecurityAmount.message}
                            </p>
                          )}
                        </div>

                        {/* Bid Security Form */}
                        <div className="space-y-2">
                          <Label>Bid Security Form</Label>
                          <Select
                            value={watch("bidSecurityForm")}
                            onValueChange={(value) =>
                              setValue(
                                "bidSecurityForm",
                                value as "bank_guarantee" | "cash_deposit"
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select form" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bank_guarantee">
                                Bank Guarantee
                              </SelectItem>
                              <SelectItem value="cash_deposit">
                                Cash Deposit
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.bidSecurityForm && (
                            <p className="text-red-500 text-sm">
                              {errors.bidSecurityForm.message}
                            </p>
                          )}
                        </div>

                        {/* Validity Period of Bid Security */}
                        <div className="space-y-2">
                          <Label htmlFor="bidSecurityValidity">
                            Validity Period of Bid Security
                          </Label>
                          <Input
                            id="bidSecurityValidity"
                            type="number"
                            placeholder="Enter validity in days"
                            {...register("bidSecurityValidity", {
                              valueAsNumber: true,
                            })}
                          />
                          {errors.bidSecurityValidity && (
                            <p className="text-red-500 text-sm">
                              {errors.bidSecurityValidity.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Submission Requirements Section */}
                    <div>
                      <h2 className="text-xl font-semibold">
                        Submission Requirements
                      </h2>
                      <div className="grid grid-cols-3 gap-6 mt-4">
                        {/* Submission Method */}
                        <div className="space-y-2">
                          <Label>Submission Method</Label>
                          <Select
                            value={watch("submissionMethod")}
                            onValueChange={(value) =>
                              setValue(
                                "submissionMethod",
                                value as "electronic" | "physical" | "both"
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="electronic">
                                Electronic
                              </SelectItem>
                              <SelectItem value="physical">Physical</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.submissionMethod && (
                            <p className="text-red-500 text-sm">
                              {errors.submissionMethod.message}
                            </p>
                          )}
                        </div>

                        {/* Required Number of Copies */}
                        <div className="space-y-2">
                          <Label htmlFor="numCopies">
                            Required Number of Copies
                          </Label>
                          <Input
                            id="numCopies"
                            type="number"
                            placeholder="Enter number of copies"
                            {...register("copiesRequired", {
                              valueAsNumber: true,
                            })}
                          />
                          {errors.copiesRequired && (
                            <p className="text-red-500 text-sm">
                              {errors.copiesRequired.message}
                            </p>
                          )}
                        </div>

                        {/* Format Requirements */}
                        <div className="space-y-2 col-span-3">
                          <Label htmlFor="formatRequirements">
                            Format Requirements
                          </Label>
                          <Textarea
                            id="formatRequirements"
                            placeholder="Describe format requirements"
                            className="h-24"
                            {...register("formatRequirements")}
                          />
                          {errors.formatRequirements && (
                            <p className="text-red-500 text-sm">
                              {errors.formatRequirements.message}
                            </p>
                          )}
                        </div>

                        {/* Supporting Documents Checklist */}
                        <div className="space-y-2 col-span-3">
                          <Label htmlFor="supportingDocs">
                            Supporting Documents Checklist
                          </Label>
                          <Textarea
                            id="supportingDocs"
                            placeholder="List required documents"
                            className="h-24"
                            {...register("supportingDocuments")}
                          />
                          {errors.supportingDocuments && (
                            <p className="text-red-500 text-sm">
                              {errors.supportingDocuments.message}
                            </p>
                          )}
                        </div>

                        {/* Pre-qualification Documents Required */}
                        <div className="space-y-2 col-span-3">
                          <Label htmlFor="preQualificationDocs">
                            Pre-qualification Documents Required
                          </Label>
                          <Textarea
                            id="preQualificationDocs"
                            placeholder="List pre-qualification documents"
                            className="h-24"
                            {...register("preQualificationDocs")}
                          />
                          {errors.preQualificationDocs && (
                            <p className="text-red-500 text-sm">
                              {errors.preQualificationDocs.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Schedule of Events Section */}
                    <div>
                      <h2 className="text-xl font-semibold">
                        Schedule of Events
                      </h2>
                      <div className="grid grid-cols-3 gap-6 mt-4">
                        {/* Pre-bid Meeting Date */}
                        <div className="space-y-2">
                          <Label htmlFor="preBidMeeting">
                            Pre-bid Meeting Date
                          </Label>
                          <Input
                            id="preBidMeeting"
                            type="date"
                            {...register("preBidMeeting")}
                          />
                          {errors.preBidMeeting && (
                            <p className="text-red-500 text-sm">
                              {errors.preBidMeeting.message}
                            </p>
                          )}
                        </div>

                        {/* Site Visit Date */}
                        <div className="space-y-2">
                          <Label htmlFor="siteVisit">
                            Site Visit Date (if applicable)
                          </Label>
                          <Input
                            id="siteVisit"
                            type="date"
                            {...register("siteVisit")}
                          />
                          {errors.siteVisit && (
                            <p className="text-red-500 text-sm">
                              {errors.siteVisit.message}
                            </p>
                          )}
                        </div>

                        {/* Query Submission Deadline */}
                        <div className="space-y-2">
                          <Label htmlFor="queryDeadline">
                            Query Submission Deadline
                          </Label>
                          <Input
                            id="queryDeadline"
                            type="date"
                            {...register("queryDeadline")}
                          />
                          {errors.queryDeadline && (
                            <p className="text-red-500 text-sm">
                              {errors.queryDeadline.message}
                            </p>
                          )}
                        </div>

                        {/* Response to Queries Date */}
                        <div className="space-y-2">
                          <Label htmlFor="responseQueries">
                            Response to Queries Date
                          </Label>
                          <Input
                            id="responseQueries"
                            type="date"
                            {...register("responseToQueries")}
                          />
                          {errors.responseToQueries && (
                            <p className="text-red-500 text-sm">
                              {errors.responseToQueries.message}
                            </p>
                          )}
                        </div>

                        {/* Technical Bid Opening Date */}
                        <div className="space-y-2">
                          <Label htmlFor="techBidOpening">
                            Technical Bid Opening Date
                          </Label>
                          <Input
                            id="techBidOpening"
                            type="date"
                            {...register("techBidOpening")}
                          />
                          {errors.techBidOpening && (
                            <p className="text-red-500 text-sm">
                              {errors.techBidOpening.message}
                            </p>
                          )}
                        </div>

                        {/* Financial Bid Opening Date */}
                        <div className="space-y-2">
                          <Label htmlFor="financeBidOpening">
                            Financial Bid Opening Date
                          </Label>
                          <Input
                            id="financeBidOpening"
                            type="date"
                            {...register("financeBidOpening")}
                          />
                          {errors.financeBidOpening && (
                            <p className="text-red-500 text-sm">
                              {errors.financeBidOpening.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                {/* Terms & Attachments Tab */}
                <TabsContent value="terms">
                  <div className="space-y-8">
                    {/* Terms and Conditions Section */}
                    <div>
                      <h2 className="text-xl font-semibold">
                        Terms and Conditions
                      </h2>
                      <div className="grid grid-cols-3 gap-6 mt-4">
                        {/* Payment Terms */}
                        <div className="space-y-2">
                          <Label htmlFor="paymentTerms">Payment Terms</Label>
                          <Textarea
                            id="paymentTerms"
                            placeholder="Describe payment terms"
                            className="h-24"
                            {...register("paymentTerms")}
                          />
                          {errors.paymentTerms && (
                            <p className="text-red-500 text-sm">
                              {errors.paymentTerms.message}
                            </p>
                          )}
                        </div>

                        {/* Warranty Requirements */}
                        <div className="space-y-2">
                          <Label htmlFor="warranty">
                            Warranty Requirements
                          </Label>
                          <Textarea
                            id="warranty"
                            placeholder="Describe warranty terms"
                            className="h-24"
                            {...register("warrantyRequirements")}
                          />
                          {errors.warrantyRequirements && (
                            <p className="text-red-500 text-sm">
                              {errors.warrantyRequirements.message}
                            </p>
                          )}
                        </div>

                        {/* Insurance Requirements */}
                        <div className="space-y-2">
                          <Label htmlFor="insurance">
                            Insurance Requirements
                          </Label>
                          <Textarea
                            id="insurance"
                            placeholder="Describe insurance requirements"
                            className="h-24"
                            {...register("insuranceRequirements")}
                          />
                          {errors.insuranceRequirements && (
                            <p className="text-red-500 text-sm">
                              {errors.insuranceRequirements.message}
                            </p>
                          )}
                        </div>

                        {/* Sub-contracting Rules */}
                        <div className="space-y-2 col-span-3">
                          <Label htmlFor="subContracting">
                            Sub-contracting Rules
                          </Label>
                          <Textarea
                            id="subContracting"
                            placeholder="Specify rules for sub-contracting"
                            className="h-24"
                            {...register("subContractingRules")}
                          />
                          {errors.subContractingRules && (
                            <p className="text-red-500 text-sm">
                              {errors.subContractingRules.message}
                            </p>
                          )}
                        </div>

                        {/* Contract Amendment Provisions */}
                        <div className="space-y-2 col-span-3">
                          <Label htmlFor="contractAmendments">
                            Contract Amendment Provisions
                          </Label>
                          <Textarea
                            id="contractAmendments"
                            placeholder="Describe amendment provisions"
                            className="h-24"
                            {...register("contractAmendment")}
                          />
                          {errors.contractAmendment && (
                            <p className="text-red-500 text-sm">
                              {errors.contractAmendment.message}
                            </p>
                          )}
                        </div>

                        {/* Dispute Resolution Mechanism */}
                        <div className="space-y-2">
                          <Label htmlFor="disputeResolution">
                            Dispute Resolution Mechanism
                          </Label>
                          <Textarea
                            id="disputeResolution"
                            placeholder="Describe dispute resolution methods"
                            className="h-24"
                            {...register("disputeResolution")}
                          />
                          {errors.disputeResolution && (
                            <p className="text-red-500 text-sm">
                              {errors.disputeResolution.message}
                            </p>
                          )}
                        </div>

                        {/* Force Majeure Clauses */}
                        <div className="space-y-2">
                          <Label htmlFor="forceMajeure">
                            Force Majeure Clauses
                          </Label>
                          <Textarea
                            id="forceMajeure"
                            placeholder="Describe force majeure clauses"
                            className="h-24"
                            {...register("forceMajeure")}
                          />
                          {errors.forceMajeure && (
                            <p className="text-red-500 text-sm">
                              {errors.forceMajeure.message}
                            </p>
                          )}
                        </div>

                        {/* Termination Conditions */}
                        <div className="space-y-2">
                          <Label htmlFor="termination">
                            Termination Conditions
                          </Label>
                          <Textarea
                            id="termination"
                            placeholder="Describe contract termination conditions"
                            className="h-24"
                            {...register("terminationConditions")}
                          />
                          {errors.terminationConditions && (
                            <p className="text-red-500 text-sm">
                              {errors.terminationConditions.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Attachments Section */}
                    <div>
                      <h2 className="text-xl font-semibold">Attachments</h2>
                      <div className="grid grid-cols-3 gap-6 mt-4">
                        {/* Standard Bidding Documents */}
                        <div className="space-y-2">
                          <Label htmlFor="biddingDocs">
                            Standard Bidding Documents
                          </Label>
                          <Input
                            id="biddingDocs"
                            type="file"
                            {...register("biddingDocs")}
                          />
                          {errors.biddingDocs && (
                            <p className="text-red-500 text-sm">
                              {errors.biddingDocs?.message?.toString()}
                            </p>
                          )}
                        </div>

                        {/* Technical Specification Documents */}
                        <div className="space-y-2">
                          <Label htmlFor="techSpecs">
                            Technical Specification Documents
                          </Label>
                          <Input
                            id="techSpecs"
                            type="file"
                            {...register("techSpecsDocs")}
                          />
                          {errors.techSpecsDocs && (
                            <p className="text-red-500 text-sm">
                              {errors.techSpecsDocs?.message?.toString()}
                            </p>
                          )}
                        </div>

                        {/* Draft Contract */}
                        <div className="space-y-2">
                          <Label htmlFor="draftContract">Draft Contract</Label>
                          <Input
                            id="draftContract"
                            type="file"
                            {...register("draftContract")}
                          />
                          {errors.draftContract && (
                            <p className="text-red-500 text-sm">
                              {errors.draftContract?.message?.toString()}
                            </p>
                          )}
                        </div>

                        {/* Bill of Quantities/Price Schedule Template */}
                        <div className="space-y-2">
                          <Label htmlFor="billQuantities">
                            Bill of Quantities/Price Schedule
                          </Label>
                          <Input
                            id="billQuantities"
                            type="file"
                            {...register("billQuantities")}
                          />
                          {errors.billQuantities && (
                            <p className="text-red-500 text-sm">
                              {errors.billQuantities?.message?.toString()}
                            </p>
                          )}
                        </div>

                        {/* Special Instructions Document */}
                        <div className="space-y-2">
                          <Label htmlFor="specialInstructions">
                            Special Instructions Document
                          </Label>
                          <Input
                            id="specialInstructions"
                            type="file"
                            {...register("specialInstructions")}
                          />
                          {errors.specialInstructions && (
                            <p className="text-red-500 text-sm">
                              {errors.specialInstructions?.message?.toString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            {/* Submit Button */}
            <DialogFooter>
              <div className="flex justify-end mt-6">
                <Button type="submit">Submit</Button>
              </div>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDraftModalForm;
