"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Edit } from "lucide-react";
import { useState } from "react";
import EditFrameworkEntryForm from "./edit-form-responsibility-matrix";

type FrameworkEntry = {
    id: string;
    index: string;
    title: string;
    description: string;
    parentId: string | null;
    treatAsParent: boolean;
    testingProcedure?: string;
    mondayDocV2?: string;
    entityResponsible?: string;
    awsRequirementApplicabilityNotes?: string;
    reviewDate?: string;
    digitalDcRequirementNotes?: string;
};

type ParentEntry = FrameworkEntry & {
    childrenArray: string[];
};


export default function ResponsibilityMatrixTable({
    open,
    setOpen,
    entries,
    frameworkId,
    profileData
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    entries: FrameworkEntry[];
    profileData: any;
    frameworkId: string;
}) {
    const [editEntry, setEditEntry] = useState<FrameworkEntry | null>(null);

    const getEntryLevel = (entry: FrameworkEntry) => {
        let level = 0;
        let current = entry;
        while (current.parentId) {
            const parent = entries.find(e => e.id === current.parentId);
            if (parent) {
                level++;
                current = parent;
            } else {
                break;
            }
        }
        return level;
    };

    const getVisibleEntries = () => {
        const result: FrameworkEntry[] = [];
        const addEntry = (entry: FrameworkEntry) => {
            result.push(entry);
            entries
                .filter(e => e.parentId === entry.id)
                .forEach(child => addEntry(child));
        };
        entries
            .filter(entry => !entry.parentId)
            .forEach(entry => addEntry(entry));
        return result;
    };

    const visibleEntries = getVisibleEntries();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="!max-w-none !w-screen !h-screen overflow-y-auto p-4 flex flex-col">
                <DialogHeader>
                    <DialogTitle>Responsibility Matrix Table</DialogTitle>
                </DialogHeader>
                <div>
                    
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-md h-[800]">
                        <Table className="table-fixed w-full h-full overflow-y-auto">
                            <TableHeader className="bg-gray-100 dark:bg-gray-800">
                                <TableRow className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                    <TableHead className="w-[8%] text-left text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 whitespace-nowrap">Index</TableHead>
                                    <TableHead className="w-[12%] text-left text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 whitespace-nowrap">Title</TableHead>
                                    <TableHead className="w-[15%] text-left text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 whitespace-nowrap">Description</TableHead>
                                    <TableHead className="w-[10%] text-left text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 whitespace-nowrap">Testing Procedure</TableHead>
                                    <TableHead className="w-[10%] text-left text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 whitespace-nowrap">Entity Responsible</TableHead>
                                    <TableHead className="w-[12%] text-left text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 whitespace-nowrap">AWS Requirement Notes</TableHead>
                                    <TableHead className="w-[8%] text-left text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 whitespace-nowrap">Review Date</TableHead>
                                    <TableHead className="w-[10%] text-left text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 whitespace-nowrap">Digital DC Notes</TableHead>
                                    <TableHead className="w-[5%] text-center text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 whitespace-nowrap">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[calc(80vh-150px)] overflow-y-auto">
                                {visibleEntries.map((entry) => {
                                    const level = getEntryLevel(entry);
                                    return (
                                        <TableRow key={entry.id} className="group transition-colors duration-200 ease-in-out">
                                            <TableCell className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200">
                                                <span style={{ paddingLeft: `${level * 16}px` }} />
                                                {entry.index}
                                            </TableCell>
                                            <TableCell className="py-2 px-4 font-medium text-sm text-gray-900 dark:text-gray-100 truncate" title={entry.title}>
                                                <span style={{ paddingLeft: `${level * 16}px` }} />
                                                {entry.title}
                                            </TableCell>
                                            <TableCell className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200 truncate" title={entry.description}>
                                                <span style={{ paddingLeft: `${level * 16}px` }} />
                                                {entry.description}
                                            </TableCell>
                                            <TableCell className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200 truncate" title={entry.testingProcedure}>
                                                {entry.testingProcedure || ""}
                                            </TableCell>
                                            <TableCell className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200 truncate" title={entry.entityResponsible}>
                                                {entry.entityResponsible || ""}
                                            </TableCell>
                                            <TableCell className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200 truncate" title={entry.awsRequirementApplicabilityNotes}>
                                                {entry.awsRequirementApplicabilityNotes || ""}
                                            </TableCell>
                                            <TableCell className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200 truncate" title={entry.reviewDate}>
                                                {entry.reviewDate || ""}
                                            </TableCell>
                                            <TableCell className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200 truncate" title={entry.digitalDcRequirementNotes}>
                                                {entry.digitalDcRequirementNotes || ""}
                                            </TableCell>
                                            <TableCell className="py-2 px-4 text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setEditEntry(entry)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out p-1 md:p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                                >
                                                    <Edit className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    {editEntry && (
                        <EditFrameworkEntryForm
                            open={!!editEntry}
                            setOpen={(isOpen) => !isOpen && setEditEntry(null)}
                            entry={editEntry}
                            entryId={editEntry.id}
                            entries={entries}
                            frameworkId={frameworkId}
                            profileData={profileData}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}