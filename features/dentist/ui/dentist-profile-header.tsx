"use client";

import { BadgeCheck, Eye, MapPin } from "lucide-react";
import type { MockDentist } from "@/features/dentist/data/mock-dentists";
import { DentistProfileActions } from "@/features/dentist/ui/dentist-profile-actions";
import { resolveLocalized } from "@/lib/i18n/types";
import { useTranslation } from "@/providers/locale-provider";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/lib/utils";

interface DentistProfileHeaderProps {
  dentist: MockDentist;
}

export function DentistProfileHeader({ dentist }: DentistProfileHeaderProps) {
  const { locale, t } = useTranslation();

  return (
    <div>
      <div className="relative h-48 sm:h-64 lg:h-80">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            dentist.coverGradient
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-16 flex flex-col gap-6 sm:-mt-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-card text-4xl font-bold text-primary shadow-elevated ring-4 ring-background sm:h-32 sm:w-32">
              {dentist.avatarInitial}
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {dentist.fullName}
                </h1>
                {dentist.isVerified && (
                  <Badge variant="verified">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {t("common.verifiedDentist")}
                  </Badge>
                )}
                {dentist.isFeatured && (
                  <Badge variant="premium">{t("common.topRated")}</Badge>
                )}
              </div>
              <p className="mt-1 text-muted-foreground">
                {resolveLocalized(dentist.title, locale)}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {resolveLocalized(dentist.city, locale)},{" "}
                  {resolveLocalized(dentist.country, locale)}
                </span>
                <span>
                  {dentist.experienceYears} {t("common.yearsExperience")}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {dentist.profileViews.toLocaleString()} {t("common.views")}
                </span>
              </div>
            </div>
          </div>

          <DentistProfileActions dentist={dentist} />
        </div>
      </div>
    </div>
  );
}
