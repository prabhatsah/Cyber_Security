"use client";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { Button } from "@/shadcn/ui/button";
// import { HoverBorderGradient } from "@/shadcn/ui/hover-border-gradient";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Card, CardContent } from "@/shadcn/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shadcn/ui/accordion";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { Form } from "@/shadcn/ui/form";
// import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormComboboxInput from '@/ikon/components/form-fields/combobox-input';
import FormTextarea from "@/ikon/components/form-fields/textarea";
import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { format } from "date-fns";
import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";
import UploadComponent from "./uploadComponentForFindings";
import { Label } from "@/shadcn/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/shadcn/ui/toggle-group";
import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";
import { fetchFindingsMatchedInstance } from "./(backend-calls)";
import { toast } from "sonner";
import {
  ListCheck,
  ListChecks,
  Loader2Icon,
  Save,
  SparklesIcon,
  Tags,
} from "lucide-react";
import ExcelGenerator from "./excelGenerator";
import { Finding, ObservationDetail } from "../../../../(common-types)/types";
import { RephraseModal } from "./refhraseModal";
import { HoverBorderGradient } from "@/shadcn/ui/hover-border-gradient";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
const ObserveFormSchema = z.object({
  CONTROL_NAME: z.string().optional(),
  CONTROL_OBJ: z.string().optional(),
  findings: z
    .array(
      z.object({
        findingId: z.string().min(1, "Finding ID is required"),
        controlName: z.string().min(1, "Control name is required"),
        controlObjective: z.string().min(1, "Control objective is required"),
        controlObjId: z
          .union([z.string(), z.number()])
          .refine((val) => val !== "" && val !== null && val !== undefined, {
            message: "Control objective ID is required",
          }),
        controlId: z
          .union([z.string(), z.number()])
          .refine((val) => val !== "" && val !== null && val !== undefined, {
            message: "Control ID is required",
          }),

        observationDetails: z
          .array(
            z.object({
              observation: z
                .string()
                .min(1, "Observation is required")
                .max(500, "Observation must be less than 500 characters"),
              recommendation: z
                .string()
                .min(1, "Recommendation is required")
                .max(500, "Recommendation must be less than 500 characters"),
              owner: z.string().min(1, "Owner is required"),
              observationId: z.any().optional(),
              conformity: z
                .union([
                  z.enum([
                    "Major Nonconformity",
                    "Minor Nonconformity",
                    "Conforms",
                    "Recommendation",
                  ]),
                  z.literal(""),
                ])
                .refine((val) => val !== "", {
                  message: "Conformity cannot be empty",
                }),
              updatedBy: z.string().min(1, "Updated by is required"),
              lastUpdatedOn: z.string().datetime("Invalid date format"),
            })
          )
          .min(1, "At least one observation is required"),

        status: z
          .enum(["Pass", "Failed", "On-hold"], {
            errorMap: () => ({ message: "Invalid status" }),
          })
          .optional(),

        updatedByOverAll: z.any().optional(),
        lastUpdatedOnOverAll: z.any().optional(),
      })
    )
    .optional(),
});
type FormSchemaType = z.infer<typeof ObserveFormSchema>;

export const conformityData = [
  { value: "Major Nonconformity", label: "Major Nonconformity" },
  { value: "Minor Nonconformity", label: "Minor Nonconformity" },
  { value: "Conforms", label: "Conforms" },
  { value: "Recommendation", label: "Recommendation" },
];

export const statusData = [
  { value: "Pass", label: "Pass" },
  { value: "Failed", label: "Failed" },
  { value: "On-hold", label: "On-hold" },
];

