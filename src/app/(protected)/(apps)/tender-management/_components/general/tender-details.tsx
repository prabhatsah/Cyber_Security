import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { Label } from "@radix-ui/react-label";

export default function TenderDetailsComponent({data} : {data :any}) {

    console.log("Tender Details===============================================>", data);
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
    };
    const getFileName = (file : any) =>{
      if (file && file.resourceName) {
        return file.resourceName
      }
      return "N/A";
    }
      
    

    const displayField = (label: string, value?: string | number) => (
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground/60">{label}</p>
        <p className="text-sm text-gray-800">{value || "—"}</p>
      </div>
    );
  return (
    <>
      <ScrollArea className="h-[82dvh] w-full ">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 mt-4">
                {displayField("Tender Subject", data.title)}
                {displayField("Industry", data.tender_department)}
                {displayField("Tender Reference Number", data.referenceNumber)}
                {displayField(
                  "Estimated Budget/Value",
                  data.budget?.toLocaleString()
                )}
                {displayField("Tender Type", data.tenderType)}
                {displayField("Procurement Category", data.procurementCategory)}
                {displayField("Currency", data.currency?.toUpperCase())}
                {displayField("Publication Date", data.publicationDate)}
                {displayField("Submission Deadline", data.submissionDeadline)}
                {displayField(
                  "Tender Validity Period (Days)",
                  data.validityPeriod
                )}
                {displayField(
                  "Expected Project Duration",
                  data.projectDuration
                )}
                <div className="col-span-3 space-y-1">
                  <p className="text-sm font-medium text-foreground/60">
                    Project Description
                  </p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {data.description || "—"}
                  </p>
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
                {/* Organization Name */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Organization Name
                  </p>
                  <p className="text-foreground font-medium">
                    {data.organizationName}
                  </p>
                </div>

                {/* Department/Division */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Department/Division
                  </p>
                  <p className="text-foreground font-medium">
                    {data.department}
                  </p>
                </div>

                {/* Contact Person */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Contact Person
                  </p>
                  <p className="text-foreground font-medium">
                    {data.contactPerson}
                  </p>
                </div>

                {/* Contact Email */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Contact Email
                  </p>
                  <p className="text-foreground font-medium">
                    {data.contactEmail}
                  </p>
                </div>

                {/* Contact Phone Number */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Contact Phone Number
                  </p>
                  <p className="text-foreground font-medium">
                    {data.contactPhone}
                  </p>
                </div>

                {/* Empty div to maintain grid layout */}
                <div></div>

                {/* Address (Full Width) */}
                <div className="space-y-2 col-span-3">
                  <p className="text-sm font-medium text-foreground/60">
                    Address
                  </p>
                  <p className="text-foreground font-medium whitespace-pre-line">
                    {data.address}
                  </p>
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
                  <p className="text-sm font-medium text-foreground/60">
                    Minimum Annual Turnover
                  </p>
                  <p className="text-foreground font-medium">
                    {data.minTurnover}
                  </p>
                </div>

                {/* Years of Experience */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Years of Experience Required
                  </p>
                  <p className="text-foreground font-medium">
                    {data.experienceYears} years
                  </p>
                </div>

                {/* Empty div to maintain grid layout */}
                <div></div>

                {/* Previous Similar Projects */}
                <div className="space-y-2 col-span-3">
                  <p className="text-sm font-medium text-foreground/60">
                    Previous Similar Projects
                  </p>
                  <p className="text-foreground font-medium whitespace-pre-line">
                    {data.similarProjects}
                  </p>
                </div>

                {/* Required Certifications/Licenses */}
                <div className="space-y-2 col-span-3">
                  <p className="text-sm font-medium text-foreground/60">
                    Required Certifications/Licenses
                  </p>
                  <p className="text-foreground font-medium whitespace-pre-line">
                    {data.requiredCertifications}
                  </p>
                </div>

                {/* Legal Requirements */}
                <div className="space-y-2 col-span-3">
                  <p className="text-sm font-medium text-foreground/60">
                    Legal Requirements
                  </p>
                  <p className="text-foreground font-medium whitespace-pre-line">
                    {data.legalRequirements}
                  </p>
                </div>

                {/* Financial Standing Requirements */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Financial Standing Requirements
                  </p>
                  <p className="text-foreground font-medium">
                    {data.financialStanding}
                  </p>
                </div>

                {/* Technical Capability Requirements */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Technical Capability Requirements
                  </p>
                  <p className="text-foreground font-medium">
                    {data.technicalCapability}
                  </p>
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
                  <p className="text-sm font-medium text-foreground/60">
                    Detailed Scope of Work
                  </p>
                  <p className="text-foreground font-medium whitespace-pre-line">
                    {data.scopeOfWork}
                  </p>
                </div>

                {/* Technical Requirements */}
                <div className="space-y-2 col-span-3">
                  <p className="text-sm font-medium text-foreground/60">
                    Technical Requirements
                  </p>
                  <p className="text-foreground font-medium whitespace-pre-line">
                    {data.technicalRequirements}
                  </p>
                </div>

                {/* Quality Standards */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Quality Standards
                  </p>
                  <p className="text-foreground font-medium">
                    {data.qualityStandards}
                  </p>
                </div>

                {/* Delivery Timeline */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Delivery Timeline
                  </p>
                  <p className="text-foreground font-medium">
                    {data.deliveryTimeline}
                  </p>
                </div>

                {/* Empty div to maintain grid layout */}
                <div></div>

                {/* Acceptance Criteria */}
                <div className="space-y-2 col-span-3">
                  <p className="text-sm font-medium text-foreground/60">
                    Acceptance Criteria
                  </p>
                  <p className="text-foreground font-medium whitespace-pre-line">
                    {data.acceptanceCriteria}
                  </p>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Performance Metrics
                  </p>
                  <p className="text-foreground font-medium">
                    {data.performanceMetrics}
                  </p>
                </div>

                {/* Empty div to maintain grid layout */}
                <div className="col-span-2"></div>

                {/* Required Deliverables */}
                <div className="space-y-2 col-span-3">
                  <p className="text-sm font-medium text-foreground/60">
                    Required Deliverables
                  </p>
                  <p className="text-foreground font-medium whitespace-pre-line">
                    {data.requiredDeliverables}
                  </p>
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
                  <p className="text-sm font-medium text-foreground/60">
                    Technical Evaluation Weight (%)
                  </p>
                  <p className="text-foreground font-medium">
                    {data.technicalWeight}%
                  </p>
                </div>

                {/* Financial Evaluation Weight */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Financial Evaluation Weight (%)
                  </p>
                  <p className="text-foreground font-medium">
                    {data.financialWeight}%
                  </p>
                </div>

                {/* Technical Qualification Threshold */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Technical Qualification Threshold
                  </p>
                  <p className="text-foreground font-medium">
                    {data.qualificationThreshold}
                  </p>
                </div>

                {/* Evaluation Methodology */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Evaluation Methodology
                  </p>
                  <p className="text-foreground font-medium">
                    {data.evaluationMethodology}
                  </p>
                </div>

                {/* Scoring System */}
                <div className="space-y-2 col-span-3">
                  <p className="text-sm font-medium text-foreground/60">
                    Scoring System
                  </p>
                  <p className="text-foreground font-medium whitespace-pre-line">
                    {data.scoringSystem}
                  </p>
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
                  <p className="text-sm font-medium text-foreground/60">
                    Bid Security Amount
                  </p>
                  <p className="text-foreground font-medium">
                    {data.bidSecurityAmount}
                  </p>
                </div>

                {/* Bid Security Form */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Bid Security Form
                  </p>
                  <p className="text-foreground font-medium">
                    {data.bidSecurityForm}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Submission Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                {/* Submission Method */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Submission Method
                  </p>
                  <p className="text-foreground font-medium">
                    {data.submissionMethod}
                  </p>
                </div>
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
                  <p className="text-sm font-medium text-foreground/60">
                    Pre-bid Meeting Date
                  </p>
                  <p className="text-foreground font-medium">
                    {formatDate(data.preBidMeeting)}
                  </p>
                </div>

                {/* Site Visit Date */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Site Visit Date
                  </p>
                  <p className="text-foreground font-medium">
                    {data.siteVisit ? formatDate(data.siteVisit) : "N/A"}
                  </p>
                </div>

                {/* Query Submission Deadline */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Query Submission Deadline
                  </p>
                  <p className="text-foreground font-medium">
                    {formatDate(data.queryDeadline)}
                  </p>
                </div>

                {/* Response to Queries Date */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Response to Queries Date
                  </p>
                  <p className="text-foreground font-medium">
                    {formatDate(data.responseToQueries)}
                  </p>
                </div>

                {/* Technical Bid Opening Date */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Technical Bid Opening Date
                  </p>
                  <p className="text-foreground font-medium">
                    {formatDate(data.techBidOpening)}
                  </p>
                </div>

                {/* Financial Bid Opening Date */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Financial Bid Opening Date
                  </p>
                  <p className="text-foreground font-medium">
                    {formatDate(data.financeBidOpening)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Terms and Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                {/* Payment Terms */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Payment Terms
                  </p>
                  <p className="text-foreground font-medium whitespace-pre-line">
                    {data.paymentTerms}
                  </p>
                </div>

                {/* Warranty Requirements */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Warranty Requirements
                  </p>
                  <p className="text-foreground font-medium whitespace-pre-line">
                    {data.warrantyRequirements}
                  </p>
                </div>

                {/* Insurance Requirements */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Insurance Requirements
                  </p>
                  <p className="text-foreground font-medium whitespace-pre-line">
                    {data.insuranceRequirements}
                  </p>
                </div>

                {/* Sub-contracting Rules */}
                <div className="space-y-2 col-span-3">
                  <p className="text-sm font-medium text-foreground/60">
                    Sub-contracting Rules
                  </p>
                  <p className="text-foreground font-medium whitespace-pre-line">
                    {data.subContractingRules}
                  </p>
                </div>

                {/* Contract Amendment Provisions */}
                <div className="space-y-2 col-span-3">
                  <p className="text-sm font-medium text-foreground/60">
                    Contract Amendment Provisions
                  </p>
                  <p className="text-foreground font-medium whitespace-pre-line">
                    {data.contractAmendment}
                  </p>
                </div>

                {/* Dispute Resolution Mechanism */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Dispute Resolution Mechanism
                  </p>
                  <p className="text-foreground font-medium whitespace-pre-line">
                    {data.disputeResolution}
                  </p>
                </div>

                {/* Force Majeure Clauses */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Force Majeure Clauses
                  </p>
                  <p className="text-foreground font-medium whitespace-pre-line">
                    {data.forceMajeure}
                  </p>
                </div>

                {/* Termination Conditions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Termination Conditions
                  </p>
                  <p className="text-foreground font-medium whitespace-pre-line">
                    {data.terminationConditions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                {/* Standard Bidding Documents */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Standard Bidding Documents
                  </p>
                  <p className="text-sm text-gray-800">
                    {getFileName(data.biddingDocs)}
                  </p>
                </div>

                {/* Technical Specification Documents */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Technical Specification Documents
                  </p>
                  <p className="text-sm text-gray-800">
                    {getFileName(data.techSpecsDocs)}
                  </p>
                </div>

                {/* Draft Contract */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Draft Contract
                  </p>
                  <p className="text-sm text-gray-800">
                    {getFileName(data.draftContract)}
                  </p>
                </div>

                {/* Bill of Quantities/Price Schedule */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Bill of Quantities/Price Schedule
                  </p>
                  <p className="text-sm text-gray-800">
                    {getFileName(data.billQuantities)}
                  </p>
                </div>

                {/* Special Instructions Document */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/60">
                    Special Instructions Document
                  </p>
                  <p className="text-sm text-gray-800">
                    {getFileName(data.specialInstructions)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </>
  );
}
