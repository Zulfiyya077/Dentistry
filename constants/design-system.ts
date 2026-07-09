/**
 * Design system — medical professional aesthetic
 */
export const COLORS = {
  primary: "#1E293B",
  secondary: "#2F6F6D",
  accent: "#2F6F6D",
  background: "#F7F8FA",
  surface: "#FFFFFF",
  textPrimary: "#1A2332",
  textSecondary: "#5C6678",
  border: "#D8DEE6",
  success: "#2F8F6B",
  warning: "#C47A1A",
  error: "#C0392B",
  verified: "#2F6F6D",
} as const;

export const SPACING = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
} as const;

export const RADIUS = {
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  full: "9999px",
} as const;

export const TYPOGRAPHY = {
  fontFamily: "Inter, system-ui, sans-serif",
  scale: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },
} as const;

export const SHADOWS = {
  soft: "0 1px 3px rgba(15, 23, 42, 0.06)",
  card: "0 2px 8px rgba(15, 23, 42, 0.08)",
  elevated: "0 4px 16px rgba(15, 23, 42, 0.1)",
} as const;
