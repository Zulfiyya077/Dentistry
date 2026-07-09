"use client";

import { AdminReviewsContent } from "@/features/dashboard/ui/admin/admin-reviews-content";
import { AdminLayout } from "@/features/dashboard/ui/admin/admin-layout";

export function AdminReviewsPageContent() {
  return (
    <AdminLayout
      titleKey="dashboard.admin.reviews.title"
      subtitleKey="dashboard.admin.reviews.subtitle"
    >
      <AdminReviewsContent />
    </AdminLayout>
  );
}
