"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "@/providers/locale-provider";
import { Button } from "@/shared/ui/button";

export function HeroSection() {
  const { t } = useTranslation();

  const stats = [
    { value: "320+", label: t("hero.stats.verified") },
    { value: "12,000+", label: t("hero.stats.reviews") },
    { value: "85K+", label: t("hero.stats.patients") },
  ];

  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <p className="section-label">{t("hero.badge")}</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight sm:text-5xl">
            {t("hero.title")}{" "}
            <span className="text-secondary">{t("hero.titleHighlight")}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t("hero.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              placeholder={t("hero.searchPlaceholder")}
              className="h-11 flex-1 rounded-md border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
            />
            <Link href="/discover">
              <Button size="lg" className="h-11 w-full sm:w-auto">
                {t("common.discover")}
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-6 border-t border-border pt-10 sm:grid-cols-3"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
