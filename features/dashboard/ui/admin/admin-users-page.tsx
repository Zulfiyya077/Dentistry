"use client";

import { AdminUsersContent } from "@/features/dashboard/ui/admin/admin-users-content";
import { AdminLayout } from "@/features/dashboard/ui/admin/admin-layout";

export function AdminUsersPageContent() {
  return (
    <AdminLayout
      titleKey="dashboard.admin.users.title"
      subtitleKey="dashboard.admin.users.subtitle"
    >
      <AdminUsersContent />
    </AdminLayout>
  );
}
