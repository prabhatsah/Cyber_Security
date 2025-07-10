"use client";

import { Button } from "@/shadcn/ui/button";
import { useEffect, useState } from "react";
import SupplierRegistrationModal from "../../profile/profile-page/supplier-register-modal";
import { sendForReview } from "../../../_utils/register/send-to-review";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { getSupplierRegistrationData } from "../../../_utils/register/supplier-register-form";

const formWizardSteps = [
  "Supplier Info and Contacts",
  "Capabilities and Experience",
  "Finance and Legal",
  "QA and Bid Submission",
  "Additional Information",
  "Declaration",
];

const DetailItem = ({ label, value }: { label: any; value: any }) => (
  <div className="flex flex-col">
    <span className=" font-medium">{label}</span>
    <span className="">{value}</span>
  </div>
);

export default function RegistrationDetails({
  supplierId,
}: {
  supplierId: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const totalSteps = formWizardSteps.length;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSendReview = async () => {
    console.log("Send for review");
    await sendForReview(supplierId);
    toast.success("Supplier sent for review.");
  };

  useEffect(
    () => {
      const fetchDraftData = async () => {
        try {
          const data: any = await getSupplierRegistrationData(supplierId);
          setData(data);
        } catch (error) {
          console.error("Error fetching draft data:", error);
        } finally {
          //setIsLoading(false);
        }
      };

      fetchDraftData();
    },
    [
      /*draftId, isOpen, setValue, reset*/
    ]
  );

  return (
    <>
      <div className="flex justify-end items-center gap-2 mb-4">
        <Button onClick={() => setIsOpen((prev) => !prev)}>Edit</Button>
        {data.status === "Pending" && (
          <Button onClick={() => handleSendReview()}>Send For Review</Button>
        )}
        Status : {data.status}
      </div>
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

        <TabsContent value="Supplier Info and Contacts">
          <div className="grid grid-cols-3 gap-4">
            <DetailItem label="Company Name" value={data.companyName} />
            <DetailItem
              label="Registered Address"
              value={data.registeredAddress}
            />
            <DetailItem
              label="Postal Address"
              value={data.postalAddress || "N/A"}
            />

            <DetailItem label="Phone Number" value={data.phoneNumber} />
            <DetailItem label="Email Address" value={data.email} />
            <DetailItem label="Website URL" value={data.websiteURL || "N/A"} />

            <DetailItem
              label="Company Registration Number"
              value={data.registrationNumber || "N/A"}
            />
            <DetailItem label="VAT Number" value={data.vatNumber || "N/A"} />
            <DetailItem label="Full Name" value={data.contactName || "N/A"} />

            <DetailItem
              label="Position/Title"
              value={data.contactPosition || "N/A"}
            />
            <DetailItem
              label="Contact Phone Number"
              value={data.contactPhoneNumber || "N/A"}
            />
            <DetailItem
              label="Contact Email"
              value={data.contactEmail || "N/A"}
            />
          </div>
        </TabsContent>

        <TabsContent value="Capabilities and Experience">
          <div className="grid grid-cols-3 gap-4">
            <DetailItem label="Industry" value={data.industry || "N/A"} />
            <DetailItem
              label="Supplier Type"
              value={data.supplierType || "N/A"}
            />
            <DetailItem
              label="Years of Experience"
              value={data.yearsOfExperience || "N/A"}
            />

            <DetailItem
              label="Key Products/Services"
              value={data.keyProducts || "N/A"}
            />
            <DetailItem
              label="Certifications and Accreditations"
              value={data.certifications || "N/A"}
            />
            <DetailItem
              label="Insurance Coverage"
              value={data.insuranceCoverage || "N/A"}
            />

            <DetailItem
              label="Previous Tender Participation"
              value={data.prevTenders || "N/A"}
            />
            <DetailItem
              label="Relevant Projects Completed"
              value={data.relevantProjects || "N/A"}
            />
            <DetailItem
              label="References/Testimonials"
              value={data.references || "N/A"}
            />
          </div>
        </TabsContent>

        <TabsContent value="Finance and Legal">
          <div className="grid grid-cols-3 gap-4">
            <DetailItem
              label="Annual Turnover"
              value={data.annualTurnover || "N/A"}
            />
            <DetailItem
              label="Credit Rating"
              value={data.creditRating || "N/A"}
            />
            <DetailItem
              label="Bank Account Information"
              value={data.bankAccount || "N/A"}
            />

            <DetailItem
              label="Tax Compliance"
              value={data.taxCompliant || "N/A"}
            />
            <DetailItem
              label="Legal Structure"
              value={data.legalStructure || "N/A"}
            />
            <DetailItem
              label="Compliance with Laws"
              value={data.regulations || "N/A"}
            />

            <DetailItem
              label="Conflicts of Interest"
              value={data.conflicts || "N/A"}
            />
            <DetailItem label="NDA Signed" value={data.nda || "N/A"} />
            <DetailItem
              label="Criminal Record Declaration"
              value={data.criminal || "N/A"}
            />
          </div>
        </TabsContent>

        <TabsContent value="QA and Bid Submission">
          <div className="grid grid-cols-3 gap-4">
            <DetailItem
              label="Quality Management System"
              value={data.qualityManagement || "N/A"}
            />
            <DetailItem
              label="Product/Service Guarantees"
              value={data.serviceGurantee || "N/A"}
            />
            <DetailItem
              label="Service Level Agreement (SLA)"
              value={data.sla ? "Uploaded" : "N/A"}
            />

            <DetailItem label="Bid Amount" value={data.bidAmount || "N/A"} />
            <DetailItem
              label="Proposed Delivery Schedule"
              value={data.proposedDelivery || "N/A"}
            />
            <DetailItem
              label="Proposed Payment Terms"
              value={data.proposedPaymentTerms || "N/A"}
            />
          </div>
        </TabsContent>

        <TabsContent value="Additional Information">
          <div className="grid grid-cols-3 gap-4">
            <DetailItem
              label="Any Other Relevant Information"
              value={data.additionalInfo || "N/A"}
            />
            <DetailItem
              label="Company Profile"
              value={data.profileFile ? "Uploaded" : "Not Provided"}
            />
            <DetailItem
              label="Financial Statements"
              value={data.financialStatementFile ? "Uploaded" : "Not Provided"}
            />

            <DetailItem
              label="Certifications/Accreditations"
              value={data.certificationsFile ? "Uploaded" : "Not Provided"}
            />
            <DetailItem
              label="References/Testimonials"
              value={data.referencesFile ? "Uploaded" : "Not Provided"}
            />
          </div>
        </TabsContent>

        <TabsContent value="Declaration">
          <div className="grid grid-cols-3 gap-4">
            <DetailItem
              label="Supplier Declaration"
              value={data.supplierDeclaration ? "Confirmed" : "Not Provided"}
            />
            <DetailItem
              label="Authorized Signatory Name"
              value={data.authorizedSignatoryName || "N/A"}
            />
            <DetailItem label="Date" value={data.date || "N/A"} />

            <DetailItem
              label="Signature"
              value={data.signature ? "Uploaded" : "N/A"}
            />
          </div>
        </TabsContent>
      </Tabs>

      <p>Supplier ID: {supplierId}</p>

      {isOpen && (
        <SupplierRegistrationModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          supplierId={supplierId}
        />
      )}
    </>
  );
}
