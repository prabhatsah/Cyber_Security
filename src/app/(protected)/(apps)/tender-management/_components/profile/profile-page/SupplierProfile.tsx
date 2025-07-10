'use client'


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { useState } from "react";


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
    <span className=" font-medium text-foreground">{label}</span>
    <span className="text-foreground">{value}</span>
  </div>
);
const SupplierProfile = ({supplierDetails} : {supplierDetails : any}) => {
  console.log('supplier profiles details received', supplierDetails);
  const [step, setStep] = useState(0);
    const [data, setData] = useState(supplierDetails);
    const totalSteps = formWizardSteps.length;
  
    const handleNext = () => {
      if (step < totalSteps) setStep(step + 1);
    };
  
    const handleBack = () => {
      if (step > 1) setStep(step - 1);
    };
  return (
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
          <DetailItem label="Company Name" value={data?.companyName || "N/A"} />
          <DetailItem
            label="Registered Address"
            value={data?.registeredAddress || "N/A"}
          />
          <DetailItem
            label="Postal Address"
            value={data?.postalAddress || "N/A"}
          />

          <DetailItem label="Phone Number" value={data?.phoneNumber || "N/A"} />
          <DetailItem label="Email Address" value={data?.email || "N/A"} />
          <DetailItem label="Website URL" value={data?.websiteURL || "N/A"} />

          <DetailItem
            label="Company Registration Number"
            value={data?.registrationNumber || "N/A"}
          />
          <DetailItem label="VAT Number" value={data?.vatNumber || "N/A"} />
          <DetailItem label="Full Name" value={data?.contactName || "N/A"} />

          <DetailItem
            label="Position/Title"
            value={data?.contactPosition || "N/A"}
          />
          <DetailItem
            label="Contact Phone Number"
            value={data?.contactPhoneNumber || "N/A"}
          />
          <DetailItem
            label="Contact Email"
            value={data?.contactEmail || "N/A"}
          />
        </div>
      </TabsContent>

      {/* Capabilities and Experience */}
      <TabsContent value="Capabilities and Experience">
        <div className="grid grid-cols-3 gap-4">
          <DetailItem label="Industry" value={data?.industry || "N/A"} />
          <DetailItem
            label="Supplier Type"
            value={data?.supplierType || "N/A"}
          />
          <DetailItem
            label="Years of Experience"
            value={data?.yearsOfExperience || "N/A"}
          />

          <DetailItem
            label="Key Products/Services"
            value={data?.keyProducts || "N/A"}
          />
          <DetailItem
            label="Certifications and Accreditations"
            value={data?.certifications || "N/A"}
          />
          <DetailItem
            label="Insurance Coverage"
            value={data?.insuranceCoverage || "N/A"}
          />

          <DetailItem
            label="Previous Tender Participation"
            value={data?.prevTenders || "N/A"}
          />
          <DetailItem
            label="Relevant Projects Completed"
            value={data?.relevantProjects || "N/A"}
          />
          <DetailItem
            label="References/Testimonials"
            value={data?.references || "N/A"}
          />
        </div>
      </TabsContent>

      {/* Finance and Legal */}
      <TabsContent value="Finance and Legal">
        <div className="grid grid-cols-3 gap-4">
          <DetailItem
            label="Annual Turnover"
            value={data?.annualTurnover || "N/A"}
          />
          <DetailItem
            label="Credit Rating"
            value={data?.creditRating || "N/A"}
          />
          <DetailItem
            label="Bank Account Information"
            value={data?.bankAccount || "N/A"}
          />

          <DetailItem
            label="Tax Compliance"
            value={data?.taxCompliant || "N/A"}
          />
          <DetailItem
            label="Legal Structure"
            value={data?.legalStructure || "N/A"}
          />
          <DetailItem
            label="Compliance with Laws"
            value={data?.regulations || "N/A"}
          />

          <DetailItem
            label="Conflicts of Interest"
            value={data?.conflicts || "N/A"}
          />
          <DetailItem label="NDA Signed" value={data?.nda ? "Yes" : "No"} />
          <DetailItem
            label="Criminal Record Declaration"
            value={data?.criminal ? "Declared" : "Not Provided"}
          />
        </div>
      </TabsContent>

      {/* QA and Bid Submission */}
      <TabsContent value="QA and Bid Submission">
        <div className="grid grid-cols-3 gap-4">
          <DetailItem
            label="Quality Management System"
            value={data?.qualityManagement || "N/A"}
          />
          <DetailItem
            label="Product/Service Guarantees"
            value={data?.serviceGuarantee || "N/A"}
          />
          <DetailItem
            label="Service Level Agreement (SLA)"
            value={data?.sla ? "Uploaded" : "N/A"}
          />

          <DetailItem label="Bid Amount" value={data?.bidAmount || "N/A"} />
          <DetailItem
            label="Proposed Delivery Schedule"
            value={data?.proposedDelivery || "N/A"}
          />
          <DetailItem
            label="Proposed Payment Terms"
            value={data?.proposedPaymentTerms || "N/A"}
          />
        </div>
      </TabsContent>

      {/* Additional Information */}
      <TabsContent value="Additional Information">
        <div className="grid grid-cols-3 gap-4">
          <DetailItem
            label="Any Other Relevant Information"
            value={data?.additionalInfo || "N/A"}
          />
          <DetailItem
            label="Company Profile"
            value={data?.profileFile ? "Uploaded" : "Not Provided"}
          />
          <DetailItem
            label="Financial Statements"
            value={data?.financialStatementFile ? "Uploaded" : "Not Provided"}
          />

          <DetailItem
            label="Certifications/Accreditations"
            value={data?.certificationsFile ? "Uploaded" : "Not Provided"}
          />
          <DetailItem
            label="References/Testimonials"
            value={data?.referencesFile ? "Uploaded" : "Not Provided"}
          />
        </div>
      </TabsContent>

      {/* Declaration */}
      <TabsContent value="Declaration">
        <div className="grid grid-cols-3 gap-4">
          <DetailItem
            label="Supplier Declaration"
            value={data?.supplierDeclaration ? "Confirmed" : "Not Provided"}
          />
          <DetailItem
            label="Authorized Signatory Name"
            value={data?.authorizedSignatoryName || "N/A"}
          />
          <DetailItem label="Date" value={data?.date || "N/A"} />

          <DetailItem
            label="Signature"
            value={data?.signature ? "Uploaded" : "N/A"}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default SupplierProfile;
