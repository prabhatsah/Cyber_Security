import {
  FC,
  //useEffect,
  useState,
} from "react";

import { DeviceModalAddFormProps, ProfileDataType } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Separator } from "@/shadcn/ui/separator";
import { TextButtonWithTooltip } from "@/ikon/components/buttons";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "@/ikon/components/form-fields/input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { Form } from "@/shadcn/ui/form";

import { Save } from "lucide-react";
import {
  getMyInstancesV2,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";

import { CredentialType } from "../types";

type paramsType = {
  profile: ProfileDataType;
  clientId: string;
};

const onSubmit = async function (
  formValues: z.infer<typeof formSchema>,
  close: () => void,
  refresh: () => void,
  params: paramsType
) {
  //console.log('FormValues: ', formValues);

  const formData = {
    hostName: formValues.hostName,
    hostIp: formValues.hostIp,
    shortCode: formValues.shortCode,
    assetTag: formValues.assetTag,
    description: formValues?.description,
    classification: formValues.classification,
    type: formValues.deviceType,
    os: formValues.os,
    macAddress: formValues.macAddress,
    probeId: formValues.probe,
    //dryRunAccessable: formValues.dryRun ? 'Yes' : 'No',

    dryRunAccessable: formValues.dryRun,

    deviceId: new Date().getTime(),
    clientId: params.clientId,
    deviceAdded: "manual",
    editFlag: false,
    accountable: {
      userName: params.profile.USER_NAME,
      userId: params.profile.USER_ID,
    },
    assignedRoles: null,
    city: null,
    country: null,
    osType: formValues.protocol,
    state: null,
    deviceCredentialID: formValues.credential,
    isDryRunEnabled: formValues.dryRun,
    location: "",
    discoverDateAndTime: new Date(),
  };

  //console.log('Form Data: ', formData);

  const processId = await mapProcessName({ processName: "Configuration Item" });

  console.group("ProcessID: ", processId);

  await startProcessV2({
    processId: processId,
    data: formData,
    processIdentifierFields: "deviceId,clientId,probeId,hostName,hostIp",
  });

  close();
  refresh();
};

// Define the regular expression for IP address validation
const ipRegex =
  /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
// Define the regular expression for MAC address validation
//const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
const macRegex =
  /(?:[0-9A-Fa-f]{2}([-:]))(?:[0-9A-Fa-f]{2}\1){4}[0-9A-Fa-f]{2}|[0-9A-Fa-f]{12}|[0-9A-Fa-f]{4}\.[0-9A-Fa-f]{4}\.[0-9A-Fa-f]{4}/g;

const formSchema = z.object({
  hostName: z.string().min(2, {
    message: "Hostname is required",
  }),
  hostIp: z.string().regex(ipRegex, { message: "Invalid IP address format" }),
  shortCode: z.string().min(2, {
    message: "Shortcode is required",
  }),
  assetTag: z.string().min(2, {
    message: "Asset tag is required",
  }),
  classification: z.string().min(2, {
    message: "Classification is required",
  }),
  deviceType: z.string().min(2, {
    message: "Device type is required",
  }),
  os: z.string().min(2, {
    message: "Operating system is required",
  }),
  macAddress: z
    .string()
    .regex(macRegex, { message: "Invalid MAC address format" }),
  dryRun: z.string().min(1, {
    message: "Dry run accessible is required",
  }),
  probe: z.string().min(1, {
    message: "Probe is required",
  }),
  description: z.string().optional(),
  protocol: z.string().min(1, {
    message: "Protocol is required",
  }),
  credential: z.string().min(1, {
    message: "Credential is required",
  }),
});

type credentialDetailsType = {
  [Key: string]: CredentialType;
};

type CredentialSelectType = {
  label: string;
  value: string;
};

const credentialTypeWiseData: credentialDetailsType = {};

const getCredentialData = async function (processName: string) {
  const credentialData = await getMyInstancesV2<CredentialType>({
    processName: processName,
    predefinedFilters: {
      taskName: "View credential",
    },
  });

  //console.log('credential data: ', credentialData);

  credentialTypeWiseData[credentialData[0].data.credentialType] =
    credentialData[0].data;

  console.log("crendential data: ", credentialTypeWiseData);

  return credentialData;
};

const DeviceModalAddForm: FC<DeviceModalAddFormProps> = ({
  open,
  close,
  refresh,
  profile,
  probleIdWiseDetails,
  clientId
}) => {
  const [credentialData, setCredentialData] = useState<CredentialSelectType[]>([]);

  const param: paramsType = {
    profile: profile,
    clientId: clientId
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      hostName: "",
      hostIp: "",
      shortCode: "",
      assetTag: "",
      classification: "",
      deviceType: "",
      os: "",
      macAddress: "",
      dryRun: "",
      probe: "",
      description: "",
      protocol: "",
      credential: "",
    },
  });

  const handleSelectChange = function (field: string, value: string) {
    // @ts-expect-error : ignore following line
    form.setValue(field, value);
  };

  const handleProtocolChange = async function (protocol: string) {
    //console.log('e: ', e);

    switch (protocol) {
      case "windows":
        await getWindowsCredentialData();
        break;

      case "Ssh":
        await getSSHCredentialData();
        break;

      case "snmp":
        await getSNMPCredentialData();
        break;
    }
  };

  const getWindowsCredentialData = async function () {
    const data = await getCredentialData("Windows Credential Directory");

    //console.log('Windows credential data: ', data);

    const data1 = data.map((obj) => obj.data);

    setWindowsCredential(data1);
  };

  const setWindowsCredential = function (data: CredentialType[]) {
    const selectData = data.map((obj) => ({
      value: obj.credentialId,
      label: obj.credentialName,
    }));

    //console.log("selectData: ",selectData);

    setCredentialData(selectData);
  };

  const getSSHCredentialData = async function () {
    const data = await getCredentialData("SSH Credential Directory");

    //console.log('Windows credential data: ', data);

    const data1 = data.map((obj) => obj.data);

    setSSHCredentialData(data1);
  };

  const setSSHCredentialData = function (data: CredentialType[]) {
    const selectData = data.map((obj) => ({
      value: obj.credentialId,
      label: obj.credentialName,
    }));

    //console.log("selectData: ",selectData);

    setCredentialData(selectData);
  };

  const getSNMPCredentialData = async function () {
    const data = await getCredentialData("SNMP Community Credential Directory");

    //console.log('Windows credential data: ', data);

    const data1 = data.map((obj) => obj.data);

    setSNMPCredential(data1);
  };

  const setSNMPCredential = function (data: CredentialType[]) {
    const selectData = data.map((obj) => ({
      value: obj.credentialId,
      label: obj.credentialName,
    }));

    //console.log("selectData: ",selectData);

    setCredentialData(selectData);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Device</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <Separator />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((val) => {
                onSubmit(val, close, refresh, param);
              })}
            >
              <div className="grid grid-cols-2 gap-3 mb-4">
                <FormInput
                  id="hostName"
                  name="hostName"
                  label={
                    <>
                      Host Name <span className="text-destructive">*</span>
                    </>
                  }
                  formControl={form.control}
                />
                <FormInput
                  id="hostIp"
                  name="hostIp"
                  label={
                    <>
                      Host IP <span className="text-destructive">*</span>
                    </>
                  }
                  formControl={form.control}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <FormInput
                  id="shortCode"
                  name="shortCode"
                  label={
                    <>
                      Short Code <span className="text-destructive">*</span>
                    </>
                  }
                  formControl={form.control}
                />
                <FormInput
                  id="assetTag"
                  name="assetTag"
                  label={
                    <>
                      Asset Tag <span className="text-destructive">*</span>
                    </>
                  }
                  formControl={form.control}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <FormInput
                  id="classification"
                  name="classification"
                  label={
                    <>
                      Classification <span className="text-destructive">*</span>
                    </>
                  }
                  formControl={form.control}
                />

                <div>
                  <FormComboboxInput
                    name="deviceType"
                    label={
                      <>
                        Device Type <span className="text-destructive">*</span>
                      </>
                    }
                    onSelect={(value) => {
                      handleSelectChange("deviceType", value as string);
                    }}
                    formControl={form.control}
                    placeholder="Select device type"
                    items={[
                      {
                        value: "Server",
                        label: "Server",
                      },
                      {
                        value: "Network Device",
                        label: "Network Device",
                      },
                      {
                        value: "Personal Computer",
                        label: "Personal Computer",
                      },
                      {
                        value: "Laptop",
                        label: "Laptop",
                      },
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <FormComboboxInput
                    name="os"
                    label={
                      <>
                        Operating System <span className="text-destructive">*</span>
                      </>
                    }
                    onSelect={(value) => {
                      handleSelectChange("os", value as string);
                    }}
                    formControl={form.control}
                    placeholder="Select os"
                    items={[
                      {
                        value: "Windows 2019 Server",
                        label: "Windows 2019 Server",
                      },
                      {
                        value: "Windows 2017 Server",
                        label: "Windows 2017 Server",
                      },
                      {
                        value: "Windows 10",
                        label: "Windows 10",
                      },
                      {
                        value: "Windows 11",
                        label: "Windows 11",
                      },
                      {
                        value: "Ubuntu_18.04.6",
                        label: "Ubuntu 18.04.6 LTS",
                      },
                      {
                        value: "Ubuntu_20.04.6",
                        label: "Ubuntu 20.04.6 LTS",
                      },
                      {
                        value: "Others",
                        label: "Others",
                      },
                    ]}
                  />
                </div>
                <div>
                  <FormComboboxInput
                    name="protocol"
                    label={
                      <>
                        Protocol <span className="text-destructive">*</span>
                      </>
                    }
                    formControl={form.control}
                    placeholder="Select protocol"
                    // @ts-expect-error : ignore
                    onSelect={handleProtocolChange}
                    items={[
                      {
                        value: "Ssh",
                        label: "SSH",
                      },
                      {
                        value: "windows",
                        label: "Windows",
                      },
                      {
                        value: "snmp",
                        label: "SNMP",
                      },
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <FormComboboxInput
                    name="credential"
                    label={
                      <>
                        Credential <span className="text-destructive">*</span>
                      </>
                    }
                    formControl={form.control}
                    placeholder="Select credential"
                    items={credentialData}
                  />
                </div>

                <FormInput
                  id="macAddress"
                  name="macAddress"
                  label={
                    <>
                      MAC Address <span className="text-destructive">*</span>
                    </>
                  }
                  formControl={form.control}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <FormComboboxInput
                    name="probe"
                    label={
                      <>
                        Probe <span className="text-destructive">*</span>
                      </>
                    }
                    formControl={form.control}
                    placeholder="Select probe"
                    onSelect={(value) => {
                      handleSelectChange("probe", value as string);
                    }}
                    items={
                      probleIdWiseDetails
                        ? Object.keys(probleIdWiseDetails).map((probeId) => ({
                            value: probeId,
                            label: probleIdWiseDetails[probeId],
                          }))
                        : []
                    }
                  />
                </div>
                <div>
                  <FormComboboxInput
                    name="dryRun"
                    label={
                      <>
                        Dry Run Accessible <span className="text-destructive">*</span>
                      </>
                    }
                    formControl={form.control}
                    placeholder="Select a option"
                    onSelect={(value) => {
                      handleSelectChange("dryRun", value as string);
                    }}
                    items={[
                      {
                        value: "Yes",
                        label: "Yes",
                      },
                      {
                        value: "No",
                        label: "No",
                      },
                    ]}
                  />
                </div>
              </div>

              <div className="grid">
                <FormTextarea
                  id="description"
                  name="description"
                  label="Description"
                  formControl={form.control}
                />
              </div>

              <Separator />

              <div className="flex justify-end mt-4">
                <TextButtonWithTooltip
                  disabled={!form.formState.isValid}
                  type="submit"
                  tooltipContent="Save device"
                >
                  <Save /> Save
                </TextButtonWithTooltip>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeviceModalAddForm;
