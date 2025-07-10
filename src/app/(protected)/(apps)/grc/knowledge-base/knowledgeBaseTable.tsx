"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";

import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import KnowledgeCards from "./detailsInCard";
import { getControlObjData } from "./page2";
import { Button } from "@/shadcn/ui/button";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { Label } from "@/shadcn/ui/label";
import { useKBContext } from "./components/knowledgeBaseContext";
import { EditPolicy } from "./components/editPolicy";
import FrameworkCreationForm from "./components/frameworkCreationForm";
import { StatusBadge } from "../components/status-badge";
import { SAVE_DATE_TIME_FORMAT_GRC } from "@/ikon/utils/config/const";
import { format } from "date-fns";
import { Download } from "lucide-react";
import UploadComponent from "./components/uploadComponent";
import PolicyControlsDialog from "./components/FrameworkEditSection/newEditFrameworkForm";

export default function KnowledgeBaseTable({ tableData, userIdNameMap,frameworkMappingData,isCentralAdminUser }: any) {
  const [customAlertVisible, setCustomAlertVisible] = useState<boolean>(false);
  const [startNewPolictyForm, setStartNewPolicyForm] = useState<boolean>(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
  // const [existingPolicyForm, setExistingPolicyForm] = useState<boolean>(false);
  const {
    existingPolicyForm,
    setExistingPolicyForm,
    setPracticeArea,
    setObjTypes,
    setUserMap
  } = useKBContext();
  const [selectedOption, setSelectedOption] = useState("edit");
  const [editRow, setEditRow] = useState(null);
  const [controlObjDatas, setControlObjDatas] = useState();
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openNewEditForm, setOpenNewEditForm] = useState(false);

  useEffect(() => {
    async function solve() {
      const controlObjDatas = await getControlObjData();
      setControlObjDatas(controlObjDatas);
      const filteredDataHook =
        controlObjDatas &&
        controlObjDatas.flatMap((policy: any) => {
          return policy.controls.flatMap((control: any) => {
            return control.controlObjectives.map((obj: any) => ({
              policyName: policy.policyName,
              practiceAreas: obj.practiceAreas,
              controlObjType: obj.controlObjType,
            }));
          });
        });

      const uniquePracticeAreas = Array.from(
        new Set(filteredDataHook.map((item) => item.practiceAreas))
      );
      const uniqueControlObjTypes = Array.from(
        new Set(filteredDataHook.map((item) => item.controlObjType))
      );

      setPracticeArea(uniquePracticeAreas);
      setObjTypes(uniqueControlObjTypes);
      setUserMap(userIdNameMap);
    }

    solve();
  }, []);

  const handleContinue = () => {
    if (selectedOption === "scratch") {
      setStartNewPolicyForm(true);
    } else {
      setExistingPolicyForm(true);
    }
    setCustomAlertVisible(false);
  };

  console.log("controlObjDatas ------------ ", controlObjDatas);

  const filteredData =
    controlObjDatas &&
    controlObjDatas.flatMap((policy: any) => {
      return policy.controls.flatMap((control: any) => {
        return control.controlObjectives.map((obj: any) => ({
          policyName: policy.policyName,
          practiceAreas: obj.practiceAreas,
          controlObjType: obj.controlObjType,
        }));
      });
    });

  const columns: DTColumnsProps<Record<string, any>>[] = [
    {
      accessorKey: "policyName",
      header: "Framework",
      enableSorting: false,
      //   cell: (row) => <span>{row.getValue<string>() || "N/A"}</span>,
    },
    {
      accessorKey: "description",
      header: "Description",
      enableSorting: false,
      cell: (row) => {
        const fullDescription = row.getValue<string>() ?? "N/A";
        const maxLength = 50;

        const displayText =
          fullDescription.length > maxLength
            ? fullDescription.slice(0, maxLength) + "..."
            : fullDescription;

        return <span title={fullDescription}>{displayText}</span>;
      },
    },
    {
      accessorKey: "owners",
      header: "Owner(s)",
      cell: ({ row }) => {
        const auditeeTeamIds = row.original.owners;

        // Map the IDs to their corresponding names using userIdNameMap
        const auditeeTeamNames = Array.isArray(auditeeTeamIds)
          ? auditeeTeamIds
            .map(
              (id: string) =>
                userIdNameMap.find((user) => user.value === id)?.label
            )
            .filter((name) => name) // Filter out undefined names
          : [];

        // Join names and truncate with ellipses if too long
        const displayNames =
          auditeeTeamNames.length > 3
            ? `${auditeeTeamNames.slice(0, 3).join(", ")}...`
            : auditeeTeamNames.join(", ");

        return (
          <span
            title={auditeeTeamNames.join(", ")} // Show full names on hover
          >
            {displayNames}
          </span>
        );
      },
    },
    {
      accessorKey: "framework",
      header: "Framework Type",
      cell: (row) => {
        const value = row.getValue<string>();
        let displayValue = "N/A";

        if (value === "bestPractice") {
          displayValue = "Best Practice";
        } else if (value === "standard") {
          displayValue = "Standard";
        } else if (value === "rulesAndRegulation") {
          displayValue = "Rules And Regulation";
        } else if (value) {
          displayValue = value.toUpperCase();
        }

        return <span>{displayValue}</span>;
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <span>{row.getValue("category") || "N/A"}</span>,
    },
    {
      accessorKey: "compliant",
      header: "Compliant",
      enableSorting: false,
      cell: (row) => {
        const value = row.getValue<string>() ?? "notImplemented";

        // Map internal status keys to readable labels
        const statusLabelMap: Record<string, string> = {
          fullyImplemented: "FULLY IMPLEMENTED",
          partiallyImplemented: "PARTIALLY IMPLEMENTED",
          notImplemented: "NOT IMPLEMENTED",
          notApplicable: "NOT APPLICABLE",
        };

        const label = statusLabelMap[value] || "UNKNOWN";

        return (
          <StatusBadge
            status={label}
            customColors={{
              "FULLY IMPLEMENTED": "#70c570",
              "PARTIALLY IMPLEMENTED": "#f5f585",
              "NOT IMPLEMENTED": "#ff4545",
              "NOT APPLICABLE": "gray",
            }}
          />
        );
      },
    },
    {
      accessorKey: "lastUpdatedOn",
      header: "Last Updated On",
      cell: (row) => {
        const genericPool = [
          "10-Apr-2025",
          "03-Apr-2025",
          "22-Apr-2025",
          "13-Apr-2025",
        ];

        const rawValue = row.getValue<string>();
        const fallback =
          genericPool[Math.floor(Math.random() * genericPool.length)];

        const formatted = rawValue
          ? format(rawValue, SAVE_DATE_TIME_FORMAT_GRC)
          : fallback;

        return <span>{formatted}</span>;
      },
    },
  ];

  const extraParams: DTExtraParamsProps = {
    // defaultGroups: ["auditName"],
    actionMenu: {
      items: [
        // {
        //   label: "Edit",
        //   onClick: (rowData) => {
        //     console.log(rowData);
        //     // setOpenAuditReportForm(true);
        //     setOpenEditForm(true);
        //     setEditRow(rowData);
        //   },
          
        // },
        {
          label: "Edit",
          onClick: (rowData) => {
            console.log(rowData);
            setOpenEditForm(true);
            setEditRow(rowData);
          },
        }
      ],
    },
    extraTools: isCentralAdminUser? [
      <Button variant="outline" size="sm" onClick={() => { setUploadDialogOpen(true) }}>
        <Download className="mr-2 h-4 w-4" />
        Import
      </Button>,
      <IconTextButtonWithTooltip
        key="add-btn"
        tooltipContent="Create Framework"
        onClick={() => setCustomAlertVisible(true)}
      >
        {"Create Framework"}
      </IconTextButtonWithTooltip>,
    ]: [],
  };

  return (
    <>
      {customAlertVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">
              Please select one of the following options to proceed with
              creating your framework:
            </h3>
            <br></br>
            {/* <p className="text-sm text-muted-foreground mb-4">
        Create from Scratch - Start with a blank framework and build it from the ground up.
        <br /><br />
        Select from Pre-defined List of Controls - Choose from a list of available pre-configured controls and customize them to fit your needs.
      </p> */}

            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
              className="space-y-2 mb-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="edit" id="edit" />
                <Label htmlFor="edit">
                  Select from Pre-defined List of Controls
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scratch" id="scratch" />
                <Label htmlFor="scratch">Create from Scratch</Label>
              </div>
            </RadioGroup>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setCustomAlertVisible(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleContinue}>Proceed</Button>
            </div>
          </div>
        </div>
      )}
      {/* <Card></Card> */}
      <DataTable data={tableData} columns={columns} extraParams={extraParams} />

      {setStartNewPolicyForm && (
        // <AddPolicyTable
        //   open={startNewPolictyForm}
        //   setOpen={setStartNewPolicyForm}
        //   setExistingPolicyFormIdentifier={setExistingPolicyForm}
        // />
        <FrameworkCreationForm
          open={startNewPolictyForm}
          setOpen={setStartNewPolicyForm}
        />
      )}
      {existingPolicyForm && (
        <Dialog open={existingPolicyForm} onOpenChange={setExistingPolicyForm}>
          <DialogContent className="!max-w-none !w-screen !h-screen p-6 flex flex-col">
            <div className="">
              <DialogHeader>
                <DialogTitle className="">Framework Creation</DialogTitle>
              </DialogHeader>

              {/* KnowledgeCards outside the form but inside the dialog */}
              {filteredData && (
                <KnowledgeCards
                  filteredData={filteredData}
                  controlData={controlObjDatas}
                  frameworkMappingData={frameworkMappingData}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* {editRow != null && (
        <EditPolicy
          openEditForm={openEditForm}
          setOpenEditForm={setOpenEditForm}
          editrow={editRow}
          isCentralAdminUser={isCentralAdminUser}
        />
      )} */}

      {editRow != null && (
        <PolicyControlsDialog editdata={editRow} openEditForm={openEditForm} setOpenEditForm={setOpenEditForm}  isCentralAdminUser={isCentralAdminUser}/>
      )}

      {
        uploadDialogOpen &&
        <UploadComponent uploadDialogOpen={uploadDialogOpen} setUploadDialogOpen={setUploadDialogOpen} />
      }
    </>
  );
}
