"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/providers/locale-provider";

const navItems = [
  {
    href: "/dashboard",
    labelKey: "dashboard.admin.nav.overview" as const,
    exact: true,
  },
  {
    href: "/dashboard/users",
    labelKey: "dashboard.admin.nav.users" as const,
    exact: false,
  },
  {
    href: "/dashboard/documents",
    labelKey: "dashboard.admin.nav.documents" as const,
    exact: false,
  },
  {
    href: "/dashboard/verifications",
    labelKey: "dashboard.admin.nav.verifications" as const,
    exact: false,
  },
  {
    href: "/dashboard/reviews",
    labelKey: "dashboard.admin.nav.reviews" as const,
    exact: false,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside className="w-full shrink-0 lg:w-52">
      <nav className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
