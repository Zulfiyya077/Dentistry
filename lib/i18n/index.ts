import { az } from "./locales/az";
import { en } from "./locales/en";
import type { Locale } from "./types";

const dictionaries = { az, en: en as typeof az };

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

type NestedKeyOf<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], Prefix extends "" ? K : `${Prefix}.${K}`>
        : Prefix extends ""
          ? K
          : `${Prefix}.${K}`;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<typeof az>;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  let text = getNestedValue(
    dictionaries[locale] as unknown as Record<string, unknown>,
    key
  );

  if (params) {
    for (const [paramKey, value] of Object.entries(params)) {
      text = text.replace(`{${paramKey}}`, String(value));
    }
  }

  return text;
}

export { az, en };
