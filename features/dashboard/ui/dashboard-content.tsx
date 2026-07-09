"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Bookmark,
  Calendar,
  Clock,
  Eye,
  LayoutDashboard,
  MessageSquare,
  Star,
  UserPlus,
  Users,
} from "lucide-react";
import {
  MOCK_DENTISTS,
} from "@/features/dentist/data/mock-dentists";
import {
  dentistActionsService,
  type MockAppointment,
} from "@/features/dentist/services/dentist-actions.service";
import { resolveLocalized } from "@/lib/i18n/types";
import { showToast } from "@/lib/toast";
import { useTranslation } from "@/providers/locale-provider";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { DentistCard } from "@/widgets/dentist-card/dentist-card";
import { adminService } from "@/features/dashboard/services/admin.service";
import { reviewModerationService } from "@/features/dashboard/services/review-moderation.service";
import { dentistProfileService } from "@/features/dentist/services/dentist-profile.service";
import { VerificationStatus, AppointmentStatus } from "@/types/enums";
import type { TranslationKey } from "@/lib/i18n";

const appointmentStatusLabelKey: Record<AppointmentStatus, TranslationKey> = {
  [AppointmentStatus.PENDING]: "dashboard.appointments.pending",
  [AppointmentStatus.CONFIRMED]: "dashboard.appointments.confirmed",
  [AppointmentStatus.CANCELLED]: "dashboard.appointments.cancelled",
};

function appointmentBadgeVariant(status: AppointmentStatus) {
  switch (status) {
    case AppointmentStatus.CONFIRMED:
      return "verified" as const;
    case AppointmentStatus.CANCELLED:
      return "outline" as const;
    default:
      return "secondary" as const;
  }
}

function usePatientDashboardData() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<MockAppointment[]>([]);
  const [follows, setFollows] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    setBookmarks(dentistActionsService.getBookmarks());
    setAppointments(
      [...dentistActionsService.getAppointments()].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
    setFollows(dentistActionsService.getFollows());
  }, []);

  useEffect(() => {
    refresh();
    setMounted(true);
  }, [refresh]);

  useEffect(() => {
    const handleRefresh = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", handleRefresh);

    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", handleRefresh);
    };
  }, [refresh]);

  return { bookmarks, appointments, follows, mounted };
}

function EmptyState({
  message,
  actionLabel,
  actionHref,
}: {
  message: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border py-12 text-center">
      <p className="text-muted-foreground">{message}</p>
      <Link href={actionHref} className="mt-4 inline-block">
        <Button>{actionLabel}</Button>
      </Link>
    </div>
  );
}

