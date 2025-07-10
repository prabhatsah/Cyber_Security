import { Framework, Control } from "./types"
import { v4 as uuidv4 } from 'uuid'

// Helper function to create a control
const createControl = (
  id: string,
  name: string,
  description: string,
  riskLevel: "High" | "Medium" | "Low",
  owner: string,
  frameworks: { id: string, mappingId: string, weight: number }[],
  objectives: string[],
  implementation: string[],
  testing: string[],
  documentation: string[]
): Control => ({
  id,
  name,
  description,
  riskLevel,
  owner,
  status: "In Progress",
  lastReview: new Date(),
  frameworks,
  objectives,
  implementation,
  testing,
  documentation
})

export const controls: Control[] = [
  // ISO 27001:2022 Organizational Controls (A.5)
  createControl(
    "A.5.1",
    "Policies for information security",
    "Establish and maintain information security policies that provide management direction and support",
    "High",
    "CISO",
    [{ id: "ISO27001", mappingId: "A.5.1", weight: 3 }],
    [
      "Define comprehensive information security policies",
      "Ensure alignment with business objectives",
      "Establish review and update procedures"
    ],
    [
      "Document information security policies",
      "Obtain management approval",
      "Communicate policies to all stakeholders",
      "Implement policy review cycle"
    ],
    [
      "Review policy documentation",
      "Verify management approval",
      "Check communication records",
      "Assess policy effectiveness"
    ],
    [
      "Information Security Policy",
      "Policy Review Records",
      "Communication Records"
    ]
  ),

  createControl(
    "A.5.2",
    "Information security roles and responsibilities",
    "Define and allocate information security responsibilities",
    "High",
    "HR Director",
    [{ id: "ISO27001", mappingId: "A.5.2", weight: 3 }],
    [
      "Define security roles and responsibilities",
      "Ensure clear accountability",
      "Establish reporting lines"
    ],
    [
      "Document roles and responsibilities",
      "Update job descriptions",
      "Create responsibility matrix",
      "Implement reporting structure"
    ],
    [
      "Review role documentation",
      "Verify responsibility assignments",
      "Check reporting effectiveness"
    ],
    [
      "Security Organization Chart",
      "RACI Matrix",
      "Job Descriptions"
    ]
  ),

  createControl(
    "A.5.3",
    "Segregation of duties",
    "Segregate conflicting duties and areas of responsibility",
    "High",
    "CISO",
    [{ id: "ISO27001", mappingId: "A.5.3", weight: 3 }],
    [
      "Identify conflicting duties",
      "Define segregation requirements",
      "Implement controls to prevent conflicts"
    ],
    [
      "Document segregation rules",
      "Configure access controls",
      "Establish review procedures",
      "Train staff on requirements"
    ],
    [
      "Review access rights",
      "Test segregation controls",
      "Audit compliance",
      "Validate effectiveness"
    ],
    [
      "Segregation Matrix",
      "Access Control Policies",
      "Audit Reports"
    ]
  ),

  createControl(
    "A.5.4",
    "Management responsibilities",
    "Management shall actively support security within the organization",
    "High",
    "CIO",
    [{ id: "ISO27001", mappingId: "A.5.4", weight: 3 }],
    [
      "Demonstrate management commitment",
      "Provide necessary resources",
      "Ensure policy compliance"
    ],
    [
      "Establish security governance",
      "Allocate resources",
      "Review security metrics",
      "Support initiatives"
    ],
    [
      "Assess resource allocation",
      "Review management decisions",
      "Evaluate effectiveness"
    ],
    [
      "Governance Documents",
      "Resource Plans",
      "Meeting Minutes"
    ]
  ),

  createControl(
    "A.5.5",
    "Contact with authorities",
    "Maintain appropriate contacts with relevant authorities",
    "Medium",
    "Legal Counsel",
    [{ id: "ISO27001", mappingId: "A.5.5", weight: 2 }],
    [
      "Identify relevant authorities",
      "Establish contact procedures",
      "Maintain communication channels"
    ],
    [
      "Document contact details",
      "Define escalation procedures",
      "Train responsible staff",
      "Update contact information"
    ],
    [
      "Verify contact information",
      "Test communication channels",
      "Review procedures"
    ],
    [
      "Contact Directory",
      "Communication Procedures",
      "Training Records"
    ]
  ),

  createControl(
    "A.5.6",
    "Contact with special interest groups",
    "Maintain appropriate contacts with special interest groups or other specialist security forums and professional associations",
    "Medium",
    "Security Manager",
    [{ id: "ISO27001", mappingId: "A.5.6", weight: 2 }],
    [
      "Establish relationships with security groups",
      "Share and receive security information",
      "Participate in industry forums"
    ],
    [
      "Identify relevant groups",
      "Establish communication channels",
      "Document information sharing procedures",
      "Maintain contact list"
    ],
    [
      "Review contact list",
      "Verify information sharing",
      "Assess relationship value"
    ],
    [
      "Contact List",
      "Meeting Records",
      "Information Sharing Logs"
    ]
  ),

  createControl(
    "A.5.7",
    "Threat intelligence",
    "Information relating to information security threats shall be collected and analyzed",
    "High",
    "Security Operations Manager",
    [{ id: "ISO27001", mappingId: "A.5.7", weight: 3 }],
    [
      "Collect threat intelligence",
      "Analyze security threats",
      "Share relevant information"
    ],
    [
      "Implement threat feeds",
      "Establish analysis process",
      "Create reporting procedures",
      "Train analysts"
    ],
    [
      "Review threat data",
      "Validate analysis process",
      "Check reporting effectiveness"
    ],
    [
      "Threat Reports",
      "Analysis Procedures",
      "Intelligence Feeds"
    ]
  ),

  // People Controls (A.6)
  createControl(
    "A.6.1",
    "Screening",
    "Verify background of individuals according to relevant laws and regulations",
    "High",
    "HR Director",
    [{ id: "ISO27001", mappingId: "A.6.1", weight: 3 }],
    [
      "Define screening requirements",
      "Ensure legal compliance",
      "Protect confidential information"
    ],
    [
      "Establish screening procedures",
      "Conduct background checks",
      "Document results",
      "Maintain records"
    ],
    [
      "Review screening process",
      "Verify documentation",
      "Audit compliance"
    ],
    [
      "Screening Policy",
      "Background Check Records",
      "Compliance Reports"
    ]
  ),

  createControl(
    "A.6.2",
    "Terms and conditions of employment",
    "Employee responsibilities for information security shall be addressed prior to employment",
    "High",
    "HR Director",
    [{ id: "ISO27001", mappingId: "A.6.2", weight: 3 }],
    [
      "Define security responsibilities",
      "Include in employment terms",
      "Obtain acknowledgment"
    ],
    [
      "Update employment contracts",
      "Create security agreements",
      "Document responsibilities",
      "Train HR staff"
    ],
    [
      "Review contracts",
      "Verify acknowledgments",
      "Audit compliance"
    ],
    [
      "Employment Contracts",
      "Security Agreements",
      "Training Records"
    ]
  ),

  // Physical Controls (A.7)
  createControl(
    "A.7.1",
    "Physical security perimeters",
    "Define and use security perimeters to protect areas containing sensitive information",
    "High",
    "Facilities Manager",
    [{ id: "ISO27001", mappingId: "A.7.1", weight: 3 }],
    [
      "Define security perimeters",
      "Implement physical barriers",
      "Control access points"
    ],
    [
      "Install security systems",
      "Define access procedures",
      "Monitor perimeters",
      "Maintain barriers"
    ],
    [
      "Test security systems",
      "Review access logs",
      "Inspect barriers"
    ],
    [
      "Physical Security Policy",
      "Access Logs",
      "Inspection Reports"
    ]
  ),

  createControl(
    "A.7.2",
    "Physical entry controls",
    "Secure areas shall be protected by appropriate entry controls",
    "High",
    "Facilities Manager",
    [{ id: "ISO27001", mappingId: "A.7.2", weight: 3 }],
    [
      "Control physical access",
      "Monitor entry points",
      "Log access attempts"
    ],
    [
      "Install access systems",
      "Issue access cards",
      "Maintain logs",
      "Review access rights"
    ],
    [
      "Test access controls",
      "Review logs",
      "Audit access rights"
    ],
    [
      "Access Control Policy",
      "Access Logs",
      "Visitor Records"
    ]
  ),

  // Technological Controls (A.8)
  createControl(
    "A.8.1",
    "User endpoint devices",
    "Implement controls to protect information accessed through endpoint devices",
    "High",
    "IT Security Manager",
    [{ id: "ISO27001", mappingId: "A.8.1", weight: 3 }],
    [
      "Secure endpoint devices",
      "Protect sensitive data",
      "Control access rights"
    ],
    [
      "Deploy endpoint protection",
      "Configure security settings",
      "Monitor device usage",
      "Update security controls"
    ],
    [
      "Test security controls",
      "Review configurations",
      "Audit device usage"
    ],
    [
      "Endpoint Security Policy",
      "Configuration Standards",
      "Audit Reports"
    ]
  ),

  // NIST CSF Controls
  createControl(
    "ID.AM-1",
    "Asset Inventory",
    "Physical devices and systems within the organization are inventoried",
    "High",
    "IT Asset Manager",
    [{ id: "NIST_CSF", mappingId: "ID.AM-1", weight: 3 }],
    [
      "Maintain asset inventory",
      "Track system components",
      "Update asset records"
    ],
    [
      "Deploy asset management system",
      "Document all assets",
      "Establish update procedures",
      "Train staff"
    ],
    [
      "Verify inventory accuracy",
      "Review procedures",
      "Audit records"
    ],
    [
      "Asset Register",
      "Inventory Procedures",
      "Audit Reports"
    ]
  ),

  // SOC 2 Controls
  createControl(
    "CC1.1",
    "Control Environment",
    "The entity demonstrates a commitment to integrity and ethical values",
    "High",
    "Compliance Manager",
    [{ id: "SOC2", mappingId: "CC1.1", weight: 3 }],
    [
      "Establish ethical standards",
      "Communicate values",
      "Monitor compliance"
    ],
    [
      "Create code of conduct",
      "Implement training program",
      "Set up reporting channels",
      "Document procedures"
    ],
    [
      "Review policies",
      "Assess training effectiveness",
      "Audit compliance"
    ],
    [
      "Code of Conduct",
      "Training Materials",
      "Compliance Reports"
    ]
  ),

  // GDPR Controls
  createControl(
    "GDPR-1",
    "Lawful Processing",
    "Personal data shall be processed lawfully, fairly and in a transparent manner",
    "High",
    "Data Protection Officer",
    [{ id: "GDPR", mappingId: "Art-5-1-a", weight: 3 }],
    [
      "Ensure lawful processing",
      "Maintain transparency",
      "Document processing activities"
    ],
    [
      "Identify legal basis",
      "Create privacy notices",
      "Maintain processing records",
      "Train staff"
    ],
    [
      "Review processing activities",
      "Verify legal basis",
      "Audit documentation"
    ],
    [
      "Processing Records",
      "Privacy Notices",
      "Consent Forms"
    ]
  ),

  // PCI DSS Controls
  createControl(
    "PCI-1",
    "Firewall Configuration",
    "Install and maintain a firewall configuration to protect cardholder data",
    "High",
    "Network Security Manager",
    [{ id: "PCI_DSS", mappingId: "Req-1", weight: 3 }],
    [
      "Protect cardholder data",
      "Configure firewalls",
      "Maintain security"
    ],
    [
      "Deploy firewalls",
      "Document configurations",
      "Review rules regularly",
      "Monitor traffic"
    ],
    [
      "Test configurations",
      "Review rule sets",
      "Audit changes"
    ],
    [
      "Firewall Policies",
      "Configuration Standards",
      "Change Logs"
    ]
  ),

  // COBIT Controls
  createControl(
    "EDM01",
    "Governance Framework",
    "Ensure Governance Framework Setting and Maintenance",
    "High",
    "IT Governance Manager",
    [{ id: "COBIT", mappingId: "EDM01", weight: 3 }],
    [
      "Establish governance system",
      "Align with enterprise goals",
      "Monitor effectiveness"
    ],
    [
      "Define framework",
      "Assign responsibilities",
      "Create policies",
      "Set up monitoring"
    ],
    [
      "Review framework",
      "Assess alignment",
      "Evaluate effectiveness"
    ],
    [
      "Governance Framework",
      "Policy Documents",
      "Assessment Reports"
    ]
  )
]

