"use client";

import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { Badge } from "@/shadcn/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shadcn/ui/accordion";
import {
  Trash2,
  Search,
  Timer,
  TvMinimal,
  Save,
  RotateCcw,
  MoveRight,
} from "lucide-react";
import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import {
  BasicCredentialType,
  CommandDataType,
  CommandIdWiseDetailsType,
  CommandIdWiseSchedule,
  CommandScheduleType,
  DeviceConfigDataType,
  DeviceIdWiseDetailsType,
  ParameterCredentialType,
  UserCommandConfigType,
} from "../../../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import ComboboxInput from "@/ikon/components/combobox-input";
import { Tooltip } from "@/ikon/components/tooltip";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import CustomAlertDialog from "@/ikon/components/alert-dialog";
import CommandConfigSchedule from "./CommandScheduleConfig";
import { getProfileData } from "@/ikon/utils/actions/auth";
import SubCommandDeviceSelection from "./SubCommandDeviceSelection";

interface CommandModalProps {
  open: boolean;
  close: (open: boolean) => void;
  deviceConfigData: DeviceConfigDataType[];
  commandsData: CommandDataType[];
  associatedNodeId: undefined | string;
  customCommandsData: UserCommandConfigType[];
  commandIdWiseDetails: CommandIdWiseDetailsType;
  deviceIdWiseDetails: DeviceIdWiseDetailsType;
}

interface Command {
  id: string;
  name: string;
  protocol: string;
  tokenRequired: boolean;
  hasSubCommands: boolean;
}

interface Device {
  hostIp: string;
  hostName: string;
  deviceId: string;
}

interface SavedCommand {
  id: string;
  name: string;
  devices: string[];
  protocol: string;
  hasSubCommands?: boolean;
}

type ComboboxType = {
  label: string;
  value: string;
};

type SelectedDevicesType = {
  hostIp: string;
  deviceId: string;
};

const isCommandScheduled: Record<string, boolean> = {};

const fetchCommandConfigData = async function (
  associatedNodeId: string | undefined
) {
  const onSuccess = (data: unknown) => {
    console.log(data);

    return data;
  };

  const onFailure = (err: unknown) => {
    console.error(err);

    return [];
  };

  try {
    const data = await getMyInstancesV2({
      processName: "Service Catalogue View per User",
      predefinedFilters: {
        taskName: "Edit Activity",
      },
      processVariableFilters: {
        associatedTabId: associatedNodeId,
      },
    });

    return onSuccess(data);
  } catch (err: unknown) {
    return onFailure(err);
  }
};

const onSubmit = async function (
  savedCommands: SavedCommand[],
  selectedDevicseData: SelectedDevicesType[],
  selectedCommandIds: string[],
  selectedDeviceIds: string[],
  savedScheduledInfo: RefObject<{ [key: string]: CommandScheduleType } | null>,
  setSaveConfirmation: Dispatch<SetStateAction<boolean>>,
  close: (open: boolean) => void,
  associatedNodeId: string | undefined
) {
  console.log("Inside onSubmit---");

  const profiledata = await getProfileData();

  const associatedUserId = profiledata.USER_ID;
  const associatedUserLogin = profiledata.USER_LOGIN;
  const associatedTabId = "4";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const configuredItemListForTab: any = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const commandIdWiseSchedule: any = savedScheduledInfo
    ? savedScheduledInfo.current
    : {};

  savedCommands.forEach((command) => {
    configuredItemListForTab.push({
      commandProtocol: command.protocol,
      commandName: command.name,
      commandId: command.id,
      selectedHostIps: selectedDevicseData,
      deviceIds: selectedDeviceIds,
      deviceCount: selectedDeviceIds.length,
      commandIds: selectedCommandIds,
      commandCount: selectedCommandIds.length,
    });
  });

  const formdata = {
    associatedUserId: associatedUserId,
    associatedUserLogin: associatedUserLogin,
    associatedTabId: associatedTabId,
    configuredItemListForTab: configuredItemListForTab,
    commandIdWiseSchedule: commandIdWiseSchedule,
  };

  try {
    console.log("onSubmit formdata: ", formdata);

    setSaveConfirmation(false);

    close(false);

    if (associatedNodeId == "undefined") {
      const processId = await mapProcessName({
        processName: "Service Catalogue View per User",
      });

      if (processId)
        await startProcessV2({
          processId: processId,
          data: formdata,
          processIdentifierFields:
            "associatedUserId,associatedTabId,associatedUserLogin,clientId",
        });
    } else {
      const prevData = await getMyInstancesV2({
        processName: "Service Catalogue View per User",
        predefinedFilters: {
          taskName: "Edit Activity",
        },
        processVariableFilters: {
          associatedTabId: associatedNodeId,
        },
      });

      if (prevData.length)
        await invokeAction({
          taskId: prevData[0].taskId,
          transitionName: "Update Edit Activity",
          processInstanceIdentifierField:
            "associatedUserId,associatedTabId,associatedUserLogin,clientId",
          data: formdata,
        });
    }

    window.location.reload();
  } catch (err) {
    console.error(err);
  }
};

