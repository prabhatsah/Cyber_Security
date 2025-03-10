"use server"
import { cache } from "react";
import { getAccessibleSoftwareForUser, getAllSubscribedSoftwaresForClient, mapSoftwareName } from "@/ikon/utils/api/softwareService";
import { getCookieSession, setCookieSession } from "@/ikon/utils/session/cookieSession";

export const getBaseSoftwareId = async (): Promise<string | undefined> => {
    return await getCookieSession("baseSoftwareId");
};

export const getOrSetBaseSoftwareId = async (): Promise<string | undefined> => {
    let baseSoftwareId = await getCookieSession("baseSoftwareId")
    if (!baseSoftwareId) {
        try {
            baseSoftwareId = await getSoftwareIdByNameVersion("Base App", "1")
            await setBaseSoftwareId(baseSoftwareId)
        } catch (error) {
            console.error(error)
        }
    }
    return baseSoftwareId;
};

export const setBaseSoftwareId = async (softwareId: string) => {
    await setCookieSession("baseSoftwareId", softwareId)
};

export const getCurrentSoftwareId = async (): Promise<string> => {
    return await getCookieSession("currentSoftwareId") || "";
};

export const getCurrentAppName = async (): Promise<string> => {
    return await getCookieSession("currentAppName") || "";
};

export const setCurrentSoftwareId = async (softwareId: string) => {
    await setCookieSession("currentSoftwareId", softwareId)
};

export const getSoftwareIdByNameVersion = cache(async (softwareName: string, version: string): Promise<string> => {
    return await mapSoftwareName({ softwareName, version });
});

export const setCurrentSoftwareIdByNameVersion = async (softwareName: string, version: string) => {
    const softwareId = await getSoftwareIdByNameVersion(softwareName, version);
    await setCurrentSoftwareId(softwareId);
};

export const getAccessibleSoftware = cache(async (accountId: string, userId: string) => {
    return await getAccessibleSoftwareForUser({ accountId, userId });
});

export const getAllSubscribedSoftwares = cache(async (accountId: string) => {
    return await getAllSubscribedSoftwaresForClient({ accountId });
});

