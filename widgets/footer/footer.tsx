"use client";

import Link from "next/link";
import { useTranslation } from "@/providers/locale-provider";

export function Footer() {
  const { t } = useTranslation();

  const footerLinks = {
    product: [
      { href: "/discover", label: t("footer.discoverDentists") },
      { href: "/categories", label: t("footer.specialities") },
      { href: "/pricing", label: t("footer.pricing") },
    ],
    company: [
      { href: "/about", label: t("footer.about") },
      { href: "/contact", label: t("footer.contact") },
      { href: "/faq", label: t("footer.faq") },
    ],
    legal: [
      { href: "/privacy", label: t("footer.privacy") },
      { href: "/terms", label: t("footer.terms") },
    ],
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
                <span className="text-sm font-bold text-white">D</span>
              </div>
              <span className="text-lg font-bold">{t("common.appName")}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("common.tagline")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t("footer.product")}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t("footer.company")}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t("footer.legal")}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {t("common.appName")}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
