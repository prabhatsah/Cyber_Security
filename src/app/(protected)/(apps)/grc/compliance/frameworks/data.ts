import { Framework, Control } from "./types";

export const frameworks: Framework[] = [
  {
    id: "F1",
    name: "ISO 27001",
    description: "Information Security Management System Standard",
    version: "2022",
    controls: ["CTR1", "CTR2", "CTR3"],
    totalWeight: 100,
  },
  {
    id: "F2",
    name: "NIST CSF",
    description: "Cybersecurity Framework",
    version: "1.1",
    controls: ["CTR1", "CTR4", "CTR5"],
    totalWeight: 100,
  },
  {
    id: "F3",
    name: "SOC 2",
    description: "Trust Services Criteria",
    version: "2017",
    controls: ["CTR2", "CTR3", "CTR6"],
    totalWeight: 100,
  },
];

export const controls: Control[] = [
  {
    id: "CTR1",
    name: "Access Control Policy",
    description: "Enterprise-wide access control policy and procedures",
    riskLevel: "High",
    owner: "John Smith",
    status: "Implemented",
    lastReview: new Date("2024-03-15"),
    frameworks: [
      { id: "F1", mappingId: "A.9.1", weight: 35 },
      { id: "F2", mappingId: "PR.AC-1", weight: 40 },
    ],
    objectives: [
      "Define access control principles",
      "Establish authorization process",
      "Implement least privilege",
    ],
    implementation: [
      "Document access policy",
      "Configure role-based access",
      "Regular access reviews",
    ],
    testing: [
      "Quarterly audits",
      "Access request testing",
      "Privilege verification",
    ],
    documentation: [
      "Access Control Policy",
      "Role Matrix",
      "Review Procedures",
    ],
  },
  {
    id: "CTR2",
    name: "Risk Assessment",
    description: "Systematic approach to risk identification and assessment",
    riskLevel: "High",
    owner: "Sarah Johnson",
    status: "Implemented",
    lastReview: new Date("2024-03-10"),
    frameworks: [
      { id: "F1", mappingId: "A.8.1", weight: 30 },
      { id: "F3", mappingId: "CC3.1", weight: 35 },
    ],
    objectives: [
      "Identify security risks",
      "Assess risk impact",
      "Define risk treatment",
    ],
    implementation: [
      "Risk assessment methodology",
      "Regular risk reviews",
      "Risk register maintenance",
    ],
    testing: [
      "Methodology validation",
      "Risk scoring accuracy",
      "Treatment effectiveness",
    ],
    documentation: [
      "Risk Assessment Policy",
      "Risk Register",
      "Treatment Plans",
    ],
  },
  {
    id: "CTR3",
    name: "Security Monitoring",
    description: "Continuous security monitoring and incident detection",
    riskLevel: "High",
    owner: "Mike Brown",
    status: "In Progress",
    lastReview: new Date("2024-03-01"),
    frameworks: [
      { id: "F1", mappingId: "A.12.4", weight: 35 },
      { id: "F3", mappingId: "CC7.2", weight: 30 },
    ],
    objectives: [
      "Monitor security events",
      "Detect incidents",
      "Enable rapid response",
    ],
    implementation: [
      "SIEM deployment",
      "Alert configuration",
      "Response procedures",
    ],
    testing: ["Alert validation", "Detection testing", "Response timing"],
    documentation: [
      "Monitoring Policy",
      "Alert Procedures",
      "Response Playbooks",
    ],
  },
];
