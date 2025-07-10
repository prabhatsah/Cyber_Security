import { Risk, RiskCategory } from "./types"

export const risks: Risk[] = [
  // Priority 1 - Critical Risks
  {
    id: "RSK-001",
    name: "Data Breach",
    category: "Cybersecurity",
    description: "Critical data exposure through unauthorized access or system compromise",
    potentialImpact: "Severe financial loss, regulatory penalties, reputation damage, and loss of customer trust",
    owner: "Sarah Johnson - CISO",
    severity: "High",
    likelihood: 4,
    impact: 5,
    riskScore: 20,
    existingControls: [
      "Multi-factor Authentication",
      "Encryption at rest and in transit",
      "Access control systems",
      "Security monitoring and alerting",
      "Regular security audits"
    ],
    treatmentStrategy: "Mitigate",
    requiredActions: [
      "Implement Zero Trust Architecture",
      "Enhance data loss prevention systems",
      "Conduct penetration testing",
      "Update incident response plan",
      "Strengthen access controls"
    ],
    timeline: "Q2 2024",
    resources: [
      "Security Team",
      "External Security Consultants",
      "Security Tools Budget",
      "Training Resources"
    ],
    monitoringMetrics: [
      "Security incidents",
      "Failed access attempts",
      "Data encryption coverage",
      "Security audit findings"
    ],
    lastReviewDate: new Date("2024-03-01"),
    nextReviewDate: new Date("2024-04-01"),
    status: "Active",
    reviewHistory: [
      {
        date: new Date("2024-03-01"),
        reviewer: "Sarah Johnson",
        comments: "Identified new vulnerabilities requiring immediate attention",
        changes: ["Added new security controls", "Updated risk assessment"]
      }
    ]
  },
  {
    id: "RSK-002",
    name: "Supply Chain Disruption",
    category: "Operational",
    description: "Major disruption in critical supply chain components",
    potentialImpact: "Production stoppage, revenue loss, customer dissatisfaction",
    owner: "Michael Chen - Operations Director",
    severity: "High",
    likelihood: 4,
    impact: 5,
    riskScore: 20,
    existingControls: [
      "Multiple supplier relationships",
      "Buffer inventory",
      "Supply chain monitoring system",
      "Contingency contracts"
    ],
    treatmentStrategy: "Mitigate",
    requiredActions: [
      "Diversify supplier base",
      "Increase safety stock levels",
      "Develop alternative logistics routes",
      "Implement real-time monitoring"
    ],
    timeline: "Q3 2024",
    resources: [
      "Procurement Team",
      "Logistics Department",
      "Working Capital",
      "Technology Infrastructure"
    ],
    monitoringMetrics: [
      "Supplier performance metrics",
      "Inventory levels",
      "Lead times",
      "Cost variations"
    ],
    lastReviewDate: new Date("2024-02-15"),
    nextReviewDate: new Date("2024-05-15"),
    status: "Active",
    reviewHistory: [
      {
        date: new Date("2024-02-15"),
        reviewer: "Michael Chen",
        comments: "Global supply chain issues increasing risk level",
        changes: ["Updated supplier assessment", "Revised inventory levels"]
      }
    ]
  },
  // Priority 2 - High Risks
  {
    id: "RSK-003",
    name: "Regulatory Non-Compliance",
    category: "Compliance",
    description: "Failure to comply with new regulatory requirements",
    potentialImpact: "Significant fines, legal action, business restrictions",
    owner: "Emily Wong - Compliance Manager",
    severity: "High",
    likelihood: 3,
    impact: 5,
    riskScore: 15,
    existingControls: [
      "Compliance monitoring system",
      "Regular audits",
      "Staff training program",
      "Policy management framework"
    ],
    treatmentStrategy: "Mitigate",
    requiredActions: [
      "Update compliance framework",
      "Enhance monitoring systems",
      "Conduct staff training",
      "Implement automated checks"
    ],
    timeline: "Q2 2024",
    resources: [
      "Compliance Team",
      "Legal Department",
      "Training Budget",
      "Technology Resources"
    ],
    monitoringMetrics: [
      "Compliance violations",
      "Audit findings",
      "Training completion rates",
      "Policy adherence"
    ],
    lastReviewDate: new Date("2024-03-10"),
    nextReviewDate: new Date("2024-06-10"),
    status: "Active",
    reviewHistory: [
      {
        date: new Date("2024-03-10"),
        reviewer: "Emily Wong",
        comments: "New regulations requiring system updates",
        changes: ["Updated compliance checklist", "Revised training materials"]
      }
    ]
  },
  // Priority 3 - Medium Risks
  {
    id: "RSK-004",
    name: "Technology Obsolescence",
    category: "Technical",
    description: "Critical systems becoming outdated or unsupported",
    potentialImpact: "Reduced efficiency, security vulnerabilities, compatibility issues",
    owner: "David Park - CTO",
    severity: "Medium",
    likelihood: 3,
    impact: 3,
    riskScore: 9,
    existingControls: [
      "Technology roadmap",
      "Regular system assessments",
      "Upgrade schedule",
      "Legacy system documentation"
    ],
    treatmentStrategy: "Mitigate",
    requiredActions: [
      "Develop modernization plan",
      "Budget for upgrades",
      "Train staff on new systems",
      "Phase out legacy systems"
    ],
    timeline: "Q4 2024",
    resources: [
      "IT Team",
      "Modernization Budget",
      "Training Resources",
      "Project Management"
    ],
    monitoringMetrics: [
      "System age",
      "Maintenance costs",
      "Performance metrics",
      "Incident rates"
    ],
    lastReviewDate: new Date("2024-02-20"),
    nextReviewDate: new Date("2024-05-20"),
    status: "Active",
    reviewHistory: [
      {
        date: new Date("2024-02-20"),
        reviewer: "David Park",
        comments: "Identified systems requiring upgrade",
        changes: ["Created upgrade timeline", "Allocated budget"]
      }
    ]
  },
  // Priority 4 - Lower Risks
  {
    id: "RSK-005",
    name: "Market Share Decline",
    category: "Strategic",
    description: "Gradual loss of market position to competitors",
    potentialImpact: "Reduced revenue, market value, and growth potential",
    owner: "Jennifer Lee - Strategy Director",
    severity: "Medium",
    likelihood: 2,
    impact: 4,
    riskScore: 8,
    existingControls: [
      "Market analysis program",
      "Competitive intelligence",
      "Customer feedback system",
      "Product development pipeline"
    ],
    treatmentStrategy: "Mitigate",
    requiredActions: [
      "Enhance product features",
      "Improve customer service",
      "Increase marketing efforts",
      "Develop new offerings"
    ],
    timeline: "Q3 2024",
    resources: [
      "Marketing Team",
      "Product Development",
      "Research Budget",
      "Customer Service"
    ],
    monitoringMetrics: [
      "Market share percentage",
      "Customer satisfaction",
      "Competitive position",
      "Revenue growth"
    ],
    lastReviewDate: new Date("2024-03-05"),
    nextReviewDate: new Date("2024-06-05"),
    status: "Active",
    reviewHistory: [
      {
        date: new Date("2024-03-05"),
        reviewer: "Jennifer Lee",
        comments: "Market analysis shows increasing competition",
        changes: ["Updated market strategy", "Revised growth targets"]
      }
    ]
  }
]

export const getRisksByCategory = (category: RiskCategory) => {
  return risks.filter(risk => risk.category === category)
}

export const calculateRiskScore = (likelihood: number, impact: number) => {
  return likelihood * impact
}

export const getRiskPriorityLevel = (score: number): string => {
  if (score >= 15) return "Critical"
  if (score >= 10) return "High"
  if (score >= 5) return "Medium"
  return "Low"
}

export const getPriorityRating = (score: number): number => {
  if (score >= 15) return 1 // Critical priority
  if (score >= 10) return 2 // High priority
  if (score >= 5) return 3  // Medium priority
  return 4 // Low priority
}

export const getRisksByPriority = () => {
  return [...risks].sort((a, b) => b.riskScore - a.riskScore)
}