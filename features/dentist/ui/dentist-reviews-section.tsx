"use client";

import { ThumbsUp } from "lucide-react";
import type { MockReview } from "@/features/dentist/data/mock-dentists";
import { resolveLocalized } from "@/lib/i18n/types";
import { useTranslation } from "@/providers/locale-provider";
import { StarRating } from "@/shared/ui/star-rating/star-rating";

interface DentistReviewsSectionProps {
  reviews: MockReview[];
  averageRating: number;
}

export function DentistReviewsSection({
  reviews,
  averageRating,
}: DentistReviewsSectionProps) {
  const { locale, t } = useTranslation();

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
        {t("profile.noReviews")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
        <div>
          <StarRating rating={averageRating} size="md" />
          <p className="mt-1 text-sm text-muted-foreground">
            {t("common.basedOnReviews", { count: reviews.length })}
          </p>
        </div>
      </div>

      {reviews.map((review) => (
        <article
          key={review.id}
          className="rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          <div>
            <p className="font-medium">{review.patientName}</p>
            <div className="mt-1 flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-xs text-muted-foreground">
                {new Date(review.date).toLocaleDateString(
                  locale === "az" ? "az-Latn-AZ" : "en-US",
                  { year: "numeric", month: "short", day: "numeric" }
                )}
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {resolveLocalized(review.content, locale)}
          </p>
          <button
            type="button"
            className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {t("common.helpful")} ({review.helpfulCount})
          </button>
        </article>
      ))}
    </div>
  );
}
