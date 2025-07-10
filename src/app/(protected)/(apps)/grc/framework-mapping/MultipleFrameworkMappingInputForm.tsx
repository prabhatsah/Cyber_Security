'use client';

import React, { useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import MultipleFrameworkMappingForm from "./MultipleFrameworkMappingForm";
import MultipleFrameworkMappingDataTable from "./MultipleFrameworkMappingInputDataTable";
import { Plus } from "lucide-react";
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";

export default function MultipleFrameworkMappingInputForm({
    frameworksData,
    onSaveMappings,
    isOpen, // Controlled from parent
    setIsOpen, // Function to close modal from parent
    frameworkMappingData
}: {
    frameworksData: Record<string, any>[];
    onSaveMappings: (data: Record<string, any>[]) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    frameworkMappingData: Record<string, any>[];
}) {
    const [mappingData, setMappingData] = useState<Record<string, any>[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editMapping, setEditMapping] = useState<Record<string, any> | null>(null);

    // Handle saving a mapping (new or edited)
    const handleSaveMapping = (data: Record<string, any>) => {
        setMappingData((prev) =>
            prev.some((mapping) => mapping.id === data.id)
                ? prev.map((mapping) => (mapping.id === data.id ? data : mapping))
                : [...prev, data]
        );
        setIsFormVisible(false);
        setEditMapping(null);
    };

    // Handle "Edit" button click in the table
    const handleEditMapping = (mapping: Record<string, any>) => {
        setEditMapping(mapping);
        setIsFormVisible(true);
    };

    // Handle deleting a mapping
    const handleDeleteMapping = (id: string) => {
        setMappingData((prev) => prev.filter((mapping) => mapping.id !== id));
    };

    // Handle saving all mappings and closing the dialog
    // const handleSaveAllMappings = () => {
    //     console.log("Saving all mappings: ^^^^^^^^^^^^^^ ============== >", mappingData);

    //     const resultMap = {};

    //     mappingData.forEach(item => {
    //         const ids = [item.frameworkId1, item.frameworkId2].sort();
    //         const key = `${ids[0]}_${ids[1]}`;

    //         if (!resultMap[key]) {
    //             resultMap[key] = {
    //                 id: key,
    //                 mapping: []
    //             };
    //         }

    //         resultMap[key].mapping.push(item);
    //     });

    //     const result = Object.values(resultMap);

    //     console.log("new data gets generated please have a look at this -======--------=-=-=-=-=-=-=-=>>")
    //     console.log(result);
    //     onSaveMappings(mappingData); // Pass data to parent component
    //     setIsOpen(false); // Close modal from parent


    //     const frameworkMappingProcessId = await mapProcessName({ processName: "Framework Mapping" });

    //     await Promise.all(
    //         result.map(newMapping =>
    //             startProcessV2({
    //                 processId: frameworkMappingProcessId,
    //                 data: newMapping,
    //                 processIdentifierFields: "id",
    //             })
    //         )
    //     );

    // };

    const mergeMappingData = (frameworkData, mappingData) => {
        const invokeData = [];
        const startData = [];
    
        mappingData.forEach(newItem => {
            const existingItem = frameworkData.find(prevItem => prevItem.id === newItem.id);
    
            if (existingItem) {
                // ✅ New mappings come first, so they override existing ones
                const allMappings = [...newItem.mapping, ...existingItem.mapping];
    
                const uniqueMappingsMap = new Map();
                allMappings.forEach(map => {
                    if (!uniqueMappingsMap.has(map.id)) {
                        uniqueMappingsMap.set(map.id, map);
                    }
                });
    
                invokeData.push({
                    id: newItem.id,
                    mapping: Array.from(uniqueMappingsMap.values()),
                });
            } else {
                // New framework entirely
                startData.push(newItem);
            }
        });
    
        return { invokeData, startData };
    };
    

    const handleSaveAllMappings = async () => {
        console.log("Saving all mappings: ^^^^^^^^^^^^^^ ============== >", mappingData);

        const resultMap: Record<string, any> = {};

        mappingData.forEach(item => {
            const ids = [item.frameworkId1, item.frameworkId2].sort();
            const key = `${ids[0]}_${ids[1]}`;

            if (!resultMap[key]) {
                resultMap[key] = {
                    id: key,
                    mapping: []
                };
            }

            resultMap[key].mapping.push(item);
        });

        const result = Object.values(resultMap);

        console.log("new data gets generated please have a look at this -======--------=-=-=-=-=-=-=-=>>");
        console.log(result);

        onSaveMappings(mappingData); // Pass data to parent component
        setIsOpen(false); // Close modal from parent

        const { invokeData, startData } = mergeMappingData(frameworkMappingData, result);

        console.log("lets have a look into invoke data -=-=-=-=>>", invokeData);
        console.log("lets have a look into start data -=-=-=-=>>", startData);




        if(startData.length > 0) {
            const frameworkMappingProcessId = await mapProcessName({ processName: "Framework Mapping" });

            await Promise.all(
                startData.map(newMapping =>
                    startProcessV2({
                        processId: frameworkMappingProcessId,
                        data: newMapping,
                        processIdentifierFields: "id",
                    })
                )
            );
        }

        if (invokeData.length > 0) {
            await Promise.all(
                invokeData.map(async (newMapping) => {
                    const frameworkMapInstances = await getMyInstancesV2({
                        processName: "Framework Mapping",
                        predefinedFilters: { taskName: "Edit FrameworkMapping" },
                        mongoWhereClause: `this.Data.id == "${newMapping.id}"`,
                    });
        
                    if (frameworkMapInstances.length > 0) {
                        const taskId = frameworkMapInstances[0].taskId;
        
                        await invokeAction({
                            taskId: taskId,
                            data: newMapping,
                            transitionName: 'Update Edit FrameMap',
                            processInstanceIdentifierField: 'id',
                        });
                    } else {
                        console.warn(`No instance found for id: ${newMapping.id}`);
                    }
                })
            );
        }
        

        
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}> {/* Using isOpen controlled from parent */}
            <DialogContent className="max-w-full h-screen flex flex-col">
                <DialogHeader>
                    <DialogTitle>Manage Framework Mappings</DialogTitle>
                </DialogHeader>

                {/* <Button onClick={() => { setIsFormVisible(true); setEditMapping(null); }} className="mb-4">
          Create Mapping
        </Button> */}

                <div className="flex justify-end">
                    <Button onClick={() => { setIsFormVisible(true); setEditMapping(null); }}
                        className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Mapping
                    </Button>
                </div>


                {isFormVisible && (
                    <MultipleFrameworkMappingForm
                        frameworksData={frameworksData}
                        onSave={handleSaveMapping}
                        closeForm={() => setIsFormVisible(false)}
                        editMapping={editMapping}
                    />
                )}

                <MultipleFrameworkMappingDataTable
                    mappings={mappingData}
                    onEdit={handleEditMapping}
                    onDelete={handleDeleteMapping}

                />

                <DialogFooter className="mt-auto">
                    <Button onClick={handleSaveAllMappings}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}