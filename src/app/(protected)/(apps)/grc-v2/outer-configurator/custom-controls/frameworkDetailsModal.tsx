'use client'
import React, { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";

type ControlGroup = {
  isParentGroup: true;
  parentIndex: string;
  parentTitle: string;
  children: any[];
} | {
  isParentGroup: false;
  control: any;
};

export default function FrameworkDetailsModal({ open, setOpen, framework }: { open: boolean; setOpen: (open: boolean) => void; framework: Record<string, any> | null }) {

  const groupedControls = useMemo(() => {
    if (!framework?.controls) return [];

    const controls = framework.controls;
    const groups: Record<string, any[]> = {};
    const rootControls: any[] = [];

    // Separate controls into groups based on their parentId
    controls.forEach((control: any) => {
      if (control.parentId) {
        if (!groups[control.parentId]) {
          groups[control.parentId] = [];
        }
        groups[control.parentId].push(control);
      } else {
        // This is a root control with no parent
        rootControls.push(control);
      }
    });

    const finalStructure: ControlGroup[] = [];

    // Process the parent-based groups
    Object.values(groups).forEach(children => {
      // Sort children by their index to ensure correct order
      children.sort((a, b) => a.actualIndex.localeCompare(b.actualIndex, undefined, { numeric: true }));

      // All children in a group have the same parent info, so we can take it from the first child
      const firstChild = children[0];
      finalStructure.push({
        isParentGroup: true,
        parentIndex: firstChild.parentIndex,
        parentTitle: firstChild.parentTitle,
        children: children,
      });
    });

    // Process the standalone root controls
    rootControls.forEach(control => {
      finalStructure.push({
        isParentGroup: false,
        control: control,
      });
    });
    
    // Sort the final structure by the primary index (parentIndex or actualIndex)
    finalStructure.sort((a, b) => {
        const indexA = a.isParentGroup ? a.parentIndex : a.control.actualIndex;
        const indexB = b.isParentGroup ? b.parentIndex : b.control.actualIndex;
        return indexA.localeCompare(indexB, undefined, { numeric: true });
    });

    return finalStructure;

  }, [framework]);

  if (!framework) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Details of {framework.frameworkName}</DialogTitle>
        </DialogHeader>

        <div className="flex-grow py-1 pr-2 -mr-4 overflow-y-auto">
            <div className="space-y-6">
                {groupedControls.map((group, index) => (
                    <div key={index}>
                        {/* Add a separator line between major groups */}
                        {index > 0 && <hr className="my-5 border border-[#3c3c3e]" />}
                        
                        {group.isParentGroup ? (
                            // Render a PARENT group with its children
                            <div className="space-y-4">
                                <div className="flex items-baseline">
                                    <span className="text-lg font-bold">{group.parentIndex} -</span>
                                    <h3 className="ml-2 text-lg font-semibold">{group.parentTitle}</h3>
                                </div>
                                <div className="pl-8 space-y-4">
                                    {group.children.map(child => (
                                        <div key={child.id}>
                                            <div className="flex items-baseline">
                                                <span className="font-semibold ">{child.actualIndex} -</span>
                                                <h4 className="ml-2 font-medium ">{child.actualTitle}</h4>
                                            </div>
                                            <p className="mt-1 ml-4 text-sm max-w-prose">
                                                {child.actualDescription}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Render a single ROOT control
                            <div className="space-y-1">
                                <div className="flex items-baseline">
                                    <span className="text-lg font-bold ">{group.control.actualIndex} -</span>
                                    <h3 className="ml-2 text-lg font-semibold">{group.control.actualTitle}</h3>
                                </div>
                                <p className="mt-1 ml-4 text-sm max-w-prose">
                                    {group.control.actualDescription}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}