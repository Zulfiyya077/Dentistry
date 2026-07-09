/**
 * Design system tokens — single source of truth for colors, spacing, typography
 */
export const COLORS = {
  primary: "#2563EB",
  secondary: "#0EA5E9",
  accent: "#14B8A6",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  verified: "#3B82F6",
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
  sm: "0.5rem",
  md: "1rem",
  lg: "1.25rem",
  xl: "1.5rem",
  "2xl": "1.75rem",
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
  soft: "0 2px 8px -2px rgba(15, 23, 42, 0.08)",
  card: "0 4px 24px -4px rgba(15, 23, 42, 0.1)",
  elevated: "0 8px 32px -8px rgba(15, 23, 42, 0.12)",
} as const;
