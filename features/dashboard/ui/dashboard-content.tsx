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
  getDentistBySlug,
} from "@/features/dentist/data/mock-dentists";
import {
  dentistActionsService,
  type MockAppointment,
} from "@/features/dentist/services/dentist-actions.service";
import { resolveLocalized } from "@/lib/i18n/types";
import { showToast } from "@/lib/toast";
import { useTranslation } from "@/providers/locale-provider";
import { Button } from "@/shared/ui/button";
import { DentistCard } from "@/widgets/dentist-card/dentist-card";

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
        <h3 className="mb-4 text-lg font-semibold">
          {t("dashboard.patient.myAppointments")}
        </h3>
        {appointments.length === 0 ? (
          <EmptyState
            message={t("dashboard.patient.noAppointments")}
            actionLabel={t("dashboard.patient.browse")}
            actionHref="/discover"
          />
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft"
              >
                <div>
                  <p className="font-semibold">{apt.dentistName}</p>
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
  const dentist = dentistSlug ? getDentistBySlug(dentistSlug) : undefined;
  const [followerCount, setFollowerCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    if (dentist) {
      setFollowerCount(dentistActionsService.getFollowerCount(dentist.id));
    }
  }, [dentist]);

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

  if (!dentist) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-soft">
        <h3 className="text-lg font-semibold">
          {t("dashboard.doctor.profileNotLinked")}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("dashboard.doctor.profileNotLinkedHint")}
        </p>
        <Button
          className="mt-6"
          onClick={() => showToast(t("dashboard.comingSoon"), "info")}
        >
          {t("dashboard.doctor.editProfile")}
        </Button>
      </div>
    );
  }

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
      value: dentist.reviewCount.toString(),
      icon: MessageSquare,
    },
    {
      label: t("dashboard.doctor.rating"),
      value: dentist.rating.toFixed(1),
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
        <Button onClick={() => showToast(t("dashboard.comingSoon"), "info")}>
          {t("dashboard.doctor.editProfile")}
        </Button>
      </div>

      {dentist.reviews.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-semibold">{t("dashboard.doctor.recentReviews")}</h3>
          <div className="mt-4 space-y-4">
            {dentist.reviews.slice(0, 3).map((review) => (
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
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [followCount, setFollowCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    setAppointmentCount(dentistActionsService.getAppointments().length);
    setBookmarkCount(dentistActionsService.getBookmarks().length);
    setFollowCount(dentistActionsService.getFollows().length);
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

  const stats = [
    {
      label: t("dashboard.admin.totalDentists"),
      value: MOCK_DENTISTS.length.toString(),
      icon: Users,
    },
    {
      label: t("dashboard.admin.pendingVerifications"),
      value: MOCK_DENTISTS.filter((d) => !d.isVerified).length.toString(),
      icon: LayoutDashboard,
    },
    {
      label: t("dashboard.admin.totalAppointments"),
      value: mounted ? appointmentCount.toString() : "—",
      icon: Calendar,
    },
    {
      label: t("dashboard.admin.totalBookmarks"),
      value: mounted ? bookmarkCount.toString() : "—",
      icon: Bookmark,
    },
    {
      label: t("dashboard.patient.follows"),
      value: mounted ? followCount.toString() : "—",
      icon: UserPlus,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Button
          variant="secondary"
          className="h-auto justify-start p-6"
          onClick={() => showToast(t("dashboard.comingSoon"), "info")}
        >
          <div className="text-left">
            <p className="font-semibold">{t("dashboard.admin.manageUsers")}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("dashboard.comingSoon")}
            </p>
          </div>
        </Button>
        <Button
          variant="secondary"
          className="h-auto justify-start p-6"
          onClick={() => showToast(t("dashboard.comingSoon"), "info")}
        >
          <div className="text-left">
            <p className="font-semibold">
              {t("dashboard.admin.manageVerifications")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("dashboard.comingSoon")}
            </p>
          </div>
        </Button>
      </div>
    </div>
  );
}
