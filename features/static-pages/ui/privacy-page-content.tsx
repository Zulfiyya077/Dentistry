"use client";

import { useTranslation } from "@/providers/locale-provider";
import { StaticPageLayout } from "./static-page-layout";

const sectionKeys = [
  "collection",
  "usage",
  "sharing",
  "security",
  "rights",
] as const;

export function PrivacyPageContent() {
  const { t } = useTranslation();

  return (
    <StaticPageLayout
      title={t("pages.privacy.title")}
      subtitle={t("pages.privacy.subtitle")}
    >
      <div className="space-y-8">
        <p className="text-sm text-muted-foreground">
          {t("pages.privacy.updated")}
        </p>
        {sectionKeys.map((key) => (
          <section key={key}>
            <h2 className="text-lg font-semibold">
              {t(`pages.privacy.sections.${key}.title`)}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {t(`pages.privacy.sections.${key}.content`)}
            </p>
          </section>
        ))}
      </div>
    </StaticPageLayout>
  );
}
