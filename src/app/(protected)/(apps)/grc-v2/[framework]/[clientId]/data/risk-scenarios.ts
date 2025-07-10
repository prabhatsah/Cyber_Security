import { RiskScenario } from "@/types/risk";

export const riskScenarios: RiskScenario[] = [
  {
    id: "1",
    risk: "Breach via Compromised Development Environment",
    description: "Company systems and/or data are breached through a compromised development environment",
    vulnerability: "Weak access controls, insufficient security measures in development environments",
    category: "Network Security"
  },
  {
    id: "2",
    risk: "Lack of Confidentiality Communication at Termination",
    description: "Confidentiality commitments are not reinforced or communicated during termination leading to data breaches",
    vulnerability: "The absence of a structured offboarding process for ensuring confidentiality",
    category: "Human Error"
  },
  {
    id: "3",
    risk: "Lack of Consent Documentation for Processing PII",
    description: "Consent for processing personally identifiable information (PII) is not properly documented",
    vulnerability: "The absence of a formalized process for obtaining and maintaining consent records",
    category: "Compliance"
  },
  {
    id: "4",
    risk: "Loss or Destruction of Critical Records",
    description: "Critical business records are lost, destroyed, or rendered inaccessible due to inadequate backup procedures",
    vulnerability: "A lack of robust backup and disaster recovery procedures",
    category: "Operational Risks"
  }
];