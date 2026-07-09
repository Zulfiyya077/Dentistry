"use client";

import { useEffect, useState } from "react";
import type { MockDentist } from "@/features/dentist/data/mock-dentists";
import { credentialDocumentsService } from "@/features/dentist/services/credential-documents.service";
import { dentistProfileService } from "@/features/dentist/services/dentist-profile.service";
import { DentistProfileActions } from "@/features/dentist/ui/dentist-profile-actions";
import { resolveLocalized } from "@/lib/i18n/types";
import { useTranslation } from "@/providers/locale-provider";
import { Badge } from "@/shared/ui/badge";

interface DentistProfileHeaderProps {
  dentist: MockDentist;
}

export function DentistProfileHeader({ dentist }: DentistProfileHeaderProps) {
  const { locale, t } = useTranslation();
  const [coverUrl, setCoverUrl] = useState<string | undefined>();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [documentVerified, setDocumentVerified] = useState(false);

  useEffect(() => {
    const merged = dentistProfileService.getMergedProfile(dentist.slug);
    setCoverUrl(merged?.coverImageUrl);
    setAvatarUrl(merged?.avatarImageUrl);
    setDocumentVerified(
      credentialDocumentsService.isDocumentVerified(dentist.slug)
    );
  }, [dentist.slug]);

  return (
    <div>
      <div className="relative aspect-[21/9] max-h-80 w-full overflow-hidden bg-muted sm:aspect-[3/1]">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-end bg-gradient-to-b from-muted to-background p-6">
            <p className="text-sm text-muted-foreground">
              {t("common.coverPhotoPlaceholder")}
            </p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-14 flex flex-col gap-6 sm:-mt-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-md border-4 border-background bg-muted shadow-elevated sm:h-32 sm:w-32">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={dentist.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-muted-foreground">
                  {dentist.avatarInitial}
                </div>
              )}
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold sm:text-3xl">
                  {dentist.fullName}
                </h1>
                {documentVerified && (
                  <Badge variant="document">
                    {t("credentials.documentVerified")}
                  </Badge>
                )}
                {dentist.isVerified && !documentVerified && (
                  <Badge variant="verified">
                    {t("common.verifiedDentist")}
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-muted-foreground">
                {resolveLocalized(dentist.title, locale)}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>
                  {resolveLocalized(dentist.city, locale)},{" "}
                  {resolveLocalized(dentist.country, locale)}
                </span>
                <span>
                  {dentist.experienceYears} {t("common.yearsExperience")}
                </span>
                <span>
                  {dentist.profileViews.toLocaleString()} {t("common.views")}
                </span>
              </div>
            </div>
          </div>

          <DentistProfileActions dentist={dentist} />
        </div>
      </div>
    </div>
  );
}
