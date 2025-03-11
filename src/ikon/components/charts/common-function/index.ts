import chroma from "chroma-js"; // Import chroma.js

export const getColorScale = (chartData: any[], state: any) => {
    const darkModeEnabled = state.mode === "dark"; // Use state mode

    const colorPalette = darkModeEnabled
        ? [state.dark.primary, state.dark.secondary, state.dark.tertiary]
        : [state.light.primary, state.light.secondary, state.light.tertiary];

    // Generate a color scale
    const colorScale = chroma.scale(colorPalette).colors(chartData.length);
    return colorScale;;
}