export default function CommandConfigure({
  open,
  close,
  commandIdWiseDetails,
  deviceIdWiseDetails,
  deviceConfigData,
  commandsData,
  associatedNodeId,
  customCommandsData,
}: CommandModalProps) {
  const [selectedCommand, setSelectedCommand] = useState<{
    id: string;
    protocol: string;
    tokenRequired: boolean;
  } | null>(null);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [savedCommands, setSavedCommands] = useState<SavedCommand[]>([]);
  const [commandSearch, setCommandSearch] = useState("");
  const [deviceSearch, setDeviceSearch] = useState("");

  const [showDeviceSelection, setShowDeviceSelection] = useState(false);

  const [saveConfirmation, setSaveConfirmation] = useState<boolean>(false);

  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
  const [selectedCommandIds, setSelectedCommandIds] = useState<string[]>([]);

  const [commandScheduleVisible, setCommandScheduleVisible] =
    useState<boolean>(false);

  //const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);

  const [deviceCredentialData_ssh, setDeviceCredentailData_ssh] =
    useState<BasicCredentialType[]>();
  const [deviceCredentialData_windows, setDeviceCredentailData_windows] =
    useState<BasicCredentialType[]>();
  const [parameterCredentialData, setParameterCredentailData] =
    useState<ParameterCredentialType[]>();

  const [deviceCredentialData, setDeviceCredentialData] = useState<
    ComboboxType[]
  >([]);
  const [apiCredentialData, setApiCredentialData] = useState<ComboboxType[]>(
    []
  );

  const [selectedDevicseData, setSelectedDevicesData] = useState<
    SelectedDevicesType[]
  >([]);

  //const [isCommandScheduled, setIsCommandScheduled] = useState<boolean>(false);

  //const isCommandScheduled = useRef(false);

  //const commandIdWiseInfo = useRef<CommandIdWiseInfoType>({});

  const selectedCommandForScheduling = useRef<string>(null);

  const deviceOfSelectedCommand = useRef<{ [key: string]: string[] }>({});

  const existingCommandSchedulingData = useRef<CommandIdWiseSchedule>(null);

  const savedScheduledInfo = useRef<{ [key: string]: CommandScheduleType }>(
    null
  );

  const initialManualCommands: Command[] = [];
  const initialAICommands: Command[] = [];
  const initialDevices: Device[] = [];

  const saveConfirmationMsg = `Would you like to update the device selection for the selected commands ? As this will start the scheduling(if applicable) on the selected devices only for the selected commands. 
                               Existing Scheduling for the devices will be cancelled for the selected commands. Are you sure, you want to continue ?`;

  commandsData.forEach((command) => {
    if (command.isVerified) {
      if (command.source == "Manual") {
        initialManualCommands.push({
          id: command.commandId,
          name: command.commandName,
          protocol: command.commandProtocol,
          tokenRequired: command.tokensNecessary,
          hasSubCommands:
            typeof command.script == "object" &&
            command.script.commands.length > 1
              ? true
              : false,
        });
      } else {
        initialAICommands.push({
          id: command.commandId,
          name: command.commandName,
          protocol: command.commandProtocol,
          tokenRequired: command.tokensNecessary,
          hasSubCommands:
            typeof command.script == "object" &&
            command.script.commands.length > 1
              ? true
              : false,
        });
      }
    }
  });

  deviceConfigData.forEach((device) => {
    if (device.dryRunAccessable && device.dryRunAccessable == "Yes") {
      initialDevices.push({
        hostIp: device.hostIp,
        hostName: device.hostName,
        deviceId: device.deviceId,
      });
    }
  });

  const filteredManualCommands = initialManualCommands.filter((cmd) =>
    cmd.name.toLowerCase().includes(commandSearch.toLowerCase())
  );

  const filteredAICommands = initialAICommands.filter((cmd) =>
    cmd.name.toLowerCase().includes(commandSearch.toLowerCase())
  );

  const filteredDevices = initialDevices.filter(
    (device) =>
      device.hostIp.includes(deviceSearch) ||
      device.hostName.toLowerCase().includes(deviceSearch.toLowerCase())
  );

  const handleCommandSelect = (
    commandId: string,
    protocol: string,
    tokenRequired: boolean
  ) => {
    debugger;
    const commandObj = {
      id: commandId,
      protocol: protocol,
      tokenRequired: tokenRequired,
    };

    setSelectedCommand(
      selectedCommand && selectedCommand.id === commandId ? null : commandObj
    );

    //console.log('selected command id: ', selectedCommand ? selectedCommand.id : 'no command selected');

    //setSelectedProtocol(selectedCommand === commandId ? null : protocol);
    setSelectedDevices([]);

    setSelectedCommandIds((prev) => [...prev, commandId]);
  };

  const handleDeviceSelect = (
    deviceIp: string,
    deviceId: string,
    selectedProtocol: string | null
  ) => {
    setSelectedDevices((prev) => {
      if (prev.includes(deviceIp)) {
        return prev.filter((ip) => ip !== deviceIp);
      }
      return [...prev, deviceIp];
    });

    setSelectedDevicesData((prev) => [
      ...prev,
      {
        hostIp: deviceIp,
        deviceId: deviceId,
      },
    ]);

    setSelectedDeviceIds((prev) => [...prev, deviceId]);

    fetchCredentialData(
      selectedCommand ? selectedCommand.id : null,
      selectedProtocol
    );
  };

  const handleReset = () => {
    setSelectedCommand(null);
    setSelectedDevices([]);
  };

  const handleUpdate = () => {
    if (selectedCommand && selectedDevices.length > 0) {
      const command = initialManualCommands.find(
        (cmd) => cmd.id === selectedCommand.id
      );

      if (command) {
        setSavedCommands((prev) => {
          const existingData = prev.filter((obj) => obj.id == command.id)[0];

          if (existingData) {
            const mergedDevices = Array.from(
              new Set([...existingData.devices, ...selectedDevices])
            );
            return prev.map((obj) =>
              obj.id === command.id ? { ...obj, devices: mergedDevices } : obj
            );
          } else {
            return [
              ...prev,
              {
                id: command.id,
                name: command.name,
                devices: selectedDevices,
                protocol: command.protocol,
                hasSubCommands: command.hasSubCommands,
              },
            ];
          }
        });

        // commandIdWiseInfo.current[command.id] = {
        //   commandId: command.id,
        //   deviceList: selectedDevicseData
        // }
      } else {
        const command = initialAICommands.find(
          (cmd) => cmd.id === selectedCommand.id
        );

        if (command) {
          setSavedCommands((prev) => [
            ...prev,
            {
              id: command.id,
              name: command.name,
              devices: selectedDevices,
              protocol: command.protocol,
              hasSubCommands: command.hasSubCommands,
            },
          ]);
        }
      }
      handleReset();
    }
  };

  const handleDeleteAccordion = (id: string) => {
    setSavedCommands((prev) => prev.filter((cmd) => cmd.id !== id));
  };

  const handleDeleteDevice = (commandId: string, deviceIp: string) => {
    setSavedCommands((prev) =>
      prev.map((cmd) => {
        if (cmd.id === commandId) {
          return {
            ...cmd,
            devices: cmd.devices.filter((ip) => ip !== deviceIp),
          };
        }
        return cmd;
      })
    );
  };

  const fetchCredentialData = async (
    selectedCommandId: string | null,
    selectedProtocol: string | null
  ) => {
    if (!selectedCommandId) {
      return;
    }

    try {
      if (selectedProtocol == "Wmi") {
        if (deviceCredentialData_windows == undefined) {
          const credentialData = await getMyInstancesV2<BasicCredentialType>({
            processName: "Windows Credential Directory",
            predefinedFilters: {
              taskName: "View credential",
            },
          });

          console.log("credentialData: ", credentialData);

          const deviceCredDrpdData: ComboboxType[] = [];

          const innerData = credentialData.map((obj) => {
            deviceCredDrpdData.push({
              label: obj.data.credentialName,
              value: obj.data.credentialId,
            });

            return obj.data;
          });

          setDeviceCredentailData_windows(innerData);

          setDeviceCredentialData(deviceCredDrpdData);
        } else {
          const deviceCredDrpdData: ComboboxType[] = [];

          deviceCredentialData_windows.forEach((obj) => {
            deviceCredDrpdData.push({
              label: obj.credentialName,
              value: obj.credentialId,
            });
          });

          setDeviceCredentialData(deviceCredDrpdData);
        }
      } else if (selectedProtocol == "Ssh") {
        if (deviceCredentialData_ssh == undefined) {
          const credentialData = await getMyInstancesV2<BasicCredentialType>({
            processName: "SSH Credential Directory",
            predefinedFilters: {
              taskName: "View credential",
            },
          });

          console.log("credentialData: ", credentialData);

          const deviceCredDrpdData: ComboboxType[] = [];

          const innerData = credentialData.map((obj) => {
            deviceCredDrpdData.push({
              label: obj.data.credentialName,
              value: obj.data.credentialId,
            });

            return obj.data;
          });

          setDeviceCredentailData_ssh(innerData);

          setDeviceCredentialData(deviceCredDrpdData);
        } else {
          const deviceCredDrpdData: ComboboxType[] = [];

          deviceCredentialData_ssh.forEach((obj) => {
            deviceCredDrpdData.push({
              label: obj.credentialName,
              value: obj.credentialId,
            });
          });

          setDeviceCredentialData(deviceCredDrpdData);
        }
      }

      if (parameterCredentialData == undefined) {
        const apiData = await getMyInstancesV2<ParameterCredentialType>({
          processName: "Parameter Credential Directory",
          predefinedFilters: {
            taskName: "View credential",
          },
          mongoWhereClause: `this.Data.associatedMetrics.find(e=> e == '${selectedCommandId}')`,
        });

        console.log("apiData: ", apiData);

        const apiCredDrpdData: ComboboxType[] = [];

        const innerData2 = apiData.map((obj) => {
          apiCredDrpdData.push({
            label: obj.data.credentialName,
            value: obj.data.credentialId,
          });

          return obj.data;
        });

        setParameterCredentailData(innerData2);

        setApiCredentialData(apiCredDrpdData);
      } else {
        const apiCredDrpdData: ComboboxType[] = [];

        parameterCredentialData.forEach((obj) => {
          apiCredDrpdData.push({
            label: obj.credentialName,
            value: obj.credentialId,
          });
        });

        setApiCredentialData(apiCredDrpdData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    const data = await fetchCommandConfigData(undefined);

    console.log("data: ", data);
  };

  useEffect(() => {
    fetchData();

    const data = customCommandsData.filter(
      (command) => command.associatedTabId == associatedNodeId
    );
    console.log("filtered data: ", data);

    if (data[0]) {
      const existingData: SavedCommand[] = [];

      data[0].configuredItemListForTab.forEach((obj) => {
        isCommandScheduled[obj.commandId] = false;
        existingData.push({
          id: obj.commandId,
          name: obj.commandName,
          protocol: obj.commandProtocol,
          devices: obj.selectedHostIps.map((device) => device.hostIp),
        });
      });

      if (Object.values(data[0].commandIdWiseSchedule).length > 0) {
        existingCommandSchedulingData.current = data[0].commandIdWiseSchedule;

        Object.keys(data[0].commandIdWiseSchedule).forEach(
          (commandId) => (isCommandScheduled[commandId] = true)
        );
      }

      setSavedCommands((prev) => {
        const prevIds = new Set(prev.map((cmd) => cmd.id));
        const newItems = existingData.filter((cmd) => !prevIds.has(cmd.id));

        return [...prev, ...newItems];
      });
    }
  }, [customCommandsData, associatedNodeId]);

  return (
    <>
      <Dialog open={open} onOpenChange={close}>
        <DialogContent className="max-w-[80vw] bg-background">
          <DialogHeader>
            <DialogTitle>Configure Your Commands</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-12 gap-6">
            {/* List of Commands Section */}
            <div className="col-span-4 space-y-4 bg-card rounded-lg p-4 shadow-lg border border-border">
              <div className="font-medium">List of Commands</div>
              <Tabs defaultValue="manual">
                <TabsList className="w-full">
                  <TabsTrigger value="manual" className="flex-1">
                    Manual
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="flex-1">
                    AI Generated
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="manual" className="mt-4">
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Search..."
                      value={commandSearch}
                      onChange={(e) => setCommandSearch(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Command</TableHead>
                          <TableHead>Protocol</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filteredManualCommands.map((command) => (
                          <TableRow key={command.id}>
                            <TableCell>
                              <Checkbox
                                className="me-2"
                                checked={
                                  selectedCommand
                                    ? selectedCommand.id === command.id
                                    : false
                                }
                                onCheckedChange={() =>
                                  handleCommandSelect(
                                    command.id,
                                    command.protocol,
                                    command.tokenRequired
                                  )
                                }
                              />
                              <span className="font-medium">
                                {command.name}
                              </span>
                            </TableCell>

                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {command.protocol}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="ai" className="mt-4">
                  <div className="flex gap-2 mb-4">
                    <Input placeholder="Search..." className="flex-1" />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="h-[300px]">
                    {filteredAICommands.map((command) => (
                      <div
                        key={command.id}
                        className="flex items-center space-x-4 p-2"
                      >
                        <Checkbox
                          checked={
                            selectedCommand
                              ? selectedCommand.id === command.id
                              : false
                          }
                          onCheckedChange={() =>
                            handleCommandSelect(
                              command.id,
                              command.protocol,
                              command.tokenRequired
                            )
                          }
                        />
                        <div className="flex-1">
                          <div className="font-medium">{command.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {command.protocol}
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>

            {/* List of Devices Section */}
            <div className="col-span-5 bg-card rounded-lg p-4 shadow-lg border border-border">
              <div className="flex flex-col h-full">
                <div className="font-medium mb-4">List of Devices</div>
                <Input
                  placeholder="Search..."
                  value={deviceSearch}
                  onChange={(e) => setDeviceSearch(e.target.value)}
                  className="mb-4"
                />

                <div className="flex-grow">
                  {!selectedCommand ? (
                    <div className="flex items-center justify-center h-[200px] border rounded-md text-muted-foreground mb-2">
                      Please select a command
                    </div>
                  ) : (
                    <ScrollArea className="h-[200px] border rounded-md p-2 mb-2">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-left p-2"></th>
                            <th className="text-left p-2">Host IP</th>
                            <th className="text-left p-2">Host Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDevices.map((device) => (
                            <tr key={device.hostIp}>
                              <td className="p-2">
                                <Checkbox
                                  checked={selectedDevices.includes(
                                    device.hostIp
                                  )}
                                  onCheckedChange={() =>
                                    handleDeviceSelect(
                                      device.hostIp,
                                      device.deviceId,
                                      selectedCommand.protocol
                                    )
                                  }
                                />
                              </td>
                              <td className="p-2">{device.hostIp}</td>
                              <td className="p-2">{device.hostName}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  )}

                  {!selectedDevices.length ||
                  !selectedCommand?.tokenRequired ? (
                    <div className="flex items-center justify-center h-[200px] border rounded-md text-muted-foreground mb-2">
                      Please select atleast one device
                    </div>
                  ) : (
                    <ScrollArea className="h-[200px] border rounded-md p-2">
                      {selectedDevices.length > 0 && (
                        <div className="space-y-4 mt-4">
                          <Input placeholder="Search..." />
                          <div className="border rounded-md p-4">
                            {selectedDevices.map((deviceIp) => (
                              <div
                                key={deviceIp}
                                className="grid grid-cols-2 gap-4 mb-4"
                              >
                                <div className="self-center">{deviceIp}</div>
                                <div className="grid grid-cols-2 gap-2">
                                  <ComboboxInput
                                    items={deviceCredentialData}
                                  ></ComboboxInput>
                                  <ComboboxInput
                                    items={apiCredentialData}
                                  ></ComboboxInput>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                  <IconTextButtonWithTooltip
                    type="button"
                    tooltipContent="Reset selections"
                    variant="outline"
                    onClick={handleReset}
                  >
                    <RotateCcw /> Reset
                  </IconTextButtonWithTooltip>
                  <IconTextButtonWithTooltip
                    type="button"
                    tooltipContent="Confirm selection"
                    onClick={handleUpdate}
                  >
                    <MoveRight /> Update
                  </IconTextButtonWithTooltip>
                </div>
              </div>
            </div>

            {/* Saved Commands Section */}
            <div className="col-span-3 bg-card rounded-lg p-4 shadow-lg border border-border">
              <ScrollArea className="h-[550px]">
                <Accordion type="single" collapsible className="space-y-2">
                  {savedCommands.map((command) => (
                    <AccordionItem
                      key={command.id}
                      value={command.id}
                      className="border rounded-md"
                    >
                      <AccordionTrigger className="px-4">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <Tooltip tooltipContent={command.name}>
                              <span className="max-w-8 text-ellipsis whitespace-nowrap overflow-hidden">
                                {command.name}
                              </span>
                            </Tooltip>

                            <Badge variant="secondary">
                              {command.devices.length}
                            </Badge>

                            <Tooltip
                              tooltipContent={
                                isCommandScheduled[command.id]
                                  ? "Scheduled"
                                  : "Not Scheduled"
                              }
                            >
                              <Timer
                                size={20}
                                color={
                                  isCommandScheduled[command.id]
                                    ? "green"
                                    : "red"
                                }
                                id={command.id}
                                onClick={(e) => {
                                  selectedCommandForScheduling.current =
                                    e.currentTarget.id;
                                  setCommandScheduleVisible(true);
                                }}
                              />
                            </Tooltip>

                            {command.hasSubCommands ? (
                              <Tooltip tooltipContent="Select subcommand execution target device">
                                <TvMinimal
                                  size={20}
                                  onClick={() => {
                                    selectedCommandForScheduling.current =
                                      command.id;
                                    deviceOfSelectedCommand.current = {
                                      [selectedCommandForScheduling.current]:
                                        command.devices,
                                    };
                                    setShowDeviceSelection(true);
                                  }}
                                ></TvMinimal>
                              </Tooltip>
                            ) : null}
                          </div>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAccordion(command.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        {command.devices.map((deviceIp) => (
                          <div
                            key={deviceIp}
                            className="flex items-center justify-between py-2"
                          >
                            <span>{deviceIp}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDeleteDevice(command.id, deviceIp)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
              <div>
                <IconTextButtonWithTooltip
                  type="button"
                  tooltipContent="Save"
                  onClick={() => {
                    setSaveConfirmation(true);
                  }}
                >
                  <Save /> Save
                </IconTextButtonWithTooltip>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {saveConfirmation && (
        <CustomAlertDialog
          title=""
          description={saveConfirmationMsg}
          confirmText="Yes"
          cancelText="No"
          onConfirm={() => {
            onSubmit(
              savedCommands,
              selectedDevicseData,
              selectedCommandIds,
              selectedDeviceIds,
              savedScheduledInfo,
              setSaveConfirmation,
              close,
              associatedNodeId
            );
          }}
          onCancel={() => {
            setSaveConfirmation(false);
          }}
        />
      )}

      {commandScheduleVisible && (
        <CommandConfigSchedule
          open={commandScheduleVisible}
          close={() => {
            setCommandScheduleVisible(false);
          }}
          params={{
            selectedCommandId: selectedCommandForScheduling
              ? selectedCommandForScheduling.current
                ? selectedCommandForScheduling.current
                : ""
              : "",
            deviceList: selectedDevicseData,
            savedScheduledInfo: savedScheduledInfo,
            existingCommandSchedulingData:
              existingCommandSchedulingData.current,
          }}
        />
      )}

      {showDeviceSelection && (
        <SubCommandDeviceSelection
          open={showDeviceSelection}
          close={() => {
            setShowDeviceSelection(false);
          }}
          commandIdWiseDetails={commandIdWiseDetails}
          deviceIdWiseDetails={deviceIdWiseDetails}
          commandId={
            selectedCommandForScheduling
              ? selectedCommandForScheduling.current
                ? selectedCommandForScheduling.current
                : ""
              : ""
          }
          savedScheduledInfo={savedScheduledInfo}
          selectedDevices={deviceOfSelectedCommand}
        />
      )}
    </>
  );
}
