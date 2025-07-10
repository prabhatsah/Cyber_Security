// import React from "react";
// import KnowledgeCards from "./components/detailsInCard";
// import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
// import UploadComponent from "../knowledge-new/component/UploadComponent/page";
// import KBContextProvider from "./components/knowledgeBaseContext";

// const controlObjData = [
//   {
//     policyName: "ISO 27001",
//     framework: "standard",
//     frameworkId: "f82ecb07-adbe-4c30-8b0e-fe2d42897cd3",
//     controls: [
//       {
//         controlName: "Organizational controls",
//         controlId: "749f33bc-1cad-448e-944c-5df92c5be111",
//         controlWeight: 50,
//         controlObjectives: [
//           {
//             name: "Policies for information security",
//             description:
//               "Information security policy and topic-specific policies shall be de\u0002fined, approved by management, published, communicated to and  acknowledged by relevant personnel and relevant interested parties,  and reviewed at planned intervals and if significant changes occur.",
//             controlObjWeight: 50,
//             controlObjType: "Managerial",
//             practiceAreas: "LR",
//           },
//           {
//             name: "Information security roles and  responsibilities",
//             description:
//               "Information security roles and responsibilities shall be defined and  allocated according to the organization needs.",
//             controlObjWeight: 50,
//             controlObjType: "Operational",
//             practiceAreas: "QR",
//           },
//         ],
//       },
//       {
//         controlName: "People controls",
//         controlId: "70434f00-e49c-4d08-8608-40b7e00a8f50",
//         controlWeight: 50,
//         controlObjectives: [
//           {
//             name: "Screening",
//             description:
//               "Background verification checks on all candidates to become personnel  shall be carried out prior to joining the organization and on an ongoing  basis taking into consideration applicable laws, regulations and ethics  and be proportional to the business requirements, the classification of  the information to be accessed and the perceived risks.",
//             controlObjWeight: 50,
//             controlObjType: "Managerial",
//             practiceAreas: "HR",
//           },
//           {
//             name: "Terms and conditions of em\u0002ployment",
//             description:
//               "The employment contractual agreements shall state the personnel’s and  the organization’s responsibilities for information security.",
//             controlObjWeight: 50,
//             controlObjType: "Technical",
//             practiceAreas: "DR",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     policyName: "ISO 9001",
//     framework: "standard",
//     frameworkId: "k09ecb07-gfbe-4c30-8b0e-fe2d42892vcs",
//     controls: [
//       {
//         controlName: "Organizational controls",
//         controlId: "632nb3bc-1cad-448e-944c-5df92c5be222",
//         controlWeight: 50,
//         controlObjectives: [
//           {
//             name: "Policies for information security",
//             description:
//               "Information security policy and topic-specific policies shall be de\u0002fined, approved by management, published, communicated to and  acknowledged by relevant personnel and relevant interested parties,  and reviewed at planned intervals and if significant changes occur.",
//             controlObjWeight: 50,
//             controlObjType: "Operational",
//             practiceAreas: "QR"
//           },
//         ],
//       },
//       {
//         controlName: "People controls",
//         controlId: "70434f00-e49c-4d08-8608-40b7e00a8f50",
//         controlWeight: 50,
//         controlObjectives: [
//           {
//             name: "Screening",
//             description:
//               "Background verification checks on all candidates to become personnel  shall be carried out prior to joining the organization and on an ongoing  basis taking into consideration applicable laws, regulations and ethics  and be proportional to the business requirements, the classification of  the information to be accessed and the perceived risks.",
//             controlObjWeight: 50,
//             controlObjType: "Managerial",
//             practiceAreas: "HR",
//           },
//           {
//             name: "Terms and conditions of em\u0002ployment",
//             description:
//               "The employment contractual agreements shall state the personnel’s and  the organization’s responsibilities for information security.",
//             controlObjWeight: 50,
//             controlObjType: "Technical",
//             practiceAreas: "DR",
//           },
//         ],
//       },
//     ],
//   },
// ];

// export default async function KnowledgeBase() {
//   const controlObjDatas = await getControlObjData();
//   console.log("controlObjDatas ------------ ", controlObjDatas);

//   const filteredData = controlObjDatas.flatMap((policy: any) => {
//     return policy.controls.flatMap((control: any) => {
//       return control.controlObjectives.map((obj: any) => ({
//         policyName: policy.policyName,
//         practiceAreas: obj.practiceAreas,
//         controlObjType: obj.controlObjType,
//       }));
//     });
//   });

//   return (
//     <>
//       <div className="flex flex-col gap-3">
//         <KBContextProvider>
//           <KnowledgeCards
//             filteredData={filteredData}
//             controlData={controlObjDatas}
//           />
//         </KBContextProvider>
//       </div>
//     </>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import { fetchControlObjectiveData } from "../knowledge-new/component/UploadComponent/(backend-calls)";

import KBContextProvider from "./components/knowledgeBaseContext";
import KnowledgeBaseTable from "./components/knowledgeBaseTable";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
// import KBContextProvider from "./components/knowledgeBaseContext";

export default function KnowledgeBaseNew() {
  const [data, setData] = useState([]);

  async function getControlWithObjectivesData() {
    const data = await fetchControlObjectiveData();
    console.log("data from new overview table ----", data);
    setData(data);
  }

  useEffect(() => {
    getControlWithObjectivesData();
  }, []);
  return (
    <>
      <div className="flex flex-col gap-3">
        <KBContextProvider>
          <KnowledgeBaseTable tableData={data} />
        </KBContextProvider>
      </div>
    </>
  );
}

export async function getControlObjData() {
  const controlObjInstances = await getMyInstancesV2({
    processName: "Control Objectives",
    predefinedFilters: { taskName: "view control objecitve" },
  });

  console.log(controlObjInstances);
  const controlObjDatas = controlObjInstances.length
    ? controlObjInstances.map((controlObjInstance) => controlObjInstance.data)
    : [];
  return controlObjDatas;
}
