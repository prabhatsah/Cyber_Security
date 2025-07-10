"use client";
import { Form } from "@/shadcn/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { sectors } from "../../../_utils/common/sector";
import { Button } from "@/shadcn/ui/button";
import { ArrowLeftFromLine, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  editRfpData,
  startRfpDraft,
} from "../../../_utils/buyer/my-rfps/invoke-create-draft";
import { toast } from "sonner";
import { startTransition, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getProjectDetailsData } from "../../../_utils/common/get-particular-project-details-data";
import { RfpDraft } from "../../../_utils/common/types";
import departmentsData from "../../../_utils/common/departments";
// const tenderSchema = z.object({
//   // Basic Tender Information
//   title: z.string().min(1, "Tender Subject is required"),
//   referenceNumber: z.string().min(1, "Tender Reference Number is required"),
//   description: z.string().min(1, "Project Description is required"),
//   tenderType: z
//     .enum(["open", "limited", "direct"])
//     .refine((val) => val !== undefined, {
//       message: "Tender Type is required",
//     }),
//   procurementCategory: z
//     .enum(["goods", "services", "works"])
//     .refine((val) => val !== undefined, {
//       message: "Procurement Category is required",
//     }),
//   budget: z.number().min(0, "Estimated Budget/Value must be a positive number"),
//   industry: z.string().min(1, "Industry is required"),
//   currency: z.string().min(1, "Currency is required"),
//   publicationDate: z.string().min(1, "Publication Date is required"),
//   submissionDeadline: z.string().min(1, "Submission Deadline is required"),
//   validityPeriod: z
//     .number()
//     .min(1, "Tender Validity Period must be at least 1 day"),
//   projectDuration: z.string().min(1, "Expected Project Duration is required"),

//   // Procuring Entity Information
//   organizationName: z.string().min(1, "Organization Name is required"),
//   department: z.string().optional(),
//   contactPerson: z.string().min(1, "Contact Person is required"),
//   contactEmail: z.string().email("Invalid email format"),
//   contactPhone: z.string().min(1, "Contact Phone Number is required"),
//   address: z.string().min(1, "Address is required"),

//   // Eligibility Criteria
//   minTurnover: z
//     .number()
//     .min(0, "Minimum Annual Turnover must be a positive number"),
//   experienceYears: z
//     .number()
//     .min(0, "Years of Experience Required must be a positive number"),
//   similarProjects: z.string().optional(),
//   requiredCertifications: z.string().optional(),
//   legalRequirements: z.string().optional(),
//   financialStanding: z.string().optional(),
//   technicalCapability: z.string().optional(),

//   // Technical Specifications
//   scopeOfWork: z.string().min(1, "Detailed Scope of Work is required"),
//   technicalRequirements: z.string().optional(),
//   qualityStandards: z.string().optional(),
//   deliveryTimeline: z.string().optional(),
//   acceptanceCriteria: z.string().optional(),
//   performanceMetrics: z.string().optional(),
//   requiredDeliverables: z.string().optional(),

//   // Evaluation Criteria
//   technicalWeight: z
//     .number()
//     .min(0)
//     .max(100, "Technical Evaluation Weight must be between 0-100"),
//   financialWeight: z
//     .number()
//     .min(0)
//     .max(100, "Financial Evaluation Weight must be between 0-100"),
//   qualificationThreshold: z
//     .number()
//     .min(0)
//     .max(100, "Technical Qualification Threshold must be between 0-100"),
//   evaluationMethodology: z.string().optional(),
//   scoringSystem: z.string().optional(),

//   // Bid Security
//   bidSecurityAmount: z
//     .number()
//     .min(0, "Bid Security Amount must be a positive number"),
//   bidSecurityForm: z
//     .enum(["bank_guarantee", "cash_deposit"])
//     .refine((val) => val !== undefined, {
//       message: "Bid Security Form is required",
//     }),
//   bidSecurityValidity: z
//     .number()
//     .min(1, "Validity Period of Bid Security must be at least 1 day"),

