"use client";

import { useRequireAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/locale-provider";
import { PageLayout } from "@/widgets/page-layout/page-layout";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  AdminDashboard,
  DentistDashboard,
  PatientDashboard,
} from "@/features/dashboard/ui/dashboard-content";
import { AdminLayout } from "@/features/dashboard/ui/admin/admin-layout";
import { UserRole } from "@/types/enums";
import { mockAuthService } from "@/features/auth/services/mock-auth.service";

export function DashboardPageContent() {
  const { user, isLoading } = useRequireAuth();
  const { t } = useTranslation();

  const storedUser =
    typeof window !== "undefined"
      ? mockAuthService.getSession()?.user
      : null;
  const activeUser = user ?? storedUser ?? null;

  if (isLoading) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-7xl px-4 py-12">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-8 h-48 w-full rounded-2xl" />
        </div>
      </PageLayout>
    );
  }

  if (!activeUser) {
    return null;
  }

  const titles: Record<UserRole, { title: string; subtitle: string }> = {
    [UserRole.GUEST]: { title: "", subtitle: "" },
    [UserRole.PATIENT]: {
      title: t("dashboard.patient.title"),
      subtitle: t("dashboard.patient.subtitle"),
    },
    [UserRole.DOCTOR]: {
      title: t("dashboard.doctor.title"),
      subtitle: t("dashboard.doctor.subtitle"),
    },
    [UserRole.ADMIN]: {
      title: t("dashboard.admin.title"),
      subtitle: t("dashboard.admin.subtitle"),
    },
  };

  const { title, subtitle } = titles[activeUser.role];

  if (activeUser.role === UserRole.ADMIN) {
    return (
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    );
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-muted-foreground">
            {t("dashboard.welcome", { name: activeUser.displayName })}
          </p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {activeUser.role === UserRole.PATIENT && <PatientDashboard />}
        {activeUser.role === UserRole.DOCTOR && (
          <DentistDashboard dentistSlug={activeUser.dentistSlug} />
        )}
      </div>
    </PageLayout>
  );
}
