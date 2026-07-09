"use client";

import { Star, ThumbsUp, Users } from "lucide-react";
import type { MockDentist } from "@/features/dentist/data/mock-dentists";
import { useTranslation } from "@/providers/locale-provider";

interface DentistReputationScoreProps {
  dentist: MockDentist;
}

export function DentistReputationScore({ dentist }: DentistReputationScoreProps) {
  const { t } = useTranslation();

  const stats = [
    {
      label: t("common.rating"),
      value: dentist.rating.toFixed(1),
      icon: Star,
      highlight: true,
    },
    {
      label: t("common.reviews"),
      value: dentist.reviewCount.toString(),
      icon: null,
    },
    {
      label: t("common.recommendation"),
      value: `${dentist.recommendationRate}%`,
      icon: ThumbsUp,
    },
    {
      label: t("common.patients"),
      value:
        dentist.patientCount >= 1000
          ? `${(dentist.patientCount / 1000).toFixed(1)}K`
          : dentist.patientCount.toString(),
      icon: Users,
    },
    {
      label: t("common.followers"),
      value: dentist.followerCount.toLocaleString(),
      icon: Users,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft sm:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="flex items-center justify-center gap-1">
              {stat.icon && (
                <stat.icon
                  className={`h-4 w-4 ${stat.highlight ? "fill-warning text-warning" : "text-muted-foreground"}`}
                />
              )}
              <span
                className={`text-2xl font-bold ${stat.highlight ? "text-primary" : ""}`}
              >
                {stat.value}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
