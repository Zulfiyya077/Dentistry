"use client";

import type { MockPortfolioCase } from "@/features/dentist/data/mock-dentists";
import { resolveLocalized } from "@/lib/i18n/types";
import { useTranslation } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

interface DentistPortfolioSectionProps {
  cases: MockPortfolioCase[];
}

export function DentistPortfolioSection({ cases }: DentistPortfolioSectionProps) {
  const { locale, t } = useTranslation();

  if (cases.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border py-16 text-center text-muted-foreground">
        {t("profile.noPortfolio")}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {cases.map((item) => (
        <article key={item.id} className="surface-card overflow-hidden rounded-md">
          <div className="p-6 pb-4">
            <h3 className="text-xl font-semibold">
              {resolveLocalized(item.title, locale)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {resolveLocalized(item.description, locale)}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                {t("profile.technique")}:{" "}
                {resolveLocalized(item.technique, locale)}
              </span>
              <span>
                {t("profile.duration")}:{" "}
                {resolveLocalized(item.duration, locale)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-border">
            <div className="relative aspect-[4/3] bg-muted">
              {item.beforeImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.beforeImageUrl}
                  alt={t("common.before")}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className={cn(
                    "flex h-full w-full items-end bg-gradient-to-br p-3",
                    item.beforeColor
                  )}
                >
                  <span className="rounded bg-black/50 px-2 py-0.5 text-xs text-white">
                    {t("common.before")}
                  </span>
                </div>
              )}
            </div>
            <div className="relative aspect-[4/3] bg-muted">
              {item.afterImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.afterImageUrl}
                  alt={t("common.after")}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className={cn(
                    "flex h-full w-full items-end bg-gradient-to-br p-3",
                    item.afterColor
                  )}
                >
                  <span className="rounded bg-black/50 px-2 py-0.5 text-xs text-white">
                    {t("common.after")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
