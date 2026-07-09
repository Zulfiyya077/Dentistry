"use client";

import { useEffect, useState } from "react";
import {
  Bookmark,
  Calendar,
  Share2,
  UserMinus,
  UserPlus,
} from "lucide-react";
import type { MockDentist } from "@/features/dentist/data/mock-dentists";
import { BookAppointmentModal } from "@/features/dentist/ui/book-appointment-modal";
import { dentistActionsService } from "@/features/dentist/services/dentist-actions.service";
import { useTranslation } from "@/providers/locale-provider";
import { showToast } from "@/lib/toast";
import { Button } from "@/shared/ui/button";
import { cn } from "@/lib/utils";

interface DentistProfileActionsProps {
  dentist: MockDentist;
}

export function DentistProfileActions({ dentist }: DentistProfileActionsProps) {
  const { t } = useTranslation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsFollowing(dentistActionsService.isFollowing(dentist.id));
    setIsBookmarked(dentistActionsService.isBookmarked(dentist.id));
  }, [dentist.id]);

  const handleFollow = () => {
    const next = dentistActionsService.toggleFollow(dentist.id);
    setIsFollowing(next);
    showToast(next ? t("profile.followSuccess") : t("profile.unfollowSuccess"));
  };

  const handleBookmark = () => {
    const next = dentistActionsService.toggleBookmark(dentist.id);
    setIsBookmarked(next);
    showToast(
      next ? t("profile.bookmarkSuccess") : t("profile.bookmarkRemoved")
    );
  };

  const handleShare = async () => {
    try {
      const result = await dentistActionsService.shareProfile(
        dentist.slug,
        dentist.fullName
      );
      if (result === "copied") {
        showToast(t("profile.linkCopied"));
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        showToast(t("profile.shareFailed"), "error");
      }
    }
  };

  if (!mounted) {
    return (
      <div className="flex flex-wrap gap-2 pb-1">
        <Button disabled>
          <Calendar className="h-4 w-4" />
          {t("common.bookAppointment")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 pb-1">
        <Button onClick={() => setAppointmentOpen(true)}>
          <Calendar className="h-4 w-4" />
          {t("common.bookAppointment")}
        </Button>

        <Button
          variant={isFollowing ? "default" : "secondary"}
          onClick={handleFollow}
        >
          {isFollowing ? (
            <UserMinus className="h-4 w-4" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          {isFollowing ? t("profile.following") : t("common.follow")}
        </Button>

        <Button
          variant="secondary"
          size="icon"
          onClick={handleBookmark}
          aria-label={t("profile.bookmark")}
          className={cn(isBookmarked && "border-primary bg-primary/10 text-primary")}
        >
          <Bookmark
            className={cn("h-4 w-4", isBookmarked && "fill-current")}
          />
        </Button>

        <Button
          variant="secondary"
          size="icon"
          onClick={handleShare}
          aria-label={t("common.share")}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      <BookAppointmentModal
        dentist={dentist}
        open={appointmentOpen}
        onClose={() => setAppointmentOpen(false)}
      />
    </>
  );
}
