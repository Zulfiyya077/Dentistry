"use client";

import { GraduationCap, ScrollText, ShieldCheck } from "lucide-react";
import type { MockDentist } from "@/features/dentist/data/mock-dentists";
import { resolveLocalized } from "@/lib/i18n/types";
import { useTranslation } from "@/providers/locale-provider";

interface DentistCredentialsSectionProps {
  dentist: MockDentist;
}

export function DentistCredentialsSection({
  dentist,
}: DentistCredentialsSectionProps) {
  const { locale, t } = useTranslation();

  return (
    <div className="space-y-10">
      {/* Education */}
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <GraduationCap className="h-5 w-5 text-primary" />
          {t("profile.education")}
        </h3>
        {dentist.education.length === 0 ? (
          <EmptyMessage message={t("profile.noEducation")} />
        ) : (
          <div className="space-y-4">
            {dentist.education.map((edu) => (
              <div
                key={edu.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <p className="font-semibold">
                  {resolveLocalized(edu.degree, locale)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {resolveLocalized(edu.field, locale)}
                </p>
                <p className="mt-1 text-sm">
                  {resolveLocalized(edu.institution, locale)}
                </p>
                <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                  <span>{edu.year}</span>
                  <span>•</span>
                  <span>{resolveLocalized(edu.country, locale)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Diplomas */}
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <ScrollText className="h-5 w-5 text-primary" />
          {t("profile.diplomas")}
        </h3>
        {dentist.diplomas.length === 0 ? (
          <EmptyMessage message={t("profile.noDiplomas")} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {dentist.diplomas.map((dip) => (
              <div
                key={dip.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <p className="font-semibold">
                  {resolveLocalized(dip.title, locale)}
                </p>
                <p className="text-sm text-primary">
                  {resolveLocalized(dip.degree, locale)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {resolveLocalized(dip.institution, locale)}
                </p>
                <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                  <span>{dip.year}</span>
                  <span>•</span>
                  <span>{resolveLocalized(dip.country, locale)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Certificates */}
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <ShieldCheck className="h-5 w-5 text-primary" />
          {t("profile.certificates")}
        </h3>
        {dentist.certificates.length === 0 ? (
          <EmptyMessage message={t("profile.noCertificates")} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {dentist.certificates.map((cert) => (
              <div
                key={cert.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <p className="font-semibold">
                  {resolveLocalized(cert.title, locale)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {resolveLocalized(cert.issuer, locale)}
                </p>
                <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                  <span>{cert.year}</span>
                  {cert.credentialId && (
                    <>
                      <span>•</span>
                      <span>ID: {cert.credentialId}</span>
                    </>
                  )}
                </div>
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
    <div className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