//   // Submission Requirements
//   submissionMethod: z
//     .enum(["electronic", "physical", "both"])
//     .refine((val) => val !== undefined, {
//       message: "Submission Method is required",
//     }),
//   copiesRequired: z
//     .number()
//     .min(1, "Required Number of Copies must be at least 1"),
//   formatRequirements: z.string().optional(),
//   supportingDocuments: z.string().optional(),
//   preQualificationDocs: z.string().optional(),

//   // Schedule of Events
//   preBidMeeting: z.string().optional(),
//   siteVisit: z.string().optional(),
//   queryDeadline: z.string().optional(),
//   responseToQueries: z.string().optional(),

//   techBidOpening: z.string().optional(),

//   financeBidOpening: z.string().optional(),

//   // Terms and Conditions
//   paymentTerms: z.string().optional(),
//   warrantyRequirements: z.string().optional(),
//   insuranceRequirements: z.string().optional(),
//   subContractingRules: z.string().optional(),
//   contractAmendment: z.string().optional(),
//   disputeResolution: z.string().optional(),
//   forceMajeure: z.string().optional(),
//   terminationConditions: z.string().optional(),

//   // Attachments
//   biddingDocs: z.any().optional(),
//   techSpecsDocs: z.any().optional(),
//   draftContract: z.any().optional(),
//   billQuantities: z.any().optional(),
//   specialInstructions: z.any().optional(),
// });
const tenderSchema = z.object({
  // Basic Tender Information
  title: z.string().optional(),
  referenceNumber: z.string().optional(),
  description: z.string().optional(),
  tenderType: z.enum(["open", "limited", "direct"]).optional(),
  procurementCategory: z.enum(["goods", "services", "works"]).optional(),
  budget: z.number().optional(),
  industry: z.string().optional(),
  currency: z.string().optional(),
  publicationDate: z.string().optional(),
  submissionDeadline: z.string().optional(),
  validityPeriod: z.number().optional(),
  projectDuration: z.string().optional(),
  tender_department: z.string().min(1, "Department is required"),
  sector: z.string().min(1, "Sector is required"),
  product_service: z.string().min(1, "Service is required"),

  // Procuring Entity Information
  organizationName: z.string().optional(),
  department: z.string().optional(),
  contactPerson: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),

  // Eligibility Criteria
  minTurnover: z.number().optional(),
  experienceYears: z.number().optional(),
  similarProjects: z.string().optional(),
  requiredCertifications: z.string().optional(),
  legalRequirements: z.string().optional(),
  financialStanding: z.string().optional(),
  technicalCapability: z.string().optional(),

  // Technical Specifications
  scopeOfWork: z.string().optional(),
  technicalRequirements: z.string().optional(),
  qualityStandards: z.string().optional(),
  deliveryTimeline: z.string().optional(),
  acceptanceCriteria: z.string().optional(),
  performanceMetrics: z.string().optional(),
  requiredDeliverables: z.string().optional(),

  // Evaluation Criteria
  technicalWeight: z.number().optional(),
  financialWeight: z.number().optional(),
  qualificationThreshold: z.number().optional(),
  evaluationMethodology: z.string().optional(),
  scoringSystem: z.string().optional(),

  // Bid Security
  bidSecurityAmount: z.number().optional(),
  bidSecurityForm: z.enum(["bank_guarantee", "cash_deposit"]).optional(),

  // Submission Requirements
  submissionMethod: z.enum(["electronic", "physical", "both"]).optional(),

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
  // biddingDocs: z.any().refine((file) => file instanceof File, {
  //   message: "Bidding documents are required.",
  // }),
  // techSpecsDocs: z.any().refine((file) => file instanceof File, {
  //   message: "Technical specifications documents are required.",
  // }),
  // draftContract: z.any().refine((file) => file instanceof File, {
  //   message: "Draft contract is required.",
  // }),
  // billQuantities: z.any().refine((file) => file instanceof File, {
  //   message: "Bill of quantities is required.",
  // }),
  // specialInstructions: z.any().refine((file) => file instanceof File, {
  //   message: "Special instructions document is required.",
  // }),
});

