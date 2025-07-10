"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shadcn/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import moment from "moment";
import BidList from "../Bid-list";
import { useRef } from "react";
import ReadOnlyEditor from "../../../../read-only-text-editor";

export default function TenderPage({
  details,
  bidList,
}: {
  details: any;
  bidList: any;
}) {
  const DataItem = ({
    label,
    value,
    className = "",
  }: {
    label: string;
    value: string | number | null;
    className?: string;
  }) => (
    <div className={`space-y-1 ${className}`}>
      <p className="font-medium">{label}</p>
      <p className="">
        {value !== null && value !== undefined ? value : "N/A"}
      </p>
    </div>
  );

  const editorRef = useRef(null);

  return (
    <Accordion type="multiple" defaultValue={["item-3"]} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Tender Details</AccordionTrigger>
        <AccordionContent className="">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
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
            <TabsContent value="basic">
              <div className="space-y-8 h-auto overflow-y-auto ">
                {/* Basic Tender Information */}
                <div>
                  <h2 className="text-xl font-semibold">
                    Basic Tender Information
                  </h2>
                  <div className="grid grid-cols-3 gap-6 mt-4">
                    <DataItem label="Tender Subject" value={details.title} />
                    <DataItem label="Industry" value={details.industry} />
                    <DataItem
                      label="Tender Reference Number"
                      value={details.referenceNumber}
                    />
                    <DataItem
                      label="Estimated Budget/Value"
                      value={details.budget}
                    />
                    <DataItem label="Tender Type" value={details.tenderType} />
                    <DataItem
                      label="Procurement Category"
                      value={details.procurementCategory}
                    />
                    <DataItem label="Currency" value={details.currency} />
                    <DataItem
                      label="Publication Date"
                      value={details.publicationDate}
                    />
                    <DataItem
                      label="Submission Deadline"
                      value={details.submissionDeadline}
                    />
                    <DataItem
                      label="Tender Validity Period (Days)"
                      value={details.validityPeriod}
                    />
                    <DataItem
                      label="Expected Project Duration"
                      value={details.projectDuration}
                    />
                    <div className="col-span-3">
                      <DataItem
                        label="Project Description"
                        value={details.description}
                      />
                    </div>
                  </div>
                </div>

                {/* Organization Information */}
                <div>
                  <h2 className="text-xl font-semibold">
                    Organization Information
                  </h2>
                  <div className="grid grid-cols-3 gap-6 mt-4">
                    <DataItem
                      label="Organization Name"
                      value={details.organizationName}
                    />
                    <DataItem
                      label="Department/Division"
                      value={details.department}
                    />
                    <DataItem
                      label="Contact Person"
                      value={details.contactPerson}
                    />
                    <DataItem
                      label="Contact Email"
                      value={details.contactEmail}
                    />
                    <DataItem
                      label="Contact Phone Number"
                      value={details.contactPhone}
                    />
                    <div className="col-span-3">
                      <DataItem label="Address" value={details.address} />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="eligibility">
              <div className="space-y-8 h-auto overflow-y-auto">
                {/* Eligibility Requirements Section */}
                <div>
                  <h2 className="text-xl font-semibold">
                    Eligibility Requirements
                  </h2>
                  <div className="grid grid-cols-3 gap-6 mt-4">
                    <DataItem
                      label="Minimum Annual Turnover"
                      value={
                        details.minTurnover ? `$${details.minTurnover}` : "N/A"
                      }
                    />
                    <DataItem
                      label="Years of Experience Required"
                      value={
                        details.experienceYears
                          ? `${details.experienceYears} years`
                          : "N/A"
                      }
                    />
                    <DataItem
                      label="Previous Similar Projects"
                      value={details.similarProjects || "N/A"}
                      className="col-span-3"
                    />
                    <DataItem
                      label="Required Certifications/Licenses"
                      value={details.requiredCertifications || "N/A"}
                      className="col-span-3"
                    />
                    <DataItem
                      label="Legal Requirements"
                      value={details.legalRequirements || "N/A"}
                      className="col-span-3"
                    />
                    <DataItem
                      label="Financial Standing Requirements"
                      value={details.financialStanding || "N/A"}
                    />
                    <DataItem
                      label="Technical Capability Requirements"
                      value={details.technicalCapability || "N/A"}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="technical">
              <TabsContent value="technical">
                <div className="space-y-8 h-auto overflow-y-auto">
                  {/* Technical Specifications Section */}
                  <div>
                    <h2 className="text-xl font-semibold">
                      Technical Specifications
                    </h2>
                    <div className="grid grid-cols-3 gap-6 mt-4">
                      <DataItem
                        label="Detailed Scope of Work"
                        value={details.scopeOfWork}
                        className="col-span-3"
                      />
                      <DataItem
                        label="Technical Requirements"
                        value={details.technicalRequirements}
                        className="col-span-3"
                      />
                      <DataItem
                        label="Quality Standards"
                        value={details.qualityStandards}
                      />
                      <DataItem
                        label="Delivery Timeline"
                        value={details.deliveryTimeline}
                      />
                      <DataItem
                        label="Acceptance Criteria"
                        value={details.acceptanceCriteria}
                        className="col-span-3"
                      />
                      <DataItem
                        label="Performance Metrics"
                        value={details.performanceMetrics}
                      />
                      <DataItem
                        label="Required Deliverables"
                        value={details.requiredDeliverables}
                        className="col-span-3"
                      />
                    </div>
                  </div>

                  {/* Evaluation Criteria Section */}
                  <div>
                    <h2 className="text-xl font-semibold">
                      Evaluation Criteria
                    </h2>
                    <div className="grid grid-cols-3 gap-6 mt-4">
                      <DataItem
                        label="Technical Evaluation Weight (%)"
                        value={details.technicalWeight}
                      />
                      <DataItem
                        label="Financial Evaluation Weight (%)"
                        value={details.financialWeight}
                      />
                      <DataItem
                        label="Technical Qualification Threshold"
                        value={details.qualificationThreshold}
                      />
                      <DataItem
                        label="Evaluation Methodology"
                        value={details.evaluationMethodology}
                      />
                      <DataItem
                        label="Scoring System"
                        value={details.scoringSystem}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </TabsContent>
            <TabsContent value="security_schedule">
              <TabsContent value="security_schedule">
                <div className="space-y-8 h-auto overflow-y-auto">
                  {/* Bid Security Section */}
                  <div>
                    <h2 className="text-xl font-semibold">Bid Security</h2>
                    <div className="grid grid-cols-3 gap-6 mt-4">
                      <DataItem
                        label="Bid Security Amount"
                        value={details.bidSecurityAmount}
                      />
                      <DataItem
                        label="Bid Security Form"
                        value={details.bidSecurityForm}
                      />
                      <DataItem
                        label="Bid Security Validity (days)"
                        value={details.bidSecurityValidity}
                      />
                    </div>
                  </div>

                  {/* Submission Requirements Section */}
                  <div>
                    <h2 className="text-xl font-semibold">
                      Submission Requirements
                    </h2>
                    <div className="grid grid-cols-3 gap-6 mt-4">
                      <DataItem
                        label="Submission Method"
                        value={details.submissionMethod}
                      />
                      <DataItem
                        label="Required Number of Copies"
                        value={details.copiesRequired}
                      />
                      <DataItem
                        label="Format Requirements"
                        value={details.formatRequirements}
                        className="col-span-3"
                      />
                      <DataItem
                        label="Supporting Documents Checklist"
                        value={details.supportingDocuments}
                        className="col-span-3"
                      />
                      <DataItem
                        label="Pre-qualification Documents Required"
                        value={details.preQualificationDocs}
                        className="col-span-3"
                      />
                    </div>
                  </div>

                  {/* Schedule of Events Section */}
                  <div>
                    <h2 className="text-xl font-semibold">
                      Schedule of Events
                    </h2>
                    <div className="grid grid-cols-3 gap-6 mt-4">
                      <DataItem
                        label="Pre-bid Meeting Date"
                        value={details.preBidMeeting}
                      />
                      <DataItem
                        label="Site Visit Date"
                        value={details.siteVisit}
                      />
                      <DataItem
                        label="Query Submission Deadline"
                        value={details.queryDeadline}
                      />
                      <DataItem
                        label="Response to Queries Date"
                        value={details.responseToQueries}
                      />
                      <DataItem
                        label="Technical Bid Opening Date"
                        value={details.techBidOpening}
                      />
                      <DataItem
                        label="Financial Bid Opening Date"
                        value={details.financeBidOpening}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </TabsContent>
            <TabsContent value="terms">
              <TabsContent value="terms">
                <div className="space-y-8 h-auto overflow-y-auto">
                  {/* Terms and Conditions Section */}
                  <div>
                    <h2 className="text-xl font-semibold">
                      Terms and Conditions
                    </h2>
                    <div className="grid grid-cols-3 gap-6 mt-4">
                      <DataItem
                        label="Payment Terms"
                        value={details.paymentTerms}
                        className="col-span-3"
                      />
                      <DataItem
                        label="Warranty Requirements"
                        value={details.warrantyRequirements}
                      />
                      <DataItem
                        label="Insurance Requirements"
                        value={details.insuranceRequirements}
                      />
                      <DataItem
                        label="Sub-contracting Rules"
                        value={details.subContractingRules}
                        className="col-span-3"
                      />
                      <DataItem
                        label="Contract Amendment Provisions"
                        value={details.contractAmendment}
                        className="col-span-3"
                      />
                      <DataItem
                        label="Dispute Resolution Mechanism"
                        value={details.disputeResolution}
                      />
                      <DataItem
                        label="Force Majeure Clauses"
                        value={details.forceMajeure}
                      />
                      <DataItem
                        label="Termination Conditions"
                        value={details.terminationConditions}
                      />
                    </div>
                  </div>

                  {/* Attachments Section */}
                  <div>
                    <h2 className="text-xl font-semibold">Attachments</h2>
                    <div className="grid grid-cols-3 gap-6 mt-4">
                      <DataItem
                        label="Standard Bidding Documents"
                        value={details.biddingDocs.resourceName}
                      />
                      <DataItem
                        label="Technical Specification Documents"
                        value={details.techSpecsDocs.resourceName}
                      />
                      <DataItem
                        label="Draft Contract"
                        value={details.draftContract.resourceName}
                      />
                      <DataItem
                        label="Bill of Quantities/Price Schedule"
                        value={details.billQuantities.resourceName}
                      />
                      <DataItem
                        label="Special Instructions Document"
                        value={details.specialInstructions.resourceName}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </TabsContent>
          </Tabs>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Uploaded Documents</AccordionTrigger>
        <AccordionContent>
          {/* <div dangerouslySetInnerHTML={{ __html: details.draftContent }} /> */}
          <ReadOnlyEditor
            value={details.draftContent}
            height={600}
            onChange={() => {}}
            ref={editorRef}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Bid List</AccordionTrigger>
        <AccordionContent>
          <BidList tenderId={details.id} bidList={bidList} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}


