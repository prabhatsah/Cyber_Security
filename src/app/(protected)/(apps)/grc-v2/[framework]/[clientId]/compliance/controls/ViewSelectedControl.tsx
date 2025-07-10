import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shadcn/ui/dialog";
import { Separator } from "@/shadcn/ui/separator";

export default function ViewControlDetails({ open, setOpen, controlsData, clickedIndex }: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  controlsData: Record<string, any>[] | null;
  clickedIndex: string | null;
}) {
  if (!controlsData || controlsData.length === 0) {
    return null;
  }

  const groupedControls = controlsData.reduce((acc, control) => {
    const key = control.parentId || `standalone-${control.id}`;

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(control);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl p-0 gap-0" onInteractOutside={(e) => e.preventDefault()} >
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">Control Details</DialogTitle>
          <DialogDescription>
            Viewing all controls associated with index - {" "}
            <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
              {clickedIndex}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {Object.values(groupedControls).map((controlGroup, groupIndex) => {
            const firstControl = controlGroup[0];
            const hasParent = !!firstControl.parentId;

            return (
              <div key={firstControl.parentId || firstControl.id}>
                {groupIndex > 0 && <Separator className="my-6" />}

                {hasParent && (
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {firstControl.parentIndex} - {firstControl.parentTitle}
                    </h3>
                  </div>
                )}

                {/* 2. Render the Child Controls */}
                <div className={`space-y-4 ${hasParent ? "ml-4 md:ml-6" : ""}`}>
                  {controlGroup.map((control: any) => (
                    <div key={control.id}>
                      <h4 className="font-semibold text-foreground">
                        {control.actualIndex} – {control.actualTitle}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {control.actualDescription}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}