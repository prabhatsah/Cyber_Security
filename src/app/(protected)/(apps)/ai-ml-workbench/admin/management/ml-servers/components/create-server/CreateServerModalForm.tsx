import { useForm } from "react-hook-form";
import { startNewServer } from "../start-server-instance";
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
import { useEffect, useState } from "react";
import LoadingSpinner from "../../loading";
import { useRouter } from "next/navigation";
import { MLServer } from "@/app/(protected)/(apps)/ai-ml-workbench/components/type";
import FormInput from "@/ikon/components/form-fields/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { serverSchema } from "../create-server-schema";
import { updateSelectedServer } from "../update-server-instance";

interface ServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceDetails?: MLServer | null;
}
const ServerFormModal: React.FC<ServerModalProps> = ({
  isOpen,
  onClose,
  workspaceDetails,
}) => {
  const router = useRouter();

  interface ProbeData {
    probeId: string;
    probeName: string;
  }

  interface ProbeMap {
    value: string;
    label: string;
  }

  // **Use State to Store Probe Data**
  const [probeData, setProbeMap] = useState<ProbeData[]>([]);
  const [loadingProbeData, setLoadingProbeData] = useState<boolean>(true);
  const [errorProbeData, setErrorProbeData] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProbeData = async () => {
      try {
        const data = await useProbeData();
        if (isMounted) {
          setProbeMap(
            data.map((eachProbeDetails: any) => ({
              probeId: eachProbeDetails.PROBE_ID,
              probeName: eachProbeDetails.PROBE_NAME,
            }))
          );
          setLoadingProbeData(false);
        }
      } catch (err) {
        if (isMounted) {
          setErrorProbeData("Failed to load probe data.");
          setLoadingProbeData(false);
        }
      }
    };

    fetchProbeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const probeMap: ProbeMap[] = probeData
    ? probeData.map((eachProbeDetails) => ({
        value: eachProbeDetails.probeId,
        label: eachProbeDetails.probeName,
      }))
    : [];

  const form = useForm<z.infer<typeof serverSchema>>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      workspaceName: "",
      probeName: "",
      hostName: "",
      ipAddress: "",
      probeMachineOsType: "",
    },
  });

  useEffect(() => {
    form.reset({
      workspaceName: workspaceDetails?.workspaceName || "",
      probeName: workspaceDetails?.probeId || "",
      hostName: workspaceDetails?.hostName || "",
      ipAddress: workspaceDetails?.ipAddress || "",
      probeMachineOsType: workspaceDetails?.probeMachineOsType || "",
    });
  }, [workspaceDetails]);

  const handleSubmit = async (values: Record<string, any>) => {
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Create New Server</DialogTitle>
        </DialogHeader>
        {loadingProbeData ? (
          <LoadingSpinner />
        ) : errorProbeData ? (
          <p>Error: {errorProbeData}</p>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="grid grid-cols-1 gap-3"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  formControl={form.control}
                  name="workspaceName"
                  label="Server Name"
                  placeholder="Enter Server Name"
                />

                <FormComboboxInput
                  formControl={form.control}
                  name="probeName"
                  items={probeMap}
                  label="Probe"
                  placeholder="Select Probe"
                  disabled={!!workspaceDetails}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormInput
                  formControl={form.control}
                  name="hostName"
                  label="Host Name"
                  placeholder="Enter Host Name"
                  disabled={!!workspaceDetails}
                />

                <FormInput
                  formControl={form.control}
                  name="ipAddress"
                  label="IP Address"
                  placeholder="Enter IP Address"
                  disabled={!!workspaceDetails}
                />

                <FormInput
                  formControl={form.control}
                  name="probeMachineOsType"
                  label="Operating System"
                  placeholder="Enter Operating System"
                  disabled={!!workspaceDetails}
                />
              </div>

              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServerFormModal;
