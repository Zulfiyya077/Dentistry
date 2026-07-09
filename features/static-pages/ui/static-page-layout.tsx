"use client";

import { PageLayout } from "@/widgets/page-layout/page-layout";

interface StaticPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function StaticPageLayout({
  title,
  subtitle,
  children,
}: StaticPageLayoutProps) {
  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
          {subtitle && (
            <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </PageLayout>
  );
}
