'use client'
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import React, { useState } from "react";
import CustomControlForm from "./addCustomModal";
import { DataTable } from "@/ikon/components/data-table";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus, Upload } from "lucide-react";
import FrameworkDetailsModal from "./frameworkDetailsModal";
import UploadControl from "./dataUpload";
import { FrameworkData } from "./page"; // Import the type from page.tsx
import { Input } from "@/shadcn/ui/input";

export default function CustomControlTable({ userIdNameMap, profileData, customControlData, frameWorkData, domainData }: { 
    userIdNameMap: { value: string; label: string }[]; 
    profileData: Record<string, any>; 
    customControlData: Record<string, any>[]; 
    frameWorkData: FrameworkData[]; // Use the specific type
    domainData: Record<string, any>[];
}) {
    const [openGoverningForm, setOpenGoverningForm] = useState<boolean>(false);
    const [selectedControl, setSelectedControl] = useState<Record<string, any> | null>(null);
    const [isFrameworkModalOpen, setIsFrameworkModalOpen] = useState<boolean>(false);
    const [selectedFramework, setSelectedFramework] = useState<Record<string, any> | null>(null);
    const [upload, setUpload] = useState<boolean>(false);

    const handleFrameworkClick = (framework: Record<string, any>) => {
        setSelectedFramework(framework);
        setIsFrameworkModalOpen(true);
    };

    const columns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: "refId",
            header: "Reference Id",
        },
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <div className="truncate max-w-[300px]" title={row.getValue("title")}>
                    {row.getValue("title") || "N/A"}
                </div>
            ),
        },
        {
            accessorKey: "domain",
            header: "Domain",
            cell: ({ row }) => (
                <div className="truncate max-w-[300px]" title={row.getValue("domain")}>
                    {row.getValue("domain") || "N/A"}
                </div>
            ),
        },
        {
            accessorKey: "owner",
            header: "Owner",
            cell: ({ row }) => {
                const ownerIds = row.original.owner;
                const ownerNames = Array.isArray(ownerIds) ?
                    ownerIds.map((id: string) => userIdNameMap.find((user) => user.value === id)?.label).filter((name) => name)
                    : [];

                const fullNames = ownerNames.join(", ");
                const displayNames = fullNames.length > 20 ? `${fullNames.slice(0, 20)}...` : fullNames;

                return (
                    <span title={fullNames}> {displayNames || 'N/A'} </span>
                );
            }
        },
        {
            accessorKey: "evidenceRequired",
            header: "Evidence Required",
            cell: ({ row }) => (
                <div>
                    {row.getValue("evidenceRequired") || "N/A"}
                </div>
            ),
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <div className="truncate max-w-[300px]" title={row.getValue("description")}>
                    {row.getValue("description") || "N/A"}
                </div>
            ),
        },
        {
            header: "Link Frameworks",
            cell: ({ row }) => {
                const frameworks = row.original.Frameworks;
                if (!frameworks || frameworks.length === 0) {
                    return "N/A";
                }

                return (
                  <>
                    <div className="flex flex-col gap-2 items-start">
                        {frameworks.map((framework: any) => (
                            <button
                                key={framework.frameworkId}
                                onClick={() => handleFrameworkClick(framework)}
                                className="px-1.5 py-1 text-xs text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                                title={`View details for ${framework.frameworkName}`}
                            >
                                {framework.frameworkName}
                            </button>
                        ))}
                    </div>
                  </>  
                );
            },
        },
    ];

    function openGoverningModal(row: Record<string, string> | null) {
        setOpenGoverningForm(true);
        setSelectedControl(row); // Pass the row data for editing
    }
    function openDownload() {
        setUpload(true);
    }

    const extraParams: DTExtraParamsProps = {
        pagination: true,
        actionMenu: {
            items: [
                {
                    label: "Edit",
                    onClick: (rowData) => {
                        openGoverningModal(rowData);
                    },
                },
            ],
        },
        extraTools: [
            // <IconButtonWithTooltip key="add-btn" tooltipContent="Upload Controls"
            //     onClick={() =>
            //         openDownload()
            //     }
            // >
            //     <Upload />
            // </IconButtonWithTooltip>,

            <IconButtonWithTooltip key="add-btn" tooltipContent="Add Control"
                onClick={() =>
                    openGoverningModal(null)
                }
            >
                <Plus />
            </IconButtonWithTooltip>,

            <Input
                key="search-input"
                placeholder="Search..."
                // onChange={(e) => handleSearch(e.target.value)}
                className="w-64"
            />

        ],
    };

    return (
        <>
            <DataTable data={customControlData} columns={columns} extraParams={extraParams} />
            
            {openGoverningForm && (
                <CustomControlForm 
                    open={openGoverningForm} 
                    setOpen={setOpenGoverningForm} 
                    userIdNameMap={userIdNameMap} 
                    profileData={profileData} 
                    editData={selectedControl} 
                    frameWorkData={frameWorkData} 
                    domainData={domainData}
                />
            )}

            {isFrameworkModalOpen && selectedFramework && (
                <FrameworkDetailsModal
                    open={isFrameworkModalOpen}
                    setOpen={setIsFrameworkModalOpen}
                    framework={selectedFramework}
                />
            )}

            {upload && (
                <UploadControl uploadDialogOpen={upload} setUploadDialogOpen={setUpload} profileData={profileData.USER_ID}/>
            )}
        </>
    )
}