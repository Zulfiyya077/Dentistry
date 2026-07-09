"use client";

import { AdminVerificationsContent } from "@/features/dashboard/ui/admin/admin-verifications-content";
import { AdminLayout } from "@/features/dashboard/ui/admin/admin-layout";

export function AdminVerificationsPageContent() {
  return (
    <AdminLayout
      titleKey="dashboard.admin.verifications.title"
      subtitleKey="dashboard.admin.verifications.subtitle"
    >
      <AdminVerificationsContent />
    </AdminLayout>
  );
}
