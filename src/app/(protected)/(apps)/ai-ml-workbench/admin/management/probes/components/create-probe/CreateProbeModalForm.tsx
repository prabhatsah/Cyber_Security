import { useForm } from "react-hook-form";
import { useProbeData } from "../../../../components/data-collection";
import { getProfileData } from "@/ikon/utils/actions/auth";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Form } from "@/shadcn/ui/form";
import { Button } from "@/shadcn/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProbeData } from "@/app/(protected)/(apps)/ai-ml-workbench/components/type";
import FormInput from "@/ikon/components/form-fields/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { probeSchema } from "../create-probe-schema";
import { Alert, AlertDescription, AlertTitle } from "@/shadcn/ui/alert";
import { CircleHelp, Download, Info } from "lucide-react";
import { Tooltip } from "@/ikon/components/tooltip";
import { downloadFile } from "@/app/(protected)/(apps)/ai-workforce/utils/download";

interface ProbeModalProps {
  isOpen: boolean;
  onClose: () => void;
  probeDetails?: ProbeData | null;
}
const ProbeFormModal: React.FC<ProbeModalProps> = ({
  isOpen,
  onClose,
  probeDetails,
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof probeSchema>>({
    resolver: zodResolver(probeSchema),
    defaultValues: {
      probeName: "",
    },
  });

  useEffect(() => {
    form.reset({
      probeName: probeDetails?.PROBE_ID || "",
    });
  }, [probeDetails]);

  /*const handleSubmit = async (values: Record<string, any>) => {
    const profileData = await getProfileData();

    const selectedProbeId = values.probeName;
    let selectedProbeName =
      probeMap.find((eachProbe) => eachProbe.value === selectedProbeId)
        ?.label || "";

    let newServer: MLServer | undefined = {
      workspaceId: new Date().getTime().toString(),
      workspaceName: values.workspaceName,
      status: "Not Ready",
      probeId: selectedProbeId,
      probeName: selectedProbeName,
      probeMachineOsType: values.probeMachineOsType,
      hostName: values.hostName,
      ipAddress: values.ipAddress,
      createdOn: new Date().toISOString(),
      createdBy: profileData?.USER_ID,
    };

    if (workspaceDetails) {
      workspaceDetails.workspaceName = values.workspaceName;
    }

    try {
      workspaceDetails
        ? await updateSelectedServer(
            workspaceDetails.workspaceId,
            workspaceDetails.workspaceName
          )
        : await startNewServer(newServer);
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Error starting the process:", error);
    }
  };*/

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Probe Setup</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            // onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-3"
          >
            <div className="grid gap-4">
              <Alert>
                <Info className="h-5 w-5" />
                <AlertDescription>
                  Make sure you have installed the probe and set it up on the
                  target machine.
                </AlertDescription>
              </Alert>
            </div>

            <div className="grid gap-4">
              <FormInput
                formControl={form.control}
                name="probeName"
                label="Probe Name"
                placeholder="Enter Probe Name"
              />
            </div>

            <DialogFooter>
              <Tooltip tooltipContent="Download the probe documentation file(.pdf)">
                <Button>
                  <CircleHelp />
                </Button>
              </Tooltip>
              <Tooltip tooltipContent="Download the probe installer(.exe)">
                <Button>
                  <Download />
                </Button>
              </Tooltip>
              <Tooltip tooltipContent="Submit">
                <Button type="submit">Submit</Button>
              </Tooltip>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProbeFormModal;
