import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-center py-3">
    <p className="w-full sm:w-1/4 text-sm font-medium text-muted-foreground">{label}</p>
    <div className="mt-1 sm:mt-0 w-full sm:w-3/4 text-base text-foreground">
      {value || "N/A"}
    </div>
  </div>
);

export default function ViewControlDetails({ open, setOpen, userIdNameMap, controlData }: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userIdNameMap: { value: string; label: string }[];
  controlData: Record<string, any> | null;
}) {
  if (!controlData) {
    return null;
  }

  const getOwnerNames = () => {
    const ownerIds = controlData.owner;
    if (Array.isArray(ownerIds) && ownerIds.length > 0) {
      return ownerIds
        .map((id: string) => userIdNameMap.find((user) => user.value === id)?.label)
        .filter(Boolean)
        .join(", ");
    }
    return "N/A";
  };

  const ownerNames = getOwnerNames();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl p-0" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="shrink-0 px-6 pt-6">
          <DialogTitle className="text-xl font-semibold">Control Details</DialogTitle>
          <DialogDescription>
            General information for control reference{" "}
            <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
              {controlData.refId || 'N/A'}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-2 max-h-[60vh] overflow-y-auto">
          <dl className="divide-y divide-border">
            <DetailItem label="Reference ID" value={controlData.refId} />
            <DetailItem label="Title" value={controlData.title} />
            <DetailItem label="Domain" value={controlData.domain} />
            <DetailItem label="Owner(s)" value={ownerNames} />
            
            <div className="py-3">
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <div className="mt-2 text-base text-foreground prose prose-sm prose-neutral max-w-none whitespace-pre-wrap">
                  {controlData.description || 'N/A'}
                </div>
            </div>
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
}