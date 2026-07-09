"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { dentistProfileService } from "@/features/dentist/services/dentist-profile.service";
import { DentistProfileContent } from "@/features/dentist/ui/dentist-profile-content";
import { getDentistBySlug } from "@/features/dentist/data/mock-dentists";

interface DentistProfilePageContentProps {
  slug: string;
}

export function DentistProfilePageContent({
  slug,
}: DentistProfilePageContentProps) {
  const [ready, setReady] = useState(false);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    const mockExists = !!getDentistBySlug(slug);
    const mergedExists = !!dentistProfileService.getMergedProfile(slug);
    setExists(mockExists || mergedExists);
    setReady(true);
  }, [slug]);

  if (!ready) return null;
  if (!exists) notFound();

  return <DentistProfileContent slug={slug} />;
}
