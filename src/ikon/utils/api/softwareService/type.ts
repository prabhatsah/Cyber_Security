export interface mapSoftwareNameProps {
    softwareName: string;
    version: string
}
export interface getAllSubscribedSoftwaresForClientProps {
    accountId?: string
}

export interface getAccessibleSoftwareForUserProps {
    accountId?: string;
    userId: string;
}

export interface getMySoftwaresProps {
    accountId?: string
}

export interface getMySoftwaresV2Props {
    accountId?: string;
    onlyActive?: boolean
}

export interface getAvailableSoftwaresForAccountProps {
    accountId?: string
}