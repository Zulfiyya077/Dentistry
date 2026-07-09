"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { MockDentist } from "@/features/dentist/data/mock-dentists";
import { dentistActionsService } from "@/features/dentist/services/dentist-actions.service";
import { credentialDocumentsService } from "@/features/dentist/services/credential-documents.service";
import { dentistProfileService } from "@/features/dentist/services/dentist-profile.service";
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
  const [coverUrl, setCoverUrl] = useState<string | undefined>();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [documentVerified, setDocumentVerified] = useState(false);

  useEffect(() => {
    setIsBookmarked(dentistActionsService.isBookmarked(dentist.id));
    const merged = dentistProfileService.getMergedProfile(dentist.slug);
    setCoverUrl(merged?.coverImageUrl);
    setAvatarUrl(merged?.avatarImageUrl);
    setDocumentVerified(
      credentialDocumentsService.isDocumentVerified(dentist.slug)
    );
  }, [dentist.id, dentist.slug]);

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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Link href={`/dentists/${dentist.slug}`}>
        <article className="group surface-card overflow-hidden transition-shadow hover:shadow-card">
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverUrl}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full items-end bg-gradient-to-b from-muted to-muted-foreground/10 p-4">
                <p className="text-xs text-muted-foreground">
                  {t("common.photoPlaceholder")}
                </p>
              </div>
            )}

            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {documentVerified && (
                <Badge variant="document">{t("credentials.documentVerified")}</Badge>
              )}
              {dentist.isVerified && !documentVerified && (
                <Badge variant="verified">{t("common.verified")}</Badge>
              )}
            </div>

            <button
              type="button"
              onClick={handleBookmark}
              className={cn(
                "absolute bottom-3 right-3 rounded-md border border-border bg-card/95 px-2 py-1 text-xs font-medium transition-opacity",
                isBookmarked
                  ? "text-primary opacity-100"
                  : "text-muted-foreground opacity-0 group-hover:opacity-100"
              )}
            >
              {isBookmarked ? t("profile.bookmarkSaved") : t("profile.bookmark")}
            </button>
          </div>

          <div className="flex gap-4 p-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={dentist.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-muted-foreground">
                  {dentist.avatarInitial}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold leading-tight">
                {dentist.fullName}
              </h3>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {resolveLocalized(dentist.specialization, locale)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {resolveLocalized(dentist.city, locale)},{" "}
                {resolveLocalized(dentist.country, locale)}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
                <span>
                  <span className="font-semibold">{dentist.rating}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {dentist.reviewCount} {t("common.reviews")}
                  </span>
                </span>
                <span className="font-medium">{dentist.priceRange}</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
