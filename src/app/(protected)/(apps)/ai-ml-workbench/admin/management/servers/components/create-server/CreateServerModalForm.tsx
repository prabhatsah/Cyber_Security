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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Button } from "@/shadcn/ui/button";

interface ServerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ServerFormModal: React.FC<ServerModalProps> = ({ isOpen, onClose }) => {
  const { probeData, loadingProbeData, errorProbeData } = useProbeData();

  interface ProbeMap {
    probeId: string;
    probeName: string;
  }

  // Ensure hooks remain in the same order on every render
  const probeMap: ProbeMap[] = probeData
    ? probeData.map((eachProbeDetails) => ({
        probeId: eachProbeDetails.PROBE_ID,
        probeName: eachProbeDetails.PROBE_NAME,
      }))
    : [];

  const form = useForm({
    defaultValues: {
      workspaceName: "",
      probeName: "",
      hostName: "",
      ipAddress: "",
      probeMachineOsType: "",
    },
  });

  const handleSubmit = async (values: Record<string, any>) => {
    const profileData = await getProfileData();

    const selectedProbeId = values.probeName;
    let selectedProbeName =
      probeMap.find((eachProbe) => eachProbe.probeId === selectedProbeId)
        ?.probeName || "";

    const newServer = {
      workspaceId: new Date().getTime().toString(),
      workspaceName: values.workspaceName,
      status: "Not Ready",
      probeId: selectedProbeId,
      probeName: selectedProbeName,
      probeMachineOsType: values.probeMachineOsType,
      hostName: values.hostName,
      ipAddress: values.ipAddress,
      createdOn: new Date(),
      createdBy: profileData?.USER_ID,
    };

    try {
      await startNewServer(newServer);
      onClose();
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
          <p>Loading...</p>
        ) : errorProbeData ? (
          <p>Error: {errorProbeData}</p>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="grid grid-cols-1 gap-3"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="workspaceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Server Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter Server Name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="probeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Probe</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Probe" />
                          </SelectTrigger>
                          <SelectContent>
                            {probeMap.map((option: any) => (
                              <SelectItem
                                key={option.probeId}
                                value={option.probeId}
                              >
                                {option.probeName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="hostName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Host Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter Host Name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ipAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fax</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter IP Address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="probeMachineOsType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operating System</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter Operating System"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