export const frameworks: Framework[] = [
  {
    id: "ISO27001",
    name: "ISO/IEC 27001:2022",
    description: "Information Security Management System Standard",
    version: "2022",
    controls: controls.filter(c => c.frameworks.some(f => f.id === "ISO27001")).map(c => c.id),
    totalWeight: 100,
  },
  {
    id: "NIST_CSF",
    name: "NIST Cybersecurity Framework",
    description: "Framework for Improving Critical Infrastructure Cybersecurity",
    version: "2.0",
    controls: controls.filter(c => c.frameworks.some(f => f.id === "NIST_CSF")).map(c => c.id),
    totalWeight: 100,
  },
  {
    id: "SOC2",
    name: "SOC 2",
    description: "Service Organization Control 2",
    version: "2017",
    controls: controls.filter(c => c.frameworks.some(f => f.id === "SOC2")).map(c => c.id),
    totalWeight: 100,
  },
  {
    id: "GDPR",
    name: "GDPR",
    description: "General Data Protection Regulation",
    version: "2016",
    controls: controls.filter(c => c.frameworks.some(f => f.id === "GDPR")).map(c => c.id),
    totalWeight: 100,
  },
  {
    id: "PCI_DSS",
    name: "PCI DSS",
    description: "Payment Card Industry Data Security Standard",
    version: "4.0",
    controls: controls.filter(c => c.frameworks.some(f => f.id === "PCI_DSS")).map(c => c.id),
    totalWeight: 100,
  },
  {
    id: "COBIT",
    name: "COBIT",
    description: "Control Objectives for Information and Related Technologies",
    version: "2019",
    controls: controls.filter(c => c.frameworks.some(f => f.id === "COBIT")).map(c => c.id),
    totalWeight: 100,
  }
]

export const getRisksByCategory = (category: string) => {
  return controls.filter(control => 
    control.frameworks.some(f => f.id === category)
  )
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
  return [...controls].sort((a, b) => {
    const aScore = a.frameworks.reduce((sum, f) => sum + f.weight, 0)
    const bScore = b.frameworks.reduce((sum, f) => sum + f.weight, 0)
    return bScore - aScore
  })
}