type CreateDraftFormData = z.infer<typeof tenderSchema>;

export default function CreateNewTender() {
  const form = useForm<CreateDraftFormData>({
    resolver: zodResolver(tenderSchema),
  });
  const handleGenerateUUID = () => {
    const newUUID = uuidv4();
    console.log("Generated UUID:", newUUID);
    return newUUID;
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draftId");
  console.log("Draft ID.......:", draftId);
  useEffect(() => {
    form.reset();

    const fetchDraftData = async () => {
      if (draftId) {
        try {
          const formData = await getProjectDetailsData(draftId);

          // Populate form fields with fetched data
          Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === "object" && value?.resourceName) {
              // Creating a File object placeholder with the file metadata
              const file = new File([""], value.resourceName, {
                type: value.resourceType || "application/octet-stream",
              });

              form.setValue(key, [file]); // Setting value for file input
            } else {
              form.setValue(key, value);
            }
          });
        } catch (error) {
          console.error("Error fetching draft data:", error);
        }
      } else {
        // Reset form when dialog opens without a draft ID
        form.reset();
      }
    };

    fetchDraftData();
  }, [draftId]);
  const onSubmit: SubmitHandler<CreateDraftFormData> = async (data) => {
    try {
      console.log("Form Data:", data);
      if (draftId) {
        console.log("updating draft");
        const payload = { ...data, id: draftId };
        const res = await editRfpData(draftId, payload);
        console.log("edited");
        // window.history.back();
      } else {
        console.log("creating draft");
        console.log("Form Data:", data);
        const uuid = handleGenerateUUID();
        const payload = { ...data, id: uuid };
        const response = await startRfpDraft(payload);
        console.log("started");
        // window.history.back();
        toast.success("Details Saved Successfully");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to perform action");
    }
    //onClose(); // Close the dialog on successful submission
    router.replace(`/tender-management/buyer/my-rfps`);
    // startTransition(() => {
    //   router.refresh();
    // });
  };

  // State
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);
  const [availableProducts, setAvailableProducts] = useState<string[]>([]);

  // ------------------- Department Change -------------------
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    form.setValue("tender_department", value);

    const department = departmentsData.find((d) => d.department === value);

    if (department) {
      setAvailableSectors(department.sectors || []);
    } else {
      setAvailableSectors([]);
    }

    setSelectedSector("");
    form.setValue("sector", "");
    form.setValue("product_service", "");
    setAvailableProducts([]);
  };

  // ------------------- Sector Change -------------------
  const handleSectorChange = (value: string) => {
    setSelectedSector(value);
    form.setValue("sector", value);
    form.setValue("product_service", "");

    const department = departmentsData.find(
      (d) => d.department === selectedDepartment
    );

    if (department) {
      setAvailableProducts(department.productsServices || []);
    } else {
      setAvailableProducts([]);
    }
  };

  // ------------------- Populate on Load (Edit Mode) -------------------
  useEffect(() => {
    const { tender_department, sector, product_service } = form.getValues();

    if (tender_department) {
      const departmentData = departmentsData.find(
        (d) => d.department === tender_department
      );

      if (departmentData) {
        setSelectedDepartment(tender_department);
        setAvailableSectors(departmentData.sectors || []);

        if (sector && departmentData.sectors.includes(sector)) {
          setSelectedSector(sector);
          setAvailableProducts(departmentData.productsServices || []);
        }

        if (product_service) {
          form.setValue("product_service", product_service);
        }
      }
    }
  }, [departmentsData]);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 overflow-y-auto h-[87dvh]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span title="Back to My Tenders" className="cursor-pointer">
                {" "}
                <Link href={"/tender-management/buyer/my-rfps"}>
                  <ArrowLeftFromLine />
                </Link>
              </span>

              <h1 className="text-2xl font-semi-bold ">
                {draftId ? "Save Tender" : "Create New Tender"}
              </h1>
            </div>

            <Button type="submit" className="me-3">
              {draftId ? <Pencil /> : <Plus />}
              {draftId ? "Edit Tender" : "Create New Tender"}
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 mt-4">
                {/* Tender Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Tender Subject</Label>
                  <Input
                    id="title"
                    placeholder="Enter tender title"
                    {...form.register("title")}
                  />
                  {form.formState.errors.title && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>
                {/* Department Select */}
                <div className="space-y-2">
                  <Label htmlFor="tender_department">Department</Label>
                  <Select
                    value={form.watch("tender_department")}
                    onValueChange={handleDepartmentChange}
                  >
                    <SelectTrigger id="tender_department">
                      <SelectValue placeholder="Choose department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentsData.map((dept) => (
                        <SelectItem
                          key={dept.department}
                          value={dept.department}
                        >
                          {dept.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sector Select */}
                <div className="space-y-2">
                  <Label htmlFor="sector">Sector</Label>
                  <Select
                    value={form.watch("sector")}
                    onValueChange={handleSectorChange}
                  >
                    <SelectTrigger id="sector">
                      <SelectValue placeholder="Choose sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product/Service Select */}
                <div className="space-y-2">
                  <Label htmlFor="product_service">Product/Service</Label>
                  <Select
                    value={form.watch("product_service")}
                    onValueChange={(value) =>
                      form.setValue("product_service", value)
                    }
                  >
                    <SelectTrigger id="product_service">
                      <SelectValue placeholder="Choose product/service" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts.map((product) => (
                        <SelectItem key={product} value={product}>
                          {product}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tender Reference Number */}
                <div className="space-y-2">
                  <Label htmlFor="reference">Tender Reference Number</Label>
                  <Input
                    id="reference"
                    placeholder="Enter reference number"
                    {...form.register("referenceNumber")}
                  />
                  {form.formState.errors.referenceNumber && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.referenceNumber.message}
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
                    {...form.register("budget", { valueAsNumber: true })}
                  />
                  {form.formState.errors.budget && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.budget.message}
                    </p>
                  )}
                </div>

                {/* Tender Type */}
                <div className="space-y-2">
                  <Label>Tender Type</Label>
                  <Select
                    value={form.watch("tenderType")}
                    onValueChange={(value) =>
                      form.setValue(
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
                  {form.formState.errors.tenderType && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.tenderType.message}
                    </p>
                  )}
                </div>

                {/* Procurement Category */}
                <div className="space-y-2">
                  <Label>Procurement Category</Label>
                  <Select
                    value={form.watch("procurementCategory")}
                    onValueChange={(value) =>
                      form.setValue(
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
                  {form.formState.errors.procurementCategory && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.procurementCategory.message}
                    </p>
                  )}
                </div>

                {/* Currency */}
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={form.watch("currency")}
                    onValueChange={(value) =>
                      form.setValue(
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
                  {form.formState.errors.currency && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.currency.message}
                    </p>
                  )}
                </div>

                {/* Publication Date */}
                <div className="space-y-2">
                  <Label htmlFor="publicationDate">Publication Date</Label>
                  <Input
                    id="publicationDate"
                    type="date"
                    {...form.register("publicationDate")}
                  />
                  {form.formState.errors.publicationDate && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.publicationDate.message}
                    </p>
                  )}
                </div>

                {/* Submission Deadline */}
                <div className="space-y-2">
                  <Label htmlFor="deadline">Submission Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    {...form.register("submissionDeadline")}
                  />
                  {form.formState.errors.submissionDeadline && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.submissionDeadline.message}
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
                    {...form.register("validityPeriod", {
                      valueAsNumber: true,
                    })}
                  />
                  {form.formState.errors.validityPeriod && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.validityPeriod.message}
                    </p>
                  )}
                </div>

                {/* Expected Project Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration">Expected Project Duration</Label>
                  <Input
                    id="duration"
                    placeholder="Enter duration (e.g., 6 months)"
                    {...form.register("projectDuration")}
                  />
                  {form.formState.errors.projectDuration && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.projectDuration.message}
                    </p>
                  )}
                </div>

                {/* Project Description (Full Width) */}
                <div className="space-y-2 col-span-3">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter project details"
                    className="h-24"
                    {...form.register("description")}
                  />
                  {form.formState.errors.description && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 mt-4">
                {/* <!-- Organization Name --> */}
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization Name</Label>
                  <Input
                    id="organization"
                    placeholder="Enter organization name"
                    {...form.register("organizationName")}
                  />
                  {form.formState.errors.organizationName && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.organizationName.message}
                    </p>
                  )}
                </div>

                {/* <!-- Department/Division --> */}
                <div className="space-y-2">
                  <Label htmlFor="department">Department/Division</Label>
                  <Input
                    id="department"
                    placeholder="Enter department/division"
                    {...form.register("department")}
                  />
                  {form.formState.errors.department && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.department.message}
                    </p>
                  )}
                </div>

                {/* <!-- Contact Person --> */}
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    placeholder="Enter contact person's name"
                    {...form.register("contactPerson")}
                  />
                  {form.formState.errors.contactPerson && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.contactPerson.message}
                    </p>
                  )}
                </div>

                {/* <!-- Contact Email --> */}
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="Enter email address"
                    {...form.register("contactEmail")}
                  />
                  {form.formState.errors.contactEmail && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.contactEmail.message}
                    </p>
                  )}
                </div>

                {/* <!-- Contact Phone Number --> */}
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone Number</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="Enter phone number"
                    {...form.register("contactPhone")}
                  />
                  {form.formState.errors.contactPhone && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.contactPhone.message}
                    </p>
                  )}
                </div>

                {/* <!-- Address (Full Width) --> */}
                <div className="space-y-2 col-span-3">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter full address"
                    className="h-24"
                    {...form.register("address")}
                  />
                  {form.formState.errors.address && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 mt-4">
                {/* Minimum Annual Turnover */}
                <div className="space-y-2">
                  <Label htmlFor="turnover">Minimum Annual Turnover</Label>
                  <Input
                    id="turnover"
                    placeholder="Enter required turnover"
                    type="number"
                    {...form.register("minTurnover", {
                      valueAsNumber: true,
                    })}
                  />
                  {form.formState.errors.minTurnover && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.minTurnover.message}
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
                    {...form.register("experienceYears", {
                      valueAsNumber: true,
                    })}
                  />
                  {form.formState.errors.experienceYears && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.experienceYears.message}
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
                    {...form.register("similarProjects")}
                  />
                  {form.formState.errors.similarProjects && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.similarProjects.message}
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
                    {...form.register("requiredCertifications")}
                  />
                  {form.formState.errors.requiredCertifications && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.requiredCertifications.message}
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
                    {...form.register("legalRequirements")}
                  />
                  {form.formState.errors.legalRequirements && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.legalRequirements.message}
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
                    {...form.register("financialStanding")}
                  />
                  {form.formState.errors.financialStanding && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.financialStanding.message}
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
                    {...form.register("technicalCapability")}
                  />
                  {form.formState.errors.technicalCapability && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.technicalCapability.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 mt-4">
                {/* Detailed Scope of Work */}
                <div className="space-y-2 col-span-3">
                  <Label htmlFor="scope">Detailed Scope of Work</Label>
                  <Textarea
                    id="scope"
                    placeholder="Describe scope of work"
                    className="h-24"
                    {...form.register("scopeOfWork")}
                  />
                  {form.formState.errors.scopeOfWork && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.scopeOfWork.message}
                    </p>
                  )}
                </div>

                {/* Technical Requirements */}
                <div className="space-y-2 col-span-3">
                  <Label htmlFor="requirements">Technical Requirements</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Enter technical requirements"
                    className="h-24"
                    {...form.register("technicalRequirements")}
                  />
                  {form.formState.errors.technicalRequirements && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.technicalRequirements.message}
                    </p>
                  )}
                </div>

                {/* Quality Standards */}
                <div className="space-y-2">
                  <Label htmlFor="quality">Quality Standards</Label>
                  <Input
                    id="quality"
                    placeholder="Enter quality expectations"
                    {...form.register("qualityStandards")}
                  />
                  {form.formState.errors.qualityStandards && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.qualityStandards.message}
                    </p>
                  )}
                </div>

                {/* Delivery Timeline */}
                <div className="space-y-2">
                  <Label htmlFor="timeline">Delivery Timeline</Label>
                  <Input
                    id="timeline"
                    placeholder="Enter estimated timeline"
                    {...form.register("deliveryTimeline")}
                  />
                  {form.formState.errors.deliveryTimeline && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.deliveryTimeline.message}
                    </p>
                  )}
                </div>

                {/* Acceptance Criteria */}
                <div className="space-y-2 col-span-3">
                  <Label htmlFor="acceptance">Acceptance Criteria</Label>
                  <Textarea
                    id="acceptance"
                    placeholder="Define acceptance criteria"
                    className="h-24"
                    {...form.register("acceptanceCriteria")}
                  />
                  {form.formState.errors.acceptanceCriteria && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.acceptanceCriteria.message}
                    </p>
                  )}
                </div>

                {/* Performance Metrics */}
                <div className="space-y-2">
                  <Label htmlFor="performance">Performance Metrics</Label>
                  <Input
                    id="performance"
                    placeholder="Enter performance criteria"
                    {...form.register("performanceMetrics")}
                  />
                  {form.formState.errors.performanceMetrics && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.performanceMetrics.message}
                    </p>
                  )}
                </div>

                {/* Required Deliverables */}
                <div className="space-y-2 col-span-3">
                  <Label htmlFor="deliverables">Required Deliverables</Label>
                  <Textarea
                    id="deliverables"
                    placeholder="List expected deliverables"
                    className="h-24"
                    {...form.register("requiredDeliverables")}
                  />
                  {form.formState.errors.requiredDeliverables && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.requiredDeliverables.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Criteria</CardTitle>
            </CardHeader>
            <CardContent>
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
                    {...form.register("technicalWeight", {
                      valueAsNumber: true,
                    })}
                  />
                  {form.formState.errors.technicalWeight && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.technicalWeight.message}
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
                    {...form.register("financialWeight", {
                      valueAsNumber: true,
                    })}
                  />
                  {form.formState.errors.financialWeight && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.financialWeight.message}
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
                    {...form.register("qualificationThreshold", {
                      valueAsNumber: true,
                    })}
                  />
                  {form.formState.errors.qualificationThreshold && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.qualificationThreshold.message}
                    </p>
                  )}
                </div>

                {/* Evaluation Methodology */}
                <div className="space-y-2">
                  <Label>Evaluation Methodology</Label>
                  <Select
                    value={form.watch("evaluationMethodology")}
                    onValueChange={(value) =>
                      form.setValue(
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
                      <SelectItem value="least_cost">Least Cost</SelectItem>
                      <SelectItem value="fixed_budget">Fixed Budget</SelectItem>
                      <SelectItem value="quality_based">
                        Quality-Based
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.evaluationMethodology && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.evaluationMethodology.message}
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
                    {...form.register("scoringSystem")}
                  />
                  {form.formState.errors.scoringSystem && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.scoringSystem.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Bid Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                {/* Bid Security Amount */}
                <div className="space-y-2">
                  <Label htmlFor="bidSecurityAmount">Bid Security Amount</Label>
                  <Input
                    id="bidSecurityAmount"
                    type="number"
                    placeholder="Enter security amount"
                    {...form.register("bidSecurityAmount", {
                      valueAsNumber: true,
                    })}
                  />
                  {form.formState.errors.bidSecurityAmount && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.bidSecurityAmount.message}
                    </p>
                  )}
                </div>

                {/* Bid Security Form */}
                <div className="space-y-2">
                  <Label>Bid Security Form</Label>
                  <Select
                    value={form.watch("bidSecurityForm")}
                    onValueChange={(value) =>
                      form.setValue(
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
                      <SelectItem value="cash_deposit">Cash Deposit</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.bidSecurityForm && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.bidSecurityForm.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submission Requirements Section */}
          <Card>
            <CardHeader>
              <CardTitle>Submission Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                {/* Submission Method */}
                <div className="space-y-2">
                  <Label>Submission Method</Label>
                  <Select
                    value={form.watch("submissionMethod")}
                    onValueChange={(value) =>
                      form.setValue(
                        "submissionMethod",
                        value as "electronic" | "physical" | "both"
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronic">Electronic</SelectItem>
                      <SelectItem value="physical">Physical</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.submissionMethod && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.submissionMethod.message}
                    </p>
                  )}
                </div>

                {/* Supporting Documents Checklist */}
                {/* <div className="space-y-2 col-span-3">
                  <Label htmlFor="supportingDocs">
                    Supporting Documents Checklist
                  </Label>
                  <Textarea
                    id="supportingDocs"
                    placeholder="List required documents"
                    className="h-24"
                  />
                </div> */}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Schedule of Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                {/* Pre-bid Meeting Date */}
                <div className="space-y-2">
                  <Label htmlFor="preBidMeeting">Pre-bid Meeting Date</Label>
                  <Input
                    id="preBidMeeting"
                    type="date"
                    {...form.register("preBidMeeting")}
                  />
                  {form.formState.errors.preBidMeeting && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.preBidMeeting.message}
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
                    {...form.register("siteVisit")}
                  />
                  {form.formState.errors.siteVisit && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.siteVisit.message}
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
                    {...form.register("queryDeadline")}
                  />
                  {form.formState.errors.queryDeadline && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.queryDeadline.message}
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
                    {...form.register("responseToQueries")}
                  />
                  {form.formState.errors.responseToQueries && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.responseToQueries.message}
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
                    {...form.register("techBidOpening")}
                  />
                  {form.formState.errors.techBidOpening && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.techBidOpening.message}
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
                    {...form.register("financeBidOpening")}
                  />
                  {form.formState.errors.financeBidOpening && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.financeBidOpening.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Terms and Conditions Section */}
          <Card>
            <CardHeader>
              <CardTitle>Terms and Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                {/* Payment Terms */}
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Textarea
                    id="paymentTerms"
                    placeholder="Describe payment terms"
                    className="h-24"
                    {...form.register("paymentTerms")}
                  />
                  {form.formState.errors.paymentTerms && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.paymentTerms.message}
                    </p>
                  )}
                </div>

                {/* Warranty Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="warranty">Warranty Requirements</Label>
                  <Textarea
                    id="warranty"
                    placeholder="Describe warranty terms"
                    className="h-24"
                    {...form.register("warrantyRequirements")}
                  />
                  {form.formState.errors.warrantyRequirements && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.warrantyRequirements.message}
                    </p>
                  )}
                </div>

                {/* Insurance Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance Requirements</Label>
                  <Textarea
                    id="insurance"
                    placeholder="Describe insurance requirements"
                    className="h-24"
                    {...form.register("insuranceRequirements")}
                  />
                  {form.formState.errors.insuranceRequirements && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.insuranceRequirements.message}
                    </p>
                  )}
                </div>

                {/* Sub-contracting Rules */}
                <div className="space-y-2 col-span-3">
                  <Label htmlFor="subContracting">Sub-contracting Rules</Label>
                  <Textarea
                    id="subContracting"
                    placeholder="Specify rules for sub-contracting"
                    className="h-24"
                    {...form.register("subContractingRules")}
                  />
                  {form.formState.errors.subContractingRules && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.subContractingRules.message}
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
                    {...form.register("contractAmendment")}
                  />
                  {form.formState.errors.contractAmendment && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.contractAmendment.message}
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
                    {...form.register("disputeResolution")}
                  />
                  {form.formState.errors.disputeResolution && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.disputeResolution.message}
                    </p>
                  )}
                </div>

                {/* Force Majeure Clauses */}
                <div className="space-y-2">
                  <Label htmlFor="forceMajeure">Force Majeure Clauses</Label>
                  <Textarea
                    id="forceMajeure"
                    placeholder="Describe force majeure clauses"
                    className="h-24"
                    {...form.register("forceMajeure")}
                  />
                  {form.formState.errors.forceMajeure && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.forceMajeure.message}
                    </p>
                  )}
                </div>

                {/* Termination Conditions */}
                <div className="space-y-2">
                  <Label htmlFor="termination">Termination Conditions</Label>
                  <Textarea
                    id="termination"
                    placeholder="Describe contract termination conditions"
                    className="h-24"
                    {...form.register("terminationConditions")}
                  />
                  {form.formState.errors.terminationConditions && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.terminationConditions.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments Section */}
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                {/* Standard Bidding Documents */}
                <div className="space-y-2">
                  <Label htmlFor="biddingDocs">
                    Standard Bidding Documents
                  </Label>
                  <Input
                    id="biddingDocs"
                    type="file"
                    {...form.register("biddingDocs")}
                  />
                  <p className="text-sm text-gray-600">
                    {form.watch("biddingDocs")?.[0]?.name || "No file uploaded"}
                  </p>
                </div>

                {/* Technical Specification Documents */}
                <div className="space-y-2">
                  <Label htmlFor="techSpecs">
                    Technical Specification Documents
                  </Label>
                  <Input
                    id="techSpecs"
                    type="file"
                    {...form.register("techSpecsDocs")}
                  />
                  <p className="text-sm text-gray-600">
                    {form.watch("techSpecsDocs")?.[0]?.name ||
                      "No file uploaded"}
                  </p>
                </div>

                {/* Draft Contract */}
                <div className="space-y-2">
                  <Label htmlFor="draftContract">Draft Contract</Label>
                  <Input
                    id="draftContract"
                    type="file"
                    {...form.register("draftContract")}
                  />
                  <p className="text-sm text-gray-600">
                    {form.watch("draftContract")?.[0]?.name ||
                      "No file uploaded"}
                  </p>
                </div>

                {/* Bill of Quantities/Price Schedule Template */}
                <div className="space-y-2">
                  <Label htmlFor="billQuantities">
                    Bill of Quantities/Price Schedule
                  </Label>
                  <Input
                    id="billQuantities"
                    type="file"
                    {...form.register("billQuantities")}
                  />
                  <p className="text-sm text-gray-600">
                    {form.watch("billQuantities")?.[0]?.name ||
                      "No file uploaded"}
                  </p>
                </div>

                {/* Special Instructions Document */}
                <div className="space-y-2">
                  <Label htmlFor="specialInstructions">
                    Special Instructions Document
                  </Label>
                  <Input
                    id="specialInstructions"
                    type="file"
                    {...form.register("specialInstructions")}
                  />
                  <p className="text-sm text-gray-600">
                    {form.watch("specialInstructions")?.[0]?.name ||
                      "No file uploaded"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </FormProvider>
  );
}
