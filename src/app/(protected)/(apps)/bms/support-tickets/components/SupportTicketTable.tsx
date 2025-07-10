'use client'
import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import React, { useEffect, useState, useTransition } from 'react'
import { Badge } from "@/shadcn/ui/badge"


const rowsToDisplay = [
    {
        id: 1,
        subject: "HVAC system not responding to temperature changes",
        customer: "John Smith",
        email: "john.smith@example.com",
        category: "Technical",
        priority: "High",
        status: "Open",
        createdAt: "2025-04-15T10:23:00",
        assignedTo: "Sarah Johnson",
        description: "The HVAC system in Zone B is not responding to temperature adjustments from the control panel. We've tried restarting the system but the issue persists."
    },
    {
        id: 2,
        subject: "Billing discrepancy on monthly statement",
        customer: "Emily Davis",
        email: "emily.davis@example.com",
        category: "Billing",
        priority: "Medium",
        status: "In Progress",
        createdAt: "2025-04-14T09:15:00",
        assignedTo: "James Wilson",
        description: "There appears to be a discrepancy on our monthly statement. We were charged for premium support but we're on the standard plan."
    },
    {
        id: 3,
        subject: "Request for additional user licenses",
        customer: "Michael Brown",
        email: "michael.brown@example.com",
        category: "Service",
        priority: "Low",
        status: "Open",
        createdAt: "2025-04-13T14:32:00",
        assignedTo: "Lisa Anderson",
        description: "We need to add 5 additional user licenses to our account. Please provide a quote and timeline for activation."
    },
    {
        id: 4,
        subject: "Security system false alarms",
        customer: "Robert Wilson",
        email: "robert.wilson@example.com",
        category: "Technical",
        priority: "Critical",
        status: "In Progress",
        createdAt: "2025-04-12T11:47:00",
        assignedTo: "Sarah Johnson",
        description: "The security system in the main lobby has been triggering false alarms for the past 24 hours. This is disrupting operations and needs immediate attention."
    },
    {
        id: 5,
        subject: "Digital twin visualization issues",
        customer: "Jennifer Lee",
        email: "jennifer.lee@example.com",
        category: "Technical",
        priority: "Medium",
        status: "Resolved",
        createdAt: "2025-04-11T08:22:00",
        assignedTo: "James Wilson",
        description: "The digital twin visualization is not loading correctly in the dashboard. Some elements are missing or displaying incorrectly."
    },
    {
        id: 6,
        subject: "Request for training session",
        customer: "David Miller",
        email: "david.miller@example.com",
        category: "Service",
        priority: "Low",
        status: "Closed",
        createdAt: "2025-04-10T15:30:00",
        assignedTo: "Lisa Anderson",
        description: "We have several new staff members who need training on the building management system. Please schedule a training session at your earliest convenience."
    },
    {
        id: 7,
        subject: "API integration not working",
        customer: "Sarah Thompson",
        email: "sarah.thompson@example.com",
        category: "Technical",
        priority: "High",
        status: "Open",
        createdAt: "2025-04-09T13:15:00",
        assignedTo: "Unassigned",
        description: "We're trying to integrate your API with our internal systems but are encountering authentication errors. Please provide assistance with the integration process."
    },
    {
        id: 8,
        subject: "Upgrade package inquiry",
        customer: "Thomas Anderson",
        email: "thomas.anderson@example.com",
        category: "Product",
        priority: "Medium",
        status: "Closed",
        createdAt: "2025-04-08T10:00:00",
        assignedTo: "James Wilson",
        description: "We're interested in upgrading to the enterprise package. Please provide information about the additional features and pricing."
    },
]
export default function SupportTicketTable() {
    // Get status badge variant
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Open":
                return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Open</Badge>
            case "In Progress":
                return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">In Progress</Badge>
            case "Resolved":
                return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Resolved</Badge>
            case "Closed":
                return <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">Closed</Badge>
            default:
                return <Badge variant="outline">Unknown</Badge>
        }
    }
    // Get priority badge variant
    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "Critical":
                return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Critical</Badge>
            case "High":
                return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">High</Badge>
            case "Medium":
                return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Medium</Badge>
            case "Low":
                return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Low</Badge>
            default:
                return <Badge variant="outline">Unknown</Badge>
        }
    }

    const extraParams: DTExtraParamsProps = {
        actionMenu: {
            items: [
                {
                    label: "View Details",
                    // onClick: (rowData: Record<string, string>) => {
                    //     setEditUserDetails(rowData);
                    //     setOpenExistingUsersForm(true);
                    // },
                },
                {
                    label: "Assign",
                },
                {
                    label: "Change Status",
                },

            ]
        },
        header: true,
        grouping: true,
    };

    const UsersColumns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: "subject",
            // id: "userDetails",
            accessorFn: (row) => `${row.subject}`,
        },
        {
            accessorKey: "customer",
            accessorFn: (row) => `${row.customer}`,
        },
        {
            accessorKey: "status",
            cell: ({ row }) => getStatusBadge(row.original.status),
        },
        {
            accessorKey: "priority",
            // accessorFn: (row) => `${row.priority}`,
            cell: ({ row }) => getPriorityBadge(row.original.priority),
        },
        {
            accessorKey: "assignedTo",
            accessorFn: (row) => `${row.assignedTo}`,
        }
    ]

    return (
        <>
            <DataTable
                columns={UsersColumns}
                data={rowsToDisplay}
                extraParams={extraParams}
            />

        </>
    )
}
