export interface ThemeColorProps {
    primary: string,
    secondary: string,
    tertiary: string,
}
export interface AccountThemeProps {
    dark: ThemeColorProps,
    light: ThemeColorProps
}

export interface UserThemeProps {
    mode: string,
    font: string,
    radius: string
}

export const defaultAccountTheme: AccountThemeProps = {
    light: {
        primary: "#0d6efd",
        secondary: "#6d767e",
        tertiary: "#445760"
    },
    dark: {
        primary: "#0d6efd",
        secondary: "#6d767e",
        tertiary: "#445760"
    }
}

export const defaultUserTheme: UserThemeProps = {
    mode: "dark",
    font: "Poppins",
    radius: "0.5"
}