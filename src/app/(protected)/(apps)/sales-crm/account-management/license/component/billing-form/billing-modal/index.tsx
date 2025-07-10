"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { Form } from "@/shadcn/ui/form";
import {Dialog,DialogContent,DialogFooter,DialogHeader,DialogTitle} from "@/shadcn/ui/dialog";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormComboboxInputWithValue from "@/ikon/components/form-fields/combobox-input-value";
import FormInput from "@/ikon/components/form-fields/input";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";
import moment from "moment";
import { v4 } from "uuid";
import { z } from "zod";
import { startBilling } from "../start-billing";
import { invokeBilling } from "../invoke-billing";
import { BillingSchema } from "../billing-schema";

interface Server {
  name: string;
  config: string;
}

export interface BillingAccountProps {
  //[x: string]: string;
  id: string;
  name: string;
  parentAccount: string;
  servers: Server[];
  resources: [];
  createdOn: string;
  updatedOn: string;
  isParent: boolean;
  isActive?: boolean;
  childAccounts: string[];
  parentId?: string;
  production?: boolean;
  development?: boolean | undefined;
  uat?: boolean;
  preProduction?: boolean;
}

interface BillingDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAcc?: BillingAccountProps;
}

const BillingModal: React.FC<BillingDetailsProps> = ({ isOpen, onClose, selectedAcc }) => {

  const [serverOptions, setServerOptions] = useState<Server[]>([]);
  const [configuration, setConfiguration] = useState<{ value: string; label: string }[]>([]);
  const [parentAccountSet, setParentAccountSet] = useState<{ label: string; value: string }[]>([]);
  const [accountAc, setAccountAc] = useState<{ label: string; value: string }[]>([]);
  const [isChildAcc, setIsChildAcc] = useState<boolean>(false);
  const [hasSelectedAcc, setHasSelectedAcc] = useState<boolean>(false);
  const [selectedServers, setSelectedServers] = useState<Record<string, string>>({});

  const form = useForm<z.infer<typeof BillingSchema>>({
    resolver: zodResolver(BillingSchema),
    defaultValues: {
      accountName: selectedAcc?.name || "",
      parentAccount: selectedAcc?.parentAccount || "",
    },
  });

  const watchedValues = useWatch({ control: form.control });
  useEffect(() => {
    console.log("Watched Form Values:", watchedValues);
  }, [watchedValues]);

  useEffect(() => {
    if (selectedAcc && Object.keys(selectedAcc).length > 0) {
      setHasSelectedAcc(true);
      form.reset({
        accountName: selectedAcc.name || "",
        parentAccount: selectedAcc.parentAccount || "",
      });
      setIsChildAcc(false);
      if (selectedAcc.servers) {
        const initialSelected: Record<string, string> = {};
        selectedAcc.servers.forEach((srv) => {
          initialSelected[srv.name] = srv.config;
        });
        setSelectedServers(initialSelected);
      }
    } else {
      setHasSelectedAcc(false);
    }
  }, [selectedAcc, form]);

  useEffect(() => {
    const fetchLicenseData = async () => {
      try {
        const accountInsData = await getMyInstancesV2({
          processName: "Account",
          predefinedFilters: { taskName: "View State" },
        });
        const accountData: any[] = accountInsData.map((e: any) => e.data);
        const accountOptions = accountData.map((item) => ({
          label: item.accountName,
          value: item.accountIdentifier,
        }));
        setAccountAc(accountOptions);

        const billingInsData = await getMyInstancesV2({
          processName: "Billing Account",
          predefinedFilters: { taskName: "View" },
        });
        const billingData: any[] = billingInsData.map((e: any) => e.data);
        const parentAccountOptions = billingData.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setParentAccountSet(parentAccountOptions);

        const servers: Server[] = [
          { name: "Development", config: "" },
          { name: "UAT", config: "" },
          { name: "Pre Production", config: "" },
          { name: "Production", config: "" },
        ];
        setServerOptions(servers);

        setConfiguration([
          { value: "Billing Events", label: "Billing Events" },
          { value: "User List", label: "User List" },
          { value: "Activity Logs", label: "Activity Logs" },
        ]);
      } catch (error) {
        console.error("Error fetching License:", error);
      }
    };

    fetchLicenseData();
  }, []);

  const handleChildAccountChange = (checked: boolean) => {
    setIsChildAcc(checked);
  };

  const columns: ColumnDef<Server>[] = [
    {
      accessorKey: "select",
      header: () => <div style={{ textAlign: "center" }}>Select</div>,
      cell: ({ row }) => {
        const serverName = row.original.name;
        return (
          <Checkbox
            id={`select-${serverName}`}
            checked={Object.prototype.hasOwnProperty.call(selectedServers, serverName)}
            onCheckedChange={(checked) =>
              setSelectedServers((prev) => {
                if (!checked) {
                  const { [serverName]: removed, ...rest } = prev;
                  return rest;
                }
                return { ...prev, [serverName]: prev[serverName] ?? "" };
              })
            }
          />
        );
      },
    },

    {
      accessorKey: "name",
      header: () => <div style={{ textAlign: "center" }}>Server</div>,
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: "config",
      header: () => <div style={{ textAlign: "center" }}>Configuration</div>,
      cell: ({ row }) => {
        const serverName = row.original.name;
        return (
          <FormComboboxInputWithValue
            items={configuration}
            formControl={form.control}
            name={`configuration-${serverName}`}
            placeholder="Select a Configuration"
            value={selectedServers[serverName] || ""}
            onChange={(selectedOption: any) =>
              setSelectedServers((prev) => ({
                ...prev,
                [serverName]:
                  selectedOption && selectedOption.value ? selectedOption.value : selectedOption || "",
              }))
            }
          />
        );
      },
    },
  ];

  const handleOnSubmit = async (formData: z.infer<typeof BillingSchema>) => {
    const serversArray = Object.entries(selectedServers)
      .map(([serverName, config]) => {
        const arr = [{ name: serverName, config }];
        if (config === "Activity Logs") {
          arr.push({ name: serverName, config: "Billing Events" });
        }
        return arr;
      })
      .flat();

    const currDate = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZZ");
    //const currDate = new Date().toISOString();

    const finalData: BillingAccountProps = {
      id: selectedAcc?.id || v4(),
      name: formData.accountName,
      parentAccount: formData.parentAccount || "",
      servers: serversArray, // will contain selected servers or be empty
      resources: [],
      createdOn: selectedAcc?.createdOn || currDate,
      updatedOn: currDate,
      isParent: !selectedAcc?.parentAccount,
      isActive: true,
      childAccounts: [],
    };

    console.log("Final Billing Account Data:", finalData);
    if (selectedAcc && selectedAcc.id) {
      await invokeBilling(finalData);
    } else {
      await startBilling(finalData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Configure Billing Account Servers</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="grid gap-4"
          >
            {!hasSelectedAcc && (
              <div className="grid grid-cols-3 gap-4" id="deal_checkbox">
                <div className="grid gap-1.5">
                  <div className="flex items-center">
                    <Checkbox id="childAccount" checked={isChildAcc} onCheckedChange={handleChildAccountChange}/>
                    <label htmlFor="childAccount" className="ml-2 text-sm font-medium">
                      Is Child Account?
                    </label>
                  </div>
                </div>
              </div>
            )}

            {isChildAcc ? (
              <>
                <div className="grid gap-1.5" id="copyFxRateId">
                  <FormComboboxInput
                    items={parentAccountSet}
                    formControl={form.control}
                    name="parentAccount"
                    placeholder="Select a Parent Account"
                    label="Parent Account"
                  />
                </div>
                <div className="grid gap-1.5">
                  <FormInput
                    formControl={form.control}
                    name="accountName"
                    label="Account Name *"
                    placeholder="Enter Account Name"
                    disabled={hasSelectedAcc}
                  />
                </div>
              </>
            ) : (
              <div className="grid gap-1.5" id="copyFxRateId">
                <FormComboboxInput
                  items={accountAc}
                  formControl={form.control}
                  name="accountName"
                  placeholder="Select an Account"
                  label="Account Name *"
                  disabled={hasSelectedAcc}
                />
              </div>
            )}

            <DataTable columns={columns} data={serverOptions} />

            <DialogFooter className="flex justify-end mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BillingModal;
