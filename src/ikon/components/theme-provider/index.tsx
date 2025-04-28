
"use client"
import { AccountThemeProps, ThemeColorProps, UserThemeProps } from "@/ikon/utils/actions/theme/type";
import { createContext, ReactNode, useContext, useReducer } from "react";

interface Action {
    type: string;
    payload: string | ThemeColorProps
}
export interface CustomThemeContextType {
    state: AccountThemeProps & UserThemeProps;
    dispatch: (action: Action) => void;
    fontNameWiseClassName: { [key: string]: string; }
}



const reducer = (state: AccountThemeProps & UserThemeProps, action: Action): AccountThemeProps & UserThemeProps => {
    switch (action.type) {
        case "light":
            return { ...state, light: { ...(action.payload as ThemeColorProps) } };
        case "dark":
            return { ...state, dark: { ...(action.payload as ThemeColorProps) } };
        case "mode":
            return { ...state, mode: action.payload.toString() };
        case "font":
            return { ...state, font: action.payload.toString() };
        case "radius":
            return { ...state, radius: action.payload.toString() };
        default:
            return state;
    }
};


const CustomThemeContext = createContext<CustomThemeContextType | undefined>(undefined)


export function ThemeProvider({
    children,
    themeData,
    fontNameWiseClassName
}: Readonly<{
    children: ReactNode;
    themeData: AccountThemeProps & UserThemeProps;
    fontNameWiseClassName: { [key: string]: string; }
}>) {

    const [state, dispatch] = useReducer(reducer, themeData);

    return (
        <CustomThemeContext.Provider value={{ state, dispatch, fontNameWiseClassName }}>
            {children}
        </CustomThemeContext.Provider>
    )
}


export const useThemeOptions = (): CustomThemeContextType => {
    const context = useContext(CustomThemeContext);
    if (!context) {
        throw new Error("useColor must be used within a ColorProvider");
    }
    return context;
};