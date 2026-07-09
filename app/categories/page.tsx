import { Suspense } from "react";
import { PageLayout } from "@/widgets/page-layout/page-layout";
import { CategoriesPageContent } from "@/features/categories/ui/categories-page-content";
import { Skeleton } from "@/shared/ui/skeleton";

export const metadata = {
  title: "Categories",
};

function CategoriesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <Skeleton className="mx-auto h-10 w-64" />
      <Skeleton className="mx-auto mt-4 h-5 w-96" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-52 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <PageLayout>
      <Suspense fallback={<CategoriesLoading />}>
        <CategoriesPageContent />
      </Suspense>
    </PageLayout>
  );
}
