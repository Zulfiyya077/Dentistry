"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CITY_OPTIONS,
  COUNTRY_OPTIONS,
  SPECIALIZATION_KEYS,
  getSpecializationLabel,
  type SpecializationKey,
} from "@/features/dentist/data/mock-dentists";
import { dentistProfileService } from "@/features/dentist/services/dentist-profile.service";
import { useRequireAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/locale-provider";
import { PageLayout } from "@/widgets/page-layout/page-layout";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { showToast } from "@/lib/toast";
import { UserRole } from "@/types/enums";

const profileSchema = z.object({
  titleAz: z.string().min(2),
  titleEn: z.string().min(2),
  biographyAz: z.string().min(10),
  biographyEn: z.string().min(10),
  experienceYears: z.coerce.number().min(0).max(60),
  priceRange: z.string().min(1),
  licenseNumber: z.string().min(1),
  cityId: z.string().min(1),
  countryCode: z.string().min(1),
  specializationKey: z.enum(
    SPECIALIZATION_KEYS as [SpecializationKey, ...SpecializationKey[]]
  ),
  website: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  whatsapp: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function DentistProfileEditContent() {
  const { user, isLoading } = useRequireAuth([UserRole.DOCTOR]);
  const { locale, t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const countryCode = watch("countryCode");
  const cities = CITY_OPTIONS[countryCode] ?? CITY_OPTIONS.az;

  useEffect(() => {
    if (!user?.dentistSlug) return;
    const data = dentistProfileService.getEditData(
      user.dentistSlug,
      user.displayName
    );
    reset(data);
    setMounted(true);
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.dentistSlug) return;
    setIsSubmitting(true);
    try {
      dentistProfileService.saveProfile(user.dentistSlug, user.displayName, {
        ...data,
        website: data.website ?? "",
        instagram: data.instagram ?? "",
        linkedin: data.linkedin ?? "",
        whatsapp: data.whatsapp ?? "",
      });
      showToast(t("dashboard.doctor.profileSaved"), "success");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !mounted) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-8 h-96 w-full rounded-2xl" />
        </div>
      </PageLayout>
    );
  }

  if (!user?.dentistSlug) return null;

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {t("dashboard.doctor.editProfile")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("dashboard.doctor.editProfileSubtitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
        >
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">
              {t("dashboard.doctor.sectionBasic")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t("dashboard.doctor.titleAz")}
                error={errors.titleAz?.message}
              >
                <input className="auth-input w-full" {...register("titleAz")} />
              </Field>
              <Field
                label={t("dashboard.doctor.titleEn")}
                error={errors.titleEn?.message}
              >
                <input className="auth-input w-full" {...register("titleEn")} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t("dashboard.doctor.biographyAz")}
                error={errors.biographyAz?.message}
              >
                <textarea
                  className="auth-input min-h-28 w-full resize-y"
                  {...register("biographyAz")}
                />
              </Field>
              <Field
                label={t("dashboard.doctor.biographyEn")}
                error={errors.biographyEn?.message}
              >
                <textarea
                  className="auth-input min-h-28 w-full resize-y"
                  {...register("biographyEn")}
                />
              </Field>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">
              {t("dashboard.doctor.sectionProfessional")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t("discover.speciality")}
                error={errors.specializationKey?.message}
              >
                <select className="filter-select w-full" {...register("specializationKey")}>
                  {SPECIALIZATION_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {getSpecializationLabel(key, locale)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label={t("common.yearsExperience")}
                error={errors.experienceYears?.message}
              >
                <input
                  type="number"
                  className="auth-input w-full"
                  {...register("experienceYears")}
                />
              </Field>
              <Field
                label={t("discover.country")}
                error={errors.countryCode?.message}
              >
                <select className="filter-select w-full" {...register("countryCode")}>
                  {COUNTRY_OPTIONS.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label[locale]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("discover.city")} error={errors.cityId?.message}>
                <select className="filter-select w-full" {...register("cityId")}>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label[locale]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label={t("common.priceRange")}
                error={errors.priceRange?.message}
              >
                <select className="filter-select w-full" {...register("priceRange")}>
                  <option value="$">$</option>
                  <option value="$$">$$</option>
                  <option value="$$$">$$$</option>
                  <option value="$$$$">$$$$</option>
                </select>
              </Field>
              <Field
                label={t("profile.licenseNumber")}
                error={errors.licenseNumber?.message}
              >
                <input
                  className="auth-input w-full"
                  {...register("licenseNumber")}
                />
              </Field>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">
              {t("profile.socialNetworks")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("profile.website")}>
                <input className="auth-input w-full" {...register("website")} />
              </Field>
              <Field label={t("profile.instagram")}>
                <input className="auth-input w-full" {...register("instagram")} />
              </Field>
              <Field label={t("profile.linkedin")}>
                <input className="auth-input w-full" {...register("linkedin")} />
              </Field>
              <Field label={t("profile.whatsapp")}>
                <input className="auth-input w-full" {...register("whatsapp")} />
              </Field>
            </div>
          </section>

          <div className="flex flex-wrap gap-3 border-t border-border pt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t("dashboard.doctor.saving")
                : t("dashboard.doctor.saveProfile")}
            </Button>
            <Link href="/dashboard">
              <Button type="button" variant="secondary">
                {t("profile.cancel")}
              </Button>
            </Link>
            <Link href={`/dentists/${user.dentistSlug}`}>
              <Button type="button" variant="outline">
                {t("dashboard.doctor.viewPublicProfile")}
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}
