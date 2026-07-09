export type Locale = "az" | "en";

export const LOCALES: Locale[] = ["az", "en"];

export const DEFAULT_LOCALE: Locale = "az";

export const LOCALE_LABELS: Record<Locale, string> = {
  az: "AZ",
  en: "EN",
};

export interface LocalizedString {
  az: string;
  en: string;
}

export type LocalizedStringArray = LocalizedString[];

export function resolveLocalized(
  value: LocalizedString | string,
  locale: Locale
): string {
  if (typeof value === "string") return value;
  return value[locale] ?? value.en;
}

export function matchesLocalized(
  value: LocalizedString | string,
  query: string
): boolean {
  const q = query.toLowerCase();
  if (typeof value === "string") return value.toLowerCase().includes(q);
  return value.az.toLowerCase().includes(q) || value.en.toLowerCase().includes(q);
}
