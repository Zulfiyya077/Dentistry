"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MockDentist } from "@/features/dentist/data/mock-dentists";
import { dentistProfileService } from "@/features/dentist/services/dentist-profile.service";
import { reviewModerationService } from "@/features/dashboard/services/review-moderation.service";
import { DentistAboutSection } from "./dentist-about-section";
import { DentistCredentialsSection } from "./dentist-credentials-section";
import { DentistPortfolioSection } from "./dentist-portfolio-section";
import { DentistProfileHeader } from "./dentist-profile-header";
import { DentistProfileTabs } from "./dentist-profile-tabs";
import { DentistReputationScore } from "./dentist-reputation-score";
import { DentistReviewsSection } from "./dentist-reviews-section";
import { DentistWorkplacesSection } from "./dentist-workplaces-section";

interface DentistProfileContentProps {
  slug: string;
}

export function DentistProfileContent({ slug }: DentistProfileContentProps) {
  const [activeTab, setActiveTab] = useState("portfolio");
  const [dentist, setDentist] = useState<MockDentist | undefined>();
  const [approvedReviews, setApprovedReviews] = useState<
    MockDentist["reviews"]
  >([]);

  const refresh = useCallback(() => {
    const profile = dentistProfileService.getMergedProfile(slug);
    setDentist(profile);
    setApprovedReviews(reviewModerationService.getApprovedReviews(slug));
  }, [slug]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handleRefresh = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", handleRefresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", handleRefresh);
    };
  }, [refresh]);

  const averageRating = useMemo(() => {
    if (approvedReviews.length === 0) return dentist?.rating ?? 0;
    const sum = approvedReviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / approvedReviews.length;
  }, [approvedReviews, dentist?.rating]);

  if (!dentist) return null;

  return (
    <>
      <DentistProfileHeader dentist={dentist} />
      <DentistReputationScore dentist={dentist} />
      <DentistProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        reviewCount={approvedReviews.length}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {activeTab === "portfolio" && (
          <DentistPortfolioSection cases={dentist.portfolioCases} />
        )}
        {activeTab === "about" && <DentistAboutSection dentist={dentist} />}
        {activeTab === "credentials" && (
          <DentistCredentialsSection dentist={dentist} />
        )}
        {activeTab === "workplaces" && (
          <DentistWorkplacesSection workplaces={dentist.workplaces} />
        )}
        {activeTab === "reviews" && (
          <DentistReviewsSection
            reviews={approvedReviews}
            averageRating={averageRating}
          />
        )}
      </div>
    </>
  );
}
