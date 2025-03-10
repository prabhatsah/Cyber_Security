import ikonBaseApi from "@/ikon/utils/api/ikonBaseApi";
import { getAccessibleSoftwareForUserProps, getAllSubscribedSoftwaresForClientProps, getAvailableSoftwaresForAccountProps, getMySoftwaresProps, getMySoftwaresV2Props, mapSoftwareNameProps } from "./type";

export const mapSoftwareName = async ({ softwareName, version }: mapSoftwareNameProps): Promise<string> => {
    const result = await ikonBaseApi({
        service: "softwareService",
        operation: "mapSoftwareName",
        arguments_: [softwareName, version]
    })
    return result.data
}

export const getAccessibleSoftwareForUser = async ({ accountId, userId }: getAccessibleSoftwareForUserProps) => {
    const result = await ikonBaseApi({
        service: "softwareService",
        operation: "getAccessibleSoftwareForUser",
        arguments_: [accountId, userId]
    })
    return result.data
}

export const getAllSubscribedSoftwaresForClient = async ({ accountId }: getAllSubscribedSoftwaresForClientProps) => {
    const result = await ikonBaseApi({
        service: "softwareSubscriptionService",
        operation: "getAllSubscribedSoftwaresForClient",
        arguments_: [accountId]
    })
    return result.data
}

export const getMySoftwares = async ({ accountId }: getMySoftwaresProps) => {
    const result = await ikonBaseApi({
        service: "softwareService",
        operation: "getMySoftwares",
        arguments_: [accountId]
    })
    return result.data
}

export const getMySoftwaresV2 = async ({ accountId, onlyActive = false }: getMySoftwaresV2Props) => {
    const result = await ikonBaseApi({
        service: "softwareService",
        operation: "getMySoftwaresV2",
        arguments_: [accountId, onlyActive]
    })
    return result.data
}

export const getAvailableSoftwaresForAccount = async ({ accountId }: getAvailableSoftwaresForAccountProps) => {
    const result = await ikonBaseApi({
        service: "softwareService",
        operation: "getAvailableSoftwaresForAccount",
        arguments_: [accountId]
    })
    return result.data
}