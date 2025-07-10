// "use client";
// import { useEffect, useState } from "react";
// import { Button } from "@/shadcn/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
// import { Checkbox } from "@/shadcn/ui/checkbox";
// import ControlDetailsTable from "./controlDetailsTable";
// import UploadComponent from "../knowledge-new/component/UploadComponent/page";
// import { useKBContext } from "./components/knowledgeBaseContext";

// type FilteredItem = {
//   policyName: string;
//   practiceAreas: string;
//   controlObjType: string;
// };

// export default function KnowledgeCards({ filteredData, controlData }: { filteredData: FilteredItem[]; controlData: any[] }) {
//   const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
//   const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
//   const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
//   const [tableData, setTableData] = useState<any[]>([]);

//   const {setPracticeArea,setObjTypes} = useKBContext()

//   useEffect(() => {
//     const uniquePracticeAreas = Array.from(
//       new Set(filteredData.map((item) => item.practiceAreas))
//     );
//     const uniqueControlObjTypes = Array.from(
//       new Set(filteredData.map((item) => item.controlObjType))
//     );
//     setPracticeArea(uniquePracticeAreas);
//     setObjTypes(uniqueControlObjTypes);
//   }, [])

//   const uniquePolicyNames = Array.from(
//     new Set(filteredData.map((item) => item.policyName))
//   );
//   const uniquePracticeAreas = Array.from(
//     new Set(filteredData.map((item) => item.practiceAreas))
//   );
//   const uniqueControlObjTypes = Array.from(
//     new Set(filteredData.map((item) => item.controlObjType))
//   );

//   const handleCheckboxChange = (
//     value: string,
//     state: string[],
//     setState: (s: string[]) => void
//   ) => {
//     setState(
//       state.includes(value)
//         ? state.filter((v) => v !== value)
//         : [...state, value]
//     );
//   };

//   const handleFilter = () => {
//     const result = controlData.flatMap((policy) => {
//       if (
//         selectedPolicies.length > 0 &&
//         !selectedPolicies.includes(policy.policyName)
//       ) {
//         return [];
//       }

//       return policy.controls.flatMap((control: any) => {
//         return control.controlObjectives
//           .filter((obj: any) => {
//             const areaMatch =
//               selectedAreas.length === 0 ||
//               selectedAreas.includes(obj.practiceAreas);
//             const typeMatch =
//               selectedTypes.length === 0 ||
//               selectedTypes.includes(obj.controlObjType);

//             return areaMatch && typeMatch;
//           })
//           .map((obj: any) => {
//             // Get all policyNames where same controlName + obj.name exist
//             const allMatchedPolicies = controlData
//               .filter((p) =>
//                 p.controls.some(
//                   (c: any) =>
//                     c.controlName === control.controlName &&
//                     c.controlObjectives.some((o: any) => o.name === obj.name)
//                 )
//               )
//               .map((p) => p.policyName);

//             const crossReference = Array.from(new Set(allMatchedPolicies)).join(
//               ", "
//             );

//             return {
//               policyName: policy.policyName,
//               framework: policy.framework,
//               frameworkId: policy.frameworkId,
//               policyId: control.policyId,
//               controlName: control.controlName,
//               name: obj.name,
//               description: obj.description,
//               controlWeight: control.controlWeight,
//               controlObjWeight: obj.controlObjweight,
//               practiceAreas: obj.practiceAreas,
//               controlObjType: obj.controlObjType,
//               controlObjId: obj.controlObjId,
//               crossReference,
//             };
//           });
//       });
//     });

//     setTableData(result);
//   };

//   return (
//     <>
//       <UploadComponent />
//       <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
//         {/* Rules & Standards */}
//         <Card className="h-[150px]">
//           <CardHeader className="pb-2 border-b">
//             <CardTitle className="text-sm font-medium">
//               Rules & Standards
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="h-[100px] overflow-y-auto flex flex-col pt-2">
//             {/* Select All Checkbox */}
//             {/* sticky top-0 z-10 */}
//             <div className="flex items-center gap-2 mb-1">
//               <Checkbox
//                 id="policy-all"
//                 checked={selectedPolicies.length === uniquePolicyNames.length}
//                 onCheckedChange={() =>
//                   setSelectedPolicies(
//                     selectedPolicies.length === uniquePolicyNames.length
//                       ? []
//                       : uniquePolicyNames
//                   )
//                 }
//               />
//               <label htmlFor="policy-all" className="text-sm font-semibold">
//                 Select All
//               </label>
//             </div>

