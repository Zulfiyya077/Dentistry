"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  credentialDocumentsService,
  type CredentialDocument,
} from "@/features/dentist/services/credential-documents.service";
import { useRequireAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/locale-provider";
import { PageLayout } from "@/widgets/page-layout/page-layout";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { showToast } from "@/lib/toast";
import {
  CredentialDocumentType,
  UserRole,
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

export function DentistCredentialsUploadContent() {
  const { user, isLoading } = useRequireAuth([UserRole.DOCTOR]);
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<CredentialDocument[]>([]);
  const [mounted, setMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [type, setType] = useState<CredentialDocumentType>(
    CredentialDocumentType.DIPLOMA
  );
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const refresh = useCallback(() => {
    if (!user?.dentistSlug) return;
    setDocuments(credentialDocumentsService.getForDentist(user.dentistSlug));
  }, [user?.dentistSlug]);

  useEffect(() => {
    refresh();
    setMounted(true);
  }, [refresh]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.dentistSlug || !file || !title.trim()) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      credentialDocumentsService.upload({
        dentistSlug: user.dentistSlug,
        dentistName: user.displayName,
        type,
        title: title.trim(),
        fileName: file.name,
        mimeType: file.type,
        fileData: dataUrl,
      });

      setTitle("");
      setFile(null);
      refresh();
      showToast(t("credentials.uploadSuccess"), "success");
    } catch {
      showToast(t("credentials.uploadError"), "error");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading || !mounted) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-8 h-64 w-full rounded-md" />
        </div>
      </PageLayout>
    );
  }

  if (!user?.dentistSlug) return null;

  const isVerified = credentialDocumentsService.isDocumentVerified(
    user.dentistSlug
  );

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8">
          <p className="section-label">{t("credentials.sectionLabel")}</p>
          <h1 className="mt-2 text-3xl font-semibold">
            {t("credentials.uploadTitle")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("credentials.uploadSubtitle")}
          </p>
          {isVerified && (
            <div className="mt-4">
              <Badge variant="document">{t("credentials.documentVerified")}</Badge>
            </div>
          )}
        </div>

        <form
          onSubmit={handleUpload}
          className="surface-card space-y-5 rounded-md p-6"
        >
          <h2 className="text-lg font-semibold">{t("credentials.newUpload")}</h2>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium">{t("credentials.docType")}</span>
            <select
              className="filter-select"
              value={type}
              onChange={(e) =>
                setType(e.target.value as CredentialDocumentType)
              }
            >
              {Object.values(CredentialDocumentType).map((docType) => (
                <option key={docType} value={docType}>
                  {t(typeLabelKey[docType])}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium">{t("credentials.docTitle")}</span>
            <input
              className="auth-input w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("credentials.docTitlePlaceholder")}
              required
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium">{t("credentials.file")}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="auth-input w-full file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
            />
            <p className="text-xs text-muted-foreground">
              {t("credentials.fileHint")}
            </p>
          </label>

          <Button type="submit" disabled={uploading || !file}>
            {uploading ? t("credentials.uploading") : t("credentials.submit")}
          </Button>
        </form>

        <section className="mt-10">
          <h2 className="text-lg font-semibold">{t("credentials.myDocuments")}</h2>
          {documents.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {t("credentials.noDocuments")}
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="surface-card flex flex-wrap items-center justify-between gap-3 rounded-md p-4"
                >
                  <div>
                    <p className="font-medium">{doc.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {t(typeLabelKey[doc.type])} · {doc.fileName}
                    </p>
                  </div>
                  <Badge
                    variant={
                      doc.status === VerificationStatus.APPROVED
                        ? "document"
                        : doc.status === VerificationStatus.REJECTED
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {t(statusLabelKey[doc.status])}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-8">
          <Link href="/dashboard">
            <Button variant="secondary">{t("dashboard.title")}</Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
