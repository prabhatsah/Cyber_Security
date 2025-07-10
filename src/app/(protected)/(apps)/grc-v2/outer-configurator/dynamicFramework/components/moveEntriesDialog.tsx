import React from 'react'
import { DynamicFieldFrameworkContext } from '../context/dynamicFieldFrameworkContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { toast } from "sonner";
export default function MoveEntriesDialog({
    isMoveDialogOpen,
    setIsMoveDialogOpen
}: {
    isMoveDialogOpen: boolean;
    setIsMoveDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const {
        selectedEntries,
        setSelectedEntries,
        parentEntries,
        frameworkStructureData,
        setFrameworkStructureData
    } = DynamicFieldFrameworkContext();

    const getAllDescendantIds = (entryIds: string[]): string[] => {
        const parentEntryIds = parentEntries.map((parentEntry) => parentEntry.value);
        const parentsDropdownEntries = frameworkStructureData.filter(entry =>
            typeof entry.id === 'string' && parentEntryIds.includes(entry.id)
        );
        const descendants = entryIds.flatMap(id => {
            const children = parentsDropdownEntries.filter(entry => entry.parentId === id);
            const childIds = children
                .map(child => child.id)
                .filter((id): id is string => typeof id === 'string');
            return [...childIds, ...getAllDescendantIds(childIds)];
        });
        return descendants;
    };

    const getValidParentEntries = () => {
        const descendantIds = getAllDescendantIds(selectedEntries);
        const invalidIds = [...selectedEntries, ...descendantIds];
        return parentEntries.filter(entry => !invalidIds.includes(entry.value));
    };

    function handleMoveEntries(parentId: string | null) {
        setFrameworkStructureData(frameworkStructureData.map(entry =>
            typeof entry.id === 'string' && selectedEntries.includes(entry.id)
                ? { ...entry, parentId: parentId ?? '' }
                : entry
        ));
        setSelectedEntries([]);
        toast.success("Entries moved successfully", { duration: 4000 });
    }
    return (
        <>
            <div >
                {
                    selectedEntries.length > 0 && (
                        <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Move Entries</DialogTitle>
                                    <DialogDescription>
                                        Select a new parent for the selected entries
                                    </DialogDescription>
                                </DialogHeader>
                                <Select
                                    onValueChange={(value) => {
                                        handleMoveEntries(value === "no-parent" ? null : value);
                                        setIsMoveDialogOpen(false);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select new parent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="no-parent">No Parent</SelectItem>
                                        {getValidParentEntries().map((entry) => (
                                            <SelectItem key={entry.value} value={entry.value}>
                                                {entry.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </DialogContent>
                        </Dialog>
                    )
                }
            </div >
        </>
    )
}
