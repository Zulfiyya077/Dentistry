"use client";

import Link from "next/link";
import { useTranslation } from "@/providers/locale-provider";
import { PageLayout } from "@/widgets/page-layout/page-layout";
import { Button } from "@/shared/ui/button";

export default function PricingPage() {
  const { t, locale } = useTranslation();

  const plans = [
    {
      name: t("pricing.free"),
      price: "$0",
      description: locale === "az" ? "Əsas profil siyahısı" : "Basic profile listing",
      features:
        locale === "az"
          ? ["İctimai profil", "3 portfoliyo işi", "Əsas axtarış görünürlüyü"]
          : ["Public profile", "Up to 3 portfolio cases", "Basic search visibility"],
    },
    {
      name: t("pricing.pro"),
      price: `$29${t("pricing.perMonth")}`,
      description: locale === "az" ? "Böyüyən klinikalar üçün" : "For growing practices",
      features:
        locale === "az"
          ? ["Limitsiz portfoliyo", "Analitika paneli", "Fərdi profil teması", "Prioritet dəstək"]
          : ["Unlimited portfolio", "Analytics dashboard", "Custom profile theme", "Priority support"],
      highlighted: true,
    },
    {
      name: t("pricing.premium"),
      price: `$79${t("pricing.perMonth")}`,
      description: locale === "az" ? "Maksimum görünürlük" : "Maximum visibility",
      features:
        locale === "az"
          ? ["Seçilmiş yerləşdirmə", "Qabaqcıl analitika", "Təsdiq badge prioriteti", "Klinika səhifəsi"]
          : ["Featured placement", "Advanced insights", "Verified badge priority", "Clinic page"],
    },
  ];

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">{t("pricing.title")}</h1>
          <p className="mt-4 text-muted-foreground">{t("pricing.subtitle")}</p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 shadow-soft ${
                plan.highlighted
                  ? "border-primary bg-primary/5 shadow-card"
                  : "border-border bg-card"
              }`}
            >
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold">{plan.price}</p>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-muted-foreground">
                    ✓ {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="mt-8 block">
                <Button
                  variant={plan.highlighted ? "default" : "secondary"}
                  className="w-full"
                >
                  {t("pricing.getStarted")}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
