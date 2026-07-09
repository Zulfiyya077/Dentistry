"use client";

import type { MockDentist } from "@/features/dentist/data/mock-dentists";
import {
  credentialDocumentsService,
  type CredentialDocument,
} from "@/features/dentist/services/credential-documents.service";
import { resolveLocalized } from "@/lib/i18n/types";
import { useTranslation } from "@/providers/locale-provider";
import { Badge } from "@/shared/ui/badge";
import { useEffect, useState } from "react";
import type { TranslationKey } from "@/lib/i18n";
import { CredentialDocumentType } from "@/types/enums";

interface DentistCredentialsSectionProps {
  dentist: MockDentist;
}

const typeLabelKey: Record<CredentialDocumentType, TranslationKey> = {
  [CredentialDocumentType.DIPLOMA]: "credentials.types.diploma",
  [CredentialDocumentType.MEDICAL_LICENSE]: "credentials.types.license",
  [CredentialDocumentType.SPECIALIZATION_CERT]: "credentials.types.certificate",
};

export function DentistCredentialsSection({
  dentist,
}: DentistCredentialsSectionProps) {
  const { locale, t } = useTranslation();
  const [verifiedDocs, setVerifiedDocs] = useState<CredentialDocument[]>([]);

  useEffect(() => {
    setVerifiedDocs(
      credentialDocumentsService.getApprovedForDentist(dentist.slug)
    );
  }, [dentist.slug]);

  const documentVerified = credentialDocumentsService.isDocumentVerified(
    dentist.slug
  );

  return (
    <div className="space-y-10">
      {documentVerified && (
        <div className="rounded-md border border-secondary/25 bg-secondary/5 p-5">
          <Badge variant="document">{t("credentials.documentVerified")}</Badge>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t("credentials.verifiedDescription")}
          </p>
        </div>
      )}

      {verifiedDocs.length > 0 && (
        <section>
          <h3 className="section-label">{t("credentials.verifiedDocuments")}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {verifiedDocs.map((doc) => (
              <div
                key={doc.id}
                className="surface-card rounded-md p-5"
              >
                <p className="font-semibold">{doc.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t(typeLabelKey[doc.type])}
                </p>
                {doc.fileData && doc.mimeType.startsWith("image/") && (
                  <div className="mt-3 overflow-hidden rounded-md border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={doc.fileData}
                      alt={doc.title}
                      className="max-h-48 w-full object-contain bg-muted"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="section-label">{t("profile.education")}</h3>
        {dentist.education.length === 0 ? (
          <EmptyMessage message={t("profile.noEducation")} />
        ) : (
          <div className="mt-4 space-y-3">
            {dentist.education.map((edu) => (
              <div key={edu.id} className="surface-card rounded-md p-5">
                <p className="font-semibold">
                  {resolveLocalized(edu.degree, locale)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {resolveLocalized(edu.field, locale)}
                </p>
                <p className="mt-1 text-sm">
                  {resolveLocalized(edu.institution, locale)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {edu.year} · {resolveLocalized(edu.country, locale)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="section-label">{t("profile.diplomas")}</h3>
        {dentist.diplomas.length === 0 ? (
          <EmptyMessage message={t("profile.noDiplomas")} />
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {dentist.diplomas.map((dip) => (
              <div key={dip.id} className="surface-card rounded-md p-5">
                <p className="font-semibold">
                  {resolveLocalized(dip.title, locale)}
                </p>
                <p className="text-sm text-secondary">
                  {resolveLocalized(dip.degree, locale)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {resolveLocalized(dip.institution, locale)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {dip.year} · {resolveLocalized(dip.country, locale)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="section-label">{t("profile.certificates")}</h3>
        {dentist.certificates.length === 0 ? (
          <EmptyMessage message={t("profile.noCertificates")} />
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {dentist.certificates.map((cert) => (
              <div key={cert.id} className="surface-card rounded-md p-5">
                <p className="font-semibold">
                  {resolveLocalized(cert.title, locale)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {resolveLocalized(cert.issuer, locale)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {cert.year}
                  {cert.credentialId && ` · ID: ${cert.credentialId}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyMessage({ message }: { message: string }) {
  return (
    <div className="mt-4 rounded-md border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