//             {uniquePolicyNames.map((name, idx) => (
//               <div key={idx} className="flex items-center gap-2">
//                 <Checkbox
//                   id={`policy-${idx}`}
//                   checked={selectedPolicies.includes(name)}
//                   onCheckedChange={() =>
//                     handleCheckboxChange(
//                       name,
//                       selectedPolicies,
//                       setSelectedPolicies
//                     )
//                   }
//                 />
//                 <label htmlFor={`policy-${idx}`} className="text-sm">
//                   {name}
//                 </label>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* Practice Areas */}
//         <Card className="h-[150px]">
//           <CardHeader className="pb-2 border-b">
//             <CardTitle className="text-sm font-medium">
//               Practice Areas
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="h-[100px] overflow-y-auto flex flex-col pt-2">
//             <div className="flex items-center gap-2 mb-1">
//               <Checkbox
//                 id="areas-all"
//                 checked={selectedAreas.length === uniquePracticeAreas.length}
//                 onCheckedChange={() =>
//                   setSelectedAreas(
//                     selectedAreas.length === uniquePracticeAreas.length
//                       ? []
//                       : uniquePracticeAreas
//                   )
//                 }
//               />
//               <label htmlFor="areas-all" className="text-sm font-semibold">
//                 Select All
//               </label>
//             </div>

//             {uniquePracticeAreas.map((area, idx) => (
//               <div key={idx} className="flex items-center gap-2">
//                 <Checkbox
//                   id={`area-${idx}`}
//                   checked={selectedAreas.includes(area)}
//                   onCheckedChange={() =>
//                     handleCheckboxChange(area, selectedAreas, setSelectedAreas)
//                   }
//                 />
//                 <label htmlFor={`area-${idx}`} className="text-sm">
//                   {area}
//                 </label>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* Procedural Types */}
//         <Card className="h-[150px]">
//           <CardHeader className="pb-2 border-b">
//             <CardTitle className="text-sm font-medium">
//               Procedural Types
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="h-[100px] overflow-y-auto flex flex-col pt-2">
//             <div className="flex items-center gap-2 mb-1">
//               <Checkbox
//                 id="types-all"
//                 checked={selectedTypes.length === uniqueControlObjTypes.length}
//                 onCheckedChange={() =>
//                   setSelectedTypes(
//                     selectedTypes.length === uniqueControlObjTypes.length
//                       ? []
//                       : uniqueControlObjTypes
//                   )
//                 }
//               />
//               <label htmlFor="types-all" className="text-sm font-semibold">
//                 Select All
//               </label>
//             </div>

//             {uniqueControlObjTypes.map((type, idx) => (
//               <div key={idx} className="flex items-center gap-2">
//                 <Checkbox
//                   id={`type-${idx}`}
//                   checked={selectedTypes.includes(type)}
//                   onCheckedChange={() =>
//                     handleCheckboxChange(type, selectedTypes, setSelectedTypes)
//                   }
//                 />
//                 <label htmlFor={`type-${idx}`} className="text-sm capitalize">
//                   {type}
//                 </label>
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       </div>

//       <div className="flex justify-end">
//         <Button onClick={handleFilter}>Filter</Button>
//       </div>

//       <ControlDetailsTable tableData={tableData || []} />
//     </>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Checkbox } from "@/shadcn/ui/checkbox";
import ControlDetailsTable from "./controlDetailsTable";

type FilteredItem = {
  policyName: string;
  practiceAreas: string;
  controlObjType: string;
};

