"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Check, Clock, X } from "lucide-react";
import {
  dentistActionsService,
  type MockAppointment,
} from "@/features/dentist/services/dentist-actions.service";
import { dentistProfileService } from "@/features/dentist/services/dentist-profile.service";
import { useRequireAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/locale-provider";
import { PageLayout } from "@/widgets/page-layout/page-layout";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { showToast } from "@/lib/toast";
import { AppointmentStatus, UserRole } from "@/types/enums";
import type { TranslationKey } from "@/lib/i18n";

const statusLabelKey: Record<AppointmentStatus, TranslationKey> = {
  [AppointmentStatus.PENDING]: "dashboard.appointments.pending",
  [AppointmentStatus.CONFIRMED]: "dashboard.appointments.confirmed",
  [AppointmentStatus.CANCELLED]: "dashboard.appointments.cancelled",
};

function statusBadgeVariant(status: AppointmentStatus) {
  switch (status) {
    case AppointmentStatus.CONFIRMED:
      return "verified" as const;
    case AppointmentStatus.CANCELLED:
      return "outline" as const;
    default:
      return "secondary" as const;
  }
}

export function DentistAppointmentsContent() {
  const { user, isLoading } = useRequireAuth([
    UserRole.PATIENT,
    UserRole.DOCTOR,
  ]);
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState<MockAppointment[]>([]);
  const [filter, setFilter] = useState<AppointmentStatus | "all">("all");
  const [mounted, setMounted] = useState(false);

  const isDoctor = user?.role === UserRole.DOCTOR;

  const refresh = useCallback(() => {
    if (!user) return;

    if (isDoctor) {
      const profile = user.dentistSlug
        ? dentistProfileService.getMergedProfile(user.dentistSlug)
        : undefined;
      const dentistId = profile?.id;
      setAppointments(
        dentistId
          ? dentistActionsService.getAppointmentsForDentist(dentistId)
          : []
      );
    } else {
      setAppointments(
        [...dentistActionsService.getAppointments()].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    }
  }, [user, isDoctor]);

  useEffect(() => {
    refresh();
    setMounted(true);
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

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const handleStatus = (id: string, status: AppointmentStatus) => {
    dentistActionsService.updateAppointmentStatus(id, status);
    refresh();
    const message =
      status === AppointmentStatus.CONFIRMED
        ? t("dashboard.appointments.confirmedToast")
        : t("dashboard.appointments.cancelledToast");
    showToast(message, "success");
  };

  if (isLoading || !mounted) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-8 h-48 w-full rounded-2xl" />
        </div>
      </PageLayout>
    );
  }

  if (!user) return null;

  const pendingCount = appointments.filter(
    (a) => a.status === AppointmentStatus.PENDING
  ).length;

  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {isDoctor
                ? t("dashboard.doctor.manageAppointments")
                : t("dashboard.patient.myAppointments")}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isDoctor
                ? t("dashboard.doctor.manageAppointmentsSubtitle")
                : t("dashboard.patient.appointmentsSubtitle")}
            </p>
          </div>
          {isDoctor && pendingCount > 0 && (
            <Badge variant="secondary">
              {t("dashboard.appointments.pendingCount", { count: pendingCount })}
            </Badge>
          )}
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {(["all", AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED] as const).map(
            (value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  filter === value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {value === "all"
                  ? t("dashboard.appointments.all")
                  : t(statusLabelKey[value])}
              </button>
            )
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="text-muted-foreground">
              {t("dashboard.appointments.empty")}
            </p>
            {!isDoctor && (
              <Link href="/discover" className="mt-4 inline-block">
                <Button>{t("dashboard.patient.browse")}</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((apt) => (
              <div
                key={apt.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-soft"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">
                        {isDoctor ? apt.patientName ?? t("dashboard.appointments.guestPatient") : apt.dentistName}
                      </p>
                      <Badge variant={statusBadgeVariant(apt.status)}>
                        {t(statusLabelKey[apt.status])}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
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

                  <div className="flex flex-wrap gap-2">
                    {isDoctor && apt.status === AppointmentStatus.PENDING && (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatus(apt.id, AppointmentStatus.CONFIRMED)
                          }
                        >
                          <Check className="mr-1.5 h-3.5 w-3.5" />
                          {t("dashboard.appointments.confirm")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatus(apt.id, AppointmentStatus.CANCELLED)
                          }
                        >
                          <X className="mr-1.5 h-3.5 w-3.5" />
                          {t("dashboard.appointments.cancel")}
                        </Button>
                      </>
                    )}
                    {!isDoctor &&
                      apt.status !== AppointmentStatus.CANCELLED && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatus(apt.id, AppointmentStatus.CANCELLED)
                          }
                        >
                          <X className="mr-1.5 h-3.5 w-3.5" />
                          {t("dashboard.appointments.cancel")}
                        </Button>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link href="/dashboard">
            <Button variant="secondary">{t("dashboard.title")}</Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
