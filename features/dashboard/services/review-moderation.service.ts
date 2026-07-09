import {
  MOCK_DENTISTS,
  type MockReview,
} from "@/features/dentist/data/mock-dentists";
import type { LocalizedString } from "@/lib/i18n/types";
import { ReviewStatus } from "@/types/enums";

const REVIEW_STATUS_KEY = "dentistry-review-status";
const SUBMITTED_REVIEWS_KEY = "dentistry-submitted-reviews";

export interface ModerationReview {
  id: string;
  dentistSlug: string;
  dentistName: string;
  patientName: string;
  rating: number;
  content: LocalizedString;
  date: string;
  status: ReviewStatus;
  source: "mock" | "submitted";
}

type ReviewStatusMap = Record<string, ReviewStatus>;

function reviewKey(dentistSlug: string, reviewId: string) {
  return `${dentistSlug}::${reviewId}`;
}

function getStatusMap(): ReviewStatusMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(REVIEW_STATUS_KEY);
    return raw ? (JSON.parse(raw) as ReviewStatusMap) : {};
  } catch {
    return {};
  }
}

function saveStatusMap(map: ReviewStatusMap) {
  localStorage.setItem(REVIEW_STATUS_KEY, JSON.stringify(map));
}

function getSubmittedReviews(): ModerationReview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SUBMITTED_REVIEWS_KEY);
    return raw ? (JSON.parse(raw) as ModerationReview[]) : [];
  } catch {
    return [];
  }
}

function getReviewStatus(
  dentistSlug: string,
  reviewId: string
): ReviewStatus {
  const submitted = getSubmittedReviews().find(
    (r) => r.dentistSlug === dentistSlug && r.id === reviewId
  );
  if (submitted) return submitted.status;

  const map = getStatusMap();
  const key = reviewKey(dentistSlug, reviewId);
  return map[key] ?? ReviewStatus.APPROVED;
}

function toModerationReview(
  dentistSlug: string,
  dentistName: string,
  review: MockReview,
  source: "mock" | "submitted"
): ModerationReview {
  return {
    id: review.id,
    dentistSlug,
    dentistName,
    patientName: review.patientName,
    rating: review.rating,
    content: review.content,
    date: review.date,
    status: getReviewStatus(dentistSlug, review.id),
    source,
  };
}

export const reviewModerationService = {
  getReviewStatus,

  getApprovedReviews(dentistSlug: string): MockReview[] {
    const dentist = MOCK_DENTISTS.find((d) => d.slug === dentistSlug);
    const approvedMock =
      dentist?.reviews.filter(
        (r) => getReviewStatus(dentistSlug, r.id) === ReviewStatus.APPROVED
      ) ?? [];

    const approvedSubmitted = getSubmittedReviews()
      .filter(
        (r) =>
          r.dentistSlug === dentistSlug &&
          r.status === ReviewStatus.APPROVED
      )
      .map((r) => ({
        id: r.id,
        patientName: r.patientName,
        rating: r.rating,
        content: r.content,
        date: r.date,
        helpfulCount: 0,
      }));

    return [...approvedMock, ...approvedSubmitted].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  getModerationQueue(): ModerationReview[] {
    const queue: ModerationReview[] = [];

    for (const dentist of MOCK_DENTISTS) {
      for (const review of dentist.reviews) {
        const item = toModerationReview(
          dentist.slug,
          dentist.fullName,
          review,
          "mock"
        );
        if (item.status !== ReviewStatus.APPROVED) {
          queue.push(item);
        }
      }
    }

    for (const review of getSubmittedReviews()) {
      if (review.status !== ReviewStatus.APPROVED) {
        queue.push(review);
      }
    }

    return queue.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  getAllReviews(): ModerationReview[] {
    const all: ModerationReview[] = [];

    for (const dentist of MOCK_DENTISTS) {
      for (const review of dentist.reviews) {
        all.push(
          toModerationReview(dentist.slug, dentist.fullName, review, "mock")
        );
      }
    }

    all.push(...getSubmittedReviews());

    return all.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  getPendingCount(): number {
    return this.getModerationQueue().filter(
      (r) => r.status === ReviewStatus.PENDING
    ).length;
  },

  setReviewStatus(
    dentistSlug: string,
    reviewId: string,
    status: ReviewStatus
  ) {
    const submitted = getSubmittedReviews();
    const submittedIndex = submitted.findIndex(
      (r) => r.dentistSlug === dentistSlug && r.id === reviewId
    );

    if (submittedIndex >= 0) {
      submitted[submittedIndex] = { ...submitted[submittedIndex], status };
      localStorage.setItem(SUBMITTED_REVIEWS_KEY, JSON.stringify(submitted));
      return;
    }

    const map = getStatusMap();
    map[reviewKey(dentistSlug, reviewId)] = status;
    saveStatusMap(map);
  },

  seedDemoPendingReviews() {
    const map = getStatusMap();
    const seeds = [
      { slug: "gunay-mammadova", reviewId: "r1" },
      { slug: "elcin-aliyev", reviewId: "r1" },
      { slug: "aynur-hasanova", reviewId: "r1" },
    ];

    let changed = false;
    for (const { slug, reviewId } of seeds) {
      const key = reviewKey(slug, reviewId);
      const dentist = MOCK_DENTISTS.find((d) => d.slug === slug);
      const review = dentist?.reviews.find((r) => r.id === reviewId);
      if (review && !map[key]) {
        map[key] = ReviewStatus.PENDING;
        changed = true;
      }
    }

    if (changed) {
      saveStatusMap(map);
    }

    const submitted = getSubmittedReviews();
    if (submitted.length === 0) {
      const demoSubmitted: ModerationReview[] = [
        {
          id: "sub-1",
          dentistSlug: "nigar-quliyeva",
          dentistName: "Dr. Nigar Quliyeva",
          patientName: "Aysel M.",
          rating: 4,
          content: {
            az: "Çox peşəkar yanaşma, amma gözləmə müddəti uzun idi.",
            en: "Very professional approach, but the wait time was long.",
          },
          date: "2026-01-20",
          status: ReviewStatus.PENDING,
          source: "submitted",
        },
        {
          id: "sub-2",
          dentistSlug: "ramin-ismayilov",
          dentistName: "Dr. Ramin İsmayılov",
          patientName: "Orxan T.",
          rating: 5,
          content: {
            az: "İmplant əməliyyatı mükəmməl keçdi. Təşəkkürlər!",
            en: "The implant procedure went perfectly. Thank you!",
          },
          date: "2026-02-05",
          status: ReviewStatus.PENDING,
          source: "submitted",
        },
      ];
      localStorage.setItem(
        SUBMITTED_REVIEWS_KEY,
        JSON.stringify(demoSubmitted)
      );
    }
  },
};
