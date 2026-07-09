"use client";

import { Clock, Wrench } from "lucide-react";
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
      <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
        {t("profile.noPortfolio")}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {cases.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
        >
          <div className="p-6 pb-4">
            <h3 className="text-xl font-semibold">
              {resolveLocalized(item.title, locale)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {resolveLocalized(item.description, locale)}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Wrench className="h-4 w-4" />
                {t("profile.technique")}: {resolveLocalized(item.technique, locale)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {t("profile.duration")}: {resolveLocalized(item.duration, locale)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1 px-1">
            <div className="relative">
              <div
                className={cn(
                  "aspect-[4/3] bg-gradient-to-br",
                  item.beforeColor
                )}
              />
              <span className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white">
                {t("common.before")}
              </span>
            </div>
            <div className="relative">
              <div
                className={cn(
                  "aspect-[4/3] bg-gradient-to-br",
                  item.afterColor
                )}
              />
              <span className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white">
                {t("common.after")}
              </span>
            </div>
          </div>

          {item.galleryColors.length > 0 && (
            <div className="grid grid-cols-3 gap-1 p-1">
              {item.galleryColors.map((color, i) => (
                <div
                  key={i}
                  className={cn("aspect-square bg-gradient-to-br", color)}
                />
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
