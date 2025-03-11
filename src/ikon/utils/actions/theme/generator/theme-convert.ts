import { clsx, type ClassValue } from "clsx"
import Color from "color"
import convert from "color-convert"
import { twMerge } from "tailwind-merge"
import { ColorVariables } from "./type"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function convertCssVarToHSLNumbers(
    cssVar: string
): [number, number, number] {
    const [h, s, l] = cssVar.split(" ") // 0 0% 0%
    return [+h.replace("%", ""), +s.replace("%", ""), +l.replace("%", "")]
}

export function convertCssVarToHex(cssVar: string) {
    const [h, s, l] = convertCssVarToHSLNumbers(cssVar)
    return `#${convert.hsl.hex([h, s, l])}`
}

export function convertHexToCssVar(hex: string) {
    const [h, s, l] = convert.hex.hsl(hex)
    return `${h} ${s}% ${l}%`
}

export function convertAllHexToCssVar(obj: ColorVariables) {
    const result = { ...obj }

    for (const k in obj) {
        const key = k as keyof ColorVariables
        result[key] = convertHexToCssVar(result[key])
    }

    return result
}

export function isValidColor(color: string) {
    try {
        Color(color)
        return true
    } catch (error) { }
}

