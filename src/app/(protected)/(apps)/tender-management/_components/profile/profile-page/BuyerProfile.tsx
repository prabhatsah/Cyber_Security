import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { useState } from "react";

const formWizardSteps = [
  "Basic Information",
  "Contact Details",
  "Procurement Information",
  "Documents",
];

const DetailItem = ({ label, value }: { label: any; value: any }) => (
  <div className="flex flex-col">
    <span className=" font-medium text-foreground">{label}</span>
    <span className="text-foreground">{value}</span>
  </div>
);

const BuyerProfile = ({ buyerDetails }: { buyerDetails: any }) => {
  console.log("buyer profiles details received", buyerDetails);
  const [step, setStep] = useState(0);
  const [data, setData] = useState(buyerDetails);
  const totalSteps = formWizardSteps.length;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  return (
    <>
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

        <TabsContent value="Basic Information">
          <div className="grid grid-cols-3 gap-4">
            <DetailItem
              label="Company/Organization Name"
              value={data?.companyName || "N/A"}
            />
            <DetailItem
              label="Business Type"
              value={data?.businessType || "N/A"}
            />
            <DetailItem
              label="Industry/Sector"
              value={data?.industry || "N/A"}
            />

            <DetailItem
              label="Year Established"
              value={data?.yearEstablished || "N/A"}
            />
            <DetailItem
              label="Number of Employees"
              value={data?.numEmployees || "N/A"}
            />
            <DetailItem
              label="Annual Revenue Range"
              value={data?.annualRevenue || "N/A"}
            />

            <DetailItem
              label="Company Website"
              value={data?.companyWebsite || "N/A"}
            />
          </div>
        </TabsContent>

        {/* Contact Details */}
        <TabsContent value="Contact Details">
          <div className="grid grid-cols-3 gap-4">
            <DetailItem
              label="Primary Contact Name"
              value={data?.primaryContactName || "N/A"}
            />
            <DetailItem label="Job Title" value={data?.jobTitle || "N/A"} />
            <DetailItem label="Email Address" value={data?.email || "N/A"} />

            <DetailItem
              label="Phone Number"
              value={data?.phoneNumber || "N/A"}
            />
            <DetailItem
              label="Alternative Contact Person"
              value={data?.altContact || "N/A"}
            />
            <DetailItem label="Street Address" value={data?.street || "N/A"} />

            <DetailItem label="City" value={data?.city || "N/A"} />
            <DetailItem label="State/Province" value={data?.state || "N/A"} />
            <DetailItem label="ZIP/Postal Code" value={data?.zip || "N/A"} />

            <DetailItem label="Country" value={data?.country || "N/A"} />
          </div>
        </TabsContent>

        {/* Procurement Information */}
        <TabsContent value="Procurement Information">
          <div className="grid grid-cols-3 gap-4">
            <DetailItem
              label="Typical Products/Services Purchased"
              value={data?.productsPurchased || "N/A"}
            />
            <DetailItem
              label="Average Order Value"
              value={data?.avgOrderValue || "N/A"}
            />
            <DetailItem
              label="Procurement Frequency"
              value={data?.procurementFrequency || "N/A"}
            />

            <DetailItem
              label="Payment Terms Preference"
              value={data?.paymentTerms || "N/A"}
            />
            <DetailItem
              label="Preferred Currencies"
              value={data?.preferredCurrencies || "N/A"}
            />
            <DetailItem
              label="Required Certifications"
              value={data?.requiredCertifications || "N/A"}
            />
          </div>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="Documents">
          <div className="grid grid-cols-3 gap-4">
            <DetailItem
              label="Business Registration Certificate"
              value={data?.businessRegCert || "N/A"}
            />
            <DetailItem
              label="Tax ID/VAT Number"
              value={data?.taxId || "N/A"}
            />
            <DetailItem
              label="Banking Information for Payments"
              value={data?.bankingInfo || "N/A"}
            />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default BuyerProfile;
