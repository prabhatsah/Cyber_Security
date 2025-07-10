import chroma from "chroma-js"; // Import chroma.js

export const getColorScale = (chartData: any[], state: any) => {
  const darkModeEnabled = state.mode === "dark"; // Use state mode

  const colorPalette = darkModeEnabled
    ? [
        state.dark.chart.primary,
        state.dark.chart.secondary,
        state.dark.chart.tertiary,
      ]
    : [
        state.light.chart.primary,
        state.light.chart.secondary,
        state.light.chart.tertiary,
      ];

  // Generate a color scale
  const colorScale = chroma.scale(colorPalette).colors(chartData.length);
  return colorScale;
};
