"use client";
import React, { createContext, useContext, useState } from "react";

export type Objective = {
  objectiveSource: "existing" | "custom";
  existingObjective: string;
  objectiveName: string;
  objectiveWeight: string;
  objectiveType: string;
  objectiveIndex: string;
  objectivePracticeArea: string;
  objectiveDescription: string;
};

export type ControlForm = {
  indexName: string;
  controlName: string;
  controlWeight: string;
  controlSource: "existing" | "custom";
  customeControlName: string;
  objectives: Objective[];
};
interface PolicyControl {
  indexName: string;
  controlSource: string;
  controlObjectives: Objective[];
  newControlName: string;
  controlWeight: string;
  isEditingName: boolean;
  existingControlName: string;
  policyId: string;
}

type KBContextProps = {
  lockedWeights: Record<number, Record<number, boolean>>;
  setLockedWeights: React.Dispatch<
    React.SetStateAction<Record<number, Record<number, boolean>>>
  >;
  lockedControlWeights: Record<number, Record<number, boolean>>;
  setLockedControlWeights: React.Dispatch<
    React.SetStateAction<Record<number, Record<number, boolean>>>
  >;
  selectedControlsObj: Record<string, Objective[]> | null;
  setSelectedControlsObj: React.Dispatch<
    React.SetStateAction<Record<string, Objective[]> | null>
  >;
  practiceArea: string[] | null;
  setPracticeArea: React.Dispatch<React.SetStateAction<string[] | null>>;

  objTypes: string[] | null;
  setObjTypes: React.Dispatch<React.SetStateAction<string[] | null>>;

  addExistingControl: ControlForm[] | null;
  setaddExistingControl: React.Dispatch<
    React.SetStateAction<ControlForm[] | null>
  >;

  existingPolicyForm: boolean;
  setExistingPolicyForm: React.Dispatch<React.SetStateAction<boolean>>;

  userMap: any | null;
  setUserMap: React.Dispatch<React.SetStateAction<any | null>>;

  policyControls: PolicyControl[];
  setPolicyControls: React.Dispatch<React.SetStateAction<PolicyControl[]>>;
};
export const KBContext = createContext<KBContextProps | null>(null);

export default function KBContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lockedWeights, setLockedWeights] = useState<
    Record<number, Record<number, boolean>>
  >({});
  const [lockedControlWeights, setLockedControlWeights] = useState<
    Record<number, Record<number, boolean>>
  >({});
  const [selectedControlsObj, setSelectedControlsObj] = useState<Record<
    string,
    Objective[]
  > | null>(null);
  const [practiceArea, setPracticeArea] = useState<string[] | null>(null);
  const [objTypes, setObjTypes] = useState<string[] | null>(null);
  const [addExistingControl, setaddExistingControl] = useState<
    ControlForm[] | null
  >(null);
  const [existingPolicyForm, setExistingPolicyForm] = useState<boolean>(false);

  const [userMap, setUserMap] = useState<any | null>(null);

  const [policyControls, setPolicyControls] = useState<PolicyControl[]>([]);
  return (
    <KBContext.Provider
      value={{
        lockedWeights,
        setLockedWeights,
        lockedControlWeights,
        setLockedControlWeights,
        selectedControlsObj,
        setSelectedControlsObj,
        practiceArea,
        setPracticeArea,
        objTypes,
        setObjTypes,
        addExistingControl,
        setaddExistingControl,
        existingPolicyForm,
        setExistingPolicyForm,
        userMap,
        setUserMap,
        policyControls,
        setPolicyControls,
      }}
    >
      {children}
    </KBContext.Provider>
  );
}

export function useKBContext() {
  const context = useContext(KBContext);
  if (!context) {
    throw new Error("useLockContext must be used within a LockContextProvider");
  }
  return context;
}
