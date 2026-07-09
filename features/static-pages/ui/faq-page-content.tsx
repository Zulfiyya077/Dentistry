"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";
import { StaticPageLayout } from "./static-page-layout";

const faqKeys = ["what", "verified", "pricing", "reviews", "appointment"] as const;

export function FaqPageContent() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <StaticPageLayout
      title={t("pages.faq.title")}
      subtitle={t("pages.faq.subtitle")}
    >
      <div className="space-y-3">
        {faqKeys.map((key, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={key}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-medium">
                  {t(`pages.faq.items.${key}.question`)}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              {isOpen && (
                <div className="border-t border-border px-6 pb-5 pt-2">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`pages.faq.items.${key}.answer`)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </StaticPageLayout>
  );
}