export default function KnowledgeCards({ filteredData, controlData }: { filteredData: FilteredItem[]; controlData: any[] }) {
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  console.log(filteredData);

  const uniquePolicyNames = Array.from(
    new Set(filteredData.map((item) => item.policyName))
  );
  const uniquePracticeAreas = Array.from(
    new Set(filteredData.map((item) => item.practiceAreas))
  );
  const uniqueControlObjTypes = Array.from(
    new Set(filteredData.map((item) => item.controlObjType))
  );

  const handleCheckboxChange = (
    value: string,
    state: string[],
    setState: (s: string[]) => void
  ) => {
    setState(
      state.includes(value)
        ? state.filter((v) => v !== value)
        : [...state, value]
    );
  };

  const handleFilter = () => {
    const result = controlData.flatMap((policy) => {
      if ( selectedPolicies.length > 0 && !selectedPolicies.includes(policy.policyName) ) {
        return [];
      }

      return policy.controls.flatMap((control: any) => {
        return control.controlObjectives
          .filter((obj: any) => {
            const areaMatch =
              selectedAreas.length === 0 ||
              selectedAreas.includes(obj.practiceAreas);
            const typeMatch =
              selectedTypes.length === 0 ||
              selectedTypes.includes(obj.controlObjType);

            return areaMatch && typeMatch;
          })
          .map((obj: any) => {
            const allMatchedPolicies = controlData
              .filter((p) =>
                p.controls.some(
                  (c: any) =>
                    c.controlName === control.controlName &&
                    c.controlObjectives.some((o: any) => o.name === obj.name)
                )
              )
              .map((p) => p.policyName);

            const crossReference = Array.from(new Set(allMatchedPolicies)).join(", ");

            return {
              policyName: policy.policyName,
              framework: policy.framework,
              frameworkId: policy.frameworkId,
              policyId: control.policyId,
              controlName: control.controlName,
              name: obj.name,
              description: obj.description,
              controlWeight: control.controlWeight,
              controlObjWeight: obj.controlObjweight,
              practiceAreas: obj.practiceAreas,
              controlObjType: obj.controlObjType,
              controlObjId: obj.controlObjId,
              crossReference,
            };
          });
      });
    });

    setTableData(result);
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {/* Rules & Standards */}
        <Card className="h-[150px]">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-sm font-medium">
              Rules & Standards
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[100px] overflow-y-auto flex flex-col pt-2">
            {/* sticky top-0 z-10 */}
            <div className="flex items-center gap-2 mb-1">
              <Checkbox
                id="policy-all"
                checked={selectedPolicies.length === uniquePolicyNames.length}
                onCheckedChange={() =>
                  setSelectedPolicies(
                    selectedPolicies.length === uniquePolicyNames.length
                      ? []
                      : uniquePolicyNames
                  )
                }
              />
              <label htmlFor="policy-all" className="text-sm font-semibold">
                Select All
              </label>
            </div>

            {uniquePolicyNames.map((name, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Checkbox
                  id={`policy-${idx}`}
                  checked={selectedPolicies.includes(name)}
                  onCheckedChange={() =>
                    handleCheckboxChange(
                      name,
                      selectedPolicies,
                      setSelectedPolicies
                    )
                  }
                />
                <label htmlFor={`policy-${idx}`} className="text-sm">
                  {name}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Practice Areas */}
        <Card className="h-[150px]">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-sm font-medium">
              Practice Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[100px] overflow-y-auto flex flex-col pt-2">
            <div className="flex items-center gap-2 mb-1">
              <Checkbox
                id="areas-all"
                checked={selectedAreas.length === uniquePracticeAreas.length}
                onCheckedChange={() =>
                  setSelectedAreas(
                    selectedAreas.length === uniquePracticeAreas.length
                      ? []
                      : uniquePracticeAreas
                  )
                }
              />
              <label htmlFor="areas-all" className="text-sm font-semibold">
                Select All
              </label>
            </div>

            {uniquePracticeAreas.map((area, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Checkbox
                  id={`area-${idx}`}
                  checked={selectedAreas.includes(area)}
                  onCheckedChange={() =>
                    handleCheckboxChange(area, selectedAreas, setSelectedAreas)
                  }
                />
                <label htmlFor={`area-${idx}`} className="text-sm">
                  {area}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Procedural Types */}
        <Card className="h-[150px]">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-sm font-medium">
              Procedural Types
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[100px] overflow-y-auto flex flex-col pt-2">
            <div className="flex items-center gap-2 mb-1">
              <Checkbox
                id="types-all"
                checked={selectedTypes.length === uniqueControlObjTypes.length}
                onCheckedChange={() =>
                  setSelectedTypes(
                    selectedTypes.length === uniqueControlObjTypes.length
                      ? []
                      : uniqueControlObjTypes
                  )
                }
              />
              <label htmlFor="types-all" className="text-sm font-semibold">
                Select All
              </label>
            </div>

            {uniqueControlObjTypes.map((type, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Checkbox
                  id={`type-${idx}`}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() =>
                    handleCheckboxChange(type, selectedTypes, setSelectedTypes)
                  }
                />
                <label htmlFor={`type-${idx}`} className="text-sm capitalize">
                  {type}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleFilter}>Apply</Button>
      </div>
      <ControlDetailsTable tableData={tableData || []} />

    </>
  );
}
