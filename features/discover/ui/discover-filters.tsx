"use client";

import { SlidersHorizontal, X } from "lucide-react";
import {
  CITY_OPTIONS,
  COUNTRY_OPTIONS,
  SPECIALIZATION_KEYS,
  getSpecializationLabel,
} from "@/features/dentist/data/mock-dentists";
import { resolveLocalized } from "@/lib/i18n/types";
import { useTranslation } from "@/providers/locale-provider";
import { Button } from "@/shared/ui/button";
import { cn } from "@/lib/utils";

export interface DiscoverFilters {
  query: string;
  countryCode: string;
  cityId: string;
  specializationKey: string;
  minRating: number;
  verifiedOnly: boolean;
  onlineOnly: boolean;
  sortBy: "rating" | "reviews" | "experience";
}

export const DEFAULT_FILTERS: DiscoverFilters = {
  query: "",
  countryCode: "",
  cityId: "",
  specializationKey: "",
  minRating: 0,
  verifiedOnly: false,
  onlineOnly: false,
  sortBy: "rating",
};

interface DiscoverFiltersPanelProps {
  filters: DiscoverFilters;
  onChange: (filters: DiscoverFilters) => void;
  resultCount: number;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function DiscoverFiltersPanel({
  filters,
  onChange,
  resultCount,
  mobileOpen,
  onMobileClose,
}: DiscoverFiltersPanelProps) {
  const { locale, t } = useTranslation();
  const cities = filters.countryCode
    ? CITY_OPTIONS[filters.countryCode] ?? []
    : [];

  const update = (partial: Partial<DiscoverFilters>) => {
    onChange({ ...filters, ...partial });
  };

  const reset = () => onChange(DEFAULT_FILTERS);

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">{t("discover.filtersTitle")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("discover.doctorsFound", { count: resultCount })}
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="text-xs font-medium text-primary hover:underline"
        >
          {t("common.resetAll")}
        </button>
      </div>

      <FilterGroup label={t("discover.speciality")}>
        <select
          value={filters.specializationKey}
          onChange={(e) => update({ specializationKey: e.target.value })}
          className="filter-select"
        >
          <option value="">{t("discover.allSpecialities")}</option>
          {SPECIALIZATION_KEYS.map((key) => (
            <option key={key} value={key}>
              {getSpecializationLabel(key, locale)}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label={t("discover.country")}>
        <select
          value={filters.countryCode}
          onChange={(e) =>
            update({ countryCode: e.target.value, cityId: "" })
          }
          className="filter-select"
        >
          <option value="">{t("discover.allCountries")}</option>
          {COUNTRY_OPTIONS.map((c) => (
            <option key={c.code} value={c.code}>
              {resolveLocalized(c.label, locale)}
            </option>
          ))}
        </select>
      </FilterGroup>

      {cities.length > 0 && (
        <FilterGroup label={t("discover.city")}>
          <select
            value={filters.cityId}
            onChange={(e) => update({ cityId: e.target.value })}
            className="filter-select"
          >
            <option value="">{t("discover.allCities")}</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {resolveLocalized(c.label, locale)}
              </option>
            ))}
          </select>
        </FilterGroup>
      )}

      <FilterGroup label={t("discover.minRating")}>
        <div className="flex gap-2">
          {[0, 4, 4.5, 4.8].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => update({ minRating: r })}
              className={cn(
                "flex-1 rounded-lg border py-2 text-xs font-medium transition-colors",
                filters.minRating === r
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {r === 0 ? t("discover.any") : `${r}+`}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label={t("discover.sortBy")}>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            update({
              sortBy: e.target.value as DiscoverFilters["sortBy"],
            })
          }
          className="filter-select"
        >
          <option value="rating">{t("discover.sortRating")}</option>
          <option value="reviews">{t("discover.sortReviews")}</option>
          <option value="experience">{t("discover.sortExperience")}</option>
        </select>
      </FilterGroup>

      <div className="space-y-3">
        <Toggle
          label={t("discover.verifiedOnly")}
          checked={filters.verifiedOnly}
          onChange={(v) => update({ verifiedOnly: v })}
        />
        <Toggle
          label={t("discover.onlineOnly")}
          checked={filters.onlineOnly}
          onChange={(v) => update({ onlineOnly: v })}
        />
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-soft">
          {content}
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-card p-6 shadow-elevated">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">{t("discover.filtersTitle")}</h2>
              <button
                type="button"
                onClick={onMobileClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {content}
            <Button className="mt-6 w-full" onClick={onMobileClose}>
              {t("discover.showDoctors", { count: resultCount })}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </label>
  );
}

export function DiscoverFiltersButton({
  onClick,
  activeCount,
}: {
  onClick: () => void;
  activeCount: number;
}) {
  const { t } = useTranslation();

  return (
    <Button variant="secondary" size="sm" onClick={onClick} className="lg:hidden">
      <SlidersHorizontal className="h-4 w-4" />
      {t("discover.filters")}
      {activeCount > 0 && (
        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
          {activeCount}
        </span>
      )}
    </Button>
  );
}
