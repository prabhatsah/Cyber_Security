'use server'

import { getBaseSoftwareId } from "@/ikon/utils/actions/software"
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService"

export async function getEmailData(){
    const baseSoftwareId = await getBaseSoftwareId();
    const emailDataInstance = await getMyInstancesV2({
        processName: 'Email Template',
        softwareId: baseSoftwareId,
        mongoWhereClause: "this.Data.templateId == '1725430357320'",
    })
    return emailDataInstance;
}