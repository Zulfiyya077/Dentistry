"use client";

import { useState } from "react";
import type { MockDentist } from "@/features/dentist/data/mock-dentists";
import { DentistAboutSection } from "./dentist-about-section";
import { DentistCredentialsSection } from "./dentist-credentials-section";
import { DentistPortfolioSection } from "./dentist-portfolio-section";
import { DentistProfileHeader } from "./dentist-profile-header";
import { DentistProfileTabs } from "./dentist-profile-tabs";
import { DentistReputationScore } from "./dentist-reputation-score";
import { DentistReviewsSection } from "./dentist-reviews-section";
import { DentistWorkplacesSection } from "./dentist-workplaces-section";

interface DentistProfileContentProps {
  dentist: MockDentist;
}

export function DentistProfileContent({ dentist }: DentistProfileContentProps) {
  const [activeTab, setActiveTab] = useState("portfolio");

  return (
    <>
      <DentistProfileHeader dentist={dentist} />
      <DentistReputationScore dentist={dentist} />
      <DentistProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        reviewCount={dentist.reviewCount}
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
            reviews={dentist.reviews}
            averageRating={dentist.rating}
          />
        )}
      </div>
    </>
  );
}
