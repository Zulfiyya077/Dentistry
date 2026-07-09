"use client";

import Link from "next/link";
import { useTranslation } from "@/providers/locale-provider";
import { Button } from "@/shared/ui/button";
import { StaticPageLayout } from "./static-page-layout";

export function AboutPageContent() {
  const { t } = useTranslation();

  const values = [
    {
      title: t("pages.about.values.trust.title"),
      description: t("pages.about.values.trust.description"),
    },
    {
      title: t("pages.about.values.transparency.title"),
      description: t("pages.about.values.transparency.description"),
    },
    {
      title: t("pages.about.values.quality.title"),
      description: t("pages.about.values.quality.description"),
    },
  ];

  return (
    <StaticPageLayout
      title={t("pages.about.title")}
      subtitle={t("pages.about.subtitle")}
    >
      <div className="space-y-12">
        <p className="text-center leading-relaxed text-muted-foreground">
          {t("pages.about.intro")}
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <h3 className="font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-primary/5 p-8 text-center">
          <h3 className="text-xl font-semibold">{t("pages.about.ctaTitle")}</h3>
          <p className="mt-2 text-muted-foreground">{t("pages.about.ctaText")}</p>
          <Link href="/auth/register" className="mt-6 inline-block">
            <Button>{t("common.getStarted")}</Button>
          </Link>
        </div>
      </div>
    </StaticPageLayout>
  );
}
