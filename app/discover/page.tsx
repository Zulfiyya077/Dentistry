import { Suspense } from "react";
import { PageLayout } from "@/widgets/page-layout/page-layout";
import { DiscoverPageContent } from "@/features/discover/ui/discover-page-content";
import { Skeleton } from "@/shared/ui/skeleton";

export const metadata = {
  title: "Discover",
  description: "Explore verified dentists and find the right specialist for you.",
};

function DiscoverLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="mt-4 h-5 w-96" />
      <Skeleton className="mt-8 h-12 w-full rounded-xl" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <PageLayout>
      <Suspense fallback={<DiscoverLoading />}>
        <DiscoverPageContent />
      </Suspense>
    </PageLayout>
  );
}
