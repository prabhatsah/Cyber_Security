"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import {
  IconButtonWithTooltip,
  IconTextButtonWithTooltip,
} from "@/ikon/components/buttons";


import CustomAlertDialog from "@/ikon/components/alert-dialog";

import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import KnowledgeCards from "./detailsInCard";

import { Form } from "@/shadcn/ui/form";
import { Button } from "@/shadcn/ui/button";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { Label } from "@/shadcn/ui/label";
import { useKBContext } from "./knowledgeBaseContext";

import UploadComponent from "../../knowledge-new/component/UploadComponent/page";
import AddPolicyTable from "./addPolicy";
import { getControlObjData } from "../page";
// import { Form } from "react-hook-form";

// ✅ GOOD
export default function KnowledgeBaseTable({ tableData }) {
  const [customAlertVisible, setCustomAlertVisible] = useState<boolean>(false);
  const [startNewPolictyForm, setStartNewPolicyForm] = useState<boolean>(false);
  // const [existingPolicyForm, setExistingPolicyForm] = useState<boolean>(false);
  const { existingPolicyForm, setExistingPolicyForm, setPracticeArea, setObjTypes} = useKBContext()
  const [selectedOption, setSelectedOption] = useState("edit");

  const [controlObjDatas, setControlObjDatas] = useState();


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

      const uniquePracticeAreas = Array.from(new Set(filteredDataHook.map((item) => item.practiceAreas)));
      const uniqueControlObjTypes = Array.from(new Set(filteredDataHook.map((item) => item.controlObjType)));

      setPracticeArea(uniquePracticeAreas);
      setObjTypes(uniqueControlObjTypes);


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
      header: "Police Name",
      enableSorting: false,
      //   cell: (row) => <span>{row.getValue<string>() || "N/A"}</span>,
    },
    {
      accessorKey: "framework",
      header: "Framework Type",
      cell: (row) => {
        const value = row.getValue<string>();
        let displayValue = "N/A";

        if (value === "bestPractice") {
          displayValue = "BEST PRACTICE";
        } else if (value === "standard") {
          displayValue = "STANDARD";
        } else if (value === "rulesAndRegulation") {
          displayValue = "RULES AND REGULATION";
        } else if (value) {
          displayValue = value.toUpperCase();
        }

        return <span>{displayValue}</span>;
      },
    },
    {
      accessorKey: "controls",
      header: "No of Controls",
      cell: (row) => {
        console.log("asas", row.getValue().length);
        return <span>{row.getValue().length}</span>;
      },
    },
  ];

  const extraParams: DTExtraParamsProps = {
    // defaultGroups: ["auditName"],
    actionMenu: {
      items: [
        {
          label: "Edit",
          onClick: (rowData) => {
            console.log(rowData);
            // setOpenAuditReportForm(true);

            // setEditRow(rowData);
          },
          visibility: (rowData) => {
            // const alreadyExists = complianceReportDatas.some(item =>
            //     item.objectiveName === rowData.objectiveName &&
            //     item.objectiveWeight === rowData.objectiveWeight
            // );
            // return !alreadyExists;
            const status = rowData.framework === "bestPractice" ? true : false;
            return status;
          },
        },
      ],
    },
    extraTools: [
      <UploadComponent />,
      <IconTextButtonWithTooltip
        key="add-btn"
        tooltipContent="Create Framework"
        onClick={() => setCustomAlertVisible(true)}
      >
        {"Create Framework"}
      </IconTextButtonWithTooltip>,
    ],
  };

  return (
    <>
      {customAlertVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">
              Please select one of the following options to proceed with creating your framework:
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
                <Label htmlFor="edit">Select from Pre-defined List of Controls</Label>
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
      <DataTable data={tableData} columns={columns} extraParams={extraParams} />

      {setStartNewPolicyForm && (
        <AddPolicyTable
          open={startNewPolictyForm}
          setOpen={setStartNewPolicyForm}
        />
      )}
      {existingPolicyForm && (
        <Dialog open={existingPolicyForm} onOpenChange={setExistingPolicyForm}>
          <DialogContent className="!max-w-none !w-screen !h-screen p-6 flex flex-col">
            <DialogHeader>
              <DialogTitle>Framework Creation</DialogTitle>
            </DialogHeader>

            {/* KnowledgeCards outside the form but inside the dialog */}
            {filteredData && (
              <KnowledgeCards
                filteredData={filteredData}
                controlData={controlObjDatas}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
