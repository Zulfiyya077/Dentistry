"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { MockPortfolioCase } from "@/features/dentist/data/mock-dentists";
import {
  PORTFOLIO_GRADIENT_OPTIONS,
  dentistPortfolioService,
  type PortfolioCaseInput,
} from "@/features/dentist/services/dentist-portfolio.service";
import { useRequireAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/locale-provider";
import { PageLayout } from "@/widgets/page-layout/page-layout";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { showToast } from "@/lib/toast";
import { resolveLocalized } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/enums";

const emptyForm: PortfolioCaseInput = {
  titleAz: "",
  titleEn: "",
  descriptionAz: "",
  descriptionEn: "",
  techniqueAz: "",
  techniqueEn: "",
  durationAz: "",
  durationEn: "",
  beforeColor: PORTFOLIO_GRADIENT_OPTIONS[0],
  afterColor: PORTFOLIO_GRADIENT_OPTIONS[1],
};

export function DentistPortfolioEditContent() {
  const { user, isLoading } = useRequireAuth([UserRole.DOCTOR]);
  const { locale, t } = useTranslation();
  const [cases, setCases] = useState<MockPortfolioCase[]>([]);
  const [mounted, setMounted] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PortfolioCaseInput>(emptyForm);

  const refresh = useCallback(() => {
    if (!user?.dentistSlug) return;
    setCases(dentistPortfolioService.getCases(user.dentistSlug));
  }, [user?.dentistSlug]);

  useEffect(() => {
    refresh();
    setMounted(true);
  }, [refresh]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (item: MockPortfolioCase) => {
    setEditingId(item.id);
    setForm(dentistPortfolioService.getCaseInput(item));
    setFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.dentistSlug) return;

    dentistPortfolioService.saveCase(user.dentistSlug, form, editingId ?? undefined);
    refresh();
    setFormOpen(false);
    showToast(t("dashboard.doctor.portfolioSaved"), "success");
  };

  const handleDelete = (caseId: string) => {
    if (!user?.dentistSlug) return;
    dentistPortfolioService.deleteCase(user.dentistSlug, caseId);
    refresh();
    showToast(t("dashboard.doctor.portfolioDeleted"), "success");
  };

  if (isLoading || !mounted) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-8 h-48 w-full rounded-2xl" />
        </div>
      </PageLayout>
    );
  }

  if (!user?.dentistSlug) return null;

  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {t("dashboard.doctor.managePortfolio")}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {t("dashboard.doctor.managePortfolioSubtitle")}
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-4 w-4" />
            {t("dashboard.doctor.addCase")}
          </Button>
        </div>

        {cases.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="text-muted-foreground">
              {t("dashboard.doctor.noPortfolioCases")}
            </p>
            <Button className="mt-4" onClick={openCreate}>
              {t("dashboard.doctor.addCase")}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cases.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {resolveLocalized(item.title, locale)}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {resolveLocalized(item.description, locale)}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <div
                        className={cn(
                          "h-8 w-12 rounded-lg bg-gradient-to-br",
                          item.beforeColor
                        )}
                      />
                      <div
                        className={cn(
                          "h-8 w-12 rounded-lg bg-gradient-to-br",
                          item.afterColor
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      {t("dashboard.doctor.editCase")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      {t("dashboard.doctor.deleteCase")}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard">
            <Button variant="secondary">{t("dashboard.title")}</Button>
          </Link>
          <Link href={`/dentists/${user.dentistSlug}`}>
            <Button variant="outline">
              {t("dashboard.doctor.viewPublicProfile")}
            </Button>
          </Link>
        </div>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setFormOpen(false)}
          />
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-elevated">
            <h2 className="text-xl font-bold">
              {editingId
                ? t("dashboard.doctor.editCase")
                : t("dashboard.doctor.addCase")}
            </h2>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label={t("dashboard.doctor.caseTitleAz")}
                  value={form.titleAz}
                  onChange={(v) => setForm({ ...form, titleAz: v })}
                  required
                />
                <FormField
                  label={t("dashboard.doctor.caseTitleEn")}
                  value={form.titleEn}
                  onChange={(v) => setForm({ ...form, titleEn: v })}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label={t("dashboard.doctor.caseDescAz")}
                  value={form.descriptionAz}
                  onChange={(v) => setForm({ ...form, descriptionAz: v })}
                  textarea
                  required
                />
                <FormField
                  label={t("dashboard.doctor.caseDescEn")}
                  value={form.descriptionEn}
                  onChange={(v) => setForm({ ...form, descriptionEn: v })}
                  textarea
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label={t("profile.technique") + " (AZ)"}
                  value={form.techniqueAz}
                  onChange={(v) => setForm({ ...form, techniqueAz: v })}
                  required
                />
                <FormField
                  label={t("profile.technique") + " (EN)"}
                  value={form.techniqueEn}
                  onChange={(v) => setForm({ ...form, techniqueEn: v })}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label={t("profile.duration") + " (AZ)"}
                  value={form.durationAz}
                  onChange={(v) => setForm({ ...form, durationAz: v })}
                  required
                />
                <FormField
                  label={t("profile.duration") + " (EN)"}
                  value={form.durationEn}
                  onChange={(v) => setForm({ ...form, durationEn: v })}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ColorSelect
                  label={t("common.before")}
                  value={form.beforeColor}
                  onChange={(v) => setForm({ ...form, beforeColor: v })}
                />
                <ColorSelect
                  label={t("common.after")}
                  value={form.afterColor}
                  onChange={(v) => setForm({ ...form, afterColor: v })}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setFormOpen(false)}
                >
                  {t("profile.cancel")}
                </Button>
                <Button type="submit" className="flex-1">
                  {t("dashboard.doctor.saveCase")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

function FormField({
  label,
  value,
  onChange,
  textarea,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {textarea ? (
        <textarea
          className="auth-input min-h-24 w-full resize-y"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      ) : (
        <input
          className="auth-input w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )}
    </label>
  );
}

function ColorSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex flex-wrap gap-2">
        {PORTFOLIO_GRADIENT_OPTIONS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              "h-10 w-10 rounded-lg bg-gradient-to-br ring-2 ring-offset-2 ring-offset-background transition-all",
              color,
              value === color ? "ring-primary" : "ring-transparent"
            )}
          />
        ))}
      </div>
    </label>
  );
}
