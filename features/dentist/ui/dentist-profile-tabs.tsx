"use client";

import type { TranslationKey } from "@/lib/i18n";
import { useTranslation } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

const TABS: { id: string; key: TranslationKey }[] = [
  { id: "portfolio", key: "profile.tabs.portfolio" },
  { id: "about", key: "profile.tabs.about" },
  { id: "credentials", key: "profile.tabs.credentials" },
  { id: "workplaces", key: "profile.tabs.workplaces" },
  { id: "reviews", key: "profile.tabs.reviews" },
];

interface DentistProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  reviewCount: number;
}

export function DentistProfileTabs({
  activeTab,
  onTabChange,
  reviewCount,
}: DentistProfileTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mt-8 border-b border-border">
        <nav className="-mb-px flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {t(tab.key)}
              {tab.id === "reviews" && (
                <span className="ml-1.5 text-muted-foreground">
                  ({reviewCount})
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
