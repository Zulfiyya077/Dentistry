"use client";

import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "@/providers/locale-provider";
import { Button } from "@/shared/ui/button";
import { showToast } from "@/lib/toast";
import { StaticPageLayout } from "./static-page-layout";

export function ContactPageContent() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);
    showToast(t("pages.contact.success"), "success");
    (e.target as HTMLFormElement).reset();
  };

  const contactInfo = [
    {
      icon: Mail,
      label: t("pages.contact.email"),
      value: "info@dentistry.az",
    },
    {
      icon: Phone,
      label: t("pages.contact.phone"),
      value: "+994 12 345 67 89",
    },
    {
      icon: MapPin,
      label: t("pages.contact.address"),
      value: t("pages.contact.addressValue"),
    },
  ];

  return (
    <StaticPageLayout
      title={t("pages.contact.title")}
      subtitle={t("pages.contact.subtitle")}
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          {contactInfo.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-1 font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          <h3 className="font-semibold">{t("pages.contact.formTitle")}</h3>
          <input
            className="auth-input w-full"
            placeholder={t("pages.contact.name")}
            required
          />
          <input
            type="email"
            className="auth-input w-full"
            placeholder={t("pages.contact.emailPlaceholder")}
            required
          />
          <textarea
            className="auth-input min-h-32 w-full resize-y"
            placeholder={t("pages.contact.message")}
            required
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("pages.contact.sending") : t("pages.contact.send")}
          </Button>
        </form>
      </div>
    </StaticPageLayout>
  );
}
