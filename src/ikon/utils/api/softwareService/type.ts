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

export interface SubscribeSoftwareProps {
    ACCOUNT_ID: string;
    SOFTWARE_ID: string;
    SOFTWARE_NAME: string;
    SOFTWARE_VERSION: number;
    SOFTWARE_DESCRIPTION: string;
    SOFTWARE_OWNER_ID: string;
    SOFTWARE_OWNER_NAME: string;
    SOFTWARE_ACCESSIBILITY: 'PUBLIC' | 'PRIVATE'; // assuming only these two possible values
    ACTIVE: boolean;
    PURCHASE_DATE: string; // ISO date string
    EXPIRES_ON: string | null; // ISO date string or null
};
