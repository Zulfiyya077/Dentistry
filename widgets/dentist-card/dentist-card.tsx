"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Bookmark,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import type { MockDentist } from "@/features/dentist/data/mock-dentists";
import { dentistActionsService } from "@/features/dentist/services/dentist-actions.service";
import { resolveLocalized } from "@/lib/i18n/types";
import { useTranslation } from "@/providers/locale-provider";
import { showToast } from "@/lib/toast";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/lib/utils";

interface DentistCardProps {
  dentist: MockDentist;
  index?: number;
}

export function DentistCard({ dentist, index = 0 }: DentistCardProps) {
  const { locale, t } = useTranslation();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    setIsBookmarked(dentistActionsService.isBookmarked(dentist.id));
  }, [dentist.id]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = dentistActionsService.toggleBookmark(dentist.id);
    setIsBookmarked(next);
    showToast(
      next ? t("profile.bookmarkSuccess") : t("profile.bookmarkRemoved")
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/dentists/${dentist.slug}`}>
        <article className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
          <div className="relative h-52 overflow-hidden">
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br transition-transform duration-500 group-hover:scale-105",
                dentist.coverGradient
              )}
            />

            <div className="absolute inset-0 flex translate-y-full gap-1 p-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {dentist.portfolioPreview.map((color, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-lg bg-gradient-to-br shadow-inner",
                    color
                  )}
                />
              ))}
            </div>

            <div className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-xl font-bold text-primary shadow-card ring-4 ring-card transition-transform duration-300 group-hover:scale-105">
              {dentist.avatarInitial}
            </div>

            <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-1.5">
              {dentist.isVerified && (
                <Badge variant="verified">
                  <BadgeCheck className="h-3 w-3" />
                  {t("common.verified")}
                </Badge>
              )}
              {dentist.isFeatured && (
                <Badge variant="premium">{t("common.topRated")}</Badge>
              )}
              {dentist.isOnline && (
                <Badge variant="secondary">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  {t("common.online")}
                </Badge>
              )}
            </div>

            <button
              type="button"
              onClick={handleBookmark}
              className={cn(
                "absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-xl bg-card/90 shadow-soft backdrop-blur-sm transition-all group-hover:opacity-100",
                isBookmarked
                  ? "text-primary opacity-100"
                  : "text-muted-foreground opacity-0 hover:text-primary"
              )}
              aria-label={t("profile.bookmark")}
            >
              <Bookmark
                className={cn("h-4 w-4", isBookmarked && "fill-current")}
              />
            </button>
          </div>

          <div className="p-5">
            <h3 className="font-semibold leading-tight transition-colors group-hover:text-primary">
              {dentist.fullName}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {resolveLocalized(dentist.specialization, locale)}
            </p>

            <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>
                {resolveLocalized(dentist.city, locale)},{" "}
                {resolveLocalized(dentist.country, locale)}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-semibold">{dentist.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({dentist.reviewCount})
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {dentist.followerCount}
                </span>
                <span className="font-medium text-foreground">
                  {dentist.priceRange}
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
