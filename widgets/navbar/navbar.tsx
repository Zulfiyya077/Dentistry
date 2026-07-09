"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/locale-provider";
import { Button } from "@/shared/ui/button";
import { LanguageSwitcher } from "@/widgets/language-switcher/language-switcher";
import { UserRole } from "@/types/enums";
import { cn } from "@/lib/utils";

const NAV_HREFS = [
  { href: "/discover", key: "nav.discover" as const },
  { href: "/categories", key: "nav.categories" as const },
  { href: "/pricing", key: "nav.pricing" as const },
  { href: "/about", key: "nav.about" as const },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-sm">
      <nav>
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-xs font-bold tracking-wider text-primary-foreground">
                DR
              </span>
            </div>
            <span className="text-base font-semibold tracking-tight">
              {t("common.appName")}
            </span>
          </Link>

          <div className="hidden flex-1 items-center justify-center px-8 md:flex">
            <input
              type="search"
              placeholder={t("nav.searchPlaceholder")}
              className="h-9 w-full max-w-md rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_HREFS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher className="hidden sm:flex" />

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden h-9 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:block"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>

            {isAuthenticated && user ? (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm transition-colors hover:bg-muted"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                    {user.displayName.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate font-medium">
                    {user.displayName.split(" ")[0]}
                  </span>
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 z-50 mt-2 w-52 rounded-md border border-border bg-card py-1 shadow-elevated">
                      <div className="border-b border-border px-4 py-2.5">
                        <p className="truncate text-sm font-medium">
                          {user.displayName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm hover:bg-muted"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {t("auth.dashboard")}
                      </Link>
                      {user.role === UserRole.DOCTOR && user.dentistSlug && (
                        <Link
                          href={`/dentists/${user.dentistSlug}`}
                          className="block px-4 py-2 text-sm hover:bg-muted"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {t("auth.myProfile")}
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-destructive hover:bg-muted"
                      >
                        {t("auth.logout")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    {t("common.signIn")}
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">{t("common.getStarted")}</Button>
                </Link>
              </div>
            )}

            <button
              className="rounded-md px-2 py-1 text-sm md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden border-t border-border md:hidden",
            mobileOpen ? "max-h-[32rem]" : "max-h-0"
          )}
        >
          <div className="space-y-1 px-4 py-4">
            <div className="mb-3 sm:hidden">
              <LanguageSwitcher />
            </div>
            {NAV_HREFS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                {t(link.key)}
              </Link>
            ))}
            {isAuthenticated && user ? (
              <div className="space-y-1 pt-2">
                <Link
                  href="/dashboard"
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("auth.dashboard")}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-muted"
                >
                  {t("auth.logout")}
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link href="/auth/login" className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    {t("common.signIn")}
                  </Button>
                </Link>
                <Link href="/auth/register" className="flex-1">
                  <Button size="sm" className="w-full">
                    {t("common.getStarted")}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
