"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlignCenter,
  Baby,
  ArrowRight,
  CircleDot,
  Crown,
  HeartPulse,
  Scissors,
  Sparkles,
  Stethoscope,
  Star,
  Target,
  Users,
} from "lucide-react";
import type { CategoryConfig } from "@/features/categories/data/category-config";
import type { CategoryStats } from "@/features/categories/data/category-stats";
import { getSpecializationLabel } from "@/features/dentist/data/mock-dentists";
import { resolveLocalized } from "@/lib/i18n/types";
import { useTranslation } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  sparkles: Sparkles,
  "align-center": AlignCenter,
  "circle-dot": CircleDot,
  baby: Baby,
  scissors: Scissors,
  "heart-pulse": HeartPulse,
  target: Target,
  crown: Crown,
  stethoscope: Stethoscope,
} as const;

interface CategoryCardProps {
  category: CategoryConfig;
  stats?: CategoryStats;
  index?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export function CategoryCard({
  category,
  stats,
  index = 0,
  isActive,
  onClick,
}: CategoryCardProps) {
  const { locale, t } = useTranslation();
  const Icon = ICON_MAP[category.icon as keyof typeof ICON_MAP] ?? Sparkles;

  const content = (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
        isActive
          ? "border-primary ring-2 ring-primary/20"
          : "border-border"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity group-hover:opacity-100",
          category.gradient
        )}
      />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card/80 shadow-soft backdrop-blur-sm">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          {stats && stats.dentistCount > 0 && (
            <span className="rounded-full bg-card/80 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
              {stats.dentistCount} {t("categories.dentists")}
            </span>
          )}
        </div>

        <h3 className="mt-4 text-lg font-semibold transition-colors group-hover:text-primary">
          {getSpecializationLabel(category.key, locale)}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {resolveLocalized(category.description, locale)}
        </p>

        {stats && stats.dentistCount > 0 ? (
          <div className="mt-4 flex items-center gap-4 border-t border-border/50 pt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              {stats.averageRating}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {stats.totalReviews} {t("common.reviews")}
            </span>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            {t("categories.noDentistsYet")}
          </p>
        )}

        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          {t("categories.browseCategory")}
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </article>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {onClick ? (
        <button type="button" onClick={onClick} className="w-full text-left">
          {content}
        </button>
      ) : (
        <Link href={`/discover?specialization=${category.key}`}>{content}</Link>
      )}
    </motion.div>
  );
}
