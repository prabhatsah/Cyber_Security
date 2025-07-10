export function formatRawBacnetData(incomingRawData: any[]): any[] {
    const bacnetDataRules = {
        '2': { site: {}, serviceName: {} },
        '3': { site: {}, system: {}, serviceName: {} },
        '4': { site: {}, system: {}, subSystem: {}, serviceName: {} },
        '5': { site: {}, system: {}, systemType: {}, subSystem: {}, serviceName: {} }
    };

    try {
        if (!Array.isArray(incomingRawData) || incomingRawData.length === 0) {
            console.warn("Incoming raw data is not an array or is empty.");
            return [];
        }

        const updatedRawData = incomingRawData
            .filter(rawData => rawData.object_name && rawData.object_name.trim() !== '')
            .map(rawData => {
                const objectNameArray = rawData.object_name.split('\\').map(part => part.trim());
                const objectNameArrayValues = bacnetDataRules[objectNameArray.length];

                if (!objectNameArrayValues) {
                    console.warn(`No mapping found for object_name with length ${objectNameArray.length}`);
                    return null;
                }

                const newObject: any = {};
                Object.keys(objectNameArrayValues).forEach((key, index) => {
                    if (objectNameArray[index]) {
                        newObject[key] = objectNameArray[index];
                    }
                });

                // Add additional properties from rawData
                newObject["data_received_on"] = rawData.data_received_on;
                newObject["description"] = rawData.description;
                newObject["object_id"] = rawData.object_id;
                newObject["object_type"] = rawData.object_type;
                newObject["units"] = rawData.units;
                newObject["present_value"] = rawData.present_value;

                return newObject;
            })
            .filter(newObject => newObject !== null);

        console.log("Updated Data:", updatedRawData);
        return updatedRawData;
    } catch (error) {
        console.error("Error formatting raw Bacnet data:", error);
        return [];
    }
}

