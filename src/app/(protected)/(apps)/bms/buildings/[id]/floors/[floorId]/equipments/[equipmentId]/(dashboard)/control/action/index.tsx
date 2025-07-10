import { mapSoftwareName } from "@/ikon/utils/api/softwareService";
import { getMyInstancesV2, startProcessV2, mapProcessName } from "@/ikon/utils/api/processRuntimeService";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";

export const setSetpoint = async function (setPointName: string, val: number) {
    let setPointObj = {};
    let mongoWhereClause = 'this.Data.credentialName =="' + setPointName + '"'
    let cccSSoftwareId = await mapSoftwareName({
        softwareName: "CCC",
        version: "1",
    });
    const configurationItemObj: any = await getMyInstancesV2({
        processName: "Configuration Item",
        softwareId: cccSSoftwareId,
        predefinedFilters: { "taskName": "View CI Activity" },
        projections: ["Data"],
    });
    const credDirectoryObj: any = await getMyInstancesV2({
        processName: "Parameter Credential Directory",
        softwareId: cccSSoftwareId,
        predefinedFilters: { "taskName": "View credential" },
        mongoWhereClause,
        projections: ["Data"],
    });
    const commandCatalogObj: any = await getMyInstancesV2({
        processName: "Command Catalog",
        softwareId: cccSSoftwareId,
        predefinedFilters: { "taskName": "View Commands" },
        projections: ["Data"],
    });

    let updatedObj = credDirectoryObj[0].data.ApiCredProperties.map((item: { key: string; value: any }) => {
        if (item.key === "new_value") {
            item.value = val;
        }
        return item;
    });

    // console.log("updatedObj", updatedObj)
    let deviceCommandAssociation = []
    deviceCommandAssociation.push({
        "commandId": commandCatalogObj[0].data.commandId,
        "commandIndex": 0,
        "deviceId": configurationItemObj[0].data.deviceId
    })

    let serviceScriptDetails = {}
    serviceScriptDetails = {
        "isRootNecessary": false,
        "script": commandCatalogObj[0].data.script.commands[0].command,
        "scriptName": commandCatalogObj[0].data.commandName,
        "scriptType": "nashorn",
        "serviceId": commandCatalogObj[0].data.commandId
    }
    setPointObj = {
        "commandList": commandCatalogObj[0].data.script.commands[0].command,
        "commandStartTime": new Date(),
        "deviceCommandAssociation": deviceCommandAssociation,
        "deviceDetail": configurationItemObj[0].data,
        "executionId": uuid(),
        "id": commandCatalogObj[0].data.commandId,
        "probeId": "788e68fc-8b2b-422b-b3ab-6f59ae0eab3e",
        "serviceScriptDetails": serviceScriptDetails,
        "subCommand": commandCatalogObj[0].data.commandId,
        "apiCredentials": updatedObj,
        "source": "BMS"

    }
    // console.log(setPointObj)

    const processId = await mapProcessName({ processName: "Device Service Dry Run for scheduling", softwareId: cccSSoftwareId });
    await startProcessV2({
        softwareId: cccSSoftwareId,
        processId,
        data: setPointObj,
        processIdentifierFields: "",
    });
    // toast.success("Setpoint Applied: " + val + " for " + setPointName)
}