export function PatientDashboard() {
  const { t } = useTranslation();
  const { bookmarks, appointments, follows, mounted } = usePatientDashboardData();

  const bookmarkedDentists = MOCK_DENTISTS.filter((d) =>
    bookmarks.includes(d.id)
  );
  const followedDentists = MOCK_DENTISTS.filter((d) => follows.includes(d.id));

  const stats = [
    {
      label: t("dashboard.patient.bookmarks"),
      value: bookmarks.length.toString(),
      icon: Bookmark,
    },
    {
      label: t("dashboard.patient.follows"),
      value: follows.length.toString(),
      icon: UserPlus,
    },
    {
      label: t("dashboard.patient.appointments"),
      value: appointments.length.toString(),
      icon: Calendar,
    },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {t("dashboard.patient.myAppointments")}
          </h3>
          {appointments.length > 0 && (
            <Link href="/dashboard/appointments">
              <Button variant="ghost" size="sm">
                {t("dashboard.admin.viewAll")}
              </Button>
            </Link>
          )}
        </div>
        {appointments.length === 0 ? (
          <EmptyState
            message={t("dashboard.patient.noAppointments")}
            actionLabel={t("dashboard.patient.browse")}
            actionHref="/discover"
          />
        ) : (
          <div className="space-y-3">
            {appointments.slice(0, 3).map((apt) => (
              <div
                key={apt.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{apt.dentistName}</p>
                    <Badge variant={appointmentBadgeVariant(apt.status)}>
                      {t(appointmentStatusLabelKey[apt.status])}
                    </Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {apt.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {apt.time}
                    </span>
                  </div>
                  {apt.note && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {apt.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">
          {t("dashboard.patient.myFollows")}
        </h3>
        {followedDentists.length === 0 ? (
          <EmptyState
            message={t("dashboard.patient.noFollows")}
            actionLabel={t("dashboard.patient.browse")}
            actionHref="/discover"
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {followedDentists.map((dentist, index) => (
              <DentistCard key={dentist.id} dentist={dentist} index={index} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">
          {t("dashboard.patient.bookmarks")}
        </h3>
        {bookmarkedDentists.length === 0 ? (
          <EmptyState
            message={t("dashboard.patient.noBookmarks")}
            actionLabel={t("dashboard.patient.browse")}
            actionHref="/discover"
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarkedDentists.map((dentist, index) => (
              <DentistCard key={dentist.id} dentist={dentist} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function DentistDashboard({ dentistSlug }: { dentistSlug?: string }) {
  const { locale, t } = useTranslation();
  const [dentist, setDentist] = useState(
    dentistSlug ? dentistProfileService.getMergedProfile(dentistSlug) : undefined
  );
  const [approvedReviews, setApprovedReviews] = useState<
    ReturnType<typeof reviewModerationService.getApprovedReviews>
  >([]);
  const [pendingAppointments, setPendingAppointments] = useState(0);
  const [recentAppointments, setRecentAppointments] = useState<
    ReturnType<typeof dentistActionsService.getAppointmentsForDentist>
  >([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    if (!dentistSlug) return;
    const profile = dentistProfileService.getMergedProfile(dentistSlug);
    setDentist(profile);
    setApprovedReviews(reviewModerationService.getApprovedReviews(dentistSlug));
    if (profile) {
      setFollowerCount(dentistActionsService.getFollowerCount(profile.id));
      const apts = dentistActionsService.getAppointmentsForDentist(profile.id);
      setRecentAppointments(apts.slice(0, 3));
      setPendingAppointments(
        dentistActionsService.getPendingCountForDentist(profile.id)
      );
    }
  }, [dentistSlug]);

  useEffect(() => {
    refresh();
    setMounted(true);
  }, [refresh]);

  useEffect(() => {
    const handleRefresh = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", handleRefresh);

    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", handleRefresh);
    };
  }, [refresh]);

  if (!mounted) return null;

  if (!dentistSlug) {
    return null;
  }

  if (!dentist) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-soft">
        <h3 className="text-lg font-semibold">
          {t("dashboard.doctor.profileNotLinked")}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("dashboard.doctor.profileNotLinkedHint")}
        </p>
        <Link href="/dashboard/profile" className="mt-6 inline-block">
          <Button>{t("dashboard.doctor.editProfile")}</Button>
        </Link>
      </div>
    );
  }

  const reviewCount = approvedReviews.length;
  const averageRating =
    reviewCount > 0
      ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : dentist.rating;

  const stats = [
    {
      label: t("dashboard.doctor.profileViews"),
      value: dentist.profileViews.toLocaleString(),
      icon: Eye,
    },
    {
      label: t("dashboard.doctor.followers"),
      value: (dentist.followerCount + followerCount).toLocaleString(),
      icon: Users,
    },
    {
      label: t("dashboard.doctor.reviews"),
      value: reviewCount.toString(),
      icon: MessageSquare,
    },
    {
      label: t("dashboard.doctor.rating"),
      value: averageRating.toFixed(1),
      icon: Star,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-4 text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={`/dentists/${dentistSlug}`}>
          <Button variant="secondary">
            {t("dashboard.doctor.viewPublicProfile")}
          </Button>
        </Link>
        <Link href="/dashboard/profile">
          <Button variant="secondary">
            {t("dashboard.doctor.editProfile")}
          </Button>
        </Link>
        <Link href="/dashboard/credentials">
          <Button variant="secondary">
            {t("credentials.uploadTitle")}
          </Button>
        </Link>
        <Link href="/dashboard/portfolio">
          <Button variant="secondary">
            {t("dashboard.doctor.managePortfolio")}
          </Button>
        </Link>
        <Link href="/dashboard/appointments">
          <Button>
            {t("dashboard.doctor.manageAppointments")}
            {pendingAppointments > 0 && (
              <span className="ml-1.5 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs">
                {pendingAppointments}
              </span>
            )}
          </Button>
        </Link>
      </div>

      {recentAppointments.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">
              {t("dashboard.doctor.recentAppointments")}
            </h3>
            <Link href="/dashboard/appointments">
              <Button variant="ghost" size="sm">
                {t("dashboard.admin.viewAll")}
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">
                      {apt.patientName ?? t("dashboard.appointments.guestPatient")}
                    </p>
                    <Badge variant={appointmentBadgeVariant(apt.status)}>
                      {t(appointmentStatusLabelKey[apt.status])}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {apt.date} · {apt.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {approvedReviews.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-semibold">{t("dashboard.doctor.recentReviews")}</h3>
          <div className="mt-4 space-y-4">
            {approvedReviews.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="border-b border-border pb-4 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{review.patientName}</span>
                  <span className="text-sm text-warning">★ {review.rating}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {resolveLocalized(review.content, locale)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDentists: 0,
    pendingVerifications: 0,
    pendingReviews: 0,
    totalAppointments: 0,
    totalBookmarks: 0,
    totalFollows: 0,
  });
  const [pendingRequests, setPendingRequests] = useState<
    ReturnType<typeof adminService.getVerificationRequests>
  >([]);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    adminService.seedDemoPendingVerifications();
    reviewModerationService.seedDemoPendingReviews();
    setStats(adminService.getStats());
    setPendingRequests(
      adminService
        .getVerificationRequests()
        .filter((r) => r.status === VerificationStatus.PENDING)
        .slice(0, 3)
    );
  }, []);

  useEffect(() => {
    refresh();
    setMounted(true);
  }, [refresh]);

  useEffect(() => {
    const handleRefresh = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", handleRefresh);

    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", handleRefresh);
    };
  }, [refresh]);

  const statCards = [
    {
      label: t("dashboard.admin.totalDentists"),
      value: stats.totalDentists.toString(),
      icon: Users,
    },
    {
      label: t("dashboard.admin.totalPatients"),
      value: stats.totalPatients.toString(),
      icon: UserPlus,
    },
    {
      label: t("dashboard.admin.pendingVerifications"),
      value: mounted ? stats.pendingVerifications.toString() : "—",
      icon: LayoutDashboard,
    },
    {
      label: t("dashboard.admin.pendingReviews"),
      value: mounted ? stats.pendingReviews.toString() : "—",
      icon: MessageSquare,
    },
    {
      label: t("dashboard.admin.totalAppointments"),
      value: mounted ? stats.totalAppointments.toString() : "—",
      icon: Calendar,
    },
    {
      label: t("dashboard.admin.totalBookmarks"),
      value: mounted ? stats.totalBookmarks.toString() : "—",
      icon: Bookmark,
    },
    {
      label: t("dashboard.patient.follows"),
      value: mounted ? stats.totalFollows.toString() : "—",
      icon: UserPlus,
    },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-4 text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/users">
          <Button
            variant="secondary"
            className="h-auto w-full justify-start p-6"
          >
            <div className="text-left">
              <p className="font-semibold">{t("dashboard.admin.manageUsers")}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("dashboard.admin.manageUsersHint")}
              </p>
            </div>
          </Button>
        </Link>
        <Link href="/dashboard/verifications">
          <Button
            variant="secondary"
            className="h-auto w-full justify-start p-6"
          >
            <div className="text-left">
              <p className="font-semibold">
                {t("dashboard.admin.manageVerifications")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("dashboard.admin.manageVerificationsHint")}
              </p>
            </div>
          </Button>
        </Link>
        <Link href="/dashboard/reviews">
          <Button
            variant="secondary"
            className="h-auto w-full justify-start p-6"
          >
            <div className="text-left">
              <p className="font-semibold">
                {t("dashboard.admin.pendingReviews")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("dashboard.admin.reviews.manageReviewsHint")}
              </p>
            </div>
          </Button>
        </Link>
      </div>

      {pendingRequests.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {t("dashboard.admin.recentPending")}
            </h3>
            <Link href="/dashboard/verifications">
              <Button variant="ghost" size="sm">
                {t("dashboard.admin.viewAll")}
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
              >
                <div>
                  <p className="font-medium">{request.dentistName}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.email}
                  </p>
                </div>
                <Link href="/dashboard/verifications">
                  <Button size="sm" variant="outline">
                    {t("dashboard.admin.review")}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
