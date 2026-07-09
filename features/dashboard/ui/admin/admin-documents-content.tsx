"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  credentialDocumentsService,
  type CredentialDocument,
} from "@/features/dentist/services/credential-documents.service";
import { useTranslation } from "@/providers/locale-provider";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { showToast } from "@/lib/toast";
import {
  CredentialDocumentType,
  VerificationStatus,
} from "@/types/enums";
import type { TranslationKey } from "@/lib/i18n";

const typeLabelKey: Record<CredentialDocumentType, TranslationKey> = {
  [CredentialDocumentType.DIPLOMA]: "credentials.types.diploma",
  [CredentialDocumentType.MEDICAL_LICENSE]: "credentials.types.license",
  [CredentialDocumentType.SPECIALIZATION_CERT]: "credentials.types.certificate",
};

const statusLabelKey: Record<VerificationStatus, TranslationKey> = {
  [VerificationStatus.PENDING]: "dashboard.admin.verifications.pending",
  [VerificationStatus.APPROVED]: "dashboard.admin.verifications.approved",
  [VerificationStatus.REJECTED]: "dashboard.admin.verifications.rejected",
};

export function AdminDocumentsContent() {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<CredentialDocument[]>([]);
  const [filter, setFilter] = useState<VerificationStatus | "all">("all");
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    credentialDocumentsService.seedDemoDocuments();
    setDocuments(credentialDocumentsService.getAll());
  }, []);

  useEffect(() => {
    refresh();
    setMounted(true);
  }, [refresh]);

  const filtered =
    filter === "all"
      ? documents
      : documents.filter((d) => d.status === filter);

  const pendingCount = documents.filter(
    (d) => d.status === VerificationStatus.PENDING
  ).length;

  const handleDecision = (doc: CredentialDocument, status: VerificationStatus) => {
    credentialDocumentsService.setStatus(doc.id, status);
    refresh();
    showToast(
      status === VerificationStatus.APPROVED
        ? t("credentials.approvedToast")
        : t("credentials.rejectedToast"),
      "success"
    );
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {t("dashboard.admin.documents.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dashboard.admin.documents.subtitle")}
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="secondary">
            {t("dashboard.admin.documents.pendingCount", { count: pendingCount })}
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
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
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

      {filtered.length === 0 ? (
        <div className="rounded-md border border-dashed border-border py-12 text-center">
          <p className="text-muted-foreground">
            {t("dashboard.admin.documents.empty")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="surface-card rounded-md p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{doc.dentistName}</h3>
                    <Badge
                      variant={
                        doc.status === VerificationStatus.APPROVED
                          ? "document"
                          : "secondary"
                      }
                    >
                      {t(statusLabelKey[doc.status])}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{doc.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {t(typeLabelKey[doc.type])} · {doc.fileName}
                  </p>

                  {doc.fileData && doc.mimeType.startsWith("image/") && (
                    <div className="overflow-hidden rounded-md border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={doc.fileData}
                        alt={doc.title}
                        className="max-h-64 w-full object-contain bg-muted"
                      />
                    </div>
                  )}

                  {doc.fileData && doc.mimeType === "application/pdf" && (
                    <a
                      href={doc.fileData}
                      download={doc.fileName}
                      className="text-sm text-primary underline"
                    >
                      {t("dashboard.admin.documents.downloadPdf")}
                    </a>
                  )}

                  {!doc.fileData && (
                    <p className="text-xs text-muted-foreground">
                      {t("dashboard.admin.documents.demoNoFile")}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href={`/dentists/${doc.dentistSlug}`}>
                    <Button variant="outline" size="sm">
                      {t("dashboard.admin.verifications.viewProfile")}
                    </Button>
                  </Link>
                  {doc.status === VerificationStatus.PENDING && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleDecision(doc, VerificationStatus.APPROVED)
                        }
                      >
                        {t("dashboard.admin.verifications.approve")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleDecision(doc, VerificationStatus.REJECTED)
                        }
                      >
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
