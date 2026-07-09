/**
 * Application-wide configuration (non-i18n constants)
 */
export const APP_CONFIG = {
  name: "Dentistry",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  defaultLocale: "az" as const,
  supportedLocales: ["az", "en"] as const,
} as const;

export const NAV_HREFS = [
  { href: "/discover", key: "nav.discover" },
  { href: "/categories", key: "nav.categories" },
  { href: "/pricing", key: "nav.pricing" },
  { href: "/about", key: "nav.about" },
] as const;
