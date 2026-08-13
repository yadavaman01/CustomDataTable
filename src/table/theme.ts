import type { CSSProperties } from "react";
import type { CustomDataTableTheme } from "./types";

/**
 * Matches TaskSummaryModal's original look (gray-100 header, gray-300 border,
 * blue-50 selected row, navColor accent) so it's a drop-in visual default.
 */
export const defaultCustomDataTableTheme: CustomDataTableTheme = {
  headerBg: "#F3F4F6",
  headerText: "#374151",
  bodyBg: "#FFFFFF",
  bodyText: "#111827",
  borderColor: "#D1D5DB",
  rowBorderColor: "#E5E7EB",
  rowHoverBg: "#F9FAFB",
  selectedRowBg: "#EFF6FF",
  accentColor: "hsl(var(--nav-color))",
  expandIconColor: "#6B7280",
  emptyStateText: "#6B7280",
  radius: "0.75rem",
};

export function resolveTheme(
  theme?: Partial<CustomDataTableTheme>
): CustomDataTableTheme {
  const resolved = { ...defaultCustomDataTableTheme };
  if (theme) {
    for (const key of Object.keys(theme) as (keyof CustomDataTableTheme)[]) {
      const value = theme[key];
      // Falsy overrides (e.g. an accidental "") fall back to the default
      // instead of silently deleting the CSS variable and breaking styling.
      if (value) resolved[key] = value;
    }
  }
  return resolved;
}

/**
 * Colors are exposed as CSS variables (not raw Tailwind classes) so any color
 * string works, not just Tailwind-safelisted ones, and so the same compiled
 * classNames keep working across consuming apps once this ships standalone.
 */
export function themeToCssVars(theme: CustomDataTableTheme): CSSProperties {
  return {
    "--cdt-header-bg": theme.headerBg,
    "--cdt-header-text": theme.headerText,
    "--cdt-body-bg": theme.bodyBg,
    "--cdt-body-text": theme.bodyText,
    "--cdt-border": theme.borderColor,
    "--cdt-row-border": theme.rowBorderColor,
    "--cdt-row-hover": theme.rowHoverBg,
    "--cdt-selected-bg": theme.selectedRowBg,
    "--cdt-accent": theme.accentColor,
    "--cdt-expand-icon": theme.expandIconColor,
    "--cdt-empty-text": theme.emptyStateText,
    "--cdt-radius": theme.radius,
  } as CSSProperties;
}
