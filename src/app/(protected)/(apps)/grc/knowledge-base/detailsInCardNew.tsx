"use client";

import { useEffect, useState } from "react";
import PlanCreationUI from "./PlanCreationUI";
import { getControlObjData } from "./page2";

export default function KnowledgeCards2() {
  const [controlObjDatas, setControlObjDatas] = useState();
  useEffect(() => {
    async function solve() {
      const controlObjDatas = await getControlObjData();
      setControlObjDatas(controlObjDatas);
    }
    solve();
  }, []);
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

  return (
    <PlanCreationUI filteredData={filteredData} controlData={controlObjDatas} />
  );
}
