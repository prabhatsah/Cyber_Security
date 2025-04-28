export interface LoginProps {
    userName: string;
    password: string;
}

export interface ForgotPasswordProps {
    userName: string;
}

export interface ValidateOTPProps {
    temporaryTicket: string;
    otp: string;
}

export interface GetLoggedInUserProfileReturnProps {
    USER_NAME: string;
    USER_LOGIN: string;
    USER_ID: string;
    CNT: number;
    USER_THUMBNAIL?: string | null;
}
export interface GetLoggedInUserProfileDetailsReturnProps {
    USER_NAME: string;
    USER_EMAIL: string;
    USER_PHONE: string;
    USER_THUMBNAIL?: string | null;
}

export interface UpdateUserProfileProps {
    userName: string,
    userPassword: string,
    userPhone: string,
    userEmail: string,
    userThumbnail?: string | null
}