export default function MeetObservationForm({
  open,
  setOpen,
  userIdNameMap,
  selectedMeetData,
  auditData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userIdNameMap: { value: string; label: string }[];
  selectedMeetData: Record<string, any>;
  auditData: any;
}) {
  // const router = useRouter()
  console.log("selectedMeetData by ankit----", selectedMeetData);
  const router = useRouter();
  const defaultValues: FormSchemaType = {
    CONTROL_NAME: "",
    CONTROL_OBJ: "",
    findings: [],
  };

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(ObserveFormSchema),
    defaultValues,
  });

  const { control, watch, handleSubmit, reset, setValue, getValues } = form;
  const { fields, append, update } = useFieldArray({
    control,
    name: "findings",
  });

  const [inputMethod, setInputMethod] = useState<"manual" | "upload">("manual");
  const [uploadedFindingsData, setUploadedFindingsData] = useState();
  const [uploadedUserMap, setuploadedUserMap] = useState();
  const [currentUserId, setCurrentUserId] = useState();
  const [loadingOnSave, setLoadingOnSave] = useState(false);
  const [fieldsForExcel, setFieldsForExcel] = useState<Finding[]>();
  const [accordionValue, setAccordionValue] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [policyForAI, setPolicyForAI] = useState("");
  const [observationForAI, setObservationForAI] = useState("");
  const [objectiveForAI, setObjectiveForAI] = useState("");
  const [typeOfField, setTypeOfField] = useState("");
  const [activeField, setActiveField] = useState<{
    index: number;
    obsIndex: number;
    field: "observation" | "recommendation";
  } | null>(null);

  const openRephrase = (
    controlName: string,
    controlObjective: string,
    text: string,
    index: number,
    obsIndex: number,
    field: "observation" | "recommendation"
  ) => {
    setPolicyForAI(controlName);
    setObjectiveForAI(controlObjective);
    setCurrentText(text);
    setTypeOfField(field);
    setActiveField({ index, obsIndex, field });
    setOpenModal(true);
  };

  const handleSubmitRephrased = (newText: string) => {
    if (!activeField) return;
    const { index, obsIndex, field } = activeField;
    setValue(
      `findings.${index}.observationDetails.${obsIndex}.${field}`,
      newText
    );
  };
  const [loading, setLoading] = useState(true);
  const controlData = selectedMeetData?.selectedControls || [];

  const controlNames = controlData.map((control: any) => ({
    value: control.policyId.toString(),
    label: control.controlName,
  }));

  const selectedControlId = watch("CONTROL_NAME");
  const selectedObjId = watch("CONTROL_OBJ");

  const selectedControl = controlData.find(
    (c: any) => c.policyId.toString() === selectedControlId
  );
  const filteredControlObjectives = selectedControl
    ? selectedControl.controlObj.map((obj: any) => ({
      value: obj.objId.toString(),
      label: obj.objName,
    }))
    : [];

  const selectedControlLabel = controlNames.find(
    (item: any) => item.value === selectedControlId
  )?.label;
  const selectedObjLabel = filteredControlObjectives.find(
    (item: any) => item.value === selectedObjId
  )?.label;

  useEffect(() => {
    if (!open) return;
    reset(defaultValues);
  }, [open, reset]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "CONTROL_NAME") {
        setValue("CONTROL_OBJ", ""); // Reset objective when control changes
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  // const handleAddFinding = async () => {
  //   if (!selectedControlId || !selectedObjId) return;

  //   const existingFinding = fields.find(
  //     (f) =>
  //       f.controlName === selectedControlLabel &&
  //       f.controlObjective === selectedObjLabel
  //   );
  //   const matchedInstance = await fetchFindingsMatchedInstance(
  //     selectedControlId,
  //     selectedObjId
  //   );
  //   console.log("matchedInstance----", matchedInstance);
  //   if (matchedInstance?.length > 0) {
  //     const transformedFindings = Object.values(matchedInstance);
  //     setValue("findings", transformedFindings);
  //   }
  //   if (existingFinding) {
  //     // Add new observation to existing finding
  //     const findingIndex = fields.findIndex(
  //       (f) => f.findingId === existingFinding.findingId
  //     );
  //     const updatedFinding = {
  //       ...existingFinding,
  //       observationDetails: [
  //         ...existingFinding.observationDetails,
  //         {
  //           observation: "",
  //           recommendation: "",
  //           owner: "",
  //           conformity: "",
  //           lastUpdatedOn: new Date().toISOString(),
  //           updatedBy: currentUserId,
  //         },
  //       ],
  //     };
  //     update(findingIndex, updatedFinding);
  //   } else {
  //     // Create new finding with one observation
  //     const id = v4();
  //     append({
  //       findingId: id,
  //       // controlId: selectedControlId,
  //       controlName: selectedControlLabel || "",
  //       controlObjective: selectedObjLabel || "",
  //       controlObjId: selectedObjId,
  //       controlId: selectedControlId || 1,
  //       observationDetails: [
  //         {
  //           observation: "",
  //           recommendation: "",
  //           owner: "",
  //           conformity: "",
  //           lastUpdatedOn: new Date().toISOString(),
  //           updatedBy: currentUserId,
  //         },
  //       ],
  //       status: "",
  //       lastUpdatedOnOverAll: "",
  //       updatedByOverAll: "",
  //     });
  //   }
  // };

  const handleAddFinding = async () => {
    if (!selectedControlId || !selectedObjId) return;

    // 1. First check if this control+objective exists in database
    const matchedInstance = await fetchFindingsMatchedInstance(
      selectedControlId,
      selectedObjId
    );

    // 2. If exists in DB, populate those findings
    if (matchedInstance && matchedInstance.length > 0) {
      const transformedFindings = matchedInstance.map((finding) => ({
        ...finding,
        // Ensure all required fields are present
        observationDetails: finding.observationDetails?.map((obs) => ({
          ...obs,
          lastUpdatedOn: obs.lastUpdatedOn || new Date().toISOString(),
          updatedBy: obs.updatedBy || currentUserId,
        })) || [
            {
              observation: "",
              recommendation: "",
              owner: "",
              conformity: "",
              lastUpdatedOn: new Date().toISOString(),
              updatedBy: currentUserId,
            },
          ],
      }));

      setValue("findings", transformedFindings);
      return; // Exit after populating from DB
    }

    // 3. If not in DB, check if already in form
    const existingFinding = fields.find(
      (f) =>
        f.controlId === selectedControlId && f.controlObjId === selectedObjId
    );

    if (existingFinding) {
      // Add new observation to existing finding in form
      const findingIndex = fields.findIndex(
        (f) => f.findingId === existingFinding.findingId
      );

      update(findingIndex, {
        ...existingFinding,
        observationDetails: [
          ...existingFinding.observationDetails,
          {
            observation: "",
            recommendation: "",
            owner: "",
            conformity: "",
            lastUpdatedOn: new Date().toISOString(),
            updatedBy: currentUserId,
          },
        ],
      });
    } else {
      // Create brand new finding
      append({
        findingId: v4(),
        controlId: selectedControlId,
        controlName: selectedControlLabel || "",
        controlObjId: selectedObjId,
        controlObjective: selectedObjLabel || "",
        observationDetails: [
          {
            observation: "",
            recommendation: "",
            owner: "",
            conformity: "",
            lastUpdatedOn: new Date().toISOString(),
            updatedBy: currentUserId,
          },
        ],
        status: "",
        lastUpdatedOnOverAll: new Date().toISOString(),
        updatedByOverAll: currentUserId,
      });
    }
  };
  const addObservationToFinding = (findingId: string) => {
    const findingIndex = fields.findIndex((f) => f.findingId === findingId);
    if (findingIndex === -1) return;
    const finding = fields[findingIndex];
    update(findingIndex, {
      ...finding,
      observationDetails: [
        ...finding.observationDetails,
        {
          observation: "",
          observationId: v4(),
          recommendation: "",
          owner: "",
          conformity: "",
          lastUpdatedOn: new Date().toISOString(),
          updatedBy: currentUserId,
        },
      ],
    });
  };

  const saveMeetingInfo = async (data: FormSchemaType) => {
    setLoadingOnSave(true);
    const { meetingId, auditId, selectedControls } = selectedMeetData;
    const lastUpdateOn = new Date().toISOString();

    const findingDetails = (data.findings || []).map((finding) => {
      const control = selectedControls.find(
        (c: any) => c.controlName === finding.controlName
      );
      const controlId = control?.policyId ?? "";
      const controlObj = control?.controlObj.find(
        (o: any) => o.objName === finding.controlObjective
      );
      const controlObjId = controlObj?.controlobjId ?? "";

      return {
        controlId: controlId || finding.controlId || "",
        controlName: finding.controlName,
        controlObjId: controlObjId || finding.controlObjId,
        controlObjective: finding.controlObjective,
        status: finding.status || "",
        observationDetails: finding.observationDetails,
        findingId: v4(),
        lastUpdatedOnOverAll: new Date().toISOString(),
        updatedByOverAll: currentUserId,
      };
    });

    console.log(
      "TRANSFORMED FINDINGS:",
      JSON.parse(JSON.stringify(findingDetails))
    );
    if (true) {
      // console.log("I am here manual");
      try {
        for (const finding of findingDetails) {
          // Check if instance already exists
          const mongoWhereClause = `this.Data.controlObjId == '${finding.controlObjId}' && this.Data.controlId == '${finding.controlId}'`;
          const existingInstances = await getMyInstancesV2({
            processName: "Meeting Findings",
            predefinedFilters: { taskName: "Edit Find" },
            mongoWhereClause,
          });

          if (existingInstances && existingInstances.length > 0) {
            // Update existing instance
            const taskId = existingInstances[0].taskId;
            console.log("Updating existing instance with taskId:", taskId);

            await invokeAction({
              taskId,
              transitionName: "Update Edit",
              data: {
                meetingId,
                auditId,
                ...finding,
              },
              processInstanceIdentifierField: "",
            });
          } else {
            // Create new instance
            console.log("Creating new process instance");
            const findingProcessId = await mapProcessName({
              processName: "Meeting Findings",
            });

            await startProcessV2({
              processId: findingProcessId,
              data: {
                meetingId,
                auditId,
                ...finding,
              },
              processIdentifierFields: "",
            });
          }
        }
        setOpen(false);
        router.refresh();
        setLoadingOnSave(false);
        toast.success("Saved Successfully", {
          duration: 4000, // 4 seconds
        });
      } catch (error) {
        console.error("Error starting process:", error);
        toast.error("Error in saving!", {
          duration: 4000, // 4 seconds
        });
      }
    }
  };

  function importedUploadData(data: any) {
    setUploadedFindingsData(data);
    console.log("i am here from comp2 -- ", data);
  }

  // function to set the userMap
  function importeduserMap(data: any) {
    const updatedOwnerData = data.map((user: any) => ({
      label: user.label + "(" + user.value + ")",
      value: user.userId,
    }));
    setuploadedUserMap(updatedOwnerData);
    console.log("i am here from comp2 -- ", data);
  }

  useEffect(() => {
    const fetchProfile2 = async () => {
      const profile = await getLoggedInUserProfile();
      setCurrentUserId(profile.USER_ID);
    };

    fetchProfile2();
  }, []);

  // This effect process the userId map
  const [userMap, setUserMap] = useState<{ value: string; label: string, userId: string }[]>([]);
  useEffect(() => {
    const allUserDetailMap = async () => {
      try {
        const userDetailsMap = await getUserIdWiseUserDetailsMap();
        debugger
        const userMapObj = Object.values(userDetailsMap)
          .filter((user) => user.userActive)
          .map((activeUser) => {
            return ({
              label: activeUser.userName ?? "",
              value: activeUser.userLogin ?? "",
              userId: activeUser.userId ?? "",
            })
          });
        setUserMap(userMapObj);
      } catch (error) {
        console.log(error)
      } finally {
        console.log("User details fetced successfully login id wise", userMap);
      }
    }

    allUserDetailMap();
  }, [])

  useEffect(()=>{
    importeduserMap(userMap);
  },[userMap])


  useEffect(() => {
    if (!uploadedFindingsData) return;

    const processUploadedData = async () => {
      const currentFindings = watch("findings") || [];
      const findingsMap = new Map<string, any>();

      // 1. Filter out any blank observations from existing findings first
      currentFindings.forEach((finding) => {
        const key = `${finding.controlId}_${finding.controlObjId}`;
        const filteredObservations = (finding.observationDetails || []).filter(
          (obs) => obs.observation?.trim() && obs.recommendation?.trim()
        );
        findingsMap.set(key, {
          ...finding,
          observationDetails: filteredObservations,
        });
      });
      debugger;
      // 2. Process uploaded data
      for (const control of uploadedFindingsData) {
        for (const obj of control.controlObjectives) {
          const key = `${control.policyId}_${obj.controlObjId}`;

          // Transform and filter uploaded observations (remove blanks)
          const uploadedObservations = obj.observations
            .filter(
              (obs: any) =>
                obs.observationName?.trim() && obs.recommendation?.trim()
            )
            .map((obs: any) => ({
              observationId: v4(),
              observation: obs.observationName.trim(),
              recommendation: obs.recommendation.trim(),
              owner: obs.ownerName || "",
              // (uploadedUserMap ?? []).find(
              //     (u) =>
              //       u.label.toLowerCase() ===
              //       (obs.ownerName || "").toLowerCase()
              //   )?.value || "",
              conformity: obs.nonConformityType || "Select Conformity Type",
              lastUpdatedOn: new Date().toISOString(),
              updatedBy: currentUserId,
            }));

          if (findingsMap.has(key)) {
            // Merge with existing - only add non-duplicate, non-blank observations
            const existing = findingsMap.get(key);
            const existingObservations = existing.observationDetails || [];

            const newObservations = uploadedObservations.filter(
              (uploadedObs: any) =>
                !existingObservations.some(
                  (existingObs: any) =>
                    existingObs.observation === uploadedObs.observation
                )
            );

            findingsMap.set(key, {
              ...existing,
              observationDetails: [...existingObservations, ...newObservations],
              lastUpdatedOnOverAll: new Date().toISOString(),
              updatedByOverAll: currentUserId,
            });
          } else {
            // Create new finding with filtered observations
            findingsMap.set(key, {
              findingId: v4(),
              controlId: control.policyId,
              controlName: control.controlName,
              controlObjId: obj.objId,
              controlObjective: obj.name,
              observationDetails: uploadedObservations,
              status: "",
              lastUpdatedOnOverAll: new Date().toISOString(),
              updatedByOverAll: currentUserId,
            });
          }
        }
      }


      debugger
      // 3. Final pass to remove any potential blanks
      const finalFindings = Array.from(findingsMap.values()).map((finding) => ({
        ...finding,
        observationDetails: finding.observationDetails.filter(
          (obs: any) => obs.observation?.trim() && obs.recommendation?.trim()
        ),
      }));

      setValue("findings", finalFindings);
    };

    processUploadedData();
  }, [uploadedFindingsData, setValue, userIdNameMap, currentUserId, watch]);

  // useEffect(() => {
  //   if (!uploadedFindingsData) return;

  //   const processUploadedData = async () => {
  //     // 1. Get current findings from form (including pre-populated ones)
  //     const currentFindings = watch("findings") || [];

  //     // 2. Create map for existing findings
  //     const findingsMap = new Map<string, any>();
  //     currentFindings.forEach((finding) => {
  //       const key = `${finding.controlId}_${finding.controlObjId}`;
  //       findingsMap.set(key, finding);
  //     });

  //     // 3. Process each uploaded control+objective
  //     for (const control of uploadedFindingsData) {
  //       for (const obj of control.controlObjectives) {
  //         const key = `${control.policyId}_${obj.controlObjId}`;

  //         // Check database for existing instances
  //         const mongoWhereClause = `this.Data.controlObjId == '${obj.objId}' && this.Data.controlId == '${control.policyId}'`;
  //         const existingInstances = await getMyInstancesV2({
  //           processName: "Meeting Findings",
  //           predefinedFilters: { taskName: "Edit Find" },
  //           mongoWhereClause,
  //         });

  //         // Transform uploaded observations
  //         const uploadedObservations = obj.observations.map((obs) => ({
  //           observationId: v4(),
  //           observation: obs.observationName,
  //           recommendation: obs.recommendation,
  //           owner:
  //             userIdNameMap.find((u) => u.label === obs.ownerName)?.value || "",
  //           conformity: obs.nonConformityType,
  //           lastUpdatedOn: new Date().toISOString(),
  //           updatedBy: currentUserId,
  //         }));

  //         // Case 1: Exists in both form and database
  //         if (findingsMap.has(key) && existingInstances?.length > 0) {
  //           const existing = findingsMap.get(key);
  //           findingsMap.set(key, {
  //             ...existing,
  //             observationDetails: [
  //               ...(existingInstances[0].data.observationDetails || []),
  //               ...existing.observationDetails,
  //               ...uploadedObservations,
  //             ],
  //           });
  //         }
  //         // Case 2: Exists only in database
  //         else if (existingInstances?.length > 0) {
  //           findingsMap.set(key, {
  //             ...existingInstances[0].data,
  //             observationDetails: [
  //               ...existingInstances[0].data.observationDetails,
  //               ...uploadedObservations,
  //             ],
  //           });
  //         }
  //         // Case 3: Exists only in form
  //         else if (findingsMap.has(key)) {
  //           const existing = findingsMap.get(key);
  //           findingsMap.set(key, {
  //             ...existing,
  //             observationDetails: [
  //               ...existing.observationDetails,
  //               ...uploadedObservations,
  //             ],
  //           });
  //         }
  //         // Case 4: New from upload
  //         else {
  //           findingsMap.set(key, {
  //             findingId: v4(),
  //             controlId: control.policyId,
  //             controlName: control.controlName,
  //             controlObjId: obj.objId,
  //             controlObjective: obj.name,
  //             observationDetails: uploadedObservations,
  //             status: "",
  //             lastUpdatedOnOverAll: new Date().toISOString(),
  //             updatedByOverAll: currentUserId,
  //           });
  //         }
  //       }
  //     }

  //     // 4. Update form with merged data
  //     setValue("findings", Array.from(findingsMap.values()));
  //   };

  //   processUploadedData();
  // }, [uploadedFindingsData, setValue, userIdNameMap, currentUserId, watch]);
  // useEffect(() => {
  //   if (uploadedFindingsData) {
  //     const groupedFindings: Record<string, any> = {};

  //     uploadedFindingsData.forEach((control) => {
  //       control.controlObjectives.forEach((obj) => {
  //         const key = `${control.controlName}-${obj.name}`;
  //         if (!groupedFindings[key]) {
  //           groupedFindings[key] = {
  //             findingId: v4(),
  //             controlObjId: obj.controlObjId,
  //             controlId: control.policyId,
  //             controlName: control.controlName,
  //             controlObjective: obj.name,
  //             observationDetails: [],
  //             status: "",
  //           };
  //         }

  //         obj.observations.forEach((obs) => {
  //           const ownerValue =
  //             userIdNameMap.find((u) => u.label === obs.ownerName)?.value || "";

  //           groupedFindings[key].observationDetails.push({
  //             observation: obs.observationName,
  //             recommendation: obs.recommendation,
  //             owner: ownerValue,
  //             conformity: obs.nonConformityType,
  //             lastUpdatedOn: new Date().toISOString(),
  //             updatedBy: currentUserId,
  //           });
  //         });
  //       });
  //     });

  //     const transformedFindings = Object.values(groupedFindings);
  //     setValue("findings", transformedFindings);
  //   }
  // }, [uploadedFindingsData, setValue, userIdNameMap]);
  const handleInputMethodChange = (method: "manual" | "upload") => {
    if (method === "upload") {
      setAccordionValue([]);
    }
    setInputMethod(method);
  };
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    // Reset form when opening
    reset(defaultValues);

    // Automatically populate all control-objective combinations
    const populateFindings = async () => {
      const allFindings = [];

      for (const control of selectedMeetData?.selectedControls || []) {
        for (const objective of control.controlObj || []) {
          // Check if exists in database
          const matchedInstance = await fetchFindingsMatchedInstance(
            control.policyId.toString(),
            objective.objId.toString()
          );

          if (matchedInstance && matchedInstance?.length > 0) {
            // Add existing findings from DB
            allFindings.push(
              ...matchedInstance.map((finding) => ({
                ...finding,
                observationDetails: finding.observationDetails?.map(
                  (obs: ObservationDetail) => ({
                    ...obs,
                    lastUpdatedOn:
                      obs.lastUpdatedOn || new Date().toISOString(),
                    updatedBy: obs.updatedBy || currentUserId,
                  })
                ) || [
                    {
                      observationId: "",
                      observation: "",
                      recommendation: "",
                      owner: "",
                      conformity: "",
                      lastUpdatedOn: new Date().toISOString(),
                      updatedBy: currentUserId,
                    },
                  ],
              }))
            );
          } else {
            // Add blank finding if none exists
            allFindings.push({
              findingId: v4(),
              controlId: control.policyId.toString(),
              controlName: control.controlName,
              controlObjId: objective.objId.toString(),
              controlObjective: objective.objName,
              observationDetails: [
                {
                  observation: "",
                  observationId: "",
                  recommendation: "",
                  owner: "",
                  conformity: "",
                  lastUpdatedOn: new Date().toISOString(),
                  updatedBy: currentUserId,
                },
              ],
              status: "",
              lastUpdatedOnOverAll: new Date().toISOString(),
              updatedByOverAll: currentUserId,
            });
          }
        }
      }

      setValue("findings", allFindings);
      console.log("findings ankit print----", allFindings);
      setFieldsForExcel(allFindings);
      setLoading(false);
    };

    populateFindings();
  }, [open, reset, selectedMeetData?.selectedControls, currentUserId]);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="max-w-[80%] max-h-[100vh] overflow-hidden"
        >
          <DialogHeader>
            <DialogTitle>Findings Review Meeting</DialogTitle>
          </DialogHeader>
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex flex-wrap text-md">
                <div className="min-w-[380px]">
                  <span className="font-semibold">Meeting Title:</span>{" "}
                  {selectedMeetData?.meetingTitle ?? "No title"}
                </div>
                <div className="min-w-[350px]">
                  <span className="font-semibold">Meeting Date:</span>{" "}
                  {selectedMeetData?.startDate
                    ? format(
                      new Date(selectedMeetData.startDate),
                      SAVE_DATE_FORMAT_GRC
                    )
                    : "N/A"}
                </div>
                <div className="min-w-[350px]">
                  <span className="font-semibold">Meeting Mode:</span>{" "}
                  {selectedMeetData?.meetingMode ?? "N/A"}
                </div>
                <div className="min-w-[350px]">
                  <span className="font-semibold">Start Time:</span>{" "}
                  {selectedMeetData?.startTime ?? "N/A"}
                </div>
              </div>
              <div className="text-sm">
                <span className="font-semibold">Participants:</span>{" "}
                {(selectedMeetData?.meetingParticipants || [])
                  .map((participantId: string) => {
                    const user = userIdNameMap.find(
                      (u) => u.value === participantId
                    );
                    return user?.label ?? participantId;
                  })
                  .join(", ") || "N/A"}
              </div>
            </CardContent>
          </Card>
          <div className="mb-4 space-y-2">
            <Label>Input Method</Label>
            <ToggleGroup
              type="single"
              value={inputMethod}
              onValueChange={handleInputMethodChange}
              className="grid grid-cols-2"
            >
              <ToggleGroupItem
                value="manual"
                className="data-[state=on]:bg-primary data-[state=on]:text-white"
              >
                Manual Entry
              </ToggleGroupItem>
              <ToggleGroupItem
                value="upload"
                className="data-[state=on]:bg-primary data-[state=on]:text-white"
              >
                File Upload
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={handleSubmit(saveMeetingInfo)}
            >
              {inputMethod === "manual" ? (
                <>
                  <div className="grid grid-cols-12 gap-3"></div>
                </>
              ) : (
                <div className="border rounded-lg p-4">
                  <UploadComponent
                    importedUploadData={importedUploadData}
                    importeduserMap={importeduserMap}
                    setAccordionValue={setAccordionValue}
                    loading={loading}
                  />
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center">
                  <Loader2Icon className="animate-spin" />
                </div>
              ) : (
                <ScrollArea className="max-h-[500px] pr-2 overflow-y-auto">
                  <Accordion
                    type="multiple"
                    className="pr-2 pt-2"
                    value={accordionValue}
                    onValueChange={setAccordionValue}
                  >
                    {fields.map((finding, index) => (
                      <AccordionItem
                        value={finding.findingId}
                        key={finding.findingId}
                        className="shadow-sm border rounded-xl border-l-4 border-primary p-3 m-2"
                      // disabled={lockAccordions}
                      >
                        <AccordionTrigger className="flex flex-wrap items-center gap-4 py-2 w-full">
                          <div className="flex gap-2">
                            <div className="flex items-center gap-1">
                              <ListChecks className="h-4 w-4 text-white" />
                              <span className="font-bold text-white">
                                Policy :
                              </span>
                              <span className="text-blue-400 no-underline hover:no-underline">
                                {finding.controlName}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <Tags className="h-4 w-4 text-white" />
                              <span className="font-bold text-white">
                                Objective :
                              </span>
                              <span className="text-blue-400 no-underline hover:no-underline">
                                {finding.controlObjective}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="space-y-4">
                          {finding.observationDetails.map(
                            (obsDetail, obsIndex) => (
                              <div
                                key={obsIndex}
                                className="space-y-4 p-4 border rounded-lg"
                              >
                                <FormTextarea
                                  formControl={control}
                                  name={`findings.${index}.observationDetails.${obsIndex}.observation`}
                                  placeholder={`Observation ${obsIndex + 1}`}
                                  // label={`Observation ${obsIndex + 1}`}
                                  label={
                                    <div className="flex items-center gap-2">
                                      Observation {obsIndex + 1}
                                      <HoverBorderGradient
                                        duration={1.2}
                                        clockwise
                                        className="flex items-center gap-2"
                                      >
                                        <button
                                          type="button"
                                          title="Rephrase the sentence"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation(); // Prevent event bubbling
                                            const currentValue = getValues(
                                              `findings.${index}.observationDetails.${obsIndex}.observation`
                                            );

                                            if (!currentValue?.trim()) {
                                              toast.warning(
                                                "Please enter text before rephrasing",
                                                { duration: 4000 }
                                              );
                                              return;
                                            }
                                            setObservationForAI(currentValue);
                                            openRephrase(
                                              finding.controlName,
                                              finding.controlObjective,
                                              currentValue,
                                              index,
                                              obsIndex,
                                              "observation"
                                            );
                                          }}
                                          className="cursor-pointer flex items-center gap-1 text-sm text-white bg-black rounded-full focus:outline-none"
                                        >
                                          <SparklesIcon className="w-4 h-4 text-yellow-300" />
                                          <span className="text-white">AI</span>
                                        </button>
                                      </HoverBorderGradient>
                                    </div>
                                  }
                                />

                                <FormTextarea
                                  formControl={control}
                                  name={`findings.${index}.observationDetails.${obsIndex}.recommendation`}
                                  placeholder={`Recommendation ${obsIndex + 1}`}
                                  // label={`Recommendation ${obsIndex + 1}`}
                                  label={
                                    <div className="flex items-center gap-2">
                                      Recommendation {obsIndex + 1}
                                      <HoverBorderGradient
                                        duration={1.2}
                                        clockwise
                                        className="flex items-center gap-2"
                                      >
                                        <button
                                          type="button"
                                          title="Rephrase the sentence"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation(); // Prevent event bubbling
                                            const currentValue = getValues(
                                              `findings.${index}.observationDetails.${obsIndex}.recommendation`
                                            );
                                            if (!currentValue?.trim()) {
                                              toast.warning(
                                                "Please enter text before rephrasing",
                                                { duration: 4000 }
                                              );
                                              return;
                                            }
                                            openRephrase(
                                              finding.controlName,
                                              finding.controlObjective,
                                              currentValue,
                                              index,
                                              obsIndex,
                                              "recommendation"
                                            );
                                          }}
                                          className="cursor-pointer flex items-center gap-1 text-sm text-white bg-black rounded-full focus:outline-none"
                                        >
                                          <SparklesIcon className="w-4 h-4 text-yellow-500" />
                                          <span className="text-white">AI</span>
                                        </button>
                                      </HoverBorderGradient>
                                    </div>
                                  }
                                />

                                <div className="grid grid-cols-2 gap-3">
                                  <FormComboboxInput
                                    items={uploadedUserMap || []}
                                    formControl={control}
                                    name={`findings.${index}.observationDetails.${obsIndex}.owner`}
                                    placeholder="Select Owner"
                                    label="Owner"
                                  />
                                  <FormComboboxInput
                                    items={conformityData}
                                    formControl={control}
                                    name={`findings.${index}.observationDetails.${obsIndex}.conformity`}
                                    placeholder="Select Conformity Type"
                                    label="Conformity Type"
                                  />
                                </div>
                              </div>
                            )
                          )}
                          <Button
                            type="button"
                            className="mt-2"
                            onClick={() =>
                              addObservationToFinding(finding.findingId)
                            }
                          >
                            + Add Observation
                          </Button>

                          <div className="mt-4">
                            <FormComboboxInput
                              items={statusData}
                              formControl={control}
                              name={`findings.${index}.status`}
                              placeholder="Select Status"
                              label="Status"
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </ScrollArea>
              )}
              <DialogFooter>
                <ExcelGenerator
                  allFindings={fieldsForExcel || []}
                  loading={loading}
                  frameworkName={auditData[0].policyName}
                  userIdNameMap={userIdNameMap}
                />
                <Button disabled={loadingOnSave} className="ml-2">
                  {" "}
                  {loadingOnSave ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <Save />
                  )}
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <RephraseModal
        open={openModal}
        onOpenChange={(val) => setOpenModal(val)}
        value={currentText}
        policyForAI={policyForAI}
        objectiveForAI={objectiveForAI}
        typeOfField={typeOfField}
        observationForAI={observationForAI}
        onSubmit={handleSubmitRephrased}
      />
      {/* <GuidelinesModal
        open={openModal}
        onOpenChange={(val) => setOpenModal(val)}
        value={currentText}
        policyForAI={policyForAI}
        objectiveForAI={objectiveForAI}
        typeOfField={typeOfField}
        observationForAI={observationForAI}
        onSubmit={handleSubmitRephrased}
      /> */}
    </>
  );
}
