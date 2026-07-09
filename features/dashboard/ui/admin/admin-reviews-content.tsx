"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Check, ExternalLink, X } from "lucide-react";
import {
  reviewModerationService,
  type ModerationReview,
} from "@/features/dashboard/services/review-moderation.service";
import { resolveLocalized } from "@/lib/i18n/types";
import { useTranslation } from "@/providers/locale-provider";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { StarRating } from "@/shared/ui/star-rating/star-rating";
import { showToast } from "@/lib/toast";
import { ReviewStatus } from "@/types/enums";
import type { TranslationKey } from "@/lib/i18n";

const statusLabelKey: Record<ReviewStatus, TranslationKey> = {
  [ReviewStatus.PENDING]: "dashboard.admin.reviews.pending",
  [ReviewStatus.APPROVED]: "dashboard.admin.reviews.approved",
  [ReviewStatus.REJECTED]: "dashboard.admin.reviews.rejected",
};

function statusBadgeVariant(status: ReviewStatus) {
  switch (status) {
    case ReviewStatus.APPROVED:
      return "verified" as const;
    case ReviewStatus.REJECTED:
      return "outline" as const;
    default:
      return "secondary" as const;
  }
}

export function AdminReviewsContent() {
  const { locale, t } = useTranslation();
  const [reviews, setReviews] = useState<ModerationReview[]>([]);
  const [filter, setFilter] = useState<ReviewStatus | "all" | "queue">("queue");
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    reviewModerationService.seedDemoPendingReviews();
    if (filter === "queue") {
      setReviews(reviewModerationService.getModerationQueue());
    } else if (filter === "all") {
      setReviews(reviewModerationService.getAllReviews());
    } else {
      setReviews(
        reviewModerationService
          .getAllReviews()
          .filter((r) => r.status === filter)
      );
    }
  }, [filter]);

  useEffect(() => {
    refresh();
    setMounted(true);
  }, [refresh]);

  const pendingCount = reviewModerationService.getPendingCount();

  const handleDecision = (review: ModerationReview, status: ReviewStatus) => {
    reviewModerationService.setReviewStatus(
      review.dentistSlug,
      review.id,
      status
    );
    refresh();
    showToast(
      status === ReviewStatus.APPROVED
        ? t("dashboard.admin.reviews.approvedToast")
        : t("dashboard.admin.reviews.rejectedToast"),
      "success"
    );
  };

  if (!mounted) return null;

  const filterOptions = [
    { value: "queue" as const, label: t("dashboard.admin.reviews.queue") },
    { value: "all" as const, label: t("dashboard.admin.reviews.all") },
    { value: ReviewStatus.PENDING, label: t(statusLabelKey[ReviewStatus.PENDING]) },
    { value: ReviewStatus.APPROVED, label: t(statusLabelKey[ReviewStatus.APPROVED]) },
    { value: ReviewStatus.REJECTED, label: t(statusLabelKey[ReviewStatus.REJECTED]) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {t("dashboard.admin.reviews.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dashboard.admin.reviews.subtitle")}
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="secondary">
            {t("dashboard.admin.reviews.pendingCount", { count: pendingCount })}
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-12 text-center">
          <p className="text-muted-foreground">
            {t("dashboard.admin.reviews.empty")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={`${review.dentistSlug}-${review.id}`}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{review.patientName}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">{review.dentistName}</span>
                    <Badge variant={statusBadgeVariant(review.status)}>
                      {t(statusLabelKey[review.status])}
                    </Badge>
                    {review.source === "submitted" && (
                      <Badge variant="outline">
                        {t("dashboard.admin.reviews.newSubmission")}
                      </Badge>
                    )}
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {resolveLocalized(review.content, locale)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.date).toLocaleDateString(
                      locale === "az" ? "az-Latn-AZ" : "en-US",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/dentists/${review.dentistSlug}`}>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      {t("dashboard.admin.reviews.viewProfile")}
                    </Button>
                  </Link>
                  {review.status === ReviewStatus.PENDING && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleDecision(review, ReviewStatus.APPROVED)
                        }
                      >
                        <Check className="mr-1.5 h-3.5 w-3.5" />
                        {t("dashboard.admin.reviews.approve")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleDecision(review, ReviewStatus.REJECTED)
                        }
                      >
                        <X className="mr-1.5 h-3.5 w-3.5" />
                        {t("dashboard.admin.reviews.reject")}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
