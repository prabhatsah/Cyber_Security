import { Card, CardHeader, CardTitle, CardContent } from '@/shadcn/ui/card'
import React, { useState } from 'react'

const ComponentCard = () => {


    const [frameworks] = useState<Framework[]>([
        {
          id: "ISO27001",
          name: "ISO/IEC 27001:2022",
          category: "Information Security",
          status: "Active",
          lastUpdate: "2024-03-15",
          evidenceCount: 24,
          completionRate: 85,
          description: "Information Security Management System Standard",
          controls: [
            { id: "A.5.1", name: "Information Security Policies", status: "Implemented", lastReview: "2024-03-01" },
            { id: "A.6.1", name: "Internal Organization", status: "In Progress", lastReview: "2024-02-15" },
            { id: "A.7.1", name: "Human Resource Security", status: "Implemented", lastReview: "2024-03-10" }
          ],
          requirements: [
            { id: "R1", name: "Policy Documentation", status: "Complete", dueDate: "2024-04-01" },
            { id: "R2", name: "Risk Assessment", status: "In Progress", dueDate: "2024-04-15" },
            { id: "R3", name: "Internal Audit", status: "Pending", dueDate: "2024-05-01" }
          ]
        },
        {
          id: "COBIT2019",
          name: "COBIT 2019",
          category: "IT Governance",
          status: "Active",
          lastUpdate: "2024-03-10",
          evidenceCount: 18,
          completionRate: 92,
          description: "Framework for IT governance and management",
          controls: [
            { id: "EDM01", name: "Governance Framework", status: "Implemented", lastReview: "2024-03-05" },
            { id: "APO01", name: "IT Management Framework", status: "Implemented", lastReview: "2024-02-28" }
          ],
          requirements: [
            { id: "R1", name: "Governance Documentation", status: "Complete", dueDate: "2024-04-01" },
            { id: "R2", name: "Process Assessment", status: "In Progress", dueDate: "2024-04-30" }
          ]
        },
        {
          id: "NIST800-53",
          name: "NIST SP 800-53",
          category: "Security Controls",
          status: "Active",
          lastUpdate: "2024-03-01",
          evidenceCount: 32,
          completionRate: 78,
          description: "Security and Privacy Controls for Information Systems and Organizations",
          controls: [
            { id: "AC-1", name: "Access Control Policy", status: "Implemented", lastReview: "2024-02-20" },
            { id: "AU-1", name: "Audit Policy", status: "In Progress", lastReview: "2024-03-01" }
          ],
          requirements: [
            { id: "R1", name: "Control Implementation", status: "In Progress", dueDate: "2024-05-15" },
            { id: "R2", name: "Security Assessment", status: "Pending", dueDate: "2024-06-01" }
          ]
        }
      ])
      

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Frameworks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{frameworks.length}</div>
            <p className="text-xs text-muted-foreground">
              Active frameworks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evidence Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {frameworks.reduce((sum, f) => sum + f.evidenceCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all frameworks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(frameworks.reduce((sum, f) => sum + f.completionRate, 0) / frameworks.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              All frameworks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {frameworks.filter(f => f.status === "Under Review").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending updates
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ComponentCard
