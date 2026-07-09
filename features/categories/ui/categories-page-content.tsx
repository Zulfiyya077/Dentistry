"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CATEGORY_CONFIGS } from "@/features/categories/data/category-config";
import {
  getCategoryStats,
  getDentistsBySpecialization,
} from "@/features/categories/data/category-stats";
import { getSpecializationLabel } from "@/features/dentist/data/mock-dentists";
import type { SpecializationKey } from "@/features/dentist/data/mock-dentists";
import { useTranslation } from "@/providers/locale-provider";
import { Button } from "@/shared/ui/button";
import { CategoryCard } from "./category-card";
import { DentistCard } from "@/widgets/dentist-card/dentist-card";

export function CategoriesPageContent() {
  const { locale, t } = useTranslation();
  const searchParams = useSearchParams();
  const initialSpecialization = searchParams.get("specialization") as
    | SpecializationKey
    | null;

  const [selectedKey, setSelectedKey] = useState<SpecializationKey | null>(
    initialSpecialization &&
      CATEGORY_CONFIGS.some((c) => c.key === initialSpecialization)
      ? initialSpecialization
      : null
  );

  const statsMap = useMemo(() => {
    const stats = getCategoryStats();
    return Object.fromEntries(stats.map((s) => [s.key, s]));
  }, []);

  const selectedDentists = selectedKey
    ? getDentistsBySpecialization(selectedKey)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("categories.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          {t("categories.subtitle")}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_CONFIGS.map((category, index) => (
          <CategoryCard
            key={category.key}
            category={category}
            stats={statsMap[category.key]}
            index={index}
            isActive={selectedKey === category.key}
            onClick={() =>
              setSelectedKey(
                selectedKey === category.key ? null : category.key
              )
            }
          />
        ))}
      </div>

      {selectedKey && (
        <section className="mt-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {getSpecializationLabel(selectedKey, locale)}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {t("categories.dentistsInCategory", {
                  count: selectedDentists.length,
                })}
              </p>
            </div>
            <Link href={`/discover?specialization=${selectedKey}`}>
              <Button variant="secondary">
                {t("categories.viewInDiscover")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {selectedDentists.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
              {t("categories.noDentistsYet")}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {selectedDentists.map((dentist, index) => (
                <DentistCard key={dentist.id} dentist={dentist} index={index} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
