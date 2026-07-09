"use client";

import { Building2, MapPin, Phone } from "lucide-react";
import type { MockWorkplace } from "@/features/dentist/data/mock-dentists";
import { resolveLocalized } from "@/lib/i18n/types";
import { useTranslation } from "@/providers/locale-provider";
import { Badge } from "@/shared/ui/badge";

interface DentistWorkplacesSectionProps {
  workplaces: MockWorkplace[];
}

export function DentistWorkplacesSection({
  workplaces,
}: DentistWorkplacesSectionProps) {
  const { locale, t } = useTranslation();

  if (workplaces.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
        {t("profile.noWorkplaces")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workplaces.map((wp) => (
        <article
          key={wp.id}
          className="rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">
                    {resolveLocalized(wp.name, locale)}
                  </h3>
                  <Badge variant={wp.isCurrent ? "verified" : "outline"}>
                    {wp.isCurrent
                      ? t("profile.currentWorkplace")
                      : t("profile.pastWorkplace")}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-primary">
                  {resolveLocalized(wp.role, locale)}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                  {wp.type}
                </p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">
              {resolveLocalized(wp.period, locale)}
            </span>
          </div>

          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {resolveLocalized(wp.address, locale)},{" "}
              {resolveLocalized(wp.city, locale)},{" "}
              {resolveLocalized(wp.country, locale)}
            </p>
            {wp.phone && (
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                {wp.phone}
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
