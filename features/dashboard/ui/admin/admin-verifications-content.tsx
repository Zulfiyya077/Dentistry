"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Check, ExternalLink, X } from "lucide-react";
import {
  adminService,
  type VerificationRequest,
} from "@/features/dashboard/services/admin.service";
import { useTranslation } from "@/providers/locale-provider";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { showToast } from "@/lib/toast";
import { VerificationStatus } from "@/types/enums";
import type { TranslationKey } from "@/lib/i18n";

function statusBadgeVariant(status: VerificationStatus) {
  switch (status) {
    case VerificationStatus.APPROVED:
      return "verified" as const;
    case VerificationStatus.REJECTED:
      return "outline" as const;
    default:
      return "secondary" as const;
  }
}

const statusLabelKey: Record<VerificationStatus, TranslationKey> = {
  [VerificationStatus.PENDING]: "dashboard.admin.verifications.pending",
  [VerificationStatus.APPROVED]: "dashboard.admin.verifications.approved",
  [VerificationStatus.REJECTED]: "dashboard.admin.verifications.rejected",
};

export function AdminVerificationsContent() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [filter, setFilter] = useState<VerificationStatus | "all">("all");
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    adminService.seedDemoPendingVerifications();
    setRequests(adminService.getVerificationRequests());
  }, []);

  useEffect(() => {
    refresh();
    setMounted(true);
  }, [refresh]);

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((r) => r.status === filter);

  const pendingCount = requests.filter(
    (r) => r.status === VerificationStatus.PENDING
  ).length;

  const handleDecision = (
    request: VerificationRequest,
    status: VerificationStatus
  ) => {
    adminService.setVerificationStatus(request.dentistSlug, status);
    refresh();
    showToast(
      status === VerificationStatus.APPROVED
        ? t("dashboard.admin.verifications.approvedToast")
        : t("dashboard.admin.verifications.rejectedToast"),
      "success"
    );
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {t("dashboard.admin.verifications.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dashboard.admin.verifications.subtitle")}
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="secondary">
            {t("dashboard.admin.verifications.pendingCount", {
              count: pendingCount,
            })}
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", VerificationStatus.PENDING, VerificationStatus.APPROVED, VerificationStatus.REJECTED] as const).map(
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
                ? t("dashboard.admin.verifications.all")
                : t(statusLabelKey[value])}
            </button>
          )
        )}
      </div>

      {filteredRequests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-12 text-center">
          <p className="text-muted-foreground">
            {t("dashboard.admin.verifications.empty")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{request.dentistName}</h3>
                    <Badge variant={statusBadgeVariant(request.status)}>
                      {t(statusLabelKey[request.status])}
                    </Badge>
                    {request.isRegisteredOnly && (
                      <Badge variant="outline">
                        {t("dashboard.admin.verifications.newRegistration")}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>{request.email}</span>
                    {request.city !== "—" && <span>{request.city}</span>}
                    {request.specialization !== "—" && (
                      <span>{request.specialization}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {!request.isRegisteredOnly && (
                    <Link href={`/dentists/${request.dentistSlug}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        {t("dashboard.admin.verifications.viewProfile")}
                      </Button>
                    </Link>
                  )}
                  {request.status === VerificationStatus.PENDING && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleDecision(
                            request,
                            VerificationStatus.APPROVED
                          )
                        }
                      >
                        <Check className="mr-1.5 h-3.5 w-3.5" />
                        {t("dashboard.admin.verifications.approve")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleDecision(
                            request,
                            VerificationStatus.REJECTED
                          )
                        }
                      >
                        <X className="mr-1.5 h-3.5 w-3.5" />
                        {t("dashboard.admin.verifications.reject")}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
