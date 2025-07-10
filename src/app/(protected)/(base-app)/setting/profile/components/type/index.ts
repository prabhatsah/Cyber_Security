export interface ProfileDataProps {
    USER_ID: string;
    USER_LOGIN: string;
    USER_NAME: string;
    USER_EMAIL: string;
    USER_PHONE: string;
    USER_PASSWORD?: string;
    USER_THUMBNAIL?: string;
    about_me?: string;
    designation?: string;
    dob?: Date | undefined;
    confirmPassword?: string;
    imageDetails?: any;
}