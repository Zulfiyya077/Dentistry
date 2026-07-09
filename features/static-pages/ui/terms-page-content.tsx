"use client";

import { useTranslation } from "@/providers/locale-provider";
import { StaticPageLayout } from "./static-page-layout";

const sectionKeys = [
  "acceptance",
  "accounts",
  "content",
  "conduct",
  "liability",
] as const;

export function TermsPageContent() {
  const { t } = useTranslation();

  return (
    <StaticPageLayout
      title={t("pages.terms.title")}
      subtitle={t("pages.terms.subtitle")}
    >
      <div className="space-y-8">
        <p className="text-sm text-muted-foreground">
          {t("pages.terms.updated")}
        </p>
        {sectionKeys.map((key) => (
          <section key={key}>
            <h2 className="text-lg font-semibold">
              {t(`pages.terms.sections.${key}.title`)}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {t(`pages.terms.sections.${key}.content`)}
            </p>
          </section>
        ))}
      </div>
    </StaticPageLayout>
  );
}
