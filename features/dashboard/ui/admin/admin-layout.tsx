"use client";

import { useRequireAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/locale-provider";
import type { TranslationKey } from "@/lib/i18n";
import { PageLayout } from "@/widgets/page-layout/page-layout";
import { Skeleton } from "@/shared/ui/skeleton";
import { UserRole } from "@/types/enums";
import { mockAuthService } from "@/features/auth/services/mock-auth.service";
import { AdminSidebar } from "./admin-sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  titleKey?: TranslationKey;
  subtitleKey?: TranslationKey;
}

export function AdminLayout({
  children,
  titleKey,
  subtitleKey,
}: AdminLayoutProps) {
  const { user, isLoading } = useRequireAuth([UserRole.ADMIN]);
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

  if (!activeUser) return null;

  const pageTitle = titleKey ? t(titleKey) : t("dashboard.admin.title");
  const pageSubtitle = subtitleKey
    ? t(subtitleKey)
    : t("dashboard.admin.subtitle");

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="mt-2 text-muted-foreground">
            {t("dashboard.welcome", { name: activeUser.displayName })}
          </p>
          <p className="text-sm text-muted-foreground">{pageSubtitle}</p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <AdminSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </PageLayout>
  );
}
