// Color system configuration with enhanced accessibility
export const chartColors = {
  primary: "hsl(var(--chart-1))",
  secondary: "hsl(var(--chart-2))",
  tertiary: "hsl(var(--chart-3))",
  quaternary: "hsl(var(--chart-4))",
  quinary: "hsl(var(--chart-5))"
}

// Category colors using chart theme
export const categoryColors = {
  Security: chartColors.primary,
  Compliance: chartColors.secondary,
  Risk: chartColors.tertiary,
  Audit: chartColors.quaternary,
  Policy: chartColors.quinary
}

// Status colors with improved contrast
export const statusColors = {
  Active: "hsl(var(--chart-1))",
  "In Progress": "hsl(var(--chart-2))",
  Pending: "hsl(var(--chart-3))",
  Completed: "hsl(var(--chart-4))",
  Planned: "hsl(var(--chart-5))"
}

// Risk level colors
export const riskLevelColors = {
  Critical: "hsl(0, 84%, 60%)",
  //Critical: chartColors.primary,
  High: "hsl(30, 84%, 60%)",
  //High: chartColors.secondary,
  Medium: "hsl(45, 84%, 60%)",
  //Medium: chartColors.tertiary,
  Low: "hsl(120, 84%, 60%)"
  //Low: chartColors.quaternary
}

// Chart theme configuration
export const chartTheme = {
  grid: {
    stroke: "hsl(var(--border))",
    strokeDasharray: "3 3"
  },
  text: {
    fill: "hsl(var(--foreground))",
    fontSize: 12,
    fontWeight: 500
  },
  axis: {
    stroke: "hsl(var(--border))",
    strokeWidth: 1,
    tickLine: false,
    style: {
      fontSize: 12,
      fontWeight: 500
    }
  },
  tooltip: {
    contentStyle: {
      backgroundColor: "hsl(var(--background))",
      border: "1px solid hsl(var(--border))",
      borderRadius: 6,
      padding: "8px 12px"
    }
  }
}

// Default chart properties
export const defaultChartProps = {
  width: "100%",
  height: 300,
  margin: { top: 20, right: 30, left: 20, bottom: 20 },
  style: {
    fontSize: 12,
    fontFamily: "var(--font-inter)"
  }
}