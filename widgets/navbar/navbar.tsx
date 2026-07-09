"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  X,
} from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full">
      <nav className="glass border-b border-border/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
              <span className="text-sm font-bold text-white">D</span>
            </div>
            <span className="text-lg font-bold tracking-tight">
              {t("common.appName")}
            </span>
          </Link>

          <div className="hidden flex-1 items-center justify-center px-8 md:flex">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder={t("nav.searchPlaceholder")}
                className="h-10 w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_HREFS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher className="hidden sm:flex" />

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>

            {isAuthenticated && user ? (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:bg-muted"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
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
                    <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-border bg-card py-2 shadow-elevated">
                      <div className="border-b border-border px-4 py-2">
                        <p className="truncate text-sm font-medium">{user.displayName}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {t("auth.dashboard")}
                      </Link>
                      {user.role === UserRole.DOCTOR && user.dentistSlug && (
                        <Link
                          href={`/dentists/${user.dentistSlug}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          {t("auth.myProfile")}
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted"
                      >
                        <LogOut className="h-4 w-4" />
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
              className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden border-t border-border/50 md:hidden",
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
                className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                {t(link.key)}
              </Link>
            ))}
            {isAuthenticated && user ? (
              <div className="space-y-1 pt-2">
                <Link
                  href="/dashboard"
                  className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
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
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-muted"
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
