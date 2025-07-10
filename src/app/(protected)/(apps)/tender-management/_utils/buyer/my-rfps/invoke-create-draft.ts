import { singleFileUpload } from "@/ikon/utils/api/file-upload";
import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { toast } from "sonner";

export const startRfpDraft = async (newDraft: Record<string, any>) => {
  const biddingDocs = await singleFileUpload(newDraft.biddingDocs[0]);
  newDraft.biddingDocs = biddingDocs;
  const techSpecsDocs = await singleFileUpload(newDraft.techSpecsDocs[0]);
  newDraft.techSpecsDocs = techSpecsDocs;
  const draftContract = await singleFileUpload(newDraft.draftContract[0]);
  newDraft.draftContract = draftContract;
  const billQuantities = await singleFileUpload(newDraft.billQuantities[0]);
  newDraft.billQuantities = billQuantities;
  const specialInstructions = await singleFileUpload(
    newDraft.specialInstructions[0]
  );
  newDraft.specialInstructions = specialInstructions;
  newDraft = {
    ...newDraft,
    stepTracker: {
      "Draft Creation": "COMPLETED",
      "Template Selection": "IN PROGRESS",
      Draft: "PENDING",
      Approval: "PENDING",
      Publish: "PENDING",
    },
  };
  try {
    const processId = await mapProcessName({ processName: "RFP Draft" });
    await startProcessV2({
      processId,
      data: newDraft,
      processIdentifierFields: "id",
    });
  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};

export const addSampleTender = async () => {
  try {
    const response = await getMyInstancesV2({
      processName: "RFP Draft",
      predefinedFilters: { taskName: "View" },
      //processVariableFilters: { id: draftId },
    });

    const count = response.length + 1;

    const processId = await mapProcessName({ processName: "RFP Draft" });
    await startProcessV2({
      processId,
      data: {
        title: "Sample Tender " + count,
        referenceNumber: "HRMS-45-4-4-2026",
        description: "Project Description",
        tenderType: "open",
        procurementCategory: "services",
        budget: 3400,
        industry: "Energy",
        currency: "inr",
        publicationDate: "2025-04-07",
        submissionDeadline: "2025-04-30",
        validityPeriod: 56,
        projectDuration: "32",
        organizationName: "Keross",
        department: "Procurement",
        contactPerson: "moumita audhya",
        contactEmail: "moumita.audhya@keross.com",
        contactPhone: "2345678973",
        address: "Address",
        minTurnover: 45000,
        experienceYears: 4,
        similarProjects: "Previous Similar Projects",
        requiredCertifications: "Previous Similar Projects",
        legalRequirements: "Previous Similar Projects",
        financialStanding: "Previous Similar Projects",
        technicalCapability: "Previous Similar Projects",
        scopeOfWork: "Technical Specifications",
        technicalRequirements: "Technical Specifications",
        qualityStandards: "Technical Specifications",
        deliveryTimeline: "Technical Specifications",
        acceptanceCriteria: "Technical Specifications",
        performanceMetrics: "Technical Specifications",
        requiredDeliverables: "Technical Specifications",
        technicalWeight: 34,
        financialWeight: 27,
        qualificationThreshold: 3,
        evaluationMethodology: "least_cost",
        scoringSystem: "Scoring System",
        bidSecurityAmount: 45600,
        bidSecurityForm: "bank_guarantee",
        submissionMethod: "electronic",
        preBidMeeting: "2025-04-07",
        siteVisit: "2025-04-09",
        queryDeadline: "2025-04-11",
        responseToQueries: "2025-04-14",
        techBidOpening: "2025-04-15",
        financeBidOpening: "2025-04-21",
        paymentTerms: "Payment Terms",
        warrantyRequirements: "Payment Terms",
        insuranceRequirements: "Payment Terms",
        subContractingRules: "Payment Terms",
        contractAmendment: "Payment Terms",
        disputeResolution: "Payment Terms",
        forceMajeure: "Payment Terms",
        terminationConditions: "Payment Terms",
        biddingDocs: {
          resourceId: "e8c0ba3b-5cec-46d0-9e9f-d5ce17fcdcb1",
          resourceName: "All Appraisal List.xlsx",
          resourceSize: 0,
          resourceType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        techSpecsDocs: {
          resourceId: "0a13ac0a-3f61-4f5a-96f2-c67792006ba0",
          resourceName: "All Appraisal List.xlsx",
          resourceSize: 0,
          resourceType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        draftContract: {
          resourceId: "7562eee8-a133-4f9b-a32e-8fc1441bd22c",
          resourceName: "All Appraisal List.xlsx",
          resourceSize: 0,
          resourceType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        billQuantities: {
          resourceId: "3b399dbd-da90-4a35-8abd-da6e4e9b3890",
          resourceName: "All Appraisal List.xlsx",
          resourceSize: 0,
          resourceType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        specialInstructions: {
          resourceId: "f0173c52-ca24-4c26-818d-ee90b20a9b2a",
          resourceName: "All Appraisal List.xlsx",
          resourceSize: 0,
          resourceType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        id: "d3fac113-6013-4b65-b8e5-c3a89e63c84d",
        stepTracker: {
          "Draft Creation": "COMPLETED",
          "Template Selection": "IN PROGRESS",
          Draft: "PENDING",
          Approval: "PENDING",
          Publish: "PENDING",
        },
        selectedTemplate: "de4eb001-3d50-4d92-81b0-9321c9880ed4",
        draftContent:
          "<h1>Tender Document for Chemicals</h1><p>\n\n    </p><h2>Section: Quotation Bid Notice</h2><p><strong>Description:</strong> This section outlines the official announcement for the tender, specifying the purpose, deadline, and submission guidelines for bids.</p><h3>Subsections:</h3><ul><li><p><strong>Notice Date:</strong> [Insert Date]</p></li><li><p><strong>Submission Deadline:</strong> [Insert Date]</p></li></ul><h3>Additional Fields:</h3><ul><li><p><strong>Contact Person:</strong> [Provide details for bidder inquiries.]</p></li><li><p><strong>Location for Submission:</strong> [Provide details of submission location.]</p></li></ul><h2>Section: Eligibility Criteria</h2><p><strong>Description:</strong> Details the qualifications that bidders must meet to be considered for the tender.</p><h3>Subsections:</h3><ul><li><p><strong>Legal Compliance:</strong> [Insert legal compliance requirements.]</p></li><li><p><strong>Financial Stability:</strong> [Insert financial criteria.]</p></li></ul><h3>Additional Fields:</h3><ul><li><p><strong>Required Certifications:</strong> [List any certifications needed.]</p></li><li><p><strong>Previous Experience:</strong> [Details on prior project involvement.]</p></li></ul><h2>Section: Mandatory Information</h2><p><strong>Description:</strong> This section specifies the information that must be included with the bid submission.</p><h3>Subsections:</h3><ul><li><p><strong>Company Profile:</strong> [Details regarding the company history and operations.]</p></li><li><p><strong>Product Specifications:</strong> [Information on chemical products being offered.]</p></li></ul><h3>Additional Fields:</h3><ul><li><p><strong>References:</strong> [Include references from previous clients.]</p></li><li><p><strong>Quality Assurance Policies:</strong> [Outline quality control processes.]</p></li></ul><h2>Section: Instruction to Tenderers</h2><p><strong>Description:</strong> Detailed steps for bidders on how to prepare and submit their proposals.</p><h3>Subsections:</h3><ul><li><p><strong>Submission Format:</strong> [Guidelines on the format of submissions.]</p></li><li><p><strong>Clarifications on Bid Submission:</strong> [Process for asking questions before submission.]</p></li></ul><h3>Additional Fields:</h3><ul><li><p><strong>Bid Validity Period:</strong> [State the required validity period of bids.]</p></li><li><p><strong>Withdrawal Procedures:</strong> [Outline withdrawal process for bidders.]</p></li></ul><h2>Section: Scope of Work</h2><p><strong>Description:</strong> This section outlines the details of work expected from the successful bidder, including specific tasks and deliverables.</p><h3>Subsections:</h3><ul><li><p><strong>Deliverables:</strong> [List of expected deliverables.]</p></li><li><p><strong>Timeline:</strong> [Provide anticipated completion timelines.]</p></li></ul><h3>Additional Fields:</h3><ul><li><p><strong>Performance Metrics:</strong> [Details on how performance will be measured.]</p></li><li><p><strong>Compliance Standards:</strong> [Mention applicable industry standards.]</p></li></ul><h2>Section: Technical Evaluation</h2><p><strong>Description:</strong> Criteria and processes for evaluating the technical qualifications of received bids.</p><h3>Subsections:</h3><ul><li><p><strong>Evaluation Criteria:</strong> [Describe how technical proposals will be scored.]</p></li><li><p><strong>Weighting of Criteria:</strong> [Define the weight given to each criterion.]</p></li></ul><h3>Additional Fields:</h3><ul><li><p><strong>Interviews or Presentations:</strong> [State if personal presentations are requested.]</p></li><li><p><strong>Sample Analysis:</strong> [Outline any testing of provided samples.]</p></li></ul><h2>Section: Price Bid</h2><p><strong>Description:</strong> This section covers the stipulations related to pricing and cost proposals.</p><h3>Subsections:</h3><ul><li><p><strong>Cost Elements:</strong> [Define what needs to be included in the pricing.]</p></li><li><p><strong>Submission Guidelines:</strong> [Instructions on how to submit the price proposal.]</p></li></ul><h3>Additional Fields:</h3><ul><li><p><strong>Discounts:</strong> [Describe any allowable discounts or adjustments.]</p></li><li><p><strong>Payment Terms:</strong> [Outline terms of payment after project completion.]</p></li></ul><p></p>",
        draftFinalized: true,
      },
      processIdentifierFields: "id",
    });

    toast.success("Sample Tender Created Successfully");
  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};

export const editRfpData = async (
  draftId: string,
  editedDraft: Record<string, any>
) => {
  try {
    const response = await getMyInstancesV2({
      processName: "RFP Draft",
      predefinedFilters: { taskName: "Draft" },
      processVariableFilters: { id: draftId },
    });

    if (response.length > 0) {
      const taskId = response[0].taskId;
      const biddingDocs = await singleFileUpload(editedDraft.biddingDocs[0]);
      editedDraft.biddingDocs = biddingDocs;
      const techSpecsDocs = await singleFileUpload(
        editedDraft.techSpecsDocs[0]
      );
      editedDraft.techSpecsDocs = techSpecsDocs;
      const draftContract = await singleFileUpload(
        editedDraft.draftContract[0]
      );
      editedDraft.draftContract = draftContract;
      const billQuantities = await singleFileUpload(
        editedDraft.billQuantities[0]
      );
      editedDraft.billQuantities = billQuantities;
      const specialInstructions = await singleFileUpload(
        editedDraft.specialInstructions[0]
      );
      editedDraft.specialInstructions = specialInstructions;
      await invokeAction({
        taskId: taskId,
        transitionName: "draft edit",
        data: editedDraft,
        processInstanceIdentifierField: "id",
      });
    }
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};
