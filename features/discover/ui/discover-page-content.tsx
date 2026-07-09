"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import {
  MOCK_DENTISTS,
  type MockDentist,
} from "@/features/dentist/data/mock-dentists";
import { matchesLocalized } from "@/lib/i18n/types";
import { useTranslation } from "@/providers/locale-provider";
import { DentistCard } from "@/widgets/dentist-card/dentist-card";
import {
  DEFAULT_FILTERS,
  DiscoverFiltersButton,
  DiscoverFiltersPanel,
  type DiscoverFilters,
} from "./discover-filters";

function filterDentists(
  dentists: MockDentist[],
  filters: DiscoverFilters,
  locale: "az" | "en"
): MockDentist[] {
  let result = [...dentists];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (d) =>
        d.fullName.toLowerCase().includes(q) ||
        matchesLocalized(d.specialization, q) ||
        matchesLocalized(d.city, q) ||
        d.workplaces.some((w) => matchesLocalized(w.name, q))
    );
  }

  if (filters.countryCode) {
    result = result.filter((d) => d.countryCode === filters.countryCode);
  }
  if (filters.cityId) {
    result = result.filter((d) => d.cityId === filters.cityId);
  }
  if (filters.specializationKey) {
    result = result.filter(
      (d) => d.specializationKey === filters.specializationKey
    );
  }
  if (filters.minRating > 0) {
    result = result.filter((d) => d.rating >= filters.minRating);
  }
  if (filters.verifiedOnly) {
    result = result.filter((d) => d.isVerified);
  }
  if (filters.onlineOnly) {
    result = result.filter((d) => d.isOnline);
  }

  result.sort((a, b) => {
    switch (filters.sortBy) {
      case "reviews":
        return b.reviewCount - a.reviewCount;
      case "experience":
        return b.experienceYears - a.experienceYears;
      default:
        return b.rating - a.rating;
    }
  });

  void locale;
  return result;
}

function countActiveFilters(filters: DiscoverFilters): number {
  let count = 0;
  if (filters.countryCode) count++;
  if (filters.cityId) count++;
  if (filters.specializationKey) count++;
  if (filters.minRating > 0) count++;
  if (filters.verifiedOnly) count++;
  if (filters.onlineOnly) count++;
  return count;
}

export function DiscoverPageContent() {
  const { locale, t } = useTranslation();
  const searchParams = useSearchParams();
  const specializationParam = searchParams.get("specialization");

  const [filters, setFilters] = useState<DiscoverFilters>(() => ({
    ...DEFAULT_FILTERS,
    specializationKey:
      specializationParam &&
      MOCK_DENTISTS.some((d) => d.specializationKey === specializationParam)
        ? specializationParam
        : "",
  }));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (
      specializationParam &&
      MOCK_DENTISTS.some((d) => d.specializationKey === specializationParam)
    ) {
      setFilters((prev) => ({
        ...prev,
        specializationKey: specializationParam,
      }));
    }
  }, [specializationParam]);

  const filtered = useMemo(
    () => filterDentists(MOCK_DENTISTS, filters, locale),
    [filters, locale]
  );

  const activeCount = countActiveFilters(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("discover.title")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("discover.subtitle")}</p>
      </div>

      <div className="mb-8 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder={t("discover.searchPlaceholder")}
            value={filters.query}
            onChange={(e) =>
              setFilters({ ...filters, query: e.target.value })
            }
            className="h-12 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-sm shadow-soft outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <DiscoverFiltersButton
          onClick={() => setMobileFiltersOpen(true)}
          activeCount={activeCount}
        />
      </div>

      <div className="flex gap-8">
        <DiscoverFiltersPanel
          filters={filters}
          onChange={setFilters}
          resultCount={filtered.length}
          mobileOpen={mobileFiltersOpen}
          onMobileClose={() => setMobileFiltersOpen(false)}
        />

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
              <p className="text-lg font-medium">{t("common.noResults")}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("common.tryAdjustFilters")}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((dentist, index) => (
                <DentistCard key={dentist.id} dentist={dentist} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
