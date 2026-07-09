"use client";

import {
  Award,
  Facebook,
  Globe,
  Instagram,
  Languages,
  Linkedin,
  MessageCircle,
  Youtube,
} from "lucide-react";
import type { MockDentist } from "@/features/dentist/data/mock-dentists";
import { resolveLocalized } from "@/lib/i18n/types";
import { useTranslation } from "@/providers/locale-provider";

interface DentistAboutSectionProps {
  dentist: MockDentist;
}

export function DentistAboutSection({ dentist }: DentistAboutSectionProps) {
  const { locale, t } = useTranslation();
  const { socialLinks } = dentist;

  const socialItems = [
    { key: "website", icon: Globe, label: t("profile.website"), href: socialLinks.website },
    { key: "instagram", icon: Instagram, label: t("profile.instagram"), href: socialLinks.instagram },
    { key: "facebook", icon: Facebook, label: t("profile.facebook"), href: socialLinks.facebook },
    { key: "linkedin", icon: Linkedin, label: t("profile.linkedin"), href: socialLinks.linkedin },
    { key: "youtube", icon: Youtube, label: t("profile.youtube"), href: socialLinks.youtube },
    { key: "whatsapp", icon: MessageCircle, label: t("profile.whatsapp"), href: socialLinks.whatsapp ? `https://wa.me/${socialLinks.whatsapp.replace(/\D/g, "")}` : undefined },
  ].filter((s) => s.href);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <section>
          <h3 className="text-lg font-semibold">{t("profile.biography")}</h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {resolveLocalized(dentist.biography, locale)}
          </p>
        </section>

        {dentist.services.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold">{t("profile.services")}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {dentist.services.map((service, i) => (
                <span
                  key={i}
                  className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm"
                >
                  {resolveLocalized(service, locale)}
                </span>
              ))}
            </div>
          </section>
        )}

        {dentist.experience.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold">{t("profile.experience")}</h3>
            <div className="mt-4 space-y-4">
              {dentist.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="relative border-l-2 border-primary/30 pl-6"
                >
                  <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                  <p className="font-medium">
                    {resolveLocalized(exp.role, locale)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {resolveLocalized(exp.organization, locale)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {resolveLocalized(exp.period, locale)}
                  </p>
                  {exp.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {resolveLocalized(exp.description, locale)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {dentist.awards.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold">{t("profile.awards")}</h3>
            <ul className="mt-4 space-y-2">
              {dentist.awards.map((award, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Award className="h-4 w-4 shrink-0 text-warning" />
                  {resolveLocalized(award, locale)}
                </li>
              ))}
            </ul>
          </section>
        )}

        {dentist.associations.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold">{t("profile.associations")}</h3>
            <ul className="mt-4 space-y-2">
              {dentist.associations.map((assoc, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  • {resolveLocalized(assoc, locale)}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <aside className="space-y-4">
        <InfoCard
          icon={Languages}
          label={t("common.languages")}
          value={dentist.languages
            .map((l) => resolveLocalized(l, locale))
            .join(", ")}
        />
        <InfoCard
          label={t("common.priceRange")}
          value={dentist.priceRange}
        />
        <InfoCard
          label={t("profile.licenseNumber")}
          value={dentist.licenseNumber}
        />

        {socialItems.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h4 className="font-semibold">{t("profile.socialNetworks")}</h4>
            <ul className="mt-3 space-y-2">
              {socialItems.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </div>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
