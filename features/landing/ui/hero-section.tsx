"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, Shield, Star, Users } from "lucide-react";
import { useTranslation } from "@/providers/locale-provider";
import { Button } from "@/shared/ui/button";

export function HeroSection() {
  const { t } = useTranslation();

  const stats = [
    { value: "320+", label: t("hero.stats.verified"), icon: Shield },
    { value: "12,000+", label: t("hero.stats.reviews"), icon: Star },
    { value: "85K+", label: t("hero.stats.patients"), icon: Users },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 text-sm font-medium text-primary">
            {t("hero.badge")}
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t("hero.title")}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("hero.titleHighlight")}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t("hero.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder={t("hero.searchPlaceholder")}
                className="h-14 w-full rounded-2xl border border-border bg-card pl-12 pr-4 text-base shadow-card outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Link href="/discover">
              <Button size="lg" className="h-14 w-full px-8 sm:w-auto">
                {t("common.discover")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                className="text-2xl font-bold"
              >
                {stat.value}
              </motion.p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
