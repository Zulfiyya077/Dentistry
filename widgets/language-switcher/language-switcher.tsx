"use client";

import { cn } from "@/lib/utils";
import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n/types";
import { useTranslation } from "@/providers/locale-provider";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      className={cn(
        "flex items-center rounded-lg border border-border bg-background/50 p-0.5",
        className
      )}
    >
      {LOCALES.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => setLocale(loc as Locale)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
            locale === loc
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
