"use client";

import { AdminDocumentsContent } from "@/features/dashboard/ui/admin/admin-documents-content";
import { AdminLayout } from "@/features/dashboard/ui/admin/admin-layout";

export function AdminDocumentsPageContent() {
  return (
    <AdminLayout
      titleKey="dashboard.admin.documents.title"
      subtitleKey="dashboard.admin.documents.subtitle"
    >
      <AdminDocumentsContent />
    </AdminLayout>
  );
}
